const { Op } = require("sequelize");
const sequelize = require("@models/index");
const User = require("@models/user");
const Admin = require("@models/adminModel");
const UserPredictedQuestion = require("@models/userpredictedquestions");
const Transaction = require("@models/transaction");

async function declareWinners({ questionId, answerId }) {
    const t = await sequelize.transaction();

    try {
        // WIN
        await UserPredictedQuestion.update(
            { winningStatus: "WIN" },
            {
                where: { questionId, selectedOptionId: answerId },
                transaction: t,
            },
        );

        // LOSS
        await UserPredictedQuestion.update(
            { winningStatus: "LOSS" },
            {
                where: {
                    questionId,
                    selectedOptionId: { [Op.ne]: answerId },
                },
                transaction: t,
            },
        );

        // Get winners
        const winners = await UserPredictedQuestion.findAll({
            where: { questionId, selectedOptionId: answerId },
            transaction: t,
        });

        const admin = await Admin.findOne({ transaction: t });

        if (!admin) throw new Error("Admin not found");

        if (!admin.walletBalance) {
            admin.walletBalance = 0;
            await admin.save({ transaction: t });
        }

        let totalPayout = 0;

        // winners
        for (const bet of winners) {
            const winningAmount = Number(bet.entryAmount) * Number(bet.multiplier || 1);

            totalPayout += winningAmount;

            await bet.update({ winningCredited: winningAmount }, { transaction: t });

            await User.increment("walletBalance", {
                by: winningAmount,
                where: { id: bet.userId },
                transaction: t,
            });

            await Transaction.create({
                userId : bet.userId,
                amount: winningAmount,
                type: "WINNING",
                status: "SUCCESS",
                response: JSON.stringify({ userId: bet.userId }),

            });
        }

        // Deduct admin balance
        await admin.decrement("walletBalance", {
            by: totalPayout,
            transaction: t,
        });

        await t.commit();

        return "Winner declared & payouts processed";
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = declareWinners;
