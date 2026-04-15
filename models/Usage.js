import mongoose from 'mongoose';

const UsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  totalKw: {
    type: Number,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.Usage || mongoose.model('Usage', UsageSchema);
