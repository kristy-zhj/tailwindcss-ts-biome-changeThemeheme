import { Button, message } from "antd"
import html2canvas from "html2canvas-pro"
import jsPDF from "jspdf"
import { DateTime } from "luxon"
import { useEffect, useRef, useState } from "react"
import { match } from "ts-pattern"
import type { AbnormalRegionSchemaType } from "@/schema-types/report-schema"
import { Numerical } from "@/utils/digital-processing"

export type DataType = AbnormalRegionSchemaType & {
  id: string
  key: string
}

export const ParamsReport = () => {
  const [loading, setLoading] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const list: DataType[] = [
    {
      id: "1",
      key: "1",
      ContainedStructs: [
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
      ],
      Label: 1,
      NumberOfVoxels: 1,
      PeakIntensity: 3,
      PeakMNICoordinate: [1, 2, 3],
      PeakMICoordinateEnglishRegion: ["1", "2", "3"],
      PeakMICoordinateRegion: ["1", "2", "3"],
    },
    {
      id: "1",
      key: "1",
      ContainedStructs: [
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
        {
          Struct: "脑",
          Voxels: 1,
        },
      ],
      Label: 1,
      NumberOfVoxels: 1,
      PeakIntensity: 3,
      PeakMNICoordinate: [1, 2, 3],
      PeakMICoordinateEnglishRegion: ["1", "2", "3"],
      PeakMICoordinateRegion: ["1", "2", "3"],
    },
  ]

  const initPdfModal = () => {
    const A4_WIDTH = 595
    const A4_HEIGHT = 842
    const target = contentRef.current
    if (!target) return
    const pageHeight = (target.scrollWidth / A4_WIDTH) * A4_HEIGHT
    const lableListID = target.getElementsByClassName("print-item") as any
    if (!lableListID) return
    for (let i = 0; i < lableListID.length; i++) {
      const multiple = Math.ceil(
        (lableListID[i].offsetTop + lableListID[i].offsetHeight) / pageHeight,
      )
      const groups = lableListID[i].getElementsByClassName("group-item")
      if (!groups) return
      for (let j = 0; j < groups.length; j++) {
        const groupMultiple = Math.ceil((groups[j].offsetTop + groups[j].offsetHeight) / pageHeight)
        if (
          (groups[j] && groups[j].offsetTop + groups[j].offsetHeight < groupMultiple * pageHeight,
          groups[j + 1] &&
            groups[j + 1].offsetTop + groups[j + 1].offsetHeight > groupMultiple * pageHeight)
        ) {
          const divParent = groups[j].parentNode // 获取该div的父节点
          const newNode = document.createElement("div")
          newNode.className = "emptyDiv"
          const _H = groupMultiple * pageHeight - (groups[j].offsetTop + groups[j].offsetHeight)
          newNode.style.height = _H + 20 + "px"
          newNode.style.width = "100%"
          newNode.style.border = "1px solid transparent"
          newNode.style.borderTop = "1px solid black"
          // newNode.style.border = "1px solid blue"
          const next = groups[j].nextSibling // 获取div的下一个兄弟节点
          if (next) {
            divParent.insertBefore(newNode, next)
          } else {
            divParent.appendChild(newNode)
          }
        }
        if (j === groups.length - 1 && groups[groups.length - 1]) {
          const divParent = groups[groups.length - 1].parentNode // 获取该div的父节点
          const newNode1 = document.createElement("div")
          newNode1.className = "emptyDiv"
          const _H =
            groupMultiple * pageHeight -
            (groups[groups.length - 1].offsetTop + groups[groups.length - 1].offsetHeight)
          newNode1.style.height = _H + "px"
          newNode1.style.width = "100%"
          newNode1.style.border = "1px solid transparent"
          newNode1.style.borderTop = "1px solid black"
          // newNode1.style.border = "1px solid yellow"
          divParent.appendChild(newNode1)
        }
      }
      if (isSplit(lableListID, i, multiple * pageHeight)) {
        const divParent = lableListID[i].parentNode // 获取该div的父节点
        const newNode = document.createElement("div")
        newNode.className = "emptyDiv"
        const _H = multiple * pageHeight - (lableListID[i].offsetTop + lableListID[i].offsetHeight)
        newNode.style.height = _H + "px"
        newNode.style.width = "100%"
        newNode.style.border = "1px solid transparent"
        // newNode.style.border = "1px solid red"
        const next = lableListID[i].nextSibling // 获取div的下一个兄弟节点
        if (next) {
          divParent.insertBefore(newNode, next)
        } else {
          divParent.appendChild(newNode)
        }
      }
    }
    setTimeout(() => {
      downloadPdf()
    }, 500)
  }

  const isSplit = (nodes: any, index: any, pageHeight: number) => {
    if (
      nodes[index] &&
      nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight &&
      nodes[index + 1] &&
      nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
    ) {
      return true
    }
    return false
  }

  const downloadPdf = () => {
    const dom = contentRef.current
    if (!dom) return
    dom.scrollTop = 0
    setLoading(true)
    message.loading({
      key: "print",
      content: "加载中...",
      duration: 0,
    })
    let list: any = []
    let pageList: any = []
    let index = 1
    for (let i = 0; i < dom.children.length; i++) {
      const curr = dom.children[i] as HTMLElement
      if (curr.offsetTop + curr.offsetHeight <= 842 * 77 * index) {
        pageList.push(curr)
        if (i === dom.children.length - 1) {
          list.push(pageList)
          pageList = []
        }
      } else {
        list.push(pageList)
        pageList = []
        index += 1
        pageList.push(curr)
      }
    }
    for (let ii = 0; ii < list.length; ii++) {
      const newContainer = document.createElement("div")
      // 遍历筛选后的元素数组
      list[ii].forEach((element: Element) => {
        // 将筛选后的元素添加到新的 div 中
        newContainer?.appendChild(element)
      })
      newContainer.style.position = "fixed"
      newContainer.style.top = "100vh"
      newContainer.style.zIndex = "-100"
      newContainer.style.width = "794px"

      document.body.appendChild(newContainer)

      requestAnimationFrame(async () => {
        await html2canvas(newContainer, {
          allowTaint: true,
          width: newContainer.scrollWidth,
          height: newContainer.scrollHeight,
          useCORS: true,
          scale: 1,
        })
          .then(canvas => {
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
            newContainer.remove()
            pdf
              .save(
                `params report ${DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss")} ${ii + 1}.pdf`,
                { returnPromise: true },
              )
              .then(() => {
                setLoading(false)
                message.destroy("print")
              })
              .catch(() => {
                setLoading(false)
              })
          })
          .catch(e => {
            console.log(e)
          })
      })
    }
    list = []
  }

  useEffect(() => {
    if (loading) {
      initPdfModal()
    }
  }, [loading])

  return (
    <>
      <Button
        type="primary"
        className="bg-colorLink px-0 w-[120px]"
        loading={loading}
        onClick={() => {
          setLoading(true)
        }}
      >
        下载全部
      </Button>
      {loading && (
        <div className="top-[100vh] left-0 -z-10 fixed opacity-0">
          {/* <div className="invisible top-0 left-0 z-10 fixed"> */}
          <div className="relative bg-white pt-2 w-[794px] h-full print-content" ref={contentRef}>
            {list.map((item, k) => {
              return (
                <div className="mx-8 mt-4 text-black print-item" key={`${k + 0}`}>
                  {[
                    {
                      label: "Number of voxels",
                      value: "NumberOfVoxels",
                    },
                    {
                      label: "Peak MNI coordinate",
                      value: "PeakMNICoordinate",
                    },
                    {
                      label: "Peak MI coordinate region",
                      value: "PeakMICoordinateRegion",
                    },
                    { label: "Peak intensity", value: "PeakIntensity" },
                  ].map((v, k) => {
                    return (
                      <div
                        className="flex items-center border-t border-borderColor border-l border-solid min-h-[50px] text-base"
                        key={`${k + 0}`}
                      >
                        <div className="flex items-center bg-black/10 px-2 w-[230px] min-h-[50px]">
                          {v.label}
                        </div>
                        <div className="flex flex-1 items-center px-2 border-r border-borderColor border-l border-solid min-h-[50px]">
                          {item
                            ? match(v.value)
                                .with("NumberOfVoxels", () => item.NumberOfVoxels)
                                .with(
                                  "PeakMNICoordinate",
                                  () => `(${item.PeakMNICoordinate.join(", ")})`,
                                )
                                .with("PeakMICoordinateRegion", () =>
                                  item.PeakMICoordinateRegion.join("//"),
                                )
                                .with("PeakIntensity", () => Numerical(item.PeakIntensity))
                                .otherwise(() => "-")
                            : "-"}
                        </div>
                      </div>
                    )
                  })}
                  <div className="flex items-center bg-black/10 border-t border-borderColor border-l border-solid min-h-[50px] text-base">
                    <div className="px-2 w-[230px]">voxelsNumber</div>
                    <div className="flex flex-1 items-center px-2 border-r border-borderColor border-l border-solid min-h-[50px]">
                      structure
                    </div>
                  </div>
                  {item?.ContainedStructs.map((v, k) => {
                    return (
                      <div
                        className="group-item relative flex items-center border-t border-borderColor border-l border-solid min-h-[50px] text-base"
                        key={`${k + 0}`}
                      >
                        <div className="px-2 w-[230px]">{v.Voxels}</div>
                        <div className="flex flex-1 items-center px-2 border-r border-borderColor border-l border-solid min-h-[50px]">
                          {v.Struct}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
