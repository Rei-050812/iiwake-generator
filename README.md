# 🎰 言い訳ルーレット

中高大学生をターゲットにした「言い訳ルーレット」Webアプリです。
ルーレットを回してゾーンを決定し、AIが状況に応じた言い訳を生成します。

## 機能

- **🎲 言い訳ルーレット**: ルーレットを回してゾーンを決定
- **6つのゾーン**:
  - 真面目ゾーン (25%)
  - 普通ゾーン (25%)
  - ちょいふざけゾーン (25%)
  - 完全ネタゾーン (25%)
  - 超真面目ゾーン (2%) - レア
  - 伝説ゾーン (3%) - レア
- **💬 AIツッコミ**: 生成された言い訳に対してAIが切れ味のあるツッコミ
- **10個のシチュエーション**: 学校、友達、恋愛、バイトの4カテゴリー
- **✨ レアゾーン演出**: 超真面目・伝説ゾーン時の特別演出
- **📋 コピー機能**: ワンクリックでクリップボードにコピー
- **🔄 再生成機能**: もう一度ルーレットを回せる
- **📤 SNSシェア**: X(Twitter)でシェア可能
- **📜 生成履歴**: 過去5件の履歴を保存

## 技術スタック

- **Frontend**: Next.js 16 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Claude Haiku 4.5 (Anthropic API)
- **Deploy**: Vercel

## セットアップ

1. リポジトリをクローン

```bash
git clone https://github.com/Rei-050812/iiwake-roulette.git
cd iiwake-roulette
```

2. 依存関係をインストール

```bash
npm install
```

3. 環境変数を設定

`.env.local` ファイルを作成し、Anthropic APIキーを設定:

```
ANTHROPIC_API_KEY=your_api_key_here
```

4. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 でアプリが起動します。

## デプロイ

Vercelにデプロイする場合:

1. GitHubリポジトリをVercelに接続
2. 環境変数 `ANTHROPIC_API_KEY` を設定
3. デプロイ

## ライセンス

MIT
