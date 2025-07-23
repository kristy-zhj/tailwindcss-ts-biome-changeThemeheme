import { StyleProvider } from "@ant-design/cssinjs"
import "@ant-design/v5-patch-for-react-19"
import { Button, ConfigProvider, theme } from "antd"
import { atom, Provider, useAtom } from "jotai"
import { type FC, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { ErrorBoundary, type FallbackProps } from "react-error-boundary"
import App from "./App.tsx"

export const ThemeModeAtom = atom<"light" | "dark">("light")

const ThemeSwitch: FC = () => {
  const [themeMode, _setThemeMode] = useAtom(ThemeModeAtom)

  const themeConfig = {
    token: {
      // 公共主题变量（可根据主题模式动态调整）
      colorPrimary: themeMode === "light" ? "#1677ff" : "#722ed1", // 主色调
      borderRadius: 4,
    },
    algorithm:
      themeMode === "light"
        ? undefined // 默认浅色算法
        : themeMode === "dark"
          ? theme.darkAlgorithm // 深色算法
          : undefined,
  }
  return (
    <ConfigProvider theme={themeConfig}>
      <App />
    </ConfigProvider>
  )
}

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div role="alert" className="relative px-2 py-4 w-full h-full text-white">
      <h1>程序发生严重错误，记录该错误反馈给售后</h1>
      <div className="my-4 w-full overflow-wrap wrap-break-word whitespace-pre-wrap">
        {error.message}
      </div>
      <pre className="overflow-wrap wrap-break-word whitespace-pre-wrap">{error.stack}</pre>
      <Button onClick={resetErrorBoundary}>请重试</Button>
    </div>
  )
}
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary fallbackRender={ErrorFallback}>
    <StrictMode>
      <Provider>
        <StyleProvider layer>
          <ThemeSwitch />
        </StyleProvider>
      </Provider>
    </StrictMode>
  </ErrorBoundary>,
)
