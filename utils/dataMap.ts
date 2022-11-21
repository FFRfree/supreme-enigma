import { ITrainTrip } from '../pages/api/trainTrip'

export const enumMap = {
  0: {
    color: 'error',
    name: '停'
  },
  1: {
    color: 'success',
    name: '开'
  },
  2: {
    color: 'warning',
    name: '休'
  }
}

export const g: Partial<Record<keyof ITrainTrip, string>> = {
  name: '交路',
  OrderDate: '受令日期',
  OrderId: '调令ID',
  DepartureStation: '出发站台',
  ArriveStation: '到达站台',
  DepartureTime: '开点',
  ArriveTime: '到点'
}
