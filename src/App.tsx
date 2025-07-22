import ReactLogo from "@assets/react.svg"
import { Button, Modal, Spin } from "antd"
import csn from "classnames"
import html2canvas from "html2canvas"
import { useAtom } from "jotai"
import { useRef, useState } from "react"
import { ThemeModeAtom } from "./main"
import "./index.css"

function App() {
  const elementRef = useRef<HTMLDivElement>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [themeMode, setThemeMode] = useAtom(ThemeModeAtom)

  const onScreenshot = () => {
    const element = elementRef?.current

    if (!element) return
    html2canvas(element, {
      useCORS: true,
      scale: 2,
    }).then(canvas => {
      canvas.toBlob(blob => {
        if (blob) {
          setBlob(blob)
          setModalOpen(true)
        }
      }, "image/png")
    })
  }

  const close = () => {
    setModalOpen(false)
    setBlob(null)
  }

  const toggleTheme = () => {
    const theme = themeMode === "light" ? "dark" : "light"
    setThemeMode(theme)
    document.documentElement.classList.value = theme
  }

  return (
    <div className={csn("p-4 text-center", themeMode === "dark" ? "darkMode " : "")}>
      <div ref={elementRef} className={csn("p-4 text-center", themeMode === "dark" ? "darkMode " : "")}>
        <div className="flex justify-center items-center gap-2 mb-4 h-9">
          <Button type="default">你好</Button>
          <Button type="primary" className="h-9 leading-9" onClick={toggleTheme}>
            切换主题
          </Button>
          <Button type="primary" className="h-9 leading-9" onClick={onScreenshot}>
            截图
          </Button>
        </div>
        <div className="flex justify-center items-center">
          <ReactLogo />
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      </div>
      <Modal
        title={"截图预览"}
        open={modalOpen}
        width={1000}
        onCancel={_e => close()}
        onOk={() => close()}
        centered={true}
      >
        <div>
          {blob ? (
            <div className="w-full h-[80vh]">
              <img
                className="border border-borderColor border-solid w-full object-contain"
                src={URL.createObjectURL(blob)}
                alt={""}
              />
            </div>
          ) : (
            <Spin />
          )}
        </div>
      </Modal>
    </div>
  )
}

export default App
