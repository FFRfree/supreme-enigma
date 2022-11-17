import mongoose, { Model } from 'mongoose'

export interface ITrainTrip {
  name: string
  OrderDate: Date
  OrderId: string
  DepartureStation: string
  ArriveStation: string
  DepartureTime: Date
  ArriveTime: Date
}

const TrainTripSchema = new mongoose.Schema<ITrainTrip>(
  {
    name: String,
    OrderDate: Date,
    OrderId: String,
    DepartureStation: String,
    ArriveStation: String,
    DepartureTime: Date,
    ArriveTime: Date
  },
  { collection: 'train_trip' }
)

const TrainTrip: Model<ITrainTrip> =
  mongoose.models.TrainTrip || mongoose.model('TrainTrip', TrainTripSchema)

export default TrainTrip
