export type NBTTag = any; 

export interface ParseResult {
    success: boolean;
    error?: string;
    root?: NBTTag;
}




// Bedrock 1.21.100 Level.dat 
export enum LevelDatKey {
    /** BiomeOverride — バイオームの上書き設定（存在する場合） */
    BiomeOverride = 'BiomeOverride',
    /** CenterMapsToOrigin — マップ中心を原点に合わせるかのフラグ */
    CenterMapsToOrigin = 'CenterMapsToOrigin',
    /** ConfirmedPlatformLockedContent — プラットフォームにロックされたコンテンツがあるか */
    ConfirmedPlatformLockedContent = 'ConfirmedPlatformLockedContent',
    /** Difficulty — ワールドの難易度 (例: 0=Peaceful, 1=Easy, 2=Normal, 3=Hard) */
    Difficulty = 'Difficulty',
    /** FlatWorldLayers — 平坦ワールド用のレイヤー定義 */
    FlatWorldLayers = 'FlatWorldLayers',
    /** ForceGameType — ゲームタイプを強制するフラグ */
    ForceGameType = 'ForceGameType',
    /** GameType — ゲームモード (例: サバイバル/クリエイティブ等) */
    GameType = 'GameType',
    /** Generator — ワールド生成器のタイプ */
    Generator = 'Generator',
    /** HasUncompleteWorldFileOnDisk — 不完全なワールドファイルが存在するか */
    HasUncompleteWorldFileOnDisk = 'HasUncompleteWorldFileOnDisk',
    /** InventoryVersion — インベントリのバージョン */
    InventoryVersion = 'InventoryVersion',
    /** IsHardcore — ハードコアモードかどうか */
    IsHardcore = 'IsHardcore',
    /** LANBroadcast — LAN ブロードキャストの有効化フラグ */
    LANBroadcast = 'LANBroadcast',
    /** LANBroadcastIntent — LAN ブロードキャストの目的/設定 */
    LANBroadcastIntent = 'LANBroadcastIntent',
    /** LastPlayed — 最終プレイ時刻（タイムスタンプ） */
    LastPlayed = 'LastPlayed',
    /**
     * Editor hover: このプロパティはワールド名を示します。
     */
    LevelName = 'LevelName',
    /** LimitedWorldOriginX — 制限ワールドの原点 X 座標 */
    LimitedWorldOriginX = 'LimitedWorldOriginX',
    /** LimitedWorldOriginY — 制限ワールドの原点 Y 座標 */
    LimitedWorldOriginY = 'LimitedWorldOriginY',
    /** LimitedWorldOriginZ — 制限ワールドの原点 Z 座標 */
    LimitedWorldOriginZ = 'LimitedWorldOriginZ',
    /** MinimumCompatibleClientVersion — 必要な最小クライアントバージョン */
    MinimumCompatibleClientVersion = 'MinimumCompatibleClientVersion',
    /** MultiplayerGame — マルチプレイ設定フラグ */
    MultiplayerGame = 'MultiplayerGame',
    /** MultiplayerGameIntent — マルチプレイの意図/設定 */
    MultiplayerGameIntent = 'MultiplayerGameIntent',
    /** NetherScale — ネザーのスケール */
    NetherScale = 'NetherScale',
    /** NetworkVersion — ネットワークプロトコルのバージョン */
    NetworkVersion = 'NetworkVersion',
    /** Platform — 実行プラットフォーム名 */
    Platform = 'Platform',
    /** PlatformBroadcastIntent — プラットフォームのブロードキャスト意図 */
    PlatformBroadcastIntent = 'PlatformBroadcastIntent',
    /** PlayerHasDied — プレイヤーが死亡したことを示すフラグ */
    PlayerHasDied = 'PlayerHasDied',
    /** RandomSeed — ワールド生成シード */
    RandomSeed = 'RandomSeed',
    /** SpawnV1Villagers — V1 Villager のスポーン設定 */
    SpawnV1Villagers = 'SpawnV1Villagers',
    /** SpawnX — スポーン X 座標 */
    SpawnX = 'SpawnX',
    /** SpawnY — スポーン Y 座標 */
    SpawnY = 'SpawnY',
    /** SpawnZ — スポーン Z 座標 */
    SpawnZ = 'SpawnZ',
    /** StorageVersion — ストレージ仕様のバージョン */
    StorageVersion = 'StorageVersion',
    /** Time — ワールド時刻 */
    Time = 'Time',
    /** WorldVersion — ワールドのバージョン情報 */
    WorldVersion = 'WorldVersion',
    /** XBLBroadcastIntent — Xbox Live 用のブロードキャスト意図 */
    XBLBroadcastIntent = 'XBLBroadcastIntent',
    /** abilities — プレイヤーや世界の能力情報オブジェクト */
    abilities = 'abilities',
    /** baseGameVersion — ベースゲームのバージョン */
    baseGameVersion = 'baseGameVersion',
    /** bonusChestEnabled — ボーナスチェストが有効か */
    bonusChestEnabled = 'bonusChestEnabled',
    /** bonusChestSpawned — ボーナスチェストが既にスポーンしたか */
    bonusChestSpawned = 'bonusChestSpawned',
    /** cheatsEnabled — チート（コマンド）の有効化 */
    cheatsEnabled = 'cheatsEnabled',
    /** commandblockoutput — コマンドブロック出力の表示 */
    commandblockoutput = 'commandblockoutput',
    /** commandblocksenabled — コマンドブロックの有効化 */
    commandblocksenabled = 'commandblocksenabled',
    /** commandsEnabled — コマンド実行の有効化 */
    commandsEnabled = 'commandsEnabled',
    /** currentTick — 現在のティックカウント */
    currentTick = 'currentTick',
    /** daylightCycle — 昼夜サイクルの有効/無効 */
    daylightCycle = 'daylightCycle',
    /** dodaylightcycle — 旧互換の昼夜設定フラグ */
    dodaylightcycle = 'dodaylightcycle',
    /** doentitydrops — エンティティドロップの有無 */
    doentitydrops = 'doentitydrops',
    /** dofiretick — 火の広がり処理の有無 */
    dofiretick = 'dofiretick',
    /** doimmediaterespawn — 即時リスポーンの有無 */
    doimmediaterespawn = 'doimmediaterespawn',
    /** doinsomnia — 不眠症（夜のイベント）を無効化するか */
    doinsomnia = 'doinsomnia',
    /** dolimitedcrafting — 限定クラフトの有効化 */
    dolimitedcrafting = 'dolimitedcrafting',
    /** domobloot — モブのドロップ有無 */
    domobloot = 'domobloot',
    /** domobspawning — モブのスポーン制御 */
    domobspawning = 'domobspawning',
    /** dotiledrops — タイルドロップの有無 */
    dotiledrops = 'dotiledrops',
    /** doweathercycle — 天候サイクルの有効/無効 */
    doweathercycle = 'doweathercycle',
    /** drowningdamage — 溺れダメージの有無 */
    drowningdamage = 'drowningdamage',
    /** editorWorldType — エディタでのワールドタイプ */
    editorWorldType = 'editorWorldType',
    /** eduOffer — Education Edition の提供フラグ */
    eduOffer = 'eduOffer',
    /** educationFeaturesEnabled — 教育機能の有効化 */
    educationFeaturesEnabled = 'educationFeaturesEnabled',
    /** experiments — 実験的機能フラグのオブジェクト */
    experiments = 'experiments',
    /** falldamage — 落下ダメージの有無 */
    falldamage = 'falldamage',
    /** firedamage — 火ダメージの有無 */
    firedamage = 'firedamage',
    /** freezedamage — 凍結ダメージの有無 */
    freezedamage = 'freezedamage',
    /** functioncommandlimit — 関数コマンドの実行上限 */
    functioncommandlimit = 'functioncommandlimit',
    /** hasBeenLoadedInCreative — クリエイティブで読み込まれたことがあるか */
    hasBeenLoadedInCreative = 'hasBeenLoadedInCreative',
    /** hasLockedBehaviorPack — ロックされたビヘイビアパックがあるか */
    hasLockedBehaviorPack = 'hasLockedBehaviorPack',
    /** hasLockedResourcePack — ロックされたリソースパックがあるか */
    hasLockedResourcePack = 'hasLockedResourcePack',
    /** immutableWorld — 世界が不変（編集不可）か */
    immutableWorld = 'immutableWorld',
    /** isCreatedInEditor — エディタで作成されたワールドか */
    isCreatedInEditor = 'isCreatedInEditor',
    /** isExportedFromEditor — エディタからエクスポートされたか */
    isExportedFromEditor = 'isExportedFromEditor',
    /** isFromLockedTemplate — ロックされたテンプレート由来か */
    isFromLockedTemplate = 'isFromLockedTemplate',
    /** isFromWorldTemplate — ワールドテンプレート由来か */
    isFromWorldTemplate = 'isFromWorldTemplate',
    /** isRandomSeedAllowed — ランダムシードの許可 */
    isRandomSeedAllowed = 'isRandomSeedAllowed',
    /** isSingleUseWorld — 一回限りのワールドか */
    isSingleUseWorld = 'isSingleUseWorld',
    /** isWorldTemplateOptionLocked — テンプレートオプションがロックされているか */
    isWorldTemplateOptionLocked = 'isWorldTemplateOptionLocked',
    /** keepinventory — 死亡時のインベントリ保持フラグ */
    keepinventory = 'keepinventory',
    /** lastOpenedWithVersion — 最後に開いたクライアントのバージョン */
    lastOpenedWithVersion = 'lastOpenedWithVersion',
    /** lightningLevel — 雷の強度/レベル */
    lightningLevel = 'lightningLevel',
    /** lightningTime — 雷の時間カウンタ */
    lightningTime = 'lightningTime',
    /** limitedWorldDepth — 制限ワールドの深さ */
    limitedWorldDepth = 'limitedWorldDepth',
    /** limitedWorldWidth — 制限ワールドの幅 */
    limitedWorldWidth = 'limitedWorldWidth',
    /** locatorbar — ロケーターバー表示の有無 */
    locatorbar = 'locatorbar',
    /** maxcommandchainlength — コマンドチェーンの最大長 */
    maxcommandchainlength = 'maxcommandchainlength',
    /** mobgriefing — Mob によるブロック破壊の有無 */
    mobgriefing = 'mobgriefing',
    /** naturalregeneration — 自然回復の有無 */
    naturalregeneration = 'naturalregeneration',
    /** permissionsLevel — サーバー権限レベル */
    permissionsLevel = 'permissionsLevel',
    /** playerPermissionsLevel — プレイヤーごとの権限レベル */
    playerPermissionsLevel = 'playerPermissionsLevel',
    /** playerssleepingpercentage — 寝ているプレイヤーの割合閾値 */
    playerssleepingpercentage = 'playerssleepingpercentage',
    /** prid — プロジェクト/ワールド識別子 */
    prid = 'prid',
    /** projectilescanbreakblocks — 発射体がブロックを破壊できるか */
    projectilescanbreakblocks = 'projectilescanbreakblocks',
    /** pvp — プレイヤー間の PvP 有効フラグ */
    pvp = 'pvp',
    /** rainLevel — 雨の強度 */
    rainLevel = 'rainLevel',
    /** rainTime — 雨の時間カウンタ */
    rainTime = 'rainTime',
    /** randomtickspeed — ランダムティック速度 */
    randomtickspeed = 'randomtickspeed',
    /** recipesunlock — レシピのアンロック状態 */
    recipesunlock = 'recipesunlock',
    /** requiresCopiedPackRemovalCheck — コピーされたパックの削除チェック要否 */
    requiresCopiedPackRemovalCheck = 'requiresCopiedPackRemovalCheck',
    /** respawnblocksexplode — リスポーンブロックの爆発設定 */
    respawnblocksexplode = 'respawnblocksexplode',
    /** sendcommandfeedback — コマンド実行時のフィードバック送信 */
    sendcommandfeedback = 'sendcommandfeedback',
    /** serverChunkTickRange — サーバーのチャンクティックレンジ */
    serverChunkTickRange = 'serverChunkTickRange',
    /** showbordereffect — ワールド境界エフェクト表示 */
    showbordereffect = 'showbordereffect',
    /** showcoordinates — 座標表示の有無 */
    showcoordinates = 'showcoordinates',
    /** showdaysplayed — プレイ日数表示の有無 */
    showdaysplayed = 'showdaysplayed',
    /** showdeathmessages — 死亡メッセージ表示 */
    showdeathmessages = 'showdeathmessages',
    /** showrecipemessages — レシピメッセージ表示 */
    showrecipemessages = 'showrecipemessages',
    /** showtags — タグ表示の有無 */
    showtags = 'showtags',
    /** spawnMobs — モブスポーン可否 */
    spawnMobs = 'spawnMobs',
    /** spawnradius — スポーン半径 */
    spawnradius = 'spawnradius',
    /** startWithMapEnabled — マップ開始の有無 */
    startWithMapEnabled = 'startWithMapEnabled',
    /** texturePacksRequired — テクスチャパック必須フラグ */
    texturePacksRequired = 'texturePacksRequired',
    /** tntexplodes — TNT が爆発するか */
    tntexplodes = 'tntexplodes',
    /** tntexplosiondropdecay — TNT 爆発時のドロップ減衰 */
    tntexplosiondropdecay = 'tntexplosiondropdecay',
    /** useMsaGamertagsOnly — MSA ゲーマータグのみを使用するか */
    useMsaGamertagsOnly = 'useMsaGamertagsOnly',
    /** worldStartCount — ワールドが開始された回数 */
    worldStartCount = 'worldStartCount',
    /** world_policies — ワールドポリシー設定オブジェクト */
    world_policies = 'world_policies'
}

