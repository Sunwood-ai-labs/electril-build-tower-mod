# CLAUDE.md

このプロジェクトの開発ガイドは **AGENTS.md** に記載されています。

👉 **[AGENTS.md](./AGENTS.md)** を参照してください。

## クイックリファレンス

```bash
# コミット・プッシュ
git add . && git commit -m "message" && git push origin main

# テスト用MODフォルダへのコピー
xcopy /E /Y ".\*" "D:\SteamLibrary\steamapps\common\Mindustry\saves\mods\electril-build-tower-mod\"

# ログ確認
# D:\SteamLibrary\steamapps\common\Mindustry\saves\last_log.txt
```

## 重要な技術ポイント

- **BuildTurret** は初期化時に内部 `UnitType` を作成し、`range` の値を `unitType.buildRange` にコピーする
- 範囲を変更する場合は **両方** を変更する必要がある
- `"java": true` は JavaScript MOD では使用しない（ClassNotFoundExceptionエラーになる）

詳細は **[AGENTS.md](./AGENTS.md)** を参照。
