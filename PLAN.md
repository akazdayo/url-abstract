# 概要
URLを入力したら、Geminiが要約してくれるWebアプリケーションサービス

# 技術構成
- Server
	- Website：Cloudflare
	- Pickup SNS：おうちさーばー
		- もし運用するならDB以外完全分離する必要がある
- Web
	- Web Framework: Astro
	- DB
		- Cloudflare KV
			- Contentのsha256をハッシュして主キーにすると、更新に対応できそう
	- Backend：TypeScriptでCloudflare Workersにデプロイする
	- Auth：飛ばす
		- 代わりに、localStorageに**生データ**でAPIキーを保持する
	- 

# ルーティング
- URL入力画面(TOP)
	- APIキーも入力できるとなおよい
- 履歴
	- 七日間だけ保持
	- Notion Web ClipperとかObsidian Web Clipperあたりに最適な表示にする。
- 要約の詳細表示画面
	- URL入力したらここにリダイレクト

