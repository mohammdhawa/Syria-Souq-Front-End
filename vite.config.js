import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { colorScheme } from "vite-plugin-color-scheme";
export default defineConfig({
  plugins: [
    react(),
    colorScheme({
      scheme: "light",
      forcedColorScheme: "light",
      enableSystem: false,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
