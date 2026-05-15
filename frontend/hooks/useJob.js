"use client";

import { useState, useEffect } from "react";
import { jobsApi } from "../lib/jobsApi";

/**
 * Manages state for a single job detail page.
 * Uses Axios via jobsApi for all mutations.
 */
export function useJob(id) {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusValue, setStatusValue] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ text: "", type: "" });

  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ── Load job ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await jobsApi.getById(id);
        if (!cancelled) {
          setJob(data.data);
          setStatusValue(data.data.status);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load job.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  // ── Update status via PATCH ───────────────────────────────────────────────
  async function saveStatus() {
    if (!job || statusValue === job.status) return;
    setUpdating(true);
    setUpdateMsg({ text: "", type: "" });
    try {
      const data = await jobsApi.updateStatus(id, statusValue);
      setJob(data.data);
      setUpdateMsg({ text: "Status updated successfully.", type: "success" });
      setTimeout(() => setUpdateMsg({ text: "", type: "" }), 3500);
    } catch (err) {
      setUpdateMsg({ text: err.message || "Update failed.", type: "error" });
    } finally {
      setUpdating(false);
    }
  }

  // ── Delete via DELETE ─────────────────────────────────────────────────────
  async function deleteJob(onSuccess) {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setDeleting(true);
    try {
      await jobsApi.remove(id);
      onSuccess?.();
    } catch (err) {
      setError(err.message || "Delete failed.");
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  function cancelDelete() {
    setConfirmDelete(false);
  }

  return {
    job,
    loading,
    error,
    // Status
    statusValue, setStatusValue,
    updating,
    updateMsg,
    saveStatus,
    // Delete
    deleting,
    confirmDelete,
    deleteJob,
    cancelDelete,
  };
}
