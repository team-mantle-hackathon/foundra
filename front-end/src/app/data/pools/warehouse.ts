export type Pool = {
  id: string; // Internal ID
  txHash: string; // <--- INI YG LU MAU BUAT URL
  name: string;
  location: string;
  apy: string;
  tenor: string;
  risk: "A" | "B" | "C";
  targetRaise: string;
  raisedAmount: number;
  targetAmount: number; 
  category: "Residential" | "Commercial" | "Industrial";
  description: string;
};

export const POOLS: Pool[] = [
  {
    id: "harmoni-bsd-2",
    txHash: "0x71C942B582664973033575775437834571879034",
    name: "Harmoni Cluster Phase 2",
    location: "Greater Jakarta, ID",
    apy: "12.0%",
    tenor: "14 Month",
    risk: "A",
    targetRaise: "350,000 USDC",
    raisedAmount: 122500,
    targetAmount: 350000,
    category: "Residential",
    description: "Senior secured construction loan for 32 residential units. Asset-backed by land certificates.",
  },
  {
    id: "green-valley",
    txHash: "0x8F2A10C983748291028374657382910293847561",
    name: "Green Valley Residence",
    location: "Bandung, ID",
    apy: "11.2%",
    tenor: "12 Month",
    risk: "B",
    targetRaise: "215,000 USDC",
    raisedAmount: 64500,
    targetAmount: 215000,
    category: "Residential",
    description: "Urban housing development focusing on sustainable materials and smart-home integration.",
  },
  {
    id: "ubud-zen",
    txHash: "0x9A1B2C3D4E5F67890123456789ABCDEF01234567",
    name: "Ubud Zen Retreat",
    location: "Bali, ID",
    apy: "14.5%",
    tenor: "18 Month",
    risk: "B",
    targetRaise: "500,000 USDC",
    raisedAmount: 410000,
    targetAmount: 500000,
    category: "Commercial",
    description: "Luxury villa complex development with high-yield rental potential post-construction.",
  },
  {
    id: "surabaya-logistics",
    txHash: "0x1234567890ABCDEF1234567890ABCDEF12345678",
    name: "Surabaya Hub Logistics",
    location: "East Java, ID",
    apy: "9.5%",
    tenor: "24 Month",
    risk: "A",
    targetRaise: "1,200,000 USDC",
    raisedAmount: 850000,
    targetAmount: 1200000,
    category: "Industrial",
    description: "Last-mile delivery warehouse construction for e-commerce expansion.",
  },
  {
    id: "medan-central",
    txHash: "0xFEDCBA9876543210FEDCBA9876543210FEDCBA98",
    name: "Medan Central Heights",
    location: "North Sumatra, ID",
    apy: "10.8%",
    tenor: "12 Month",
    risk: "B",
    targetRaise: "280,000 USDC",
    raisedAmount: 15000,
    targetAmount: 280000,
    category: "Residential",
    description: "Affordable high-rise apartment targeting the growing middle-class demographic.",
  },
  {
    id: "skyline-office",
    txHash: "0x456789ABCDEF0123456789ABCDEF0123456789AB",
    name: "Skyline Tower Office",
    location: "Singapore, SG",
    apy: "8.2%",
    tenor: "36 Month",
    risk: "A",
    targetRaise: "2,500,000 USDC",
    raisedAmount: 2100000,
    targetAmount: 2500000,
    category: "Commercial",
    description: "Premium office space retrofitting for tech-hub expansion in Central Business District.",
  },
  {
    id: "batam-industrial",
    txHash: "0xCDEF0123456789ABCDEF0123456789ABCDEF0123",
    name: "Batam Electronics Park",
    location: "Batam, ID",
    apy: "13.0%",
    tenor: "20 Month",
    risk: "C",
    targetRaise: "750,000 USDC",
    raisedAmount: 120000,
    targetAmount: 750000,
    category: "Industrial",
    description: "High-yield industrial land preparation for multinational electronic manufacturers.",
  },
  {
    id: "makassar-waterfront",
    txHash: "0x6789ABCDEF0123456789ABCDEF0123456789ABCD",
    name: "Waterfront Makassar",
    location: "South Sulawesi, ID",
    apy: "11.5%",
    tenor: "16 Month",
    risk: "B",
    targetRaise: "400,000 USDC",
    raisedAmount: 295000,
    targetAmount: 400000,
    category: "Residential",
    description: "Coastal residential development featuring eco-friendly water management systems.",
  }
];