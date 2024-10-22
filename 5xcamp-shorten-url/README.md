# 5xcamp-Shorten-URL

這是一個使用 **Next.js**、**MongoDB** 和 **Mongoose** 打造的 URL 縮址服務，並使用 **TailwindCSS** 進行網站樣式設計、**Zod** 進行資料驗證。

若想實際操作網站，可造訪[部署連結](https://5xcamp-17th-interview.vercel.app/)

## 功能特色

- **縮短網址**：將長網址轉換成簡短的可分享連結。
- **自定義短網址**：可選擇自定義短網址。
- **網址啟用管理**：可切換短網址是否啟用。
- **MongoDB 整合**：使用 MongoDB 儲存並檢索完整網址。
- **Zod 驗證**：使用 Zod 進行輸入驗證，確保資料有效性。
- **Axios 與 Cheerio**：從網址中抓取頁面元數據，如標題等資訊。

## 專案結構

專案基於 Next.js 預設的專案結構，並定義了自訂的 API 路由來處理縮址邏輯。使用 **Mongoose** 與 **MongoDB** 進行數據交互，並透過 **Zod** 進行資料的驗證。

```console
.
├── README.md               # 專案說明文件
├── app                     # Next.js 應用的主要部分
│   ├── Homepage
│   │   └── page.tsx        # 首頁頁面
│   ├── favicon.ico
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css         # 全域樣式檔
│   ├── layout.tsx          # 佈局元件
│   └── page.tsx            # 預設首頁
├── models
│   └── Url.ts              # URL 資料模型
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pages                   # API 路由與動態頁面
│   ├── [shortUrl].ts       # 動態短網址重定向處理
│   └── api
│       ├── check-url.ts    # 檢查網址 API
│       ├── get-page-info.ts# 獲取頁面信息 API
│       └── urls.ts         # 用於處理短網址的 API
├── postcss.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── types                   # TypeScript 型別定義
│   ├── global.d.ts
│   └── tailwindcss.d.ts
└── utils
    └── dbConnect.ts        # MongoDB 連接實用函數
```

## 技術棧

- **框架**： [Next.js](https://nextjs.org/) - React 應用框架。
- **資料庫**： [MongoDB](https://www.mongodb.com/) - 用於儲存網址的 NoSQL 資料庫。
- **ORM**： [Mongoose](https://mongoosejs.com/) - 與 MongoDB 交互的物件模型工具。
- **樣式**： [Tailwind CSS](https://tailwindcss.com/) - CSS 框架。
- **驗證**： [Zod](https://zod.dev/) - TypeScript 驗證與型別聲明的工具。

## 如何開始

### 必要條件

- **Node.js**：>= 18.x.x
- **MongoDB Atlas 或本地端 MongoDB**：專案需要 MongoDB 作為後端數據庫 (推薦使用 MongoDB Atlas 雲端服務)。

### 安裝步驟

1. **克隆專案**：

   ```bash
   git clone https://github.com/your-username/5xcamp-shorten-url.git
   cd 5xcamp-shorten-url
   ```

2. **安裝相依套件**：

   ```bash
   npm install
   ```

3. **設置環境變數**：

   在專案根目錄下創建 `.env.local` 檔案，並添加以下變數：

   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

   將 `<username>` 與 `<password>` 替換為你的 MongoDB Atlas 資料庫憑證。

4. **啟動開發伺服器**：

   ```bash
   npm run dev
   ```

   開啟 [http://localhost:3000](http://localhost:3000) 瀏覽專案頁面。

## API 路由

### `POST /api/check-url`

檢查傳入的完整網址是否已存在於資料庫中。若已存在，返回短網址與啟用狀態。

#### 請求範例

```json
{
  "fullLink": "https://example.com"
}
```

#### 回應範例

- **200 OK**：返回短網址與啟用狀態。
- **404 Not Found**：若資料庫中無此網址。

```json
{
  "shortUrl": "http://localhost:3000/abc123",
  "activate": true
}
```

### `POST /api/get-page-info`

從提供的網址中抓取頁面資訊（如：標題與描述）。

#### 請求範例

```json
{
  "url": "https://example.com"
}
```

#### 回應範例

- **200 OK**：返回標題與描述。

```json
{
  "title": "Example Page",
  "description": "A description of the page."
}
```

### `PATCH /api/urls`

更新短網址的啟用狀態或其他屬性。

#### 請求範例

```json
{
  "fullLink": "https://example.com",
  "shortLink": "http://localhost:3000/abc123",
  "activate": true
}
```

## 部署

本專案可以輕鬆部署至 **Vercel**，步驟如下：

1. **創建 Vercel 帳號** 並連結你的 GitHub 儲存庫。
2. **設置環境變數**：
   - 將 `.env.local` 中的變數新增到 Vercel 的環境變數設置頁面。
3. **部署**：連接你的儲存庫並依照 Vercel 指引進行部署。

若使用 MongoDB Atlas，請確保資料庫連接設定已正確指向你的雲端資料庫。

## 授權條款

此專案根據 MIT 授權條款發布，詳情請參閱 [LICENSE](LICENSE) 檔案。

---

若有任何問題或建議，歡迎隨時聯絡我：

- [Facebook](https://www.facebook.com/chienchuan.wang)
- [LinkedIn](https://www.linkedin.com/in/chienchuanw/)
