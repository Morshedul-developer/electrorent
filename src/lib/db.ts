
import { MongoClient, Db, Collection } from "mongodb";
import { IGadget } from "../types";

const MONGODB_URI = process.env.MONGODB_URI;

// In-memory fallback dataset in case database is completely unavailable
export const INITIAL_SEED_GADGETS: IGadget[] = [
  {
    id: "dji-inspire-3",
    title: "DJI Inspire 3 Pro Cinema Drone",
    category: "Drones",
    shortDescription: "Ultra-professional full-frame 8K cinema drone with RTK positioning and O3 Pro HD video transmission.",
    description: "The DJI Inspire 3 is a revolutionary full-frame 8K cinema drone. It features a customizable integrated design, centimetre-level RTK positioning, and seamless integration with the DJI pro ecosystem. Built for Hollywood-tier filmmakers who refuse to compromise on visual precision and aerial flight performance.",
    pricePerDay: 450,
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    location: "Studio Stage A, Los Angeles",
    status: "Available",
    specifications: {
      "Max Speed": "94 km/h",
      "Sensor Type": "Full-Frame 8K CMOS",
      "Flight Time": "28 mins (Dual Battery)",
      "Transmission": "O3 Pro up to 15km",
      "Format": "CinemaDNG & ProRes RAW",
      "Weight": "3,995g"
    },
    serialNumber: "SN-DJI-8823-INS3",
    features: [
      "Centimeter-Level RTK Flight Path Accuracy",
      "Zenmuse X9-8K Air Gimbal Camera System",
      "Dual-Control Configuration for Pilot & Camera Op",
      "Omnidirectional Obstacle Sensing Matrix"
    ]
  },
  {
    id: "sony-fx3",
    title: "Sony FX3 Full-Frame Cinema Camera",
    category: "Cameras",
    shortDescription: "Compact handheld cinema line camera with industry-leading low-light sensitivity and active cooling.",
    description: "The Sony FX3 Cinema Camera brings the visionary Look of cinematic expression to solo creators. Part of the acclaimed Cinema Line, it features a back-illuminated full-frame Exmor R CMOS sensor, 15+ stops of dynamic range, active internal fan cooling for endless recording, and S-Cinetone color science.",
    pricePerDay: 180,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    location: "Camera Locker B, New York",
    status: "Available",
    specifications: {
      "Sensor": "12.1MP Full-Frame CMOS",
      "ISO Range": "80 - 409,600 (Expanded)",
      "Dynamic Range": "15+ Stops",
      "Autofocus": "Real-time Eye AF & Tracking",
      "Stabilization": "5-axis In-Body Active Mode",
      "Video Specs": "4K 120p 10-bit 4:2:2 Internal"
    },
    serialNumber: "SN-SONY-7731-FX3",
    features: [
      "Active Fan cooling for uninterrupted shooting",
      "S-Cinetone for high-fidelity cinematic color mapping",
      "Detachable XLR top handle with dual audio inputs",
      "Ultra-compact form factor with multiple mounting points"
    ]
  },
  {
    id: "red-v-raptor",
    title: "RED V-Raptor 8K VV Cinema System",
    category: "Cameras",
    shortDescription: "The ultimate 8K multi-format flagship cinema camera with 120fps recording and 17+ stops of dynamic range.",
    description: "RED V-RAPTOR 8K VV is the spearhead of cinematic capture technology. Representing the DSMC3 system generation, it delivers unprecedented raw frame rates, extreme low-light performance, and cinematic dynamic depth designed for the most demanding commercial and theatrical master productions.",
    pricePerDay: 650,
    imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    location: "High-Value Vault, Chicago",
    status: "Low Stock",
    specifications: {
      "Sensor": "35.4 Megapixel V-RAPTOR 8K VV",
      "Dynamic Range": "17+ Stops",
      "Recording format": "REDCODE RAW & ProRes 4444",
      "Max Resolution": "8K at 120fps (17:9)",
      "Lens Mount": "RF Mount (Adapters Available)",
      "Power": "Micro V-Lock Smart Batteries"
    },
    serialNumber: "SN-RED-1102-RAPT",
    features: [
      "Integrated dual-screen control interface",
      "Intelligent active thermal management exhaust",
      "Ultra-high bandwidth 12G-SDI output ports",
      "Remote system control via Wi-Fi companion app"
    ]
  },
  {
    id: "mbp-16-m4-max",
    title: "Apple MacBook Pro 16\" M4 Max Workstation",
    category: "Laptops",
    shortDescription: "The absolute peak of creative computing: 16-core M4 Max, 128GB RAM, and a Liquid Retina XDR screen.",
    description: "Built for developers, 3D artists, and video editors who need workstation power anywhere. This top-spec MacBook Pro features the formidable M4 Max chip with a 40-core GPU, massive 128GB unified memory pool, and an extreme high-contrast Liquid Retina XDR panel with 1600 nits peak brightness.",
    pricePerDay: 150,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    location: "Tech Depot Floor 1, San Francisco",
    status: "Available",
    specifications: {
      "Processor": "Apple M4 Max (16-Core CPU)",
      "Graphics": "40-Core Apple GPU",
      "Unified Memory": "128GB RAM",
      "Storage Size": "2TB Superfast SSD",
      "Display Screen": "16.2\" Liquid Retina XDR 120Hz",
      "Battery Capacity": "Up to 24 Hours Operating"
    },
    serialNumber: "SN-APPL-9912-MB16",
    features: [
      "Thunderbolt 5 high-speed peripheral support",
      "Hardware-accelerated mesh shading & ray tracing",
      "Six-speaker sound system with force-cancelling woofers",
      "Advanced studio-quality three-mic array matrix"
    ]
  },
  {
    id: "asus-rog-scar-18",
    title: "ASUS ROG Strix Scar 18 Gaming Laptop",
    category: "Laptops",
    shortDescription: "Extreme-tier gaming beast packing a liquid-metal cooled Intel i9-14900HX and an RTX 4090 GPU.",
    description: "The ASUS ROG Strix Scar 18 is a desktop-replacement computing platform. Built to demolish intensive rendering pipelines and triple-A gaming, it combines an Intel i9-14900HX CPU with a massive NVIDIA RTX 4090 laptop GPU. Features a liquid metal thermal barrier and custom neon cybernetic styling.",
    pricePerDay: 135,
    imageUrl: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80",
    rating: 4.75,
    location: "Gaming Section, Austin",
    status: "Available",
    specifications: {
      "Processor": "Intel Core i9-14900HX (24 Cores)",
      "Graphics Card": "NVIDIA GeForce RTX 4090 16GB",
      "Memory": "64GB DDR5 Dual Channel",
      "Storage": "2TB NVMe PCIe 4.0 SSD",
      "Screen Type": "18\" QHD+ 240Hz ROG Nebula Display",
      "Cooling": "Tri-Fan with Conductonaut Extreme Liquid Metal"
    },
    serialNumber: "SN-ASUS-4491-ROG18",
    features: [
      "Intense full-surround custom Aura Sync RGB lighting",
      "Dolby Vision & Dolby Atmos panoramic sound",
      "Multiplexer Switch (MUX) with NVIDIA Advanced Optimus",
      "Custom programmable macros and cyber-accent keycaps"
    ]
  },
  {
    id: "sennheiser-ew-dp",
    title: "Sennheiser EW-DP ME2 Wireless Mic",
    category: "Audio",
    shortDescription: "Fully digital UHF camera-mount wireless lavalier mic system with high-fidelity signal and magnetic stack.",
    description: "Sennheiser's EW-DP is the next-generation wireless audio system for filmmakers and broadcast presenters. Utilizing fully digital transmission, it guarantees crystal-clear acoustics, intelligent battery status meters, automatic frequency scanning, and a unique stackable magnetic receiver mechanism.",
    pricePerDay: 45,
    imageUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
    rating: 4.85,
    location: "Audio Cage C, Austin",
    status: "Available",
    specifications: {
      "Frequency Band": "470 - 526 MHz (UHF Band)",
      "Audio Latency": "Ultra-low 1.9 ms",
      "Battery Life": "Up to 12 Hours (Li-Ion)",
      "Dynamic Range": "134 dB",
      "Mounting System": "Magnetic Stackable Hot-Shoe Mount",
      "Capsule Type": "ME 2 Omnidirectional Lavalier"
    },
    serialNumber: "SN-SENN-0034-EWDP",
    features: [
      "Dynamic frequency scan with auto-pairing system",
      "Smart Notifications for gain correction and dropouts",
      "Convenient USB-C charging on transmitter & receiver",
      "OLED display screen on receiver with high visibility"
    ]
  },
  {
    id: "apple-vision-pro",
    title: "Apple Vision Pro Spatial VR Headset",
    category: "Wearables",
    shortDescription: "Revolutionary spatial computer that seamlessly blends digital content with your physical workspace.",
    description: "The Apple Vision Pro is an elite spatial computing environment. It features dual high-fidelity micro-OLED displays, eye and gesture navigation, and a dual-chip configuration containing Apple M2 and R1 chips. Transform how you collaborate, design, and consume entertainment with immersive virtual canvases.",
    pricePerDay: 220,
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80",
    rating: 4.88,
    location: "Special Equipment Locker, SF",
    status: "Rented Out",
    specifications: {
      "Display Tech": "Dual Micro-OLED 23 Million Pixels",
      "Refresh Rate": "90Hz / 96Hz / 100Hz Supported",
      "Main Processors": "Apple M2 (CPU/GPU) & Apple R1 (Sensors)",
      "Tracking Sensorry": "12 Cameras, 5 Sensors, 6 Mics",
      "Control Types": "Hands, Eyes, & Voice Gestures",
      "Battery Runtime": "Up to 2.5 hours active use"
    },
    serialNumber: "SN-APPL-1011-VISP",
    features: [
      "EyeSight display showing user's eyes to external people",
      "Optic ID iris scan authentication",
      "Custom 3D spatial audio driver pods",
      "Perfect seamless hand gesture and gaze pointer control"
    ]
  }
];

