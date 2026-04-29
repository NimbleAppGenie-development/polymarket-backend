import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { useState } from "react";
import Service from "../../services/Http.js";
import { successToastr, errorToastr } from "../../utils/toastr.js";
import { useNavigate } from "react-router-dom";

const SetWithdrawLimit = () => {
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const services = new Service();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!minAmount || !maxAmount) {
            errorToastr("Both fields are required");
            return;
        }

        if (Number(minAmount) <= 0 || Number(maxAmount) <= 0) {
            errorToastr("Amounts must be greater than 0");
            return;
        }

        if (Number(minAmount) > Number(maxAmount)) {
            errorToastr("Min amount cannot be greater than max amount");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                minWithdrawAmount: minAmount,
                maxWithdrawAmount: maxAmount,
            };

            const response = await services.post("/admin/setWithdrawLimit", payload, true);

            if (response?.status) {
                successToastr("Withdraw limits updated successfully");
                navigate("/withdraw");
            } else {
                errorToastr(response?.message || "Failed to save");
            }
        } catch (error) {
            errorToastr(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout title="Withdraw Limits">
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <div className="card mt-4">
                        <div className="card-header text-center">
                            <h4>
                                <b>Set Withdraw Limits</b>
                            </h4>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                {/* Min Amount */}
                                <div className="mb-3">
                                    <label className="form-label">Minimum Withdrawal Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={minAmount}
                                        onChange={(e) => setMinAmount(e.target.value)}
                                        placeholder="Enter minimum amount"
                                        min="1"
                                        max={99999}
                                        required
                                    />
                                </div>

                                {/* Max Amount */}
                                <div className="mb-3">
                                    <label className="form-label">Maximum Withdrawal Amount</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={maxAmount}
                                        onChange={(e) => setMaxAmount(e.target.value)}
                                        placeholder="Enter maximum amount"
                                        min="1"
                                        max={99999}
                                        required
                                    />
                                </div>

                                <div className="d-flex justify-content-end gap-2">
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/withdraw")}>
                                        Cancel
                                    </button>

                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default SetWithdrawLimit;
