import axios from "axios";
import { errorToastr } from "./toastr";
const apiBaseUrl = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = apiBaseUrl;
axios.defaults.headers.post["Accept"] = "application/json";

function getToken() {
    let data = localStorage.getItem("user"),
        parsed = JSON.parse(data);

    return parsed.tokens.accessToken;
}

export class HttpClient {
    url;
    auth;
    data;
    token;

    constructor({ url, data, auth }) {
        this.url = url;
        this.auth = auth;
        this.data = data;
        this.token = auth ? getToken() : "";
    }

    async get() {
        try {
            return await axios.get(this.url, {
                params: this.data,
                headers: {
                    Authorization: `Bearer ${this.auth ? this.token : ""}`,
                },
            });
        } catch (error) {
            console.error("Fetching Error", error.status);

            if (error.status === 401) {
                localStorage.removeItem("user");
                errorToastr("Shit! Token expired!!");
                window.location.href = "/";
            }

            if(error?.response?.data.message?.message) errorToastr(error?.response?.data.message?.message);

            return {};
        }
    }

    async post() {
        try {
            return await axios.post(this.url, this.data, {
                headers: {
                    Authorization: `Bearer ${this.auth ? this.token : ""}`,
                },
            });
        } catch (error) {
            if (error.status === 401) {
                localStorage.removeItem("user");
                errorToastr("Shit! Token expired!!");
                window.location.href = "/";
            }

            if(error?.response?.data.message?.message) errorToastr(error?.response?.data.message?.message);

            return error;
        }
    }

    async patch() {
        try {
            return await axios.patch(this.url, this.data, {
                headers: {
                    Authorization: `Bearer ${this.auth ? this.token : ""}`,
                },
            });
        } catch (error) {
            if (error.status === 401) {
                localStorage.removeItem("user");
                errorToastr("Shit! Token expired!!");
                window.location.href = "/";
            }

            if(error?.response?.data.message?.message) errorToastr(error?.response?.data.message?.message);

            return error;
        }
    }
}
