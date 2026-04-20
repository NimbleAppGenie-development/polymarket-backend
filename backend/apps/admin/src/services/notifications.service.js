const axios = require("axios");
const User = require("@models/user");
const UserNotification = require("@models/user-notification");
const { sendNotificationToSingleDevice } = require("@utils/firebaseNotification");
const Notification = require("@models/notification");

class NotificationService {
    async sendNotification(payload) {
        try {
            const { notificationData, userId } = payload;
            const userData = await User.findOne({ where: { id: userId } })
            if (!userData) {
                return res.status(400).json(successResponse(
                    bannersData,
                    "User not found"
                ))
            }
      
            // const createData = await UserNotification.create({
            //     userId: userId,
            //     notificationType: notificationData.type,
            //     title: notificationData.title,
            //     message: notificationData.message,
            //     isSeen: false,
            //     image: notificationData.image ?? "",
            // });


            const payloadData = {
                deviceType: userData.deviceType,
                deviceToken: userData.deviceToken,
                type: notificationData.type,
                title: notificationData.title,
                message: notificationData.message,
            }
                        
            await sendNotificationToSingleDevice(payloadData);
            
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = new NotificationService();
