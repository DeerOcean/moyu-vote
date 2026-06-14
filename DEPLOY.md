# 比稿投票部署步驟（GitHub Pages + Google 試算表）

連結最終長相：`https://deerocean.github.io/moyu-vote/`（獨立公開 repo，主專案保持私有）

## A. 出連結（GitHub Pages）
1. 手機/電腦開 github.com → New repository → 名稱 `moyu-vote` → **Public** → Create（空的就好，不用 README）。
2. 跟 Claude 說一聲 → Claude 把投票這包（imgs/ + index.html）push 上去。
3. 到 `moyu-vote` repo → Settings → Pages → Source 選 `main` branch、`/ (root)` → Save。
4. 等 1-2 分鐘，Pages 會顯示網址 `https://deerocean.github.io/moyu-vote/`。

## B. 收票（Google Apps Script → 試算表）
1. 開 https://sheets.google.com 新建一個試算表，命名「摸魚比稿投票」。
2. 該試算表選單 擴充功能 → Apps Script。
3. 把 `apps_script.gs` 的內容整段貼進去，存檔。
4. 右上「部署」→ 新增部署 → 類型選「網頁應用程式」：
   - 執行身分：我（你自己）
   - 誰可以存取：**任何人**
   - 部署 → 授權（會跳 Google 帳號授權，按允許）。
5. 複製「網頁應用程式 URL」（長得像 `https://script.google.com/macros/s/XXXX/exec`）給 Claude。
6. Claude 把這個 URL 焊進 index.html，重新 push → 完成，朋友投的票會自動進試算表。

## 看結果
- 試算表會逐列累積每一票（時間 / 投票人 / 勝者 / 敗者 / 平手）。
- 投票頁右下「看排行」會即時用 Elo 算出排名（連線模式會彙整所有人的票）。