// Nested keys for experiments and abilities
export enum ExperimentsKey {
    /** data_driven_biomes — データ駆動型バイオームの実験フラグ */
    data_driven_biomes = 'data_driven_biomes',
    /** experimental_creator_cameras — クリエイター向けカメラ実験フラグ */
    experimental_creator_cameras = 'experimental_creator_cameras',
    /** experiments_ever_used — 実験機能が一度でも有効にされたかを示すフラグ */
    experiments_ever_used = 'experiments_ever_used',
    /** gametest — GameTest フレームワークの実験的有効化フラグ */
    gametest = 'gametest',
    /** jigsaw_structures — ジグソー構造の実験的利用フラグ */
    jigsaw_structures = 'jigsaw_structures',
    /** saved_with_toggled_experiments — 実験フラグを切り替えた状態で保存されたか */
    saved_with_toggled_experiments = 'saved_with_toggled_experiments',
    /** upcoming_creator_features — 今後のクリエイタ機能の実験フラグ */
    upcoming_creator_features = 'upcoming_creator_features'
}

export enum AbilitiesKey {
    /** attackmobs — モブに攻撃可能か */
    attackmobs = 'attackmobs',
    /** attackplayers — プレイヤーを攻撃可能か */
    attackplayers = 'attackplayers',
    /** build — 建築可能か */
    build = 'build',
    /** doorsandswitches — ドアやスイッチを操作可能か */
    doorsandswitches = 'doorsandswitches',
    /** flySpeed — 飛行時の横方向速度 */
    flySpeed = 'flySpeed',
    /** flying — 飛行状態か */
    flying = 'flying',
    /** instabuild — 即座にブロックを置けるか（クリエイティブ系） */
    instabuild = 'instabuild',
    /** invulnerable — 無敵状態か */
    invulnerable = 'invulnerable',
    /** lightning — 雷を使える/受けるか */
    lightning = 'lightning',
    /** mayfly — プレイヤーが一時的に飛行可能か */
    mayfly = 'mayfly',
    /** mine — 採掘可能か */
    mine = 'mine',
    /** op — OP 権限を持つかのフラグ */
    op = 'op',
    /** opencontainers — コンテナを開けるか */
    opencontainers = 'opencontainers',
    /** teleport — テレポート可能か */
    teleport = 'teleport',
    /** verticalFlySpeed — 飛行時の垂直速度 */
    verticalFlySpeed = 'verticalFlySpeed',
    /** walkSpeed — 歩行速度 */
    walkSpeed = 'walkSpeed'
}

