import { Button, DatePicker, Modal, Space } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import moment, { Moment } from 'moment'
import { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { ITrainTrip, ITrainTripRes } from '../api/trainTrip'
import styled from 'styled-components'
import { AvailabilityRow, AvailbilityTitle } from './AvailibilityRenderer'
import { EditOutlined } from '@ant-design/icons'

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

  const queryClient = useQueryClient()
  // FIXME：这个unknown什么鬼
  const query = useQuery<unknown, unknown, ITrainTripRes, Params['queryKey']>(
    ['/api/trainTrip', isoRange],
    getTrainTrip
  )
  const data = useMemo(() => query.data?.data, [query])

  const columns: ColumnsType<ITrainTrip> = useMemo(() => {
    return [
      {
        title: '',
        key: 'edit',
        width: 46,
        render(value, record, index) {
          return <EditOutlined onClick={() => console.log(record)} />
        }
      },
      {
        title: '交路',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '受令日期',
        dataIndex: 'OrderDate',
        key: 'OrderDate',
        render(value, record, index) {
          return moment(record.OrderDate).format('YYYY-MM-DD')
        }
      },
      {
        title: '调令ID',
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
        title: '开点',
        dataIndex: 'DepartureTime',
        key: 'DepartureTime',
        render(value, record, index) {
          return moment(record.DepartureTime).format('HH:MM')
        }
      },
      {
        title: '到点',
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
  }, [range])

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
      <Modal
        title="Title"
        // open={open}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        // onCancel={handleCancel}
      >
        <p>{1}</p>
      </Modal>
    </>
  )
}

export default AdminPage
