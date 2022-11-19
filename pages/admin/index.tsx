import { Button, DatePicker, Modal, Space } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import moment, { Moment } from 'moment'
import { useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { ITrainTrip, ITrainTripRes } from '../api/trainTrip'
import styled from 'styled-components'
import { AvailabilityRow, AvailbilityTitle } from './AvailibilityRenderer'
import { EditOutlined } from '@ant-design/icons'
import EditingModal, { IEditingModalRef } from './EditingModal'
import { g } from '../../utils/dataMap'

const { RangePicker } = DatePicker

type Params = {
  queryKey: [string, string[]]
}

export const getTrainTrip = async ({ queryKey }: Params) => {
  const [_key, [start, end]] = queryKey
  const data: ITrainTripRes = await fetch(`/api/trainTrip?start=${start}&end=${end}`).then((res) =>
    res.json()
  )
  return data
}

export const Title = styled.div`
  font-size: 20px;
`

const AdminPage = ({}: {}) => {
  const [range, setRange] = useState<[Moment, Moment]>([moment('2022-11-1'), moment('2022-11-9')])
  const isoRange = useMemo(() => range.map((m) => m.toISOString()), [range])
  // FIXME: 为什么文档写着dayjs，类型提示moment

  const editModalRef = useRef<IEditingModalRef | null>(null)

  const queryClient = useQueryClient()
  // FIXME：这个unknown什么鬼
  const query = useQuery<unknown, unknown, ITrainTripRes, Params['queryKey']>(
    ['/api/trainTrip', isoRange],
    getTrainTrip
  )
  const data = useMemo(() => query.data?.data, [query])
  const nameFilters = useMemo(
    () => query.data?.data?.map((record) => ({ text: record.name, value: record.name })),
    [query]
  )

  const columns: ColumnsType<ITrainTrip> = useMemo(() => {
    return [
      {
        title: '',
        key: 'edit',
        width: 46,
        render(value, record, index) {
          return <EditOutlined onClick={() => editModalRef.current?.open(record)} />
        }
      },
      {
        title: g['name'],
        dataIndex: 'name',
        key: 'name',
        filterMode: 'tree',
        filters: nameFilters,
        filterSearch: true,
        onFilter: (value, record) => record.name.startsWith(value as string)
      },
      {
        title: g['OrderDate'],
        dataIndex: 'OrderDate',
        key: 'OrderDate',
        render(value, record, index) {
          return moment(record.OrderDate).format('YYYY-MM-DD')
        }
      },
      {
        title: g['OrderId'],
        dataIndex: 'OrderId',
        key: 'OrderId'
      },
      {
        title: '区段',
        key: 'Departure-Arrival',
        render(value, record, index) {
          return `${record.DepartureStation}-${record.ArriveStation}`
        }
      },
      {
        title: g['DepartureTime'],
        dataIndex: 'DepartureTime',
        key: 'DepartureTime',
        render(value, record, index) {
          return moment(record.DepartureTime).format('HH:MM')
        }
      },
      {
        title: g['ArriveTime'],
        dataIndex: 'ArriveTime',
        key: 'ArriveTime',
        render(value, record, index) {
          return moment(record.ArriveTime).format('HH:MM')
        }
      },
      {
        title: <AvailbilityTitle datesRange={range} />,
        dataIndex: 'perDay',
        render(value, record, index) {
          return <AvailabilityRow datesList={record.perDay} />
        }
      }
    ]
  }, [nameFilters, range])

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Title>Admin page</Title>
        <RangePicker
          value={range}
          onChange={(dates, dayStrings) => {
            const start = moment(dates?.[0]?.toISOString())
            const end = moment(dates?.[1]?.toISOString())
            // const newR = dayStrings.map((str) => moment(str)) as [Moment, Moment]
            setRange([start, end])
          }}
          allowClear={false}
        />
        <Table dataSource={data} columns={columns} rowKey={'_id'} loading={query.isLoading} />
      </Space>
      <EditingModal ref={editModalRef}></EditingModal>
    </>
  )
}

export default AdminPage
