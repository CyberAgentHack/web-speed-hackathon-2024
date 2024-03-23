## 採点方法

1. [Lighthouse](https://github.com/GoogleChrome/lighthouse) を用いて、次の2つを検査します
   - ページランディング（100点満点）
   - ユーザーフロー（50点満点）
2. 検査したそれぞれのスコアを合算し、得点とします
3. **レギュレーションに違反している場合、順位対象外とします**

### ページランディング

1. [Lighthouse](https://github.com/GoogleChrome/lighthouse) を用いて、次の計4つのページを検査します
   - ホームページ
   - 作者詳細ページ
   - 作品詳細ページ
   - エピソードページ（漫画ビュアーページ）
1. 各ページごと [Lighthouse v10 Performance Scoring](https://web.dev/performance-scoring/#lighthouse-10) に基づき、次の総和をページのスコアとします
   - First Contentful Paint のスコア × 10 (0-10 点)
   - Speed Index のスコア × 10 (0-10 点)
   - Largest Contentful Paint のスコア × 25 (0-25 点)
   - Total Blocking Time のスコア × 30 (0-30 点)
   - Cumulative Layout Shift のスコア × 25 (0-25 点)

### ユーザーフロー

1. [Lighthouse](https://github.com/GoogleChrome/lighthouse) を用いて、次の計3つのユーザーフローを検査します
   - 漫画を検索する
   - 漫画ビュアーでページをめくる
   - フッターにある「利用規約」を開く
   - 管理画面にログインする
   - 管理画面で作品を検索し、作品の情報を編集する
   - 管理画面で新しいエピソードを作る
1. 各ユーザーフローごと 、次の総和をユーザーフローのスコアとします
   - Total Blocking Time のスコア × 25 (0-25 点)
   - Interaction to Next Paint のスコア × 25 (0-25 点)
