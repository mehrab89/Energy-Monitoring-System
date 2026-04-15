import mongoose from 'mongoose';

const ApplianceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  wattage: {
    type: Number,
    required: true,
  },
  startTime: {
    type: String, // e.g. "22:00"
    required: true,
  },
  endTime: {
    type: String, // e.g. "06:00"
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Appliance || mongoose.model('Appliance', ApplianceSchema);
