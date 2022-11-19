import dbConnect from '../../lib/dbConnect'
import TrainTripDetail from '../../models/TrainTripDetail'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const { method } = req

  await dbConnect()

  switch (method) {
    // case 'GET':
    //   try {
    //     const users = await TrainTripDetail.find({})
    //     res.status(200).json({ success: true, data: users })
    //   } catch (error) {
    //     res.status(400).json({ success: false })
    //   }
    //   break
    case 'POST':
      try {
        const user = await TrainTripDetail.create(req.body)
        res.status(201).json({ success: true, data: user })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    case 'PUT':
      try {
        const { _id, updates } = req.body
        console.log('_id = ' + _id + '; updates = ' + JSON.stringify(updates))
        const ans = await TrainTripDetail.findById('63776c8410593dd154077a21')
        res.status(200).json({ success: true, data: ans?.toJSON() })
      } catch (error) {
        console.log(error)
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
