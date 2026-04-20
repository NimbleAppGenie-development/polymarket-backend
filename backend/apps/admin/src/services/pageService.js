// const PageModel = require("../../../models/pageUrlsModel");
// const statusCodes = require("../utils/statusCodes");
// const moment = require("moment");
// const createPage = async (req, res) => {
//   const { title, description } = req.body;

//   const requiredFields = ['title', 'description'];
//   for (const field of requiredFields) {
//     if (req.body[field] === undefined || req.body[field] === null || !req.body[field]) {
//       return res.status(statusCodes.BAD_REQUEST).json({
//         status: false,
//         message: `${field} is required`,
//       });
//     }
//   }

//   try {
//     // Create a new page
//     const createPage = await PageModel.create({ title, description });
//     return res.status(statusCodes.CREATED).json({
//       status: true,
//       message: "Page content successfully created",
//       result: createPage,
//     });
//   } catch (error) {
//     console.error("createPage error:", error);
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "We're sorry, but there was a problem processing your request.",
//     });
//   }
// };

// const getPage = async (req, res) => {
//   try {

//     const { currentPage, pageSize, sortField, sortOrder, searchName, searchDateRange } = req.body;

//     // Parse parameters with defaults
//     const parsedPage = parseInt(currentPage) || 1;
//     const parsedLimit = parseInt(pageSize) || 3;
//     const parsedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'; // Default sort order is ASC

//     const offset = (parsedPage - 1) * parsedLimit;

//     let query = {};


//     if (searchName) {
//       query.$or = [
//         { title: { $regex: new RegExp(searchName, 'i') } },
//         { description: { $regex: new RegExp(searchName, 'i') } }
//       ];
//     }


//     if (searchDateRange) {
//       const [startDateStr, endDateStr] = searchDateRange
//         .split(" - ")
//         .map((str) => str.trim());
//       const startDate = moment(startDateStr, "ddd MMM DD YYYY")
//         .startOf("day")
//         .toDate();
//       const endDate = moment(endDateStr, "ddd MMM DD YYYY")
//         .endOf("day")
//         .toDate();
//       query.createdAt = {
//         $gte: startDate,
//         $lte: endDate,
//       };
//     }

//     const data = await PageModel.find(query)
//       .skip(offset)
//       .limit(parsedLimit)
//       .sort({ [sortField]: parsedSortOrder });

//     const totalCount = await PageModel.countDocuments(query);

//     if (!data) {
//       return res.status(statusCodes.BAD_REQUEST).json({
//         status: false,
//         message: "No Page found",

//       });
//     }
//     const formatted = data.map(item => ({
//       id: item._id,
//       description: item.description,
//       title: item.title,
//       createdAt: item.createdAt

//     }))



//     return res
//       .status(statusCodes.OK)
//       .json({
//         status: true,
//         message: "Page content fetched",
//         result: {
//           rows: formatted,
//           count: totalCount,
//           totalPage: Math.ceil(totalCount / parsedLimit)
//         }
//       });
//   } catch (error) {
//     console.error("getPage error:", error);
//     res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "We're sorry, but there was a problem processing your request.",

//     });
//   }
// };

// const getPageForEdit = async (req, res) => {
//   const id = req.params.id;
//   // const slug = req.params.slug;
//   const pageId = id

//   try {
//     // Find the page by ID
//     const page = await PageModel.findById(pageId).select("-updatedAt -__v -createdAt");

//     if (!page) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         status: false,
//         message: "Page not found",
//       });
//     }

//     const formatted = {
//       id: page._id,
//       description: page.description,
//       title: page.title,
//     };

//     return res.status(statusCodes.OK).json({
//       status: true,
//       message: "Page content fetched",
//       result: formatted,
//     });
//   } catch (error) {
//     console.error("getPageById error:", error);
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "We're sorry, but there was a problem processing your request.",
//     });
//   }
// };



// const updatePageById = async (req, res) => {
//   const { description, id } = req.body;
//   const pageId = id;

//   // Validate required fields if necessary (you might want to allow partial updates)
//   if (!description) {
//     return res.status(statusCodes.BAD_REQUEST).json({
//       status: false,
//       message: "descriptionis required",
//     });
//   }

//   try {
//     // Find the page by ID and update it
//     const updatedPage = await PageModel.findById(pageId);

//     if (!updatedPage) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         status: false,
//         message: "Page not found",
//       });
//     }

//     updatedPage.description = description || updatedPage.description;

//     await updatedPage.save();

//     return res.status(statusCodes.OK).json({
//       status: true,
//       message: "Page content successfully updated",
//       result: updatedPage,
//     });
//   } catch (error) {
//     console.error("updatePage error:", error);
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "We're sorry, but there was a problem processing your request.",
//     });
//   }
// };





// const getPageById = async (req, res) => {
//   const { pageId } = req.query
//   // const slug = req.params.slug;

//   try {
//     // Find the page by ID
//     const page = await PageModel.findById(pageId).select("-updatedAt -__v -createdAt");

//     if (!page) {
//       return res.status(statusCodes.NOT_FOUND).json({
//         status: false,
//         message: "Page not found",
//       });
//     }

//     const formatted = {
//       id: page._id,
//       description: page.description,
//       title: page.title,
//     };

//     return res.status(statusCodes.OK).json({
//       status: true,
//       message: "Page content fetched",
//       result: formatted,
//     });
//   } catch (error) {
//     console.error("getPageById error:", error);
//     return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({
//       status: false,
//       message: "We're sorry, but there was a problem processing your request.",
//     });
//   }
// };

// module.exports = {
//   createPage,
//   getPage,
//   updatePageById,
//   getPageForEdit,
//   getPageById
// };
