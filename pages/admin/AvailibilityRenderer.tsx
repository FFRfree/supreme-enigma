import { Space, Tag } from 'antd'
import { Moment } from 'moment'
import { ITrainTripDetail } from '../../models/TrainTripDetail'
import { enumMap } from '../../utils/dataMap'
import dynamic from 'next/dynamic'
import MomentVertical from './MomentVertical'

const _AvailbilityTitle = ({ datesRange }: { datesRange: [Moment, Moment] }) => {
  const [start, end] = datesRange
  console.log(datesRange)
  const totalNum = end.diff(start, 'days') + 1
  console.log(totalNum)
  const li = Array.from(Array(totalNum), (_, i) => (
    <MomentVertical key={i} mm={start.clone().add(i, 'day')}></MomentVertical>
  ))
  // return <Space>{Array.from(Array(totalNum), (_, i) => start.add(i, 'day').format('MM-DD'))}</Space>
  return <Space>{li}</Space>
}
export const AvailbilityTitle = dynamic(() => Promise.resolve(_AvailbilityTitle), { ssr: false })

export const AvailabilityRow = ({ datesList }: { datesList: ITrainTripDetail[] }) => {
  return (
    <Space>
      {datesList.map((v) => {
        const config = enumMap[v.data.isAvailable ? 1 : 0]
        return (
          <Tag key={v.timestamp as any} style={{ width: 30, marginRight: 0 }} color={config.color}>
            {config.name}
          </Tag>
        )
      })}
    </Space>
  )
}
