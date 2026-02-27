import mongoose from 'mongoose';

const PromptHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    prompt: { type: String, required: true, maxlength: 4000 },
    score: { type: Number, min: 0, max: 10 },
    clarity: { type: String, enum: ['low', 'medium', 'high'] },
    tags: [{ type: String }],
    suggestions: [{ type: String }],
    rawEval: { type: String },
    sharedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

PromptHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.PromptHistory ||
  mongoose.model('PromptHistory', PromptHistorySchema);
