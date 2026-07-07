import { GovernmentService, GovernmentScheme, CivicComplaint, UserProfile } from '../types';

export const mockProfile: UserProfile = {
  name: "Kushal Tripathi",
  email: "kushal.tripathi@civicai.gov",
  age: 20,
  occupation: "Freelance Software Developer",
  income: 200000,
  location: "Connaught Place, New Delhi, Delhi",
  education: "Bachelor of Science in Computer Science",
  language: "en"
};

export const mockActivity = [
  { id: 'act-1', text: "Submitted complaint: 'Pothole on Janpath Road'", date: "2 hours ago", type: "report" },
  { id: 'act-2', text: "Verified Identity Document (Passport)", date: "1 day ago", type: "document" },
  { id: 'act-3', text: "Applied for 'Clean Energy Solar Panel Subsidy'", date: "3 days ago", type: "scheme" },
  { id: 'act-4', text: "Checked eligibility for 'Skills Development Grant'", date: "5 days ago", type: "search" }
];

export const mockServices: GovernmentService[] = [
  {
    id: "serv-passport",
    title: "Fresh Passport Application",
    category: "licenses",
    department: "Ministry of External Affairs",
    description: "Apply for a standard 36-page ordinary citizen passport for international travel.",
    eligibility: [
      "Must be a citizen of the country",
      "Must have valid proof of address and identity",
      "No active criminal proceedings or court travel bans"
    ],
    requiredDocuments: [
      "Proof of Address (Aadhaar/Utility Bill/Rent Agreement)",
      "Proof of Date of Birth (Birth Certificate/Matriculation Certificate)",
      "Non-ECR proof (if educational qualification is 10th standard or above)"
    ],
    processingTime: "15-20 Business Days (Standard), 3-5 Days (Tatkaal / Urgent)",
    steps: [
      "Register on the Passport Seva portal and login.",
      "Fill out the online application form with personal and address details.",
      "Pay the passport fee online and book an appointment slot at a Passport Kendra.",
      "Visit the Passport Kendra with all original documents for biometric capture.",
      "Police verification is conducted at your residential address.",
      "Passport is dispatched to your registered address via registered speed post."
    ],
    aiExplanation: "A passport is your official travel document. The AI companion helps you verify if your address proofs are acceptable (utility bills must be less than 3 months old) and checks if you qualify for the Non-ECR status (meaning you won't need emigration checks if you travel for work, automatically granted to graduates).",
    faqs: [
      { question: "Can I apply if my current address is different from my permanent address?", answer: "Yes, you can apply using your current address as long as you provide valid supporting documents (like a registered rent agreement or utility bill in your name)." },
      { question: "What is the fee for a fresh passport?", answer: "The standard fee for a 36-page passport is $25 (equivalent), while the Tatkaal urgent passport carries an additional $30 processing fee." }
    ]
  },
  {
    id: "serv-driving",
    title: "Permanent Driving License",
    category: "licenses",
    department: "Department of Transportation",
    description: "Obtain a permanent license to drive light motor vehicles (cars) and two-wheelers.",
    eligibility: [
      "Must be 18 years or older",
      "Must hold a valid Learner's License for at least 30 days",
      "Application must be filed within 180 days of Learner's License issuance"
    ],
    requiredDocuments: [
      "Valid Learner's License",
      "Proof of Age (Birth Certificate/School Certificate)",
      "Proof of Address",
      "Form 1 (Physical Fitness Declaration) and Form 1A (Medical Certificate if applicant is over 40)"
    ],
    processingTime: "7-14 Business Days",
    steps: [
      "Submit Form 4 online or at the local Road Transport Office (RTO).",
      "Upload required documents and pay the driving test fee.",
      "Select a convenient slot for the practical driving test.",
      "Appear for the driving test at the RTO track with your vehicle.",
      "Upon passing, your biometric information is recorded.",
      "The physical license is printed and mailed within 10 days."
    ],
    aiExplanation: "This service transitions your learner permit into a full license. The AI recommends booking your test exactly on day 31 after learner license issue to minimize wait time, and provides a quick pre-test checklist (functioning brake lights, mirrors, and L-plate on test vehicle).",
    faqs: [
      { question: "What happens if I fail the driving test?", answer: "If you do not pass, you can reschedule the test after a minimum gap of 7 days, subject to payment of the re-test fee." },
      { question: "Is my domestic license valid nationwide?", answer: "Yes, a driving license issued by any RTO in the country is legally valid for driving anywhere within national borders." }
    ]
  },
  {
    id: "serv-scholarship",
    title: "National Higher Education Scholarship",
    category: "scholarships",
    department: "Department of Higher Education",
    description: "Financial assistance program for outstanding students from low-income families pursuing college degrees.",
    eligibility: [
      "Must have scored 80th percentile or higher in senior secondary examinations",
      "Annual family income must be below ₹5,00,000",
      "Must be enrolled in a regular, full-time undergraduate or postgraduate program"
    ],
    requiredDocuments: [
      "Senior Secondary Grade Sheets (Class 12th)",
      "Official Income Certificate issued by a competent revenue officer",
      "College Admission Letter & Fee Receipt",
      "Bank Account details (linked to national ID for direct benefit transfer)"
    ],
    processingTime: "30-45 Business Days (for verification & disbursement)",
    steps: [
      "Submit application on the National Scholarship Portal.",
      "Upload academic marksheets, income certificate, and student credentials.",
      "The application undergoes institute-level verification online.",
      "District and state educational boards verify credentials.",
      "A merit list is prepared and scholarships are disbursed directly to student bank accounts."
    ],
    aiExplanation: "This scholarship provides ₹12,000 per month for undergraduates and ₹20,000 for postgraduates. The AI recommends preparing your Income Certificate at least a month prior since revenue department processing can be slow.",
    faqs: [
      { question: "Do I need to reapply every year?", answer: "Yes, you must submit a renewal application every academic year, maintaining at least 60% marks and 75% attendance to continue benefits." },
      { question: "Can I receive this scholarship along with state-funded tuition waivers?", answer: "Generally, students cannot hold two government-funded scholarship programs concurrently. You must declare any other benefits during application." }
    ]
  },
  {
    id: "serv-caste",
    title: "Community & Caste Certificate",
    category: "certificates",
    department: "Revenue Department",
    description: "Official certificate confirming a citizen's social community status for reservation benefits.",
    eligibility: [
      "Must belong to a recognized social community list in the home state",
      "Must be a resident of the district where applying"
    ],
    requiredDocuments: [
      "Proof of Identity (Aadhaar Card/Voter ID)",
      "Affidavit affirming community background",
      "Father/Sibling's existing caste certificate or family land records showing lineage",
      "Local residential certificate"
    ],
    processingTime: "7-10 Business Days",
    steps: [
      "File an application on the state e-district portal.",
      "Provide family tree records and upload identity proofs.",
      "The local revenue inspector conducts field verification (if applying for the first time in the family).",
      "The Tehsildar approves and signs the digital certificate.",
      "Download the digitally signed PDF from the portal."
    ],
    aiExplanation: "A Caste Certificate is required to access reservation seats in educational institutions and government jobs. The AI can inspect your uploaded family records to see if they contain the required community declarations.",
    faqs: [
      { question: "Does this certificate expire?", answer: "Caste Certificates generally have lifetime validity, though Creamy Layer (income-based) certificates for certain categories must be renewed annually." }
    ]
  },
  {
    id: "serv-pension",
    title: "Old Age Pension Scheme",
    category: "pensions",
    department: "Social Welfare Department",
    description: "Monthly financial pension for senior citizens to assist with living expenses.",
    eligibility: [
      "Must be 60 years of age or older",
      "Must live below the poverty line (BPL category) or meet state low-income limits",
      "Must not be receiving any other government pension benefits"
    ],
    requiredDocuments: [
      "Age proof (Birth Certificate/Voter ID/Aadhaar/Medical Board Certificate)",
      "BPL Card or Income Certificate",
      "Proof of Residence in the state for at least 3 years",
      "Passport sized photograph"
    ],
    processingTime: "30 Business Days",
    steps: [
      "Collect application Form 1 from block office or download online.",
      "Submit filled form along with identity, address, and income proofs.",
      "Social Welfare Officer reviews and approves applications during monthly audits.",
      "Monthly pension (₹3,000/month) is sent directly to the bank account."
    ],
    aiExplanation: "This pension provides monthly subsistence to senior citizens. The AI helper will review your Age Proof documents and assist in filling out the local language translation fields to speed up verification.",
    faqs: [
      { question: "What happens if the beneficiary passes away?", answer: "The pension is terminated. A separate family survival grant may be requested by eligible dependents." }
    ]
  },
  {
    id: "serv-water",
    title: "New Residential Water Connection",
    category: "utilities",
    department: "Municipal Water Supply Board",
    description: "Apply for a new water pipeline connection to your residential property.",
    eligibility: [
      "Must own the property or hold a valid lease with owner consent",
      "Property must lie within the municipal water grid limits"
    ],
    requiredDocuments: [
      "Property Ownership Deed or Tax Paid Receipt",
      "Identity Proof",
      "Approved building plan layout or occupancy certificate",
      "No-objection certificate (NOC) from local colony association"
    ],
    processingTime: "15 Business Days",
    steps: [
      "Register an application online on the Water Board website.",
      "Pay connection and pipeline inspection charges.",
      "A technical inspector visits the site to verify layout and plumbing connection point.",
      "Connection pipe is laid and a water meter is installed.",
      "Water supply is activated, and standard billing begins."
    ],
    aiExplanation: "Gets you clean drinking water grid access. The AI calculates the distance from the nearest pipeline hookup to estimate plumbing costs before the inspector arrives.",
    faqs: [
      { question: "How is the water bill calculated?", answer: "Billing is based on meter readings. If the meter is faulty, flat rates based on property size apply until it is replaced." }
    ]
  }
];

