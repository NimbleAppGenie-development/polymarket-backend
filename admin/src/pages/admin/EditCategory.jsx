import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { HttpClient } from "../../utils/request.js";
import { useNavigate, useParams } from "react-router-dom";
import Service from "../../services/Http.js";


export default function EditCategory() {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});
    const { categoryId } = useParams();

    const [categoryData, setCategoryData] = useState({
        name: "",
        image: null,
    });

    const fetchCategoryData = async () => {
        try {
            const services = new Service();

            const response = await services.get(
                `/admin/categoryById/${categoryId}`,
                {}, 
                true,
            );

            if (response?.status) {
                setCategoryData(response?.data || {});
            } else {
                errorToastr(response?.message || "Failed to fetch category data");

                setCategoryData({});
            }
        } catch (error) {
            console.error("FETCH CATEGORY BY ID ERROR:", error);

            errorToastr(error?.message || "Failed to fetch category data");

            setCategoryData({});
        }
    };

    // ✅ Validation logic
    const validateForm = (formData) => {
        const errors = {};
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        const name = formData.get("name")?.trim();
        if (!name || name.length < 3) errors.name = "Name must be at least 3 characters long.";
        else if (name.length > 50) errors.name = "Name cannot exceed 50 characters.";

        // ✅ Image validations
        const image = formData.get("image");

        if (image && image.size > 0) {
            if (!allowedImageTypes.includes(image.type)) errors.image = "Invalid image format. Only JPG, PNG, or WEBP allowed.";
            else if (image.size > 2 * 1024 * 1024) errors.image = "Image size must not exceed 2MB.";
        }

        setFormErrors(errors);
        return errors;
    };
    // Handle form submit
    const handleSubmitting = async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);
        const errors = validateForm(form);

        // ❌ Stop if errors exist and show toast
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            errorToastr(firstError);
            return;
        }
        form.append("id", categoryId);
        try {
            const services = new Service();
            const response = await services.post("/admin/category/editCategory", form, true);
            if (response?.status) {
                successToastr(response.message || "Category updated successfully!");
                navigate("/category", { replace: true });
            } else {
                errorToastr(response?.message || "Failed to update category");
            }


            /* const request = new HttpClient({
                url: "/admin/category/editCategory",
                auth: true,
                data: form,
                headers: { "Content-Type": "multipart/form-data" },
            }); */

            /* const { data } = await request.post();

            if (data?.status) {
                successToastr(data.message || "Category created successfully!");
                navigate("/category", { replace: true });
            } */
        } catch (error) {
            errorToastr(error.message || "Something went wrong.");
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, []);
    
    return (
        <AuthenticatedLayout title="Edit Category">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round">
                        <div className="card-header">
                            <h1 className="text-center">
                                <b>Edit Category</b>
                            </h1>
                        </div>
                        <form onSubmit={handleSubmitting}>
                            <div className="card-body">
                                {/* Name */}
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={categoryData?.name || ""}
                                        onChange={(e) => setCategoryData((prev) => ({ ...prev, name: e.target.value }))}
                                    />
                                </div>

                                {/* Team Images */}
                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <input type="file" name="image" className="form-control" accept="image/*" />
                                    {categoryData?.image && (
                                        <img
                                            // src={categoryData.image}
                                            src={`${import.meta.env.VITE_STATIC_URL}/public/category/${categoryData.image}`}
                                            alt="Category"
                                            style={{ width: 100, marginTop: 10 }}
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <button type="submit" className="btn btn-primary w-100">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
