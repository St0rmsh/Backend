import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,

  attempts: {
    type: Number,
    default: 0
  },

  requestCount: {
    type: Number,
    default: 0
  },

  firstRequestTime: Date,

  isVerified: {
    type: Boolean,
    default: false
  }
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const otpModel = mongoose.model("OTP", otpSchema);

export default otpModel;

