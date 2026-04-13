/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout";
import { HttpClient } from "../../utils/request";
import AuthContext from "../../utils/auth/AuthContext";
import { fetchURLfromBackend } from "../../utils/helper";
import { errorToastr, successToastr } from "../../utils/toastr";

export default function HomeBannerSettings() {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [banner, setBanner] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    // Fetch existing banner
    const fetchBanner = async () => {
        try {
            const services = new Service();
            const resposne = await services.get("/admin/home-banner", {}, true);
            if (resposne?.status) {
                setBanner(resposne?.data || null);
            } else {
                setBanner(null);
            }
        } catch (error) {
            console.error(error);
            errorToastr("Failed to load banner data");
        }
    };

    // Handle file select
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle upload
    const handleUpload = async (e) => {
        e.preventDefault();

        if (!imageFile) {
            errorToastr("Please select an image file first");
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const services = new Service();
            const response = await services.post("/admin/home-banner", formData, true);
            if (!response?.status) {
                errorToastr(response?.message || "Failed to upload banner");
                return;
            } else {
                successToastr(response?.message || "Home banner updated successfully");
                setImageFile(null);
                setPreview(null);
                fetchBanner(); // refresh banner
            }
        } catch (error) {
            console.error(error);
            errorToastr("Error uploading banner");
        }
    };

    useEffect(() => {
        if (user) fetchBanner();
    }, [user]);

    return (
        <AuthenticatedLayout title="Home Banner Settings" loading={loading}>
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Home Banner Management</h4>
                </div>
                <div className="card-body">
                    <div className="row align-items-center">
                        {/* Left side: current image */}
                        <div className="col-md-6 text-center">
                            <h5>Current Banner</h5>
                            {banner?.image ? (
                                <img
                                    src={`http://162.241.71.136:8015/public/${banner.image}`}
                                    alt="Current Banner"
                                    className="img-fluid rounded shadow"
                                    style={{ maxHeight: "300px", objectFit: "cover" }}
                                />
                            ) : (
                                <p>No banner image found.</p>
                            )}
                        </div>

                        {/* Right side: upload new image */}
                        <div className="col-md-6">
                            <form onSubmit={handleUpload}>
                                <h5>Upload New Banner</h5>
                                <div className="mb-3">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
                                </div>

                                {preview && (
                                    <div className="mb-3">
                                        <p>Preview:</p>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="img-fluid rounded shadow"
                                            style={{ maxHeight: "300px", objectFit: "cover" }}
                                        />
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary w-100">
                                    {imageFile ? "Upload Banner" : "Select Image First"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