export const mockSchemes: GovernmentScheme[] = [
  {
    id: "sch-solar",
    title: "Residential Solar Panel Subsidy",
    category: "clean_energy",
    description: "Get up to a 40% government subsidy on installing rooftop solar systems to generate clean electricity.",
    eligibilitySummary: "Homeowners with clear rooftop space (min 100 sq ft) and a clean electricity billing history.",
    benefits: "40% direct cashback on installation + net metering credit on your monthly utility bill.",
    requiredDocuments: ["Electricity Bill (last 3 months)", "Property Tax Receipt", "Identity Card", "Site Photographs"],
    matchPercentage: 92
  },
  {
    id: "sch-tech",
    title: "Freelancer & Developer Co-working Grant",
    category: "employment",
    description: "Monthly allowance supporting young tech professionals and freelance creators by subsidizing space rent and high-speed internet.",
    eligibilitySummary: "Ages 18-35. Freelancers, contractors, or developers with annual income below ₹40,00,000.",
    benefits: "₹10,000/month co-working space credit + free software development cloud credits.",
    requiredDocuments: ["Income Tax Filings", "Contractor details or GitHub Portfolio link", "Proof of Residency"],
    matchPercentage: 88
  },
  {
    id: "sch-health",
    title: "Universal Preventive Health Coverage",
    category: "healthcare",
    description: "Free annual comprehensive health screenings and subsidized prescription medications at network clinics.",
    eligibilitySummary: "All residents of New Delhi aged 18 to 65. No income threshold.",
    benefits: "100% free annual diagnostics + 50% discount on maintenance medications (blood pressure, diabetes).",
    requiredDocuments: ["Municipal Residence Certificate", "National ID Card"],
    matchPercentage: 85
  },
  {
    id: "sch-digital",
    title: "Digital Literacy & AI Training Scholarship",
    category: "education",
    description: "Fully-funded certifications in AI, Data Science, and Software Development through partnering universities.",
    eligibilitySummary: "High school graduate, current student or worker seeking upskilling. Income below ₹6,00,000.",
    benefits: "100% course tuition waiver + access to local government innovation hubs.",
    requiredDocuments: ["Graduation Certificate", "Statement of Purpose", "Income Certificate"],
    matchPercentage: 79
  }
];

