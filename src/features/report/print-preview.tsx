import { CloseCircleFilled } from "@ant-design/icons"
import ImageTextIcon from "@assets/icons/report/image-display.svg"
import LogoIcon from "@assets/icons/report/logo.svg"
import NotesTextIcon from "@assets/icons/report/notes-and-cautions.svg"
import ResultTextIcon from "@assets/icons/report/results-display.svg"
import { A, D, F, pipe } from "@mobily/ts-belt"
import { Spin } from "antd"
import csn from "classnames"
import { DateTime } from "luxon"
import { type FC, useEffect, useRef, useState } from "react"
import { AbsorptionCurveChart } from "./absorption-curve-chart"
import { EvaluationChart } from "./evaluation-chart"

export const PrintPreview: FC<{}> = () => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [isInit, setInit] = useState(false)

  const reportNumber = DateTime.now().toFormat("yyyyMMddHHmmss")

  const uptakeCurvesDataSource = [
    {
      organ: "左肾",
      firstTime: 0.009,
      secondTime: 2.17,
      thirdTime: 2.57,
      fourthTime: 2.45,
    },
    {
      organ: "右肾",
      firstTime: 0.009,
      secondTime: 2.17,
      thirdTime: 2.57,
      fourthTime: 2.45,
    },
    {
      organ: "肝脏",
      firstTime: 0.009,
      secondTime: 2.17,
      thirdTime: 2.57,
      fourthTime: 2.45,
    },
    {
      organ: "脾脏",
      firstTime: 0.009,
      secondTime: 0.0022,
      thirdTime: 0.0016,
      fourthTime: 2.34,
    },
    {
      organ: "全身",
      firstTime: 0.009,
      secondTime: 2.17,
      thirdTime: 2.57,
      fourthTime: 2.34,
    },
  ]

  const fittingParametersDataSource = [
    {
      organ: "左肾",
      A1: 0.0091,
      k1: 2.0913,
      A2: 0.0027,
      k2: 0.0027,
      residenceTime: 0.01,
    },
    { organ: "右肾", A1: 2.17, k1: 0.42, A2: 1.03, k2: 1.03, residenceTime: 0.18 },
    { organ: "肝脏", A1: 2.57, k1: 0.52, A2: 0.98, k2: 0.98, residenceTime: 0.18 },
    { organ: "脾脏", A1: 2.45, k1: 0.68, A2: 0.86, k2: 0.86, residenceTime: 0.17 },
    { organ: "全身", A1: 2.34, k1: 0.55, A2: 0.98, k2: 0.98, residenceTime: 0.19 },
  ]

  const organLevelDoseDataSource = [
    {
      organ: "左肾",
      alpha: 0.009,
      beta: 0.0022,
      gamma: 0.0016,
      totalDose: 0.0016,
      effectiveDose: 0.0006,
    },
    {
      organ: "右肾",
      alpha: 2.17,
      beta: 0.42,
      gamma: 1.03,
      totalDose: 1.03,
      effectiveDose: 0.18,
    },
    {
      organ: "肝脏",
      alpha: 2.57,
      beta: 0.52,
      gamma: 0.98,
      totalDose: 0.98,
      effectiveDose: 0.18,
    },
    {
      organ: "脾脏",
      alpha: 2.45,
      beta: 0.68,
      gamma: 0.86,
      totalDose: 0.86,
      effectiveDose: 0.17,
    },
    {
      organ: "全身",
      alpha: 2.34,
      beta: 0.55,
      gamma: 0.98,
      totalDose: 0.98,
      effectiveDose: 0.19,
    },
  ]

  const kineticsMassDataSource = [
    {
      organ: "左肾",
      mass: 0.009,
      kineticsValue: 0.0022,
      recoveryCoefficients: 0.0006,
    },
    { organ: "右肾", mass: 2.17, kineticsValue: 0.42, recoveryCoefficients: 0.18 },
    { organ: "肝脏", mass: 2.57, kineticsValue: 0.52, recoveryCoefficients: 0.18 },
    { organ: "脾脏", mass: 2.45, kineticsValue: 0.68, recoveryCoefficients: 0.17 },
    { organ: "全身", mass: 2.34, kineticsValue: 0.55, recoveryCoefficients: 0.19 },
  ]

  const barChartDataSource = organLevelDoseDataSource.map(item => ({
    label: item.organ,
    alpha: item.alpha,
    beta: item.beta,
    gamma: item.gamma,
    error: Math.max(item.alpha, item.beta, item.gamma),
  }))

  useEffect(() => {
    if (isInit) return
    setTimeout(() => {
      initPdfModal()
    }, 300)
  }, [isInit])

  const initPdfModal = () => {
    const _A4_WIDTH = 595
    const A4_HEIGHT = 842
    const target = contentRef.current
    if (!target) return
    const printList = target.getElementsByClassName("print-item") as any
    for (let i = 0; i < printList.length; i++) {
      if (printList[i].offsetHeight > A4_HEIGHT) {
        const groups = printList[i].getElementsByClassName("group-item")
        for (let j = 0; j < groups.length; j++) {
          const page = Math.ceil((groups[j].offsetTop + groups[j].offsetHeight) / A4_HEIGHT)
          if (
            (groups[j] && groups[j].offsetTop + groups[j].offsetHeight + 50 < page * A4_HEIGHT,
            groups[j + 1] &&
              groups[j + 1].offsetTop + groups[j + 1].offsetHeight + 50 > page * A4_HEIGHT)
          ) {
            console.log(page, groups[j].offsetTop + groups[j].offsetHeight, page * A4_HEIGHT)
            const divParent = groups[j].parentNode // 获取该div的父节点
            const newNode = document.createElement("div")
            newNode.className = "emptyDiv"
            const _H = page * A4_HEIGHT - (groups[j].offsetTop + groups[j].offsetHeight)
            newNode.style.height = `${_H}px`
            newNode.style.width = "100%"
            // newNode.style.backgroundColor = "blue"
            groups[j].style.marginBottom = 0
            const next = groups[j].nextSibling // 获取div的下一个兄弟节点
            if (next) {
              next.before(newNode, next)
              if (printList[i].className.includes("result-display")) {
                const titleNode = document.querySelector(".result-display-title") as Element
                titleNode.className = "group-item result-display-title pb-6 pt-[50px] emptyDiv"
                const titleClone = titleNode.cloneNode(true)
                if (next.nextSibling?.className?.includes("group-line")) {
                  next.style.borderTop = "1px solid #E7E7E7"
                }
                if (next.className.includes("group-line")) {
                  next.style.borderTop = "1px solid #E7E7E7"
                }
                next.before(titleClone)
              }
              if (printList[i].className.includes("notes-and-cautions")) {
                const titleNode = document.querySelector(".notes-and-cautions-title") as Element
                titleNode.className = "group-item notes-and-cautions-title pb-6 pt-[50px]"
                const titleClone = titleNode.cloneNode(true)
                next.before(titleClone)
              }
            } else {
              divParent.appendChild(newNode)
            }
          }
          if (j === groups.length - 1 && groups[groups.length - 1]) {
            const divParent = groups[groups.length - 1].parentNode // 获取该div的父节点
            divParent.style.marginBottom = 0
            const newNode1 = document.createElement("div")
            newNode1.className = "emptyDiv"
            const _H =
              page * A4_HEIGHT -
              (groups[groups.length - 1].offsetTop + groups[groups.length - 1].offsetHeight)
            newNode1.style.height = `${_H}px`
            newNode1.style.width = "100%"
            // newNode1.style.backgroundColor = "red"
            divParent.appendChild(newNode1)
          }
        }
      }
    }
    setInit(true)
  }

  return (
    <div ref={contentRef} className={csn("relative")}>
      {/* 封面 */}
      <div className="relative flex flex-col justify-between py-[50px] h-[842px] text-xs leading-6 print-item">
        <div className="flex justify-between items-center border-b-[2px] border-black border-solid">
          <LogoIcon />
          <div>
            <div className="flex items-center gap-[2px]">
              <div className="w-[53px] text-end">报告编号</div> | {reportNumber}
            </div>
            <div className="flex items-center gap-[2px]">
              <div className="w-[53px] text-end"> 检查时间</div> |{" "}
              {DateTime.fromISO(DateTime.now().toString()).toFormat("yyyy-MM-dd")}
            </div>
          </div>
        </div>
        <div className={csn("flex flex-1 items-center justify-center font-medium text-[44px]")}>
          剂量计算分析报告
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className={"flex w-[50px] items-center justify-between"}>
              <div>姓</div>
              <div>名</div>
            </div>
            <div className="">：张三</div>
          </div>
          <div className="flex items-center">
            <div className="flex justify-between items-center w-[50px]">
              <div>性</div>
              <div>别</div>
            </div>
            <div className="">： 男</div>
          </div>
          <div className="flex items-center">
            <div className="flex justify-between items-center w-[50px]">
              <div>年</div>
              <div>龄</div>
            </div>
            <div className="">：35</div>
          </div>
        </div>
      </div>
      {/* Notes and Cautions */}
      <div className="relative flex flex-col min-h-[842px] text-xs leading-[18px] print-item notes-and-cautions">
        <div className="group-item pt-[50px] pb-6 notes-and-cautions-title">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center w-[220px] h-8">
              <NotesTextIcon />
            </div>
            <div className={csn("text-black/50 text-sm")}>报告阅读说明</div>
          </div>
          <div className="bg-[#014099] mt-1 w-full h-1"></div>
        </div>
        <div className="mb-4 report-title">
          <div className="inline-block">报告说明</div>
        </div>
        <div className="text-[#4b4b4b]">
          <div className="pb-1">【适用人群】</div>
          <ul className="pl-5 leading-[20px] list-disc">
            <li>接受放射性核素诊断或治疗的患者：肿瘤患者，心血管疾病患者，神经系统疾病患者等</li>
            <li>
              特殊人群：需要严格把控放射性药物剂量，如：儿童，孕妇，肾功能不全者
              科研与临床试验受试者：新药开发，治疗方法优化
            </li>
          </ul>
        </div>
        <div className="mt-4 mb-6 text-[#4b4b4b]">
          <div className="pb-1">【评估流程】</div>
          <ul className="pl-5 leading-[20px] list-disc">
            <li>药物注射</li>
            <li>图像采集</li>
            <li>图像配准</li>
            <li>VOI勾画</li>
            <li>剂量计算</li>
            <li>报告生成</li>
          </ul>
        </div>
        <div className="group-item mb-4 report-title">
          <div className="inline-block">作用说明</div>
        </div>
        <div className="text-[#4b4b4b] indent-2">
          本报告中提供了：吸收曲线，吸收量，拟合参数，器官级别内部吸收评估相关图表，在临床诊断中具有以下参考价值：
        </div>
        <ul className="mb-4 pl-5 text-[#4b4b4b] leading-[20px] list-disc">
          <li>帮助评估放射性核素的摄取、分布和排泄过程。</li>
          <li>评估患者辐射风险和确定剂量限制</li>
          <li>评估药物的疗效和安全性、优化治疗方案</li>
          <li>制定个性化的治疗计划，以减少对这些器官的辐射剂量</li>
        </ul>
        <div className="group-item mb-4 report-title">
          <div className="inline-block">注意</div>
        </div>
        <div className="text-[#4b4b4b] indent-2">
          本报告提供的计量计算结果仅供医疗专业人员作为临床决策的参考信息，不应用于最终诊断。
        </div>
      </div>
      {/* Image Display */}
      <div className="relative flex flex-col min-h-[842px] text-xs leading-[18px] print-item image-display">
        <div className="group-item pt-[50px] pb-6 image-display-title">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center w-[139px] h-8">
              <ImageTextIcon />
            </div>
            <div className="text-black/50 text-sm">成像展示</div>
          </div>
          <div className="bg-[#014099] mt-1 w-full h-1"></div>
        </div>
        <div className="group-item mb-6 font-medium text-base text-center">剂量计算报告单</div>
        <div className="group-item flex justify-between items-center pb-2 border-b border-black border-solid">
          <div className="flex items-center">
            <div>报告号：</div>
            <div className="text-[#484848]">{reportNumber}</div>
          </div>
          <div className="flex items-center">
            <div>
              报告日期：
              {DateTime.fromISO(DateTime.now().toString()).toFormat("yyyy-MM-dd")}
            </div>
            <div className="text-[#484848]"></div>
          </div>
        </div>
        <div className="group-item flex flex-wrap items-center gap-x-1 mt-2 pb-2 border-b border-black border-solid">
          <div className="flex items-center min-w-[130px]">
            <div>姓名：</div>
            <div className="text-[#484848]">Admin</div>
          </div>
          <div className="flex items-center pr-1 w-[calc(100%_-_260px)]">
            <div>性别：</div>
            <div className="text-[#484848]">男</div>
          </div>
          <div className="flex items-center w-[120px]">
            <div>年龄：</div>
            <div className="text-[#484848]">19</div>
          </div>
          <div className="flex items-center min-w-[130px]">
            <div>成像药物：</div>
            <div className="text-[#484848]">f-18</div>
          </div>
          <div className="flex flex-wrap items-center pr-1 min-w-[calc(100%_-_266px)]">
            <div>注射剂量：</div>
            <div className="text-[#484848]">5 mCi</div>
          </div>
          <div className="flex items-center min-w-[130px]">
            <div>治疗药物：</div>
            <div className="text-[#484848]">f-18</div>
          </div>
          <div className="flex flex-wrap items-center pr-1 min-w-[calc(100%_-_266px)]">
            <div>注射剂量：</div>
            <div className="text-[#484848]">5 mCi</div>
          </div>
        </div>
        <div className="group-item mt-6 mb-2 font-medium text-base text-center">
          VOI勾画相关图像
        </div>
        <div className="group-item relative bg-bg/50 w-[415px] min-h-[356px] overflow-hidden">
          图像
        </div>
      </div>
      {/* Image Display 异常区域*/}
      <div className="relative flex flex-col pb-6 min-h-[842px] text-xs leading-[18px] print-item image-display">
        <div className="group-item pt-[50px] pb-6 mage-display-title">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center w-[139px] h-8">
              <ImageTextIcon />
            </div>
            <div className="text-black/50 text-sm">成像展示</div>
          </div>
          <div className="bg-[#014099] mt-1 w-full h-1"></div>
        </div>
        <div className="bg-bg/50 min-h-[356px]">图像</div>
      </div>
      {/* Result display */}
      <div className="relative flex flex-col min-h-[842px] text-xs leading-[18px] print-item result-display">
        <div className="group-item pt-[50px] pb-6 result-display-title">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center w-[153px] h-8">
              <ResultTextIcon />
            </div>
            <div className="text-black/50 text-sm">结果展示</div>
          </div>
          <div className="bg-[#014099] mt-1 w-full h-1"></div>
        </div>
        <div className="group-item mb-2 font-medium text-base text-center">剂量分析</div>
        <div className="group-item mb-2 text-[#4B4B4B]">吸收曲线</div>
        <div className="group-item mb-8 border border-[#E7E7E7]" style={{ borderColor: "#e7e7e7" }}>
          <AbsorptionCurveChart />
        </div>
        <div className="group-item mb-1 h-[18px] text-[#4B4B4B] leading-[18px]">吸收量</div>
        <div className="group-item mb-2 h-[14px] font-semibold text-[10px] text-black leading-[14px]">
          Uptake (MBq)
        </div>
        <AbsorptionCapacityTable
          tHeader={uptakeCurvesColumns}
          tBody={pipe(uptakeCurvesDataSource, A.map(D.values), F.toMutable)}
        />
        <div className="group-item mb-1 h-[18px] text-[#4B4B4B] leading-[18px]">拟合参数</div>
        <div className="group-item mb-2 h-[14px] font-semibold text-[10px] text-black leading-[14px]">
          Fitting parameters
        </div>
        <AbsorptionCapacityTable
          tHeader={fittingParametersColumns}
          tBody={pipe(fittingParametersDataSource, A.map(D.values), F.toMutable)}
        />
        <div className="group-item mb-1 h-[18px] text-[#4B4B4B] leading-[18px]">
          器官级别内部剂量吸收评估
        </div>
        <div className="group-item mb-2 h-[14px] font-semibold text-[10px] text-black leading-[14px]">
          Organ Level Internal Dose Assessment Code（mGy）
        </div>
        <AbsorptionCapacityTable
          tHeader={organLevelDoseColumns}
          tBody={pipe(organLevelDoseDataSource, A.map(D.values), F.toMutable)}
        />
        <div className="group-item mb-2 h-[18px] text-[#4B4B4B] leading-[18px]">
          器官级别内部剂量吸收评估
        </div>
        <AbsorptionCapacityTable
          isKineticsMass={true}
          tHeader={kineticsMassColumns}
          tBody={pipe(kineticsMassDataSource, A.map(D.values), F.toMutable)}
        />
        <div className="group-item">
          <div className="mb-2 h-[18px] text-[#4B4B4B] leading-[18px]">剂量吸收评估图</div>
          <div className="border border-[#E7E7E7]" style={{ borderColor: "#e7e7e7" }}>
            <EvaluationChart data={barChartDataSource} />
          </div>
        </div>
      </div>
    </div>
  )
}

