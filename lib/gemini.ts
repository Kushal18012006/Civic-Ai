import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const hasApiKey = apiKey.trim().length > 0;

let genAI: GoogleGenerativeAI | null = null;
if (hasApiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function getGeminiResponse(
  message: string,
  history: { role: 'user' | 'assistant'; content: string }[] = [],
  contextPrompt: string = ""
): Promise<string> {
  if (hasApiKey && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are CivicAI, an award-winning digital citizen companion. Your job is to simplify access to government services, explain complex policies, checklist documents, and direct citizens to appropriate departments. Always respond in a warm, polite, and professional tone. Respond in the language that the user uses or requests. " + contextPrompt,
      });

      // Format history for Gemini chat API
      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API call failed, falling back to simulator:", error);
      return getMockResponse(message);
    }
  } else {
    // Artificial latency to simulate real network request
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockResponse(message);
  }
}

function getMockResponse(
  message: string
): string {
  const query = message.toLowerCase();

  const mockFootnote = "\n\n*(Note: Running in high-fidelity AI Simulator mode. Configure GEMINI_API_KEY in .env.local to connect to live Gemini)*";

  if (query.includes("passport")) {
    return "To apply for a **Fresh Passport**, you must provide:\n\n1. **Proof of Address** (Aadhaar, utility bill under 3 months, or bank statement)\n2. **Proof of Age** (Birth Certificate or school certificate)\n3. **Educational documents** for Non-ECR status (if graduate).\n\n**Estimated Processing Time:** 15-20 days.\n\nWould you like me to guide you through the online booking steps or verify your checklist?" + mockFootnote;
  }
  
  if (query.includes("license") || query.includes("driving")) {
    return "To get a **Permanent Driving License**, make sure you meet these criteria:\n\n* You must hold a valid Learner's License for **at least 30 days** (and apply within 180 days of issue).\n* You must be **18 years or older**.\n* Bring a roadworthy vehicle of the correct class (e.g. LMV for cars) to the RTO for the practical test.\n\nWould you like a list of common driving track test mistakes to avoid?" + mockFootnote;
  }

  if (query.includes("solar") || query.includes("electricity") || query.includes("subsidy")) {
    return "The **Residential Solar Panel Subsidy** offers:\n\n* **Up to 40% cashback** for systems up to 3kW.\n* Net metering credits, saving up to 60% on monthly electric bills.\n\n**Required:** Property Tax receipt, Electricity bills for the last 3 months, and site photographs of your roof (min 100 sq ft unshaded area)." + mockFootnote;
  }

  if (query.includes("scholarship") || query.includes("college") || query.includes("education")) {
    return "Under the **National Higher Education Scholarship**, eligible students receive up to **₹12,000-₹20,000/month**.\n\n**Eligibility Checklist:**\n* Scored in the top 80th percentile of Class 12th exams.\n* Annual household income below ₹5,00,000.\n* Active full-time college enrollment.\n\nIs your college registered on the National Scholarship Portal?" + mockFootnote;
  }

  if (query.includes("pension") || query.includes("old age")) {
    return "The **Old Age Pension Scheme** is available for seniors aged **60 years or older** living below the poverty line (BPL). It pays **₹3,00,000/year** or **₹3,000/month** directly via bank transfer. You need an Age Proof Certificate, local residential proof, and a BPL card. I can help translate the application form into your preferred language if needed!" + mockFootnote;
  }

  if (query.includes("pothole") || query.includes("garbage") || query.includes("report") || query.includes("complaint")) {
    return "To report a civic issue like potholes, overflowing bins, or water leaks:\n\n1. Go to the **Report Issue** section in the sidebar.\n2. Pick a category, type a short description, and pin the location on our interactive map.\n3. Click **Auto-Generate with AI** to generate a formal complaint summary, which will be auto-routed to the correct department.\n\nOnce filed, you can track its resolution timeline in the **Complaint Tracker** dashboard." + mockFootnote;
  }

  if (query.includes("caste") || query.includes("certificate")) {
    return "A **Caste/Community Certificate** validates your category status for government benefits. It requires proof of identity, residential certificate, and family land records or a relative's existing caste certificate to show lineage. Processing takes about 7-10 days." + mockFootnote;
  }

  if (query.includes("hello") || query.includes("hi") || query.includes("hey") || query.includes("hola")) {
    return "Hello! I am **CivicAI**, your digital citizen assistant. \n\nI can help you:\n* **Find government schemes** matching your profile\n* **Explain document requirements** for passports, driving licenses, and certificates\n* **Check document completeness** before submission\n* **Prepare civic complaints** for road damage, sanitation, or utility leaks\n\nHow can I help you today?" + mockFootnote;
  }

  return "I'm here as your CivicAI digital assistant. I can guide you on government schemes, document audits, and reporting local civic issues. For example, try asking: *'What are the requirements for a fresh passport?'* or *'How can I get a solar panel subsidy?'*" + mockFootnote;
}
