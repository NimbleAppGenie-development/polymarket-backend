import { useEffect, useState } from "react";
import { AuthenticatedLayout } from "../../layout/AuthenticatedLayout";
import { HttpClient } from "../../utils/request";
import { dateFormatter } from "../../utils/helper";
import { Link } from "react-router";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import ReferTextEditor from "./ReferTextEditor.jsx";
import Service from "../../services/Http.js";


export default function Pages() {
    const [pagesData, setPagesData] = useState([]);

    const fetchPages = async () => {

        try {
            const services = new Service();
            const response = await services.get("/admin/pages", {}, true);
            if (!response?.status) {
                errorToastr(response?.message || "Failed to fetch pages data");
                return;
            } else {
                setPagesData(response?.data || []);
            }
        } catch (error) {
            console.error(error);
            errorToastr(error);
        }
    };

    useEffect(() => {
        fetchPages()
    }, []);

    return (
        <AuthenticatedLayout title="Pages">
            <div className="row">
                <div className="col-md-12">
                    <div className="card card-round">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Title</th>
                                            <th>Slug</th>
                                            <th style={{ width: "1000px" }}>Description</th>
                                            <th>Created At</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagesData.map((item, key) => (
                                            <tr key={key}>
                                                <td>{key + 1}</td>
                                                <td>{item.title}</td>
                                                <td>{item.slug}</td>
                                                {item.slug == "help-support" ||
                                                item.slug == "how-to-play" ||
                                                item.slug == "responsible-play" ||
                                                item.slug == "refer-text" ? (
                                                    <td>JSON Data</td>
                                                ) : (
                                                    <td>{item.description ?? "N/A"}</td>
                                                )}
                                                <td>{dateFormatter(item.createdAt, "perfectDateTime")}</td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button
                                                            className="btn btn-sm dropdown-toggle"
                                                            type="button"
                                                            data-bs-toggle="dropdown"
                                                            aria-expanded="false"
                                                        >
                                                            <i className="fa fa-bars" aria-hidden="true"></i>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                {item.slug == "refer-text" ? (
                                                                    <Link to={`/referTextEditor/${item.id}`} className="dropdown-item">
                                                                        Edit
                                                                    </Link>
                                                                ) : (
                                                                    <Link to={`/pages/${item.id}`} className="dropdown-item">
                                                                        Edit
                                                                    </Link>
                                                                )}
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
