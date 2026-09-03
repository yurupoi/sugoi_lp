# ⚡ Gemini 3.8 Flash — 超知能・超高速 体感ランディングページ (LP)

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-38bdf8?style=for-the-badge&logo=github)](https://yurupoi.github.io/sugoi_lp/)
[![Model](https://img.shields.io/badge/Model-Gemini%203.8%20Flash-9333ea?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Performance](https://img.shields.io/badge/Speed-250%2B%20TPS-10b981?style=for-the-badge)](https://yurupoi.github.io/sugoi_lp/)
[![Context](https://img.shields.io/badge/Context-1%2C000%2C000%20Tokens-f59e0b?style=for-the-badge)](https://yurupoi.github.io/sugoi_lp/)

Google DeepMindの次世代フロンティアモデル「**Gemini 3.8 Flash**」の圧倒的な知能とスピードを世界に示す、最高峰のインタラクティブ・ランディングページです。

🌐 **公開URL (GitHub Pages)**:  
👉 **[https://yurupoi.github.io/sugoi_lp/](https://yurupoi.github.io/sugoi_lp/)**

---

## 🌟 主な特徴 & 実装コンテンツ

### 1. ⚡ ヒーロー・ニューラルネットワーク演出
- **HTML5 Canvas 粒子物理演算**: マウスカーソルの引力・斥力にリアルタイム反応するシナプスエネルギー粒子。
- **ライブ・テレメトリHUD**:
  - 生成スループット: **248 tps**
  - 初回応答遅延 (TTFT): **82 ms**
  - コンテキスト長: **1,000,000 tokens**
  - MMLU-Pro 推論精度: **92.4%**

### 2. 🎮 4大インタラクティブ・プレイグラウンド (Live Simulator)
ユーザーがブラウザ上で直接操作して、その威力を体験できます：
1. **⚡ 超高速コード生成ストリーム**: 秒速250トークンの流れるようなタイピング生成と、生成コードの「3Dプレビュー即時実行（Three.js）」機能。
2. **👁️ マルチモーダル空間解析**: 次世代SoCダイ構造に対するレーザースキャンと、テンソルコア・HBMメモリの高精度バウンディングボックス特定。
3. **📚 100万トークン ニードル探索 (Needle in a Haystack)**: 100万トークンのコードマトリクスから特定の秘密鍵を114ms・100%精度で瞬時発見。
4. **🎙️ フルデュプレックス超低遅延音声対話**: 音声波形ビジュアライザーと、160ms前後のリアルタイム対話シミュレーション。

### 3. 📊 ベンチマークレーダー & ROIコスト削減計算機
- 主要フロンティアモデル（GPT-4o、Claude 5 Opus、Grok 4、Kimi K3、Claude 3.5 Sonnet、Llama 3.1 405B）との6次元レーダーチャート比較。
- 比較対象モデルごとの「年間コスト削減額」「削減されるユーザー待機時間」のリアルタイム動的試算シミュレーター。

### 4. 🏗️ アーキテクチャ・ベントーグリッド
- Apple/Stripe風の洗練されたグラスモーフィズムカードで、Flash-Attention v3、ネイティブマルチモーダル、1M長文キャッシュ等の技術的飛躍を解説。

### 5. 🔊 Web Audio API サイバーシンセ音響
- 外部音声ファイルを一切使わず、ブラウザのオシレーター合成で生成されるハイテクUI効果音（ワンクリックでON/OFF可能）。

---

## 🚀 ローカル起動方法

Node.js等の複雑な環境構築は不要です。Pythonの標準サーバーですぐに起動できます。

```bash
# リポジトリをクローン
git clone https://github.com/yurupoi/sugoi_lp.git
cd sugoi_lp

# ローカルサーバー起動
python -m http.server 8080
```

ブラウザで `http://localhost:8080` を開くだけで即座に動作します。

---

## 🌐 GitHub Pages の公開設定

本リポジトリには `.github/workflows/deploy.yml` が含まれており、`main` ブランチへのプッシュで自動的に GitHub Pages にデプロイされます。

### リポジトリ側の初回設定（必要な場合）:
1. GitHubリポジトリの **Settings** タブを開きます。
2. 左メニューの **Pages** を選択します。
3. **Build and deployment** の **Source** で **「GitHub Actions」** を選択します。
4. ワークフローが完了すると、`https://yurupoi.github.io/sugoi_lp/` で全世界からアクセス可能になります。

---

## 📄 ライセンス
MIT License
