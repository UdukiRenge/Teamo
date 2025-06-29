import mongoose from 'mongoose';

const CustomFoldrSchema = new mongoose.Schema(
  {
    //folder_id
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
    folder_name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
    },
  },
  {
    timestamps: true,
  }
);

const CustomFoldr = mongoose.model('CustomFolder', CustomFoldrSchema);

export default CustomFoldr;
