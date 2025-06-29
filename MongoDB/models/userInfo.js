import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    //user_id
    _id: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    user_name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
