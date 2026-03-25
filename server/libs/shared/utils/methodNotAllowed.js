const { MethodNotAllowed } = require('@utils/statusCodes')
const { errorResponse, simpleResponse } = require('@utils/response');

function methodNotAllowed(req, res, next) {
    // res.status(MethodNotAllowed.statusCode).json({status:false , message: MethodNotAllowed.message});
    throw new MethodNotAllowed(simpleResponse(false, "Method Not Allowed"));
}
  
module.exports = methodNotAllowed;
