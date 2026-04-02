# Node.jsの軽量版を使用
FROM node:20-slim

# 作業ディレクトリを設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# 残りのソースコードをコピー
COPY . .

# Viteのデフォルトポートを開放
EXPOSE 5173

# 開発サーバーを起動（ホストを0.0.0.0に指定して外部アクセスを許可）
CMD ["npm", "run", "dev", "--", "--host"]