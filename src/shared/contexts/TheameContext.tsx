import { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider, theme } from "antd";

type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(
    (localStorage.getItem("theme") as ThemeMode) || "light"
  );

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    localStorage.setItem("theme", mode);
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ConfigProvider
        theme={{
          algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
