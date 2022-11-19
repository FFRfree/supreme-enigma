import dbConnect from '../../lib/dbConnect'
import TrainTripDetail from '../../models/TrainTripDetail'
import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { method } = req
    console.log(req.body)

    await dbConnect()

    switch (method) {
      case 'POST': {
        // ? deleteMany 不能用嵌套object，只能这么写
        const ans = await TrainTripDetail.deleteMany({
          'metaData.trainTripId': '63776c8410593dd154077a26'
        })
        console.log(ans)
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
