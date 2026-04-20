import Pagination from "react-js-pagination";

export default function Paginator({ limit, page, total, firstItem, lastItem, valueName = null, pageChangeHandler }) {
    return (
        <div className="d-flex justify-content-between">
            {`Showing from ${firstItem} to ${lastItem} of ${total} ${valueName ?? "results"}`}

            <Pagination
                activePage={page}
                totalItemsCount={total}
                pageRangeDisplayed={5}
                innerClass="pagination"
                activeClass="active"
                itemsCountPerPage={limit}
                onChange={(page) => pageChangeHandler(page)}
                itemClass="page-item"
                linkClass="page-link"
            />
        </div>
    );
}
