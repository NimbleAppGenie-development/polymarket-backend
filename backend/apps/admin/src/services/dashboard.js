// const User = require("../../../models/userModel");
// const PromoCode = require("../../../models/promoCodeModel");
// const SubscribedSubscription = require("../../../models/SubscribedSubscription");
// const CityResort = require("../../../models/cityResortModel");
// const statusCodes = require("../utils/statusCodes");
// const moment = require('moment');

// const getUserStatistics = async (req, res, next) => {
//   try {
//     const { option } = req.params;

//     // Validate the option parameter
//     if (!["0", "1", "2", "3"].includes(option)) {
//       return res.status(statusCodes.BAD_REQUEST).json({
//         status: false,
//         message: "Invalid option parameter.",
//       });
//     }

//     // Determine the start date based on the option
//     let startDate;
//     switch (option) {
//       case "0": // Last 7 Days
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 7);
//         break;
//       case "1": // Last 14 Days
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 14);
//         break;
//       case "2": // Last 12 Months
//         startDate = new Date();
//         startDate.setMonth(startDate.getMonth() - 12);
//         break;
//       case "3": // Last 7 Years
//         startDate = new Date();
//         startDate.setFullYear(startDate.getFullYear() - 7);
//         break;
//       default:
//         throw new Error("Invalid option parameter");
//     }

//     // Query users based on the start date
//     const users = await User.find({ createdAt: { $gte: startDate } });

//     // Calculate statistics
//     const userStatistics = [
//       { name: option, value: users.length }
//     ];

//     res.status(statusCodes.OK).json({
//       status: true,
//       message: 'User statistics fetched successfully',
//       result: { userStatistics }
//     });
//   } catch (error) {
//     console.error("Error fetching user statistics:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "Failed to fetch user statistics.",
//       error: error.message
//     });
//   }
// };
// const getCategoryStatistics = async (req, res, next) => {
//   try {
//     const { option } = req.params;

//     // Validate the option parameter
//     if (!["0", "1", "2", "3"].includes(option)) {
//       return res.status(statusCodes.BAD_REQUEST).json({
//         status: false,
//         message: "Invalid option parameter.",
//       });
//     }

//     // Determine the start date based on the option
//     let startDate;
//     switch (option) {
//       case "0": // Last 7 Days
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 7);
//         break;
//       case "1": // Last 14 Days
//         startDate = new Date();
//         startDate.setDate(startDate.getDate() - 14);
//         break;
//       case "2": // Last 12 Months
//         startDate = new Date();
//         startDate.setMonth(startDate.getMonth() - 12);
//         break;
//       case "3": // Last 7 Years
//         startDate = new Date();
//         startDate.setFullYear(startDate.getFullYear() - 7);
//         break;
//       default:
//         throw new Error("Invalid option parameter");
//     }

//     // Query categories based on the start date
//     const categories = await Category.find({ createdAt: { $gte: startDate } });

//     // Calculate statistics
//     const categoryStatistics = [
//       { name: option, value: categories.length }
//     ];

//     res.status(statusCodes.OK).json({
//       status: true,
//       message: 'Category statistics fetched successfully',
//       result: { categoryStatistics }
//     });
//   } catch (error) {
//     console.error("Error fetching category statistics:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "Failed to fetch category statistics.",
//       error: error.message
//     });
//   }
// };
// const getUserSummary = async (req, res, next) => {
//   try {
//     const totalUsers = await User.countDocuments();

//     res.status(statusCodes.OK).json({
//       status: true,
//       message: 'User count fetched successfully',
//       result: { totalUsers }
//     });
//   } catch (error) {
//     console.error("Error fetching user summary:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "Failed to fetch user summary.",
//       error: error.message
//     });
//   }
// };
// const getPromoCodeSummary = async (req, res, next) => {
//   try {
//     const totalPromoCode = await PromoCode.countDocuments();

//     res.status(statusCodes.OK).json({
//       status: true,
//       message: 'Promo Code count fetched successfully',
//       result: { totalPromoCode }
//     });
//   } catch (error) {
//     console.error("Error fetching Promo Code summary:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "Failed to fetch Promo Code summary.",
//       error: error.message
//     });
//   }
// };
// const getSubscribedSubscriptionSummary = async (req, res, next) => {
//   try {
//     const totalSubscribedSubscription = await SubscribedSubscription.countDocuments();

//     res.status(statusCodes.OK).json({
//       status: true,
//       message: 'Subscribed Subscription count fetched successfully',
//       result: { totalSubscribedSubscription }
//     });
//   } catch (error) {
//     console.error("Error fetching Subscribed Subscription summary:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "Failed to fetch Subscribed Subscription summary.",
//       error: error.message
//     });
//   }
// };
// const getcityResortSummary = async (req, res, next) => {
//   try {
//     const totalCityResort = await CityResort.countDocuments();

//     res.status(statusCodes.OK).json({
//       status: true,
//       message: 'Mountains count fetched successfully',
//       result: { totalCityResort }
//     });
//   } catch (error) {
//     console.error("Error fetching Mountains summary:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "Failed to fetch Mountains summary.",
//       error: error.message
//     });
//   }
// };
// module.exports = {
//   getUserStatistics,
//   getCategoryStatistics,
//   getUserSummary,
//   getPromoCodeSummary,
//   getSubscribedSubscriptionSummary,
//   getcityResortSummary
// };
