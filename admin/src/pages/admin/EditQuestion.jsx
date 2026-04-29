import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { HttpClient } from "../../utils/request.js";
import { useNavigate, useParams } from "react-router-dom";
import Service from "../../services/Http.js";

export default function QuestionEdit() {
    const navigate = useNavigate();
    const { questionId } = useParams();

    const [QuestionData, setQuestionData] = useState({
        categoryId: "",
        question: "",
        description: "",
        marketRules: "",
        eventStartDate: "",
        eventEndDate: "",
    });
    const [options, setOptions] = useState([
        { option: "", multiplier: "", image: "" },
        { option: "", multiplier: "", image: "" },
    ]);
    const [allCategory, setAllCategory] = useState([]);
    const [firstCategoryId, setFirstCategoryId] = useState("");
    const addOption = () => {
        setOptions([...options, { option: "", multiplier: "", image: "" }]);
    };
    const [formErrors, setFormErrors] = useState({});

    const formatToLocalInput = (utcDate) => {
        if (!utcDate) return "";

        const date = new Date(utcDate);

        const pad = (n) => String(n).padStart(2, "0");

        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes())
        );
    };

    const validateForm = () => {
        const errors = {};

        if (!QuestionData.categoryId) {
            errors.categoryId = "Category is required";
        }

        if (!QuestionData.question?.trim()) {
            errors.question = "Question required";
        }

        if (!QuestionData.description?.trim()) {
            errors.description = "Description required";
        }

        if (!QuestionData.marketRules?.trim()) {
            errors.marketRules = "Market rules required";
        }

        if (!options || options.length < 2) {
            errors.options = "Minimum 2 options required";
        }

        if (!QuestionData.eventStartDate) {
            errors.eventStartDate = "Event start date is required";
        }

        if (!QuestionData.eventEndDate) {
            errors.eventEndDate = "Event end date is required";
        }

        options.forEach((opt, i) => {
            if (!opt.option?.trim()) {
                errors[`option_${i}`] = "Option required";
            }

            if (!opt.multiplier || Number(opt.multiplier) <= 0) {
                errors[`multiplier_${i}`] = "Valid multiplier required";
            }

            /* const hasImage = (typeof opt.image === "string" && opt.image.trim() !== "") || opt.image instanceof File;

            if (!hasImage) {
                errors[`image_${i}`] = "Image is required";
            } */
        });

        return errors;
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
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const handleFileChange = (index, file) => {
        if (!file) return;

        if (!allowedTypes.includes(file.type)) {
            errorToastr("Only JPG, PNG, WEBP images are allowed");

            const updated = [...options];
            updated[index].image = "";
            setOptions(updated);
            return;
        }

        const updated = [...options];
        updated[index].image = file;
        setOptions(updated);
    };

    // Fetch matches
    const fetchCategory = async () => {
        try {
            const services = new Service();
            const response = await services.get("/admin/category", {}, true);

            if (response?.status) {
                const categoryData = response?.data?.allCategory || [];
                setAllCategory(categoryData);
                setFirstCategoryId(categoryData[0]?.categoryId || "");
                return categoryData;
            } else {
                errorToastr(response?.message?.message || "Failed to fetch Category");
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const fetchQuestion = async (categoryParam = null) => {
        try {
            const services = new Service();

            const response = await services.get(`/admin/questionById/${questionId}`, {}, true);

            if (!response?.status) {
                errorToastr(response?.message?.message || "Failed to fetch question");
                return;
            }

            const question = response?.data || {};

            setQuestionData({
                categoryId: question.categoryId,
                question: question.question,
                description: question.description,
                marketRules: question.marketRules,
                eventStartDate: formatToLocalInput(question.eventStartDate),
                eventEndDate: formatToLocalInput(question.eventEndDate),
            });

            const matchesToUse = Array.isArray(categoryParam) ? categoryParam : allCategory;

            if (matchesToUse?.length > 0) {
                const found = matchesToUse.find((c) => c.categoryId === question.categoryId);

                setFirstCategoryId(found?.categoryId || question.categoryId || "");
            }

            if (Array.isArray(question.options) && question.options.length > 0) {
                setOptions(
                    question.options.map((opt) => ({
                        option: opt.option,
                        multiplier: opt.multiplier,
                        image: opt.image,
                    })),
                );
            } else {
                setOptions([
                    { option: "", multiplier: "", image: "" },
                    { option: "", multiplier: "", image: "" },
                ]);
            }
        } catch (error) {
            console.error("FETCH QUESTION ERROR:", error);
        }
    };

    //Submit handler
    const handleSubmitting = async (event) => {
        event.preventDefault();

        const errors = validateForm();

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            errorToastr("Please fix validation errors");
            return;
        }
        for (let i = 0; i < options.length; i++) {
            const opt = options[i];

            if (opt.image instanceof File) {
                if (!allowedTypes.includes(opt.image.type)) {
                    errorToastr(`Invalid image at option ${i + 1}`);
                    return;
                }
            }
        }

        const formData = new FormData();

        formData.append("id", questionId);
        formData.append("categoryId", QuestionData.categoryId);
        formData.append("question", QuestionData.question);
        formData.append("description", QuestionData.description);
        formData.append("marketRules", QuestionData.marketRules);
        formData.append("eventStartDate", QuestionData.eventStartDate);
        formData.append("eventEndDate", QuestionData.eventEndDate);

        formData.append("options", JSON.stringify(options));

        options.forEach((opt, index) => {
            if (opt.image instanceof File) {
                formData.append("optionImages", opt.image);
                formData.append("imageIndexes", index);
            }
        });

        try {
            const services = new Service();
            const response = await services.post("/admin/question/edit", formData, true);

            if (response?.status) {
                successToastr("Question updated successfully");
                navigate("/questions", { replace: true });
            } else {
                errorToastr(response?.message || "Failed");
            }
        } catch (error) {
            errorToastr(error.message);
        }
    };

    useEffect(() => {
        (async () => {
            const matches = await fetchCategory();
            await fetchQuestion(matches);
        })();
    }, [questionId]);

    return (
        <AuthenticatedLayout title="Edit Question">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round">
                        <div className="card-header">
                            <h1 className="text-center">
                                <b>Edit Question</b>
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
                                        onChange={(e) => {
                                            setFirstCategoryId(e.target.value);
                                            setQuestionData((prev) => ({ ...prev, categoryId: e.target.value }));
                                        }}
                                        value={QuestionData?.categoryId || firstCategoryId || ""}
                                        required
                                    >
                                        {allCategory.length === 0 && (
                                            <option value="" disabled>
                                                No ctegory available for selected type
                                            </option>
                                        )}

                                        {allCategory.map(
                                            (item, key) =>
                                                item.status && (
                                                    <option key={key} value={item.categoryId}>
                                                        {item.name}
                                                    </option>
                                                ),
                                        )}
                                    </select>
                                </div>

                                {/* Question Input */}
                                <div className="mb-3">
                                    <label htmlFor="question" className="form-label">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        onChange={(e) => setQuestionData((prev) => ({ ...prev, question: e.target.value }))}
                                        name="question"
                                        id="question"
                                        placeholder="Enter question"
                                        value={QuestionData?.question || ""}
                                        minLength="3"
                                        required
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        id="description"
                                        onChange={(e) => setQuestionData((prev) => ({ ...prev, description: e.target.value }))}
                                        value={QuestionData?.description || ""}
                                        placeholder="Enter description"
                                        minLength="3"
                                        required
                                    />
                                </div>
                                {/* Market Rules */}
                                <div className="mb-3">
                                    <label htmlFor="marketRules" className="form-label">
                                        Market Rules
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="marketRules"
                                        id="marketRules"
                                        onChange={(e) => setQuestionData((prev) => ({ ...prev, marketRules: e.target.value }))}
                                        value={QuestionData?.marketRules || ""}
                                        placeholder="Enter marketRules"
                                        minLength="3"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="eventStartDate" className="form-label">
                                        Event Start Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="eventStartDate"
                                        id="eventStartDate"
                                        onChange={(e) => setQuestionData((prev) => ({ ...prev, eventStartDate: e.target.value }))}
                                        value={QuestionData?.eventStartDate || ""}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="eventEndDate" className="form-label">
                                        Event End Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="form-control"
                                        name="eventEndDate"
                                        id="eventEndDate"
                                        onChange={(e) => setQuestionData((prev) => ({ ...prev, eventEndDate: e.target.value }))}
                                        value={QuestionData?.eventEndDate || ""}
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Options</label>

                                {options.map((opt, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex gap-2 align-items-center">
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                onChange={(e) => handleFileChange(index, e.target.files[0])}
                                            />

                                            {/* SHOW EXISTING IMAGE */}
                                            {typeof opt.image === "string" && opt.image && (
                                                <img
                                                    src={`${import.meta.env.VITE_STATIC_URL}/public/question/${opt.image}`}
                                                    width="40"
                                                    height="40"
                                                    style={{ objectFit: "cover", borderRadius: "6px" }}
                                                />
                                            )}

                                            {/* SHOW NEW SELECTED IMAGE PREVIEW */}
                                            {opt.image instanceof File && (
                                                <img
                                                    src={URL.createObjectURL(opt.image)}
                                                    width="40"
                                                    height="40"
                                                    style={{ objectFit: "cover", borderRadius: "6px" }}
                                                />
                                            )}

                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Option"
                                                value={opt.option}
                                                onChange={(e) => handleOptionChange(index, "option", e.target.value)}
                                            />

                                            <input
                                                type="number"
                                                step="0.01"
                                                className="form-control"
                                                placeholder="Multiplier"
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
                                        <div className="mt-1">
                                            {formErrors[`option_${index}`] && <div className="text-danger">{formErrors[`option_${index}`]}</div>}

                                            {formErrors[`multiplier_${index}`] && (
                                                <div className="text-danger">{formErrors[`multiplier_${index}`]}</div>
                                            )}

                                            {formErrors[`image_${index}`] && <div className="text-danger">{formErrors[`image_${index}`]}</div>}
                                        </div>
                                    </div>
                                ))}

                                <button type="button" className="btn btn-success mt-2" onClick={addOption}>
                                    + Add Option
                                </button>
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
