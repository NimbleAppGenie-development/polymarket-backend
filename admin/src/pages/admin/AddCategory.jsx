import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { HttpClient } from "../../utils/request.js";
import Service from "../../services/Http.js";
import { useNavigate } from "react-router";

export default function AddCategory() {
    const navigate = useNavigate();
    const [formErrors, setFormErrors] = useState({});

    // Validation logic
    const validateForm = (formData) => {
        const errors = {};
        const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        const name = formData.get("name")?.trim();
        if (!name || name.length < 3) errors.name = "Name must be at least 3 characters long.";
        else if (name.length > 30) errors.name = "Name cannot exceed 30 characters.";

        // Image validations
        const image = formData.get("image");
        if (!image || image.size === 0) errors.image = "Please upload Team A image.";
        else if (!allowedImageTypes.includes(image.type)) errors.image = "Invalid Team A image format. Only JPG, PNG, or WEBP allowed.";
        else if (image.size > 2 * 1024 * 1024) errors.image = "Team A image size must not exceed 2MB.";

        setFormErrors(errors);
        return errors;
    };

    // Handle form submit
    const handleSubmitting = async (event) => {
        event.preventDefault();

        const form = new FormData(event.target);

        const errors = validateForm(form);

        // ❌ Stop if validation errors exist
        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];

            errorToastr(firstError);

            return;
        }

        try {
            const services = new Service();

            const response = await services.post( "/admin/category/addCategory", form,  true, );

            if (response?.status) {
                successToastr(response.message || "Category created successfully!");

                navigate("/category", {
                    replace: true,
                });
            } else {
                errorToastr(response?.message || "Failed to create category");
            }
        } catch (error) {
            console.error("ADD CATEGORY ERROR:", error);

            errorToastr(error?.message || "Something went wrong.");
        }
    };

    return (
        <AuthenticatedLayout title="Create Category">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round">
                        <div className="card-header">
                            <h1 className="text-center">
                                <b>Create Category</b>
                            </h1>
                        </div>
                        <form onSubmit={handleSubmitting}>
                            <div className="card-body">
                                {/* Name */}
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" name="name" className="form-control" />
                                </div>

                                {/* Team Images */}
                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <input type="file" name="image" className="form-control" accept="image/*" />
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
