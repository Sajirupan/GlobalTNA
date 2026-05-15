const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// Load app without starting the server
const { app } = require("../server");
const JobRequest = require("../models/JobRequest");

let mongoServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await JobRequest.deleteMany({});
});

const validJob = {
  title: "Fix leaking kitchen tap",
  description: "Cold water tap under sink dripping constantly.",
  category: "Plumbing",
  location: "Glasgow",
  contactName: "John Smith",
  contactEmail: "john.smith@example.com",
};

// ── GET /api/jobs ─────────────────────────────────────────────────────────────
describe("GET /api/jobs", () => {
  it("returns empty list when no jobs exist", async () => {
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
    expect(res.body.count).toBe(0);
  });

  it("returns all jobs", async () => {
    await JobRequest.create(validJob);
    await JobRequest.create({ ...validJob, title: "Paint hallway", category: "Painting" });
    const res = await request(app).get("/api/jobs");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
  });

  it("filters by category", async () => {
    await JobRequest.create(validJob);
    await JobRequest.create({ ...validJob, title: "Paint walls", category: "Painting" });
    const res = await request(app).get("/api/jobs?category=Plumbing");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].category).toBe("Plumbing");
  });

  it("filters by status", async () => {
    await JobRequest.create(validJob);
    await JobRequest.create({ ...validJob, title: "Closed job", status: "Closed" });
    const res = await request(app).get("/api/jobs?status=Open");
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });
});

// ── POST /api/jobs ────────────────────────────────────────────────────────────
describe("POST /api/jobs", () => {
  it("creates a job with valid data and returns 201", async () => {
    const res = await request(app).post("/api/jobs").send(validJob);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBeDefined();
    expect(res.body.data.status).toBe("Open");
    expect(res.body.data.title).toBe(validJob.title);
  });

  it("returns 422 when title is missing", async () => {
    const { title, ...noTitle } = validJob;
    const res = await request(app).post("/api/jobs").send(noTitle);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/title/i);
  });

  it("returns 422 when description is missing", async () => {
    const { description, ...noDesc } = validJob;
    const res = await request(app).post("/api/jobs").send(noDesc);
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it("returns 422 for invalid email format", async () => {
    const res = await request(app)
      .post("/api/jobs")
      .send({ ...validJob, contactEmail: "not-an-email" });
    expect(res.status).toBe(422);
    expect(res.body.message).toMatch(/email/i);
  });
});

// ── GET /api/jobs/:id ─────────────────────────────────────────────────────────
describe("GET /api/jobs/:id", () => {
  it("returns a single job", async () => {
    const created = await JobRequest.create(validJob);
    const res = await request(app).get(`/api/jobs/${created._id}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(created._id.toString());
  });

  it("returns 404 for non-existent ObjectId", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });

  it("returns 400 for malformed id", async () => {
    const res = await request(app).get("/api/jobs/not-a-valid-id");
    expect(res.status).toBe(400);
  });
});

// ── PATCH /api/jobs/:id ───────────────────────────────────────────────────────
describe("PATCH /api/jobs/:id", () => {
  it("updates status successfully", async () => {
    const created = await JobRequest.create(validJob);
    const res = await request(app)
      .patch(`/api/jobs/${created._id}`)
      .send({ status: "In Progress" });
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("In Progress");
  });

  it("returns 400 for invalid status value", async () => {
    const created = await JobRequest.create(validJob);
    const res = await request(app)
      .patch(`/api/jobs/${created._id}`)
      .send({ status: "Pending" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when status field missing", async () => {
    const created = await JobRequest.create(validJob);
    const res = await request(app).patch(`/api/jobs/${created._id}`).send({});
    expect(res.status).toBe(400);
  });

  it("returns 404 for non-existent job", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .patch(`/api/jobs/${fakeId}`)
      .send({ status: "Closed" });
    expect(res.status).toBe(404);
  });
});

// ── DELETE /api/jobs/:id ──────────────────────────────────────────────────────
describe("DELETE /api/jobs/:id", () => {
  it("deletes a job and confirms it's gone", async () => {
    const created = await JobRequest.create(validJob);
    const res = await request(app).delete(`/api/jobs/${created._id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    const gone = await JobRequest.findById(created._id);
    expect(gone).toBeNull();
  });

  it("returns 404 when job does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/jobs/${fakeId}`);
    expect(res.status).toBe(404);
  });
});
