import dbConnect from '../lib/dbConnect'
import TrainTripDetail from '../models/TrainTripDetail'
import TrainTripMeta, { ITrainTripMeta } from '../models/TrainTripMeta'

// await dbConnect();
process.env.MONGODB_URI = 'mongodb://localhost:27017/my_db'

const mockArray = Array.from(Array(100).keys())

const mockDate = Array.from(Array(10), (_, i) => i + 1).map((v) => new Date(2022, 10, v))

const mockData: Array<any> = mockArray.map((num) => {
  return {
    name: `交路${num}`,
    OrderDate: new Date(2022, 5, num),
    OrderId: `G${num}`,
    DepartureStation: 'shanghai',
    ArriveStation: 'beijing',
    DepartureTime: new Date(1900, 0, 1, 1, num),
    ArriveTime: new Date(1900, 0, 1, 1, num + 120)
  }
})

// const mockTrainTr

async function main() {
  const conn = await dbConnect()
  console.log('db connected')

  await TrainTripMeta.collection.drop()
  console.log(`TrainTripMeta clear`)

  const jobs1 = mockData.map((data) => {
    return TrainTripMeta.create(data)
  })
  await Promise.all(jobs1)
  console.log(`TrainTripMeta seeded`)

  /**************/

  // FIXME：这里复用手动设置的collection
  await TrainTripDetail.collection.drop()
  console.log('TrainTripDetail clear')

  const trainTrips = await TrainTripMeta.find({})
  const job2: any[] = []
  trainTrips.forEach((trainTrip) => {
    mockDate.forEach((day) => {
      const j = TrainTripDetail.create({
        timestamp: day,
        trainTripId: trainTrip._id,
        status: Math.round(Math.random() * 2),
        extra: '备注信息'
      })
      job2.push(j)
    })
  })

  await Promise.all(job2)
  console.log(`TrainTripDetail generated`)

  console.log('all done')
  conn!.disconnect()
}

main()
