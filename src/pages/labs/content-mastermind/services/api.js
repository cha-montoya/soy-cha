const API_BASE_URL =
    import.meta.env.VITE_CM_API_URL ||
    "http://localhost:8000/api/v1";

    class ApiClient {
    async request(endpoint, options = {}) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error?.message ||
            data?.message ||
            "Request failed"
          );
        }

        return data;
    }

    get(endpoint) {
        return this.request(endpoint);
    }

    post(endpoint, body) {
        return this.request(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
        });
    }

    put(endpoint, body) {
        return this.request(endpoint, {
        method: "PUT",
        body: JSON.stringify(body),
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
        method: "DELETE",
        });
    }
}

const api = new ApiClient();

export default api;