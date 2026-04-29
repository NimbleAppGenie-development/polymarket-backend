import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout";
import Service from "../services/Http";

export default function Dashboard() {
    const [totalUser, setTotalUser] = useState(0);
    const [totalMatches, setTotalMatches] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [activeMatches, setTotalActiveMatches] = useState(0);
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const services = new Service();

            const response = await services.get( "/admin/dashboard", {},  true,  );


            if (response?.status) {
                const { totalUsers, totalMatches, totalQuestions, activeMatches } = response?.data || {};

                setTotalUser(totalUsers || 0);

                setTotalMatches(totalMatches || 0);

                setTotalQuestions(totalQuestions || 0);

                setTotalActiveMatches(activeMatches || 0);
            } else {
                errorToastr(response?.message || "Failed to fetch dashboard data");

                setTotalUser(0);
                setTotalMatches(0);
                setTotalQuestions(0);
                setTotalActiveMatches(0);
            }
        } catch (error) {
            console.error("DASHBOARD ERROR:", error);

            errorToastr(error?.message || "Failed to fetch dashboard data");

            setTotalUser(0);
            setTotalMatches(0);
            setTotalQuestions(0);
            setTotalActiveMatches(0);
        }
    };

    useEffect(() => {
        fetchDashboardData();
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
                    <div className="card card-stats card-round" style={{ cursor: "pointer" }} onClick={() => handleCardClick("/users")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center">
                                        <i className="icon-user text-warning" />
                                    </div>
                                </div>
                                <div className="col-7 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">Users</p>
                                        <h4 className="card-title">{totalUser}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Matches */}
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round" style={{ cursor: "pointer" }} onClick={() => handleCardClick("/matches")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center">
                                        <i className="icon-energy text-success" />
                                    </div>
                                </div>
                                <div className="col-7 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">Matches</p>
                                        <h4 className="card-title">{totalMatches}</h4>
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

                {/* Active Matches */}
                <div className="col-sm-6 col-md-3">
                    <div className="card card-stats card-round" style={{ cursor: "pointer" }} onClick={() => handleCardClick("/matches")}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-5">
                                    <div className="icon-big text-center">
                                        <i className="icon-social-twitter text-primary" />
                                    </div>
                                </div>
                                <div className="col-7 col-stats">
                                    <div className="numbers">
                                        <p className="card-category">Active Matches</p>
                                        <h4 className="card-title">{activeMatches}</h4>
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
