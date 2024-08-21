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
var vite_config_default = defineConfig({
  appType: "mpa",
  build: {
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
  server: { port: 5002 }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcT3Blbkp1ZGdlU3lzdGVtXFxcXFNlcnZlcnNcXFxcVUlcXFxcT0pTLlNlcnZlcnMuVWlcXFxcQ2xpZW50QXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVc2VyXFxcXERvY3VtZW50c1xcXFxHaXRIdWJcXFxcT3Blbkp1ZGdlU3lzdGVtXFxcXFNlcnZlcnNcXFxcVUlcXFxcT0pTLlNlcnZlcnMuVWlcXFxcQ2xpZW50QXBwXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9Vc2VyL0RvY3VtZW50cy9HaXRIdWIvT3Blbkp1ZGdlU3lzdGVtL1NlcnZlcnMvVUkvT0pTLlNlcnZlcnMuVWkvQ2xpZW50QXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSBcInJvbGx1cC1wbHVnaW4tdmlzdWFsaXplclwiO1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnO1xuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlLXBsdWdpbi1zdmdyL2NsaWVudFwiIC8+XG5cbi8vIEZvciBkZXZlbG9wbWVudCBzZXJ2ZXIsIHdlIHdhbnQgdG8gZm9yd2FyZCBhbGwgcmVxdWVzdHMgdG8gL2FkbWluaXN0cmF0aW9uIHRvIC9hZG1pbi5odG1sXG5jb25zdCBmb3J3YXJkVG9BZG1pbiA9ICgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiAnZm9yd2FyZC10by1hZG1pbi1odG1sJyxcbiAgICAgICAgYXBwbHk6ICdzZXJ2ZScsXG4gICAgICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICAgICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgnLycsIChyZXEsIF8sIG5leHQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVxLnVybC5zdGFydHNXaXRoKCcvYWRtaW5pc3RyYXRpb24nKSkge1xuICAgICAgICAgICAgICAgICAgICByZXEudXJsID0gJy9hZG1pbi5odG1sJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbmV4dCgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBhcHBUeXBlOiAnbXBhJywgLy8gTXVsdGkgUGFnZSBBcHBsaWNhdGlvblxuICAgIGJ1aWxkOiB7XG4gICAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgICAgIGlucHV0OiB7XG4gICAgICAgICAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJyksXG4gICAgICAgICAgICAgICAgYWRtaW46IHJlc29sdmUoX19kaXJuYW1lLCAnYWRtaW4uaHRtbCcpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb253YXJuKHdhcm5pbmcsIHdhcm4pIHtcbiAgICAgICAgICAgICAgaWYgKHdhcm5pbmcuY29kZSA9PT0gJ01PRFVMRV9MRVZFTF9ESVJFQ1RJVkUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgd2Fybih3YXJuaW5nKVxuICAgICAgICAgICAgfX0sXG4gICAgICB9LFxuICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcmVhY3QoKSxcbiAgICAgICAgc3ZncigpLFxuICAgICAgICBmb3J3YXJkVG9BZG1pbigpLFxuICAgICAgICB2aXN1YWxpemVyKHsgb3BlbjogdHJ1ZSwgZmlsZW5hbWU6ICdidW5kbGUtYW5hbHlzaXMuaHRtbCcgfSksXG4gICAgXSxcbiAgICBzZXJ2ZXI6IHsgcG9ydDogNTAwMiB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRiLE9BQU8sV0FBVztBQUM5YyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsU0FBUyxrQkFBa0I7QUFDM0IsU0FBUyxlQUFlO0FBSnhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU0saUJBQWlCLE1BQU07QUFDekIsU0FBTztBQUFBLElBQ0gsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsU0FBUztBQUFBLElBQ1QsZ0JBQWdCLFFBQVE7QUFDcEIsYUFBTyxZQUFZLElBQUksS0FBSyxDQUFDLEtBQUssR0FBRyxTQUFTO0FBQzFDLFlBQUksSUFBSSxJQUFJLFdBQVcsaUJBQWlCLEdBQUc7QUFDdkMsY0FBSSxNQUFNO0FBQUEsUUFDZDtBQUNBLGFBQUs7QUFBQSxNQUNULENBQUM7QUFBQSxJQUNMO0FBQUEsRUFDSjtBQUNKO0FBRUEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUztBQUFBLEVBQ1QsT0FBTztBQUFBLElBQ0gsZUFBZTtBQUFBLE1BQ1gsT0FBTztBQUFBLFFBQ0gsTUFBTSxRQUFRLGtDQUFXLFlBQVk7QUFBQSxRQUNyQyxPQUFPLFFBQVEsa0NBQVcsWUFBWTtBQUFBLE1BQzFDO0FBQUEsTUFDQSxPQUFPLFNBQVMsTUFBTTtBQUNwQixZQUFJLFFBQVEsU0FBUywwQkFBMEI7QUFDN0M7QUFBQSxRQUNGO0FBQ0EsYUFBSyxPQUFPO0FBQUEsTUFDZDtBQUFBLElBQUM7QUFBQSxFQUNQO0FBQUEsRUFDRixTQUFTO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixLQUFLO0FBQUEsSUFDTCxlQUFlO0FBQUEsSUFDZixXQUFXLEVBQUUsTUFBTSxNQUFNLFVBQVUsdUJBQXVCLENBQUM7QUFBQSxFQUMvRDtBQUFBLEVBQ0EsUUFBUSxFQUFFLE1BQU0sS0FBSztBQUN6QixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
