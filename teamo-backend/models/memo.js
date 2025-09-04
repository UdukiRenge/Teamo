import mongoose from 'mongoose';

const MemoSchema = new mongoose.Schema(
  {
    //memo_id
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
    folder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomFolder',
      default: null
    },
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
    text: {
      type: String,
      default: ''
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Memo || mongoose.model("Memo", MemoSchema);
