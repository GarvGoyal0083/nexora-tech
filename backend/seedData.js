// backend/seedData.js
// Rich seed dataset for Nexora Tech premium electronics store

const initialProducts = [
  // --- LAPTOPS ---
  {
    title: "ASUS ROG Strix SCAR 18 (2024)",
    slug: "asus-rog-strix-scar-18-2024",
    description: "Dominance engineered. Powered by the Intel Core i9-14900HX processor and NVIDIA GeForce RTX 4090 Laptop GPU with 175W max TGP. Boasts a breathtaking 18-inch 2.5K 240Hz/3ms ROG Nebula HDR Mini LED display.",
    short_description: "18\" 2.5K 240Hz Mini LED | i9-14900HX | RTX 4090 16GB | 32GB DDR5 | 2TB Gen4 SSD",
    category: "Laptops",
    subcategory: "Gaming Laptops",
    condition: "New",
    condition_notes: "Brand new factory sealed in original ROG armor box with complete accessories.",
    brand: "ASUS ROG",
    price: 3699.99,
    original_price: 3999.99,
    discount_pct: 8,
    stock: 14,
    sku: "NEX-LPT-ROG18-01",
    rating: 4.9,
    reviews_count: 48,
    is_featured: 1,
    is_deal: 1,
    deal_badge: "FLAGSHIP BEAST",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Intel Core i9-14900HX (24 cores, 32 threads, up to 5.8 GHz)",
      "Graphics": "NVIDIA GeForce RTX 4090 16GB GDDR6 (175W TGP)",
      "Memory": "32GB DDR5-5600MHz (Expandable to 64GB)",
      "Storage": "2TB PCIe 4.0 NVMe M.2 Performance SSD",
      "Display": "18\" QHD+ (2560 x 1600) 16:10, 240Hz, 3ms, Mini LED 1100 nits, 100% DCI-P3",
      "Operating System": "Windows 11 Pro",
      "Weight": "3.10 kg (6.83 lbs)",
      "Connectivity": "Wi-Fi 7 + Bluetooth 5.4, 2.5G LAN, Thunderbolt 4",
      "Battery": "90Whr with 330W Fast Charger"
    }),
    key_features: JSON.stringify([
      "ROG Nebula HDR Mini LED Display with over 2000 dimming zones",
      "Conductonaut Extreme Liquid Metal on both CPU and GPU",
      "Tri-Fan technology with full-surround heatsink vents",
      "Per-key RGB mechanical-feel keyboard with Aura Sync"
    ]),
    warranty: "2 Years ASUS Global On-Site Warranty"
  },
  {
    title: "Apple MacBook Pro 16\" M3 Max",
    slug: "apple-macbook-pro-16-m3-max",
    description: "Mind-blowing. Head-turning. MacBook Pro blasts forward with the M3 Max chip, an insanely advanced chip designed for punishing creative and computational workflows.",
    short_description: "16.2\" Liquid Retina XDR | M3 Max 16-Core CPU | 40-Core GPU | 48GB Unified RAM | 1TB SSD",
    category: "Laptops",
    subcategory: "Ultrabooks & Workstations",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Certified Refurbished Grade A+. Flawless cosmetic condition, 100% battery health capacity, verified Apple diagnostic check pass. Includes OEM MagSafe charger and Nexora 1-Year Guarantee.",
    brand: "Apple",
    price: 3299.99,
    original_price: 3999.99,
    discount_pct: 18,
    stock: 9,
    sku: "NEX-LPT-MBP16-REF",
    rating: 4.95,
    reviews_count: 62,
    is_featured: 1,
    is_deal: 1,
    deal_badge: "CERTIFIED REFURBISHED SAVE $700",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Apple M3 Max (16-core CPU: 12 performance and 4 efficiency)",
      "Graphics": "40-core GPU with hardware-accelerated ray tracing",
      "Memory": "48GB Unified Memory (300GB/s bandwidth)",
      "Storage": "1TB Apple Ultra-Fast SSD",
      "Display": "16.2\" Liquid Retina XDR (3456 x 2234), 120Hz ProMotion, 1600 nits peak HDR",
      "Operating System": "macOS Sonoma (Upgradable to macOS Sequoia)",
      "Weight": "2.16 kg (4.8 lbs)",
      "Battery Life": "Up to 22 hours video playback, 100Whr",
      "Refurbished Grade": "Grade A+ (Pristine, Zero Scratches, 98-100% Battery)"
    }),
    key_features: JSON.stringify([
      "Nexora 52-Point Hardware Certification with certified battery health",
      "Hardware-accelerated mesh shading & ray tracing",
      "Six-speaker sound system with force-cancelling woofers",
      "Includes 140W USB-C Power Adapter and braided MagSafe 3 Cable"
    ]),
    warranty: "1 Year Nexora Tech Certified Comprehensive Warranty"
  },
  {
    title: "Lenovo Legion Pro 7i Gen 9 (2024)",
    slug: "lenovo-legion-pro-7i-gen-9",
    description: "AI-tuned gaming supremacy. Driven by Lenovo Legion ColdFront Vapor thermal technology, Intel Core i9-14900HX, and NVIDIA GeForce RTX 4080.",
    short_description: "16\" WQXGA 240Hz 500 nits | i9-14900HX | RTX 4080 12GB | 32GB RAM | 1TB SSD",
    category: "Laptops",
    subcategory: "Gaming Laptops",
    condition: "New",
    condition_notes: "Factory sealed brand new Lenovo package.",
    brand: "Lenovo",
    price: 2499.99,
    original_price: 2799.99,
    discount_pct: 11,
    stock: 18,
    sku: "NEX-LPT-LEG7-02",
    rating: 4.8,
    reviews_count: 35,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Intel Core i9-14900HX",
      "Graphics": "NVIDIA GeForce RTX 4080 12GB GDDR6 (175W)",
      "Memory": "32GB (2x16GB) DDR5-5600MHz",
      "Storage": "1TB PCIe Gen4 NVMe M.2 SSD",
      "Display": "16\" 2560x1600 IPS, 240Hz, DisplayHDR 400, 100% sRGB",
      "Operating System": "Windows 11 Home",
      "Weight": "2.8 kg (6.17 lbs)",
      "Battery": "99.9Whr with Super Rapid Charge"
    }),
    key_features: JSON.stringify([
      "Lenovo LA-2 AI chip for frame rate optimization",
      "ColdFront: Vapor Chamber cooling system",
      "TrueStrike Keyboard with per-key RGB lighting"
    ]),
    warranty: "1 Year Lenovo Premier Support"
  },
  {
    title: "Dell XPS 16 (9640) Touch OLED",
    slug: "dell-xps-16-9640-touch-oled",
    description: "Pure modern minimalism with immense computing power. CNC machined aluminum, glass touchpad with haptic feedback, and vibrant 4K+ OLED infinity display.",
    short_description: "16.3\" 4K+ OLED Touch | Core Ultra 9 185H | RTX 4070 | 32GB LPDDR5x | 1TB SSD",
    category: "Laptops",
    subcategory: "Ultrabooks & Workstations",
    condition: "Certified Refurbished - Grade A",
    condition_notes: "Grade A Certified. Minor micro-scratches on underside aluminum panel, glass and screen pristine. Battery health 93%. Includes Dell 130W USB-C charger.",
    brand: "Dell",
    price: 1999.99,
    original_price: 2699.99,
    discount_pct: 26,
    stock: 7,
    sku: "NEX-LPT-XPS16-REF",
    rating: 4.7,
    reviews_count: 24,
    is_featured: 0,
    is_deal: 1,
    deal_badge: "REFURBISHED HOT DEAL",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Intel Core Ultra 9 185H (16 Cores, Intel AI Boost NPU)",
      "Graphics": "NVIDIA GeForce RTX 4070 8GB GDDR6 (60W)",
      "Memory": "32GB LPDDR5x 7467 MT/s",
      "Storage": "1TB PCIe NVMe M.2 SSD",
      "Display": "16.3\" 4K+ (3840 x 2400) OLED Touch, 400 nits, 100% DCI-P3",
      "Operating System": "Windows 11 Pro",
      "Weight": "2.2 kg (4.8 lbs)",
      "Refurbished Grade": "Grade A (93% Battery, Verified Clean)"
    }),
    key_features: JSON.stringify([
      "Zero-lattice capacitive touch function row",
      "Seamless glass haptic touchpad",
      "Quad-speaker design with Waves Nx 3D audio",
      "Nexora 52-Point Quality Certification"
    ]),
    warranty: "1 Year Nexora Tech Certified Warranty"
  },
  {
    title: "Razer Blade 16 Dual-Mode Mini-LED",
    slug: "razer-blade-16-dual-mode",
    description: "The world's first dual-mode Mini-LED display: switch seamlessly between ultra-sharp UHD+ 120Hz for creators and blazing FHD+ 240Hz for competitive gaming.",
    short_description: "16\" Dual Mini-LED (4K 120Hz / FHD 240Hz) | i9-14900HX | RTX 4090 | 64GB DDR5 | 4TB SSD",
    category: "Laptops",
    subcategory: "Gaming Laptops",
    condition: "New",
    condition_notes: "Brand new factory sealed Razer retail packaging.",
    brand: "Razer",
    price: 4199.99,
    original_price: 4499.99,
    discount_pct: 7,
    stock: 5,
    sku: "NEX-LPT-RZ16-01",
    rating: 4.9,
    reviews_count: 19,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Intel Core i9-14900HX",
      "Graphics": "NVIDIA GeForce RTX 4090 16GB VRAM (175W)",
      "Memory": "64GB DDR5-5600MHz Dual Channel",
      "Storage": "4TB (2x2TB) NVMe PCIe 4.0 SSD",
      "Display": "16\" Dual-Mode Mini-LED (UHD+ 120Hz or FHD+ 240Hz)",
      "Operating System": "Windows 11 Home",
      "Weight": "2.45 kg (5.40 lbs)",
      "Chassis": "CNC Aluminum Anodized Matte Black"
    }),
    key_features: JSON.stringify([
      "Patented Dual-Mode display technology",
      "Vapor Chamber Cooling with 0.05mm exhaust fins",
      "Anti-fingerprint resistant finish",
      "THX Spatial Audio 4-speaker array"
    ]),
    warranty: "2 Years Razer Limited Manufacturer Warranty"
  },

  // --- DESKTOP PCS ---
  {
    title: "Nexora CyberApex Titan Gaming PC",
    slug: "nexora-cyberapex-titan-gaming-pc",
    description: "Engineered in-house by Nexora Labs. Custom liquid-cooled loop, dual-chamber panoramic glass chassis, powered by AMD Ryzen 9 7950X3D and NVIDIA GeForce RTX 4090 24GB.",
    short_description: "Custom Hardline Liquid Cooled | Ryzen 9 7950X3D | RTX 4090 24GB | 64GB DDR5 RGB | 4TB NVMe SSD",
    category: "Desktop PCs",
    subcategory: "Gaming Desktops",
    condition: "New",
    condition_notes: "Hand-assembled and stress-tested for 72 hours by Nexora master system architects.",
    brand: "Nexora",
    price: 4499.99,
    original_price: 4899.99,
    discount_pct: 8,
    stock: 8,
    sku: "NEX-DT-CYBER-01",
    rating: 5.0,
    reviews_count: 31,
    is_featured: 1,
    is_deal: 1,
    deal_badge: "NEXORA SIGNATURE BUILD",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "AMD Ryzen 9 7950X3D (16 Cores, 32 Threads, 144MB 3D V-Cache)",
      "Cooling": "Nexora CryoLoop Custom Hardline 360mm Distribution Plate Liquid Cooling",
      "Motherboard": "ASUS ROG Crosshair X670E Hero",
      "Graphics": "NVIDIA GeForce RTX 4090 24GB GDDR6X",
      "Memory": "64GB (2x32GB) Corsair Dominator Titanium DDR5-6000 CL30",
      "Storage": "4TB Crucial T700 PCIe Gen5 NVMe SSD (up to 12,400 MB/s)",
      "Power Supply": "Corsair RM1200x SHIFT 1200W 80+ Gold Fully Modular ATX 3.0",
      "Chassis": "Lian Li O11 Vision Dual-Chamber Tempered Glass (Obsidian Edition)",
      "Operating System": "Windows 11 Pro Clean Nexora Edition"
    }),
    key_features: JSON.stringify([
      "Zero bloatware clean installation",
      "Individually sleeved cable combs and custom fluid color",
      "Pre-configured undervolt and memory EXPO profiles",
      "VIP 24/7 dedicated hardware concierge"
    ]),
    warranty: "3 Years Nexora Full Comprehensive Parts & Labor Warranty"
  },
  {
    title: "HP OMEN 45L Gaming Desktop",
    slug: "hp-omen-45l-gaming-desktop",
    description: "Features the revolutionary Cryo Chamber cooling zone that pulls cool ambient air from outside the case to drop CPU temperatures by up to 6°C.",
    short_description: "Intel i9-14900K | RTX 4080 Super 16GB | 32GB Kingston FURY DDR5 | 2TB SSD",
    category: "Desktop PCs",
    subcategory: "Gaming Desktops",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Grade A+ Certified Refurbished. Cleaned, fully inspected, zero chassis blemishes. Certified under HP OEM refurbishment standard with new packaging.",
    brand: "HP",
    price: 2399.99,
    original_price: 3199.99,
    discount_pct: 25,
    stock: 12,
    sku: "NEX-DT-OMEN45-REF",
    rating: 4.8,
    reviews_count: 27,
    is_featured: 1,
    is_deal: 1,
    deal_badge: "SAVE $800 REFURBISHED",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Intel Core i9-14900K (24 cores)",
      "Graphics": "NVIDIA GeForce RTX 4080 Super 16GB GDDR6X",
      "Cooling": "OMEN Cryo Chamber 360mm Liquid Cooler",
      "Memory": "32GB Kingston FURY DDR5-5200 RGB",
      "Storage": "2TB WD Black PCIe 4.0 NVMe SSD",
      "Power Supply": "1000W 80 Plus Gold ATX Power Supply",
      "Operating System": "Windows 11 Home",
      "Refurbished Grade": "Grade A+ (Certified Like-New)"
    }),
    key_features: JSON.stringify([
      "OMEN Cryo Chamber external thermal architecture",
      "Toolless chassis access with tempered glass front and side",
      "Complete ARGB synchronized ecosystem",
      "Nexora 52-point inspection passed"
    ]),
    warranty: "1 Year Nexora Tech Certified Warranty"
  },
  {
    title: "Apple Mac Studio M2 Ultra (Refurbished)",
    slug: "apple-mac-studio-m2-ultra",
    description: "Astonishing performance in an impossibly compact footprint. Powered by Apple M2 Ultra with 24-core CPU and 60-core GPU, ready for multi-stream 8K ProRes video and machine learning.",
    short_description: "Apple M2 Ultra (24C CPU / 60C GPU) | 64GB Unified RAM | 1TB NVMe SSD",
    category: "Desktop PCs",
    subcategory: "Workstations",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Grade A+ Apple Certified Refurbished condition. Pristine condition with original power cord and factory white refurbishment box.",
    brand: "Apple",
    price: 3399.99,
    original_price: 3999.99,
    discount_pct: 15,
    stock: 6,
    sku: "NEX-DT-MACSTUD-REF",
    rating: 4.9,
    reviews_count: 18,
    is_featured: 0,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Processor": "Apple M2 Ultra (24-core CPU)",
      "Graphics": "60-core integrated GPU with 32-core Neural Engine",
      "Memory": "64GB Unified Memory (800GB/s bandwidth)",
      "Storage": "1TB Apple Solid State Storage",
      "Ports": "6x Thunderbolt 4, 2x USB-A, 10Gb Ethernet, HDMI 2.1, SDXC slot",
      "Weight": "3.6 kg (7.9 lbs)",
      "Operating System": "macOS Sonoma"
    }),
    key_features: JSON.stringify([
      "Runs up to 22 streams of 8K ProRes 422 video playback",
      "Supports up to eight 4K displays or six 6K displays",
      "Thermal design is whisper quiet under extreme loads"
    ]),
    warranty: "1 Year Nexora Tech Certified Warranty"
  },

  // --- MONITORS ---
  {
    title: "Samsung Odyssey OLED G9 49\" Curved",
    slug: "samsung-odyssey-oled-g9-49",
    description: "The apex of curved immersion. 49-inch Dual QHD QD-OLED panel with 1800R curvature, 240Hz refresh rate, and an instantaneous 0.03ms response time.",
    short_description: "49\" Dual QHD (5120x1440) QD-OLED | 240Hz | 0.03ms | Neo Quantum Processor Pro | 1800R",
    category: "Monitors",
    subcategory: "Gaming Monitors",
    condition: "New",
    condition_notes: "Brand new retail boxed unit with all cables and premium metal stand.",
    brand: "Samsung",
    price: 1399.99,
    original_price: 1799.99,
    discount_pct: 22,
    stock: 16,
    sku: "NEX-MON-G9OLED-01",
    rating: 4.85,
    reviews_count: 53,
    is_featured: 1,
    is_deal: 1,
    deal_badge: "HOT DEAL $400 OFF",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Screen Size": "49 Inch Ultra-Wide (32:9 Aspect Ratio)",
      "Resolution": "Dual QHD (5120 x 1440)",
      "Panel Type": "Quantum Dot OLED (QD-OLED)",
      "Refresh Rate": "240Hz",
      "Response Time": "0.03ms (GtG)",
      "Curvature": "1800R",
      "HDR": "VESA DisplayHDR True Black 400",
      "Ports": "1x DisplayPort 1.4, 1x HDMI 2.1, 1x Micro HDMI 2.1, USB Hub",
      "Special": "CoreSync & Core Lighting+ ambient backlights, Smart TV Hub built-in"
    }),
    key_features: JSON.stringify([
      "Equivalent to two 27-inch 1440p displays side-by-side with zero bezels",
      "QD-OLED creates infinite contrast and true black levels",
      "AMD FreeSync Premium Pro certification",
      "Slim metal frame design measuring just 4.5mm at its thinnest edge"
    ]),
    warranty: "3 Years Samsung Manufacturer Warranty including OLED burn-in coverage"
  },
  {
    title: "ASUS ROG Swift OLED PG32UCDM 32\" 4K 240Hz",
    slug: "asus-rog-swift-oled-pg32ucdm",
    description: "The definitive gaming monitor. 32-inch 4K UHD QD-OLED display, 240Hz refresh rate, 3rd-Gen QD-OLED panel, custom graphene film heatsink for cooling without noisy fans.",
    short_description: "32\" 4K UHD (3840x2160) QD-OLED | 240Hz | 0.03ms | Type-C 90W PD | KVM Switch",
    category: "Monitors",
    subcategory: "Gaming Monitors",
    condition: "New",
    condition_notes: "Brand new factory sealed ROG retail packaging.",
    brand: "ASUS ROG",
    price: 1299.99,
    original_price: 1399.99,
    discount_pct: 7,
    stock: 11,
    sku: "NEX-MON-PG32-01",
    rating: 4.9,
    reviews_count: 39,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Screen Size": "31.5 Inch 16:9",
      "Resolution": "3840 x 2160 (4K UHD)",
      "Panel Type": "3rd Gen QD-OLED",
      "Refresh Rate": "240Hz",
      "Response Time": "0.03ms",
      "Color Accuracy": "Delta E < 2, 99% DCI-P3",
      "Brightness": "1000 nits (3% APL peak), 250 nits 100% window",
      "Ports": "2x HDMI 2.1, 1x DisplayPort 1.4 DSC, 1x USB-C (90W PD)",
      "Heatsink": "Custom heatsink with graphene film rear panel"
    }),
    key_features: JSON.stringify([
      "Uniform Brightness setting protects eyes and avoids ABL dips",
      "Integrated smart KVM switch for 2 PCs",
      "Dolby Vision HDR and HDR10 support"
    ]),
    warranty: "3 Years ASUS Warranty with Burn-In Guarantee"
  },
  {
    title: "Dell UltraSharp 38\" Curved USB-C Hub (U3824DW)",
    slug: "dell-ultrasharp-38-curved-u3824dw",
    description: "The ultimate productivity powerhouse. 37.5-inch WQHD+ IPS Black panel with 2000:1 contrast ratio, 90W USB-C hub, and integrated RJ45 2.5G Ethernet.",
    short_description: "38\" WQHD+ (3840x1600) IPS Black | 2000:1 Contrast | 90W USB-C Hub | Built-in KVM",
    category: "Monitors",
    subcategory: "Productivity Monitors",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Grade A+ Certified Refurbished. Inspected, calibrated, zero dead pixels. Factory re-boxed with all factory cables.",
    brand: "Dell",
    price: 899.99,
    original_price: 1349.99,
    discount_pct: 33,
    stock: 14,
    sku: "NEX-MON-U3824-REF",
    rating: 4.8,
    reviews_count: 22,
    is_featured: 0,
    is_deal: 1,
    deal_badge: "33% OFF CERTIFIED REFURBISHED",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Screen Size": "37.5 Inch Curved (2300R)",
      "Resolution": "3840 x 1600 (21:9 WQHD+)",
      "Panel Type": "IPS Black Technology (2000:1 Contrast)",
      "Color Gamut": "98% DCI-P3, 100% sRGB",
      "Ports": "USB-C (90W PD), DisplayPort 1.4, 2x HDMI 2.1, 2.5Gbps RJ45 Ethernet, 5x USB-A 10Gbps",
      "Speakers": "Integrated dual 9W stereo speakers",
      "Refurbished Grade": "Grade A+ (Calibrated, Zero Pixel Defects)"
    }),
    key_features: JSON.stringify([
      "IPS Black technology delivers 41% deeper black levels than conventional IPS",
      "Auto KVM connects two PCs and toggles controls effortlessly",
      "Built-in RJ45 Ethernet pass-through"
    ]),
    warranty: "1 Year Nexora Tech Certified Comprehensive Warranty"
  },

  // --- COMPUTER COMPONENTS ---
  {
    title: "NVIDIA GeForce RTX 4090 Founders Edition 24GB",
    slug: "nvidia-geforce-rtx-4090-founders-edition",
    description: "The pinnacle of GPU engineering. Powered by Ada Lovelace architecture, 16,384 CUDA cores, 24GB of ultra-fast GDDR6X VRAM, and full DLSS 3.5 Frame Generation.",
    short_description: "24GB GDDR6X | 16384 CUDA Cores | 384-bit Bus | Ada Lovelace Architecture | DLSS 3.5",
    category: "Components",
    subcategory: "Graphics Cards",
    condition: "New",
    condition_notes: "Brand new factory sealed NVIDIA Founders Edition in original black unboxing box.",
    brand: "NVIDIA",
    price: 1799.99,
    original_price: 1999.99,
    discount_pct: 10,
    stock: 9,
    sku: "NEX-CMP-RTX4090-FE",
    rating: 4.95,
    reviews_count: 78,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "TOP SELLER",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "CUDA Cores": "16,384",
      "Boost Clock": "2.52 GHz",
      "Memory Size": "24 GB GDDR6X",
      "Memory Interface": "384-bit",
      "Outputs": "3x DisplayPort 1.4a, 1x HDMI 2.1a",
      "Power Connector": "1x 16-pin 12VHPWR (adapter included)",
      "Recommended PSU": "850W minimum (1000W recommended)",
      "Card Dimensions": "304 mm x 137 mm, 3-slot"
    }),
    key_features: JSON.stringify([
      "Ada Lovelace 4th Gen Tensor Cores & 3rd Gen RT Cores",
      "Dual axial flow-through cooling fans for quiet thermals",
      "NVIDIA Studio & Reflex low latency suite"
    ]),
    warranty: "3 Years NVIDIA Global Warranty"
  },
  {
    title: "ASUS ROG Strix GeForce RTX 4080 Super OC 16GB",
    slug: "asus-rog-strix-rtx-4080-super-oc",
    description: "Enhanced power delivery, massive patented vapor chamber heatsink, and die-cast metal exoskeleton frame. Built to sustain maximum clocks under continuous load.",
    short_description: "16GB GDDR6X | Factory Overclocked | Triple Axial-Tech Fans | Aura Sync RGB",
    category: "Components",
    subcategory: "Graphics Cards",
    condition: "New",
    condition_notes: "Brand new sealed in original ASUS ROG retail box.",
    brand: "ASUS ROG",
    price: 1149.99,
    original_price: 1249.99,
    discount_pct: 8,
    stock: 15,
    sku: "NEX-CMP-4080S-ROG",
    rating: 4.88,
    reviews_count: 42,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "CUDA Cores": "10,240",
      "Boost Clock": "2670 MHz (OC Mode)",
      "Memory Size": "16 GB GDDR6X",
      "Memory Speed": "23 Gbps",
      "Interface": "PCIe 4.0 x16",
      "Cooling": "Patented milled vapor chamber with 3.5-slot heatsink",
      "Dimensions": "357.6 x 149.3 x 70.1 mm"
    }),
    key_features: JSON.stringify([
      "Axial-tech fans scaled up for 23% more airflow",
      "Dual BIOS switch for Quiet or Performance fan curves",
      "Integrated GPU bracket included to eliminate card sag"
    ]),
    warranty: "3 Years ASUS Manufacturer Warranty"
  },
  {
    title: "Intel Core i9-14900KS Special Edition Processor",
    slug: "intel-core-i9-14900ks",
    description: "The fastest desktop processor in the world. Record-breaking 6.2 GHz max turbo frequency straight out of the box with 24 cores and 32 threads.",
    short_description: "24 Cores (8P + 16E) | Up to 6.2 GHz Max Turbo | LGA1700 | 36MB Intel Smart Cache",
    category: "Components",
    subcategory: "Processors (CPUs)",
    condition: "New",
    condition_notes: "Special Edition collector silver wafer packaging.",
    brand: "Intel",
    price: 649.99,
    original_price: 699.99,
    discount_pct: 7,
    stock: 12,
    sku: "NEX-CMP-I9-14900KS",
    rating: 4.9,
    reviews_count: 29,
    is_featured: 0,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Cores / Threads": "24 Cores (8 Performance + 16 Efficient) / 32 Threads",
      "Max Clock": "Up to 6.2 GHz Intel Thermal Velocity Boost",
      "Cache": "36MB Intel Smart Cache, 32MB L2 Cache",
      "Socket": "LGA1700 (Compatible with Z790/Z690)",
      "Memory Support": "DDR5-5600, DDR4-3200",
      "PCIe Lanes": "PCIe 5.0 and 4.0 support",
      "TDP / Max Power": "150W Base, 253W+ Extreme Power Profile"
    }),
    key_features: JSON.stringify([
      "Intel Application Optimization (APO) for ultra-high FPS in games",
      "Unlocked for extreme overclocking",
      "Integrated Intel UHD Graphics 770"
    ]),
    warranty: "3 Years Intel Limited Warranty"
  },
  {
    title: "AMD Ryzen 7 7800X3D Desktop Processor",
    slug: "amd-ryzen-7-7800x3d",
    description: "The undisputed champion of PC gaming. Features 2nd generation AMD 3D V-Cache technology delivering massive 96MB L3 cache and unbeatable efficiency in AAA gaming.",
    short_description: "8 Cores, 16 Threads | Up to 5.0 GHz | 104MB Cache with 3D V-Cache | Socket AM5",
    category: "Components",
    subcategory: "Processors (CPUs)",
    condition: "New",
    condition_notes: "Brand new retail boxed unit.",
    brand: "AMD",
    price: 389.99,
    original_price: 449.99,
    discount_pct: 13,
    stock: 22,
    sku: "NEX-CMP-RYZ-7800X3D",
    rating: 4.98,
    reviews_count: 112,
    is_featured: 1,
    is_deal: 1,
    deal_badge: "BEST GAMING CPU",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Cores / Threads": "8 Cores / 16 Threads",
      "Base / Boost Clock": "4.2 GHz / 5.0 GHz",
      "L3 Cache": "96MB 3D V-Cache (104MB Total Cache)",
      "Socket": "Socket AM5 (X670, B650)",
      "TDP": "120W (Ultra efficient ~55-80W in real gaming)",
      "Architecture": "Zen 4 (TSMC 5nm)"
    }),
    key_features: JSON.stringify([
      "Unmatched 1% low frame rates in esports and simulator titles",
      "Low power consumption and easy to air-cool",
      "Supports AMD EXPO one-click memory overclocking"
    ]),
    warranty: "3 Years AMD Boxed Processor Warranty"
  },
  {
    title: "Corsair Dominator Titanium RGB 64GB (2x32GB) DDR5-6000",
    slug: "corsair-dominator-titanium-64gb-ddr5",
    description: "Clean, refined styling with precision forged aluminum construction and 11 vibrant individually addressable RGB LEDs. Modular top bars let you customize your build aesthetics.",
    short_description: "64GB (2x32GB) DDR5 6000MHz CL30 | Intel XMP 3.0 & AMD EXPO | Black Edition",
    category: "Components",
    subcategory: "Memory (RAM)",
    condition: "New",
    condition_notes: "Sealed retail dual pack.",
    brand: "Corsair",
    price: 299.99,
    original_price: 339.99,
    discount_pct: 12,
    stock: 25,
    sku: "NEX-CMP-RAM-DOM64",
    rating: 4.9,
    reviews_count: 36,
    is_featured: 0,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Capacity": "64GB (2x32GB)",
      "Speed": "DDR5-6000 MT/s",
      "Latency": "CL30 (30-36-36-76)",
      "Voltage": "1.40V",
      "Profiles": "Dual Ready: Intel XMP 3.0 & AMD EXPO",
      "Cooling": "Patented DHX cooling with custom aluminum heatsinks"
    }),
    key_features: JSON.stringify([
      "Swappable top bars for personalized aesthetics",
      "iCUE software real-time frequency and temperature monitoring",
      "Tightly screened memory ICs for high overclocking headroom"
    ]),
    warranty: "Corsair Limited Lifetime Warranty"
  },
  {
    title: "Samsung 990 PRO 4TB PCIe 4.0 NVMe SSD with Heatsink",
    slug: "samsung-990-pro-4tb-nvme-heatsink",
    description: "Ultimate speed, sustained power. Sequential read/write speeds up to 7,450/6,900 MB/s. Built-in low-profile heatsink fits PlayStation 5 and high-end PC motherboards.",
    short_description: "4TB NVMe M.2 2280 | Speeds up to 7450 MB/s | Custom Heatsink | PS5 & PC Compatible",
    category: "Components",
    subcategory: "Storage (SSD)",
    condition: "New",
    condition_notes: "Brand new in retail box.",
    brand: "Samsung",
    price: 329.99,
    original_price: 379.99,
    discount_pct: 13,
    stock: 30,
    sku: "NEX-CMP-SSD-990P4TB",
    rating: 4.96,
    reviews_count: 85,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "FASTEST GEN4 SSD",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Capacity": "4,000 GB (4TB)",
      "Interface": "PCIe Gen 4.0 x4, NVMe 2.0",
      "Sequential Read": "Up to 7,450 MB/s",
      "Sequential Write": "Up to 6,900 MB/s",
      "Random Read/Write": "Up to 1,600,000 / 1,550,000 IOPS",
      "Endurance (TBW)": "2,400 TBW",
      "Form Factor": "M.2 2280 with integrated thermal heatsink"
    }),
    key_features: JSON.stringify([
      "Over 50% improved power efficiency compared to 980 PRO",
      "Smart thermal control and nickel-coated controller",
      "Samsung Magician software suite for firmware updates and health checks"
    ]),
    warranty: "5 Years Samsung Limited Warranty"
  },

  // --- PRINTERS ---
  {
    title: "Epson EcoTank Pro ET-5850 All-in-One Supertank Printer",
    slug: "epson-ecotank-pro-et-5850",
    description: "Heavy-duty business printing without cartridge rip-offs. High-speed, cartridge-free printing powered by PrecisionCore Heat-Free Technology. Generates crisp laser-quality black & color prints with extremely low cost per page.",
    short_description: "Cartridge-Free Supertank | Auto 2-Sided Print/Copy/Scan/Fax | 25 ppm ISO | 500-Sheet Tray",
    category: "Printers",
    subcategory: "Inkjet Supertank Printers",
    condition: "New",
    condition_notes: "Brand new sealed in original Epson box with up to 2 years of ink bottles included in box.",
    brand: "Epson",
    price: 849.99,
    original_price: 999.99,
    discount_pct: 15,
    stock: 14,
    sku: "NEX-PRN-ET5850-01",
    rating: 4.75,
    reviews_count: 38,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Print Speed": "Up to 25 ISO ppm in black and 25 ISO ppm in color",
      "Resolution": "4800 x 1200 optimized dpi",
      "Paper Capacity": "500-sheet front paper trays (2x250) + 50-sheet rear specialty feed",
      "Auto Document Feeder": "50-sheet dual-scan ADF (single-pass 2-sided scanning)",
      "Touchscreen": "4.3\" color touchscreen display",
      "Connectivity": "Wi-Fi 5, Wi-Fi Direct, Ethernet, Hi-Speed USB, AirPrint"
    }),
    key_features: JSON.stringify([
      "Save up to 80% with low-cost replacement ink bottles vs. standard laser toner",
      "DURABrite pigment inks are instant-drying, smudge, and water resistant",
      "Zero warmup time for blazing fast first page out"
    ]),
    warranty: "2 Years Epson Manufacturer Warranty with Registration"
  },
  {
    title: "HP Color LaserJet Enterprise MFP M480f (Refurbished)",
    slug: "hp-color-laserjet-enterprise-mfp-m480f",
    description: "Enterprise security and blazing print speeds. Certified refurbished commercial grade multifunction printer with self-healing security firmware and robust automatic duplex printing.",
    short_description: "Enterprise Multifunction Laser | 29 ppm Color & Black | Auto Duplex | HP Sure Start Security",
    category: "Printers",
    subcategory: "Laser Printers",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Grade A+ Certified Refurbished. Total page count under 2,000 pages (rated for 50k monthly). Fully cleaned roller assembly, brand new HP Genuine toner set pre-installed.",
    brand: "HP",
    price: 649.99,
    original_price: 1049.99,
    discount_pct: 38,
    stock: 8,
    sku: "NEX-PRN-M480F-REF",
    rating: 4.82,
    reviews_count: 19,
    is_featured: 0,
    is_deal: 1,
    deal_badge: "SAVE $400 ENTERPRISE REFURBISHED",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Print Technology": "Laser (HP ColorSphere 3 Toner)",
      "Print Speed": "Up to 29 ppm letter (black & color)",
      "Duplex Printing": "Automatic 2-sided standard",
      "Scan Speed": "Up to 49 ipm black, 36 ipm color",
      "Duty Cycle": "Up to 55,000 pages monthly",
      "Security": "HP Sure Start BIOS integrity validation & run-time intrusion detection",
      "Refurbished Grade": "Grade A+ (New OEM Toner Pre-installed)"
    }),
    key_features: JSON.stringify([
      "World's most secure printing architecture with automatic firmware self-repair",
      "Centralized fleet management with HP Web Jetadmin",
      "Nexora 52-point mechanical and optical scan inspection"
    ]),
    warranty: "1 Year Nexora Tech Certified Warranty"
  },
  {
    title: "Brother MFC-L3780CDW Wireless Color All-in-One",
    slug: "brother-mfc-l3780cdw-color-laser",
    description: "Compact digital color all-in-one printer with single-pass duplex copying and scanning. Ideal for busy home offices and agile small businesses.",
    short_description: "Digital Color All-in-One | 31 ppm | Single-Pass Duplex Scan | 3.5\" Touchscreen",
    category: "Printers",
    subcategory: "Laser Printers",
    condition: "New",
    condition_notes: "Brand new factory sealed Brother retail box.",
    brand: "Brother",
    price: 439.99,
    original_price: 499.99,
    discount_pct: 12,
    stock: 19,
    sku: "NEX-PRN-BRO3780-01",
    rating: 4.7,
    reviews_count: 26,
    is_featured: 0,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Print Speed": "Up to 31 ppm (Color & Monochrome)",
      "Paper Tray": "250-sheet adjustable paper tray + 30-sheet multipurpose tray",
      "ADF Capacity": "50-sheet dual-scan automatic document feeder",
      "Display": "3.5\" intuitive color touchscreen",
      "Wireless": "Dual band wireless (2.4GHz / 5GHz), Gigabit Ethernet, USB"
    }),
    key_features: JSON.stringify([
      "Single-pass two-sided copy and scan saves significant workflow time",
      "Mobile printing via Brother Mobile Connect, Apple AirPrint, Mopria",
      "Triple-layer security features safeguard sensitive documents"
    ]),
    warranty: "1 Year Brother Manufacturer Warranty"
  },

  // --- ACCESSORIES & PERIPHERALS ---
  {
    title: "Razer DeathAdder V3 Pro Wireless Gaming Mouse",
    slug: "razer-deathadder-v3-pro-wireless",
    description: "Victory takes on a new shape. Refined by top esports professionals, this ultra-lightweight 63g ergonomic weapon features the Focus Pro 30K Optical Sensor and Gen-3 Optical Switches.",
    short_description: "63g Ultra-Lightweight | Focus Pro 30K Optical Sensor | 90-Hour Battery | 4000Hz HyperPolling",
    category: "Accessories",
    subcategory: "Mice & Pointers",
    condition: "New",
    condition_notes: "Factory sealed retail box with Speedflex charging cable and 2.4GHz wireless dongle.",
    brand: "Razer",
    price: 149.99,
    original_price: 169.99,
    discount_pct: 11,
    stock: 45,
    sku: "NEX-ACC-RZ-DAV3",
    rating: 4.92,
    reviews_count: 94,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "ESPORTS FAVORITE",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Sensor": "Focus Pro 30K Optical Sensor (99.8% resolution accuracy)",
      "Max Sensitivity": "30,000 DPI",
      "Max Acceleration": "70 G",
      "Switches": "Optical Mouse Switches Gen-3 (90-million click lifecycle, zero debounce)",
      "Battery Life": "Up to 90 hours at 1000Hz (Type-C rechargeable)",
      "Weight": "63 grams (Ultra-light ergonomic)",
      "Connectivity": "Razer HyperSpeed Wireless + USB-C Wired"
    }),
    key_features: JSON.stringify([
      "Asymmetric cut-off with 26 granular height adjustments",
      "Smooth glide 100% PTFE mouse feet",
      "Flawless ergonomic contours developed with pro CS2 and Valorant players"
    ]),
    warranty: "2 Years Razer Manufacturer Warranty"
  },
  {
    title: "SteelSeries Apex Pro TKL (2023) Mechanical Keyboard",
    slug: "steelseries-apex-pro-tkl-2023",
    description: "The world's fastest keyboard. Powered by OmniPoint 2.0 adjustable hypermagnetic switches with Rapid Trigger functionality and customizable actuation from 0.2mm to 3.8mm.",
    short_description: "OmniPoint 2.0 HyperMagnetic Switches | Rapid Trigger | OLED Smart Display | Aircraft Aluminum",
    category: "Accessories",
    subcategory: "Keyboards",
    condition: "New",
    condition_notes: "Sealed retail box with magnetic soft-touch wrist rest included.",
    brand: "SteelSeries",
    price: 189.99,
    original_price: 219.99,
    discount_pct: 13,
    stock: 35,
    sku: "NEX-ACC-SS-APEXPRO",
    rating: 4.88,
    reviews_count: 67,
    is_featured: 1,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Switch Type": "OmniPoint 2.0 Adjustable Hall Effect Magnetic Switches",
      "Actuation Range": "0.2 mm to 3.8 mm (40 levels of precision)",
      "Key Lifespan": "100 Million Keypresses guaranteed",
      "Frame Material": "Series 5000 Aircraft Grade Aluminum Top Plate",
      "Display": "OLED Smart Display for profile switching and live game stats",
      "Keycaps": "Double Shot PBT Keycaps",
      "Cable": "Detachable Braided USB Type-C"
    }),
    key_features: JSON.stringify([
      "Rapid Trigger feature resets keys instantaneously with zero physical travel latency",
      "2-in-1 Action Keys program two distinct actions on a single key based on press depth",
      "Per-key dynamic RGB illumination with reactive effects"
    ]),
    warranty: "2 Years SteelSeries Manufacturer Warranty"
  },
  {
    title: "Sony WH-1000XM5 Wireless Noise-Cancelling Headphones",
    slug: "sony-wh-1000xm5-noise-cancelling",
    description: "Industry-leading noise cancellation engineered with two processors and eight microphones. Exceptional hi-res sound quality and crystal clear hands-free calls.",
    short_description: "Industry Leading ANC | 30-Hour Battery | LDAC Hi-Res Audio | Multipoint Bluetooth 5.2",
    category: "Accessories",
    subcategory: "Audio & Headsets",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Grade A+ Certified Refurbished. Thoroughly sanitized, new ear pads replaced, flawless sound stage, includes original hard carrying case and audio cables.",
    brand: "Sony",
    price: 279.99,
    original_price: 399.99,
    discount_pct: 30,
    stock: 20,
    sku: "NEX-ACC-SONYXM5-REF",
    rating: 4.9,
    reviews_count: 51,
    is_featured: 0,
    is_deal: 1,
    deal_badge: "30% OFF CERTIFIED REFURBISHED",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Noise Cancellation": "Dual Processor V1 + HD Noise Cancelling Processor QN1 with 8 microphones",
      "Driver": "Custom engineered 30mm carbon fiber composite driver",
      "Battery Life": "Up to 30 hours with ANC ON (40 hours with ANC OFF)",
      "Fast Charge": "3 minutes charge delivers up to 3 hours of playback",
      "Bluetooth": "Version 5.2 with LDAC, AAC, SBC and Multipoint connection",
      "Weight": "250 grams lightweight noiseless design"
    }),
    key_features: JSON.stringify([
      "Speak-to-chat automatically pauses music when you begin speaking",
      "Precise Voice Pickup technology with 4 beamforming microphones",
      "Nexora 52-point audio diagnostic certified"
    ]),
    warranty: "1 Year Nexora Tech Certified Warranty"
  },
  {
    title: "Elgato Stream Deck XL - 32 Studio Keys",
    slug: "elgato-stream-deck-xl-32-keys",
    description: "The crown jewel of creative command. 32 customizable LCD keys primed to trigger unlimited actions with a single tap. Ideal for live streaming, coding macros, audio production, and 3D modeling.",
    short_description: "32 Customizable LCD Keys | One-Touch Controls | Magnetic Non-Slip Stand | USB-C",
    category: "Accessories",
    subcategory: "Stream & Studio Gear",
    condition: "New",
    condition_notes: "Brand new factory sealed in retail packaging with magnetic stand.",
    brand: "Corsair",
    price: 229.99,
    original_price: 249.99,
    discount_pct: 8,
    stock: 18,
    sku: "NEX-ACC-ELG-XL32",
    rating: 4.94,
    reviews_count: 44,
    is_featured: 0,
    is_deal: 0,
    deal_badge: "",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Keys": "32 customizable tactile LCD keys (8x4 grid)",
      "Interface": "USB 3.0 Type-C",
      "Dimensions": "182 x 112 x 34 mm (without stand)",
      "Weight": "410 g (without stand) / 630 g (with stand)",
      "Compatibility": "Windows 10/11 (64-bit), macOS 10.15 or later",
      "Stand": "Included magnetic non-slip angled stand"
    }),
    key_features: JSON.stringify([
      "Direct integration with OBS, Twitch, YouTube, Spotify, Philips Hue, Discord",
      "Nested folders enable storing hundreds of smart actions",
      "Smart profiles auto-switch button configurations based on active application"
    ]),
    warranty: "2 Years Elgato / Corsair Manufacturer Warranty"
  },
  {
    title: "Logitech MX Master 3S Wireless Performance Mouse",
    slug: "logitech-mx-master-3s",
    description: "An icon remastered. Quiet Clicks, 8,000 DPI track-on-glass sensor, and the MagSpeed electromagnetic scroll wheel that scrolls 1,000 lines in 1 second.",
    short_description: "8K DPI Track Anywhere Sensor | Quiet Clicks | MagSpeed Electromagnetic Scroll | Flow Cross-Computer",
    category: "Accessories",
    subcategory: "Mice & Pointers",
    condition: "Certified Refurbished - Grade A+",
    condition_notes: "Grade A+ Certified Refurbished. Flawless ergonomic finish, perfect battery capacity, includes Logi Bolt USB receiver and USB-C cable.",
    brand: "Logitech",
    price: 69.99,
    original_price: 99.99,
    discount_pct: 30,
    stock: 28,
    sku: "NEX-ACC-MX3S-REF",
    rating: 4.88,
    reviews_count: 73,
    is_featured: 0,
    is_deal: 1,
    deal_badge: "BEST VALUE PRODUCTIVITY",
    images: JSON.stringify([
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80"
    ]),
    specs: JSON.stringify({
      "Sensor": "Darkfield high precision (200 - 8000 DPI in 50 DPI steps)",
      "Buttons": "7 buttons (Left/Right-click, Back/Forward, App-Switch, Wheel mode-shift, Middle click)",
      "Scroll Wheel": "MagSpeed SmartShift with hyper-fast scrolling mode",
      "Thumbwheel": "Side horizontal scroll wheel",
      "Battery Life": "Up to 70 days on a full charge; 1 min quick charge = 3 hours use",
      "Connectivity": "Bluetooth Low Energy + Logi Bolt USB Receiver"
    }),
    key_features: JSON.stringify([
      "Logitech Flow lets you copy-paste text, images, and files between 3 computers",
      "Quiet clicks reduce switch noise by 90% while keeping click feel",
      "Ergonomic silhouette supports palm and thumb naturally"
    ]),
    warranty: "1 Year Nexora Tech Certified Warranty"
  }
];

