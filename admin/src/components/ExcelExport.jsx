import Service from "../services/Http";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

export default async function excelExport({ url, query, filename }) {
    try {
        const file = filename ?? `download-${new Date().toISOString()}`;

        const services = new Service();

        const response = await services.get(url, query, true);

        if (!response.status || !response.data) {
            throw new Error("Failed to fetch export data");
        }

        const emails = response.data?.data?.emails || [];

        const worksheet = utils.json_to_sheet(emails);
        const workbook = utils.book_new();

        utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const excelBuffer = write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
        });

        saveAs(blob, `${file}.xlsx`);

    } catch (error) {
        console.error("Excel export error:", error);
    }
}