// Persistent Global Cache for Next.js Serverless Hot-Reload Context
const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
  _useFallback?: boolean;
  _inMemoryDb?: Record<string, any[]>;
};

const DEFAULT_IN_MEMORY_DB = {
  items: [...INITIAL_SEED_GADGETS],
  rentals: [
    { id: "R-3091", gadgetTitle: "RED V-Raptor 8K VV Cinema System", userEmail: "tester@electrorent.com", date: "2026-07-10", cost: 1300, days: 2 },
    { id: "R-3092", gadgetTitle: "Apple MacBook Pro 16\" M4 Max Workstation", userEmail: "admin@electrorent.com", date: "2026-07-12", cost: 450, days: 3 },
    { id: "R-3093", gadgetTitle: "Sony FX3 Full-Frame Cinema Camera", userEmail: "creative-flow@gmail.com", date: "2026-07-13", cost: 180, days: 1 }
  ]
};

if (!globalWithMongo._inMemoryDb) {
  globalWithMongo._inMemoryDb = JSON.parse(JSON.stringify(DEFAULT_IN_MEMORY_DB));
}

const inMemoryDb = globalWithMongo._inMemoryDb!;

let cachedClient: MongoClient | null = globalWithMongo._mongoClient || null;
let cachedDb: Db | null = globalWithMongo._mongoDb || null;
let useFallback = globalWithMongo._useFallback !== undefined ? globalWithMongo._useFallback : false;

