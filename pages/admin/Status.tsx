import { Descriptions, Tag, Tooltip } from 'antd'
import { ITrainTripDetail } from '../../models/TrainTripDetail'
import { enumMap } from '../../utils/dataMap'

function Status({ ttDetail }: { ttDetail: ITrainTripDetail | null }) {
  if (!ttDetail) {
    return <Tag color="default">空</Tag>
  }
  /** TODO： 这里以后是枚举值，有三种状态 */
  console.log(ttDetail.status)
  const config = enumMap[Math.floor(ttDetail.status) as 0 | 1 | 2]
  return (
    <Tooltip title={<ExtraInfoDisplay />}>
      {/** 处理data字段里extra和status不全的情况 */}
      <Tag color={config?.color || 'default'}>{config?.name || '空'}</Tag>
    </Tooltip>
  )
}

const ExtraInfoDisplay = ({ obj }: { obj?: Record<string, string> }) => {
  return (
    <div>
      <Descriptions title="具体信息" column={1}>
        <Descriptions.Item label="司机">Zhou Maomao</Descriptions.Item>
        <Descriptions.Item label="备注">这趟车。。。。</Descriptions.Item>
      </Descriptions>
    </div>
  )
}

export default Status
