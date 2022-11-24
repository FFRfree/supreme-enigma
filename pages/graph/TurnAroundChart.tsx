import { Chart } from '@antv/g2'
import { useRef, useEffect } from 'react'

const cities = ['上海', '苏州', '无锡', '常州', '南京']
const distances = [0, 10, 30, 40, 100, 130]

/**
 * 时间精确到小时
 * Math.floor(timestamp / 1000 / 60 / 60)
 *
 * 出发地，途径，途径多久，到达
 * departure, to, stayDuration, arrival
 * 出来四点
 */
function Date2Hours(d: Date) {
  return Math.floor(d.getTime() / 1000 / 60 / 60)
}

function Hours2Date(hours: number) {
  const timestamp = hours * 60 * 60 * 1000
  return new Date(timestamp)
}

const TRAIN_SPEED = 2 // 40 distance per hour

function mockTrainTrip(
  ttid: string,
  departureHourStamp: number,
  departureInd: number,
  toInd: number,
  stayHours: number,
  arrivalInd: number
) {
  const departureTripHoursSpan = (distances[toInd] - distances[departureInd]) / TRAIN_SPEED
  const arrivalTripHoursSpan = (distances[toInd] - distances[arrivalInd]) / TRAIN_SPEED

  return [
    {
      distance: distances[departureInd],
      hourStamp: departureHourStamp,
      trainTripId: ttid
    },
    {
      distance: distances[toInd],
      hourStamp: departureHourStamp + departureTripHoursSpan,
      trainTripId: ttid
    },
    {
      distance: distances[toInd],
      hourStamp: departureHourStamp + departureTripHoursSpan + stayHours,
      trainTripId: ttid
    },
    {
      distance: distances[arrivalInd],
      hourStamp: departureHourStamp + departureTripHoursSpan + stayHours + arrivalTripHoursSpan,
      trainTripId: ttid
    }
  ]
}

const data = [
  ...mockTrainTrip('G101', Date2Hours(new Date(2022, 10, 5)), 0, 1, 10, 0),
  ...mockTrainTrip('G102', Date2Hours(new Date(2022, 10, 6)), 0, 3, 20, 1),
  ...mockTrainTrip('G103', Date2Hours(new Date(2022, 10, 7)), 0, 4, 40, 3),
  ...mockTrainTrip('G104', Date2Hours(new Date(2022, 10, 20)), 0, 2, 100, 0),
  ...mockTrainTrip('G105', Date2Hours(new Date(2022, 10, 16)), 0, 3, 200, 1),
  ...mockTrainTrip('G106', Date2Hours(new Date(2022, 10, 21)), 1, 5, 10, 1)
]

function TurnAroundChart() {
  const chartRef = useRef<any>(null)

  useEffect(() => {
    const chart = new Chart({
      container: 'turnAroundChartContainer',
      // width: 1200,
      // height: 500,
      autoFit: true,
      padding: [50, 50, 95, 80]
    })
    chartRef.current = chart

    chart.theme('dark')
    chart.data(data)
    chart.scale({
      hourStamp: {
        // range: [0, 1],
        type: 'time',
        // tickInterval: 24,
        ticks: Array.from(Array(30), (_, i) => Date2Hours(new Date(2022, 10, i + 1))),
        formatter: (v, k) => {
          const date = Hours2Date(v)
          // console.log(date)
          return `${date.getMonth()}-${date.getDate()}`
        }
      },
      distance: {
        nice: true,
        ticks: distances,
        formatter: (v, k) => {
          // console.log(v,k)
          return k
        }
      }
    })

    chart.tooltip({
      showCrosshairs: true,
      shared: true
    })

    chart.axis('distance', {
      label: {
        formatter: (val) => {
          return val + '站台'
        }
      }
    })

    chart.line().position('hourStamp*distance').color('trainTripId').shape('line')

    chart.point().position('hourStamp*distance').color('trainTripId').shape('circle')

    chart.render()
    console.log('rendered')

    return () => {
      chart.destroy()
    }
    // chart.render()
  }, [])

  return (
    <div>
      <div id="turnAroundChartContainer" style={{ height: '90vh' }}></div>
    </div>
  )
}

export default TurnAroundChart
