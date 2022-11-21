// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../lib/dbConnect'
import TrainTripDetail, { ITrainTripDetail } from '../../models/TrainTripDetail'
import type { NextApiRequest, NextApiResponse } from 'next'
import TrainTrip, { ITrainTripMeta } from '../../models/TrainTripMeta'

export interface ITrainTrip extends ITrainTripMeta {
  _id: string
  perDay: Array<ITrainTripDetail>
}

// type Modify<T, R> = Omit<T, keyof R> & R

export interface ITrainTripRes {
  success: boolean
  data?: ITrainTrip[]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ITrainTripRes>) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      const { start, end } = req.query
      const matchConditions: any = { timestamp: {} }
      if (typeof start === 'string' && start.length > 0) {
        matchConditions.timestamp.$gte = new Date(start as string)
        // console.log(matchConditions.timestamp.$gt)
      }
      if (typeof end === 'string' && end.length > 0) {
        matchConditions.timestamp.$lte = new Date(end as string)
        // console.log(matchConditions.timestamp.$lt)
      }
      console.log(start, end)
      // console.log(JSON.stringify(matchConditions))
      try {
        const data = await TrainTrip.aggregate<ITrainTrip>([
          {
            $lookup: {
              from: 'TrainTripDetail',
              localField: '_id',
              foreignField: 'trainTripId',
              as: 'perDay',
              pipeline: [
                {
                  $match: matchConditions
                },
                {
                  $sort: { timestamp: 1 }
                }
              ]
            }
          }
        ])
        // const data = (await TrainTripPerDaySorted).find({})
        res.status(200).json({ success: true, data })
      } catch (error) {
        res.status(400).json({ success: false })
      }
      break
    default:
      res.status(400).json({ success: false })
      break
  }
}