class MockCollection {
  private name: string;

  constructor(name: string) {
    this.name = name;
    if (!inMemoryDb[name]) {
      inMemoryDb[name] = [];
    }
  }

  find(query: any = {}) {
    let list = [...(inMemoryDb[this.name] || [])];

    // Simple filter matching
    list = list.filter(item => {
      for (const key in query) {
        if (key === "$or" && Array.isArray(query.$or)) {
          const matchedOr = query.$or.some((cond: any) => {
            for (const condKey in cond) {
              const condVal = cond[condKey];
              if (condVal && typeof condVal === "object" && "$regex" in condVal) {
                const regex = new RegExp(condVal.$regex, condVal.$options || "");
                if (regex.test(String(item[condKey] || ""))) return true;
              } else if (item[condKey] === condVal) {
                return true;
              }
            }
            return false;
          });
          if (!matchedOr) return false;
        } else {
          const val = query[key];
          if (val && typeof val === "object") {
            if ("$regex" in val) {
              const regex = new RegExp(val.$regex, val.$options || "");
              if (!regex.test(String(item[key] || ""))) return false;
            } else if ("$lte" in val) {
              if (!(Number(item[key]) <= Number(val.$lte))) return false;
            }
          } else if (item[key] !== val) {
            return false;
          }
        }
      }
      return true;
    });

    const chain = {
      sort: (sortObj: any) => {
        if (sortObj) {
          list.sort((a, b) => {
            for (const sortKey in sortObj) {
              const direction = sortObj[sortKey];
              const valA = a[sortKey];
              const valB = b[sortKey];

              if (typeof valA === "string" && typeof valB === "string") {
                return valA.localeCompare(valB) * direction;
              }
              if (Number(valA) < Number(valB)) return -1 * direction;
              if (Number(valA) > Number(valB)) return 1 * direction;
            }
            return 0;
          });
        }
        return {
          toArray: async () => list
        };
      },
      toArray: async () => list
    };
    return chain;
  }

