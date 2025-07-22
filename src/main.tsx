import { StyleProvider } from "@ant-design/cssinjs"
import "@ant-design/v5-patch-for-react-19"
import { ConfigProvider, theme } from "antd"
import { Provider, useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { type FC, StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"

export const ThemeModeAtom = atomWithStorage<"light" | "dark">("theme", "light")

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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <StyleProvider layer>
        <ThemeSwitch />
      </StyleProvider>
    </Provider>
  </StrictMode>,
)
