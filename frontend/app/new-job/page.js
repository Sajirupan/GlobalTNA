"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { jobsApi } from "../../lib/jobsApi";
import { ArrowLeft, Loader2 } from "lucide-react";

const CATEGORIES = ["Plumbing", "Electrical", "Painting", "Joinery", "General"];

const EMPTY = {
  title: "", description: "", category: "Plumbing",
  location: "", contactName: "", contactEmail: "",
};

function validate(f) {
  const e = {};
  if (!f.title.trim())            e.title = "Title is required.";
  else if (f.title.length > 150)  e.title = "Maximum 150 characters.";

  if (!f.description.trim())          e.description = "Description is required.";
  else if (f.description.length > 2000) e.description = "Maximum 2000 characters.";

  if (f.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.contactEmail)) {
    e.contactEmail = "Enter a valid email address.";
  }
  return e;
}

export default function NewJobPage() {
  const router = useRouter();
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setFields((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => { const e = { ...p }; delete e[key]; return e; });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    setServerError("");
    try {
      // ── Axios POST via jobsApi ────────────────────────────────────────────
      const res = await jobsApi.create(fields);
      router.push(`/jobs/${res.data._id}?created=1`);
    } catch (err) {
      setServerError(err.message || "Failed to create job. Please try again.");
      setSubmitting(false);
    }
  }

  function charHint(val, max) {
    const rem = max - val.length;
    if (rem > 50) return null;
    return (
      <span className={rem < 0 ? "char-over" : "char-hint"}>
        {rem < 0 ? `${Math.abs(rem)} over limit` : `${rem} left`}
      </span>
    );
  }

  return (
    <>
      <a href="/" className="back-link">
        <ArrowLeft size={16} />
        Back to jobs
      </a>

      <div style={{ marginBottom: "1.75rem" }}>
        <h1 className="page-title">Post a Service Request</h1>
        <p className="page-subtitle">Describe your job and local tradespeople will get in touch.</p>
      </div>

      <div className="form-card">
        {serverError && <div className="alert alert-error" style={{ marginBottom: "1.25rem" }}>{serverError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="field">
            <label htmlFor="title">Job Title *</label>
            <input
              id="title" type="text"
              placeholder="e.g. Leaking kitchen tap needs fixing"
              value={fields.title}
              onChange={(e) => update("title", e.target.value)}
              className={errors.title ? "input-error" : ""}
              maxLength={160}
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
            {charHint(fields.title, 150)}
          </div>

          {/* Description */}
          <div className="field">
            <label htmlFor="desc">Description *</label>
            <textarea
              id="desc"
              placeholder="Provide detail about the work needed, urgency, access requirements…"
              value={fields.description}
              onChange={(e) => update("description", e.target.value)}
              className={errors.description ? "input-error" : ""}
              rows={5} maxLength={2100}
            />
            {errors.description && <span className="field-error">{errors.description}</span>}
            {charHint(fields.description, 2000)}
          </div>

          {/* Category + Location */}
          <div className="form-row" style={{ marginBottom: "1.2rem" }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="cat">Category</label>
              <select id="cat" value={fields.category} onChange={(e) => update("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="loc">Location</label>
              <input id="loc" type="text" placeholder="e.g. Glasgow"
                value={fields.location} onChange={(e) => update("location", e.target.value)} />
            </div>
          </div>

          {/* Contact Name + Email */}
          <div className="form-row" style={{ marginBottom: "1.75rem" }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="cname">Your Name</label>
              <input id="cname" type="text" placeholder="Full name"
                value={fields.contactName} onChange={(e) => update("contactName", e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="cemail">Contact Email</label>
              <input id="cemail" type="email" placeholder="you@example.com"
                value={fields.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                className={errors.contactEmail ? "input-error" : ""}
              />
              {errors.contactEmail && <span className="field-error">{errors.contactEmail}</span>}
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting
                ? <><Loader2 size={16} className="animate-spin" /> Posting…</>
                : "Post Job"}
            </button>
            <a href="/" className="btn btn-secondary">Cancel</a>
          </div>
        </form>
      </div>
    </>
  );
}
