import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";
import { success } from "toastr";

const Account = () => {
    const { user } = useContext(AuthContext);
    const [availableWallet, setAvailableWallet] = useState(0);
    const [winningWallet, setWinningWallet] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [data, setData] = useState("");
    const [txnId, setTxnId] = useState("");

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

    const handleAddMoney = async (e) => {
        e.preventDefault();

        try {
            const services = new Service();

            const response = await services.post(
                "/user/add-money",
                {
                    userId: user.id,
                    amount,
                    type: "MAIN",
                },
                true,
            );

            if (response?.status) {
                success("Money added successfully");
                setAmount(response.data || []);
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
                                        {/* <p>
                                            <strong>User ID:</strong> {user?.id}
                                        </p> */}
                                    </div>
                                </div>

                                <div className="politics-main-box mt-4">
                                    <div className="politics-header-box">
                                        <h4>WALLET</h4>
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
                                <h2>
                                    Add Money <img src="img/rightarrow.svg" alt="icon" />
                                </h2>

                                <div className="politics-main-box">
                                    <form className="account-form" onSubmit={handleAddMoney}>
                                        <label>Enter Amount *</label>

                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            min="1"
                                            onKeyDown={(e) => {
                                                if (["e", "E", "+", "-", "."].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            required
                                            max="99999999"
                                        />

                                        <button type="submit" className="btn btn-primaryx mt-3">
                                            Add Money
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

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
                                    {/* Sample transaction data */}
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
