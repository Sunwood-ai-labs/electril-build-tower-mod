# Electril Build Tower Mod

Mindustryのビルドタワー（Build Tower）の範囲を5倍に拡大するMODです。Electril/Elecian勢力での使用を想定しています。

## 機能

- ビルドタワーの**視覚範囲**を5倍に拡大
- ビルドタワーの**実際の建築支援効果範囲**を5倍に拡大
- デフォルト: 200 ticks (~50 tiles) → 1000 ticks (~250 tiles)

## 必要条件

- Mindustry v154以上
- Steam版またはスタンドアロン版

## インストール方法

### Steam版
1. このリポジトリをダウンロード（ZIP）またはクローン
2. フォルダを以下の場所に配置:
   ```
   D:\SteamLibrary\steamapps\common\Mindustry\saves\mods\electril-build-tower-mod\
   ```
3. Mindustryを起動
4. メインメニュー → Mods → 「Electril Build Tower Mod」を有効化
5. ゲーム再起動

### スタンドアロン版
1. このリポジトリをダウンロード
2. フォルダを以下の場所に配置:
   - Windows: `%APPDATA%\Mindustry\mods\electril-build-tower-mod\`
   - Linux: `~/.local/share/Mindustry/mods/electril-build-tower-mod/`
   - macOS: `~/Library/Application Support/Mindustry/mods/electril-build-tower-mod/`

## 開発環境セットアップ

### 前提条件
- Git
- テキストエディタ（VS Code推奨）

### セットアップ手順

```bash
# リポジトリをクローン
git clone https://github.com/Sunwood-ai-labs/electril-build-tower-mod.git
cd electril-build-tower-mod

# 開発用にSteam版MODフォルダにシンボリックリンクを作成（オプション）
# Windows（管理者権限で実行）:
mklink /D "D:\SteamLibrary\steamapps\common\Mindustry\saves\mods\electril-build-tower-mod" "D:\Prj\Mindustry_mod"

# または手動でコピー:
xcopy /E /Y "D:\Prj\Mindustry_mod\*" "D:\SteamLibrary\steamapps\common\Mindustry\saves\mods\electril-build-tower-mod\"
```

## ファイル構造

```
electril-build-tower-mod/
├── README.md           # このファイル
├── mod.json            # MOD メタデータ
└── scripts/
    └── main.js         # メインスクリプト（ビルドタワー範囲変更）
```

### mod.json の説明

```json
{
  "displayName": "[#FFF861FF]Electril Build Tower Mod",  // MOD名（色コード付き）
  "name": "electril-build-tower",                        // 内部ID
  "author": "Aslan",                                     // 作者名
  "description": "...",                                  // 説明
  "minGameVersion": "154",                              // 必要な最小バージョン
  "version": "1.0.0"                                    // MOD バージョン
}
```

**重要**: JavaScriptのみのMODの場合、`"java": true` を**含めない**でください。Javaクラスを探そうとしてエラーになります。

### main.js の説明

このスクリプトは `ContentInitEvent` イベントでビルドタワーの設定を変更します。

```javascript
Events.on(ContentInitEvent, () => {
    // ビルドタワーブロックを検索
    let buildTower = Vars.content.blocks().find(b => b.name === "build-tower");

    // 範囲を5倍に変更
    buildTower.range = originalRange * 5;                      // 視覚範囲
    buildTower.unitType.buildRange = originalBuildRange * 5;   // 実際の効果範囲（重要！）
});
```

## 技術的な詳細

### BuildTurret の仕組み

Mindustryのビルドタワーは `BuildTurret` クラスで実装されています。重要なポイント:

1. **初期化時に内部UnitTypeを作成**:
   ```java
   unitType = new UnitType("turret-unit-" + name){{
       buildRange = BuildTurret.this.range;  // rangeの値がコピーされる
       buildSpeed = BuildTurret.this.buildSpeed;
   }};
   ```

2. **`range` プロパティ**: 視覚的な範囲表示のみ
3. **`unitType.buildRange`**: 実際の建築支援効果範囲

**注意**: `range` だけを変更しても効果範囲は変わらない。`unitType.buildRange` も変更する必要がある。

### 参考ソースコード

- [BuildTurret.java](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/world/blocks/defense/BuildTurret.java)
- [Blocks.java](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/content/Blocks.java)

## デバッグ方法

### ログの確認

1. Mindustryを起動
2. **F8** キーで開発者コンソールを開く
3. 以下のログを確認:
   ```
   [Elecian Build Tower Mod] Successfully modified build tower:
     Block name: build-tower
     Visual range: 200 -> 1000 ticks (~250 tiles)
     Build range: 200 -> 1000 ticks (~250 tiles)
   ```

### ログファイルの場所

```
D:\SteamLibrary\steamapps\common\Mindustry\saves\last_log.txt
```

### よくあるエラー

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `ClassNotFoundException` | `"java": true` がある | `mod.json` から削除 |
| MODがリストに表示されない | `mod.json` の構文エラー | JSON構文を確認 |
| 範囲は広がるが効果がない | `unitType.buildRange` 未変更 | スクリプトを修正 |

## 倍率の変更方法

`main.js` の倍率を変更:

```javascript
// 5倍 → 10倍に変更する場合
buildTower.range = originalRange * 10;
buildTower.unitType.buildRange = originalBuildRange * 10;
```

## 参考リソース

- [Mindustry Official Wiki - Modding](https://mindustrygame.github.io/wiki/modding/1-modding/)
- [Mindustry GitHub Repository](https://github.com/Anuken/Mindustry)
- [Mindustry API Documentation](https://mindustrygame.github.io/docs/)
- [Mindustry Modding Guide](https://simonwoodburyforget.github.io/mindustry-modding/)

## 参考MOD

- [AureusStratus-ExoGenesis](https://github.com/AureusStratus/ExoGenesis) - Elecian勢力を含む大規模MOD

## ライセンス

MIT License

## 作者

Aslan
