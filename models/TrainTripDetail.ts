import { Moment } from 'moment'
import mongoose, { Model, mongo, ObjectId } from 'mongoose'

export interface ITrainTripDetail {
  timestamp: Moment
  trainTripId: ObjectId
  status: number
  extra?: string
}

const ObjectId = mongoose.Schema.Types.ObjectId

const TrainTripDetailSchema = new mongoose.Schema<ITrainTripDetail>(
  {
    timestamp: { type: Date, required: true, index: true },
    trainTripId: { type: ObjectId, required: true, index: true },
    status: { type: Number, required: true },
    extra: { type: String, required: true }
  },
  {
    collection: 'TrainTripDetail'
  }
)

const TrainTripDetail: Model<ITrainTripDetail> =
  mongoose.models.TrainTripDetail ||
  mongoose.model<ITrainTripDetail>('TrainTripDetail', TrainTripDetailSchema)

export default TrainTripDetail
