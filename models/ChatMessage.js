import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    promptText: { type: String, required: true, maxlength: 4000 },
    score: { type: Number },
    tags: [{ type: String }],
    historyId: { type: mongoose.Schema.Types.ObjectId, ref: 'PromptHistory', default: null },
    author: {
      name: { type: String },
      image: { type: String },
    },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ createdAt: -1 });

export default mongoose.models.ChatMessage ||
  mongoose.model('ChatMessage', ChatMessageSchema);
