export const NGO_CONFIG = {
  name: "Aadhar Adivashi Seva Ashram Charitable Trust (Regd.)",
  shortName: "Aadhar Adivashi Seva Ashram",
  regNo: "Regd. No. 1950, Act 29, Rules E-29288, Mumbai",
  establishedDate: "2012-12-20", // 20 December 2012 (PATCH requirement)
  tagline: "Empowering tribal communities and uplifting children through education, nourishment, and compassionate action.",
  marathiTagline: "आदिवासी बांधव आणि बालकांच्या सर्वांगीण विकासासाठी आणि शिक्षणासाठी समर्पित सेवा आश्रम.",
  hindiTagline: "आदिवासी समुदायों और बच्चों के सर्वांगीण विकास व शिक्षा के लिए समर्पित सेवा आश्रम.",
  mission:
    "Support Adivasi families and children by collecting and distributing clothes, food, toys, learning materials, instruments and furniture, while engaging students, colleges, and donor organizations in transformative community service.",
  chairman: {
    name: "Deva Salat",
    role: "Chairman",
    phone: "8108751580",
    email: "devasalat3601@gmail.com",
  },
  secretary: {
    name: "Priti Salat",
    role: "Secretary",
    phone: "7506101471",
  },
  email: "devasalat3601@gmail.com",
  website: "https://www.adivashisevango.org",
  address: "Nana Devkar Row House, Jiga Society, Nr. Khidkaleshwar Mandir, Khidkali, Kalyan Shill Rd., Dist. Thane - 421 204, Maharashtra",
  mapsLink: "https://maps.google.com/?q=Khidkali+Kalyan+Shill+Road+Thane",
  defaultPickupAreas: [
    "Khidkali",
    "Kalyan",
    "Dombivli",
    "Diva",
    "Shilphata",
    "Thane",
    "Navi Mumbai",
    "Palava / Lodha",
    "Mumbra",
  ],
  dropoffHours: "9:00 AM - 7:30 PM (Monday to Sunday)",
  bankDetails: {
    bankName: "Andhra Bank (Now Union Bank of India)",
    accountName: "Aadhar Adivashi Seva Ashram Charitable Trust",
    accountNumber: "023810100036400",
    ifscCode: "ANDB0000238",
    alternateIfsc: "UBIN0802387",
    accountType: "Current / Trust Account",
    branch: "Kalyan-Shill Road",
    upiId: "8108751580@upi",
    tax80gEnabled: false, // Editable in admin settings
    tax80gNote: "Tax exemption certificate (80G) status under verification with Income Tax department.",
  },
};

// Auto-calculate Years of Service dynamically from 2012-12-20
export function getYearsOfService(estDateString = NGO_CONFIG.establishedDate): number {
  const estDate = new Date(estDateString);
  const now = new Date();
  let years = now.getFullYear() - estDate.getFullYear();
  const m = now.getMonth() - estDate.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < estDate.getDate())) {
    years--;
  }
  return Math.max(1, years);
}

// Format establishment date in different languages
export function formatEstablishedDate(locale: "en" | "mr" | "hi" = "en"): string {
  if (locale === "mr") {
    return "२० डिसेंबर २०१२";
  }
  if (locale === "hi") {
    return "20 दिसंबर 2012";
  }
  return "20 December 2012";
}

