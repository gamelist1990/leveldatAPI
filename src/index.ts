import fs from "fs";
import path from "path";
import zlib from "zlib";
import * as nbt from "prismarine-nbt";
import { LevelDatKey, PathResult } from "./Types";

const DEFAULT_LEVEL_PATH = path.resolve(process.cwd(), "level.dat");

/**
 * LevelDatManager のオプション型
 *
 * @property createBackup - バックアップの作成方法。true で上書き可能な単一の .bak を作成、
 *                           'timestamp' でタイムスタンプ付きバックアップを作成、false で無効。
 * @property jsonPath - createJson 有効時に JSON スナップショットを書き出すパス（null でデフォルト）
 * @property createJson - load()/saveDat() の後に JSON スナップショットを作成するかどうか
 */
export type LevelDatManagerOptions = {
  createBackup?: boolean | "timestamp";
  jsonPath?: string | null;
  createJson?: boolean;
};

/**
 * level.dat を読み書きして扱うユーティリティクラス。
 *
 * 使い方の例:
 * const mgr = new LevelDatManager();
 * await mgr.load();
 * console.log(mgr.get('LevelName'));
 */
export class LevelDatManager {
  private levelPath: string;
  private root: Record<string, any> = {};
  private onChange?: (root: Record<string, any>) => void;
  private options: Required<LevelDatManagerOptions>;
  private lastLoadOk: boolean = false;
  private _parsedTag: any = undefined;
  private _compression: "gzip" | "deflate" | "none" = "none";

  /**
   * コンストラクタ
   * @param levelPath - level.dat ファイルのパス（省略時はカレントワークディレクトリの level.dat）
   * @param options - 挙動を制御するオプション
   */
  constructor(levelPath?: string, options?: LevelDatManagerOptions) {
    this.levelPath = levelPath ? path.resolve(levelPath) : DEFAULT_LEVEL_PATH;
    const defaults: Required<LevelDatManagerOptions> = {
      createBackup: false,
      jsonPath: null,
      createJson: false,
    } as Required<LevelDatManagerOptions>;
    this.options = Object.assign({}, defaults, options ?? {});
  }

  /**
   * level.dat を読み込み、内部の root オブジェクトに NBT を簡略化したデータを格納します。
   * 圧縮 (gzip/deflate) を自動検出します。
   * @throws ファイルが存在しない、またはパースに失敗した場合に例外を投げます。
   */
  async load(): Promise<void> {
    if (!fs.existsSync(this.levelPath))
      throw new Error(`level.dat not found at ${this.levelPath}`);
    const raw = fs.readFileSync(this.levelPath);

    let decompressed: Buffer;
    try {
      decompressed = zlib.gunzipSync(raw);
      this._compression = "gzip";
    } catch (e1) {
      try {
        decompressed = zlib.inflateSync(raw);
        this._compression = "deflate";
      } catch (e2) {
        decompressed = raw;
        this._compression = "none";
      }
    }

    const parsedWrap = await nbt
      .parse(decompressed as Buffer)
      .catch((e: any) => {
        console.error("nbt.parse failed:", e);
        return undefined as any;
      });

    const parsedTag = parsedWrap ? parsedWrap.parsed ?? parsedWrap : undefined;
    let simplified: Record<string, any> | undefined;
    try {
      simplified = parsedTag
        ? (nbt.simplify(parsedTag) as Record<string, any>)
        : undefined;
    } catch (e) {
      console.error("nbt.simplify failed:", e);
      simplified = undefined;
    }

    if (
      !simplified ||
      typeof simplified !== "object" ||
      Object.keys(simplified).length === 0
    ) {
      this.lastLoadOk = false;
      const msg = `Failed to parse level.dat or parsed root empty (${this.levelPath})`;
      console.error(msg);
      throw new Error(msg);
    }

    this._parsedTag = parsedTag;
    this.root = simplified;
    this.lastLoadOk = true;
    // Optionally write a JSON snapshot immediately after loading
    try {
      if (this.options.createJson && this.options.jsonPath)
        this.createJson(this.options.jsonPath);
    } catch (e) {
      console.warn("createJson after load failed:", e);
    }
  }

  /**
   * 現在の root を JSON として書き出します。
   * @param outPath - 出力パス（省略時は ./level.dat.json）
   */
  createJson(outPath?: string) {
    const out = outPath
      ? path.resolve(outPath)
      : path.resolve(process.cwd(), "level.dat.json");
    if (!this.root || Object.keys(this.root).length === 0) {
      throw new Error("No parsed root available. Call load() first.");
    }
    fs.writeFileSync(out, JSON.stringify(this.root, null, 2));
  }

