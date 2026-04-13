module.exports = {
    successResponse: (data, message = "success") => {
        return {
            status: true,
            data: data,
            message: message,
        };
    },
    errorResponse: (data, message = "success") => {
        return {
            status: false,
            data: data,
            message: message,
        };
    },
    simpleResponse: (status, message = "success") => {
        return {
            status: status,
            message: message,
        };
    },
};
