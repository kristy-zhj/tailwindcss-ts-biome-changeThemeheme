import { AlignCenterOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useAtom } from "jotai"
import { useLocation } from "wouter"
import { ThemeModeAtom } from "@/main"
import { ParamsReport } from "./params-report"

export const Header = () => {
  const [themeMode, setThemeMode] = useAtom(ThemeModeAtom)
  const [, setLocation] = useLocation()

  const toggleTheme = () => {
    const theme = themeMode === "light" ? "dark" : "light"
    setThemeMode(theme)
    document.documentElement.classList = theme
  }

  return (
    <div className="flex justify-center items-center gap-4 border-gray-200 border-b w-full h-12">
      <Button
        type="primary"
        className="flex justify-center items-center !text-base"
        onClick={toggleTheme}
      >
        切换主题
        <AlignCenterOutlined />
      </Button>
      <Button
        onClick={() => {
          setLocation("/")
        }}
      >
        首页
      </Button>
      <Button
        onClick={() => {
          setLocation("/settings/user-list")
        }}
      >
        系统设置
      </Button>
      <Button
        onClick={() => {
          setLocation("/report")
        }}
      >
        报告
      </Button>
      <Button
        onClick={() => {
          setLocation("/effect")
        }}
      >
        Effect Ts
      </Button>
      <ParamsReport />
    </div>
  )
}
