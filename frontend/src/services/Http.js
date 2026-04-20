// Function to safely join base URL and endpoint URL

function joinUrl(baseUrl, url) {
    if (baseUrl.endsWith("/") && url.startsWith("/")) {
        return baseUrl + url.slice(1);
    }

    if (!baseUrl.endsWith("/") && !url.startsWith("/")) {
        return baseUrl + "/" + url;
    }

    return baseUrl + url;
}


class Service {
    constructor() {
        this.domain = import.meta.env.VITE_API_URL;
    }


    async request(url, method = "POST", data = null, includeAuthorization = true) {
        url = joinUrl(this.domain, url);

        let headers = {
            Accept: "application/json",
        };

        let token = null;

        try {
            const user = JSON.parse(localStorage.getItem("user"));
            token = user?.tokens?.accessToken;
        } catch {
            token = localStorage.getItem("token");
        }

        if (includeAuthorization && token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const isFormData = data instanceof FormData;

        let hasFile = false;

        if (!isFormData && data && typeof data === "object") {
            for (const v of Object.values(data)) {
                if (v instanceof File || v instanceof Blob) {
                    hasFile = true;
                    break;
                }
            }
        }

        if (!isFormData && !hasFile && data) {
            headers["Content-Type"] = "application/json";
        }

        const options = {
            method,
            headers,
        };

        if (data) {
            if (isFormData) {
                options.body = data;
            } else if (hasFile) {
                const formData = new FormData();

                Object.entries(data).forEach(([key, value]) => {
                    if (value === undefined || value === null) return;

                    if (Array.isArray(value)) {
                        value.forEach((v) => formData.append(key, v));
                    } else {
                        formData.append(key, value);
                    }
                });

                options.body = formData;
            } else {
                options.body = JSON.stringify(data);
            }
        }

        try {
            const res = await fetch(url, options);

            let responseData = {};

            try {
                responseData = await res.json();
            } catch {
                responseData = {
                    message: "Invalid JSON response",
                };
            }

            // Handle Unauthorized

            if (res.status === 401) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");

                window.location.href = "/";

                throw responseData;
            }

            if (!res.ok) {
                throw responseData;
            }

            return responseData;
        } catch (error) {
            console.error("REQUEST FAILED:", error);

            throw error;
        }
    }

    // GET method

    async get(url, params = {}, includeAuthorization = true) {
        const queryString = params && Object.keys(params).length ? "?" + new URLSearchParams(params).toString() : "";

        const fullUrl = url + queryString;

        return await this.request(fullUrl, "GET", null, includeAuthorization);
    }

    // POST method

    async post(url, data, includeAuthorization = true) {
        return await this.request(url, "POST", data, includeAuthorization);
    }

    // PUT method

    async put(url, data, includeAuthorization = true) {
        return await this.request(url, "PUT", data, includeAuthorization);
    }

    // PATCH method

    async patch(url, data, includeAuthorization = true) {
        return await this.request(url, "PATCH", data, includeAuthorization);
    }

    // DELETE method

    async delete(url, data = null, includeAuthorization = true) {
        return await this.request(url, "DELETE", data, includeAuthorization);
    }
}

// Export class

export default Service;