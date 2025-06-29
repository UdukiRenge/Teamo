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

delete mongoose.models.Inquirie;
const Inquirie = mongoose.models.Inquirie || mongoose.model('Inquirie', InquirieSchema);

export default Inquirie;
