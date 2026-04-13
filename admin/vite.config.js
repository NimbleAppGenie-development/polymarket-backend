import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    modules: {
        scopeBehaviour: "local", // Use local scope for CSS Modules
    },
    css: {
        modules: {
            scopeBehaviour: "local",
        },
    },
    build: {
        cssCodeSplit: true,
    },
    server: {
        port: 8032,
    },
    preview: {
        port: 8032,
    },
});
