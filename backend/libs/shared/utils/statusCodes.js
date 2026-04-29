const OK = 200; // The request has succeeded
const CREATED = 201; // The request has been fulfilled and a new resource has been created
const BAD_REQUEST = 400; // The server could not understand the request due to invalid syntax
const UNAUTHORIZED = 401; // The client must authenticate itself to get the requested response
const FORBIDDEN = 403; // The client does not have access rights to the content, usually because of authentication failure
const NOT_FOUND = 404; // The server can't find the requested resource
const METHOD_NOT_ALLOWED = 405; // The request method is not supported for the requested resource
const TOO_MANY_REQUESTS = 429; // The user has sent too many requests in a given amount of time
const INTERNAL_SERVER_ERROR = 500; // The server encountered an unexpected condition that prevented it from fulfilling the request
const NOT_IMPLEMENTED = 501; // The server does not support the functionality required to fulfill the request
const SERVICE_UNAVAILABLE = 503; // The server is currently unable to handle the request due to temporary overloading or maintenance of the server

// Export the status codes

function getIpAddress(req) {
    let ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        req.ip ||
        "UNKNOWN";

    // Convert IPv4-mapped IPv6 to plain IPv4
    if (ip.startsWith("::ffff:")) {
        ip = ip.replace("::ffff:", "");
    }
    return ip;
}
async function addAdminLogAction(adminId, title, description, ipAddress) {
    // Lazy load AdminLogAction only when needed (after Sequelize is initialized)
    const AdminLogAction = require("@models/admin-log-action");
    // if (adminId !== 1) {
    await AdminLogAction.create({ adminId, title, description, ipAddress });
    // }

    return "log saved!";
}
module.exports = {
    OK,
    CREATED,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND,
    METHOD_NOT_ALLOWED,
    TOO_MANY_REQUESTS,
    INTERNAL_SERVER_ERROR,
    NOT_IMPLEMENTED,
    SERVICE_UNAVAILABLE,
    getIpAddress,
    addAdminLogAction
};

