import mongoose, { Document, Schema } from 'mongoose';

export interface IWeeklyGoal extends Document {
  title: string;
  date: Date;
  completed: boolean;
  userId: string;
}

const WeeklyGoalSchema: Schema = new Schema(
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

export default mongoose.model<IWeeklyGoal>('WeeklyGoal', WeeklyGoalSchema); 