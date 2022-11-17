import Table, { ColumnsType } from 'antd/lib/table'
import { AppContext } from 'next/app'
import { Idata, trainTripDetailFetcher } from '../api/trainTripDetail'
// import { ITrainTripDetailRes } from '../api/trainTripDetail'

export async function getServerSideProps(context: AppContext) {
  const data = await trainTripDetailFetcher()

  return {
    props: { data: JSON.parse(JSON.stringify(data)) } // will be passed to the page component as props
  }
}

const adminPage = ({ data }: { data: Idata[] }) => {
  const columns: ColumnsType<Idata> = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'OrderDate',
      dataIndex: 'OrderDate',
      key: 'OrderDate'
    },
    {
      title: 'OrderId',
      dataIndex: 'OrderId',
      key: 'OrderId'
    },
    {
      title: 'DepartureStation',
      dataIndex: 'DepartureStation',
      key: 'DepartureStation'
    },
    {
      title: 'ArriveStation',
      dataIndex: 'ArriveStation',
      key: 'ArriveStation'
    },
    {
      title: 'DepartureTime',
      dataIndex: 'DepartureTime',
      key: 'DepartureTime'
    },
    {
      title: 'ArriveTime',
      dataIndex: 'ArriveTime',
      key: 'ArriveTime'
    }
  ]

  return (
    <div>
      <div>admin</div>
      {/* <div>{JSON.stringify(data)}</div> */}
      <Table dataSource={data} columns={columns} />;
    </div>
  )
}

export default adminPage