// 7 EXPANDED DONATION TYPES
export const DONATION_TYPES = [
  {
    key: "CLOTHES",
    slug: "clothes",
    label: "Clothes",
    marathi: "जुने व नवीन कपडे",
    hindi: "वस्त्र व कपड़े",
    icon: "Shirt",
    badgeColor: "bg-red-50 text-red-700 border-red-200",
    gradient: "from-red-600 to-rose-700",
    description: "Men, women, kids clothes, sarees, and winter wear for tribal hamlets.",
    href: "/donate/clothes",
  },
  {
    key: "FOOD",
    slug: "food",
    label: "Food",
    marathi: "अन्न व धान्य",
    hindi: "भोजन व राशन",
    icon: "Utensils",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    gradient: "from-amber-600 to-orange-700",
    description: "Cooked meals, raw grains, pulses, and packaged foods for children & elders.",
    href: "/donate/food",
  },
  {
    key: "TOYS",
    slug: "toys",
    label: "Toys",
    marathi: "खेळणी",
    hindi: "खिलौने",
    icon: "Gamepad2",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    gradient: "from-cyan-600 to-blue-700",
    description: "Clean, safe toys, board games, and sports gear bringing smiles to little ones.",
    href: "/donate/toys",
  },
  {
    key: "LEARNING",
    slug: "learning-materials",
    label: "Learning Accessories",
    marathi: "शैक्षणिक साहित्य",
    hindi: "शिक्षा सामग्री",
    icon: "BookOpen",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    gradient: "from-indigo-600 to-violet-800",
    description: "Notebooks, stationery, textbooks, school bags, and laptops for students.",
    href: "/donate/learning-materials",
  },
  {
    key: "INSTRUMENTS",
    slug: "instruments",
    label: "Musical & Sports Instruments",
    marathi: "वाद्ये व खेळ साहित्य",
    hindi: "वाद्य यंत्र व खेल उपकरण",
    icon: "Music",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    gradient: "from-purple-600 to-indigo-800",
    description: "Harmonium, tabla, dholki, guitars, keyboards, drums, and sports equipment.",
    href: "/donate/instruments",
  },
  {
    key: "CASH",
    slug: "money",
    label: "Money & Online Support",
    marathi: "आर्थिक मदत (Cash/Online)",
    hindi: "आर्थिक सहायता",
    icon: "IndianRupee",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gradient: "from-emerald-600 to-teal-800",
    description: "Direct bank transfer, UPI, or cash to support daily meals and education drives.",
    href: "/donate/money",
  },
  {
    key: "FURNITURE",
    slug: "furniture",
    label: "Furniture & Appliances",
    marathi: "फर्निचर व साहित्य",
    hindi: "फर्नीचर व उपकरण",
    icon: "Armchair",
    badgeColor: "bg-stone-50 text-stone-700 border-stone-200",
    gradient: "from-stone-700 to-zinc-900",
    description: "Study benches, tables, chairs, cupboards, beds, mattresses, and ceiling fans.",
    href: "/donate/furniture",
  },
] as const;

export type DonationTypeKey = (typeof DONATION_TYPES)[number]["key"];

export const DONOR_TYPES = [
  { key: "INDIVIDUAL", label: "Individual Donor" },
  { key: "ORGANIZATION", label: "Organization / Institution / Company" },
  { key: "STUDENT", label: "College Student / NSS Unit" },
] as const;

export const ORGANIZATION_TYPES = [
  "NGO",
  "Trust",
  "Company / CSR",
  "Housing Society",
  "School",
  "College / University",
  "Temple or Religious Body",
  "Local Business",
  "Government Body",
  "Other",
] as const;

export const STUDENT_PURPOSES = [
  { key: "INTERNSHIP", label: "Internship" },
  { key: "NSS_NCC", label: "NSS / NCC Drive" },
  { key: "COMMUNITY_SERVICE", label: "Community Service" },
  { key: "PROJECT", label: "College Academic Project" },
  { key: "RESEARCH", label: "Field Research" },
  { key: "EVENT", label: "Event or Drive" },
  { key: "OTHER", label: "Other" },
] as const;

export const VOLUNTEER_ACTIVITIES = [
  "Teaching children",
  "Clothes sorting and distribution",
  "Food preparation and distribution",
  "Toy and book distribution",
  "Event management",
  "Photography and videography",
  "Social media and content",
  "Fundraising",
  "Data entry and documentation",
  "Field visits to tribal areas",
  "Musical & cultural activities",
  "Other",
] as const;

export const SUPERVISORS_LIST = [
  { name: "Deva Salat", role: "Chairman", phone: "8108751580" },
  { name: "Priti Salat", role: "Secretary", phone: "7506101471" },
  { name: "Sunil Waghmare", role: "Field Coordinator", phone: "9820112233" },
  { name: "Anjali Shinde", role: "Education Lead", phone: "9833445566" },
];
