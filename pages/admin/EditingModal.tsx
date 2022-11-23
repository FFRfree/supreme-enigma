import { DatePicker, Form, Input, Modal, TimePicker, message, Button } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import moment from 'moment'
import { useMemo, useState } from 'react'
import { forwardRef, useImperativeHandle } from 'react'
import { useQueryClient } from 'react-query'
import { ITrainTripMeta } from '../../models/TrainTripMeta'
import { g } from '../../utils/dataMap'
import { ITrainTrip } from '../api/trainTrip'

const adapter = (record: ITrainTripMeta): ITrainTripMeta => {
  /**为保证date不是字符串而是Date */
  const { name, OrderDate, OrderId, DepartureStation, ArriveStation, DepartureTime, ArriveTime } =
    record
  return {
    name: String(name),
    OrderDate: moment(OrderDate),
    OrderId: String(OrderId),
    DepartureStation: String(DepartureStation),
    ArriveStation: String(ArriveStation),
    DepartureTime: moment(DepartureTime),
    ArriveTime: moment(ArriveTime)
  }
}

const updateTrainTripMeta = async (id: string, updates: ITrainTripMeta) => {
  return await fetch('/api/trainTripMeta', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      _id: id,
      updates
    })
  }).then((resp) => resp.json())
}

const deleteTrainTrip = async (trainTripId: string) => {
  return await fetch('/api/trainTrip', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ trainTripId })
  }).then((resp) => resp.json())
}

const EditingModal = forwardRef<IEditingModalRef>(function EditingModal(props, ref) {
  const [visible, setVisible] = useState(false)
  const [recordId, setRecordId] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()

  const [form] = useForm<ITrainTrip>()

  const handleOk = () => {
    const updates = form.getFieldsValue()
    setConfirmLoading(true)
    console.log(recordId)
    updateTrainTripMeta(recordId, updates).then((resp) => {
      console.log(resp)
      if (resp.success) {
        queryClient.invalidateQueries('/api/trainTrip').then(() => {
          setConfirmLoading(false)
          setVisible(false)
        })
      } else {
        message.error('出错了')
        console.error(resp.err)
        setConfirmLoading(false)
      }
    })
  }

  const handleCancel = () => {
    setVisible(false)
  }

  const handleDelete = async () => {
    // TODO: 二次提示
    setConfirmLoading(true)
    const { success, meta, detail, err } = await deleteTrainTrip(recordId)
    console.log(success, meta, detail)
    if (success) {
      await queryClient.invalidateQueries('/api/trainTrip')
      message.success(
        `成功删除【${meta.name}】交路和对应的【${detail.deletedCount || 0}条排班信息】`
      )
      setVisible(false)
    } else {
      message.error('出错了')
      console.error(err)
    }
    setConfirmLoading(false)
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        open(record) {
          setRecordId(record._id)
          form.setFieldsValue(adapter(record))
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
      footer={
        <div style={{ display: 'flex' }}>
          <Button onClick={handleDelete} disabled={confirmLoading} danger>
            删除
          </Button>
          <div style={{ flexGrow: 1 }}></div>
          <Button onClick={handleCancel} disabled={confirmLoading}>
            取消
          </Button>
          <Button type="primary" onClick={handleOk} disabled={confirmLoading}>
            保存
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        // initialValues={formData}
        // onFinish={onFinish}
        //   onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <TrainTripMetaFormItems></TrainTripMetaFormItems>
      </Form>
    </Modal>
  )
})

export const TrainTripMetaFormItems = () => {
  return (
    <>
      <Form.Item
        label={g['name']}
        name="name"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={g['OrderDate']}
        name="OrderDate"
        rules={[{ required: true, message: '请输入' }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        label={g['OrderId']}
        name="OrderId"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={g['DepartureStation']}
        name="DepartureStation"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={g['ArriveStation']}
        name="ArriveStation"
        rules={[{ required: true, message: '请输入' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={g['DepartureTime']}
        name="DepartureTime"
        rules={[{ required: true, message: '请输入' }]}
      >
        <TimePicker />
      </Form.Item>
      <Form.Item
        label={g['ArriveTime']}
        name="ArriveTime"
        rules={[{ required: true, message: '请输入' }]}
      >
        <TimePicker />
      </Form.Item>
    </>
  )
}
export interface IEditingModalRef {
  open: (record: ITrainTrip) => void
}

export default EditingModal
