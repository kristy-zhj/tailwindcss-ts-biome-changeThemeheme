import {
  CloseCircleFilled,
  LeftOutlined,
  MinusOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons"
import FullScreenExitOutIcon from "@assets/icons/full-screen-exit-out.svg"
import FullScreenOutIcon from "@assets/icons/full-screen-out.svg"
import { Button, Select, Spin } from "antd"
import csn from "classnames"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { type FC, Suspense, useCallback, useEffect, useRef, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { PrintPreview } from "@/features/report/print-preview"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

export const PreviewReport: FC<{}> = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [totalPages, setTotalPage] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [render, setRender] = useState(false)
  const [scale, setScale] = useState(1.25)
  const [pdfUrl, setPdfUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [spmResult] = useState({})

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: any) => {
      if (!pdfUrl) return
      setTotalPage(numPages)
      setRender(true)
    },
    [pdfUrl],
  )

  const onDocumentLoadError = (e: any) => {
    console.log(e)
  }
  const onSourceError = (e: any) => {
    console.log("source", e)
  }

  useEffect(() => {
    setTimeout(() => {
      pdf()
    }, 300)
    return () => {
      setTotalPage(0)
      setPdfUrl("")
    }
  }, [])

  const onSave = (blob: Blob) => {
    // reportApiClient
    //   .uploadReport(
    //     { ReportPdf: blob },
    //     {
    //       params: { AnalysisId: analysisId },
    //       headers: { "Content-Type": "multipart/form-data" },
    //     },
    //   )
    //   .catch(e => console.log(e))
  }
  const onPrint = () => {
    setLoading(true)
    const a = document.createElement("a")
    a.href = pdfUrl
    a.download = "analysis report.pdf"
    a.click()
    a.remove()
    setLoading(false)
  }

  useEffect(() => {
    const dom = document.querySelector(".pdf-list")
    if (!dom) return
    dom.scrollTop = currentPage * 220 - 650
    const page = document.querySelector(".show-page")
    page?.scrollTo(0, 0)
  }, [currentPage])

  const pdf = () => {
    const dom = contentRef.current
    if (!dom) return
    dom.scrollTop = 0

    const config = {
      allowTaint: true,
      useCORS: true,
      scale: 2,
      logging: false,
      removeContainer: true,
    }

    requestAnimationFrame(async () => {
      try {
        const canvas = await html2canvas(dom, config)
        const pdf = new jsPDF("p", "pt", "a4")
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        const scale = pageWidth / canvas.width
        const imgHeight = canvas.height * scale
        const rawPages = imgHeight / pageHeight
        const totalPages = Math.floor(rawPages + (rawPages % 1 > 0.1 ? 1 : 0))

        for (let i = 0; i < totalPages; i++) {
          const currentY = (i * pageHeight) / scale
          const remainingHeight = canvas.height - currentY
          const currentHeight = Math.min(pageHeight / scale, remainingHeight)

          const tempCanvas = document.createElement("canvas")
          tempCanvas.width = canvas.width
          tempCanvas.height = currentHeight
          const ctx = tempCanvas.getContext("2d")
          ctx?.drawImage(
            canvas,
            0,
            currentY,
            canvas.width,
            currentHeight,
            0,
            0,
            tempCanvas.width,
            tempCanvas.height,
          )

          pdf.addImage(
            tempCanvas.toDataURL("image/png", 1),
            "PNG",
            0,
            0,
            pageWidth,
            currentHeight * scale,
            undefined,
            "FAST",
          )

          tempCanvas.width = 0
          tempCanvas.height = 0

          if (i < totalPages - 1) pdf.addPage()
        }

        const pdfBlob = pdf.output("blob")
        if (pdfBlob) {
          onSave(pdfBlob)
        }
        URL.revokeObjectURL(pdfUrl)
        setPdfUrl(URL.createObjectURL(pdfBlob))
        canvas.width = 0
        canvas.height = 0
        // dom.replaceChildren()
      } catch (error) {
        console.log(error)
      }
    })
  }

  return (
    <div className={csn("h-[calc(100vh_-_48px)] overflow-hidden w-full gap-[28px] text-white/90")}>
      {!spmResult ? (
        <DataEmpty />
      ) : !pdfUrl ? (
        <LoadingModal />
      ) : (
        <Document
          className={csn("flex h-full w-full items-center gap-[28px]")}
          file={pdfUrl}
          loading={
            <div
              className={csn("flex h-full      w-[calc(100vw_240px)] items-center justify-center")}
            ></div>
          }
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          onSourceError={onSourceError}
        >
          {/* 目录 */}
          <div className="w-[320px] h-full overflow-y-auto pdf-list">
            {render ? (
              new Array(totalPages).fill(0).map((_v, k) => (
                <div
                  key={`${k + 1}`}
                  className={csn("mb-8 flex cursor-pointer flex-col items-center justify-center")}
                  onClick={() => setCurrentPage(k + 1)}
                >
                  <Suspense fallback={<Spin />}>
                    <Page
                      className={csn(
                        "!bg-transparent",
                        currentPage === k + 1
                          ? "!border-blue-500 border-4 border-solid"
                          : "border-4 border-blue-100 border-solid",
                      )}
                      pageNumber={k + 1}
                      height={152}
                      width={108}
                      loading={
                        <div className={csn("flex h-full w-full items-center justify-center")}>
                          <Spin size="large" />
                        </div>
                      }
                    />
                  </Suspense>
                  <div
                    className={csn(
                      "mt-2 text-lg text-white/90",
                      currentPage === k + 1 ? "!text-fill" : "",
                    )}
                  >
                    {k + 1}
                  </div>
                </div>
              ))
            ) : (
              <Spin className="flex justify-center items-center w-full h-full" size="large" />
            )}
          </div>
          <div className="flex flex-col flex-1 justify-between items-center border border-white/10 border-solid rounded-lg h-full overflow-y-auto">
            {/* 工具 */}
            <div className="flex items-center gap-[12px] bg-white/10 px-4 w-full h-[44px] text-[14px]">
              <div className="bg-white/10 rounded-lg w-[34px] h-[28px] text-center leading-[28px]">
                {currentPage}
              </div>{" "}
              /<div>{totalPages}</div>
              <div className="bg-white/10 ml-[8px] w-[1px] h-[16px]"></div>
              <Button
                type="text"
                className="px-0 w-[28px]"
                disabled={scale <= 1.25}
                onClick={() => setScale(prev => prev - 0.25)}
              >
                <MinusOutlined />
              </Button>
              <Select
                className="[&>.ant-select-selector]:!bg-white/10 bg-none [&>.ant-select-selector]:!border-none [&>.ant-select-selector]:rounded-[8px] w-[80px]"
                value={scale}
                onChange={e => setScale(e)}
                options={[
                  { label: "125%", value: 1.25 },
                  { label: "150%", value: 1.5 },
                  { label: "175%", value: 1.75 },
                  { label: "200%", value: 2 },
                  { label: "225%", value: 2.25 },
                  { label: "250%", value: 2.5 },
                  { label: "275%", value: 2.75 },
                ]}
              />
              <Button
                type="text"
                className="px-0 w-[28px]"
                disabled={scale >= 2.75}
                onClick={() => setScale(prev => prev + 0.25)}
              >
                <PlusOutlined />
              </Button>
              <div className="bg-white/10 w-[1px] h-[16px]"></div>
              <Button
                type="text"
                className="px-0 w-[28px]"
                onClick={() => {
                  if (scale > 1.25) {
                    setScale(1.25)
                  } else {
                    setScale(2.75)
                  }
                }}
              >
                {scale > 1.25 ? <FullScreenExitOutIcon /> : <FullScreenOutIcon />}
              </Button>
              <Button
                type="primary"
                loading={loading}
                onClick={() => {
                  onPrint()
                }}
              >
                下载报告
              </Button>
            </div>
            {/* currentPage */}
            <div className="relative flex flex-col flex-1 justify-center items-center w-full overflow-hidden">
              <div
                className="bg-white border border-gray-200 overflow-auto show-page"
                style={{
                  height: `${841 * scale}px`,
                  width: `${594 * scale}px`,
                }}
              >
                <Page
                  className="!bg-transparent"
                  scale={scale}
                  pageNumber={currentPage}
                  height={841}
                  loading={
                    <div className={csn("flex h-full w-full items-center justify-center")}>
                      <Spin size="large" />
                    </div>
                  }
                />
              </div>
              <Button
                type="primary"
                className="top-[45%] left-[355px] z-10 !fixed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <LeftOutlined />
              </Button>
              <Button
                type="primary"
                className="top-[45%] right-[40px] z-10 !fixed"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <RightOutlined />
              </Button>
            </div>
          </div>
        </Document>
      )}
      {/* 打印 */}
      <div className="top-[100vh] left-0 -z-10 fixed">
        {/* <div className="top-[100px] right-[100px] z-10 !fixed bg-white h-[90%] overflow-y-auto"> */}
        <div
          className="relative px-[90px] w-[595px] h-full text-black print-content"
          ref={contentRef}
        >
          <PrintPreview />
        </div>
      </div>
    </div>
  )
}

export const LoadingModal = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Spin size="large" />
      <div className="mt-4 text-lg">正在生成报告...</div>
    </div>
  )
}
export const DataEmpty = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <CloseCircleFilled className="text-red-700 text-5xl" />
      <div className="mt-4 text-lg">暂无分析数据，报告生成失败</div>
    </div>
  )
}
