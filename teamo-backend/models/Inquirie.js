import mongoose from 'mongoose';

const InquirieSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId(),
      required: true,
    },
    inquirie: {
      type: String,
      required: true,
    }
  }
);

export default mongoose.models.Inquirie || mongoose.model("Inquirie", InquirieSchema);
