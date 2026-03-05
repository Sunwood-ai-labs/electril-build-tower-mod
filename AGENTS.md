# AGENTS.md - AI Development Agent Guide

このファイルは、AI開発エージェントがこのプロジェクトを理解し、効果的に開発を継続するためのガイドです。

## プロジェクト概要

**Electril Build Tower Mod** - Mindustryのビルドタワー（Build Tower）の範囲を5倍に拡大するMOD。

### 目的
- Electril/Elecian勢力で使用するビルドタワーの建築支援範囲を拡大
- デフォルト: 200 ticks (~50 tiles) → 1000 ticks (~250 tiles)

## 開発コマンド

### Git操作
```bash
# 変更をコミット・プッシュ
git add .
git commit -m "Description of changes"
git push origin main
```

### MODのテスト
1. ファイルをSteam版MODフォルダにコピー:
   ```bash
   xcopy /E /Y "D:\Prj\Mindustry_mod\*" "D:\SteamLibrary\steamapps\common\Mindustry\saves\mods\electril-build-tower-mod\"
   ```
2. Mindustryを起動
3. F8でコンソールを開き、ログを確認

### ログ確認
```
D:\SteamLibrary\steamapps\common\Mindustry\saves\last_log.txt
```

成功時のログ:
```
[Elecian Build Tower Mod] Successfully modified build tower:
  Block name: build-tower
  Visual range: 200 -> 1000 ticks (~250 tiles)
  Build range: 200 -> 1000 ticks (~250 tiles)
```

## ファイル構造

```
electril-build-tower-mod/
├── README.md           # ユーザー向けドキュメント
├── AGENTS.md           # AI開発エージェント向けガイド（このファイル）
├── mod.json            # MOD メタデータ（JSON形式）
└── scripts/
    └── main.js         # メインスクリプト
```

## 技術的な重要ポイント

### BuildTurret の仕組み（必読）

Mindustryのビルドタワーは `BuildTurret` クラスで実装されています。

**重要**: 初期化時に内部で `UnitType` を作成し、`range` の値を `buildRange` にコピーします。

```java
// BuildTurret.java 内部
unitType = new UnitType("turret-unit-" + name){{
    buildRange = BuildTurret.this.range;  // rangeの値がコピーされる！
    buildSpeed = BuildTurret.this.buildSpeed;
}};
```

**したがって、範囲を変更するには両方を変更する必要があります:**

```javascript
// main.js での正しい実装
buildTower.range = originalRange * 5;                      // 視覚範囲
buildTower.unitType.buildRange = originalBuildRange * 5;   // 実際の効果範囲（重要！）
```

- `range` のみ変更 → 視覚範囲は変わるが、実際の効果範囲は変わらない
- `unitType.buildRange` も変更 → 実際の建築支援効果範囲も変わる

### mod.json の注意点

- `"java": true` を**含めない**こと（Javaクラスを探そうとしてエラーになる）
- JavaScriptのみのMODとして動作

### Mindustry MOD の範囲単位

- 1 tile = 4 ticks
- デフォルトビルドタワー: range = 200 ticks = 50 tiles

## よくある問題と解決策

| エラー | 原因 | 解決策 |
|--------|------|--------|
| `ClassNotFoundException: electril-build-tower.electril-build-towerMod` | `"java": true` がある | `mod.json` から削除 |
| MODがリストに表示されない | `mod.json` の構文エラー | JSON構文を確認 |
| 範囲は広がるが効果がない | `unitType.buildRange` 未変更 | `main.js` で両方を変更 |
| `minGameVersion` エラー | バージョンが古い | 現在のMindustryバージョンに合わせる |

## 参考リソース

### ソースコード
- [BuildTurret.java](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/world/blocks/defense/BuildTurret.java)
- [Blocks.java](https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/content/Blocks.java)

### ドキュメント
- [Mindustry Official Wiki - Modding](https://mindustrygame.github.io/wiki/modding/1-modding/)
- [Mindustry API Documentation](https://mindustrygame.github.io/docs/)
- [Mindustry Modding Guide](https://simonwoodburyforget.github.io/mindustry-modding/)

### 参考MOD
- `D:\Prj\AureusStratus-ExoGenesis` - Elecian勢力を含む大規模MOD

## 拡張アイデア

将来的に追加可能な機能:

1. **勢力固有のビルドタワー**: Elecian専用の新しいビルドタワーを作成
2. **設定可能な倍率**: ユーザーが範囲倍率を設定できるようにする
3. **他の支援ブロックの拡張**: Regen Projector、Shockwave Towerなど

## 開発時の注意事項

- MindustryのバージョンアップでAPIが変わる可能性がある
- 新しいバージョンでは `BuildTurret` の実装が変わる可能性がある
- 常に公式Wikiとソースコードを確認する
