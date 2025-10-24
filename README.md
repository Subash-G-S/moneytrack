# 💰 MoneyTracker — Smart Personal Finance Manager

MoneyTracker is a **modern personal finance web app** built with React + TypeScript + Firebase.  
It allows users to **track income, expenses, generate reports, view transaction history, and use an integrated calculator** — all in one place.

---

## 🚀 Features

### 🏠 Dashboard
- Overview of **total income**, **expenses**, and **net balance**.
- Displays recent transactions for quick insights.

### ➕ Add Transaction
- Add new transactions dynamically.
- Choose type (**income** / **expense**) and add category, amount, and description.
- Automatically saves to Firestore with timestamps.

### 📜 History
- View all transactions with **filters** for search, type, and category.
- Transactions sorted by latest date.
- Clean UI for easy browsing.

### 📊 Reports
- Generate **financial reports** with date filters.
- Summarized totals for income, expenses, and balance.
- **Export as PDF** with jsPDF + autoTable integration.

### 🧮 Calculator
- Built-in simple calculator for quick calculations.
- Supports arithmetic operations ( + , - , * , / ).
- Designed with a consistent UI theme.

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + TypeScript |
| **UI Components** | Shadcn/UI, TailwindCSS, Lucide Icons |
| **Backend** | Firebase Firestore |
| **PDF Export** | jsPDF + autoTable |
| **Auth** | Firebase Authentication |
| **State Management** | React Hooks |
| **Date Handling** | date-fns |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Subash-G-S/moneytrack.git
cd mobile-money-box-main
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set up Firebase
- Create a Firebase project.
- Enable Firestore and Authentication (Email/Password).
- Create `.env` file and add your Firebase config:
  ```env
  VITE_FIREBASE_API_KEY=your_api_key
  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  ```

### 4️⃣ Run the development server
```bash
npm run dev
```

App will run on `http://localhost:5173` (Vite default).

---

## 📂 Folder Structure

```
src/
├── components/
│   ├── AddTransactionForm.tsx
│   ├── Dashboard.tsx
│   ├── History.tsx
│   ├── Reports.tsx
│   ├── Calculator.tsx
│   └── ui/
├── hooks/
│   ├── use-auth.ts
│   └── use-toast.ts
├── lib/
│   └── firebase.ts
├── pages/
│   ├── Index.tsx
│   └── Login.tsx
└── main.tsx
```

---

## 🌙 Theme
- Supports **Dark / Light mode** toggle.
- Theme preference saved in `localStorage`.

---

## 🧑‍💻 Author
**G S Subash Chandra Bose**  
💼 GitHub: [Subash-G-S](https://github.com/Subash-G-S)  

---

## 📝 License
This project is open-source under the **MIT License**.

---

### 💡 “Track smart. Spend smarter.”