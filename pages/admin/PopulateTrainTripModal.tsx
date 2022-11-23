import { message, Modal, Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { forwardRef, useState, useImperativeHandle } from 'react'
import { useQueryClient } from 'react-query'
import { ITrainTripMeta } from '../../models/TrainTripMeta'
import { ITrainTrip } from '../api/trainTrip'
import { IEditingModalRef, TrainTripMetaFormItems } from './EditingModal'

const populateTrainTripMeta = async (record: ITrainTripMeta) => {
  return await fetch('/api/trainTripMeta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(record)
  }).then((resp) => resp.json())
}

const PopulateTrainTripModal = forwardRef<PopulateTrainTripModalRef>(function EditingModal(
  props,
  ref
) {
  const [visible, setVisible] = useState(false)
  const [recordId, setRecordId] = useState<string>('')
  const [confirmLoading, setConfirmLoading] = useState(false)
  const queryClient = useQueryClient()

  const [form] = useForm<ITrainTrip>()

  const handleOk = async () => {
    await form.validateFields()
    const newRecord = form.getFieldsValue()
    setConfirmLoading(true)
    const ans = await populateTrainTripMeta(newRecord)
    if (ans.success) {
      await queryClient.invalidateQueries('/api/trainTrip')
      message.success('成功添加')
      setVisible(false)
    } else {
      message.error('出错了')
      console.error(ans.err)
    }
    setConfirmLoading(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setVisible(false)
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        open() {
          setVisible(true)
        }
      }
    },
    []
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

export interface PopulateTrainTripModalRef {
  open: () => void
}

export default PopulateTrainTripModal
