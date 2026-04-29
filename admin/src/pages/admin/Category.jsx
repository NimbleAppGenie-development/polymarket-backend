import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { dateFormatter } from "../../utils/helper.js";
import Paginator from "../../components/Paginator.jsx";
import Service from "../../services/Http.js";

import DateRangeInput from "../../components/DateRangeInput.jsx";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { Link } from "react-router";
import Swal from "sweetalert2";

export default function Category() {
    const [categoryData, setCategoryData] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [lastItem, setLastItem] = useState(0);
    const [firstItem, setFirstItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");

    const fetchCategory = async () => {
        setLoading(true);

        try {
            const services = new Service();

            const payload = { page, limit, search, dateRange, filter: activeFilter };

            const response = await services.get("/admin/category", payload, true);

            if (response?.status) {
                const { allCategory, total, firstItem, lastItem, currentPage } = response.data;

                setCategoryData(allCategory || []);
                setTotal(total || 0);
                setFirstItem(firstItem || 0);
                setLastItem(lastItem || 0);

                if (currentPage) {
                    setPage(currentPage);
                }
            }
        } catch (error) {
            console.error("Fetch Category Error:", error);

            errorToastr(error?.message || "Category fetch failed");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (updatedPage) => setPage(updatedPage);
    const handleLimitChange = (event) => setLimit(parseInt(event.target.value));

    const resetValues = () => {
        setLimit(10);
        setPage(1);
        setSearch("");
        setDateRange("");
        setActiveFilter("All");
    };

    const updateStatus = async (id) => {
        try {
            const services = new Service();

            const response = await services.get(`/admin/category/update-status/${id}`, {}, true);

            if (response?.status) {
                successToastr(response.message);

                await fetchCategory();
            }
        } catch (error) {
            console.error("Update Status Error:", error);

            errorToastr(error?.message || "Failed to update status");
        }
    };

    const deleteCategory = async (categoryId) => {
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

            const response = await services.post("/admin/category/deleteCategory", { categoryId }, true);


            if (response?.status) {
                successToastr(response.message || "Category deleted successfully");

                await fetchCategory();
            } else {
                errorToastr(response?.message || "Failed to delete Category");
            }
        } catch (error) {
            console.error("DELETE ERROR:", error);

            errorToastr(error?.message || "Failed to delete Category");
        }
    };

    const addCategory = () => {
        window.location.href = "/category/add";
    };

    useEffect(() => {
        fetchCategory();
    }, [page, limit, search, dateRange, activeFilter]);

    return (
        <AuthenticatedLayout title="Category" loading={loading}>
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row align-items-center g-2 mb-3">
                        <div className="col-md-1">
                            <select name="paginate" id="paginate" className="form-control" value={limit} onChange={handleLimitChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                name="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by team name"
                            />
                        </div>

                        <div className="col-md-3 d-flex gap-2">
                            <button className="btn btn-warning w-100" onClick={resetValues}>
                                Reset
                            </button>
                            <button className="btn btn-primary w-100" onClick={addCategory}>
                                Add Category
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card table-responsive">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>CategoryId</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryData.length > 0 ? (
                                categoryData.map((item, key) => (
                                    <tr key={key}>
                                        <td>{item.categoryId}</td>
                                        <td>{item.name} </td>
                                        <td>
                                            <img
                                                src={`${import.meta.env.VITE_STATIC_URL}/public/category/${item.image}`}
                                                alt="Category"
                                                style={{ width: 50, marginTop: 10 }}
                                            />
                                        </td>
                                        <td>{dateFormatter(item.date, "perfectDateTime")}</td>
                                        <td>
                                            {item.status ? (
                                                <span
                                                    className="badge badge-success"
                                                    onClick={() => updateStatus(item.categoryId)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Active
                                                </span>
                                            ) : (
                                                <span
                                                    className="badge badge-danger"
                                                    onClick={() => updateStatus(item.categoryId)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Inactive
                                                </span>
                                            )}
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
                                                        <Link to={`/category/edit/${item.categoryId}`} className="dropdown-item">
                                                            <i className="fa fa-edit me-2 text-primary"></i> Edit
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button
                                                            type="button"
                                                            className="dropdown-item text-danger"
                                                            onClick={() => deleteCategory(item.categoryId)}
                                                        >
                                                            <i className="fa fa-trash me-2"></i>
                                                            Delete
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center">
                                        No matches found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

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
