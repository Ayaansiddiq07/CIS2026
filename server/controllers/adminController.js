/**
 * Admin controller — CRUD handlers for admin panel.
 */

const XLSX = require("xlsx");
const SiteContent = require("../models/SiteContent");
const Speaker = require("../models/Speaker");
const Sponsor = require("../models/Sponsor");
const Registration = require("../models/Registration");
const Contact = require("../models/Contact");
const Competition = require("../models/Competition");
const Stall = require("../models/Stall");
const logger = require("../config/logger");

// ── Dashboard Stats ──

async function getDashboard(req, res, next) {
  try {
    const [
      totalRegistrations,
      paidRegistrations,
      totalSpeakers,
      approvedSpeakers,
      totalSponsors,
      totalContacts,
      revenueAgg,
    ] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: "paid" }),
      Speaker.countDocuments(),
      Speaker.countDocuments({ status: "approved" }),
      Sponsor.countDocuments({ isActive: true }),
      Contact.countDocuments(),
      Registration.aggregate([
        { $match: { status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      totalRegistrations,
      paidRegistrations,
      totalRevenue,
      totalSpeakers,
      approvedSpeakers,
      totalSponsors,
      totalContacts,
    });
  } catch (err) {
    next(err);
  }
}

// ── Site Content ──

async function getSiteContent(req, res, next) {
  try {
    const content = await SiteContent.getSingleton();
    res.json(content);
  } catch (err) {
    next(err);
  }
}

async function updateSiteContent(req, res, next) {
  try {
    const content = await SiteContent.getSingleton();
    const { pricing, eventInfo } = req.body;

    if (pricing) {
      for (const key of ["gold", "diamond", "bulk", "stall"]) {
        if (pricing[key]) {
          Object.assign(content.pricing[key], pricing[key]);
        }
      }
      content.markModified("pricing");
    }

    if (eventInfo) {
      Object.assign(content.eventInfo, eventInfo);
      content.markModified("eventInfo");
    }

    await content.save();
    logger.info("Site content updated by admin");
    res.json(content);
  } catch (err) {
    next(err);
  }
}

// ── Speakers ──

async function listSpeakers(req, res, next) {
  try {
    const speakers = await Speaker.find().sort({ createdAt: -1 });
    res.json(speakers);
  } catch (err) {
    next(err);
  }
}

async function createSpeaker(req, res, next) {
  try {
    // Check for duplicate email
    const existing = await Speaker.findOne({ email: req.body.email?.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: "A speaker with this email already exists." });
    }

    const speaker = await Speaker.create(req.body);
    logger.info({ id: speaker._id }, "Speaker created by admin");
    res.status(201).json(speaker);
  } catch (err) {
    next(err);
  }
}

async function updateSpeaker(req, res, next) {
  try {
    const speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }
    logger.info({ id: speaker._id }, "Speaker updated by admin");
    res.json(speaker);
  } catch (err) {
    next(err);
  }
}

async function deleteSpeaker(req, res, next) {
  try {
    const speaker = await Speaker.findByIdAndDelete(req.params.id);
    if (!speaker) {
      return res.status(404).json({ error: "Speaker not found" });
    }
    logger.info({ id: req.params.id }, "Speaker deleted by admin");
    res.json({ message: "Speaker deleted" });
  } catch (err) {
    next(err);
  }
}

// ── Sponsors ──

async function listSponsors(req, res, next) {
  try {
    const sponsors = await Sponsor.find().sort({ tier: 1, order: 1 });
    res.json(sponsors);
  } catch (err) {
    next(err);
  }
}

async function createSponsor(req, res, next) {
  try {
    // Check for duplicate name
    const existing = await Sponsor.findOne({ name: req.body.name?.trim() });
    if (existing) {
      return res.status(409).json({ error: "A sponsor with this name already exists." });
    }

    const sponsor = await Sponsor.create(req.body);
    logger.info({ id: sponsor._id }, "Sponsor created by admin");
    res.status(201).json(sponsor);
  } catch (err) {
    next(err);
  }
}

