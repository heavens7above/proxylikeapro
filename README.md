# ProxySite (GENESIS)

Welcome to **ProxySite**, a complete proxy application featuring a robust Node.js backend and a modern "Browser Window" frontend interface. This project allows you to proxy web requests through a secure backend, bypassing CORS restrictions and simulating a browsing experience.

## 📂 Project Structure

The project is divided into two main parts:

- **`backend/`**: A Node.js/Express server that handles proxy requests, logging, and health checks.
- **`frontend/`**: A Vite-based web application acting as the user interface, complete with a simulated browser window.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v16 or higher recommended)
- **pnpm** (preferred package manager)
  - _If you don't have pnpm:_ `npm install -g pnpm`

---

### 1️⃣ Backend Setup

The backend is the heart of the application. It must be running for the frontend to work.

1.  **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure Environment:**
    - The project comes with a `.env` file. Ensure `PORT` is set (default is `8080`) and `PROXY_PASSWORD` is configured (default is usually `0Anapple.`).

4.  **Start the Server:**
    ```bash
    pnpm start
    ```

    - You should see: `Server running on port 8080`

---

### 2️⃣ Frontend Setup

The frontend provides the user interface.

1.  **Open a new terminal window** (keep the backend running).

2.  **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

3.  **Install dependencies:**

    ```bash
    pnpm install
    ```

4.  **Start the Development Server:**
    ```bash
    pnpm dev
    ```

    - The app will typically start at `http://localhost:8000`.

---

## 🎮 How to Use

1.  Open your browser and navigate to **`http://localhost:8000`**.
2.  You will see a "Browser Window" interface.
3.  **Authenticate:**
    - Look at the top-right header.
    - Enter the **Proxy Password** (Default: `0Anapple.`).
    - The status indicator should turn **Green** (Online).
4.  **Browse:**
    - Enter a URL (e.g., `example.com` or `https://google.com`) into the address bar inside the simulated window.
    - Press **Enter** or click **Go**.
5.  The content will load inside the frame!

---

## 🛠️ Troubleshooting

- **🔴 Backend Offline?**
  - The status indicator in the top-right will be Red or Yellow.
  - Make sure your backend terminal is still running.
  - Check if the `VITE_BACKEND_URL` in `frontend/.env` matches your backend address.

- **🔒 Authentication Failed?**
  - Ensure you are using the correct password defined in `backend/.env` files.

- **⚠️ Content Not Loading?**
  - Some websites deny being embedded in iframes (X-Frame-Options).
  - The proxy attempts to fetch content, but complex sites like YouTube or Facebook may not fully render due to their security policies.

---

## 📜 Development Notes

- **Frontend**: Built with Vite, Vanilla JS (ES Modules), and CSS Variables. Located in `frontend/src`.
- **Backend**: Built with Express.js. Handles rate limiting and request proxying.
- **Logs**: Backend logs are stored in `backend/logs/`.

Enjoy your ProxySite!
