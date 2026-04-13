const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("../../../my-cricket-league-firebase-adminsdk-fbsvc-56345d3cce.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Function to send notification
async function sendNotificationToDevices(payload) {
    try {
        // Send the message
        const response = await admin.messaging().sendMulticast(payload);
        console.log("Successfully sent notification to all:", response);
    } catch (error) {
        console.error("Error sending message:", error);
    }
}

// Function to send notification to a single device
async function sendNotificationToSingleDevice(payload) {
    try {
        if (!payload.deviceToken) {
            throw new Error("Notification payload must include a token.");
        }
        const message = {
            token: String(payload?.deviceToken),
            notification: {
                title: String(payload?.title),
                body: String(payload?.message),
            },
            data: {
                type: String(payload?.type),
                title: String(payload?.title),
                message: String(payload?.message),
                increaseType: String(payload?.incrementType),
                key2: "value2",
            },
        };
        const response = await admin.messaging().send(message);

    } catch (error) {
        console.error("Error sending notification to single device:", error);
    }
}

module.exports = {
    sendNotificationToSingleDevice,
    sendNotificationToDevices,
};
