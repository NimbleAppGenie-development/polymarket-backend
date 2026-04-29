import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HttpClient } from "../../utils/request.js";
import { errorToastr, successToastr } from "../../utils/toastr.js";
import Service from "../../services/Http.js";


export default function ContentEditor({ dbContent, pageId, formObject }) {
    const [content, setContent] = useState([]);
    const navigation = useNavigate();

    // Parse DB string on mount / when dbContent changes
    useEffect(() => {
        if (!dbContent) return;
        try {
            const parsed = JSON.parse(dbContent);
            setContent(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (err) {
            console.error("❌ Invalid JSON from DB:", err);
            setContent([]);
        }
    }, [dbContent]);

    const handleHeadingChange = (sectionIndex, newHeading) => {
        const updated = [...content];
        updated[sectionIndex].heading = newHeading;
        setContent(updated);
    };

    const handleRowChange = (sectionIndex, rowIndex, field, value, nestedKey = null) => {
        const updated = [...content];
        if (nestedKey) {
            updated[sectionIndex].data[rowIndex][nestedKey][0][field] = value;
        } else {
            updated[sectionIndex].data[rowIndex][field] = value;
        }
        setContent(updated);
    };

    const addRow = (sectionIndex) => {
        const updated = [...content];
        const firstRow = updated[sectionIndex].data?.[0];

        if (!firstRow) {
            updated[sectionIndex].data.push({ key: "", value: "" });
        } else if (typeof Object.values(firstRow)[0] === "string") {
            const newRow = {};
            Object.keys(firstRow).forEach((k) => (newRow[k] = ""));
            updated[sectionIndex].data.push(newRow);
        } else {
            const nestedKey = Object.keys(firstRow)[0];
            updated[sectionIndex].data.push({
                [nestedKey]: [{ Key: "", Value: "" }],
            });
        }

        setContent(updated);
    };

    const addSection = () => {
        setContent([...content, { heading: "New Section", data: [{ key: "", value: "" }] }]);
    };

    // ✅ Save directly to DB
    const handleSave = async () => {
        try {
            const services = new Service();

            const jsonString = JSON.stringify(content);

            const payload = {
                id: formObject?.id || formObject,

                content: jsonString,
            };

            const response = await services.post("/admin/updatePageById", payload, true);

            if (response?.status) {
                successToastr(response?.message || "Page updated successfully");

                navigation("/pages", {
                    replace: true,
                });
            } else {
                errorToastr(response?.message || "Failed to update page");
            }
        } catch (error) {
            console.error("UPDATE PAGE ERROR:", error);

            errorToastr(error?.message || "Failed to update page");
        }
    };

    return (
        <div>
            {content.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4 border p-3 rounded">
                    {/* Heading */}
                    <div className="mb-3">
                        <label className="form-label">Section Heading</label>
                        <input
                            type="text"
                            className="form-control"
                            value={section.heading || ""}
                            onChange={(e) => handleHeadingChange(sectionIndex, e.target.value)}
                        />
                    </div>

                    {/* Data Table */}
                    <table className="table">
                        <thead>
                            <tr>{section.data?.length > 0 && Object.keys(section.data[0] || {}).map((field, i) => <th key={i}>{field}</th>)}</tr>
                        </thead>
                        <tbody>
                            {section.data?.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Object.keys(row).map((field, i) => {
                                        const value = row[field];
                                        if (typeof value === "string") {
                                            return (
                                                <td key={i}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={value}
                                                        onChange={(e) => handleRowChange(sectionIndex, rowIndex, field, e.target.value)}
                                                    />
                                                </td>
                                            );
                                        } else if (Array.isArray(value)) {
                                            return (
                                                <td key={i}>
                                                    {value.map((obj, idx) => (
                                                        <div key={idx} className="d-flex gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Key"
                                                                value={obj.Key || ""}
                                                                onChange={(e) =>
                                                                    handleRowChange(sectionIndex, rowIndex, "Key", e.target.value, field)
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Value"
                                                                value={obj.Value || ""}
                                                                onChange={(e) =>
                                                                    handleRowChange(sectionIndex, rowIndex, "Value", e.target.value, field)
                                                                }
                                                            />
                                                        </div>
                                                    ))}
                                                </td>
                                            );
                                        }
                                        return null;
                                    })}
                                </tr>
                            ))}
                            <tr>
                                <td colSpan="100%">
                                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => addRow(sectionIndex)}>
                                        + Add Row
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ))}

            {/* Add new section */}
            <button type="button" className="btn btn-sm btn-outline-success me-2" onClick={addSection}>
                + Add Section
            </button>

            {/* Save button */}
            <button type="button" className="btn btn-sm btn-primary" onClick={handleSave}>
                Save
            </button>
        </div>
    );
}
