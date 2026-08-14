// -----------------------------------------------------------------------------
// This is a MOCK data layer backed by localStorage so the dashboard is fully
// interactive out of the box. It stands in for a real backend/database.
//
// To make this dashboard reflect real bookings from the public website, replace
// the functions below with calls to your own API (e.g. fetch("/api/bookings")),
// and have your backend write a booking row whenever Paystack's webhook confirms
// a successful transaction (do not trust the frontend callback alone for that).
// -----------------------------------------------------------------------------

const BOOKINGS_KEY = "vd_admin_bookings";
const SERVICES_KEY = "vd_admin_services";
const SETTINGS_KEY = "vd_admin_settings";

const SEED_SERVICES = [
  {
    id: "strategy",
    eyebrow: "Strategy",
    title: "Agribusiness strategy",
    desc: "Feasibility studies, investment-ready business plans and scale-up roadmaps.",
    price: 45000,
    image: "https://picsum.photos/seed/verdant-strategy/400/300",
  },
  {
    id: "compliance",
    eyebrow: "Compliance",
    title: "Environmental compliance & ESG",
    desc: "Impact assessments, permit support and ESG policy design.",
    price: 35000,
    image: "https://picsum.photos/seed/verdant-compliance/400/300",
  },
  {
    id: "reporting",
    eyebrow: "Reporting",
    title: "Sustainability reporting",
    desc: "Carbon and water footprinting, traceability, investor-ready reports.",
    price: 30000,
    image: "https://picsum.photos/seed/verdant-reporting/400/300",
  },
  {
    id: "partnerships",
    eyebrow: "Partnerships",
    title: "Land & community partnerships",
    desc: "Community land agreements, cooperative structuring, benefit-sharing.",
    price: 40000,
    image: "https://picsum.photos/seed/verdant-partnerships/400/300",
  },
  {
    id: "climate",
    eyebrow: "Advisory",
    title: "Climate risk advisory",
    desc: "Climate risk assessments, resilient cropping plans, financing guidance.",
    price: 35000,
    image: "https://picsum.photos/seed/verdant-climate/400/300",
  },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const SEED_BOOKINGS = [
  {
    id: "bk_1",
    name: "Chiamaka Nwosu",
    email: "chiamaka.n@example.com",
    phone: "0803 221 5510",
    serviceId: "strategy",
    contactMethod: "WhatsApp",
    farmSize: "Medium (5–50 hectares)",
    timeline: "This month",
    location: "Oyo State",
    source: "Referral",
    reference: "REF-8823KJ",
    status: "Paid",
    createdAt: daysAgo(1),
  },
  {
    id: "bk_2",
    name: "Ibrahim Sule",
    email: "ibrahim.sule@example.com",
    phone: "0705 442 9981",
    serviceId: "compliance",
    contactMethod: "Email",
    farmSize: "Large enterprise (50+ hectares)",
    timeline: "This week",
    location: "Kaduna State",
    source: "Search",
    reference: "REF-7712LM",
    status: "Paid",
    createdAt: daysAgo(2),
  },
  {
    id: "bk_3",
    name: "Funmilayo Adekunle",
    email: "funmi.a@example.com",
    phone: "0812 903 4471",
    serviceId: "reporting",
    contactMethod: "Phone call",
    farmSize: "Smallholder (under 5 hectares)",
    timeline: "Just exploring",
    location: "Ogun State",
    source: "Social media",
    reference: "REF-3390PQ",
    status: "Pending",
    createdAt: daysAgo(3),
  },
  {
    id: "bk_4",
    name: "Emeka Okoro",
    email: "emeka.okoro@example.com",
    phone: "0906 118 2245",
    serviceId: "partnerships",
    contactMethod: "Email",
    farmSize: "Medium (5–50 hectares)",
    timeline: "This month",
    location: "Enugu State",
    source: "Event / conference",
    reference: "REF-9915ZX",
    status: "Paid",
    createdAt: daysAgo(6),
  },
  {
    id: "bk_5",
    name: "Aisha Bello",
    email: "aisha.bello@example.com",
    phone: "0701 556 3320",
    serviceId: "climate",
    contactMethod: "WhatsApp",
    farmSize: "Large enterprise (50+ hectares)",
    timeline: "This week",
    location: "Kano State",
    source: "Referral",
    reference: "REF-1147AB",
    status: "Cancelled",
    createdAt: daysAgo(9),
  },
  {
    id: "bk_6",
    name: "Tobi Fashola",
    email: "tobi.fashola@example.com",
    phone: "0813 774 6602",
    serviceId: "strategy",
    contactMethod: "Email",
    farmSize: "Smallholder (under 5 hectares)",
    timeline: "This month",
    location: "Lagos State",
    source: "Search",
    reference: "REF-2286DC",
    status: "Paid",
    createdAt: daysAgo(14),
  },
  {
    id: "bk_7",
    name: "Grace Effiong",
    email: "grace.effiong@example.com",
    phone: "0908 220 7743",
    serviceId: "compliance",
    contactMethod: "Phone call",
    farmSize: "Medium (5–50 hectares)",
    timeline: "This week",
    location: "Akwa Ibom State",
    source: "Referral",
    reference: "REF-6634MN",
    status: "Pending",
    createdAt: daysAgo(18),
  },
];

const SEED_SETTINGS = {
  businessName: "Verdant & Co.",
  address: "12 Ilupeju Bypass, Lagos, Nigeria",
  email: "hello@verdantandco.africa",
  phone: "+234 802 555 0148",
  paystackPublicKey: "pk_test_00000000000000000000000000000000000",
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getServices(){
  return readJSON(SERVICES_KEY, SEED_SERVICES);
}

export function saveServices(services) {
  writeJSON(SERVICES_KEY, services);
}

export function getBookings() {

  return readJSON(BOOKINGS_KEY, SEED_BOOKINGS);
}

export function saveBookings(bookings) {
  writeJSON(BOOKINGS_KEY, bookings);
}

export function getSettings() {
  return readJSON(SETTINGS_KEY, SEED_SETTINGS);
}

export function saveSettings(settings) {
  writeJSON(SETTINGS_KEY, settings);
}

export function resetAllData() {
  localStorage.removeItem(BOOKINGS_KEY);
  localStorage.removeItem(SERVICES_KEY);
  localStorage.removeItem(SETTINGS_KEY);
}

export function naira(amount) {
  return `₦${Number(amount || 0).toLocaleString("en-NG")}`;
}
