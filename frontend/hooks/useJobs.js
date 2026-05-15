"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { jobsApi } from "../lib/jobsApi";

/**
 * Custom hook that manages job list state, filtering, and debounced search.
 * All Axios calls go through jobsApi which uses the configured axiosClient.
 */
export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  // Abort controller ref so stale in-flight requests get cancelled
  const abortRef = useRef(null);

  // Debounce search input → search state (400 ms)
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const fetchJobs = useCallback(async () => {
    // Cancel any previous in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const params = {
        category: category !== "All" ? category : "",
        status: status !== "All" ? status : "",
        search: search.trim(),
      };

      // Pass the AbortSignal so Axios cancels the request if the component
      // unmounts or filters change before the response arrives.
      const data = await jobsApi.list(params, { signal: controller.signal });
      setJobs(data.data);
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") return; // ignore cancels
      setError(err.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, [category, status, search]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    loading,
    error,
    // Filters
    category, setCategory,
    status, setStatus,
    searchInput, setSearchInput,
    // Actions
    refresh: fetchJobs,
  };
}
