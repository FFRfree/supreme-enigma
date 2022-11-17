import dbConnect from '../lib/dbConnect'
import TrainTripPerDay from '../models/TrainTripPerDay'
import TrainTrip, { ITrainTrip } from '../models/TrainTrip'

// await dbConnect();
process.env.MONGODB_URI = 'mongodb://localhost:27017/my_db'

const mockArray = Array.from(Array(100).keys())

const mockDate = Array.from(Array(10), (_, i) => i + 1).map((v) => new Date(2022, 10, v))

const mockData: Array<ITrainTrip> = mockArray.map((num) => {
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

  await TrainTrip.remove({})
  console.log(`TrainTrip clear`)

  const jobs1 = mockData.map((data) => {
    return TrainTrip.create(data)
  })
  await Promise.all(jobs1)
  console.log(`${TrainTrip.name} seeded`)

  /**************/

  await TrainTripPerDay.remove({})
  console.log('TrainTripPerDay clear')

  const trainTrips = await TrainTrip.find({})
  const job2: any[] = []
  trainTrips.forEach((trainTrip) => {
    mockDate.forEach((day) => {
      const j = TrainTripPerDay.create({
        timestamp: day,
        metaData: { trainTripId: trainTrip._id },
        data: { isAvailable: Math.random() > 0.2 ? true : false }
      })
      job2.push(j)
    })
  })

  await Promise.all(job2)
  console.log(`TrainTripPerDay generated`)

  console.log('all done')
  conn!.disconnect()
}

main()
