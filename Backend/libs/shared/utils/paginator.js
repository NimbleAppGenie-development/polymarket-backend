module.exports = ({ page, limit, totalRecords = 0 }) => {
    let result = {
        offset: 1,
        defaultLimit: 10,
        defaultPage: parseInt(page ?? 1),
    };

    if (typeof limit == "undefined") {
        limit = 10;
        result.offset = 1;
        result.finalLimit = 10;
    }

    if (typeof result.page == "undefined") {
        result.defaultPage = parseInt(page ?? '1');
        result.offset = 1;
        result.finalLimit = 10;
    }

    result.offset = (result.defaultPage - 1) * limit;
    result.finalLimit = parseInt(limit);
    result.totalPages = Math.ceil(totalRecords / limit);

    return result;
};
