import mongoose, { Model } from 'mongoose'

export interface ITrainTripDetail {
  timestamp: Date
  metaData: { trainTripId: Number }
  data: { isAvailable: Boolean }
}

const ObjectId = mongoose.Schema.Types.ObjectId

const TrainTripDetailSchema = new mongoose.Schema<ITrainTripDetail>(
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
    collection: 'TrainTripDetail'
  }
)

const TrainTripDetail: Model<ITrainTripDetail> =
  mongoose.models.TrainTripDetail ||
  mongoose.model<ITrainTripDetail>('TrainTripDetail', TrainTripDetailSchema)

export default TrainTripDetail
