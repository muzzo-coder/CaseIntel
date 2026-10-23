/**
 * CaseIntel Frontend API Client
 * Connects to CaseIntel FastAPI Backend.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

/**
 * Base fetch wrapper with automated headers, token handling, and structured error extraction.
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("legalAI_token");

  const headers = {
    ...options.headers,
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    let data = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (data && data.error) {
        if (data.error.details && data.error.details.length > 0) {
          errorMessage = data.error.details.map((d) => d.message).join(", ");
        } else if (data.error.message) {
          errorMessage = data.error.message;
        }
      } else if (data && data.detail) {
        errorMessage = Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg).join(", ")
          : data.detail;
      } else if (data && data.message) {
        errorMessage = data.message;
      }

      if (
        response.status === 401 &&
        (data?.error?.code === "TOKEN_REVOKED" ||
          data?.error?.code === "TOKEN_EXPIRED" ||
          data?.error?.code === "INVALID_TOKEN" ||
          data?.error?.code === "NOT_AUTHENTICATED")
      ) {
        localStorage.removeItem("legalAI_token");
        localStorage.removeItem("legalAI_user");
        localStorage.removeItem("legalAI_loggedIn");
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register") &&
          !window.location.pathname.startsWith("/reset-password")
        ) {
          window.location.href = "/login";
        }
      }

      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data?.error?.code || "API_ERROR";
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(
        "Unable to connect to CaseIntel backend server. Please verify the backend is running at " +
          API_BASE_URL
      );
    }
    throw err;
  }
}

export const api = {
  auth: {
    register: (userData) =>
      request("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),

    login: (credentials) =>
      request("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      }),

    getMe: () =>
      request("/auth/me", {
        method: "GET",
      }),

    updateProfile: (profileData) =>
      request("/auth/me", {
        method: "PUT",
        body: JSON.stringify(profileData),
      }),

    changePassword: (passwordData) =>
      request("/auth/change-password", {
        method: "POST",
        body: JSON.stringify(passwordData),
      }),

    logout: async () => {
      try {
        await request("/auth/logout", { method: "POST" });
      } catch (err) {
        // Ignore logout error and proceed with local clearance
      } finally {
        localStorage.removeItem("legalAI_token");
        localStorage.removeItem("legalAI_user");
        localStorage.removeItem("legalAI_loggedIn");
      }
    },

    forgotPassword: (email) =>
      request("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }),

    resetPassword: ({ token, newPassword, confirmNewPassword }) =>
      request("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        }),
      }),

    verifyEmail: (token) =>
      request("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
  },

  cases: {
    list: (params = {}) => {
      const query = new URLSearchParams();
      if (params.page) query.append("page", params.page);
      if (params.pageSize) query.append("page_size", params.pageSize);
      if (params.search) query.append("search", params.search);
      if (params.status) query.append("status", params.status);
      if (params.caseType) query.append("case_type", params.caseType);
      if (params.includeArchived !== undefined)
        query.append("include_archived", params.includeArchived);
      const qs = query.toString();
      return request(`/cases${qs ? `?${qs}` : ""}`, { method: "GET" });
    },

    getStats: () => request("/cases/stats", { method: "GET" }),

    getById: (caseId) => request(`/cases/${caseId}`, { method: "GET" }),

    create: (caseData) =>
      request("/cases", {
        method: "POST",
        body: JSON.stringify(caseData),
      }),

    update: (caseId, caseData) =>
      request(`/cases/${caseId}`, {
        method: "PUT",
        body: JSON.stringify(caseData),
      }),

    archive: (caseId, archive = true) =>
      request(`/cases/${caseId}/archive?archive=${archive}`, {
        method: "PATCH",
      }),

    delete: (caseId) =>
      request(`/cases/${caseId}`, {
        method: "DELETE",
      }),
  },

  documents: {
    upload: (caseId, file) => {
      const formData = new FormData();
      formData.append("file", file);
      return request(`/cases/${caseId}/documents`, {
        method: "POST",
        body: formData,
      });
    },

    list: (caseId) => request(`/cases/${caseId}/documents`, { method: "GET" }),

    delete: (caseId, documentId) =>
      request(`/cases/${caseId}/documents/${documentId}`, {
        method: "DELETE",
      }),
  },

  analysis: {
    getSummary: (caseId) =>
      request(`/cases/${caseId}/analysis/summary`, { method: "POST" }),

    getIssues: (caseId) =>
      request(`/cases/${caseId}/analysis/issues`, { method: "POST" }),

    getEvidence: (caseId) =>
      request(`/cases/${caseId}/analysis/evidence`, { method: "POST" }),

    getTimeline: (caseId) =>
      request(`/cases/${caseId}/analysis/timeline`, { method: "POST" }),

    getAll: (caseId) =>
      request(`/cases/${caseId}/analysis/all`, { method: "POST" }),

    getCached: (caseId) =>
      request(`/cases/${caseId}/analysis`, { method: "GET" }),
  },

  health: {
    checkLive: () => request("/health/healthz"),
    checkReady: () => request("/health/readyz"),
    getSystemHealth: () => request("/health/health"),
  },
};

export default api;
