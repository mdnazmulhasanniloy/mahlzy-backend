
import { Model } from 'mongoose';


interface IImages{
    key:string;
    url:string
}
export interface IProducts {

 _id: string;  
  name: string;
  price: number;
  shortDescriptions: string;
  descriptions: string;
  author: ObjectId
  category: ObjectId;
  spiceLevel: string
  sauceLevel: string
  toppings: ObjectId[]; 
  discount: number;
  images: IImages[];
  totalReview:number;
  avgRatings:number;
  totalSell:string;
  isDeleted:boolian
}

 
export type IProductsModules = Model<IProducts, Record<string, unknown>>;