  /**
   * createJson のラッパー（互換性維持用）
   * @param outPath - 出力パス
   */
  saveJson(outPath?: string) {
    this.createJson(outPath);
  }

  // onChange removed; use direct saveDat() calls instead

  /**
   * ルートオブジェクトのトップレベルキー一覧を返します。
   */
  keys(): string[] {
    return Object.keys(this.root);
  }

  /**
   * 指定パスに値が存在するかを返します（大文字小文字は区別しません）。
   * @param pathStr - ドット区切りのパス（例: "Data.LevelName"）
   */
  has(pathStr: string): boolean {
    return this._get(pathStr) !== undefined;
  }

  /**
   * 指定パスの値を取得します。存在しない場合は defaultValue を返します。
   * 一部の 2-int 配列（高, 低）を結合して Number または文字列で返す正規化を行います。
   * @param pathStr - ドット区切りのパス
   * @param defaultValue - 値が無い場合のデフォルト
   */
  get(pathStr: string, defaultValue?: any): any {
    const v = this._get(pathStr);
    if (v === undefined) return defaultValue;
    //特定の2-int配列（高、低）を数字または文字列に正規化
    try {
      const top = pathStr ? String(pathStr).split(".")[0] : "";
      if (top) {
        const longKeys = new Set<string>([
          String(LevelDatKey.worldStartCount),
          String(LevelDatKey.currentTick),
          String(LevelDatKey.Time),
          String(LevelDatKey.RandomSeed),
          String(LevelDatKey.LastPlayed),
        ]);
        if (
          longKeys.has(top) &&
          Array.isArray(v) &&
          v.length >= 2 &&
          typeof v[0] === "number" &&
          typeof v[1] === "number"
        ) {
          const high = Number(v[0]);
          const low = Number(v[1]);
          const combined = BigInt(high) * (1n << 32n) + BigInt(low >>> 0);
          const abs = combined < 0n ? -combined : combined;
          if (abs <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(combined);
          return combined.toString();
        }
      }
    } catch (e) {}
    return v;
  }

  /**
   * 解析結果の生の root オブジェクトを返します（参照渡し）。
   */
  raw(): Record<string, any> {
    return this.root;
  }

  /**
   * root をディープコピーして JSON 互換のオブジェクトとして返します。
   */
  toJSON(): Record<string, any> {
    return JSON.parse(JSON.stringify(this.root));
  }

  /**
   * root または指定パスのノードを Proxy として取得します。書き込みは内部の root を更新します。
   * node('') でルート全体の Proxy を取得します。
   */
  node(): Record<string, any> | undefined;
  node(path: ""): Record<string, any> | undefined;
  node<P extends `${LevelDatKey}`>(path: P): PathResult<P> | undefined;
  node(path = ""): any {
    const target = path ? this._get(path) : this.root;
    if (target === undefined) return undefined;

    const self = this;

    function createProxy(obj: any, objPath: string) {
      if (obj === null || typeof obj !== "object") {
        return new Proxy(
          { value: obj },
          {
            get(_, prop) {
              if (prop === "value") return obj;
              return (obj as any)[prop];
            },
            set(_, prop, val) {
              if (prop === "value") {
                self._set(objPath, val);
                return true;
              }
              (obj as any)[prop] = val;
              self._set(objPath, obj);
              return true;
            },
          }
        );
      }

      return new Proxy(obj, {
        get(targetObj, prop) {
          if (prop === "__isProxy") return true;
          const v = (targetObj as any)[prop as any];
          if (v === undefined) return undefined;
          if (v === null) return null;
          if (typeof v === "object") {
            const childPath = objPath
              ? `${objPath}.${String(prop)}`
              : String(prop);
            return createProxy(v, childPath);
          }
          return v;
        },
        set(targetObj, prop, val) {
          (targetObj as any)[prop as any] = val;
          const childPath = objPath
            ? `${objPath}.${String(prop)}`
            : String(prop);
          self._set(childPath, val);
          return true;
        },
        deleteProperty(targetObj, prop) {
          if (Object.prototype.hasOwnProperty.call(targetObj, prop as any)) {
            delete (targetObj as any)[prop as any];
            const childPath = objPath
              ? `${objPath}.${String(prop)}`
              : String(prop);
            self._set(childPath, undefined, true);
            return true;
          }
          return false;
        },
      });
    }

    return createProxy(target, path);
  }

  get change(): any {
    return this.node("");
  }
  /**
   * 現在の root を NBT にシリアライズして level.dat に書き戻します。
   * 一時ファイル → 検証パース → 原子的リネーム の手順で安全に保存します。
   * @param outPath - 出力先パス（省略時は読み込んだ level.dat を上書き）
   */
  async saveDat(outPath?: string): Promise<void> {
    const target = outPath ? path.resolve(outPath) : this.levelPath;
    if (!this.lastLoadOk)
      throw new Error("Cannot save: level.dat was not successfully loaded");
    try {
      if (this.options.createBackup && fs.existsSync(target)) {
        const useTimestamp = this.options.createBackup === "timestamp";
        if (useTimestamp) {
          const bak = `${target}.${Date.now()}.bak`;
          fs.copyFileSync(target, bak);
        } else {
          const bak = `${target}.bak`;
          fs.copyFileSync(target, bak);
        }
      }
    } catch (e) {
      console.warn("saveDat: failed to create backup:", e);
    }

    const tmp = `${target}.tmp-${Date.now()}`;
    try {
      const nbtObj = this._parsedTag
        ? this._parsedTag
        : ({ name: "", value: this.root } as any);
      try {
        if (this._parsedTag) {
          this._mergeRootIntoTag(nbtObj, this.root);
        } else {
          nbtObj.value = this.root;
        }
      } catch (merr) {
        console.error("saveDat: failed to merge root into parsedTag:", merr);
      }

      const writeFn =
        (nbt as any).writeUncompressed ||
        (nbt as any).write ||
        (nbt as any).writeSync ||
        (nbt as any).writeUncompressedSync;
      let uncompressed: Buffer;
      if (writeFn) {
        const res = writeFn(nbtObj);
        uncompressed = res instanceof Promise ? await res : res;
      } else {
        throw new Error("prismarine-nbt write function not available");
      }

      if (!Buffer.isBuffer(uncompressed))
        uncompressed = Buffer.from(uncompressed);

      let outBuf: Buffer;
      if (this._compression === "gzip") outBuf = zlib.gzipSync(uncompressed);
      else if (this._compression === "deflate")
        outBuf = zlib.deflateSync(uncompressed);
      else outBuf = uncompressed;

      fs.writeFileSync(tmp, outBuf);

      const tmpBuf = fs.readFileSync(tmp);
      const decompressed =
        this._compression === "none"
          ? tmpBuf
          : this._compression === "gzip"
          ? zlib.gunzipSync(tmpBuf)
          : zlib.inflateSync(tmpBuf);
      const parsedCheck = await nbt
        .parse(decompressed as Buffer)
        .catch(() => undefined as any);
      if (!parsedCheck)
        throw new Error("Verification parse failed after serializing NBT");

      fs.renameSync(tmp, target);
    } catch (err) {
      try {
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      } catch (_) {}
      console.error(
        "saveDat: failed to write level.dat (writing json as fallback):",
        err
      );
      if (this.options.createJson && this.options.jsonPath) {
        try {
          fs.writeFileSync(
            this.options.jsonPath,
            JSON.stringify(this.root, null, 2)
          );
        } catch (jerr) {
          console.error("saveDat: failed to write fallback json:", jerr);
        }
      }
      throw err;
    }
  }

  private _set(pathStr: string, value: any, remove = false) {
    if (!pathStr) return;
    const parts = pathStr.split(".");
    const last = parts.pop() as string;
    let cur: any = this.root;
    for (const p of parts) {
      if (cur[p] == null || typeof cur[p] !== "object") cur[p] = {};
      cur = cur[p];
    }
    if (remove) delete cur[last];
    else cur[last] = value;
    try {
      if (this.onChange) this.onChange(this.root);
    } catch (e) {
      console.error("user onChange threw:", e);
    }
  }

  private _mergeRootIntoTag(tag: any, rootVal: any) {
    if (!tag || typeof tag !== "object") return;
    if (tag.type === "compound" && tag.value && typeof tag.value === "object") {
      for (const key of Object.keys(tag.value)) {
        const child = tag.value[key];
        if (rootVal && Object.prototype.hasOwnProperty.call(rootVal, key)) {
          const rv = rootVal[key];
          if (
            child &&
            typeof child === "object" &&
            (child.type === "compound" || child.type === "list")
          ) {
            this._mergeRootIntoTag(child, rv);
          } else if (child && typeof child === "object") {
            child.value = rv;
          } else {
            tag.value[key] = rv;
          }
        }
      }
    } else if (
      tag.type === "list" &&
      Array.isArray(tag.value) &&
      Array.isArray(rootVal)
    ) {
      for (let i = 0; i < tag.value.length; i++) {
        const child = tag.value[i];
        if (i < rootVal.length) {
          if (
            child &&
            typeof child === "object" &&
            (child.type === "compound" || child.type === "list")
          ) {
            this._mergeRootIntoTag(child, rootVal[i]);
          } else if (child && typeof child === "object") {
            child.value = rootVal[i];
          } else {
            tag.value[i] = rootVal[i];
          }
        }
      }
    }
  }

  private _get(pathStr: string): any {
    if (!pathStr) return undefined;
    const parts = pathStr.split(".");
    let cur: any = this.root;
    for (const p of parts) {
      if (cur == null) return undefined;
      if (Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        const key = Object.keys(cur).find(
          (k) => k.toLowerCase() === p.toLowerCase()
        );
        if (key) cur = cur[key];
        else return undefined;
      }
    }
    return cur;
  }
}

function normalizeTwoIntInObject(root: any): any {
  const longKeys = new Set<string>([
    String(LevelDatKey.worldStartCount),
    String(LevelDatKey.currentTick),
    String(LevelDatKey.Time),
    String(LevelDatKey.RandomSeed),
    String(LevelDatKey.LastPlayed),
  ]);

  function cloneAndNormalize(value: any, keyName?: string): any {
    if (
      keyName &&
      longKeys.has(String(keyName)) &&
      Array.isArray(value) &&
      value.length >= 2 &&
      typeof value[0] === 'number' &&
      typeof value[1] === 'number'
    ) {
      const high = Number(value[0]);
      const low = Number(value[1]);
      const combined = BigInt(high) * (1n << 32n) + BigInt(low >>> 0);
      const abs = combined < 0n ? -combined : combined;
      if (abs <= BigInt(Number.MAX_SAFE_INTEGER)) return Number(combined);
      return combined.toString();
    }

    if (Array.isArray(value)) {
      // 配列要素は要素ごとに正規化（要素自体のキー名は親配列の要素名が無いため undefined）
      return value.map((v) => cloneAndNormalize(v));
    }

    if (value && typeof value === 'object') {
      const o: any = {};
      for (const k of Object.keys(value)) {
        o[k] = cloneAndNormalize(value[k], k);
      }
      return o;
    }

    return value;
  }

  return cloneAndNormalize(root);
}

async function runCliIfRequested(): Promise<void> {
  const argv = process.argv.slice(2);
  if (!argv || argv.length === 0) return;
  const runIndex = argv.indexOf('--run');
  const replaceIndex = argv.indexOf('--replace');
  const use2int = argv.includes('--2int');

  // If neither run nor replace requested, nothing to do
  if (runIndex === -1 && replaceIndex === -1) return;

  // helper to resolve input -> { levelPath, dir }
  function resolveInputToPaths(input: string) {
    let levelPath: string;
    let dir: string;
    try {
      const resolved = path.resolve(input);
      if (fs.existsSync(resolved)) {
        const st = fs.statSync(resolved);
        if (st.isFile()) {
          levelPath = resolved;
          dir = path.dirname(resolved);
        } else {
          dir = resolved;
          levelPath = path.resolve(dir, 'level.dat');
        }
      } else {
        if (String(input).toLowerCase().endsWith('.dat')) {
          levelPath = path.resolve(input);
          dir = path.dirname(levelPath);
        } else {
          dir = path.resolve(input);
          levelPath = path.resolve(dir, 'level.dat');
        }
      }
    } catch (e) {
      dir = path.resolve(input);
      levelPath = path.resolve(dir, 'level.dat');
    }
    return { levelPath, dir };
  }

  // Handle --replace first if present
  if (replaceIndex !== -1) {
    const inputReplace = argv[replaceIndex + 1] || '.';
    // parse --data or --data-file (supports --data '<json>' / --data=<json> / --data-file <path> / --data-file=<path>)
    const dataArgIndex = argv.findIndex((a) => a === '--data' || a.startsWith('--data='));
    const dataFileIndex = argv.findIndex((a) => a === '--data-file' || a.startsWith('--data-file='));
    if (dataArgIndex === -1 && dataFileIndex === -1) {
      console.error('--replace を使う場合は --data または --data-file で置換データを指定してください');
      process.exitCode = 1;
      return;
    }

    let dataStr: string | undefined;
    if (dataArgIndex !== -1) {
      if (argv[dataArgIndex].startsWith('--data=')) dataStr = argv[dataArgIndex].substring('--data='.length);
      else dataStr = argv[dataArgIndex + 1];
    }

    if (!dataStr && dataFileIndex !== -1) {
      if (argv[dataFileIndex].startsWith('--data-file=')) {
        const p = argv[dataFileIndex].substring('--data-file='.length);
        try {
          dataStr = fs.readFileSync(path.resolve(p), 'utf8');
        } catch (e) {
          console.error('--data-file の読み取りに失敗しました:', e);
          process.exitCode = 1;
          return;
        }
      } else {
        const p = argv[dataFileIndex + 1];
        try {
          dataStr = fs.readFileSync(path.resolve(p), 'utf8');
        } catch (e) {
          console.error('--data-file の読み取りに失敗しました:', e);
          process.exitCode = 1;
          return;
        }
      }
    }

    // support @path in --data to read file
    if (dataStr && String(dataStr).startsWith('@')) {
      const p = String(dataStr).substring(1);
      try {
        dataStr = fs.readFileSync(path.resolve(p), 'utf8');
      } catch (e) {
        console.error("@file 指定の読み取りに失敗しました:", e);
        process.exitCode = 1;
        return;
      }
    }

    if (!dataStr) {
      console.error('--data に JSON が指定されていません');
      process.exitCode = 1;
      return;
    }

    // normalize: remove BOM if present and trim whitespace/newlines
    if (typeof dataStr === 'string') {
      dataStr = dataStr.replace(/^\uFEFF/, '');
      dataStr = dataStr.trim();
    }

    let dataObj: Record<string, any>;
    try {
      dataObj = JSON.parse(dataStr as string);
      if (!dataObj || typeof dataObj !== 'object') throw new Error('data not object');
    } catch (e) {
      console.error('--data の JSON パースに失敗しました:', e);
      process.exitCode = 1;
      return;
    }

    const resolved = resolveInputToPaths(inputReplace);
    console.log(`--replace 指定: ${inputReplace} -> 読み込み: ${resolved.levelPath}`);
    try {
      // createBackup: 'timestamp' to be safe
  // For --replace we intentionally do not create backups
  const mgr = new LevelDatManager(resolved.levelPath, { createBackup: false, jsonPath: null, createJson: false });
      await mgr.load();
      const root = mgr.raw();
      // apply replacement only to top-level keys provided in dataObj
      for (const k of Object.keys(dataObj)) {
        root[k] = dataObj[k];
        console.log(`置換: ${k} = ${JSON.stringify(dataObj[k])}`);
      }
  await mgr.saveDat();
  console.log(`level.dat を更新しました: ${resolved.levelPath}`);
      // also write out JSON snapshot for confirmation
      const outObj = use2int ? normalizeTwoIntInObject(mgr.raw()) : mgr.toJSON();
      const outPath = path.resolve(resolved.dir, 'level.dat.json');
      fs.writeFileSync(outPath, JSON.stringify(outObj, null, 2));
      console.log(`更新後の JSON を出力しました: ${outPath}`);
      return;
    } catch (e) {
      console.error('--replace 実行中にエラー:', e);
      process.exitCode = 1;
      return;
    }
  }

  // Handle normal --run
  let input = argv[runIndex + 1] || '.';
  const resolvedRun = resolveInputToPaths(input);

  console.log(`指定パス: ${input} -> 読み込み: ${resolvedRun.levelPath}`);

  try {
    const mgr = new LevelDatManager(resolvedRun.levelPath, { createBackup: false, jsonPath: null, createJson: false });
    await mgr.load();
    const outObj = use2int ? normalizeTwoIntInObject(mgr.raw()) : mgr.toJSON();
    const outPath = path.resolve(resolvedRun.dir, 'level.dat.json');
    fs.writeFileSync(outPath, JSON.stringify(outObj, null, 2));
    console.log(`JSON を出力しました: ${outPath} (${use2int ? '2-int 正規化有り' : 'そのまま'})`);
  } catch (e) {
    console.error('CLI 実行中にエラー:', e);
    process.exitCode = 1;
  }
}

runCliIfRequested().catch((e) => {
  console.error('内部 CLI エラー:', e);
});
