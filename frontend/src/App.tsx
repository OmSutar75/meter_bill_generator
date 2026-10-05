import React, { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import BillCalculatorPage, {
  type BillRecord,
} from "./components/BillCalculatorPage";
import BillHistoryPage from "./components/BillHistory";
import { apiService } from "./services/api";

type ViewPage = "login" | "register" | "calculator" | "history";

interface AuthResponse {
  authenticated: boolean;
  email?: string;
  name?: string;
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<ViewPage>("login");
  const [billHistory, setBillHistory] = useState<BillRecord[]>([]);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // --- 1. Check with Backend on App Startup ---
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await apiService.get<AuthResponse>("api/user/me");
        if (response.authenticated) {
          setCurrentPage("calculator");
        } else {
          setCurrentPage("login");
        }
      } catch (error) {
        // Unauthenticated session or error fallback to login
        setCurrentPage("login");
      } finally {
        setLoadingAuth(false);
      }
    };

    checkAuthStatus();
  }, []);

  // --- 2. Save Bill to Backend Database ---
  const handleSaveBill = async (
    billData: Omit<BillRecord, "id" | "generatedAt"> | BillRecord,
  ): Promise<BillRecord> => {
    try {
      const savedBillFromBackend = await apiService.post<BillRecord>(
        "bills",
        billData,
      );

      setBillHistory((prev) => [savedBillFromBackend, ...prev]);
      return savedBillFromBackend;
    } catch (error) {
      console.error("Failed to save bill to backend:", error);

      const fallbackBill: BillRecord = {
        ...billData,
        id: Math.floor(1000 + Math.random() * 9000),
        generatedAt: new Date().toLocaleString(),
      };
      setBillHistory((prev) => [fallbackBill, ...prev]);
      return fallbackBill;
    }
  };

  // --- 3. Fetch Saved Bills History ---
  const fetchBillHistory = async () => {
    try {
      const data = await apiService.get<BillRecord[]>("bills");
      setBillHistory(data);
    } catch (error) {
      console.error("Failed to fetch history from backend:", error);
    }
  };

  useEffect(() => {
    if (currentPage === "history") {
      fetchBillHistory();
    }
  }, [currentPage]);

  // Handle Logout action
  const handleLogout = async () => {
    try {
      await apiService.post("user/logout", {});
    } catch (e) {
      console.error(e);
    } finally {
      setCurrentPage("login");
    }
  };

  // Render Loading Spinner while backend decides authentication state
  if (loadingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading application session...</p>
      </div>
    );
  }

  return (
    <main>
      {currentPage === "login" && (
        <LoginPage
          onLoginSuccess={() => setCurrentPage("calculator")}
          onNavigateToRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage onNavigateToLogin={() => setCurrentPage("login")} />
      )}

      {currentPage === "calculator" && (
        <BillCalculatorPage
          onSaveBill={handleSaveBill}
          onNavigateToHistory={() => setCurrentPage("history")}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "history" && (
        <BillHistoryPage
          history={billHistory}
          onBackToCalculator={() => setCurrentPage("calculator")}
        />
      )}
    </main>
  );
};

export default App;