async function updateSponsor(req, res, next) {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor not found" });
    }
    logger.info({ id: sponsor._id }, "Sponsor updated by admin");
    res.json(sponsor);
  } catch (err) {
    next(err);
  }
}

async function deleteSponsor(req, res, next) {
  try {
    const sponsor = await Sponsor.findByIdAndDelete(req.params.id);
    if (!sponsor) {
      return res.status(404).json({ error: "Sponsor not found" });
    }
    logger.info({ id: req.params.id }, "Sponsor deleted by admin");
    res.json({ message: "Sponsor deleted" });
  } catch (err) {
    next(err);
  }
}

// ── Registrations (read-only) ──

async function listRegistrations(req, res, next) {
  try {
    const registrations = await Registration.find()
      .select("-qrCode")
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    next(err);
  }
}

// ── Contacts (read-only) ──

async function listContacts(req, res, next) {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    next(err);
  }
}

// ── Database Reset with Excel Backup ──

async function resetDatabase(req, res, next) {
  try {
    // 1. Fetch all data
    const [registrations, speakers, sponsors, contacts, competitions, stalls] = await Promise.all([
      Registration.find().select("-qrCode").lean(),
      Speaker.find().lean(),
      Sponsor.find().lean(),
      Contact.find().lean(),
      Competition.find().lean(),
      Stall.find().lean(),
    ]);

    // 2. Build Excel workbook
    const wb = XLSX.utils.book_new();

    if (registrations.length > 0) {
      const regData = registrations.map((r) => ({
        Name: r.name,
        Email: r.email,
        Phone: r.phone,
        "Ticket Type": r.ticketType,
        Amount: r.amount,
        Status: r.status,
        "Order ID": r.razorpay_order_id,
        "Payment ID": r.razorpay_payment_id || "",
        "Created At": r.createdAt ? new Date(r.createdAt).toISOString() : "",
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(regData), "Registrations");
    }

    if (speakers.length > 0) {
      const spkData = speakers.map((s) => ({
        Name: s.name,
        Email: s.email,
        Phone: s.phone || "",
        Organization: s.organization || "",
        Bio: s.bio,
        Topic: s.topic,
        Status: s.status,
        "Created At": s.createdAt ? new Date(s.createdAt).toISOString() : "",
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(spkData), "Speakers");
    }

    if (sponsors.length > 0) {
      const sponData = sponsors.map((s) => ({
        Name: s.name,
        "Logo URL": s.logoUrl || "",
        Website: s.website || "",
        Tier: s.tier,
        Description: s.description || "",
        Active: s.isActive ? "Yes" : "No",
        Order: s.order,
        "Created At": s.createdAt ? new Date(s.createdAt).toISOString() : "",
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(sponData), "Sponsors");
    }

    if (contacts.length > 0) {
      const conData = contacts.map((c) => ({
        Name: c.name,
        Email: c.email,
        Subject: c.subject,
        Message: c.message,
        "Created At": c.createdAt ? new Date(c.createdAt).toISOString() : "",
      }));
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(conData), "Contacts");
    }

    // 3. Generate buffer
    const excelBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // 4. Delete all data from collections
    await Promise.all([
      Registration.deleteMany({}),
      Speaker.deleteMany({}),
      Sponsor.deleteMany({}),
      Contact.deleteMany({}),
      Competition.deleteMany({}),
      Stall.deleteMany({}),
    ]);

    const totalDeleted =
      registrations.length + speakers.length + sponsors.length + contacts.length + competitions.length + stalls.length;
    logger.warn(
      { registrations: registrations.length, speakers: speakers.length, sponsors: sponsors.length, contacts: contacts.length },
      `DATABASE RESET by admin — ${totalDeleted} documents backed up and deleted`
    );

    // 5. Send Excel file as download
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename=CIS_Backup_${timestamp}.xlsx`);
    res.send(excelBuffer);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getDashboard,
  getSiteContent,
  updateSiteContent,
  listSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  listSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  listRegistrations,
  listContacts,
  resetDatabase,
};
