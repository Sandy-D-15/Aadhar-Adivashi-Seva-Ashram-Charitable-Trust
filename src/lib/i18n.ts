export type Locale = "en" | "mr" | "hi";

export interface Translations {
  nav: {
    home: string;
    donate: string;
    volunteer: string;
    track: string;
    about: string;
    contact: string;
    admin: string;
    whatsapp: string;
  };
  hero: {
    badge: string;
    servingSince: string;
    title: string;
    highlight: string;
    subtitle: string;
    ctaDonate: string;
    ctaVolunteer: string;
    yearsOfService: string;
    donationsReceived: string;
    studentsVolunteered: string;
    hoursServed: string;
  };
  donations: {
    title: string;
    subtitle: string;
    orgDonateTitle: string;
    orgDonateDesc: string;
    clothes: string;
    food: string;
    toys: string;
    learning: string;
    instruments: string;
    cash: string;
    furniture: string;
    donateNow: string;
    pickupDropoff: string;
  };
  studentVolunteer: {
    title: string;
    subtitle: string;
    registerNow: string;
    checkHours: string;
    getCertificate: string;
    ourPartners: string;
  };
  footer: {
    aboutTitle: string;
    aboutText: string;
    quickLinks: string;
    categories: string;
    contact: string;
    regdInfo: string;
    estInfo: string;
    rights: string;
  };
}

