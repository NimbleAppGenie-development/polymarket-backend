import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";
import { success } from "toastr";
import { errorToastr } from "../utils/toastr.js";

const Account = () => {
    const { user } = useContext(AuthContext);
    const [availableWallet, setAvailableWallet] = useState(0);
    const [winningWallet, setWinningWallet] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [data, setData] = useState("");
    const [actionType, setActionType] = useState("DEPOSIT"); // "DEPOSIT" | "WITHDRAW" | ""

    const getAccountDetails = async () => {
        try {
            setLoading(true);
            const services = new Service();
            const response = await services.get(`/user/user-account-details/${user.id}`, {}, true);
            if (response?.status) {
                setData(response?.data || {});
                setAvailableWallet(response?.data?.availableBalance || 0);
                setWinningWallet(response?.data?.winningBalance || 0);
            }
        } catch (error) {
            console.error("ACCOUNT ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            getAccountDetails();
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || Number(amount) <= 0) return;

        try {
            const services = new Service();

            if (actionType === "DEPOSIT") {
                const response = await services.post("/user/add-money", { userId: user.id, amount, type: "MAIN" }, true);
                if (response?.status) {
                    success("Amount deposited successfully in Available Balance");
                    setAmount("");
                    setActionType("");
                    getAccountDetails();
                }
            } else if (actionType === "WITHDRAW") {
                const response = await services.post("/user/withdraw-money", { userId: user.id, amount, type: "WINNING" }, true);
                if (response?.status) {
                    success("Amount withdrawn successfully from Winning Balance");
                    setAmount("");
                    setActionType("");
                    getAccountDetails();
                }
            }
        } catch (error) {
            console.error(error);
            errorToastr(error?.message || "Failed to withdraw amount");

        }
    };

    const handleAddMoney = async (e) => {
        e.preventDefault();
        try {
            const services = new Service();
            const response = await services.post("/user/add-money", { userId: user.id, amount, type: "MAIN" }, true);
            if (response?.status) {
                success("Money added successfully");
                setAmount("");
                getAccountDetails();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="home-page">
            <Header />

            <section className="banner-section-content">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8">
                            <div className="trending-main-parent">
                                <h2>
                                    My Account <img src="img/rightarrow.svg" alt="icon" />
                                </h2>

                                {/* User Details */}
                                <div className="politics-main-box">
                                    <div className="politics-header-box">
                                        <h4>USER DETAILS</h4>
                                    </div>
                                    <div className="account-info-box">
                                        <p>
                                            <strong>Name:</strong> {user?.name}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {user?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Wallet */}
                                <div className="politics-main-box mt-4">
                                    <div className="politics-header-box d-flex justify-content-between align-items-center">
                                        <h4 className="m-0">WALLET</h4>

                                        <div className="d-flex gap-2">
                                            <button
                                                className={`btn btn-warning ${actionType === "WITHDRAW" ? "active" : ""}`}
                                                onClick={() => {
                                                    setAmount("");
                                                    setActionType(actionType === "WITHDRAW" ? "" : "WITHDRAW");
                                                }}
                                            >
                                                Withdraw
                                            </button>

                                            <button
                                                className={`btn btn-success ${actionType === "DEPOSIT" ? "active" : ""}`}
                                                onClick={() => {
                                                    setAmount("");
                                                    setActionType(actionType === "DEPOSIT" ? "" : "DEPOSIT");
                                                }}
                                            >
                                                Deposit
                                            </button>
                                        </div>
                                    </div>

                                    <div className="wallet-row">
                                        <div className="wallet-box">
                                            <p>Available Balance</p>
                                            <h3>$ {availableWallet}</h3>
                                        </div>
                                        <div className="wallet-box">
                                            <p>Winning Balance</p>
                                            <h3>$ {winningWallet}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4">
                            <div className="trending-main-parent">
                                {/* Deposit Form */}
                                {actionType === "DEPOSIT" && (
                                    <>
                                        <h2>
                                            Deposit Money <img src="img/rightarrow.svg" alt="icon" />
                                        </h2>
                                        <div className="politics-main-box">
                                            <p className="text-muted" style={{ fontSize: "13px" }}>
                                                Amount will be added to your <strong>Available Balance</strong>
                                            </p>
                                            <form className="account-form" onSubmit={handleSubmit}>
                                                <label>Enter Amount *</label>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="Enter amount"
                                                    min="0"
                                                    max="99999999"
                                                    onKeyDown={(e) => {
                                                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required
                                                    autoFocus
                                                />
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => {
                                                            setActionType("");
                                                            setAmount("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-success" disabled={!amount || Number(amount) <= 0}>
                                                        Deposit
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </>
                                )}

                                {/* Withdraw Form */}
                                {actionType === "WITHDRAW" && (
                                    <>
                                        <h2>
                                            Withdraw Money <img src="img/rightarrow.svg" alt="icon" />
                                        </h2>
                                        <div className="politics-main-box">
                                            <p className="text-muted" style={{ fontSize: "13px" }}>
                                                Amount will be deducted from your <strong>Winning Balance</strong>
                                            </p>
                                            <form className="account-form" onSubmit={handleSubmit}>
                                                <label>Enter Amount *</label>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="Enter amount"
                                                    min="0"
                                                    max="99999999"
                                                    onKeyDown={(e) => {
                                                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    required
                                                    autoFocus
                                                />
                                                <div className="d-flex gap-2 mt-3">
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={() => {
                                                            setActionType("");
                                                            setAmount("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button type="submit" className="btn btn-warning" disabled={!amount || Number(amount) <= 0}>
                                                        Withdraw
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* ─── TRANSACTION HISTORY ─── */}
                        <div>
                            <div className="mt-5 justify-content-between align-items-center">
                                <h3>Transaction History</h3>
                            </div>
                            <div className="d-flex justify-content-end">
                                <a href={`/transaction-history/${user?.id}`}>View All</a>
                            </div>
                        </div>

                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Amount</th>
                                        <th>Type</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.transactions?.length > 0 ? (
                                        data.transactions.slice(0, 5).map((item, index) => (
                                            <tr key={index}>
                                                <td>{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
                                                <td>$ {item.amount}</td>
                                                <td>{item.type}</td>
                                                <td>{item.status}</td>
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
            </section>

            <Footer />
        </div>
    );
};

export default Account;
