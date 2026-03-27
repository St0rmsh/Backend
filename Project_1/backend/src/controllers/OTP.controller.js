import otpModel from "../models/otp.model.js";
import { generateOTP } from "../utils/otp.js";
import { sendOTP } from "../services/email.service.js";







export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    let record = await otpModel.findOne({ email });
    const now = Date.now();

    // 🔒 RATE LIMIT: 3 per minute
    if (record) {
      const diff = now - record.firstRequestTime;

      if (diff < 60 * 1000) {
        if (record.requestCount >= 3) {
          return res.status(429).json({
            message: "Too many OTP requests. Try after 1 minute"
          });
        }

        record.requestCount += 1;
      } else {
        // reset after 1 min
        record.requestCount = 1;
        record.firstRequestTime = now;
      }
    } else {
      record = new otpModel({
        email,
        requestCount: 1,
        firstRequestTime: now
      });
    }

    const otp = generateOTP();

    record.otp = otp;
    record.expiresAt = new Date(now + 5 * 60 * 1000); // 5 min
    record.attempts = 0;
    record.isVerified = false;

    await record.save();

    await sendOTP(email, otp);

    return res.json({
      success: true,
      message: "OTP sent"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Failed to send OTP"
    });
  }
};



export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await otpModel.findOne({ email });

    if (!record) {
      return res.status(400).json({
        message: "OTP not found"
      });
    }

    // ⏱ Expiry check
    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    // 🚫 Max attempts (5)
    if (record.attempts >= 5) {
      return res.status(429).json({
        message: "Too many attempts. Request new OTP"
      });
    }

    // ❌ Wrong OTP
    if (record.otp !== otp) {
      record.attempts += 1;
      await record.save();

      return res.status(400).json({
        message: `Invalid OTP (${record.attempts}/5)`
      });
    }

    // ✅ SUCCESS
    record.isVerified = true;
    await record.save();

    return res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Verification failed"
    });
  }
};

