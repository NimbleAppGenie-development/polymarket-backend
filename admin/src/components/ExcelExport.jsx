import { HttpClient } from "../utils/request";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

export default async function excelExport({ url, query, filename }) {
    let file = filename ?? `download-${new Date().toISOString()}`;

    let client = new HttpClient({
        url: url,
        data: query,
        auth: true,
    });

    let { data } = await client.get();

    let { emails } = data.data;

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
}
