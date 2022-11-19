import dbConnect from '../../lib/dbConnect'
import TrainTripDetail from '../../models/TrainTripDetail'
import type { NextApiRequest, NextApiResponse } from 'next'
import TrainTripMeta from '../../models/TrainTripMeta'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const ans = await TrainTripDetail.find({})
        res.status(200).json({ success: true, data: ans })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, err: error })
      }
      break
    case 'POST':
      try {
        const { document } = JSON.parse(req.body)
        const ans = await (await TrainTripMeta.create(document)).save()
        res.status(201).json({ success: true, data: ans })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        const { _id, updates } = JSON.parse(req.body)
        console.log('_id = ' + _id + '; updates = ' + JSON.stringify(updates))
        const ans = await TrainTripMeta.findByIdAndUpdate(_id, updates)
        if (!ans) return res.status(404).json({ success: false, msg: 'not found' })
        res.status(200).json({ success: true, data: ans })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, err: error })
      }
      break
    case 'DELETE':
      try {
        const { _id } = JSON.parse(req.body)
        const ans = await TrainTripMeta.findByIdAndDelete(_id)
        res.status(201).json({ success: true, data: ans })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, err: error })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
