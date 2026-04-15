import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";

const Account = () => {
    const { user } = useContext(AuthContext);
    const [wallet, setWallet] = useState(0);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("");
    const [txnId, setTxnId] = useState("");

    const getAccountDetails = async () => {
        try {
            setLoading(true);

            const services = new Service();

            const response = await services.get(`/user/user-account-details/${user.id}`, {}, true);

            if (response?.status) {
                setWallet(response?.data?.walletBalance || 0);
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
                    // method,
                    // txnId,
                },
                true,
            );
            console.log("==========response=========",response.data)
            if (response?.status) {
                // alert("Money added successfully");

                setAmount(response.data || []);
                // setMethod("");
                // setTxnId("");

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

                                    <div className="wallet-box">
                                        <h3>₹ {wallet}</h3>
                                        <p>Available Balance</p>
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

                                        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" required max="99999999"/>

                                        {/* <label>Payment Method *</label>
                                        <select required>
                                            <option value="">Select Method</option>
                                            <option value="upi">UPI</option>
                                            <option value="card">Card</option>
                                            <option value="netbanking">Net Banking</option>
                                        </select>

                                        <label>Transaction ID</label>
                                        <input type="text" value={txnId} onChange={(e) => setTxnId(e.target.value)} /> */}

                                        <button type="submit" className="btn btn-primaryx mt-3">
                                            Add Money
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Account;
