import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { dateFormatter } from "../../utils/helper.js";
import Paginator from "../../components/Paginator.jsx";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import Swal from "sweetalert2";
import Service from "../../services/Http.js";

export default function Withdraw() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [lastItem, setLastItem] = useState(0);
    const [firstItem, setFirstItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    const services = new Service();

    const fetchTransactions = async () => {
        try {
            setTableLoading(true);

            const response = await services.get("/admin/walletTransactions", { page, limit, search }, true);

            if (response?.status) {
                setTransactions(response?.data || []);
                setTotal(response?.total || 0);

                const first = (page - 1) * limit + 1;
                const last = Math.min(page * limit, response?.total || 0);
                setFirstItem(response?.total ? first : 0);
                setLastItem(last);
            } else {
                errorToastr(response?.message || "Failed to fetch transactions");
            }
        } catch (error) {
            errorToastr(error?.message || "Something went wrong");
        } finally {
            setTableLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [page, limit, search]);

    const updateStatus = async (id, status) => {
        try {
            const payload = { transactionId: id, status };
            const response = await services.post("/admin/updateTransactionStatus", payload, true);

            if (response?.status) {
                successToastr(`Transaction ${status}`);
                fetchTransactions();
            } else {
                errorToastr(response?.message || "Failed to update status");
            }
        } catch (error) {
            errorToastr(error?.message || "Something went wrong");
        }
    };

    const handlePageChange = (updatedPage) => setPage(updatedPage);

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value));
        setPage(1);
    };

    const handleSearch = () => {
        setSearch(searchInput);
        setPage(1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const resetValues = () => {
        setLimit(10);
        setPage(1);
        setSearch("");
        setSearchInput("");
    };

    return (
        <AuthenticatedLayout title="Withdraw" loading={loading}>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row align-items-center g-2 mb-3">
                        <div className="col-md-1">
                            <select name="paginate" className="form-control" value={limit} onChange={handleLimitChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                name="search"
                                value={searchInput}
                                // onChange={(e) => setSearchInput(e.target.value)}
                                onChange={(e) => {
                                    setSearchInput(e.target.value);
                                    setSearch(e.target.value); 
                                    setPage(1);
                                }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search by user name"
                            />
                        </div>

                        <div className="col-md-3 d-flex gap-2">
                            {/* <button className="btn btn-primary w-100" onClick={handleSearch}>
                                Search
                            </button> */}
                            <button className="btn btn-warning w-70" onClick={resetValues}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card table-responsive">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Username</th>
                                <th>Transaction ID</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableLoading ? (
                                <tr>
                                    <td colSpan="7">Loading...</td>
                                </tr>
                            ) : transactions.length > 0 ? (
                                transactions.map((tx, index) => (
                                    <tr key={tx.id}>
                                        <td>{(page - 1) * limit + index + 1}</td>
                                        <td>{tx.user?.name || "N/A"}</td>
                                        <td>{tx.transactionId || "N/A"}</td>
                                        <td>$ {tx.amount}</td>
                                        <td>
                                            {tx.status === "PENDING" && <span className="badge bg-warning">PENDING</span>}
                                            {tx.status === "APPROVED" && <span className="badge bg-success">APPROVED</span>}
                                            {tx.status === "REJECTED" && <span className="badge bg-danger">REJECTED</span>}
                                        </td>
                                        <td>{dateFormatter(tx.createdAt, "perfectDateTime")}</td>
                                        <td>
                                            {tx.status === "PENDING" ? (
                                                <>
                                                    <button className="btn btn-sm btn-success me-2" onClick={() => updateStatus(tx.id, "APPROVED")}>
                                                        Approve
                                                    </button>
                                                    <button className="btn btn-sm btn-danger" onClick={() => updateStatus(tx.id, "REJECTED")}>
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-muted"></span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No transactions found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-footer">
                    <Paginator
                        page={page}
                        pageChangeHandler={handlePageChange}
                        limit={limit}
                        total={total}
                        firstItem={firstItem}
                        lastItem={lastItem}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
