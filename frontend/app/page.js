"use client";

import { useRouter } from "next/navigation";
import { useJobs } from "../hooks/useJobs";
import { Search, RotateCw, MapPin, Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Plumbing", "Electrical", "Painting", "Joinery", "General"];
const STATUSES   = ["All", "Open", "In Progress", "Closed"];

function badgeClass(status) {
  if (status === "Open")        return "badge badge-open";
  if (status === "In Progress") return "badge badge-progress";
  return "badge badge-closed";
}

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function HomePage() {
  const router = useRouter();
  const {
    jobs, loading, error,
    category, setCategory,
    status, setStatus,
    searchInput, setSearchInput,
    refresh,
  } = useJobs();

  return (
    <>
      {/* Heading */}
      <div style={{ marginBottom: "0.25rem" }}>
        <h1 className="page-title">
          Service Requests
          {!loading && <span className="count-pill">{jobs.length}</span>}
        </h1>
        <p className="page-subtitle">
          Open jobs posted by homeowners across Scotland.
        </p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        {/* Search */}
        <div className="search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search title or description…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="cat">Category</label>
          <select
            id="cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: "auto" }}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        {/* Status */}
        <div className="filter-group">
          <label className="filter-label" htmlFor="sts">Status</label>
          <select
            id="sts"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "auto" }}
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <button className="btn btn-secondary" onClick={refresh} style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RotateCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="alert alert-error" style={{ marginTop: "1.5rem" }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="state-box">
          <Loader2 className="animate-spin" style={{ margin: "0 auto 1rem" }} size={24} />
          <p>Loading jobs…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && jobs.length === 0 && (
        <div className="state-box">
          <h3>No jobs found</h3>
          <p>
            Try adjusting your filters, or{" "}
            <a href="/new-job" style={{ color: "var(--gold)" }}>post a new one</a>.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && jobs.length > 0 && (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <article
              key={job._id}
              className="job-card"
              onClick={() => router.push(`/jobs/${job._id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && router.push(`/jobs/${job._id}`)}
            >
              <div className="job-card-top">
                <h2 className="job-card-title">{job.title}</h2>
                <span className={badgeClass(job.status)} style={{ flexShrink: 0 }}>
                  {job.status}
                </span>
              </div>

              <p className="job-card-desc">{job.description}</p>

              <div className="job-card-footer">
                <span className="chip">{job.category}</span>

                {job.location && (
                  <span className="meta-item">
                    <MapPin size={14} strokeWidth={2.5} />
                    {job.location}
                  </span>
                )}

                <span className="meta-item" style={{ marginLeft: "auto" }}>
                  {fmt(job.createdAt)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
