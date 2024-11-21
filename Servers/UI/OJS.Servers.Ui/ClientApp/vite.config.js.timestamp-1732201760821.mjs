// vite.config.js
import react from "file:///C:/Users/User/Documents/GitHub/OpenJudgeSystem/Servers/UI/OJS.Servers.Ui/ClientApp/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///C:/Users/User/Documents/GitHub/OpenJudgeSystem/Servers/UI/OJS.Servers.Ui/ClientApp/node_modules/vite/dist/node/index.js";
import svgr from "file:///C:/Users/User/Documents/GitHub/OpenJudgeSystem/Servers/UI/OJS.Servers.Ui/ClientApp/node_modules/vite-plugin-svgr/dist/index.js";
import { visualizer } from "file:///C:/Users/User/Documents/GitHub/OpenJudgeSystem/Servers/UI/OJS.Servers.Ui/ClientApp/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\User\\Documents\\GitHub\\OpenJudgeSystem\\Servers\\UI\\OJS.Servers.Ui\\ClientApp";
var forwardToAdmin = () => {
  return {
    name: "forward-to-admin-html",
    apply: "serve",
    enforce: "post",
    configureServer(server) {
      server.middlewares.use("/", (req, _, next) => {
        if (req.url.startsWith("/administration")) {
          req.url = "/admin.html";
        }
        next();
      });
    }
  };
};
var vite_config_default = defineConfig(({ mode }) => ({
  appType: "mpa",
  build: {
    sourcemap: mode === "staging",
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html"),
        admin: resolve(__vite_injected_original_dirname, "admin.html")
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      }
    }
  },
  plugins: [
    react(),
    svgr(),
    forwardToAdmin(),
    visualizer({ open: true, filename: "bundle-analysis.html" })
  ],
  server: { port: 5002 },
  resolve: {
    alias: {
      "src": resolve(__vite_injected_original_dirname, "src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcT3Blbkp1ZGdlU3lzdGVtXFxcXFNlcnZlcnNcXFxcVUlcXFxcT0pTLlNlcnZlcnMuVWlcXFxcQ2xpZW50QXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcT3Blbkp1ZGdlU3lzdGVtXFxcXFNlcnZlcnNcXFxcVUlcXFxcT0pTLlNlcnZlcnMuVWlcXFxcQ2xpZW50QXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Vc2VyL0RvY3VtZW50cy9HaXRIdWIvT3Blbkp1ZGdlU3lzdGVtL1NlcnZlcnMvVUkvT0pTLlNlcnZlcnMuVWkvQ2xpZW50QXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlLXBsdWdpbi1zdmdyL2NsaWVudFwiIC8+XG5cbi8vIEZvciBkZXZlbG9wbWVudCBzZXJ2ZXIsIHdlIHdhbnQgdG8gZm9yd2FyZCBhbGwgcmVxdWVzdHMgdG8gL2FkbWluaXN0cmF0aW9uIHRvIC9hZG1pbi5odG1sXG5jb25zdCBmb3J3YXJkVG9BZG1pbiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiAnZm9yd2FyZC10by1hZG1pbi1odG1sJyxcbiAgICAgICAgYXBwbHk6ICdzZXJ2ZScsXG4gICAgICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnLycsIChyZXEsIF8sIG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVxLnVybC5zdGFydHNXaXRoKCcvYWRtaW5pc3RyYXRpb24nKSkge1xuICAgICAgICAgICAgICAgICAgICByZXEudXJsID0gJy9hZG1pbi5odG1sJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgICBhcHBUeXBlOiAnbXBhJywgLy8gTXVsdGkgUGFnZSBBcHBsaWNhdGlvblxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHNvdXJjZW1hcDogbW9kZSA9PT0gJ3N0YWdpbmcnLFxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgICAgICBpbnB1dDoge1xuICAgICAgICAgICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpLFxuICAgICAgICAgICAgICAgIGFkbWluOiByZXNvbHZlKF9fZGlybmFtZSwgJ2FkbWluLmh0bWwnKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9ud2Fybih3YXJuaW5nLCB3YXJuKSB7XG4gICAgICAgICAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ01PRFVMRV9MRVZFTF9ESVJFQ1RJVkUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB3YXJuKHdhcm5pbmcpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICAgIHJlYWN0KCksXG4gICAgICAgIHN2Z3IoKSxcbiAgICAgICAgZm9yd2FyZFRvQWRtaW4oKSxcbiAgICAgICAgdmlzdWFsaXplcih7b3BlbjogdHJ1ZSwgZmlsZW5hbWU6ICdidW5kbGUtYW5hbHlzaXMuaHRtbCd9KSxcbiAgICBdLFxuICAgIHNlcnZlcjoge3BvcnQ6IDUwMDJ9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgICdzcmMnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgICB9LFxuICAgIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRiLE9BQU8sV0FBVztBQUM5YyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxlQUFlO0FBSnhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU0saUJBQWlCLE1BQU07QUFDekIsU0FBTztBQUFBLElBQ0gsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsZ0JBQWdCLFFBQVE7QUFDcEIsYUFBTyxZQUFZLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTO0FBQzFDLFlBQUksSUFBSSxJQUFJLFdBQVcsaUJBQWlCLEdBQUc7QUFDdkMsY0FBSSxNQUFNO0FBQUEsUUFDZDtBQUNBLGFBQUs7QUFBQSxNQUNULENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUNKO0FBRUEsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN2QyxTQUFTO0FBQUEsRUFDVCxPQUFPO0FBQUEsSUFDSCxXQUFXLFNBQVM7QUFBQSxJQUNwQixlQUFlO0FBQUEsTUFDWCxPQUFPO0FBQUEsUUFDSCxNQUFNLFFBQVEsa0NBQVcsWUFBWTtBQUFBLFFBQ3JDLE9BQU8sUUFBUSxrQ0FBVyxZQUFZO0FBQUEsTUFDMUM7QUFBQSxNQUNBLE9BQU8sU0FBUyxNQUFNO0FBQ2xCLFlBQUksUUFBUSxTQUFTLDBCQUEwQjtBQUMzQztBQUFBLFFBQ0o7QUFDQSxhQUFLLE9BQU87QUFBQSxNQUNoQjtBQUFBLElBQ0o7QUFBQSxFQUNKO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixXQUFXLEVBQUMsTUFBTSxNQUFNLFVBQVUsdUJBQXNCLENBQUM7QUFBQSxFQUM3RDtBQUFBLEVBQ0EsUUFBUSxFQUFDLE1BQU0sS0FBSTtBQUFBLEVBQ25CLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILE9BQU8sUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDbkM7QUFBQSxFQUNKO0FBQ0osRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
