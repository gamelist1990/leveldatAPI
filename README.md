# leveldatAPI

軽量な Minecraft Bedrock 版の `level.dat` を読み書きする TypeScript ユーティリティです。
NBT を解析して簡易オブジェクトを提供し、必要に応じて安全にファイルへ書き戻せます。


## 概要

- `LevelDatManager` クラスで `level.dat` を読み込み、get/has/keys/node（Proxy）などの API を通してデータを扱えます。
- 書き戻しは一時ファイル → 検証パース → 原子的リネームの手順で行い、バックアップオプションを提供します。
- 一部の 2-int 配列（高32bit/低32bit）を結合して Number/BigInt 相当で返す正規化を実装しています。

## 要件

- Bun（または Node.js と互換のある実行環境）
- `prismarine-nbt` と標準 Node の `zlib` を使用

※ このリポジトリは Bun での実行を想定したスクリプトを含みます。

## セットアップ

PowerShell（Windows）での例:

```powershell
# 依存関係インストール（Bun を使用する場合）
bun install

# テスト実行
bun .\test.ts
```

## 使い方（簡単な例）

TypeScript から:

```ts
import { LevelDatManager } from './src/index';

const mgr = new LevelDatManager();
await mgr.load();
console.log(mgr.get('LevelName'));

// 変更を保存する場合は明示的に呼ぶ
await mgr.saveDat();
```

`test.ts` はデフォルトで読み取り専用のサンプルです。保存を行う場合は `--save` などのフラグを使用する形になっています（スクリプト内の説明を参照してください）。

補足: このプロジェクトを自分のコードで使う場合は、`src/index.ts`（LevelDatManager 本体）と `src/Types.ts`（列挙型・型ヘルパー）を一緒にインポート/参照して使ってください。

## オプション

- `createBackup`: `false` | `true` | `'timestamp'` — 保存時のバックアップ挙動
- `jsonPath`: JSON スナップショットを書き出すパス
- `createJson`: `true` にすると load()/saveDat() 後に JSON スナップショットを作成

これらは `new LevelDatManager(levelPath?, options?)` の `options` で指定します。

## CLI: `--run` と `--2int`

`src/index.ts` には簡易 CLI があり、`--run` オプションで指定したディレクトリ（または `level.dat` ファイルのパス）を読み込み、同じディレクトリに `level.dat.json` を生成します。

- `--run <path>`: 指定パスがディレクトリならその中の `level.dat` を、ファイルパスならそのファイルを読み込みます。
- `--2int`: 出力 JSON に対して 2-int（高32bit / 低32bit）の正規化を適用します。現在は内部で `worldStartCount`, `currentTick`, `Time`, `RandomSeed`, `LastPlayed` などの長整数フィールドを結合して Number または文字列で出力します。

PowerShell の例:

```powershell
# ディレクトリ内の level.dat を読み取り、正規化ありで JSON を出力
bun src/index.ts --run . --2int

# ファイルパスを直接指定して出力
bun src/index.ts --run C:\path\to\world\level.dat --2int
```

出力ファイル: `<指定ディレクトリ>/level.dat.json`。

注意: `--2int` はすべての配列を結合するわけではなく、上記の特定キーに対してのみ結合処理を行います。必要であればキーの追加や挙動変更（例: 全配列結合や BigInt 出力）にも対応できます。

Windows 向け実行ファイル
-----------------------

このリポジトリには、`src/index.ts` を exe 化した Windows 用の実行ファイル `LevelDatAPI.exe` を同梱しています。動作は CLI（`bun src/index.ts`）と同等で、`--run` と `--2int` のフラグをサポートします。Node.js や Bun をインストールしていない環境でも実行できます。

PowerShell の例（実行ファイルを直接使う場合）:

```powershell
# カレントディレクトリの level.dat を読み取り、正規化ありで JSON を出力
.\LevelDatAPI.exe --run . --2int

# ファイルパスを直接指定して出力
.\LevelDatAPI.exe --run C:\path\to\world\level.dat --2int
```

動作:
- `--run <path>` は、指定がディレクトリならその中の `level.dat` を、ファイルパスならそのファイルを読み込みます。
- 出力は指定ディレクトリ（または level.dat と同じ場所）に `level.dat.json` として書き出されます。
- `--2int` を指定すると、一部の 2-int 配列フィールド（例: `worldStartCount`, `currentTick`, `Time`, `RandomSeed`, `LastPlayed`）を結合して正規化した値で出力します（CLI と同じ挙動）。

置換: `--replace`
-----------------

レポジトリの CLI には `--replace` オプションを追加しています。`--replace <path>` と組み合わせて `--data` または `--data-file` で JSON を渡すと、指定の `level.dat` を読み込み、渡した JSON のトップレベルキーを上書きして保存します。

- 対応形式:
	- `--data '<json>'` または `--data=<json>`（PowerShell では引用やエスケープに注意）
	- `--data-file <path>` または `--data-file=<path>` — ファイルから JSON を読み込む（PowerShell での安全な方法として推奨）
	- `--data @path` — `@` プレフィックスでファイルを指定可能

- 動作の特記事項:
	- `--replace` は渡された JSON のトップレベルキーを単純に上書きします（例: `InventoryVersion` を文字列で上書き）。
	- 2-int（高32bit/低32bit）で格納されるフィールド（`LastPlayed`, `Time`, `currentTick`, `RandomSeed`, `worldStartCount` など）は、NBT に書き戻す場合は配列 `[high, low]` 形式で与えるのが安全です。
	- 現在の実装では `--replace` はバックアップを自動生成しません。重要な操作の前には手動でバックアップを取ることを強く推奨します。

PowerShell の例（推奨: ファイル経由で渡す）:

```powershell
# InventoryVersion を文字列で上書き
Set-Content -Encoding UTF8 tmp.json '{"InventoryVersion":"1.22.0"}'
.\LevelDatAPI.exe --replace . --data-file tmp.json

# LastPlayed を 2-int 配列で上書き
Set-Content -Encoding UTF8 tmp.json '{"LastPlayed":[0,1755224724]}'
.\LevelDatAPI.exe --replace . --data-file tmp.json

# bun で直接スクリプトを使う場合
Set-Content -Encoding UTF8 tmp.json '{"InventoryVersion":"1.22.0","LastPlayed":[0,1755224724]}'
bun src/index.ts --replace . --data-file tmp.json
```

上記の例では `tmp.json` を UTF-8（BOMなし）で作成して渡すことを推奨します。コマンドラインから直接 `--data` に JSON を渡すときは PowerShell のクォート仕様に注意してください。



## 安全性／注意点

- 書き込みは検証付きの安全なフローを採用していますが、必ずバックアップやバージョン管理を併用してください。

## 開発・テスト

- 主要なスクリプト: `test.ts`（サンプル実行）
- TypeScript の型情報と JSDoc が主要 API を説明しています。

## 主要ファイル

- `src/index.ts` — `LevelDatManager` 本体
- `src/Types.ts` — 列挙型と型ヘルパー
- `test.ts` — 実行サンプル（デフォルトは読み取りのみ）

## ライセンス

MITTTTTTTTTT

---


