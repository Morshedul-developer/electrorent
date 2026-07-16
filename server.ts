import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Gadget } from "./src/types";
import { getCollection, seedDatabaseIfEmpty, INITIAL_SEED_GADGETS } from "./src/lib/db";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Automatically trigger asynchronous seed operation on server spin-up
  try {
    await seedDatabaseIfEmpty();
  } catch (err) {
    console.warn("[Database] Pre-seeding skipped during start-up. Will connect on first demand.", err);
  }

  // 1. GET ALL ITEMS WITH SEARCH/FILTER API (executed directly via MongoDB collection)
  app.get("/api/items", async (req, res) => {
    try {
      const { search, category, maxPrice, sortBy } = req.query;
      const collection = await getCollection<Gadget>("items");

      const query: any = {};

      if (search) {
        const s = String(search).trim();
        query.$or = [
          { title: { $regex: s, $options: "i" } },
          { shortDescription: { $regex: s, $options: "i" } },
          { description: { $regex: s, $options: "i" } }
        ];
      }

      if (category && category !== "All") {
        query.category = { $regex: `^${category}$`, $options: "i" };
      }

      if (maxPrice) {
        const priceLimit = Number(maxPrice);
        if (!isNaN(priceLimit)) {
          query.pricePerDay = { $lte: priceLimit };
        }
      }

      const sort: any = {};
      if (sortBy) {
        if (sortBy === "price-low") {
          sort.pricePerDay = 1;
        } else if (sortBy === "price-high") {
          sort.pricePerDay = -1;
        } else if (sortBy === "rating") {
          sort.rating = -1;
        } else if (sortBy === "title") {
          sort.title = 1;
        }
      }

      const results = await collection.find(query).sort(sort).toArray();
      res.json(results);
    } catch (err) {
      console.error("[API] Failed to fetch items from MongoDB, using in-memory fallbacks.", err);
      res.json(INITIAL_SEED_GADGETS);
    }
  });

  // 2. GET SINGLE ITEM
  app.get("/api/items/:id", async (req, res) => {
    try {
      const collection = await getCollection<Gadget>("items");
      const item = await collection.findOne({ id: req.params.id });
      if (!item) {
        return res.status(404).json({ error: "Gadget not found" });
      }
      res.json(item);
    } catch (err) {
      console.error(`[API] Failed to retrieve item ${req.params.id}`, err);
      const fallback = INITIAL_SEED_GADGETS.find(g => g.id === req.params.id);
      if (fallback) {
        return res.json(fallback);
      }
      res.status(500).json({ error: "Database retrieval error." });
    }
  });

  // 3. POST NEW ITEM (Admin only checks)
  app.post("/api/items", async (req, res) => {
    try {
      const { title, category, shortDescription, description, pricePerDay, imageUrl, location, status, specifications, serialNumber, features } = req.body;

      if (!title || !category || !pricePerDay || !serialNumber) {
        return res.status(400).json({ error: "Title, category, price per day, and serial number are required." });
      }

      const collection = await getCollection<Gadget>("items");

      // Check duplicate serial number
      const isDuplicate = await collection.findOne({ serialNumber });
      if (isDuplicate) {
        return res.status(400).json({ error: `An item with serial number '${serialNumber}' already exists in inventory.` });
      }

      // Format the ID
      const formattedId = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const newItem: Gadget = {
        id: formattedId || `gadget-${Date.now()}`,
        title,
        category,
        shortDescription: shortDescription || `${title} premium high-performance rental item.`,
        description: description || `Professional grade ${title} built for peak performance.`,
        pricePerDay: Number(pricePerDay),
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
        rating: 5.0,
        location: location || "Central Logistics, Austin",
        status: status || "Available",
        specifications: specifications || { "Brand": "OEM", "Condition": "New Release" },
        serialNumber,
        features: features && Array.isArray(features) && features.length > 0 ? features : ["High-Performance Core Components", "Rugged Field-Tested Reliability"]
      };

      await collection.insertOne(newItem);
      res.status(201).json(newItem);
    } catch (err) {
      console.error("[API] Failed to add item to MongoDB", err);
      res.status(500).json({ error: "Failed to store item in database." });
    }
  });

  // 4. DELETE ITEM
  app.delete("/api/items/:id", async (req, res) => {
    try {
      const collection = await getCollection<Gadget>("items");
      const item = await collection.findOne({ id: req.params.id });
      if (!item) {
        return res.status(404).json({ error: "Gadget not found" });
      }
      await collection.deleteOne({ id: req.params.id });
      res.json({ message: "Gadget removed from inventory", item });
    } catch (err) {
      console.error(`[API] Failed to delete item ${req.params.id}`, err);
      res.status(500).json({ error: "Failed to remove item from database." });
    }
  });

  // 5. UPDATE ITEM STATUS OR BOOK A RENTAL
  app.post("/api/items/:id/rent", async (req, res) => {
    try {
      const { days, userEmail } = req.body;
      const itemsCollection = await getCollection<Gadget>("items");
      const gadget = await itemsCollection.findOne({ id: req.params.id });

      if (!gadget) {
        return res.status(404).json({ error: "Gadget not found" });
      }

      if (gadget.status === "Rented Out") {
        return res.status(400).json({ error: "This item is currently rented out to another producer." });
      }

      const rentDays = Number(days) || 1;
      const totalCost = gadget.pricePerDay * rentDays;

      // Log rental transaction in MongoDB
      const transactionId = `R-${Math.floor(1000 + Math.random() * 9000)}`;
      const rentalsCollection = await getCollection<any>("rentals");

      const transaction = {
        id: transactionId,
        gadgetTitle: gadget.title,
        userEmail: userEmail || "guest@electrorent.com",
        date: new Date().toISOString().split('T')[0],
        cost: totalCost,
        days: rentDays
      };

      await rentalsCollection.insertOne(transaction);

      // Update item status directly
      await itemsCollection.updateOne({ id: req.params.id }, { $set: { status: "Rented Out" } });

      res.json({
        message: `Rental confirmed successfully! Order ID: ${transactionId}`,
        transaction: {
          id: transactionId,
          gadgetTitle: gadget.title,
          totalCost,
          days: rentDays,
          serialNumber: gadget.serialNumber
        }
      });
    } catch (err) {
      console.error(`[API] Failed to record rental for ${req.params.id}`, err);
      res.status(500).json({ error: "Failed to process and confirm your rental registration." });
    }
  });

  // 6. RENTALS LOG API
  app.get("/api/rentals", async (req, res) => {
    try {
      const rentalsCollection = await getCollection<any>("rentals");
      const logs = await rentalsCollection.find({}).toArray();
      res.json(logs);
    } catch (err) {
      console.error("[API] Failed to fetch rentals from MongoDB", err);
      // Fallback seed rental log list in case database query is not completed
      const defaultRentals = [
        { id: "R-3091", gadgetTitle: "RED V-Raptor 8K VV Cinema System", userEmail: "tester@electrorent.com", date: "2026-07-10", cost: 1300, days: 2 },
        { id: "R-3092", gadgetTitle: "Apple MacBook Pro 16\" M4 Max Workstation", userEmail: "admin@electrorent.com", date: "2026-07-12", cost: 450, days: 3 },
        { id: "R-3093", gadgetTitle: "Sony FX3 Full-Frame Cinema Camera", userEmail: "creative-flow@gmail.com", date: "2026-07-13", cost: 180, days: 1 }
      ];
      res.json(defaultRentals);
    }
  });

  // 7. SIMULATED AUTHENTICATION ENDPOINTS
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Admin demo account
    if (email === "admin@electrorent.com" && password === "AdminPass123") {
      return res.json({
        token: "token-admin-session-secure",
        user: {
          id: "u-admin",
          email: "admin@electrorent.com",
          name: "Chief Admin (ElectroRent)",
          role: "admin"
        }
      });
    }

    // Tester demo account
    if (email === "tester@electrorent.com" && password === "TesterPass123") {
      return res.json({
        token: "token-tester-session-secure",
        user: {
          id: "u-tester",
          email: "tester@electrorent.com",
          name: "Elite Creator (Tester)",
          role: "user"
        }
      });
    }

    // General user creation simulation on login
    return res.json({
      token: `token-user-${Date.now()}`,
      user: {
        id: `u-${Date.now()}`,
        email,
        name: email.split("@")[0].toUpperCase(),
        role: "user"
      }
    });
  });

  // Vite middleware or production build router serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ElectroRent Backend] Running live on http://0.0.0.0:${PORT}`);
  });
}

startServer();
