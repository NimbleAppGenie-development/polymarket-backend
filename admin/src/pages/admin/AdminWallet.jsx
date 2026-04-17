import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import Service from "../../services/Http.js";

const AdminWallet = () => {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);

    
    const fetchWalletBalance = async () => {
        try {
            const services = new Service();

            const response = await services.get("/admin/getWalletBalance", {}, true);

            if (response?.status) {
                setWalletBalance(response?.data?.walletBalance || 0);
            } else {
                errorToastr(response?.message || "Failed to fetch wallet balance");
            }
        } catch (error) {
            errorToastr(error?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchWalletBalance();
    }, []);

    // Add money to wallet
    const handleAddMoney = async (e) => {
        e.preventDefault();

        if (!amount || Number(amount) <= 0) {
            return errorToastr("Valid amount required");
        }

        try {
            setLoading(true);

            const services = new Service();

            const payload = {
                amount: Number(amount),
            };

            const response = await services.post("/admin/addMoney", payload, true);

            if (response?.status) {
                successToastr("Money added successfully");
                setAmount("");
                fetchWalletBalance(); // refresh balance
            } else {
                errorToastr(response?.message || "Failed to add money");
            }
        } catch (error) {
            errorToastr(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout title="Admin Wallet">
            <div className="row">
                <div className="col-md-8 mx-auto">

                    {/* TOTAL BALANCE CARD */}
                    <div className="card card-round mb-3">
                        <div className="card-body text-center">
                            <h5>Total Wallet Balance</h5>
                            <h2 className="text-success">
                                ₹ {walletBalance}
                            </h2>
                        </div>
                    </div>

                    {/* ADD MONEY CARD */}
                    <div className="card card-round">
                        <div className="card-header">
                            <h4 className="text-center mb-0">
                                <b>Add Money to Wallet</b>
                            </h4>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleAddMoney}>

                                <div className="mb-3">
                                    <label className="form-label">Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter amount"
                                        min="1"
                                        max={99999}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Add Money"}
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AdminWallet;
