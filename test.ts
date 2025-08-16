import { LevelDatManager } from './src/index';
import { LevelDatKey, ExperimentsKey, AbilitiesKey } from './src/Types';

/**
 * test.ts — LevelDatManager の使用例
 * - このサンプルは読み取りが基本で、デフォルトでは level.dat を書き込みません。
 * - 永続化するには `await mgr.saveDat()` を手動で呼んでください（下のコメント参照）。
 */

async function main() {
  // 1) マネージャを生成（--save/-s を指定すると level.datの変更を保存します。）
  const shouldSave = process.argv.includes('--save') || process.argv.includes('-s');
  const mgr = shouldSave
    ? new LevelDatManager('level.dat', { createJson: true ,jsonPath: 'level.dat.json' })
    : new LevelDatManager('level.dat');

  // 2) 読み込みと確認
  console.log('level.dat を読み込み中...');
  await mgr.load();
  console.log(`読み込み完了。トップレベルキー数: ${mgr.keys().length}`);

  // 3) enum を使った単純な読み取り
  console.log('レベル名:', mgr.get(LevelDatKey.LevelName));
  console.log('難易度（数値）:', mgr.get(LevelDatKey.Difficulty));
  console.log('experiments.gametest:', mgr.get(`experiments.${ExperimentsKey.gametest}`));
  console.log('worldStartCount:', JSON.stringify(mgr.get(LevelDatKey.worldStartCount)));
  console.log('lastOpenedWithVersion:', JSON.stringify(mgr.get(LevelDatKey.lastOpenedWithVersion)));
  console.log('currentTick:', JSON.stringify(mgr.get(LevelDatKey.currentTick)));
  console.log('Time:', JSON.stringify(mgr.get(LevelDatKey.Time)));
  console.log('RandomSeed:', JSON.stringify(mgr.get(LevelDatKey.RandomSeed)));
  console.log('LastPlayed:', JSON.stringify(mgr.get(LevelDatKey.LastPlayed)));

  // 4) node()（Proxy）でネストしたオブジェクトを確認 — これは mgr.root へのライブビューです
  const abilities = mgr.node(LevelDatKey.abilities);
  if (abilities) {
    console.log(`abilities.${AbilitiesKey.attackmobs} 変更前 ->`, abilities[AbilitiesKey.attackmobs]);

    // メモリ上で変更（saveDat を呼ばない限りディスクには反映されません）
    abilities[AbilitiesKey.attackmobs] = abilities[AbilitiesKey.attackmobs] ? 0 : 1;
    console.log(`abilities.${AbilitiesKey.attackmobs} 変更後 ->`, abilities[AbilitiesKey.attackmobs]);
  }

  // 5) ルートプロキシ経由で root を変更
  const rootProxy = mgr.node('');
  if (rootProxy) {
    console.log('Difficulty 変更前 ->', rootProxy[LevelDatKey.Difficulty]);
    // メモリ上で難易度をトグル
    rootProxy[LevelDatKey.Difficulty] = rootProxy[LevelDatKey.Difficulty] === 1 ? 0 : 1;
    console.log('Difficulty 変更後 ->', rootProxy[LevelDatKey.Difficulty]);
  }

  // 変更を永続化する（--save または -s が指定されている場合）
  if (shouldSave) {
    try {
      await mgr.saveDat();
      console.log('level.dat を保存しました（バックアップ有効）');
    } catch (e) {
      console.error('level.dat の保存に失敗しました:', e);
    }
  }

  // 7) JSON 出力オプション（手動）
  console.log('\nヒント: mgr.createJson("path/to/out.json") を呼ぶと JSON スナップショットを書き出せます。');

  console.log('\nサンプル完了。デフォルトではディスク上のファイルは変更されませんでした。');
}

if ((import.meta as any).main) main().catch(e => { console.error('sample error:', e); process.exit(1); });
