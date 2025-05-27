import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@/hooks/use-theme";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="typetone-theme">
    <App />
  </ThemeProvider>
);
