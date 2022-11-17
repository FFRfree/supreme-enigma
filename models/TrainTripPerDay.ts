import mongoose, { Model } from 'mongoose'

export interface ITrainTripPerDay {
  timestamp: Date
  metaData: { trainTripId: Number }
  data: { isAvailable: Boolean }
}

const ObjectId = mongoose.Schema.Types.ObjectId

const TrainTripPerDaySchema = new mongoose.Schema<ITrainTripPerDay>(
  {
    timestamp: Date,
    metaData: { trainTripId: ObjectId },
    data: { isAvailable: Boolean }
  },
  {
    timeseries: {
      timeField: 'timestamp',
      metaField: 'metaData',
      granularity: 'hours'
    },
    collection: 'train_trip_availability_per_day'
  }
)

const TrainTripPerDay: Model<ITrainTripPerDay> =
  mongoose.models.TrainTripPerDay ||
  mongoose.model<ITrainTripPerDay>('TrainTripPerDay', TrainTripPerDaySchema)

export default TrainTripPerDay
