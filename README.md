# ElectroRent Fleet Portal

An ultra-premium, interactive enterprise fleet operations and stage-equipment dispatch portal. Built for elite digital studio engineers, cinematic directors, and production crews to reserve, requisition, and manage high-performance smart ecosystems (drones, cinema cameras, developer workstations, and audio stages).

---

## 🌌 Core Aesthetic & Design Concept
ElectroRent is crafted under the **Cosmic Slate Theme**—a high-contrast, eye-safe design prioritizing visual clarity, rhythmic typography, and modern feedback loops.
- **Visual Rythm & Motion**: Seamless page transitions and interactive micro-animations powered by `motion` (`motion/react`).
- **Typography Pairing**: Elegant headers paired with structural, precise monospaced details (`JetBrains Mono`) for telemetry data indicators and validation responses.
- **Architectural Honesty**: Clean cards with generous negative space, structured data tables, and fully accessible touch targets.

---

## ⚡ Key Architectural Features

### 1. Interactive Operations & Telemetry Hub
- **Live Fleet Analytics**: Real-time insights displayed directly on the landing page using interactive **Recharts** graphics.
- **Daily Booking Volume Velocity**: A dynamic `AreaChart` demonstrating daily equipment requisition holds.
- **Rental Rate Benchmark**: A dual-color `BarChart` detailing standard enterprise dispatch rates per 24-hour cycle.
- **Operational KPIs**: Quick diagnostics tracker monitoring fleet utilization ($94.8\%$), average KYC-to-dispatch turnaround time ($1.8\text{ hrs}$), and calibration accuracy.

### 2. State-Driven Adaptive Navigation
- **Dynamic Session Tracker**: The navbar evaluates active credentials and custom session variables to adjust visual pathways dynamically.
- **Navigation Paths**: Rendered paths adapt between exactly **3 paths** (Public: *Home, Explore Tech, About*) and **5 paths** (Authenticated: *Home, Explore Tech, Dashboard, List Tech, About*) to keep workflows secure and decluttered.

### 3. Smart Schema Validation Guardrails
- **Real-Time Context Checking**: Requisition and authentication forms execute micro-validations on keystroke and field blur.
- **Strict Format Controls**: 
  - Unique physical identification codes must adhere to standard serialization rules (e.g., matching the `SN-` prefix).
  - Pricing thresholds are restricted to dynamic ranges (e.g., cap limits at $10,000 max daily rates).
  - Custom visual warning callouts render instantly with accompanying semantic feedback toast alerts.

### 4. Enterprise-Grade Inventory Dashboard
- **Asset Lifecycles**: Add, update, and deprecate gear items securely.
- **Unified Actions Grid**: Integrated handlers for modifying technical descriptions, short-hand features, high-resolution visual previews, and equipment parameters.

---

## 🛠️ Technology Stack & Libraries

- **Framework**: React 18+ with TypeScript (TSX)
- **Bundler**: Vite (fully optimized dev/prod environments)
- **Styling**: Tailwind CSS (with utility classes, responsive variants, and custom color mappings)
- **Animations**: `motion` (`motion/react`)
- **Data Visualizations**: Recharts (`recharts` using responsive containers, area charts, and bar charts)
- **Iconography**: Lucide React (`lucide-react`)

---

## 🔑 Demo Credentials & Schema Hub

For immediate validation, use the built-in autofill triggers on the **Sign In** screen or input the credentials manually:

| Account Type | Email | Password | Allowed Navigation Scope |
| :--- | :--- | :--- | :--- |
| **Tester Account** | `tester@electrorent.com` | `TesterPass123` | Full Explorer, Booking holds, Public Paths |
| **Admin Account** | `admin@electrorent.com` | `AdminPass123` | Inventory Management, Requisition Form, All 5 Paths |

---

## 📁 Project Directory Layout

```bash
├── src/
│   ├── components/
│   │   ├── Navbar.tsx         # Responsive adaptive navigation system
│   │   ├── Footer.tsx         # Persistent page footer with reviewer schema info
│   │   └── GadgetCard.tsx     # High-fidelity product card with hover motion
│   ├── views/
│   │   ├── HomeView.tsx       # 7-section landing page featuring Live Telemetry Recharts
│   │   ├── ExploreView.tsx    # Responsive product search, filter, & showcase layout
│   │   ├── AddItemView.tsx    # Technical equipment addition form with strict validation
│   │   ├── DetailsView.tsx    # Deep dive specifications sheet with active booking actions
│   │   ├── AuthView.tsx       # Secured login with double-role autofill parameters
│   │   └── ManageInventory.tsx# Administrative asset database grid & list controller
│   ├── types.ts               # Shared TypeScript schemas, interfaces, and types
│   ├── App.tsx                # Central Router & Global State Engine
│   └── index.css              # Custom font bindings (Inter/Space Grotesk) and Tailwind configuration
├── package.json               # Node.js workspace dependencies and run scripts
└── metadata.json              # Platform capabilities mapping
```

---

## 🚀 Running the Project Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Launch the Dev Server**:
   ```bash
   npm run dev
   ```
   The development server will mount locally.

3. **Production Build Compilation**:
   ```bash
   npm run build
   ```
   Compiles static, production-grade assets directly into `/dist`.
