import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AuthContext from "../utils/auth/AuthContext.jsx";
import Service from "../services/Http.js";
import Paginator from "../components/Paginator.jsx";

const TransactionHistory = () => {
    const { user } = useContext(AuthContext);

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [firstItem, setFirstItem] = useState(0);
    const [lastItem, setLastItem] = useState(0);

    const getTransactions = async () => {
        try {
            setLoading(true);

            const services = new Service();

            const response = await services.get(
                `/user/user-account-details/${user.id}?page=${page}&limit=${limit}`,
                {},
                true
            );

            if (response?.status) {
                setTransactions(response.data?.transactions || []);

                setTotal(response.data?.total || 0);
                setFirstItem(response.data?.firstItem || 0);
                setLastItem(response.data?.lastItem || 0);
            }
        } catch (error) {
            console.error("TRANSACTION ERROR:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) {
            getTransactions();
        }
    }, [user, page, limit]);

    return (
        <div className="home-page">
            <Header />

            <section className="banner-section-content">
                <div className="container">

                    <h2>Transaction History</h2>

                    <div className="politics-main-box mt-4">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>
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
                                        {transactions.length > 0 ? (
                                            transactions.map((txn, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        {new Date(
                                                            txn.createdAt
                                                        ).toLocaleDateString(
                                                            "en-GB"
                                                        )}
                                                    </td>
                                                    <td>₹ {txn.amount}</td>
                                                    <td>{txn.type}</td>
                                                    <td>{txn.status}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">
                                                    No transactions found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* PAGINATION */}
                                <Paginator
                                    page={page}
                                    limit={limit}
                                    total={total}
                                    firstItem={firstItem}
                                    lastItem={lastItem}
                                    pageChangeHandler={setPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default TransactionHistory;