const AbsorptionCapacityTable = ({
  tHeader,
  tBody,
  isKineticsMass,
}: {
  tHeader: { key: string; title: string }[]
  tBody: any[]
  isKineticsMass?: boolean
}) => {
  return (
    <>
      <div
        className="group-item flex justify-center items-center border border-[#E7E7E7] border-r-0 h-8 text-[10px] text-black/90 leading-8"
        style={{ borderColor: "#e7e7e7" }}
      >
        {tHeader.map((v, k) => {
          return (
            <div
              className={csn(
                "h-full border-[#E7E7E7] border-r text-center ",
                isKineticsMass && "[&:nth-child(3)]:!w-[140px] [&:nth-child(4)]:!w-[110px]",
              )}
              key={`${k + 1}`}
              style={
                isKineticsMass
                  ? {
                      width: `calc(calc(100% - 250px)/${tHeader.length - 2})`,
                      borderColor: "#e7e7e7",
                    }
                  : { width: `calc(100%/${tHeader.length})`, borderColor: "#e7e7e7" }
              }
            >
              {v.title}
            </div>
          )
        })}
      </div>
      {tBody.map((v, k) => {
        return (
          <div
            className={csn(
              "group-item group-line flex h-8 items-center justify-center border-[#E7E7E7] border-r-0 border-b border-l text-[10px] text-black/90 leading-8 ",
              k % 2 === 0 && "group-tbody-odd",
              k === tBody.length - 1 && "group-tbody-last",
            )}
            key={`${k + 1}`}
            style={{ borderColor: "#e7e7e7" }}
          >
            {v.map((s: any, sk: number) => {
              return (
                <div
                  key={`${sk + 1}`}
                  className={csn(
                    "h-full border-[#E7E7E7] border-r text-center",
                    isKineticsMass && "[&:nth-child(3)]:!w-[140px] [&:nth-child(4)]:!w-[110px]",
                  )}
                  style={
                    isKineticsMass
                      ? {
                          width: `calc(calc(100% - 250px)/${tHeader.length - 2})`,
                          borderColor: "#e7e7e7",
                        }
                      : { width: `calc(100%/${tHeader.length})`, borderColor: "#e7e7e7" }
                  }
                >
                  {s}
                </div>
              )
            })}
          </div>
        )
      })}
    </>
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
      <CloseCircleFilled className="font-bold text-red-700 text-5xl" />
      <div className="mt-4 text-lg">暂无分析数据，报告生成失败</div>
    </div>
  )
}

