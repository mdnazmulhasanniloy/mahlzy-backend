import { Model, ObjectId } from 'mongoose';

interface ILocation {
  type: string;
  coordinates: [number, number];
}

export interface IDeliveryMan {
  id: string;
  user: ObjectId;
  shop: ObjectId;
  vehicleType: string;
  availability_status: boolean;
  total_delivery: number;
  avg_rating: number;
  lastLocation: ILocation;
  isDeleted: boolean;
}

export interface IDeliveryManModules
  extends Model<IDeliveryMan, Record<string, unknown>> {
  isDeliveryManExist(id: string): Promise<IDeliveryMan>;
}
