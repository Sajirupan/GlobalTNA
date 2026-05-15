"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useJob } from "../../../hooks/useJob";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, User, Mail, Calendar, Trash2, Save } from "lucide-react";

const STATUSES = ["Open", "In Progress", "Closed"];

function badgeClass(status) {
  if (status === "Open")        return "badge badge-open";
  if (status === "In Progress") return "badge badge-progress";
  return "badge badge-closed";
}

function fmt(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justCreated = searchParams.get("created") === "1";

  const {
    job, loading, error,
    statusValue, setStatusValue,
    updating, updateMsg, saveStatus,
    deleting, confirmDelete, deleteJob, cancelDelete,
  } = useJob(params.id);

  if (loading) return (
    <div className="state-box">
      <Loader2 className="animate-spin" style={{ margin: "0 auto 1rem" }} size={24} />
      <p>Loading job…</p>
    </div>
  );

  if (error) return (
    <>
      <a href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to jobs
      </a>
      <div className="alert alert-error">{error}</div>
    </>
  );

  return (
    <>
      <a href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to all jobs
      </a>

      {justCreated && (
        <div className="alert alert-success" style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <CheckCircle2 size={18} />
          Job posted successfully.
        </div>
      )}

      <div className="detail-card">
        {/* Kicker + Title */}
        <div className="detail-kicker">
          <span className="chip">{job.category}</span>
          <span className={badgeClass(job.status)}>{job.status}</span>
        </div>

        <h1 className="detail-title">{job.title}</h1>

        <hr className="detail-divider" />

        {/* Meta grid */}
        <div className="detail-meta-grid">
          {job.location && (
            <div className="detail-meta-item">
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={14} /> Location
              </label>
              <p>{job.location}</p>
            </div>
          )}
          {job.contactName && (
            <div className="detail-meta-item">
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <User size={14} /> Posted by
              </label>
              <p>{job.contactName}</p>
            </div>
          )}
          {job.contactEmail && (
            <div className="detail-meta-item">
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Mail size={14} /> Contact
              </label>
              <p>
                <a href={`mailto:${job.contactEmail}`}
                   style={{ color: "var(--gold)", wordBreak: "break-all" }}>
                  {job.contactEmail}
                </a>
              </p>
            </div>
          )}
          <div className="detail-meta-item">
            <label style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Calendar size={14} /> Posted on
            </label>
            <p>{fmt(job.createdAt)}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="detail-section-label">Description</p>
          <p className="detail-description">{job.description}</p>
        </div>

        {/* Actions */}
        <div className="detail-actions">
          {/* ── Status update via Axios PATCH ────────────────────────────── */}
          <div className="actions-status">
            <label htmlFor="status-sel" style={{ fontSize: 13, fontWeight: 500, color: "var(--ink-muted)" }}>
              Update status:
            </label>
            <select
              id="status-sel"
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value)}
              style={{ width: "auto" }}
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              className="btn btn-primary"
              onClick={saveStatus}
              disabled={updating || statusValue === job.status}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {updating
                ? <><Loader2 size={14} className="animate-spin" /> Saving…</>
                : <><Save size={14} /> Save</>}
            </button>
          </div>

          {/* ── Delete via Axios DELETE ──────────────────────────────────── */}
          <div className="actions-right">
            {confirmDelete && (
              <span className="confirm-label">Are you sure?</span>
            )}
            <button
              className="btn btn-danger"
              onClick={() => deleteJob(() => router.push("/?deleted=1"))}
              disabled={deleting}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              {deleting
                ? <><Loader2 size={14} className="animate-spin" /> Deleting…</>
                : confirmDelete ? "Yes, delete" : <><Trash2 size={14} /> Delete job</>}
            </button>
            {confirmDelete && (
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Update feedback */}
        {updateMsg.text && (
          <div
            className={`alert alert-${updateMsg.type}`}
            style={{ marginTop: "1rem" }}
          >
            {updateMsg.text}
          </div>
        )}
      </div>
    </>
  );
}
