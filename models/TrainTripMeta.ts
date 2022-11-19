import mongoose, { Model } from 'mongoose'

export interface ITrainTripMeta {
  name: string
  OrderDate: Date
  OrderId: string
  DepartureStation: string
  ArriveStation: string
  DepartureTime: Date
  ArriveTime: Date
}

const TrainTripMetaSchema = new mongoose.Schema<ITrainTripMeta>(
  {
    name: String,
    OrderDate: Date,
    OrderId: String,
    DepartureStation: String,
    ArriveStation: String,
    DepartureTime: Date,
    ArriveTime: Date
  },
  { collection: 'TrainTripMeta' }
)

const TrainTripMeta: Model<ITrainTripMeta> =
  mongoose.models.TrainTripMeta || mongoose.model('TrainTripMeta', TrainTripMetaSchema)

export default TrainTripMeta
