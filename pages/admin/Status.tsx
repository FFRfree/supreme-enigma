import { Tag } from 'antd'
import { ITrainTripDetail } from '../../models/TrainTripDetail'
import { enumMap } from '../../utils/dataMap'

function Status({ ttDetail }: { ttDetail: ITrainTripDetail | null }) {
  if (!ttDetail) {
    return <Tag color="default">空</Tag>
  }
  /** TODO： 这里以后是枚举值，有三种状态 */
  const config = enumMap[ttDetail.data.isAvailable ? 1 : 0]
  return <Tag color={config.color}>{config.name}</Tag>
}

export default Status
