import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout";
import { HttpClient } from "../../utils/request";
import Service from "../../services/Http";


export default function Dashboard() {
    const [totalUser, setTotalUser] = useState(0);
    const [totalCategory, setTotalCategory] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const services = new Service();

            const response = await services.get(
                "/admin/dashboard",
                {}, 
                true,
            );

            if (response?.status) {
                const { totalUser, totalCategory, totalQuestions } = response?.data || {};
                setTotalUser(totalUser || 0);
                setTotalCategory(totalCategory || 0);

                setTotalQuestions(totalQuestions || 0);
            } else {
                setTotalCategory(0);

                setTotalQuestions(0);
            }
        } catch (error) {
            console.error("DASHBOARD ERROR:", error);

            errorToastr(error?.message || "Failed to fetch dashboard data");

            setTotalCategory(0);

            setTotalQuestions(0);
        }
    };

    useEffect(() => {
        fetchDashboardData().then(() => ("fetchDashboardData executed"));
    }, []);

    // Helper to handle navigation
    const handleCardClick = (path) => {
        navigate(path);
    };

    return (
        <AuthenticatedLayout title="Dashboard">
            <div className="row row-card-no-pd">
                {/* Users */}
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round" style={{ cursor: "pointer" }} onClick={() => handleCardClick("/user")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center">
                                        <i className="icon-user text-success" />
                                    </div>
                                </div>
                                <div className="col-7 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">User</p>
                                        <h4 className="card-title">{totalUser}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category */}
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round" style={{ cursor: "pointer" }} onClick={() => handleCardClick("/category")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center">
                                        <i className="icon-energy text-success" />
                                    </div>
                                </div>
                                <div className="col-7 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">Category</p>
                                        <h4 className="card-title">{totalCategory}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round" style={{ cursor: "pointer" }} onClick={() => handleCardClick("/questions")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center">
                                        <i className="icon-question text-danger" />
                                    </div>
                                </div>
                                <div className="col-7 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">Questions</p>
                                        <h4 className="card-title">{totalQuestions}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
