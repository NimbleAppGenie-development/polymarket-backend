const { METHOD_NOT_ALLOWED } = require('@utils/statusCodes')
const { errorResponse, simpleResponse } = require('@utils/response');

function methodNotAllowed(req, res, next) {
    res.status(METHOD_NOT_ALLOWED).json({status:false , message: "Method not allowed"});
    // throw new MethodNotAllowed(simpleResponse(false, "Method Not Allowed"));
}
  
module.exports = methodNotAllowed;
