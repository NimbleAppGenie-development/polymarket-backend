import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout.jsx";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";
import { useEffect, useState } from "react";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import { HttpClient } from "../../utils/request.js";
import { useNavigate, useParams } from "react-router-dom";
import { error } from "toastr";
import ContentEditor from "./ContentEditor.jsx";
import Service from "../../services/Http.js";

export default function PageEdit() {
    const navigation = useNavigate();

    const { pageId } = useParams();
    const [PageData, setPageData] = useState({
        slug: "",
        content: "",
    });

    const fetchPageData = async () => {
        try {
            const services = new Service();
            const response = await services.get(`/admin/getPageById/${pageId}`, {}, true);
            if (!response?.status) {
                errorToastr(response?.message || "Failed to fetch page data");
                return;
            } else {
                const page = response?.data || {};
                setPageData({
                    ...page,
                    content: Array.isArray(page.description) ? page.description : [page.description],
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmitting = async (event) => {
        event.preventDefault();
        const form = new FormData(event.target);

        const formObject = {
            id: pageId,
            slug: form.get("slug"),
            description: form.get("description"),
            title: form.get("title"),
            content: JSON.stringify(PageData.content), 
        };

        try {
            const services = new Service();
            const response = await services.post(`/admin/updatePageById`, formObject, true);
            navigation("/pages")
            if (!response?.status) {
                errorToastr(response?.message || "Failed to update page");
                return;
            } else {
                successToastr(response?.message || "Page updated successfully");
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPageData()
    }, []);

    return ["how-to-play", "help-support", "responsible-play"].includes(PageData?.slug) ? (
        <AuthenticatedLayout title="Update Page">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round">
                        <div className="card-header">
                            <h1 className="text-center">Update Page</h1>
                        </div>
                        <div className="card-body">
                            <ContentEditor
                                dbContent={Array.isArray(PageData.content) ? PageData.content : [PageData.content]}
                                formObject={pageId}
                                onSave={(newContent) => setPageData((prev) => ({ ...prev, content: newContent }))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    ) : (
        <AuthenticatedLayout title="Update Page">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card card-round">
                        <div className="card-header">
                            <h1 className="text-center">Update Page</h1>
                        </div>
                        <form onSubmit={(event) => handleSubmitting(event)}>
                            <div className="card-body">
                                <div className="mb-3">
                                    <label htmlFor="page-slug" className="form-label">
                                        Slug
                                    </label>
                                    <input
                                        type="text"
                                        onChange={(e) => setPageData((prev) => ({ ...prev, slug: e.target.value }))}
                                        className="form-control"
                                        name="slug"
                                        id="page-slug"
                                        value={PageData?.slug || ""}
                                        placeholder="Enter slug of page"
                                        aria-label="email"
                                        aria-describedby="emailHelp"
                                    />
                                    <div id="emailHelp" className="form-text"></div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="page-description" className="form-label">
                                        Description
                                    </label>
                                    <textarea
                                        className="form-control"
                                        type="text"
                                        name="description"
                                        id="page-description"
                                        value={PageData?.description || ""}
                                        onChange={(e) => setPageData((prev) => ({ ...prev, description: e.target.value }))}
                                        placeholder="Enter description of page"
                                        aria-label="email"
                                        aria-describedby="emailHelp"
                                    ></textarea>
                                    <div id="emailHelp" className="form-text"></div>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="page-title" className="form-label">
                                        Title
                                    </label>
                                    <textarea
                                        className="form-control"
                                        type="text"
                                        name="title"
                                        id="page-title"
                                        value={PageData?.title || ""}
                                        onChange={(e) => setPageData((prev) => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter title of page"
                                        aria-label="email"
                                        aria-describedby="emailHelp"
                                    ></textarea>
                                    <div id="emailHelp" className="form-text"></div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-grid gap-2">
                                    <button className="btn btn-primary" type="submit">
                                        Update
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
