import mongoose, { Document, Schema } from 'mongoose';

export interface IDailyGoal extends Document {
  title: string;
  date: Date;
  completed: boolean;
}

const DailyGoalSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IDailyGoal>('DailyGoal', DailyGoalSchema); 