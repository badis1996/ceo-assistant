import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description: string;
  date: Date;
  category: 'product' | 'sales' | 'marketing';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes: string;
}

const TaskSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    category: {
      type: String,
      required: true,
      enum: ['product', 'sales', 'marketing']
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high']
    },
    completed: {
      type: Boolean,
      default: false
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITask>('Task', TaskSchema); 