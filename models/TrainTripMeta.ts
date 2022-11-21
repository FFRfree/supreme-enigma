import { Moment } from 'moment'
import mongoose, { Model } from 'mongoose'

export interface ITrainTripMeta {
  name: string
  OrderDate: Moment
  OrderId: string
  DepartureStation: string
  ArriveStation: string
  DepartureTime: Moment
  ArriveTime: Moment
}

const TrainTripMetaSchema = new mongoose.Schema<ITrainTripMeta>(
  {
    name: { type: String, required: true },
    OrderDate: { type: Date, required: true },
    OrderId: { type: String, required: true },
    DepartureStation: { type: String, required: true },
    ArriveStation: { type: String, required: true },
    DepartureTime: { type: Date, required: true },
    ArriveTime: { type: Date, required: true }
  },
  { collection: 'TrainTripMeta' }
)

const TrainTripMeta: Model<ITrainTripMeta> =
  mongoose.models.TrainTripMeta || mongoose.model('TrainTripMeta', TrainTripMetaSchema)

export default TrainTripMeta
