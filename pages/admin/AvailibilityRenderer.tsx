import { Button, Checkbox, Descriptions, Form, Input, Modal, Space, Tag, Tooltip } from 'antd'
import { Moment } from 'moment'
import { ITrainTripDetail } from '../../models/TrainTripDetail'
import { enumMap } from '../../utils/dataMap'
import dynamic from 'next/dynamic'
import MomentVertical from './MomentVertical'

const _AvailbilityTitle = ({ datesRange }: { datesRange: [Moment, Moment] }) => {
  const [start, end] = datesRange
  const totalNum = end.diff(start, 'days') + 1
  const li = Array.from(Array(totalNum), (_, i) => (
    <MomentVertical key={i} mm={start.clone().add(i, 'day')}></MomentVertical>
  ))
  // return <Space>{Array.from(Array(totalNum), (_, i) => start.add(i, 'day').format('MM-DD'))}</Space>
  return <Space>{li}</Space>
}
export const AvailbilityTitle = dynamic(() => Promise.resolve(_AvailbilityTitle), { ssr: false })

export const AvailabilityRow = ({ datesList }: { datesList: ITrainTripDetail[] }) => {
  const handleClick = () =>
    Modal.info({
      content: <TrainTripDetailForm />,
      icon: <div></div>
    })
  return (
    <Space>
      {datesList.map((v) => {
        const config = enumMap[v.data.isAvailable ? 1 : 0]
        return (
          <Tooltip title={<ExtraInfoDisplay />} key={v.timestamp as any}>
            <Tag
              style={{ width: 36, marginRight: 0, textAlign: 'center', cursor: 'pointer' }}
              color={config.color}
              onClick={handleClick}
            >
              {config.name}
            </Tag>
          </Tooltip>
        )
      })}
    </Space>
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

const TrainTripDetailForm = () => {
  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}
