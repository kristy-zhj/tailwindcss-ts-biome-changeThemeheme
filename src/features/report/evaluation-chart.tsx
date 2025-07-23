import * as echarts from "echarts"
import { type FC, useEffect, useRef } from "react"

interface ChartDataItem {
  label: string // 标签名称，
  alpha: number // α射线值
  beta: number // β射线值
  gamma: number // γ射线值
  error: number // 误差值
}

interface ChartProps {
  className?: string
  data?: ChartDataItem[] // 图表数据
  maxValue?: number // X轴最大值，默认2500
  itemHeight?: number // 每行固定高度，默认60px
}

export const EvaluationChart: FC<ChartProps> = ({
  className,
  data = [
    { label: "左肾", alpha: 1800, beta: 200, gamma: 50, error: 150 },
    { label: "右肾", alpha: 1300, beta: 100, gamma: 30, error: 80 },
    { label: "肝脏", alpha: 1100, beta: 200, gamma: 50, error: 100 },
    { label: "脾脏", alpha: 900, beta: 150, gamma: 50, error: 50 },
    { label: "脾脏", alpha: 150, beta: 150, gamma: 50, error: 50 },
  ],
  itemHeight = 60,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const colorConfig = {
    alpha: "rgb(60, 126, 255)",
    beta: "rgb(63, 212, 207)",
    gamma: "rgb(142, 81, 218)",
    error: "rgb(249, 204, 68)",
  }
  const textColor = "rgba(0,0,0, 1)"

  useEffect(() => {
    if (!chartRef.current) return

    chartInstance.current = echarts.init(chartRef.current, null, {
      renderer: "canvas",
      devicePixelRatio: 2,
    })

    const labels = data.map(item => item.label)
    const alphaData = data.map(item => item.alpha)
    const betaData = data.map(item => item.beta)
    const gammaData = data.map(item => item.gamma)
    const errorData = data.map((item, index) => [
      index,
      item.alpha + item.beta + item.gamma, // 总值位置
      item.error,
    ])

    const option: echarts.EChartsOption = {
      legend: {
        data: ["α射线", "β射线", "γ射线", "Error bars"],
        textStyle: { color: textColor },
        top: 15,
        right: 25,
      },
      animation: false,
      grid: {
        left: 40,
        right: 100,
        top: 70,
        bottom: 15,
      },
      xAxis: {
        type: "value",
        min: 0,
        position: "top",
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: { color: textColor, fontSize: 10 },
        splitLine: { lineStyle: { color: "rgb(56, 56, 56)", type: "dashed" } },
      },
      yAxis: {
        type: "category",
        data: labels,
        axisLine: { lineStyle: { color: textColor } },
        axisLabel: { color: textColor },
      },
      series: [
        {
          name: "α射线",
          type: "bar",
          stack: "射线",
          data: alphaData,
          itemStyle: { color: colorConfig.alpha },
          barWidth: itemHeight - 20,
        },
        {
          name: "β射线",
          type: "bar",
          stack: "射线",
          data: betaData,
          itemStyle: { color: colorConfig.beta },
        },
        {
          name: "γ射线",
          type: "bar",
          stack: "射线",
          data: gammaData,
          itemStyle: { color: colorConfig.gamma },
        },
        {
          name: "Error bars",
          type: "custom",
          itemStyle: { color: colorConfig.error },
          z: 100,
          renderItem: (_params: any, api: any) => {
            const categoryIndex = api.value(0)
            const value = api.value(1)
            const error = api.value(2)

            const start = api.coord([value - error, categoryIndex])
            const end = api.coord([value + error, categoryIndex])
            const height = 10

            return {
              type: "group",
              children: [
                {
                  type: "line",
                  shape: { x1: start[0], y1: start[1], x2: end[0], y2: end[1] },
                  style: { stroke: colorConfig.error, lineWidth: 2 },
                },
                {
                  type: "line",
                  shape: {
                    x1: start[0],
                    y1: start[1] - height / 2,
                    x2: start[0],
                    y2: start[1] + height / 2,
                  },
                  style: { stroke: colorConfig.error, lineWidth: 2 },
                },
                {
                  type: "line",
                  shape: {
                    x1: end[0],
                    y1: end[1] - height / 2,
                    x2: end[0],
                    y2: end[1] + height / 2,
                  },
                  style: { stroke: colorConfig.error, lineWidth: 2 },
                },
              ],
            }
          },
          encode: { x: 1, y: 0 },
          data: errorData,
        },
      ],
    }

    chartInstance.current.setOption(option)

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      chartInstance.current?.dispose()
    }
  }, [data, itemHeight])

  // 计算图表高度
  const dynamicHeight = data.length * itemHeight + 30

  return (
    <div
      ref={chartRef}
      className={className}
      style={{
        width: "100%",
        height: `${dynamicHeight}px`,
        minHeight: "200px",
      }}
    />
  )
}
