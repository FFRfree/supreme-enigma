import mongoose from 'mongoose'
import { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/dbConnect'
import TrainTripDetail, { ITrainTripDetail } from '../../models/TrainTripDetail'

export interface ITrainTripDetailRes extends ITrainTripDetail {
  _id: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { method } = req

    await dbConnect()

    switch (method) {
      case 'GET': {
        const ans = await TrainTripDetail.find({})
        res.status(200).json({ success: true, data: ans })
        break
      }
      // case 'POST': {
      //   const document = req.body
      //   const newRecord = new TrainTripDetail(document)
      //   const ans = await newRecord.save()
      //   res.status(200).json({ success: true, data: ans })
      //   break
      // }
      case 'PUT': {
        /** 更新，如果找不到，则创建 */
        const { timestamp, trainTripId, status, extra } = req.body
        console.log(req.body)
        const ans = await TrainTripDetail.updateOne(
          { timestamp, trainTripId: new mongoose.Types.ObjectId(trainTripId) },
          { status, extra },
          { upsert: true }
        )
        console.log(ans)
        res.status(200).json({ success: true, data: ans })
        break
      }
      case 'DELETE': {
        /** 删除某一天的开车信息 */
        const { _id } = req.body
        const ans = await TrainTripDetail.findByIdAndDelete(_id)
        res.status(201).json({ success: true, data: ans })
        break
      }
      default: {
        res.status(400).json({ success: false })
        break
      }
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, err: error })
  }
}
