import { message, Modal, Form, Input, DatePicker, TimePicker, Radio } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment, { Moment } from 'moment'
import mongoose, { mongo } from 'mongoose'
import { forwardRef, useState, useImperativeHandle } from 'react'
import { useQueryClient } from 'react-query'
import { ITrainTripDetail } from '../../models/TrainTripDetail'
import { g } from '../../utils/dataMap'
import { ITrainTrip } from '../api/trainTrip'
import { ITrainTripDetailRes } from '../api/trainTripDetail'

const adapter = (record: ITrainTripDetail) => {
  return {
    timestamp: moment(record.timestamp),
    trainTripId: record.trainTripId,
    status: record.status,
    extra: record.extra
  }
}

const updateTrainTripDetail = async (newValue: ITrainTripDetail) => {
  const { timestamp, trainTripId, extra, status } = newValue
  return await fetch('/api/trainTripDetail', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      timestamp,
      trainTripId,
      extra,
      status
    })
  }).then((resp) => resp.json())
}

const DetailEditModal = forwardRef<IDetailEditModalRef>(function EditingModal(props, ref) {
  const [visible, setVisible] = useState(false)
  const [ttid, setTtid] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()

  const [form] = useForm<ITrainTripDetail>()

  const handleOk = async () => {
    setConfirmLoading(true)
    const newValue = form.getFieldsValue()
    const resp = await updateTrainTripDetail(newValue)
    if (resp.success) {
      await queryClient.invalidateQueries('/api/trainTrip')
      message.success('成功修改')
      setConfirmLoading(false)
      setVisible(false)
    } else {
      message.error('出错了')
      setConfirmLoading(false)
    }
  }

  const handleCancel = () => {
    setVisible(false)
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        open(ttid, time, value) {
          setTtid(ttid)
          // TODO: update/upsert
          console.log(value)

          if (value) {
            form.setFieldsValue(adapter(value))
          } else {
            form.setFieldsValue({
              timestamp: moment(time),
              trainTripId: ttid,
              status: undefined,
              extra: undefined
            } as any)
          }
          setVisible(true)
        }
      }
    },
    [form]
  )
  return (
    <Modal
      title="Title"
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        autoComplete="off"
      >
        <Form.Item
          label="车次id"
          name="trainTripId"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          label="日期"
          name="timestamp"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <DatePicker disabled={true} />
        </Form.Item>
        <Form.Item
          label="附加信息"
          name="extra"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="开车信息"
          name="status"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Radio.Group>
            <Radio.Button value={0}>停</Radio.Button>
            <Radio.Button value={1}>开</Radio.Button>
            <Radio.Button value={2}>休</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
})

export interface IDetailEditModalRef {
  open: (ttid: string, time: Moment, value: ITrainTripDetailRes | null) => void
}

export default DetailEditModal
