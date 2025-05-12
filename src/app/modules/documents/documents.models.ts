import { model, Schema } from 'mongoose';
import { IDocuments, IDocumentsModules } from './documents.interface';

const documentsSchema = new Schema<IDocuments>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required'],
    },

    documentsType: {
      type: String,
      enum: ['passport', 'drivingLicense', 'nidCard', 'other'],
      required: [true, 'Documents type is required'],
    },

    documents: {
      type: [
        {
          key: { type: String, required: true },
          url: { type: String, required: true },
        },
      ],
      required: [true, 'Documents are required'],
    },
  },
  {
    timestamps: true,
  },
);

const Documents = model<IDocuments, IDocumentsModules>(
  'Documents',
  documentsSchema,
);
export default Documents;
