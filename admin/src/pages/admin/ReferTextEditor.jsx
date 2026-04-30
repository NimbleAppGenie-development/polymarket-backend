import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { successToastr, errorToastr } from "../../utils/toastr.js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router";

const BASE_URL = "http://162.241.71.136:8015/public/";

export default function ReferDataEdit() {
    const [data, setData] = useState({
        textData: "",
        bannerImage: "",
        firstObj: [],
        secondObj: [],
        refferAmount: "",
        refferLink: "",
        refferMessage: "",
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // === Fetch referral data ===
    const fetchData = async () => {
        setLoading(true);
        try {
            const services = new Service();

            const response = await services.get("/admin/walletConfig", {}, true);

            if (response.status && response.data) {
                const cfg = response.data;
                setData({
                    textData: cfg.textData || "",
                    bannerImage: cfg.bannerImage || "",
                    firstObj: Array.isArray(cfg.firstObj) ? cfg.firstObj : [],
                    secondObj: Array.isArray(cfg.secondObj) ? cfg.secondObj : [],
                    refferAmount: cfg.refferAmount || "",
                    refferLink: cfg.refferLink || "",
                    refferMessage: cfg.refferMessage || "",
                });
            } else {
                errorToastr(resp?.message || "Failed to fetch referral data");
            }
        } catch (err) {
            console.error(err);
            errorToastr("Error fetching referral data");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // === Card field changes ===
    const handleCardChange = (field, index, key, value) => {
        const arr = [...data[field]];
        arr[index] = { ...arr[index], [key]: value };
        setData({ ...data, [field]: arr });
    };

    const addCardRow = (field) => {
        setData({
            ...data,
            [field]: [...data[field], { heading: "", text: "", icon: "" }],
        });
    };

    const removeCardRow = (field, index) => {
        const arr = data[field].filter((_, i) => i !== index);
        setData({ ...data, [field]: arr });
    };

    // === Save Data with Images ===
    const handleSave = async () => {
        try {
            const formData = new FormData();

            // append text
            formData.append("textData", data.textData?.trim() || "");

            // append arrays as JSON
            formData.append("firstObj", JSON.stringify(data.firstObj));
            formData.append("secondObj", JSON.stringify(data.secondObj));

            // append new fields
            formData.append("refferAmount", data.refferAmount || "");
            formData.append("refferLink", data.refferLink || "");
            formData.append("refferMessage", data.refferMessage || "");

            // append banner image (if it's a File)
            if (data.bannerImage instanceof File) {
                formData.append("bannerImage", data.bannerImage);
            }

            // append firstObj icon (only first one, as backend supports 1)
            const firstIcon = data.firstObj.find((item) => item.icon instanceof File);
            if (firstIcon) {
                formData.append("firstObjIcon", firstIcon.icon);
            }

            // append secondObj icon (only first one, as backend supports 1)
            const secondIcon = data.secondObj.find((item) => item.icon instanceof File);
            if (secondIcon) {
                formData.append("secondObjIcon", secondIcon.icon);
            }

            const services = new Service();

            const response = await services.post("/admin/walletConfig/update", formData, true);

            if (response.status) {
                successToastr("Referral data updated successfully");

                setTimeout(() => {
                    navigate("/pages");
                }, 500);
            } else {
                errorToastr(response?.message || response?.data?.message || "Failed to update referral data");
            }
        } catch (err) {
            console.error(err);
            errorToastr("Error saving referral data");
        }
    };

    // === UI ===
    return (
        <AuthenticatedLayout title="Edit Referral Page" loading={loading}>
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-round">
                        <div className="card-header">
                            <h3 className="text-center">Referral Page Editor</h3>
                        </div>
                        <div className="card-body" style={{ overflowX: "auto" }}>
                            {/* === Points to Remember === */}
                            <div className="mb-4">
                                <label className="form-label">
                                    <strong>Points To Remember</strong>
                                </label>
                                <ReactQuill
                                    theme="snow"
                                    value={data.textData || ""}
                                    onChange={(value) => setData({ ...data, textData: value })}
                                    modules={{
                                        toolbar: [
                                            [{ header: [1, 2, false] }],
                                            ["bold", "italic", "link"],
                                            [{ list: "ordered" }, { list: "bullet" }],
                                            ["blockquote"],
                                        ],
                                    }}
                                    style={{ height: "200px", marginBottom: "20px" }}
                                />
                            </div>

                            {/* === New Fields === */}
                            <div className="mb-3" style={{ marginTop: "60px" }}>
                                <label className="form-label">
                                    <strong>Referral Amount</strong>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.refferAmount}
                                    onChange={(e) => setData({ ...data, refferAmount: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    <strong>Referral Link</strong>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={data.refferLink}
                                    onChange={(e) => setData({ ...data, refferLink: e.target.value })}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">
                                    <strong>Referral Message</strong>
                                </label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={data.refferMessage}
                                    onChange={(e) => setData({ ...data, refferMessage: e.target.value })}
                                />
                            </div>

                            {/* === Banner Image === */}
                            <div className="mb-4">
                                <label className="form-label">
                                    <strong>Banner Image</strong>
                                </label>
                                {data.bannerImage && !(data.bannerImage instanceof File) && (
                                    <div className="mb-2">
                                        <img src={`${BASE_URL}${data.bannerImage}`} alt="banner" style={{ width: "200px" }} />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            bannerImage: e.target.files[0],
                                        })
                                    }
                                />
                            </div>

                            {/* === Earn Coins Cards === */}
                            <div className="mb-4">
                                <label className="form-label">
                                    <strong>Earn Coins Cards</strong>
                                </label>
                                {data.firstObj.map((item, index) => (
                                    <div key={index} className="mb-3 border p-3 rounded">
                                        <div className="mb-2">
                                            <label>Heading</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item.heading || ""}
                                                onChange={(e) => handleCardChange("firstObj", index, "heading", e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Text</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item.text || ""}
                                                onChange={(e) => handleCardChange("firstObj", index, "text", e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Icon</label>
                                            {item.icon && !(item.icon instanceof File) && (
                                                <img
                                                    src={`${BASE_URL}${item.icon}`}
                                                    alt="icon"
                                                    style={{
                                                        width: "50px",
                                                        display: "block",
                                                        marginBottom: "5px",
                                                    }}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const arr = [...data.firstObj];
                                                    arr[index] = { ...arr[index], icon: e.target.files[0] };
                                                    setData({ ...data, firstObj: arr });
                                                }}
                                            />
                                        </div>
                                        <button className="btn btn-sm btn-danger" onClick={() => removeCardRow("firstObj", index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button className="btn btn-outline-primary" onClick={() => addCardRow("firstObj")}>
                                    + Add Earn Coins Card
                                </button>
                            </div>

                            {/* === Play Winning Cards === */}
                            <div className="mb-4">
                                <label className="form-label">
                                    <strong>Play Winning Cards</strong>
                                </label>
                                {data.secondObj.map((item, index) => (
                                    <div key={index} className="mb-3 border p-3 rounded">
                                        <div className="mb-2">
                                            <label>Heading</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item.heading || ""}
                                                onChange={(e) => handleCardChange("secondObj", index, "heading", e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Text</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={item.text || ""}
                                                onChange={(e) => handleCardChange("secondObj", index, "text", e.target.value)}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label>Icon</label>
                                            {item.icon && !(item.icon instanceof File) && (
                                                <img
                                                    src={`${BASE_URL}${item.icon}`}
                                                    alt="icon"
                                                    style={{
                                                        width: "50px",
                                                        display: "block",
                                                        marginBottom: "5px",
                                                    }}
                                                />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const arr = [...data.secondObj];
                                                    arr[index] = { ...arr[index], icon: e.target.files[0] };
                                                    setData({ ...data, secondObj: arr });
                                                }}
                                            />
                                        </div>
                                        <button className="btn btn-sm btn-danger" onClick={() => removeCardRow("secondObj", index)}>
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button className="btn btn-outline-primary" onClick={() => addCardRow("secondObj")}>
                                    + Add Play Winning Card
                                </button>
                            </div>

                            {/* === Save Button === */}
                            <div className="d-flex justify-content-end mt-4">
                                <button className="btn btn-success" onClick={handleSave}>
                                    💾 Save Referral Data
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
