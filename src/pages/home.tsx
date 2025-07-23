import ReactLogo from "@assets/react.svg"
import { Button, Modal, Spin } from "antd"
import csn from "classnames"
import html2canvas from "html2canvas-pro"
import { useAtom } from "jotai"
import { domToPng } from "modern-screenshot"
import { type FC, useRef, useState } from "react"
import { ThemeModeAtom } from "@/main"

export const Home: FC<{}> = () => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [blob, setBlob] = useState("")
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [themeMode] = useAtom(ThemeModeAtom)

  const onScreenshot1 = () => {
    const element = elementRef?.current
    if (!element) return console.log("element is null")
    domToPng(element, { scale: 2 })
      .then(dataUrl => {
        setBlob(dataUrl)
        setModalOpen(true)
      })
      .catch(error => {
        console.error("截图失败:", error)
      })
  }
  const onScreenshot = () => {
    const element = elementRef?.current
    if (!element) return console.log("element is null")
    html2canvas(element, { scale: 2 })
      .then(data => {
        setBlob(data.toDataURL())
        setModalOpen(true)
      })
      .catch(error => {
        console.error("截图失败:", error)
      })
  }

  const close = () => {
    setModalOpen(false)
    setBlob("")
  }

  return (
    <div className={csn("p-4 text-center", themeMode === "dark" ? "darkMode " : "")}>
      <div
        ref={elementRef}
        className={csn("p-4 text-center w-[500px] mx-auto", themeMode === "dark" ? "dark " : "")}
      >
        <div className="flex justify-center items-center gap-2 mb-4 h-9">
          <Button type="primary">Primary Button</Button>

          <Button type="default" className="h-9 leading-9" onClick={onScreenshot}>
            截图
          </Button>
        </div>
        <div className="my-4 border border-gray-600 w-full h-20 overflow-y-auto">
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
          <div>1</div>
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
                src={blob}
                alt="截图预览"
              />
            </div>
          ) : (
            <Spin className="flex justify-center" />
          )}
        </div>
      </Modal>
    </div>
  )
}
