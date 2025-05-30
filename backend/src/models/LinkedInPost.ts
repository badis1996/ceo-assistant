import mongoose, { Document, Schema } from 'mongoose';

export type LinkedInPostStatus = 'scheduled' | 'posted' | 'open';

export interface ILinkedInPost extends Document {
  title: string;
  date: Date;
  status: LinkedInPostStatus;
  userId: string;
}

const LinkedInPostSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['scheduled', 'posted', 'open'],
      default: 'scheduled'
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ILinkedInPost>('LinkedInPost', LinkedInPostSchema); 