export type LevelDatKeys = Partial<Record<LevelDatKey, any>> & { [key: string]: any };

/**
 * EmuType — 解析済みの `level.dat` を扱うためのインターフェース
 *
 * この型は、解析された NBT ルートに対する便利メソッド群と、Proxy ベースの
 * `node()` を提供します。Proxy 経由での書き込みはメモリ上の root を更新し、
 * 管理者が登録した onChange ハンドラを呼び出すことを想定しています。
 */
export type EmuType = {
    /**
     * 解析されたルートに存在するトップレベルのキー名一覧を返します。
     */
    keys(): string[];

    /**
     * ドット区切りのパスがルート内に存在するかを判定します。
     * 見つからない場合は大文字小文字を無視したフォールバック探索を試みます。
     */
    has(path: string): boolean;

    /**
     * ドット区切りのパスから値を読み取ります。存在しない場合は `defaultValue` を返します。
     */
    get(path: string, defaultValue?: any): any;

    /**
     * 指定したパスのノードに対する Proxy を返します（空文字列でルートプロキシ）。
     * 返される Proxy はプロパティの取得/代入/削除をサポートし、代入は内部 root を更新し
     * onChange を発火させます。
     */
    node(path?: string): any;

    /**
     * 現在のメモリ上の root オブジェクトをそのまま返します（ミュータブル）。
     */
    raw(): Record<string, any>;

    /**
     * root の深いクローンを JSON 互換のオブジェクトとして返します。
     */
    toJSON(): Record<string, any>;

};

