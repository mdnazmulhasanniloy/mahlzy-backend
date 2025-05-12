import { Model, ObjectId } from 'mongoose';
import { IUser } from '../user/user.interface';
interface IImages {
  key: string;
  url: string;
}
export interface IDocuments {
  user: ObjectId | IUser;
  documentsType: string;
  documents: IImages[];
}

export type IDocumentsModules = Model<IDocuments, Record<string, unknown>>;
