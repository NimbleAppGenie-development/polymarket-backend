const User = require("@models/user");
// const UserLimit = require("@models/user-limit");
const cron = require("node-cron");
const { sendNotificationToSingleDevice } = require("@utils/firebaseNotification");
const UserReferral = require("@models/userReferral");
const { Op } = require('sequelize');
const Questions = require("@models/question");
const UserPredictedQuestion = require("@models/userpredictedquestions");
const Matches = require("@models/matches");
const UserNotification = require("@models/user-notification");
const Transactions = require("@models/transactions");
const { sendNotification } = require("../../../apps/user/src/services/notifications.service");
const Notification = require("@models/notification");

// function startUserTimeLimitCron() {
//     cron.schedule("* * * * *", async () => {
//         try {
//             const now = new Date();

//             // Step 1: Get the reminder limit
//             const reminderLimit = await Limit.findOne({
//                 where: { limitType: "REMINDER" },
//             });

//             if (!reminderLimit) return;

//             // Step 2: Get all latest UserLimits for this limitId
//             const userLimits = await UserLimit.findAll({
//                 where: { limitId: reminderLimit.id },
//                 order: [["createdAt", "DESC"]],
//             });

//             const userIds = [...new Set(userLimits.map((ul) => ul.userId))];

//             if (userIds.length === 0) return;

//             // Step 3: Get only the relevant users
//             const users = await User.findAll({
//                 where: { id: userIds },
//             });

//             // Step 4: Match each user with their latest reminder
//             for (const user of users) {
//                 const reminder = userLimits.find((ul) => ul.userId === user.id);
//                 if (!reminder) continue;

//                 const loginTime = new Date(user.lastLogin);
//                 const limitStr = reminder?.timeLimit || "00:00:00";
//                 const [hours, minutes, seconds] = limitStr.split(":").map(Number);
//                 const allowedMs = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;

//                 const elapsedMs = now - loginTime;

//                 if (elapsedMs >= allowedMs && user.deviceToken) {
//                     await sendNotificationToSingleDevice(
//                         user.deviceType,
//                         user.deviceToken,
//                         "REMINDER",
//                         "Time Limit Reached",
//                         `Hi ${user.firstName}, your session has expired.`
//                     );
//                 }
//             }
//         } catch (error) {
//             console.error("❌ Error in cron job:", error);
//         }
//     });
// }

function startReferralRewardCron() {
    cron.schedule("* * * * *", async () => {
        try {
            // Step 1: Get all pending referrals
            const pendingReferrals = await UserReferral.findAll({
                where: { status: "pending" },
            });

            if (!pendingReferrals.length) return;

            // Step 2: Process each referral
            for (const referral of pendingReferrals) {
                const referrer = await User.findByPk(referral.referrerId);

                if (!referrer) continue;

                // Step 3: Update referredBy balance (treat it as numeric field)
                let currentBalance = Number(referrer.referredBy || 0);
                let bonus = Number(referral.bonusAmount || 0);
                let newBalance = currentBalance + bonus;

                referrer.referredBy = newBalance;
                await referrer.save();

                // Step 4: Update referral status
                referral.status = "rewarded";
                await referral.save();
            }
        } catch (error) {
            console.error("❌ Error in Referral Reward Cron:", error);
        }
    });
}

function startQuestionWinnerPayoutCron() {
    cron.schedule("* * * * *", async () => {
        console.log("🔁 Running Question Winner Payout Cron...");

        try {
            // 1. Get all questions where status is true and answer is announced
            const questionsToProcess = await Questions.findAll({
                where: {
                    status: true,
                    answer: {
                        [Op.ne]: 'N/A'
                    }
                }
            });

            if (!questionsToProcess.length) {
                console.log("✅ No answered questions pending for payout.");
                return;
            }

            // 2. Loop through each question
            for (const question of questionsToProcess) {
                const {
                    id: questionId,
                    matchId,
                    answer,
                    optionA,
                    optionB,
                    price,
                    question1
                } = question;

                const winningAmount = parseFloat(answer == 'optionA' ? optionA : optionB) + parseFloat(price);

                // 3. Get all user predictions for this question
                const userPredictions = await UserPredictedQuestion.findAll({
                    where: {
                        matchId: matchId,
                        questionId: questionId,
                        winningCredited: { [Op.eq]: null }
                    }
                });

                // 4. Process each prediction
                for (const prediction of userPredictions) {
                    if (prediction.selectedOption === answer) {
                        // User predicted correctly
                        const user = await User.findByPk(prediction.userId);
                        if (!user) continue;

                        const currentWallet = parseFloat(user.wallet || 0);
                        const updatedWallet = currentWallet + winningAmount;

                        // Update user wallet
                        user.wallet = updatedWallet;
                        await user.save();

                        // Update prediction row
                        prediction.winningCredited = true;
                        await prediction.save();

                        await Transactions.create({
                            user_id: user.id,
                            notificationType: "WINNING",
                            title: `${question1}`,
                            message: `You Won - ${winningAmount}`,
                            isSeen: false,
                            image: "",
                        });

                        const notificationData = await Notification.findOne({ where: { type: "WIN" } })
                        const payload = {
                            notificationData: {
                                notificationType: notificationData.type ? notificationData.type : "WIN",
                                title: notificationData.title ? notificationData.title : "Congratulations",
                                message: notificationData.message ? notificationData.message : "You Won {AMOUNT}",
                                image: notificationData.image ? notificationData.image : ""
                            },
                            userId: prediction.userId
                        }
                        payload.notificationData.message = payload.notificationData.message
                        .replace(/{AMOUNT}/g, winningAmount)

                        sendNotification(payload)



                        console.log(`🎉 Credited user ${user.id} with ₹${winningAmount} for question ${questionId}`);
                    } else {
                        prediction.winningCredited = false;
                        await prediction.save();

                        console.log(`🎉 User have answred wrong.`);
                    }
                }

                // 5. Mark question as processed
                question.status = false;
                await question.save();

                console.log(`✅ Finished processing question ${questionId}`);
            }
        } catch (error) {
            console.error("❌ Error in Question Winner Payout Cron:", error);
        }
    });
}

