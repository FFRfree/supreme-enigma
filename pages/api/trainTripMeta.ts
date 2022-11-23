import dbConnect from '../../lib/dbConnect'
import TrainTripDetail from '../../models/TrainTripDetail'
import type { NextApiRequest, NextApiResponse } from 'next'
import TrainTripMeta from '../../models/TrainTripMeta'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { method } = req

    await dbConnect()

    switch (method) {
      case 'GET': {
        const ans = await TrainTripMeta.find({})
        res.status(200).json({ success: true, data: ans })

        break
      }
      case 'POST': {
        const document = req.body
        const newRecord = new TrainTripMeta(document)
        const ans = await newRecord.save()
        // TrainTripMeta.insertMany([document])
        res.status(201).json({ success: true, data: ans })
        break
      }
      case 'PUT': {
        const { _id, updates } = req.body
        console.log('_id = ' + _id + '; updates = ' + JSON.stringify(updates))
        const ans = await TrainTripMeta.findByIdAndUpdate(_id, updates)
        if (!ans) return res.status(404).json({ success: false, msg: 'not found' })
        res.status(200).json({ success: true, data: ans })
        break
      }
      // case 'DELETE': {
      //   const { _id } = req.body
      //   const ans = await TrainTripMeta.findByIdAndDelete(_id)
      //   const timeseries = await TrainTripDetail.deleteMany({ 'metaData.trainTripId': _id })
      //   res.status(201).json({ success: true, data: ans, timeseries })
      //   break
      // }
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
