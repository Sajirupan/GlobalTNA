import axiosClient from "./axiosClient";

/**
 * All job-related API calls in one place.
 * Every method returns the unwrapped `data` object from the server response.
 */
export const jobsApi = {
  /**
   * GET /api/jobs
   * @param {Object} params  Optional: { category, status, search }
   * @returns {{ success, count, data: JobRequest[] }}
   */
  list: async (params = {}) => {
    // Strip empty/undefined values so the query string stays clean
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );
    const response = await axiosClient.get("/jobs", { params: cleanParams });
    return response.data;
  },

  /**
   * GET /api/jobs/:id
   * @param {string} id
   * @returns {{ success, data: JobRequest }}
   */
  getById: async (id) => {
    const response = await axiosClient.get(`/jobs/${id}`);
    return response.data;
  },

  /**
   * POST /api/jobs
   * @param {Object} payload  { title, description, category, location, contactName, contactEmail }
   * @returns {{ success, data: JobRequest }}
   */
  create: async (payload) => {
    const response = await axiosClient.post("/jobs", payload);
    return response.data;
  },

  /**
   * PATCH /api/jobs/:id  — status only
   * @param {string} id
   * @param {string} status  "Open" | "In Progress" | "Closed"
   * @returns {{ success, data: JobRequest }}
   */
  updateStatus: async (id, status) => {
    const response = await axiosClient.patch(`/jobs/${id}`, { status });
    return response.data;
  },

  /**
   * DELETE /api/jobs/:id
   * @param {string} id
   * @returns {{ success, message }}
   */
  remove: async (id) => {
    const response = await axiosClient.delete(`/jobs/${id}`);
    return response.data;
  },
};
