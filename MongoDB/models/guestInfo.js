import mongoose from 'mongoose';

const GuestSchema = new mongoose.Schema(
  {
    //guest_id
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
    },
    user_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    memo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Guest = mongoose.model('Guest', GuestSchema);

export default Guest;