function startMatchNotificationCron() {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const twoMinutesBefore = new Date(now.getTime() - 5 * 60 * 1000);
            // const twoMinutesAfter = new Date(now.getTime() + 2 * 60 * 1000);

            const upcomingMatches = await Matches.findAll({
                where: {
                    date: {
                        [Op.gte]: twoMinutesBefore,
                    },
                },
            });

            if (!upcomingMatches.length) return;
            for (const match of upcomingMatches) {
                let usersToNotify = [];

                // ✅ Handle both string and object cases
                try {
                    if (typeof match.notifyUser === "string") {
                        usersToNotify = JSON.parse(match.notifyUser || "[]");
                    } else if (Array.isArray(match.notifyUser)) {
                        usersToNotify = match.notifyUser;
                    } else {
                        console.warn("❌ Unexpected notifyUser format:", match.notifyUser);
                        continue;
                    }
                } catch (err) {
                    console.error("❌ Error parsing notifyUser JSON:", err);
                    continue;
                }

                if (!usersToNotify.length) continue;



                for (const userId of usersToNotify) {

                    const notificationData = await Notification.findOne({ where: { type: "MATCHREMIND" } })
                    const payload = {
                        notificationData: {
                            notificationType: notificationData.type ? notificationData.type : "MATCHREMIND",
                            title: notificationData.title ? notificationData.title : "{TEAMA} V/S {TEAMB}",
                            message: notificationData.message ? notificationData.message : "Match going to start.",
                            image: notificationData.image ? notificationData.image : ""
                        },
                        userId: userId
                    }
                    payload.notificationData.title = payload.notificationData.title
                        .replace(/{TEAMA}/g, match.teamAShortName)
                        .replace(/{TEAMB}/g, match.teamBShortName);

                    sendNotification(payload)

                }

                // ✅ Clear notifyUser safely
                match.notifyUser = "[]";
                await match.save();
            }
        } catch (error) {
            console.error("❌ Error in Match Notification Cron:", error);
        }
    });
}

function matchNotificationCron() {
    // Run every 30 seconds
    cron.schedule("*/30 * * * * *", async () => { // note the extra * for seconds
        try {
            const now = new Date();
            const thirtySecondsBefore = new Date(now.getTime() - 30 * 1000); // 30 sec before
            const thirtySecondsAfter = new Date(now.getTime() + 30 * 1000); // 30 sec after

            // Find matches that are starting now ±30 seconds
            const upcomingMatches = await Matches.findAll({
                where: {
                    date: {
                        [Op.between]: [thirtySecondsBefore, thirtySecondsAfter],
                    },
                },
            });

            if (!upcomingMatches.length) return;

            for (const match of upcomingMatches) {
                let usersToNotify = [];

                // ✅ Send notification to all users if match has started
                // Assuming you have a User table
                const allUsers = await User.findAll({ attributes: ["id"] });
                usersToNotify = allUsers.map(u => u.id);

                if (!usersToNotify.length) continue;

                for (const userId of usersToNotify) {
                    const notificationData = await Notification.findOne({ where: { type: "MATCHSTART" } })

                    const payload = {
                        notificationData: {
                            notificationType: notificationData.type ? notificationData.type : "MATCHSTART",
                            title: notificationData.title ? notificationData.title : "{TEAMA} V/S {TEAMB}",
                            message: notificationData.message ? notificationData.message : "Match has started.",
                            image: notificationData.image ? notificationData.image : ""
                        },
                        userId: prediction.userId
                    }
                    payload.notificationData.title = payload.notificationData.title
                        .replace(/{TEAMA}/g, match.teamAShortName)
                        .replace(/{TEAMB}/g, match.teamBShortName);

                    sendNotification(payload);
                }

                // Clear notifyUser safely (optional now since sending to all)
                match.notifyUser = "[]";
                await match.save();
            }
        } catch (error) {
            console.error("❌ Error in Match Notification Cron:", error);
        }
    });
}



module.exports = {
    startReferralRewardCron, startQuestionWinnerPayoutCron, startMatchNotificationCron, matchNotificationCron
};
