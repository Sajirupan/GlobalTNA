require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const JobRequest = require("../models/JobRequest");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/globaltna";

const sampleJobs = [
  {
    title: "Leaking kitchen tap needs urgent repair",
    description: "The cold-water mixer tap under the kitchen sink has been dripping constantly for two weeks. Getting progressively worse. Need a qualified plumber to inspect and replace the cartridge or washer.",
    category: "Plumbing", location: "Glasgow",
    contactName: "Fiona MacDonald", contactEmail: "fiona.macdonald@example.com", status: "Open",
  },
  {
    title: "Full bathroom electrical rewire",
    description: "Renovating main bathroom. Need a registered electrician to install new LED downlights, extractor fan wiring, and a shaver socket. Must comply with Part P Building Regulations.",
    category: "Electrical", location: "Edinburgh",
    contactName: "James Murray", contactEmail: "j.murray@example.com", status: "Open",
  },
  {
    title: "Living room and hallway repaint",
    description: "Two rooms need a full repaint — living room (approx 25 sqm) and hallway including staircase. Walls need light filling and sanding before painting. Customer supplies paint.",
    category: "Painting", location: "Aberdeen",
    contactName: "Siobhan Kelly", contactEmail: "siobhan.kelly@example.com", status: "In Progress",
  },
  {
    title: "Rear garden decking — 6m × 4m",
    description: "Looking for an experienced joiner to build a raised timber deck at the rear of the property. Rough plans available. Must use pressure-treated timber throughout.",
    category: "Joinery", location: "Inverness",
    contactName: "Angus Fraser", contactEmail: "angus.fraser@example.com", status: "Open",
  },
  {
    title: "Boiler pressure keeps dropping",
    description: "Combi boiler loses pressure every few days. Already re-pressurised twice. Suspect a slow leak or faulty pressure relief valve. Needs proper diagnosis from a Gas Safe engineer.",
    category: "Plumbing", location: "Glasgow",
    contactName: "Patricia Burns", contactEmail: "p.burns@example.com", status: "Open",
  },
  {
    title: "Consumer unit upgrade — 18th edition",
    description: "Old fuse board needs replacing with modern RCBO consumer unit. 3-bed semi. Requires full EICR report afterwards. Must be Part P certified.",
    category: "Electrical", location: "Dundee",
    contactName: "Robert Sinclair", contactEmail: "rob.sinclair@example.com", status: "Closed",
  },
  {
    title: "External render repair and masonry paint",
    description: "Detached bungalow needs full exterior render repairs. Several sections are blown and need hacking off and replacing before painting with weatherproof masonry paint.",
    category: "Painting", location: "Stirling",
    contactName: "Helen Watson", contactEmail: "helen.w@example.com", status: "Open",
  },
  {
    title: "Fitted wardrobe installation — master bedroom",
    description: "Need a joiner to fit sliding-door wardrobes (IKEA PAX) into an alcove. Wall is slightly out of plumb so custom scribing required on one side. Two units in total.",
    category: "Joinery", location: "Perth",
    contactName: "David Lennox", contactEmail: "david.lennox@example.com", status: "Open",
  },
  {
    title: "Outdoor double socket and PIR security light",
    description: "Require a weatherproof double socket on the garage wall and a PIR security light above the back door. Cable to run from garage consumer unit. Must be IP65 rated.",
    category: "Electrical", location: "Falkirk",
    contactName: "Laura Grant", contactEmail: "l.grant@example.com", status: "In Progress",
  },
  {
    title: "Storm-damaged fence panel replacement",
    description: "Storm last month took out four fence panels on east boundary. Concrete posts still standing. Need new feather-edge panels and gravel boards fitted as soon as possible.",
    category: "General", location: "Paisley",
    contactName: "Tom Baxter", contactEmail: "tom.baxter@example.com", status: "Open",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅  Connected to MongoDB");
    await JobRequest.deleteMany({});
    console.log("🗑️   Cleared existing jobs");
    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱  Seeded ${inserted.length} job requests`);
    await mongoose.disconnect();
    console.log("👋  Done");
  } catch (err) {
    console.error("❌  Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