  async findOne(query: any = {}) {
    const list = await this.find(query).toArray();
    return list[0] || null;
  }

  async insertOne(doc: any) {
    inMemoryDb[this.name].push(doc);
    return { acknowledged: true, insertedId: doc.id || doc._id || String(Date.now()) };
  }

  async insertMany(docs: any[]) {
    inMemoryDb[this.name].push(...docs);
    return { acknowledged: true, insertedCount: docs.length };
  }

  async deleteOne(query: any = {}) {
    const initialLen = inMemoryDb[this.name].length;
    inMemoryDb[this.name] = inMemoryDb[this.name].filter(item => {
      for (const key in query) {
        if (item[key] === query[key]) {
          return false;
        }
      }
      return true;
    });
    const deletedCount = initialLen - inMemoryDb[this.name].length;
    return { acknowledged: true, deletedCount };
  }

  async updateOne(query: any = {}, update: any = {}) {
    let modifiedCount = 0;
    const list = inMemoryDb[this.name];
    for (const item of list) {
      let matches = true;
      for (const key in query) {
        if (item[key] !== query[key]) {
          matches = false;
          break;
        }
      }
      if (matches) {
        if (update.$set) {
          Object.assign(item, update.$set);
          modifiedCount++;
        }
      }
    }
    return { acknowledged: true, modifiedCount };
  }

  async countDocuments() {
    return inMemoryDb[this.name].length;
  }
}

export async function getDb(): Promise<Db | null> {
  if (useFallback) {
    return null;
  }
  if (cachedDb) {
    return cachedDb;
  }

  try {
    console.log(`[Database] Connecting to MongoDB: ${MONGODB_URI.split("@").pop()}`);
    const client = new MongoClient(MONGODB_URI, {
      connectTimeoutMS: 2000,
      serverSelectionTimeoutMS: 2000,
    });
    await client.connect();
    const db = client.db();
    console.log("[Database] MongoDB connection established successfully.");

    cachedClient = client;
    cachedDb = db;
    globalWithMongo._mongoClient = client;
    globalWithMongo._mongoDb = db;
    globalWithMongo._useFallback = false;
    useFallback = false;

    return db;
  } catch (error) {
    console.warn("[Database] Failed to connect to MongoDB, switching gracefully to In-Memory simulation mode.", error);
    useFallback = true;
    globalWithMongo._useFallback = true;
    return null;
  }
}

export async function getCollection<T = any>(name: string): Promise<Collection<T> | any> {
  const database = await getDb();
  if (useFallback || !database) {
    return new MockCollection(name) as any;
  }
  return database.collection<T>(name);
}

export async function seedDatabaseIfEmpty() {
  try {
    const itemsCol = await getCollection<IGadget>("items");
    const count = await itemsCol.countDocuments();
    if (count === 0) {
      console.log("[Database] Seeding items collection with high-end tech gadgets...");
      await itemsCol.insertMany(INITIAL_SEED_GADGETS);
      console.log("[Database] Seeding complete.");
    }
  } catch (error) {
    console.warn("[Database] Seeding skipped or handled.", error);
  }
}
