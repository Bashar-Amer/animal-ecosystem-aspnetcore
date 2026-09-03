/**
 * data.js
 * Centralized mock data for the Animal Ecosystem platform.
 *
 * data.js will disappear and be replaced by a C# ViewModel and an SQL Database.
 *
 * NOTE (fix): every animal now carries explicit `species`, `purpose`,
 * and `priceValue` fields. Previously the marketplace page guessed these
 * via regex against name/breed/description — fragile, and unnecessary
 * once the source data can just say what it is. When this becomes a
 * real SQL table, these become real columns (Species, Purpose join
 * table, Price decimal) instead of derived/inferred values.
 */


window.App = window.App || {};

window.App.Data = {
  animals: [
    { id: 1, name: "Awassi Ram", breed: "Awassi Sheep", age: "2 Years",
      gender: "Male", location: "Amman Farm, Jordan", price: "250 JOD",
      priceValue: 250, species: "Sheep", purpose: ["breeding"],
      verifiedOwner: true, vetChecked: true, image: "assets/images/placeholder.jfif",
      description: "A strong, healthy Awassi ram, 3 years old, raised on a family farm in Amman. Known for its robust milk production and calm temperament.",
      healthRecords: ["Vaccinated – Foot & Mouth Disease", "Last vet check: March 2025", "No known conditions"], gallery: ["assets/images/placeholder.jfif", "assets/images/placeholder.jfif", "assets/images/placeholder.jfif", "assets/images/placeholder.jfif"],
      seller: { name: "Khalid Al-Rashid", location: "Amman Farm, Jordan", memberSince: "2022", responseRate: "Usually responds within 2 hours", verifiedOwner: true }, priceNote: "Price is negotiable" },
    { id: 2, name: "Holstein Cow", breed: "Holstein Friesian", age: "3 Years", gender: "Female", location: "Irbid Dairies, Jordan", price: "1,200 JOD",
      priceValue: 1200, species: "Cattle", purpose: ["dairy"],
      verifiedOwner: true, vetChecked: false, image: "assets/images/placeholder.jfif" },
    { id: 3, name: "Arabian Stallion", breed: "Purebred Arabian", age: "4 Years", gender: "Male", location: "Madaba Stables, Jordan", price: "5,000 JOD",
      priceValue: 5000, species: "Horse", purpose: ["breeding", "sport"],
      verifiedOwner: true, vetChecked: true, image: "assets/images/placeholder.jfif" },
    { id: 4, name: "Boer Doe", breed: "Boer Goat", age: "1.5 Years", gender: "Female", location: "Salt, Jordan", price: "180 JOD",
      priceValue: 180, species: "Goat", purpose: ["meat", "breeding"],
      verifiedOwner: false, vetChecked: false, image: "assets/images/placeholder.jfif" }
  ],

  auctions: [
    {
      id: 1,
      name: "Thoroughbred Stallion",
      species: "Horse",
      breed: "Arabian",
      age: "5 Years",
      gender: "Male",
      location: "Madaba, Jordan",
      image: "assets/images/placeholder.jfif",
      gallery: [
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif"
      ],
      status: "live",
      startingBid: 3000,
      currentBid: 4500,
      minimumIncrement: 100,
      bidCount: 8,
      endTime: Date.now() + (9910 * 1000),
      description: "A powerful Arabian Thoroughbred stallion, renowned for its speed and strong lineage, ready for competitive breeding.",
      healthRecords: ["Vaccinated – Equine Influenza", "Dental check – Jan 2025", "Hoof trimmed – Feb 2025"],
      verifiedOwner: true,
      vetChecked: true,
      seller: {
        name: "Amir Al‑Hussein",
        location: "Madaba Stables, Jordan",
        memberSince: "2018",
        verifiedOwner: true,
        responseRate: "Usually responds within 1 hour"
      },
      bidHistory: [
        { bidder: "K.A.", amount: 4000, timeAgo: "45 minutes ago" },
        { bidder: "L.S.", amount: 4200, timeAgo: "30 minutes ago" },
        { bidder: "M.R.", amount: 4500, timeAgo: "5 minutes ago" }
      ]
    },
    {
      id: 2,
      name: "Prize Najdi Camel",
      species: "Camel",
      breed: "Najdi",
      age: "6 Years",
      gender: "Male",
      location: "Aqaba, Jordan",
      image: "assets/images/placeholder.jfif",
      gallery: [
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif"
      ],
      status: "ending-soon",
      startingBid: 2000,
      currentBid: 3200,
      minimumIncrement: 100,
      bidCount: 5,
      endTime: Date.now() + (930 * 1000),
      description: "Champion Najdi camel, prized for its endurance and striking humps, ideal for racing and exhibition.",
      healthRecords: ["Vaccinated – Camel Pox", "Hoof check – Dec 2024", "Blood work normal"],
      verifiedOwner: true,
      vetChecked: false,
      seller: {
        name: "Salim Al‑Mansour",
        location: "Aqaba Desert Ranch, Jordan",
        memberSince: "2016",
        verifiedOwner: true,
        responseRate: "Usually responds within 2 hours"
      },
      bidHistory: [
        { bidder: "A.F.", amount: 2600, timeAgo: "12 minutes ago" },
        { bidder: "B.H.", amount: 3000, timeAgo: "7 minutes ago" },
        { bidder: "C.I.", amount: 3200, timeAgo: "2 minutes ago" }
      ]
    },
    {
      id: 3,
      name: "Flock of 10 Awassi Sheep",
      species: "Sheep",
      breed: "Awassi",
      age: "2 Years avg",
      gender: "Mixed",
      location: "Irbid, Jordan",
      image: "assets/images/placeholder.jfif",
      gallery: [
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif"
      ],
      status: "live",
      startingBid: 1500,
      currentBid: 2100,
      minimumIncrement: 50,
      bidCount: 4,
      endTime: Date.now() + (18720 * 1000),
      description: "Healthy flock of ten Awassi sheep, known for high milk yield and robust genetics.",
      healthRecords: ["Vaccinated – Foot & Mouth", "Dewormed – Sep 2024", "Eye check – Oct 2024"],
      verifiedOwner: true,
      vetChecked: true,
      seller: {
        name: "Nadia Al‑Sadiq",
        location: "Irbid Farm, Jordan",
        memberSince: "2019",
        verifiedOwner: true,
        responseRate: "Usually responds within 30 minutes"
      },
      bidHistory: [
        { bidder: "D.J.", amount: 1900, timeAgo: "1 hour ago" },
        { bidder: "E.K.", amount: 2100, timeAgo: "15 minutes ago" }
      ]
    },
    {
      id: 4,
      name: "Arabian Mare",
      species: "Horse",
      breed: "Arabian",
      age: "4 Years",
      gender: "Female",
      location: "Zarqa, Jordan",
      image: "assets/images/placeholder.jfif",
      gallery: [
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif"
      ],
      status: "starting-soon",
      startingBid: 4000,
      currentBid: 4000,
      minimumIncrement: 200,
      bidCount: 0,
      endTime: Date.now() + (86400 * 1000),
      description: "Elegant Arabian mare with a gentle temperament, perfect for dressage and pleasure riding.",
      healthRecords: ["Vaccinated – Equine Influenza", "Dental check – March 2025"],
      verifiedOwner: true,
      vetChecked: true,
      seller: {
        name: "Layla Al‑Khatib",
        location: "Zarqa Stables, Jordan",
        memberSince: "2020",
        verifiedOwner: true,
        responseRate: "Usually responds within 1 hour"
      },
      bidHistory: []
    },
    {
      id: 5,
      name: "Boer Goat Buck",
      species: "Goat",
      breed: "Boer",
      age: "2 Years",
      gender: "Male",
      location: "Amman, Jordan",
      image: "assets/images/placeholder.jfif",
      gallery: [
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif"
      ],
      status: "no-bids",
      startingBid: 250,
      currentBid: 250,
      minimumIncrement: 25,
      bidCount: 0,
      endTime: Date.now() + (43200 * 1000),
      description: "Robust Boer goat buck, prized for meat production and rapid growth.",
      healthRecords: ["Vaccinated – Goat Pox", "Dewormed – Aug 2024"],
      verifiedOwner: false,
      vetChecked: false,
      seller: {
        name: "Omar Al‑Fahim",
        location: "Amman Livestock Market, Jordan",
        memberSince: "2015",
        verifiedOwner: false,
        responseRate: "Usually responds within 3 hours"
      },
      bidHistory: []
    },
    {
      id: 6,
      name: "Holstein Dairy Cow",
      species: "Cattle",
      breed: "Holstein Friesian",
      age: "3 Years",
      gender: "Female",
      location: "Irbid, Jordan",
      image: "assets/images/placeholder.jfif",
      gallery: [
        "assets/images/placeholder.jfif",
        "assets/images/placeholder.jfif"
      ],
      status: "ended",
      startingBid: 800,
      currentBid: 1350,
      minimumIncrement: 50,
      bidCount: 11,
      endTime: Date.now() + (0 * 1000),
      description: "High‑yield Holstein dairy cow, proven milk production of 8,000 L per year.",
      healthRecords: ["Vaccinated – BVD", "Milk quality test – Feb 2025", "Hoof trimmed – Jan 2025"],
      verifiedOwner: true,
      vetChecked: true,
      seller: {
        name: "Hussein Al‑Mujahid",
        location: "Irbid Dairy Farms, Jordan",
        memberSince: "2012",
        verifiedOwner: true,
        responseRate: "Usually responds within 30 minutes"
      },
      bidHistory: [
        { bidder: "F.G.", amount: 1100, timeAgo: "2 days ago" },
        { bidder: "G.H.", amount: 1250, timeAgo: "1 day ago" },
        { bidder: "J.K.", amount: 1350, timeAgo: "4 hours ago" }
      ]
    }
  ],

  veterinarians: [
    {
      id: 1,
      name: "Dr. Ahmed Ali",
      specialty: "Large Animal Vet",
      experience: "10+ years",
      location: "Amman",
      available: true,
      verifiedVet: true,
      consultationPrice: "From 30 JOD",
      image: "assets/images/placeholder.jfif",
      animalTypes: ["Cattle", "Sheep", "Goats"],
      about: "Dr. Ahmed Ali has over a decade of experience treating large livestock across Jordan. He focuses on herd health, nutrition, and disease prevention, supporting farms of all sizes.",
      services: [
        "Farm visit and physical examination",
        "Vaccination programs",
        "Reproductive health consultations",
        "Emergency livestock care",
        "Pre‑purchase animal inspection"
      ],
      credentials: [
        { degree: "Doctor of Veterinary Medicine", institution: "University of Jordan", year: "2012" },
        { degree: "Specialist in Large Animal Medicine", institution: "Jordan Veterinary College", year: "2015" }
      ],
      reviews: [
        { reviewer: "Khalid Al‑Rashid", text: "Dr. Ahmed provided thorough health checks for our cattle, improving herd productivity.", date: "March 2025" },
        { reviewer: "Lina Saeed", text: "Professional and responsive, helped us with a quick vaccination schedule.", date: "January 2025" }
      ],
      weeklyAvailability: { saturday: true, sunday: true, monday: true, tuesday: true, wednesday: false, thursday: false, friday: false }
    },
    {
      id: 2,
      name: "Dr. Sarah Mahmoud",
      specialty: "Equine Specialist",
      experience: "8 years",
      location: "Madaba",
      available: true,
      verifiedVet: true,
      consultationPrice: "From 30 JOD",
      image: "assets/images/placeholder.jfif",
      animalTypes: ["Horses"],
      about: "Dr. Sarah Mahmoud specializes in equine health, offering preventive care, lameness diagnosis, and performance optimization for horses across the region.",
      services: [
        "Farm visit and physical examination",
        "Vaccination programs",
        "Reproductive health consultations",
        "Emergency livestock care",
        "Pre‑purchase animal inspection"
      ],
      credentials: [
        { degree: "Doctor of Veterinary Medicine", institution: "University of Jordan", year: "2014" },
        { degree: "Equine Medicine Certification", institution: "Arabian Horse Association", year: "2016" }
      ],
      reviews: [
        { reviewer: "Omar Khalil", text: "Excellent care for my mare, very knowledgeable about equine nutrition.", date: "February 2025" }
      ],
      weeklyAvailability: { saturday: true, sunday: true, monday: true, tuesday: true, wednesday: false, thursday: false, friday: false }
    },
    {
      id: 3,
      name: "Dr. Omar Hassan",
      specialty: "Livestock Health",
      experience: "15 years",
      location: "Irbid",
      available: false,
      verifiedVet: false,
      consultationPrice: "From 30 JOD",
      image: "assets/images/placeholder.jfif",
      animalTypes: ["Cattle", "Sheep", "Goats"],
      about: "Dr. Omar focuses on comprehensive livestock health services, addressing nutrition, disease control, and herd management.",
      services: [
        "Farm visit and physical examination",
        "Vaccination programs",
        "Reproductive health consultations",
        "Emergency livestock care",
        "Pre‑purchase animal inspection"
      ],
      credentials: [
        { degree: "Doctor of Veterinary Medicine", institution: "University of Jordan", year: "2008" }
      ],
      reviews: [
        { reviewer: "Maya Al‑Hussein", text: "Reliable advice for my goat herd, very thorough.", date: "December 2024" }
      ],
      weeklyAvailability: { saturday: true, sunday: true, monday: true, tuesday: true, wednesday: false, thursday: false, friday: false }
    },
    {
      id: 4,
      name: "Dr. Layla Nasser",
      specialty: "Equine Specialist",
      experience: "7 years",
      location: "Zarqa",
      available: true,
      verifiedVet: true,
      consultationPrice: "From 50 JOD",
      image: "assets/images/placeholder.jfif",
      animalTypes: ["Horses", "Camels"],
      about: "Dr. Layla provides expert equine care, focusing on performance health, wound management, and reproductive services for horses and camels.",
      services: [
        "Farm visit and physical examination",
        "Vaccination programs",
        "Reproductive health consultations",
        "Emergency livestock care",
        "Pre‑purchase animal inspection"
      ],
      credentials: [
        { degree: "Doctor of Veterinary Medicine", institution: "University of Jordan", year: "2015" },
        { degree: "Equine Surgery Fellowship", institution: "Arabian Horse Association", year: "2018" }
      ],
      reviews: [
        { reviewer: "Yousef Al‑Sabbagh", text: "Dr. Layla helped my mare recover from a leg injury swiftly.", date: "March 2025" }
      ],
      weeklyAvailability: { saturday: true, sunday: true, monday: true, tuesday: true, wednesday: false, thursday: false, friday: false }
    },
    {
      id: 5,
      name: "Dr. Faris Khalil",
      specialty: "Poultry Health",
      experience: "5 years",
      location: "Irbid",
      available: false,
      verifiedVet: false,
      consultationPrice: "From 20 JOD",
      image: "assets/images/placeholder.jfif",
      animalTypes: ["Poultry"],
      about: "Dr. Faris specializes in poultry disease prevention, biosecurity, and flock productivity improvement.",
      services: [
        "Farm visit and physical examination",
        "Vaccination programs",
        "Reproductive health consultations",
        "Emergency livestock care",
        "Pre‑purchase animal inspection"
      ],
      credentials: [
        { degree: "Doctor of Veterinary Medicine", institution: "University of Jordan", year: "2017" }
      ],
      reviews: [
        { reviewer: "Noura Al‑Zahra", text: "Helped reduce mortality in my chicken flock with a solid vaccination plan.", date: "January 2025" }
      ],
      weeklyAvailability: { saturday: true, sunday: true, monday: true, tuesday: true, wednesday: false, thursday: false, friday: false }
    },
    {
      id: 6,
      name: "Dr. Rima Barakat",
      specialty: "Small Animal & Mixed Practice",
      experience: "12 years",
      location: "Aqaba",
      available: true,
      verifiedVet: true,
      consultationPrice: "From 25 JOD",
      image: "assets/images/placeholder.jfif",
      animalTypes: ["Sheep", "Goats", "Cattle", "Poultry"],
      about: "Dr. Rima offers comprehensive care for small livestock and mixed animal farms, focusing on preventive health and emergency response.",
      services: [
        "Farm visit and physical examination",
        "Vaccination programs",
        "Reproductive health consultations",
        "Emergency livestock care",
        "Pre‑purchase animal inspection"
      ],
      credentials: [
        { degree: "Doctor of Veterinary Medicine", institution: "University of Jordan", year: "2009" },
        { degree: "Small Animal Medicine Certification", institution: "Jordan Veterinary College", year: "2012" }
      ],
      reviews: [
        { reviewer: "Samir Al‑Mansour", text: "Versatile and knowledgeable, handles all my farm animals with care.", date: "February 2025" }
      ],
      weeklyAvailability: { saturday: true, sunday: true, monday: true, tuesday: true, wednesday: false, thursday: false, friday: false }
    }
  ]
};