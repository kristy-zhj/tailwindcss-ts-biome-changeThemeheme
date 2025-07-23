import * as echarts from "echarts"
import { type FC, useEffect, useRef, useState } from "react"

interface UptakeData {
  timePoints: string[]
  organData: {
    [organName: string]: number[]
  }
}

export const AbsorptionCurveChart: FC<{}> = () => {
  const chartRef = useRef<HTMLDivElement>(null)

  const [uptakeData, _setUptakeData] = useState<UptakeData>({
    timePoints: ["0.12(h)", "20.5(h)", "63.42(h)", "133.7(h)"],
    organData: {
      左肾: [0.009, 0.0022, 0.0016, 0.0006],
      右肾: [2.17, 0.42, 1.03, 0.18],
      肝脏: [2.57, 0.52, 0.98, 0.18],
      脾脏: [2.45, 0.68, 0.86, 0.17],
      全身: [2.34, 0.55, 0.98, 0.19],
    },
  })

  const organColors = {
    左肾: "#00e5ff",
    右肾: "#7c4dff",
    肝脏: "#ff6b35",
    脾脏: "#ff4081",
    全身: "#ffd600",
  }
  const textColor = "rgba(0, 0, 0, 1)"

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current, null, {
      renderer: "canvas",
      devicePixelRatio: 2,
    })

    const series = Object.entries(uptakeData.organData).map(([organName, data]) => ({
      name: organName,
      type: "line" as const,
      data: data,
      lineStyle: {
        color: organColors[organName as keyof typeof organColors],
        width: 2,
        fontSize: 10,
      },
      symbol: "none" as const,
    }))

    const option: echarts.EChartsOption = {
      title: [
        {
          text: "Uptake curves",
          left: "left",
          top: 15,
          textStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        },
      ],
      animation: false,
      legend: {
        data: Object.keys(uptakeData.organData),
        top: 15,
        right: 25,
        textStyle: {
          color: textColor,
          fontSize: 12,
        },
        itemWidth: 15,
        itemHeight: 2,
        icon: "rect",
      },
      grid: {
        left: "30px",
        right: "10px",
        bottom: "35px",
        top: "70px",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        name: "Time Post Injection",
        nameLocation: "middle",
        data: uptakeData.timePoints,

        axisLine: {
          lineStyle: { color: "#222" },
          show: true,
        },
        axisTick: {
          lineStyle: { color: "#222" },
        },
        axisLabel: {
          color: textColor,
        },
        nameTextStyle: {
          padding: [20, 0, 0, 0],
          fontSize: 12,
        },

        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: "log",
        name: "Fraction of Injected Activity",
        nameTextStyle: {
          fontSize: 12,
          color: "rgba(0, 0, 0, 0.8)",
        },
        min: 0.0001,
        max: 10,
        axisLabel: {
          color: textColor,
          fontSize: 11,
          formatter: (value: number) => {
            if (value >= 10) return "10"
            if (value >= 1) return "1"
            if (value >= 0.1) return "0.1"
            if (value >= 0.01) return "0.01"
            if (value >= 0.001) return "0.001"
            if (value >= 0.0001) return "0.0001"
            return value.toString()
          },
        },
        axisLine: {
          lineStyle: { color: "#222" },
          show: false,
        },
        axisTick: {
          lineStyle: { color: "#222" },
          show: true,
        },
        splitLine: {
          lineStyle: {
            color: "rgba(56,56,56,1)",
            width: 1,
            type: "dashed",
          },
        },
      },
      series: series,
    }

    chart.setOption(option)

    const resizeHandler = () => chart.resize()
    window.addEventListener("resize", resizeHandler)

    return () => {
      window.removeEventListener("resize", resizeHandler)
      chart.dispose()
    }
  }, [uptakeData])

  return <div ref={chartRef} className="relative px-[10px] w-full h-[250px]" />
}
