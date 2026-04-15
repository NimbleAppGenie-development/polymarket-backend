import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout";
import { HttpClient } from "../../utils/request";
import { dateFormatter } from "../../utils/helper";
import Paginator from "../../components/Paginator";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DateRangeInput from "../../components/DateRangeInput";
import { errorToastr, successToastr } from "../../utils/toastr";
import Service from "../../services/Http";

export default function UserManagement() {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [lastItem, setLastItem] = useState(0);
    const [firstItem, setFirstItem] = useState(0);
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState("");
    const [passwordVisible, setPasswordVisible] = useState({
        newPassword: false,
        confirmPassword: false,
    });

    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({
        fullName: "",
        // countryCode: "",
        // phoneNumber: "",
        wallet: 0,
        email: "",
        active: "",
        // isWhatsappMessagesAllow: false,
        // isAbove18: true,
        // isNotificationEnabled: false,
    });
    const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

    const fetchData = async ({ page, limit, search, dateRange }) => {
        try {
            setLoading(true);
            const services = new Service();

            const response = await services.get(
                "/admin/userList",
                {
                    page,
                    limit,
                    search,
                    dateRange,
                },
                true
            );

            if (response?.status === true) {
                const result = response.result || {};
                setUsers(result.users || []);
                setTotal(result.total || 0);
                setFirstItem(result.firstItem || 0);
                setLastItem(result.lastItem || 0);
            } else {
                setUsers([]);
                setTotal(0);
                setFirstItem(0);
                setLastItem(0);

                errorToastr(response?.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("FETCH USERS ERROR:", error);

            errorToastr(error?.message || "Failed to fetch users");

            setUsers([]);
            setTotal(0);
            setFirstItem(0);
            setLastItem(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData({ page, limit, search, dateRange });
    }, [page, limit, search, dateRange]);

    const handlePageChange = (updatedPage) => setPage(updatedPage);
    const handleLimitChange = (e) => setLimit(parseInt(e.target.value));
    const resetValues = () => {
        setLimit(10);
        setPage(1);
        setSearch("");
        setDateRange("");
    };

    const logoutUser = async (user) => {
        try {
            const request = new HttpClient({
                auth: true,
                url: `/user/logoutUser/${user.id}`, // matches your controller route
            });

            await request.post();
            successToastr(`${user.name || "User"} logged out successfully`);
        } catch (error) {
            errorToastr(error.message || "Failed to logout user");
        }
    };

    const openChangePasswordModal = (user) => {
        setSelectedUser(user);
        setPasswordData({ newPassword: "", confirmPassword: "" });

        const modalEl = document.getElementById("changePasswordModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
    };

    const changeUserPassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return errorToastr("Passwords do not match");
        }
        if (passwordData.newPassword.length < 8) {
            return errorToastr("Password must be at least 8 characters long");
        }

        try {
            const request = new HttpClient({
                auth: true,
                url: `/user/changeUserPassword/${selectedUser.id}`,
                data: { password: passwordData.newPassword },
            });

            await request.post();
            successToastr("Password updated successfully");

            // Close modal safely
            const modalElement = document.getElementById("changePasswordModal");
            const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
        } catch (error) {
            errorToastr(error.message);
        }
    };

    // ---------------- User Actions ----------------
    const openViewModal = (user) => {
        setSelectedUser(user);
        setEditData({
            fullName: user.name || "",
            // countryCode: user.countryCode || "",
            // phoneNumber: user.phoneNumber || "",
            wallet: user.wallet || 0,
            email: user.email || "",
            active: user.isActive === true ? "true" : "false" || "",
            // isWhatsappMessagesAllow: user.isWhatsappMessagesAllow || false,
            // isAbove18: user.isAbove18 || true,
            // isNotificationEnabled: user.isNotificationEnabled || false,
        });
        const modalEl = document.getElementById("viewModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setEditData({
            fullName: user.name || "",
            // countryCode: user.countryCode || "",
            // phoneNumber: user.phoneNumber || "",
            wallet: user.wallet || 0,
            email: user.email || "",
            // acitve: user.isActive || "",
            // isWhatsappMessagesAllow: user.isWhatsappMessagesAllow || false,
            // isAbove18: user.isAbove18 || true,
            // isNotificationEnabled: user.isNotificationEnabled || false,
        });
        const modalEl = document.getElementById("editModal");
        const modal = new window.bootstrap.Modal(modalEl);
        modal.show();
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const saveUserEdit = async () => {
        try {
            // --- Regex patterns ---
            const nameRegex = /^[A-Za-z ]{3,22}$/;
            // const countryCodeRegex = /^\+\d{1,3}$/;
            // const phoneNumberRegex = /^\d{7,15}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const walletRegex = /^\d+(\.\d{1,2})?$/;

            // --- Required fields (except wallet and checkboxes) ---
            const requiredFields = ["fullName", "email"];
            for (let field of requiredFields) {
                if (!editData[field] || editData[field].toString().trim() === "") {
                    return errorToastr(`${field.replace(/([A-Z])/g, " $1")} is required`);
                }
            }

            // --- Validate inputs ---
            if (!nameRegex.test(editData.fullName)) return errorToastr("Invalid name. Only letters and spaces allowed (3–22 characters).");

            // if (!countryCodeRegex.test(editData.countryCode))
            //     return errorToastr("Invalid country code. Use format like +91.");

            // if (!phoneNumberRegex.test(editData.phoneNumber))
            //     return errorToastr("Invalid phone number. Only digits allowed (7–15 digits).");

            if (!emailRegex.test(editData.email)) return errorToastr("Invalid email format.");

            if (editData.wallet && !walletRegex.test(editData.wallet))
                return errorToastr("Invalid wallet amount. Only numbers allowed (max 2 decimals).");

            const request = new HttpClient({
                auth: true,
                url: `/admin/usersUpdate/${selectedUser.id}`,
                data: editData,
            });

            const res = await request.post();

            if (res.status === 200) {
                successToastr("User updated successfully");

                const modalElement = document.getElementById("editModal");
                const modalInstance = window.bootstrap.Modal.getInstance(modalElement);
                if (modalInstance) modalInstance.hide();

                // Refresh table
                fetchData({ page, limit, search, dateRange });
            } else {
                errorToastr(res?.response?.data?.message || "User update failed");
            }
        } catch (error) {
            errorToastr(error.message);
        }
    };

    const deleteUser = async (user) => {
        try {
            const service = new Service();

            const response = await service.post(`/admin/userDelete/${user.id}`, {}, true);

            if (response?.status) {
                successToastr(response?.message || "User deleted successfully");

                // Refresh table
                fetchData({ page, limit, search, dateRange });
            } else {
                errorToastr(response?.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("DELETE USER ERROR:", error);
            errorToastr(error?.message || "Something went wrong");
        }
    };

    const toggleStatus = async (user) => {
        try {
            const service = new Service(); 

            const response = await service.post( `/admin/toggleStatus/${user.id}`, {}, true  );

            if (response?.status) {
                successToastr(response?.message || "User status updated successfully");

                fetchData(
                    { 
                        page, 
                        limit, 
                        search, 
                        dateRange 
                    }
                );
            } else {
                errorToastr(response?.message || "Failed to update status");
            }
        } catch (error) {
            const errMsg = error?.response?.data?.message || error?.message || "Something went wrong";
            errorToastr(errMsg);
        }
    };

    return (
        <AuthenticatedLayout title="User Management" loading={loading}>
            {/* Filters */}
            <div className="card mb-3">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-1">
                            <select name="paginate" className="form-control" value={limit} onChange={handleLimitChange}>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                name="search-field"
                                autoComplete="off"
                                className="form-control"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name, email, phone"
                            />
                        </div>
                        <div className="col-md-3">
                            <DateRangeInput dateRange={dateRange} setDateRange={setDateRange} />
                        </div>
                        <div className="col-md-4">
                            {/* <button className="btn btn-info">Search</button> */}
                            <button className="btn btn-warning ms-2" onClick={resetValues}>
                                Reset
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="card table-responsive">
                <div className="card-body">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Name</th>
                                <th>Email</th>
                                {/* <th>Phone Number</th> */}
                                <th>Wallet Balance</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((item, key) => (
                                <tr key={item.id}>
                                    <td>{firstItem + key}</td>
                                    <td>{item.name == null ? "N/A" : item.name}</td>
                                    <td>{item.email == null ? "N/A" : item.email}</td>
                                    {/* <td>{item.countryCode && item.phoneNumber ? `${item.countryCode} ${item.phoneNumber}` : ""}</td> */}
                                    <td>{item.walletBalance || 0}</td>
                                    <td>{dateFormatter(item.createdAt, "perfectDateTime")}</td>
                                    <td>
                                        <span
                                            className={`badge ${item.isActive ? "badge-success" : "badge-danger"}`}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toggleStatus(item)}
                                        >
                                            {item.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="dropdown">
                                            <button className="btn btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                                <i className="fa fa-bars"></i>
                                            </button>
                                            <ul className="dropdown-menu">
                                                <li style={{ cursor: "pointer" }}>
                                                    <span className="dropdown-item" onClick={() => openViewModal(item)}>
                                                        <i className="fa fa-eye me-2 text-primary"></i> View
                                                    </span>
                                                </li>
                                                <li style={{ cursor: "pointer" }}>
                                                    <span className="dropdown-item" onClick={() => openEditModal(item)}>
                                                        <i className="fa fa-key me-2 text-primary"></i> Edit
                                                    </span>
                                                </li>
                                                <li style={{ cursor: "pointer" }}>
                                                    <span className="dropdown-item" onClick={() => deleteUser(item)}>
                                                        <i className="fa fa-trash me-2 text-primary" aria-hidden="true"></i> Delete User
                                                    </span>
                                                </li>
                                                <li style={{ cursor: "pointer" }}>
                                                    <span className="dropdown-item" onClick={() => toggleStatus(item)}>
                                                        {item.isActive ? (
                                                        <>
                                                            <i className="fa fa-toggle-off me-2 text-danger"></i> Deactivate
                                                        </>
                                                        ) : (
                                                        <>
                                                            <i className="fa fa-toggle-on me-2 text-success"></i> Activate
                                                        </>
                                                        )}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </td>
                                </tr>
                            ))}
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

            {/* ---------------- Modals ---------------- */}

            {/* View/Edit Modal */}
            {/* View Modal (Read-Only) */}
            <div className="modal fade" id="viewModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">User Details</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedUser && (
                                <div className="text-center mb-4">
                                    <img
                                        src={`http://162.241.71.136:8015/public/${selectedUser.profileImage ? selectedUser.profileImage : "user/1756292571686-560006036.jpg"}`}
                                        alt="profile"
                                        className="rounded-circle"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </div>
                            )}

                            <div className="row">
                                {/* Render fields as read-only labels */}
                                {Object.entries(editData).map(([key, value]) => {
                                    // Skip the three checkboxes fields
                                    if (key === "isWhatsappMessagesAllow" || key === "isAbove18" || key === "isNotificationEnabled") return null;

                                    return (
                                        <div className="col-md-6 mb-3" key={key}>
                                            <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, " $1")}</label>
                                            <p className="form-control-plaintext">{value === null || value === "" ? "N/A" : value.toString()}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* View/Edit Modal */}
            <div className="modal fade" id="editModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit user</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {selectedUser && (
                                <div className="text-center mb-4">
                                    <img
                                        src={`http://162.241.71.136:8015/public/${selectedUser.profileImage ? selectedUser.profileImage : "user/1756292571686-560006036.jpg"}`}
                                        alt="profile"
                                        className="rounded-circle"
                                        style={{ width: 100, height: 100 }}
                                    />
                                </div>
                            )}
                            <div className="row">
                                {Object.entries(editData).map(([key, value]) => (
                                    <div className="col-md-6 mb-3" key={key}>
                                        {typeof value === "boolean" ? (
                                            <div className="d-flex align-items-center">
                                                <label className="form-label text-capitalize mb-0 me-2" htmlFor={key}>
                                                    {key.replace(/([A-Z])/g, " $1")}
                                                </label>

                                                <input
                                                    type="checkbox"
                                                    id={key}
                                                    name={key}
                                                    className="form-check-input"
                                                    checked={value}
                                                    onChange={key === "isAbove18" ? undefined : handleEditChange}
                                                    disabled={key === "isAbove18"}
                                                    readOnly={key === "isAbove18"}
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <label className="form-label text-capitalize" htmlFor={key}>
                                                    {key.replace(/([A-Z])/g, " $1")}
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id={key}
                                                    name={key}
                                                    value={value ?? ""}
                                                    onChange={handleEditChange}
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="button" className="btn btn-primary" onClick={saveUserEdit}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="changePasswordModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Change Password</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <div className="input-group">
                                    <input
                                        type={passwordVisible.newPassword ? "text" : "password"}
                                        className="form-control"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            setPasswordVisible((prev) => ({
                                                ...prev,
                                                newPassword: !prev.newPassword,
                                            }))
                                        }
                                    >
                                        <i className={`fa ${passwordVisible.newPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-group">
                                    <input
                                        type={passwordVisible.confirmPassword ? "text" : "password"}
                                        className="form-control"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                                    />
                                    <span
                                        className="input-group-text"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            setPasswordVisible((prev) => ({
                                                ...prev,
                                                confirmPassword: !prev.confirmPassword,
                                            }))
                                        }
                                    >
                                        <i className={`fa ${passwordVisible.confirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={changeUserPassword}>
                                <i className="fa fa-save me-2"></i> Save Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
