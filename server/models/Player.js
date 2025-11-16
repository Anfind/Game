import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['A', 'B'],
    default: null
  },
  groupNumber: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true
  },
  pairId: {
    type: String,
    default: null
  },
  socketId: {
    type: String,
    required: true
  },
  isWaiting: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Player', playerSchema);
