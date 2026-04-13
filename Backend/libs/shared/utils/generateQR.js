const QRCode = require('qrcode');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { encrypt } = require('./encryptedString');

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

const generateQRCode = async (userId) => {
  // try {
  //   if (!userId) {
  //     throw new Error('User ID is required');
  //   }

  //   const encryptedUserId = encrypt(userId.toString());

  //   // Generate QR code buffer
  //   const qrBuffer = await QRCode.toBuffer(encryptedUserId, {
  //     errorCorrectionLevel: 'H',
  //     type: 'png',
  //     margin: 2,
  //     width: 300,
  //   });

  //   const fileName = `qrcode/qr-user-${userId}-${Date.now()}.png`;

  //   // Upload to S3
  //   const uploadParams = {
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: fileName,
  //     Body: qrBuffer,
  //     ContentType: 'image/png',
  //   };

  //   await s3.send(new PutObjectCommand(uploadParams));

  //   const publicUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  //   console.log(`✅ QR code uploaded to: ${publicUrl}`);

    return null;
  // } catch (error) {
  //   console.error('❌ Error generating or uploading QR code:', error.message);
  //   throw error;
  // }
};

module.exports = { generateQRCode };
