import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { HttpClient } from "../../utils/request.js";
import { useNavigate, useParams } from "react-router";
import Service from "../../services/Http.js";

export default function QuestionEdit() {
    const navigate = useNavigate();
    const { questionId } = useParams();

    const [QuestionData, setQuestionData] = useState({
        categoryId: "",
        question: "",
        description: "",
    });
    const [options, setOptions] = useState([
        { option: "", multiplier: "" },
        { option: "", multiplier: "" },
    ]);
    const [allCategory, setAllCategory] = useState([]);
    const [firstCategoryId, setFirstCategoryId] = useState("");
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

    // Fetch matches — return the list so caller can immediately use it
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

            // BASIC DATA SET
            setQuestionData({
                categoryId: question.categoryId,
                question: question.question,
                description: question.description,
            });

            // CATEGORY SELECT HANDLING (SIMPLIFIED)
            const matchesToUse = Array.isArray(categoryParam) ? categoryParam : allCategory;

            if (matchesToUse?.length > 0) {
                const found = matchesToUse.find((c) => c.categoryId === question.categoryId);

                setFirstCategoryId(found?.categoryId || question.categoryId || "");
            }

            // IMPORTANT: OPTIONS SET
            if (Array.isArray(question.options) && question.options.length > 0) {
                setOptions(
                    question.options.map((opt) => ({
                        option: opt.option,
                        multiplier: opt.multiplier,
                    })),
                );
            } else {
                // fallback: always minimum 2 options
                setOptions([
                    { option: "", multiplier: "" },
                    { option: "", multiplier: "" },
                ]);
            }
        } catch (error) {
            console.error("FETCH QUESTION ERROR:", error);
        }
    };

    //Submit handler
    const handleSubmitting = async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);

        const formObject = {
            id: questionId,
            categoryId: form.get("categoryId"),
            question: form.get("question"),
            description: form.get("description"),
            options: options,
        };

        try {
            const services = new Service();
            const response = await services.post("/admin/question/edit", formObject, true);
            if (response?.status) {
                successToastr(response?.message || "Question updated successfully");
                navigate("/questions", { replace: true });
            } else {
                errorToastr(response?.message || "Failed to update question");
            }
        } catch (error) {
            errorToastr(error.message);
        }
    };

    //Load matches first, then question (avoid race condition)
    useEffect(() => {
        (async () => {
            const matches = await fetchCategory();
            await fetchQuestion(matches);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                        {/* Show placeholder when no matches */}
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
                                <div className="mb-3">
                                    <label className="form-label">Options</label>

                                    {options.map((opt, index) => (
                                        <div key={index} className="d-flex gap-2 mb-2">
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
