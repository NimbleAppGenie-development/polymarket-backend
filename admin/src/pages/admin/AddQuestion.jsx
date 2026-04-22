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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [options, setOptions] = useState([
        { option: "", multiplier: "", image: null },
        { option: "", multiplier: "", image: null },
    ]);

    const addOption = () => {
        setOptions([...options, { option: "", multiplier: "", image: null }]);
    };

    const removeOption = (index) => {
        if (options.length <= 2) return;

        const updated = options.filter((_, i) => i !== index);
        setOptions(updated);
    };

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const handleFileChange = (index, file) => {
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            errorToastr("Only JPG, PNG, WEBP images are allowed");

            const updated = [...options];
            updated[index].image = null;
            setOptions(updated);
            return;
        }

        const updated = [...options];
        updated[index].image = file;
        setOptions(updated);
    };

    const handleOptionChange = (index, field, value) => {
        const updated = [...options];
        updated[index][field] = value;
        setOptions(updated);
    };

    const validateForm = (formData, optionsData) => {
        const errors = {};

        const categoryId = formData.get("categoryId");
        const question = formData.get("question");
        const description = formData.get("description");
        const marketRules = formData.get("marketRules");

        if (!categoryId) errors.categoryId = "Match ID is required";
        if (!question || question.length < 3) errors.question = "Question must be at least 3 characters";
        if (!description || description.length < 3) errors.description = "Description must be at least 3 characters";
        if (!marketRules || marketRules.length < 3) errors.marketRules = "Market Rules must be at least 3 characters";

        if (!optionsData || optionsData.length < 2) {
            errors.options = "Minimum 2 options required";
        }

        optionsData.forEach((opt, i) => {
            if (!opt.option?.trim()) {
                errors[`option_${i}`] = "Option required";
            }

            if (!opt.multiplier || Number(opt.multiplier) <= 0) {
                errors[`multiplier_${i}`] = "Valid multiplier required";
            }

            if (!opt.image) {
                errors[`image_${i}`] = "Image is required";
            }
        });

        setFormErrors(errors);
        return errors;
    };

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

                setFirstCategoryId(categoryData?.[0]?.categoryId || "");
            }
        } catch (error) {
            console.error("FETCH CATEGORY ERROR:", error);
        }
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    const handleSubmitting = async (event) => {
        event.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);
        const form = new FormData(event.target);

        const errors = validateForm(form, options);

        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            errorToastr(firstError);

            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();

        formData.append("categoryId", form.get("categoryId"));
        formData.append("question", form.get("question"));
        formData.append("description", form.get("description"));
        formData.append("marketRules", form.get("marketRules"));

        const cleanOptions = options.map((opt) => ({
            option: opt.option,
            multiplier: opt.multiplier,
            hasImage: !!opt.image,
        }));

        formData.append("options", JSON.stringify(cleanOptions));

        options.forEach((opt) => {
            if (opt.image) {
                formData.append("optionImages", opt.image);
            }
        });
        formData.append("eventStartDate", form.get("eventStartDate"));
        formData.append("eventEndDate", form.get("eventEndDate"));
        try {
            const services = new Service();

            const response = await services.post("/admin/question/add", formData, true, true);

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
                                <div className="mb-3">
                                    <label htmlFor="categoryId" className="form-label">
                                        Select Category
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-control"
                                        // value={firstCategoryId || ""}
                                        // onChange={(e) => setFirstCategoryId(e.target.value)}
                                        defaultValue={firstCategoryId}
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
                                    <input type="text" className="form-control" name="description" required maxLength={1500} />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="marketRules" className="form-label">
                                        Market Rules
                                    </label>
                                    <textarea
                                        className="form-control"
                                        name="marketRules"
                                        id="marketRules"
                                        rows="4"
                                        maxLength={5000}
                                        placeholder="Enter market rules"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="eventStartDate" className="form-label">
                                        Event Start Date & Time
                                    </label>
                                    <input type="datetime-local" className="form-control" name="eventStartDate" min={getCurrentDateTime()} required />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="eventEndDate" className="form-label">
                                        Event End Date & Time
                                    </label>
                                    <input type="datetime-local" className="form-control" name="eventEndDate" min={getCurrentDateTime()} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Options</label>

                                    {options.map((opt, index) => (
                                        <div key={index} className="d-flex gap-2 mb-2 flex-column">
                                            <div className="d-flex gap-2">
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    accept=".jpg,.jpeg,.png,.webp"
                                                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                                                />

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
                                            </div>

                                            {formErrors[`option_${index}`] && <div className="text-danger">{formErrors[`option_${index}`]}</div>}

                                            {formErrors[`multiplier_${index}`] && (
                                                <div className="text-danger">{formErrors[`multiplier_${index}`]}</div>
                                            )}

                                            {formErrors[`image_${index}`] && <div className="text-danger">{formErrors[`image_${index}`]}</div>}
                                        </div>
                                    ))}

                                    {formErrors.options && <div className="text-danger">{formErrors.options}</div>}

                                    <button type="button" className="btn btn-success mt-2" onClick={addOption}>
                                        + Add Option
                                    </button>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Submitting..." : "Submit"}
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
