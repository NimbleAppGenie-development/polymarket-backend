import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import Service from "../../services/Http.js";
import { dateFormatter } from "../../utils/helper";

const Withdraw = () => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    const [transactions, setTransactions] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);

    const services = new Service();

    const fetchTransactions = async () => {
        try {
            setTableLoading(true);

            const response = await services.get("/admin/walletTransactions", {}, true);
            
            if (response?.status) {
                setTransactions(response?.data || []);
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
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const payload = {
                transactionId: id,
                status,
            };

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

    return (
        <AuthenticatedLayout title="Withdraw">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round mt-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <b>Wallet Transactions</b>
                            </h4>

                            <a href="/withdraw-amount" className="btn btn-warning">
                                Withdraw
                            </a>
                        </div>

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-bordered text-center align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>User</th>
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
                                                <td colSpan="4">Loading...</td>
                                            </tr>
                                        ) : transactions.length > 0 ? (
                                            transactions.map((tx) => (
                                                <tr key={tx.id}>
                                                    <td>{tx.user.name || "N/A"}</td>
                                                    <td>{tx.transactionId || "N/A"}</td>
                                                    <td>$ {tx.amount}</td>

                                                    <td>
                                                        {tx.status === "PENDING" && <span className="badge bg-warning">PENDING</span>}
                                                        {tx.status === "APPROVED" && <span className="badge bg-success">APPROVED</span>}
                                                        {tx.status === "REJECTED" && <span className="badge bg-danger">REJECTED</span>}
                                                    </td>
                                                    {/* <td>{tx.createdAt}</td> */}
                                                    <td>{dateFormatter(tx.createdAt, "perfectDateTime")}</td>

                                                    <td>
                                                        {tx.status === "PENDING" ? (
                                                            <>
                                                                <button
                                                                    className="btn btn-sm btn-success me-2"
                                                                    onClick={() => updateStatus(tx.id, "APPROVED")}
                                                                >
                                                                    Approve
                                                                </button>

                                                                <button
                                                                    className="btn btn-sm btn-danger"
                                                                    onClick={() => updateStatus(tx.id, "REJECTED")}
                                                                >
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
                                                <td colSpan="4">No transactions found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Withdraw;