// Helper types for typed accessors
/** Abilities オブジェクトの型（列挙されたキーをプロパティとして持つ可能性があります） */
export type AbilitiesObject = Partial<Record<AbilitiesKey, any>> & { [key: string]: any };

/** Experiments オブジェクトの型（列挙された実験フラグをプロパティとして持つ可能性があります） */
export type ExperimentsObject = Partial<Record<ExperimentsKey, any>> & { [key: string]: any };

/**
 * PathResult<P> — `node(path)` に渡されたパス文字列 P に基づいて戻り値の型を決めます。
 * 既知のトップレベルキー（例えば `abilities` / `experiments`）については具体型を割り当て、
 * それ以外は any を返します。
 */
export type PathResult<P extends string> =
    P extends `${LevelDatKey.BiomeOverride}` ? any :
    P extends `${LevelDatKey.CenterMapsToOrigin}` ? boolean :
    P extends `${LevelDatKey.ConfirmedPlatformLockedContent}` ? boolean :
    P extends `${LevelDatKey.Difficulty}` ? number :
    P extends `${LevelDatKey.FlatWorldLayers}` ? any :
    P extends `${LevelDatKey.ForceGameType}` ? boolean :
    P extends `${LevelDatKey.GameType}` ? number :
    P extends `${LevelDatKey.Generator}` ? any :
    P extends `${LevelDatKey.HasUncompleteWorldFileOnDisk}` ? boolean :
    P extends `${LevelDatKey.InventoryVersion}` ? number :
    P extends `${LevelDatKey.IsHardcore}` ? boolean :
    P extends `${LevelDatKey.LANBroadcast}` ? boolean :
    P extends `${LevelDatKey.LANBroadcastIntent}` ? any :
    P extends `${LevelDatKey.LastPlayed}` ? number :
    P extends `${LevelDatKey.LevelName}` ? string :
    P extends `${LevelDatKey.LimitedWorldOriginX}` ? number :
    P extends `${LevelDatKey.LimitedWorldOriginY}` ? number :
    P extends `${LevelDatKey.LimitedWorldOriginZ}` ? number :
    P extends `${LevelDatKey.MinimumCompatibleClientVersion}` ? any :
    P extends `${LevelDatKey.MultiplayerGame}` ? boolean :
    P extends `${LevelDatKey.MultiplayerGameIntent}` ? any :
    P extends `${LevelDatKey.NetherScale}` ? number :
    P extends `${LevelDatKey.NetworkVersion}` ? number :
    P extends `${LevelDatKey.Platform}` ? string :
    P extends `${LevelDatKey.PlatformBroadcastIntent}` ? any :
    P extends `${LevelDatKey.PlayerHasDied}` ? boolean :
    P extends `${LevelDatKey.RandomSeed}` ? number :
    P extends `${LevelDatKey.SpawnV1Villagers}` ? boolean :
    P extends `${LevelDatKey.SpawnX}` ? number :
    P extends `${LevelDatKey.SpawnY}` ? number :
    P extends `${LevelDatKey.SpawnZ}` ? number :
    P extends `${LevelDatKey.StorageVersion}` ? number :
    P extends `${LevelDatKey.Time}` ? number :
    P extends `${LevelDatKey.WorldVersion}` ? any :
    P extends `${LevelDatKey.XBLBroadcastIntent}` ? any :
    P extends `${LevelDatKey.abilities}` ? AbilitiesObject :
    P extends `${LevelDatKey.baseGameVersion}` ? string :
    P extends `${LevelDatKey.bonusChestEnabled}` ? boolean :
    P extends `${LevelDatKey.bonusChestSpawned}` ? boolean :
    P extends `${LevelDatKey.cheatsEnabled}` ? boolean :
    P extends `${LevelDatKey.commandblockoutput}` ? boolean :
    P extends `${LevelDatKey.commandblocksenabled}` ? boolean :
    P extends `${LevelDatKey.commandsEnabled}` ? boolean :
    P extends `${LevelDatKey.currentTick}` ? number :
    P extends `${LevelDatKey.daylightCycle}` ? boolean :
    P extends `${LevelDatKey.dodaylightcycle}` ? boolean :
    P extends `${LevelDatKey.doentitydrops}` ? boolean :
    P extends `${LevelDatKey.dofiretick}` ? boolean :
    P extends `${LevelDatKey.doimmediaterespawn}` ? boolean :
    P extends `${LevelDatKey.doinsomnia}` ? boolean :
    P extends `${LevelDatKey.dolimitedcrafting}` ? boolean :
    P extends `${LevelDatKey.domobloot}` ? boolean :
    P extends `${LevelDatKey.domobspawning}` ? boolean :
    P extends `${LevelDatKey.dotiledrops}` ? boolean :
    P extends `${LevelDatKey.doweathercycle}` ? boolean :
    P extends `${LevelDatKey.drowningdamage}` ? boolean :
    P extends `${LevelDatKey.editorWorldType}` ? any :
    P extends `${LevelDatKey.eduOffer}` ? boolean :
    P extends `${LevelDatKey.educationFeaturesEnabled}` ? boolean :
    P extends `${LevelDatKey.experiments}` ? ExperimentsObject :
    P extends `${LevelDatKey.falldamage}` ? boolean :
    P extends `${LevelDatKey.firedamage}` ? boolean :
    P extends `${LevelDatKey.freezedamage}` ? boolean :
    P extends `${LevelDatKey.functioncommandlimit}` ? number :
    P extends `${LevelDatKey.hasBeenLoadedInCreative}` ? boolean :
    P extends `${LevelDatKey.hasLockedBehaviorPack}` ? boolean :
    P extends `${LevelDatKey.hasLockedResourcePack}` ? boolean :
    P extends `${LevelDatKey.immutableWorld}` ? boolean :
    P extends `${LevelDatKey.isCreatedInEditor}` ? boolean :
    P extends `${LevelDatKey.isExportedFromEditor}` ? boolean :
    P extends `${LevelDatKey.isFromLockedTemplate}` ? boolean :
    P extends `${LevelDatKey.isFromWorldTemplate}` ? boolean :
    P extends `${LevelDatKey.isRandomSeedAllowed}` ? boolean :
    P extends `${LevelDatKey.isSingleUseWorld}` ? boolean :
    P extends `${LevelDatKey.isWorldTemplateOptionLocked}` ? boolean :
    P extends `${LevelDatKey.keepinventory}` ? boolean :
    P extends `${LevelDatKey.lastOpenedWithVersion}` ? any :
    P extends `${LevelDatKey.lightningLevel}` ? number :
    P extends `${LevelDatKey.lightningTime}` ? number :
    P extends `${LevelDatKey.limitedWorldDepth}` ? number :
    P extends `${LevelDatKey.limitedWorldWidth}` ? number :
    P extends `${LevelDatKey.locatorbar}` ? boolean :
    P extends `${LevelDatKey.maxcommandchainlength}` ? number :
    P extends `${LevelDatKey.mobgriefing}` ? boolean :
    P extends `${LevelDatKey.naturalregeneration}` ? boolean :
    P extends `${LevelDatKey.permissionsLevel}` ? number :
    P extends `${LevelDatKey.playerPermissionsLevel}` ? number :
    P extends `${LevelDatKey.playerssleepingpercentage}` ? number :
    P extends `${LevelDatKey.prid}` ? string :
    P extends `${LevelDatKey.projectilescanbreakblocks}` ? boolean :
    P extends `${LevelDatKey.pvp}` ? boolean :
    P extends `${LevelDatKey.rainLevel}` ? number :
    P extends `${LevelDatKey.rainTime}` ? number :
    P extends `${LevelDatKey.randomtickspeed}` ? number :
    P extends `${LevelDatKey.recipesunlock}` ? any :
    P extends `${LevelDatKey.requiresCopiedPackRemovalCheck}` ? boolean :
    P extends `${LevelDatKey.respawnblocksexplode}` ? boolean :
    P extends `${LevelDatKey.sendcommandfeedback}` ? boolean :
    P extends `${LevelDatKey.serverChunkTickRange}` ? number :
    P extends `${LevelDatKey.showbordereffect}` ? boolean :
    P extends `${LevelDatKey.showcoordinates}` ? boolean :
    P extends `${LevelDatKey.showdaysplayed}` ? boolean :
    P extends `${LevelDatKey.showdeathmessages}` ? boolean :
    P extends `${LevelDatKey.showrecipemessages}` ? boolean :
    P extends `${LevelDatKey.showtags}` ? boolean :
    P extends `${LevelDatKey.spawnMobs}` ? boolean :
    P extends `${LevelDatKey.spawnradius}` ? number :
    P extends `${LevelDatKey.startWithMapEnabled}` ? boolean :
    P extends `${LevelDatKey.texturePacksRequired}` ? boolean :
    P extends `${LevelDatKey.tntexplodes}` ? boolean :
    P extends `${LevelDatKey.tntexplosiondropdecay}` ? any :
    P extends `${LevelDatKey.useMsaGamertagsOnly}` ? boolean :
    P extends `${LevelDatKey.worldStartCount}` ? number :
    P extends `${LevelDatKey.world_policies}` ? any :
    // fallback
    any;
