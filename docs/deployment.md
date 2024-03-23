## Koyeb.com へデプロイする場合（推奨 / 無料）

[Koyeb 公式ドキュメント](https://www.koyeb.com/docs/build-and-deploy/build-from-git) も参照してください。

もし、デプロイで問題が起きた場合、競技時間内であれば運営がサポートします。

1. このレポジトリを自分のレポジトリに fork します
   - https://github.com/CyberAgentHack/web-speed-hackathon-2024/fork
2. [Koyeb.com](https://app.koyeb.com/auth/signin) にログインします
3. 「Create Web Servie」を選択します
   - ![](./assets/315193605-3af9858e-ac66-428d-84ad-20ff2138a17d.png)
4. 「GitHub」を選択します
   - ![](./assets/315193991-555ce520-c691-4857-b7a2-7425a5ee7dd0.png)
5. Fork したレポジトリを選択します
   - ![](./assets/315194852-25c04bd7-51c6-499a-acfa-d42226d8ea4e.png)
6. フォークしたレポジトリの main ブランチが変更されると、自動でデプロイされます

## Render へデプロイする場合

> Koyeb へのアクセスができない場合、こちらの方法を利用してください。

[Render 公式ドキュメント](https://render.com/docs) も参照してください。

1. このレポジトリを自分のレポジトリに fork します
   - https://github.com/CyberAgentHack/web-speed-hackathon-2024/fork
2. ブランチを deploy-render に変更します
3. [render.com](https://dashboard.render.com) にログインします
4. Dashboard から `New +` を選択し、`Web Service` を選択します。
   - ![](./assets/33037c38-8de8-4803-b70f-5ed2b865f8a9.png)
5. `Build and deploy from a Git repository` を選択します。
   - ![](./assets/815f76c2-68cd-499d-acc9-97b7b33f21f0.png)
6. Fork したレポジトリを選択します。
   - ![](./assets/00948af6-0973-487e-b338-940e10e91ed6.png)
7. Branch は `deploy-render` を選択します。
   - ![](./assets/746a8b87-3aee-4407-a4e4-450b3f7c49df.png)
8. Free プランを選択します。
   - ![](./assets/1f6cf4b1-acdf-420d-b10d-4520c5ca5459.png)
9. ほかはデフォルトのままで `Create Web Service` を選択します。
   - ![](./assets/05ed655b-544d-4f77-998e-e0987a065550.png)
10. フォークしたレポジトリの main ブランチが変更されると、自動でデプロイされます。

## Koyeb.com 外へデプロイする場合

- 無料の範囲内であれば、Koyeb.com 以外へデプロイしてもかまいません
  - **外部のサービスは全て無料枠の範囲内で使用してください**
    - :warning: **万が一コストが発生した場合は、全て自己負担となります**
  - Koyeb.com 外へのデプロイについて、運営からサポートしません
  - デプロイ方法がわからない方は Koyeb.com で立ち上げることをオススメします