export const DICTIONARY: Record<Locale, Translations> = {
  en: {
    nav: {
      home: "Home",
      donate: "Donate Items",
      volunteer: "Student Volunteers",
      track: "Track Status",
      about: "About Us",
      contact: "Contact",
      admin: "Admin Portal",
      whatsapp: "Chat on WhatsApp",
    },
    hero: {
      badge: "Aadhar Adivashi Seva Ashram Charitable Trust (Regd.)",
      servingSince: "Serving the community since 2012",
      title: "Uplifting Tribal Communities & Children",
      highlight: "Through Warmth & Service",
      subtitle:
        "Join our mission to bring clothes, wholesome food, toys, educational tools, and music to Adivasi families across Thane and Kalyan districts.",
      ctaDonate: "Donate Now",
      ctaVolunteer: "College Student Registration",
      yearsOfService: "Years of Service",
      donationsReceived: "Donation Drives",
      studentsVolunteered: "Students Volunteered",
      hoursServed: "Community Hours",
    },
    donations: {
      title: "Choose How You Want to Give",
      subtitle:
        "Every piece of clothing, meal, book, instrument, or furniture directly touches a life in need.",
      orgDonateTitle: "Donating as an Organization or Company?",
      orgDonateDesc:
        "We welcome partnerships with trusts, CSR initiatives, housing societies, and colleges.",
      clothes: "Clothes",
      food: "Food & Ration",
      toys: "Toys & Games",
      learning: "Learning Materials",
      instruments: "Musical & Sports Gear",
      cash: "Direct Financial Support",
      furniture: "Furniture & Essentials",
      donateNow: "Give Now",
      pickupDropoff: "Doorstep Pickup or Drop-off at Ashram",
    },
    studentVolunteer: {
      title: "College Student Visit & Work Register",
      subtitle:
        "Engage in hands-on community service, track your hours, and earn an authentic, verifiable certificate of service.",
      registerNow: "Register as a Volunteer",
      checkHours: "Lookup Your Record & Hours",
      getCertificate: "Download Verified Certificate",
      ourPartners: "Our College & University Partners",
    },
    footer: {
      aboutTitle: "About The Trust",
      aboutText:
        "Aadhar Adivashi Seva Ashram Charitable Trust (Regd.) is dedicated to the social welfare, nourishment, and education of tribal families in Maharashtra.",
      quickLinks: "Quick Links",
      categories: "Ways to Give",
      contact: "Contact & Ashram Location",
      regdInfo: "Regd. No. 1950, Act 29, Rules E-29288, Mumbai",
      estInfo: "Est. 20 December 2012",
      rights: "All rights reserved.",
    },
  },
  mr: {
    nav: {
      home: "मुख्यपृष्ठ",
      donate: "दान करा",
      volunteer: "विद्यार्थी स्वयंसेवक",
      track: "स्थिती तपासा",
      about: "आमच्याबद्दल",
      contact: "संपर्क",
      admin: "प्रशासक पोर्टल",
      whatsapp: "व्हॉट्सॲपवर संपर्क",
    },
    hero: {
      badge: "आधार आदिवासी सेवा आश्रम चॅरिटेबल ट्रस्ट (नोंदणीकृत)",
      servingSince: "२०१२ पासून अविरत समाजसेवा",
      title: "आदिवासी बांधव व बालकांच्या",
      highlight: "उज्ज्वल भविष्यासाठी सेवेचा हात",
      subtitle:
        "ठाणे व कल्याण परिसरातील आदिवासी पाड्यांवरील बालकांना अन्न, कपडे, पुस्तके व खेळणी पोहोचवण्यासाठी आमच्यासोबत सहभागी व्हा.",
      ctaDonate: "आता दान करा",
      ctaVolunteer: "महाविद्यालयीन विद्यार्थी नोंदणी",
      yearsOfService: "वर्षांची सेवा",
      donationsReceived: "दान मोहिमा",
      studentsVolunteered: "सहभागी विद्यार्थी",
      hoursServed: "सेवा तास",
    },
    donations: {
      title: "तुम्ही कशी मदत करू इच्छिता?",
      subtitle:
        "तुमचे कपडे, अन्न, पुस्तके, वाद्ये किंवा फर्निचर गरजू आदिवासी मुलांच्या चेहऱ्यावर हसू आणू शकते.",
      orgDonateTitle: "संस्था किंवा कंपनी म्हणून दान करत आहात?",
      orgDonateDesc:
        "आम्ही कंपन्या, सोसायट्या आणि शाळा-महाविद्यालयांच्या सीएसआर (CSR) सहभागाचे स्वागत करतो.",
      clothes: "कपडे",
      food: "अन्न व धान्य",
      toys: "खेळणी",
      learning: "शैक्षणिक साहित्य",
      instruments: "वाद्ये व खेळ साहित्य",
      cash: "आर्थिक मदत",
      furniture: "फर्निचर व इतर",
      donateNow: "दान करा",
      pickupDropoff: "घरोघरी पिकअप किंवा आश्रमात प्रत्यक्ष भेट",
    },
    studentVolunteer: {
      title: "महाविद्यालयीन विद्यार्थी भेट व कार्य नोंदवही",
      subtitle:
        "आदिवासी पाड्यांवर प्रत्यक्ष समाजकार्य करा, आपले तास नोंदवा आणि अधिकृत प्रमाणपत्र मिळवा.",
      registerNow: "विद्यार्थी नोंदणी करा",
      checkHours: "आपले तास व भेटी तपासा",
      getCertificate: "प्रमाणपत्र डाउनलोड करा",
      ourPartners: "सहभागी महाविद्यालये",
    },
    footer: {
      aboutTitle: "ट्रस्टबद्दल",
      aboutText:
        "आधार आदिवासी सेवा आश्रम चॅरिटेबल ट्रस्ट आदिवासी समाजाच्या शिक्षण, आरोग्य आणि अन्न सुरक्षेसाठी कार्यरत आहे.",
      quickLinks: "महत्वाच्या लिंक्स",
      categories: "दानाचे प्रकार",
      contact: "संपर्क व पत्ता",
      regdInfo: "नोंदणी क्र. १९५०, कायदा २९, नियम ई-२९२८८, मुंबई",
      estInfo: "स्थापना: २० डिसेंबर २०१२",
      rights: "सर्व हक्क सुरक्षित.",
    },
  },
  hi: {
    nav: {
      home: "होम",
      donate: "दान करें",
      volunteer: "छात्र स्वयंसेवक",
      track: "स्थिति जांचें",
      about: "हमारे बारे में",
      contact: "संपर्क",
      admin: "व्यवस्थापक पोर्टल",
      whatsapp: "व्हाट्सएप पर बात करें",
    },
    hero: {
      badge: "आधार आदिवासी सेवा आश्रम चैरिटेबल ट्रस्ट (पंजीकृत)",
      servingSince: "2012 से निरंतर समाज सेवा में समर्पित",
      title: "आदिवासी समुदायों और बच्चों के",
      highlight: "उज्ज्वल भविष्य के लिए सेवा का संकल्प",
      subtitle:
        "ठाणे और कल्याण के आदिवासी क्षेत्रों में बच्चों के लिए भोजन, वस्त्र, शिक्षा सामग्री, वाद्य यंत्र और सहयोग पहुँचाने में भागीदार बनें।",
      ctaDonate: "अभी दान करें",
      ctaVolunteer: "कॉलेज छात्र पंजीकरण",
      yearsOfService: "वर्षों की सेवा",
      donationsReceived: "दान अभियान",
      studentsVolunteered: "स्वयंसेवक छात्र",
      hoursServed: "सेवा के घंटे",
    },
    donations: {
      title: "अपनी पसंद का दान चुनें",
      subtitle:
        "आपका पुराना सामान, कपड़े, राशन, किताबें या फर्नीचर जरूरतमंद आदिवासी बच्चों का जीवन संवार सकता है।",
      orgDonateTitle: "क्या आप किसी संस्था या कंपनी की ओर से दान कर रहे हैं?",
      orgDonateDesc:
        "हम कंपनियों, सोसायटियों, ट्रस्टों और शिक्षण संस्थानों के साथ सहयोग का स्वागत करते हैं।",
      clothes: "वस्त्र व कपड़े",
      food: "भोजन व राशन",
      toys: "खिलौने",
      learning: "शिक्षा सामग्री",
      instruments: "वाद्य यंत्र व खेल उपकरण",
      cash: "आर्थिक सहायता",
      furniture: "फर्नीचर व आवश्यक वस्तुएं",
      donateNow: "दान करें",
      pickupDropoff: "घर से पिकअप अथवा आश्रम में जमा करें",
    },
    studentVolunteer: {
      title: "कॉलेज छात्र सेवा व कार्य रजिस्टर",
      subtitle:
        "आदिवासी क्षेत्रों में स्वयंसेवा करें, कार्य के घंटे दर्ज करें और सत्यापन योग्य प्रमाण पत्र प्राप्त करें।",
      registerNow: "छात्र पंजीकरण करें",
      checkHours: "अपने घंटे व विवरण देखें",
      getCertificate: "प्रमाण पत्र डाउनलोड करें",
      ourPartners: "सहयोगी कॉलेज व विश्वविद्यालय",
    },
    footer: {
      aboutTitle: "ट्रस्ट का परिचय",
      aboutText:
        "आधार आदिवासी सेवा आश्रम चैरिटेबल ट्रस्ट आदिवासी परिवारों के सामाजिक उत्थान, पोषण और शिक्षा हेतु समर्पित संस्था है।",
      quickLinks: "त्वरित लिंक",
      categories: "दान की श्रेणियां",
      contact: "संपर्क एवं पता",
      regdInfo: "पंजीकरण संख्या 1950, अधिनियम 29, नियम E-29288, मुंबई",
      estInfo: "स्थापना: 20 दिसंबर 2012",
      rights: "सर्वाधिकार सुरक्षित।",
    },
  },
};