const initialReviews = [
  {
    product_slug: "asus-rog-strix-scar-18-2024",
    user_name: "Marcus Vance",
    user_email: "marcus.v@example.com",
    rating: 5,
    title: "Absolute thermonuclear beast of a laptop!",
    comment: "Upgraded from a 3070 laptop. The Mini LED screen on this SCAR 18 is brighter than my dedicated monitor. Cyberpunk 2077 with full Path Tracing runs at over 110 FPS using DLSS 3.5. Thermal management is superb. Nexora shipped it within 24 hours in secure tech courier box.",
    verified_purchase: 1,
    created_at: "2026-09-14T10:15:00Z"
  },
  {
    product_slug: "asus-rog-strix-scar-18-2024",
    user_name: "Elena Rostova",
    user_email: "elena.r@example.com",
    rating: 5,
    title: "Replaced my entire desktop workstation",
    comment: "I render 8K Unreal Engine architectural passes. The 14900HX and 4090 laptop chew through renders in a fraction of the time. The 18-inch 16:10 format gives so much real estate on the go.",
    verified_purchase: 1,
    created_at: "2026-09-28T16:40:00Z"
  },
  {
    product_slug: "apple-macbook-pro-16-m3-max",
    user_name: "David Kim",
    user_email: "david.kim@studio.io",
    rating: 5,
    title: "Refurbished condition is virtually indistinguishable from new",
    comment: "Was hesitant about buying certified refurbished, but Nexora's Grade A+ certification is real. The battery had only 4 cycles on it and cosmetically there isn't a single mark anywhere. Saved $700 compared to Apple Store direct!",
    verified_purchase: 1,
    created_at: "2026-10-02T08:20:00Z"
  },
  {
    product_slug: "samsung-odyssey-oled-g9-49",
    user_name: "Alex Sterling",
    user_email: "alex.s@tech.net",
    rating: 5,
    title: "My jaw literally hit the desk",
    comment: "The 32:9 aspect ratio in OLED is pure futuristic science fiction. In Forza Horizon and Star Citizen you feel like you are inside the cockpit. The 0.03ms response time has zero blur. Nexora's fast insured shipping kept this massive curved box flawless.",
    verified_purchase: 1,
    created_at: "2026-10-10T14:32:00Z"
  },
  {
    product_slug: "nexora-cyberapex-titan-gaming-pc",
    user_name: "Julian Cross",
    user_email: "jcross@fpspro.com",
    rating: 5,
    title: "Nexora's custom build quality is bespoke perfection",
    comment: "The hardline tubing bends and cable management are art gallery level. Temperatures stay under 65C even when benchmarking the 4090 and 7950X3D at full throttle. 10/10 purchase.",
    verified_purchase: 1,
    created_at: "2026-10-15T11:00:00Z"
  }
];

const initialCoupons = [
  { code: "NEXORA10", discount_type: "pct", value: 10, min_order: 100, active: 1 },
  { code: "CYBER50", discount_type: "fixed", value: 50, min_order: 300, active: 1 },
  { code: "GAMER100", discount_type: "fixed", value: 100, min_order: 800, active: 1 },
  { code: "REFURB15", discount_type: "pct", value: 15, min_order: 250, active: 1 }
];

module.exports = {
  initialProducts,
  initialReviews,
  initialCoupons
};