export const mockComplaints: CivicComplaint[] = [
  {
    id: "comp-101",
    title: "Deep Pothole at Intersection",
    category: "road_damage",
    description: "A very deep and dangerous pothole has formed at the corner of Oak Street and 4th Avenue. It fills with rainwater and poses a severe threat to motorcyclists at night.",
    status: "in_progress",
    createdAt: "2026-07-05T09:30:00Z",
    location: "Janpath Road & Parliament Street, New Delhi",
    photoUrl: "/images/pothole_demo.jpg",
    department: "Public Works Department (PWD)",
    estimatedResolution: "2026-07-12",
    timeline: [
      { status: "submitted", title: "Complaint Filed", description: "Complaint successfully registered by citizen Kushal Tripathi.", date: "2026-07-05 09:30 AM" },
      { status: "under_review", title: "Review Completed", description: "AI scanned photo and confirmed category. Routing completed.", date: "2026-07-05 10:15 AM" },
      { status: "officer_assigned", title: "Officer Appointed", description: "Superintendent Engineer R. K. Vance assigned to resolve.", date: "2026-07-06 02:00 PM" },
      { status: "in_progress", title: "Work Commenced", description: "Road repair crew scheduled for repair and asphalt patching.", date: "2026-07-07 08:30 AM" }
    ],
    aiSuggestions: [
      "The road crew should use high-durability cold-mix asphalt due to the active monsoon season.",
      "Install temporary retro-reflective warning cones immediately."
    ]
  },
  {
    id: "comp-102",
    title: "Overflowing Garbage Bin",
    category: "garbage",
    description: "The municipal community trash bin outside Block C apartments has not been cleared for three days. Stray dogs are scattering waste across the street, causing a public health hazard.",
    status: "submitted",
    createdAt: "2026-07-07T08:00:00Z",
    location: "Block C, Connaught Place, New Delhi",
    department: "Municipal Sanitation Department",
    estimatedResolution: "2026-07-08",
    timeline: [
      { status: "submitted", title: "Complaint Registered", description: "AI detected overflowing garbage category. Dispatched notification to sanitation depot.", date: "2026-07-07 08:00 AM" }
    ],
    aiSuggestions: [
      "Request garbage truck route adjustment to increase pickup frequency from 3 to 5 times weekly.",
      "Send alert to local supervisor to check bin load sensor status."
    ]
  }
];
