// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from '../../lib/dbConnect'
import TrainTripDetail, { ITrainTripDetail   } from '../../models/TrainTripDetail'
import type { NextApiRequest, NextApiResponse } from 'next'
import TrainTrip, { ITrainTripMeta } from '../../models/TrainTripMeta'

export interface Idata extends ITrainTripMeta {
  perDay: Array<ITrainTripDetail  >
}

export interface ITrainTripDetailRes {
  success: boolean
  data?: Idata[]
}

export const trainTripDetailFetcher = async () => {
  await dbConnect()
  const data = await TrainTrip.aggregate<Idata>([
    {
      $lookup: {
        from: 'train_trip_availability_per_day',
        localField: '_id',
        foreignField: 'metaData.trainTripId',
        as: 'perDay',
        pipeline: [
          {
            $sort: { timestamp: 1 }
          }
        ]
      }
    }
  ])
  return data
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ITrainTripDetailRes>
) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const data = await TrainTrip.aggregate<Idata>([
          {
            $lookup: {
              from: 'train_trip_availability_per_day',
              localField: '_id',
              foreignField: 'metaData.trainTripId',
              as: 'perDay',
              pipeline: [
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
