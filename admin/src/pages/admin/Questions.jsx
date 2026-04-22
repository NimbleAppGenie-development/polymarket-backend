import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout";
import { HttpClient } from "../../utils/request";
import { dateFormatter } from "../../utils/helper";
import Paginator from "../../components/Paginator";
import DateRangeInput from "../../components/DateRangeInput";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { Link } from "react-router";
import Swal from "sweetalert2";
import Service from "../../services/Http.js";

export default function Questions() {
    const [questionsData, setQuestionsData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [lastItem, setLastItem] = useState(0);
    const [firstItem, setFirstItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState("");
    const [type, setType] = useState("all");
    const [winnerData, setWinnerData] = useState(null);
    const [showWinnerModal, setShowWinnerModal] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState(null);

    const deleteQuestion = async (questionId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        try {
            const services = new Service();

            const response = await services.post("/admin/question/delete", { questionId }, true);

            if (response?.status) {
                successToastr(response.message || "Question deleted successfully");

                await fetchQuestions();
            } else {
                errorToastr(response?.message || "Failed to delete question");
            }
        } catch (error) {
            console.error("DELETE QUESTION ERROR:", error);

            errorToastr(error?.message || "Failed to delete question");
        }
    };

    // fetch questions (uses current state values)
    const fetchQuestions = async () => {
        setLoading(true);

        try {
            const services = new Service();

            const params = {
                page,
                limit,

                ...(search && search.trim() !== "" && { search }),

                ...(dateRange && dateRange !== "" && { dateRange }),

                ...(type && type !== "All" && { type }),
            };

            const response = await services.get("/admin/questions", params, true);
            if (response?.status) {
                const { questions, total, firstItem, lastItem } = response?.data || {};

                setQuestionsData(questions || []);

                setTotal(total || 0);

                setFirstItem(firstItem || 0);

                setLastItem(lastItem || 0);
            } else {
                setQuestionsData([]);

                setTotal(0);

                setFirstItem(0);

                setLastItem(0);
            }
        } catch (error) {
            console.error("FETCH QUESTIONS ERROR:", error);

            errorToastr(error?.message || "Failed to fetch questions");

            setQuestionsData([]);

            setTotal(0);

            setFirstItem(0);

            setLastItem(0);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, "0");

        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // convert to 12-hour format
        hours = String(hours).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
    };

    const handlePageChange = (updatedPage) => {
        setPage(updatedPage);
    };

    const handleLimitChange = (event) => {
        setLimit(parseInt(event.target.value, 10));
        setPage(1);
    };

    const resetValues = () => {
        setLimit(10);
        setPage(1);
        setSearch("");
        setDateRange("");
        setType("all");
    };

    const updateStatus = async (id) => {
        try {
            const services = new Service();

            const response = await services.get(`/admin/question/update-status/${id}`, {}, true);

            if (response?.status) {
                successToastr(response.message || "Status updated successfully");

                await fetchQuestions();
            } else {
                errorToastr(response?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("UPDATE QUESTION STATUS ERROR:", error);

            errorToastr(error?.message || "Failed to update status");
        }
    };

    const updateTrending = async (id) => {
        try {
            const services = new Service();
            const response = await services.get(`/admin/question/update-trending/${id}`, {}, true);
            if (response?.status) {
                successToastr(response.message || "Trending updated successfully");
                await fetchQuestions();
            } else {
                errorToastr(response?.message || "Failed to update trending");
            }
        } catch (error) {
            console.error("UPDATE QUESTION TRENDING ERROR:", error);

            errorToastr(error?.message || "Failed to update trending");
        }
    };
    const updateShowInSlider = async (id) => {
        try {
            const services = new Service();
            const response = await services.get(`/admin/question/show-in-slider/${id}`, {}, true);
            if (response?.status) {
                successToastr(response.message || "Slider updated successfully");
                await fetchQuestions();
            } else {
                errorToastr(response?.message || "Failed to update slider");
            }
        } catch (error) {
            console.error("UPDATE QUESTION SLIDER ERROR:", error);

            errorToastr(error?.message || "Failed to update slider");
        }
    };

    const createQuestion = () => {
        window.location.href = "/question/add";
    };
    const openWinnerModal = async (questionId) => {
        const services = new Service();

        const res = await services.get(`/admin/question/winner/${questionId}`, {}, true);

        if (res?.status) {
            setWinnerData(res.data);
            setSelectedOptionId(res.data?.options?.find((o) => o.resultStatus)?.id || null);
            setShowWinnerModal(true);
        }
    };
    useEffect(() => {
        fetchQuestions();
    }, [page, limit, search, dateRange, type]);

    return (
        <AuthenticatedLayout title="Questions" loading={loading}>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-1">
                            <div style={{ minWidth: "100px" }}>
                                <select name="paginate" id="paginate" className="form-control" value={limit} onChange={handleLimitChange}>
                                    <option value="10">10</option>
                                    <option value="20">20</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ minWidth: "200px" }}>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="search"
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search by question"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div style={{ minWidth: "200px" }}>
                                <DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
                            </div>
                        </div>
                        <div className="col-md-5">
                            <button className="btn btn-warning" onClick={resetValues}>
                                Reset
                            </button>
                            <button className="btn btn-primary ms-2" onClick={createQuestion}>
                                Add Question
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table & modals ... (keep your existing table / modal rendering) */}
            <div className="card table-responsive">
                <div className="card-body">
                    {type === "matchWise" && typeof questionsData === "object" ? (
                        Object.entries(questionsData).map(([categoryName, questions], index) => (
                            <div key={index}>
                                <h5 className="mt-3 mb-2 text-primary">{categoryName}</h5>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Category</th>
                                            <th>Question</th>
                                            <th>Options</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Event Start Date</th>
                                            <th>Event End Date</th>
                                            <td>Trending</td>
                                            <td>Show In Slider</td>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {questions?.map((item, key) => (
                                            <tr key={item.questionId || key}>
                                                <td>{firstItem + key}</td>
                                                <td>{item?.question}</td>
                                                <td>{item?.categoryName}</td>
                                                <td>
                                                    {winnerData?.options?.map((opt) => (
                                                        <label
                                                            key={opt.id}
                                                            className="p-2 border mb-2 d-flex align-items-center gap-2"
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="winnerOption"
                                                                checked={selectedOptionId === opt.id}
                                                                onChange={() => setSelectedOptionId(opt.id)}
                                                            />

                                                            <div onClick={() => setSelectedOptionId(opt.id)} style={{ flex: 1 }}>
                                                                <b>{opt.option}</b> — {opt.multiplier}
                                                            </div>
                                                        </label>
                                                    ))}
                                                </td>
                                                <td>{item?.description}</td>
                                                <td>
                                                    {item.status ? (
                                                        <span
                                                            className="badge bg-success text-white"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => updateStatus(item.questionId)}
                                                        >
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span
                                                            className="badge bg-danger text-white"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => updateStatus(item.questionId)}
                                                        >
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td>{formatDateTime(item.eventStartDate)}</td>
                                                <td>{formatDateTime(item.eventEndDate)}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.isTrending === true || item.isTrending === "true"}
                                                        onChange={() => updateTrending(item.questionId)}
                                                        style={{ cursor: "pointer", width: "20px", height: "20px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={item.showInSlider === true || item.showInSlider === "true"}
                                                        onChange={() => updateShowInSlider(item.questionId)}
                                                        style={{ cursor: "pointer", width: "20px", height: "20px" }}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-sm dropdown-toggle"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="fa fa-bars" aria-hidden="true"></i>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <Link to={`/question/edit/${item.questionId}`} className="dropdown-item">
                                                                    Edit
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    ) : (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Question</th>
                                    <th>Options</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Event Start Date</th>
                                    <th>Event End Date</th>
                                    <th>Trending</th>
                                    <th>Show In Slider</th>
                                    <th>Result status</th>
                                    <th>Currect option</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {questionsData.length > 0 && (
                                <tbody>
                                    {questionsData.map((item, key) => (
                                        <tr key={item.questionId || key}>
                                            <td>{firstItem + key}</td>
                                            <td>{item?.question}</td>
                                            <td>
                                                {item?.options?.length > 0
                                                    ? item.options.map((opt, i) => (
                                                          <div key={i}>
                                                              <strong>{opt.option}</strong> - {opt.multiplier}x
                                                          </div>
                                                      ))
                                                    : "-"}
                                            </td>
                                            <td>{item?.categoryName}</td>
                                            <td>{item?.description}</td>
                                            <td>
                                                {item.status ? (
                                                    <span
                                                        className="badge bg-success text-white"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => updateStatus(item.questionId)}
                                                    >
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="badge bg-danger text-white"
                                                        style={{ cursor: "pointer" }}
                                                        onClick={() => updateStatus(item.questionId)}
                                                    >
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td>{formatDateTime(item.eventStartDate)}</td>
                                            <td>{formatDateTime(item.eventEndDate)}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={item.trending}
                                                    onChange={() => updateTrending(item.questionId)}
                                                    style={{ cursor: "pointer", width: "20px", height: "20px" }}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={item.showInSlider}
                                                    onChange={() => updateShowInSlider(item.questionId)}
                                                    style={{ cursor: "pointer", width: "20px", height: "20px" }}
                                                />
                                            </td>
                                            <td>
                                                {item?.options?.some((opt) => opt.resultStatus) ? (
                                                    <span className="badge bg-success">Declared</span>
                                                ) : (
                                                    <span className="badge bg-secondary">Not Declared</span>
                                                )}
                                            </td>
                                            <td>{item?.options?.find((opt) => opt.resultStatus)?.option || "-"}</td>
                                            <td>
                                                <div className="dropdown">
                                                    <button
                                                        className="btn btn-sm dropdown-toggle"
                                                        type="button"
                                                        data-bs-toggle="dropdown"
                                                        aria-expanded="false"
                                                    >
                                                        <i className="fa fa-bars" aria-hidden="true"></i>
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <Link to={`/question/edit/${item.questionId}`} className="dropdown-item">
                                                                <i className="fa fa-key me-2 text-primary"></i> Edit
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <button
                                                                className="dropdown-item text-danger"
                                                                onClick={() => deleteQuestion(item.questionId)}
                                                            >
                                                                <i className="fa fa-trash me-2 text-danger" aria-hidden="true"></i> Delete
                                                            </button>
                                                        </li>
                                                        {!item?.options?.some((opt) => opt.resultStatus) && (
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    className="dropdown-item"
                                                                    onClick={() => openWinnerModal(item.questionId)}
                                                                >
                                                                    <i className="fa fa-trophy me-2 text-warning"></i>
                                                                    Announce Winner
                                                                </Link>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            )}
                        </table>
                    )}
                </div>
                {showWinnerModal && (
                    <div className="modal d-block" style={{ background: "#00000070" }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5>Announce Winner</h5>
                                    <button onClick={() => setShowWinnerModal(false)}>X</button>
                                </div>

                                <div className="modal-body">
                                    <h6 className="mb-3">{winnerData?.question}</h6>

                                    {winnerData?.options?.map((opt) => (
                                        <label
                                            key={opt.id}
                                            className={`p-2 border mb-2 d-flex align-items-center gap-2 ${
                                                selectedOptionId === opt.id ? "bg-light border-primary" : ""
                                            }`}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <input
                                                type="radio"
                                                name="winnerOption"
                                                checked={selectedOptionId === opt.id}
                                                onChange={() => setSelectedOptionId(opt.id)}
                                            />

                                            <div style={{ flex: 1 }}>
                                                <b>{opt.option}</b> — {opt.multiplier}
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowWinnerModal(false)}>
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        disabled={!selectedOptionId}
                                        onClick={async () => {
                                            const services = new Service();

                                            await services.post(
                                                "/admin/question/announce-winner",
                                                {
                                                    questionId: winnerData.id,
                                                    optionId: selectedOptionId,
                                                },
                                                true,
                                            );

                                            successToastr("Winner selected!");
                                            setShowWinnerModal(false);
                                            setSelectedOptionId(null);
                                            fetchQuestions();
                                        }}
                                    >
                                        Confirm Winner
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
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
