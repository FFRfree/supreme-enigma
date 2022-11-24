import { Button, Col, DatePicker, Modal, Row, Space, Tabs, Typography } from 'antd'
import Table, { ColumnsType } from 'antd/lib/table'
import moment, { Moment } from 'moment'
import { useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { ITrainTrip, ITrainTripRes } from '../api/trainTrip'
import { EditOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import EditingModal, { IEditingModalRef } from './EditingModal'
import { g } from '../../utils/dataMap'
import Status from './Status'
import DetailEditModal, { IDetailEditModalRef } from './DetailEditModal'
import { ITrainTripDetailRes } from '../api/trainTripDetail'
import { grey } from '@ant-design/colors'
import PopulateTrainTripModal, { PopulateTrainTripModalRef } from './PopulateTrainTripModal'
const { RangePicker } = DatePicker

type Params = {
  queryKey: [string, string[]]
}

type perDayDataType = Record<string, ITrainTripDetailRes>

export const getTrainTrip = async ({ queryKey }: Params) => {
  const [_key, [start, end]] = queryKey
  const data: ITrainTripRes = await fetch(`/api/trainTrip?start=${start}&end=${end}`).then((res) =>
    res.json()
  )
  return data
}

const AdminPage = ({}: {}) => {
  const [range, setRange] = useState<[Moment, Moment]>([moment('2022-11-1'), moment('2022-11-9')])
  const isoRange = useMemo(() => range.map((m) => m.toISOString()), [range])
  // FIXME: 为什么文档写着dayjs，类型提示moment

  const populateModalRef = useRef<PopulateTrainTripModalRef | null>(null)
  const editModalRef = useRef<IEditingModalRef | null>(null)
  const detailEditModalRef = useRef<IDetailEditModalRef | null>(null)

  const queryClient = useQueryClient()
  // TODO：这个unknown什么鬼
  const query = useQuery<unknown, unknown, ITrainTripRes, Params['queryKey']>(
    ['/api/trainTrip', isoRange],
    getTrainTrip
  )

  const dataSource = useMemo(() => {
    const originData = query.data?.data
    return originData?.map((row) => {
      /** 遍历perday数组，组装K-V pair，其中key是 YYYY-MM-DD */
      const extra: perDayDataType = row.perDay.reduce((prev, cur) => {
        const key = moment(cur.timestamp).format('YYYY-MM-DD')
        prev[key] = cur
        return prev
      }, {} as any)

      return { ...row, perday: undefined, ...extra }
    })
  }, [query])

  const nameFilters = useMemo(
    () => query.data?.data?.map((record) => ({ text: record.name, value: record.name })),
    [query]
  )

  const perDayColumns: ColumnsType<perDayDataType> = useMemo(() => {
    const [start, end] = range
    const totalNum = end.diff(start, 'days') + 1
    return Array.from(Array(totalNum), (_, i) => {
      const date = start.clone().add(i, 'days')
      const dateStr = date.format('YYYY-MM-DD')
      const shortenStr = date.format('MM-DD')
      return {
        title: shortenStr,
        key: dateStr,
        dataIndex: dateStr,
        render(value: ITrainTripDetailRes | null, record, index) {
          return (
            <div
              style={{ cursor: 'pointer' }}
              onClick={() => detailEditModalRef.current?.open((record as any)._id, date, value)}
            >
              <Status ttDetail={value} />
            </div>
          )
        }
      }
    })
  }, [range])

  const basicColumns: ColumnsType<ITrainTrip> = useMemo(() => {
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
        onFilter: (value, record) => record.name === value
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
      }
    ]
  }, [nameFilters])

  return (
    <>
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: '20px' }}>
          <Col>
            <span style={{ lineHeight: '32px', fontSize: '30px' }}>动车组列车开行情况</span>
            <span style={{ color: grey.primary }}>({query.data?.data?.length})</span>
          </Col>
          <Col>
            <Button
              type="primary"
              style={{ width: 270 }}
              icon={<PlusOutlined />}
              onClick={() => populateModalRef.current?.open()}
            >
              增加一条动车组
            </Button>
          </Col>
        </Row>

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
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="标动" key="1">
            <Table
              dataSource={dataSource}
              columns={[...basicColumns, ...perDayColumns] as any}
              rowKey={'_id'}
              loading={query.isLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="北线" key="2">
            建设中
          </Tabs.TabPane>
          <Tabs.TabPane tab="南高" key="3">
            建设中
          </Tabs.TabPane>
        </Tabs>
      </Space>
      <PopulateTrainTripModal ref={populateModalRef} />
      <EditingModal ref={editModalRef}></EditingModal>
      <DetailEditModal ref={detailEditModalRef}></DetailEditModal>
    </>
  )
}

export default AdminPage
