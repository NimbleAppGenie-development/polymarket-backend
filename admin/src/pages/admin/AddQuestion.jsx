import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import "react-range-slider-input/dist/style.css";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { HttpClient } from "../../utils/request.js";
import { useNavigate } from "react-router";
import Service from "../../services/Http.js";

export default function CreateQuestion() {
    const navigate = useNavigate();

    const [formErrors, setFormErrors] = useState({});
    const [filteredCategory, setFilteredCategory] = useState([]); // shown in dropdown
    const [firstCategoryId, setFirstCategoryId] = useState("");
    const [options, setOptions] = useState([
        { option: "", multiplier: "" },
        { option: "", multiplier: "" },
    ]);

    const addOption = () => {
        setOptions([...options, { option: "", multiplier: "" }]);
    };

    const removeOption = (index) => {
        if (options.length <= 2) return;

        const updated = options.filter((_, i) => i !== index);
        setOptions(updated);
    };

    const handleOptionChange = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);
    };

    const validateForm = (formData) => {
        const errors = {};
        const categoryId = formData.get("categoryId");
        const question = formData.get("question");
        const description = formData.get("description");

        if (!categoryId) errors.categoryId = "Match ID is required";
        if (!question || question.length < 3) errors.question = "Question must be at least 3 characters";
        if (!description || description.length < 3) errors.description = "Description must be at least 3 characters";
        if (options.length < 2) {
            errors.options = "Minimum 2 options required";
        }
        options.forEach((opt, i) => {
            if (!opt.option?.trim()) {
                errors[`option_${i}`] = "Option required";
            }

            if (!opt.multiplier || Number(opt.multiplier) <= 0) {
                errors[`multiplier_${i}`] = "Valid multiplier required";
            }
        });

        setFormErrors(errors);
        return errors;
    };

    // Fetch all matches (live + pre)
    const fetchCategory = async (page = 1, limit = 10, search = "", dateRange = "", filter = "All") => {
        try {
            const services = new Service();

            const params = {
                page,
                limit,

                ...(search && { search }),

                ...(dateRange && { dateRange }),

                ...(filter && filter !== "All" && { filter }),
            };

            const response = await services.get("/admin/category", params, true);

            if (response?.status) {
                const categoryData = response?.data?.allCategory || [];

                setFilteredCategory(categoryData);

                // First category id safely
                setFirstCategoryId(categoryData?.[0]?.categoryId || "");
            }
        } catch (error) {
            console.error("FETCH CATEGORY ERROR:", error);
        }
    };

    // Submit form
    const handleSubmitting = async (event) => {
        event.preventDefault();

        const form = new FormData(event.target);

        const errors = validateForm(form);

        // Stop if validation errors exist
        if (Object.keys(errors).length > 0) {
            errorToastr("Please fix the errors in the form");

            return;
        }

        // Convert FormData → JSON object
        const formObject = {
            categoryId: form.get("categoryId"),

            question: form.get("question"),

            description: form.get("description"),

            options: options,
        };

        try {
            const services = new Service();

            const response = await services.post("/admin/question/add", formObject, true);

            if (response?.status) {
                successToastr(response.message || "Question added successfully");

                navigate("/questions", {
                    replace: true,
                });
            } else {
                errorToastr(response?.message || "Failed to add question");
            }
        } catch (error) {
            errorToastr(error?.message || "Something went wrong");
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    return (
        <AuthenticatedLayout title="Create Question">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round">
                        <div className="card-header">
                            <h1 className="text-center">
                                <b>Create Question</b>
                            </h1>
                        </div>
                        <form onSubmit={handleSubmitting}>
                            <div className="card-body">
                                {/* Category SELECT (filtered dynamically) */}
                                <div className="mb-3">
                                    <label htmlFor="categoryId" className="form-label">
                                        Select Category
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-control"
                                        value={firstCategoryId || ""}
                                        onChange={(e) => setFirstCategoryId(e.target.value)}
                                        required
                                    >
                                        {filteredCategory.length === 0 && <option value="">No Category available</option>}
                                        {filteredCategory.map(
                                            (item, key) =>
                                                item.status && (
                                                    <option key={key} value={item.categoryId}>
                                                        {item.name}
                                                    </option>
                                                ),
                                        )}
                                    </select>
                                    {formErrors.categoryId && <div className="invalid-feedback">{formErrors.categoryId}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="question" className="form-label">
                                        Question
                                    </label>
                                    <input type="text" className="form-control" name="question" required autoComplete="off" maxLength={100} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description
                                    </label>
                                    <input type="text" className="form-control" name="description" required maxLength={100} />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Options</label>

                                    {options.map((opt, index) => (
                                        <div key={index} className="d-flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                placeholder="Option"
                                                className="form-control"
                                                value={opt.option}
                                                onChange={(e) => handleOptionChange(index, "option", e.target.value)}
                                            />

                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Multiplier"
                                                className="form-control"
                                                min={0}
                                                value={opt.multiplier}
                                                onChange={(e) => handleOptionChange(index, "multiplier", e.target.value)}
                                            />

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => removeOption(index)}
                                                disabled={options.length <= 2}
                                            >
                                                ❌
                                            </button>
                                            {formErrors.options && <div className="text-danger">{formErrors.options}</div>}
                                        </div>
                                    ))}

                                    <button type="button" className="btn btn-success mt-2" onClick={addOption}>
                                        + Add Option
                                    </button>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
