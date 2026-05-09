import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["@tanstack/react-router"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-popover",
            "@radix-ui/react-dropdown-menu",
          ],
          supabase: ["@supabase/supabase-js"],
        },
      },
    },
  },
});
