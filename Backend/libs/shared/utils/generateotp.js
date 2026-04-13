require("dotenv").config();

// Generate OTP function
function generateOTP(length) {
    // if (process.env.NODE_ENV === 'development'){
      return 111111;
    // }
    const digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < length; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }
  
  module.exports = {generateOTP};
  