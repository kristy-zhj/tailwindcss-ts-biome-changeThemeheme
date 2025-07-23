import { AlignCenterOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { useAtom } from "jotai"
import { ThemeModeAtom } from "@/main"

export const Header = () => {
  const [themeMode, setThemeMode] = useAtom(ThemeModeAtom)
  const toggleTheme = () => {
    const theme = themeMode === "light" ? "dark" : "light"
    setThemeMode(theme)
    document.documentElement.classList = theme
  }

  return (
    <div className="flex justify-center items-center border-gray-200 border-b w-full h-12">
      <Button
        type="primary"
        className="flex justify-center items-center !text-base"
        onClick={toggleTheme}
      >
        切换主题
        <AlignCenterOutlined />
      </Button>
    </div>
  )
}
