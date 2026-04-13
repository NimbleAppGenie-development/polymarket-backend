// const statusCodes = require("@utils/statusCodes");
// // const initializeUserModel = require("@models/user");
// const crypto = require("crypto");
// const User = require("@models/user");
// const UserList = async (req, res, next) => {
//     try {
//         const {
//             currentPage,
//             pageSize,
//             sortField,
//             sortOrder,
//             searchName,
//             searchDateRange,
//         } = req.body;

//         const query = {
//             isEmailVerified: true,
//             isDeleteAccount: false, 
//         };
//         // Add search by name (firstName, lastName, or email)
//         if (searchName) {
//             query[Sequelize.Op.or] = [
//                 { firstName: { [Sequelize.Op.like]: `%${searchName}%` } },
//                 { lastName: { [Sequelize.Op.like]: `%${searchName}%` } },
//                 { email: { [Sequelize.Op.like]: `%${searchName}%` } },
//             ];
//         }

//         if (searchDateRange) {
//             const [startDate, endDate] = searchDateRange.split(" - ");
//             const start = new Date(startDate);
//             const end = new Date(endDate);
//             end.setHours(23, 59, 59, 999);

//             query.createdAt = {
//                 [Sequelize.Op.gte]: start,
//                 [Sequelize.Op.lte]: end,
//             };
//         }


//         // const User = await initializeUserModel();
//         const totalUsers = await User.count({ where: query });


//         const users = await User.findAll({
//             where: query,
//             order: [[sortField, sortOrder]],
//             offset: (currentPage - 1) * pageSize,
//             limit: parseInt(pageSize),
//             attributes: { 
//                 exclude: ["accessToken", "password", "emailOTP" ,  "refreshToken", "tokenVersion"] 
//             },
//         });



//         if (!users || users.length === 0) {
//             return res.status(statusCodes.OK).json({
//                 status: false,
//                 message: "User not found",
//                 result: {
//                     rows: [],
//                     count: 0,
//                 },
//             });
//         }

//         // Format user data
//         const formatted = users.map((item) => ({
//             // id: item._id || "NA",
//             id: item.id || "NA",
//             userName: item.userName && item.userName.trim() !== "" ? item.userName : "NA",
//             fullName: (item.firstName && item.firstName.trim() !== "" ? item.firstName : "") +
//                 (item.lastName && item.lastName.trim() !== "" ? " " + item.lastName : ""),
//             profilePicture: item.profilePhoto && item.profilePhoto.trim() !== "" ? item.profilePhoto : "NA",
//             email: item.email && item.email.trim() !== "" ? item.email : "NA",
//             isActive: item.isActive !== undefined && item.isActive !== null ? item.isActive : "NA",
//             createdAt: item.createdAt ? item.createdAt : "NA",
//         }));

//         // Ensure fullName is "NA" if both firstName and lastName are empty
//         formatted.forEach(user => {
//             if (user.fullName.trim() === "") {
//                 user.fullName = "NA";
//             }
//         });


//         return res.status(statusCodes.OK).json({
//             status: true,
//             message: "Users successfully fetched",
//             result: {
//                 rows: formatted,
//                 count: totalUsers,
//             },
//         });
//     } catch (error) {
//         console.error("UserList error:", error);
//         res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message:
//                 "We're sorry, but there was a problem processing your request.",
//         });
//     }
// };
// const getUserById = async (req, res, next) => {
//     try {
//         // const userId = req.params.userId;

//         const { userId } = req.query;
//         const User = await initializeUserModel();

//         const user = await User.findByPk(userId, {
//             attributes: { exclude: ["accessToken", "password"] }
//         });

//         if (!user) {
//             return res.status(statusCodes.BAD_REQUEST).json({
//                 status: false,
//                 message: "User not found",
//             });
//         }

//         const formattedUser = {
//             _id: user._id,
//             userName: user.userName,
//             fullName: `${user.firstName} ${user.lastName}`.trim(),
//             profilePicture: user.profilePhoto,
            

//             email: user.email,
//             isActive: user.isActive,
//             isSubscribed: user.isSubscribed,
//             level: user.level
//         };



//         return res.status(statusCodes.OK).json({
//             status: true,
//             message: "User successfully fetched",
//             result: formattedUser,
//         });
//     } catch (error) {
//         console.error("getUserById error:", error);
//         res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//             status: false,
//             message:
//                 "We're sorry, but there was a problem processing your request.",
//         });
//     }
// };
// const updateUserById = async (req, res, next) => {
//     const { id, status } = req.body;

//     try {
//         const User = await initializeUserModel();
//         let user = await User.findByPk(id);

//         if (!user) {
//             return res
//                 .status(404)
//                 .json({ status: false, message: "User not found" });
//         }

//         switch (status) {
//             case "active":
//                 await user.update({ isActive: true });
//                 break;
//             case "inactive":
//                 await user.update({ isActive: false });
//                 break;
//             case "deleteStatus":
//                 await user.destroy();
//                 return res.json({
//                     status: true,
//                     message: "User deleted successfully",
//                 });
//             default:
//                 return res
//                     .status(400)
//                     .json({ status: false, message: "Invalid status" });
//         }

//         await user.save();
//         res.json({
//             status: true,
//             message: `User ${status === "active" ? "activated" : "deactivated"
//                 } successfully`,
//         });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         res.status(500).json({ status: false, message: "Server error" });
//     }
// };
// const changeUserPassword = async (req, res) => {
//     const { password, confirmPassword, userId } = req.body;

//     try {
//         if (!password || !confirmPassword) {
//             return res.status(statusCodes.BAD_REQUEST).json({ status: false, message: 'Password and confirm password are required' });
//         }

//         if (password !== confirmPassword) {
//             return res.status(statusCodes.BAD_REQUEST).json({ status: false, message: 'Passwords do not match' });
//         }

//         const User = await initializeUserModel();
//         const user = await User.findByPk(userId);

//         if (!user) {
//             return res.status(statusCodes.NOT_FOUND).json({ 
//                 status: false, 
//                 message: 'User not found' 
//             });
//         }



//         // Save the updated user details
//         await user.save();

//         await user.update({
//             password: password, // Will be hashed by beforeSave hook
//             tokenVersion: crypto.randomBytes(16).toString("hex"),
//             accessToken: '',
//             refreshToken: '',
//             deviceToken: ''
//         });







//         return res.status(statusCodes.OK).json({ status: true, message: 'Password updated successfully' });
//     } catch (err) {
//         res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ status: false, message: 'Internal server error' });
//     }
// };
// module.exports = {
//     UserList,
//     getUserById,
//     updateUserById,
//     changeUserPassword,

// };