const organLevelDoseColumns = [
  {
    title: "",
    key: "organ",
  },
  {
    title: "α射线",
    key: "alpha",
  },
  {
    title: "β射线",
    key: "beta",
  },
  {
    title: "γ射线",
    key: "gamma",
  },
  {
    title: "总剂量",
    key: "totalDose",
  },
  {
    title: "有效剂量",
    key: "effectiveDose",
  },
]
const kineticsMassColumns = [
  {
    title: "",
    key: "organ",
  },
  {
    title: "Mass(g)",
    key: "mass",
  },
  {
    title: "Kinetics Value(MBq-h/MBq)",
    key: "kineticsValue",
  },
  {
    title: "Recovery Coefficients",
    key: "recoveryCoefficients",
  },
]
const fittingParametersColumns = [
  {
    title: "",
    key: "organ",
  },
  {
    title: "A1 (MBq)",
    key: "A1",
  },
  {
    title: "K1（h-1）",
    key: "k1",
  },
  {
    title: "A2 (MBq)",
    key: "A2",
  },
  {
    title: "K2（h-1）",
    key: "k2",
  },
  {
    title: "Residence time(h)",
    key: "residenceTime",
  },
]
const uptakeCurvesColumns = [
  {
    title: "",
    key: "organ",
  },
  {
    title: "0.12(h)p.i.",
    key: "firstTime",
  },
  {
    title: "20.5(h)p.i.",
    key: "secondTime",
  },
  {
    title: "63.42(h)p.i.",
    key: "thirdTime",
  },
  {
    title: "133.7(h)p.i.",
    key: "fourthTime",
  },
]
