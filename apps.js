// ================================
// YAN RWANDA - MAIN JAVASCRIPT
// ================================

// ================================
// DATA STORES
// ================================

const organizationsData = [
    {
        id: 1,
        name: "Care and Help Child Organization",
        slug: "care-and-help-child-organization",
        description: "Supports vulnerable children in Rwanda through education access, safe spaces, and mental well-being support.",
        details: "Supports vulnerable children in Rwanda by providing access to education, creating safe spaces free from violence, and promoting mental well-being. Founded from a single act of kindness, they have grown to help over 570 children.",
        foundingYear: 2018,
        keyPrograms: ["Education access and school support", "Safe spaces for vulnerable children", "Child mental well-being initiatives"],
        impactHighlights: ["Grew support base from 35 to 574 children", "Holistic support across education, safety, and well-being"],
        sectors: ["EDUCATION"]
    },
    {
        id: 2,
        name: "WHAT IF-Rwanda",
        slug: "what-if-rwanda",
        description: "Provides love, mentorship, and essential support for vulnerable children through sponsorship and family-style care.",
        details: "Provides love and mentorship to vulnerable children, pairing them with dedicated \"aunties\" and \"uncles\" who offer guidance and support. They also provide essential needs like food, education, and healthcare through child sponsorship.",
        keyPrograms: ["Iramiro Center mentorship model", "Child sponsorship for education and healthcare", "Water and sanitation support"],
        impactHighlights: ["Installed water tanks and filtration systems", "Consistent school fee and materials support"],
        sectors: ["CHILD PROTECTION"]
    },
    {
        id: 3,
        name: "Aspire Debate Rwanda",
        slug: "aspire-debate-rwanda",
        description: "Empowers youth through debate, building critical thinking, public speaking, and leadership skills.",
        details: "Empowers young people through the art of debate, teaching them critical thinking, public speaking, and leadership skills. They work with schools across Rwanda to help youth find their voice and advocate for issues that matter to them.",
        foundingYear: 2014,
        keyPrograms: ["School debate clubs and mentorship", "Inter-school and university championships", "Youth civic voice and advocacy training"],
        impactHighlights: ["Partnerships with 50+ secondary schools", "22 higher learning institutions engaged"],
        sectors: ["EDUCATION"]
    },
    {
        id: 4,
        name: "Informed Future Generations (IFG)",
        slug: "informed-future-generations-ifg",
        description: "Educates youth on SRH, HIV prevention, and mental health through clubs and community outreach.",
        details: "Educates young people on sexual reproductive health, HIV/AIDS prevention, and mental health. Through school clubs and community outreach, they help youth make informed decisions about their health and futures.",
        foundingYear: 2023,
        keyPrograms: ["School health clubs", "Community SRHR outreach", "Youth-informed health education"],
        impactHighlights: ["Reached 5,000+ students", "50+ outreach events and 40,000+ online views"],
        sectors: ["HEALTH"]
    },
    {
        id: 5,
        name: "OAZIS Health",
        slug: "oazis-health",
        description: "A youth-led health organization bridging healthcare gaps for marginalized communities.",
        details: "A youth-led health organization working to bridge gaps in healthcare for marginalized communities. They train health workers, fight antimicrobial resistance, and promote health equity through innovative programs and digital solutions.",
        foundingYear: 2020,
        keyPrograms: ["Healthcare worker training", "Antimicrobial resistance campaigns", "Digital health innovation support"],
        impactHighlights: ["850+ healthcare providers trained", "500,000+ people reached in awareness campaigns"],
        sectors: ["HEALTH"]
    },
    {
        id: 6,
        name: "Helping Heart Family Rwanda (HHFR)",
        slug: "helping-heart-family-rwanda-hhfr",
        description: "Protects children's rights through education support, legal aid, and recovery pathways.",
        details: "Champions the rights of children by providing educational support, legal aid, and pathways to recovery for those affected by substance abuse. They have helped reintegrate former street children with their families and back into school.",
        foundingYear: 2021,
        keyPrograms: ["Child education support", "Legal aid services", "Family reintegration pathways"],
        impactHighlights: ["500+ children supported in education", "10,000+ individuals accessed legal aid"],
        sectors: ["CHILD PROTECTION"]
    },
    {
        id: 7,
        name: "Rwanda We Want Organization (RWW)",
        slug: "rwanda-we-want-organization-rww",
        description: "Develops young leaders and supports marginalized youth, including teen mothers.",
        details: "Develops young leaders and empowers marginalized youth, including teen mothers, through leadership training, sexual health education, and support for healing from transgenerational trauma.",
        foundingYear: 2015,
        keyPrograms: ["Leadership development pathway", "SRHR education for youth", "Trauma healing and psychosocial support"],
        impactHighlights: ["100+ graduates empowered", "2,000+ youth reached with SRH education"],
        sectors: ["YOUTH EMPOWERMENT"]
    },
    {
        id: 8,
        name: "Heza Initiative",
        slug: "heza-initiative",
        description: "Improves maternal and child nutrition through gardens, education, and One Egg A Day.",
        details: "Fights malnutrition by improving maternal and child nutrition through home gardens, nutrition education, and programs like \"One Egg A Day\" that provide daily nutrition to vulnerable children.",
        foundingYear: 2022,
        keyPrograms: ["One Egg A Day nutrition support", "Home garden rollouts", "Nutrition education for caregivers"],
        impactHighlights: ["200 children supported with daily nutrition", "Partnerships with UNICEF, RBC, and NCDA"],
        sectors: ["HEALTH", "AGRICULTURE"]
    },
    {
        id: 9,
        name: "UR Public Health Students' Association (URPHSA)",
        slug: "urphsa",
        description: "Connects future public health professionals with real community health needs.",
        details: "A student-led association that connects future public health professionals with real community needs. They run programs on disease prevention, sexual health, sanitation, and nutrition across Rwandan communities.",
        foundingYear: 2017,
        keyPrograms: ["Student-led public health outreach", "NCD and SRHR awareness", "WASH and nutrition community action"],
        impactHighlights: ["Established student association since 2017", "Bridges academic training with direct community services"],
        sectors: ["HEALTH"]
    },
    {
        id: 10,
        name: "Rise and Live Organization",
        slug: "rise-and-live-organization",
        description: "Supports teen mothers with counseling, reproductive health education, and advocacy training.",
        details: "Supports teen mothers by providing mental health counseling, reproductive health education, and advocacy training. They help young mothers build confidence, make informed decisions, and create better lives for themselves and their children.",
        keyPrograms: ["Teen mother counseling support", "Reproductive health education", "Advocacy and confidence building"],
        impactHighlights: ["Delivers targeted support for teen mothers", "Strong transformation stories in Huye communities"],
        sectors: ["HEALTH"]
    },
    {
        id: 11,
        name: "Nursing Research Club Organization",
        slug: "nursing-research-club-organization",
        description: "Builds research and education leadership among early-career nurses.",
        details: "Empowers early-career nurses to become researchers and educators. They bridge the gap between healthcare knowledge and community understanding by conducting research and running health education programs.",
        foundingYear: 2021,
        keyPrograms: ["Annual nursing symposiums", "Practice-to-community knowledge transfer", "Health education campaigns"],
        impactHighlights: ["Hosted annual nursing symposiums in 2023 and 2024", "Launching Rwamagana Health Connect"],
        sectors: ["HEALTH"]
    },
    {
        id: 12,
        name: "Inshuti Health Organization (IHO)",
        slug: "inshuti-health-organization-iho",
        description: "Promotes health equity through SRHR, nutrition, and gender equality programs.",
        details: "Promotes health equity in underserved communities through sexual and reproductive health education, gender equality programs, and nutrition initiatives. They work to ensure everyone has access to quality healthcare information and services.",
        foundingYear: 2020,
        keyPrograms: ["HER CHOICE program", "Learn to Unlearn initiatives", "Community nutrition and SRHR sessions"],
        impactHighlights: ["Strong localized impact in Nyagatare District", "Community-led model for health equity"],
        sectors: ["HEALTH"]
    },
    {
        id: 13,
        name: "MINDORA HEALTH",
        slug: "mindora-health",
        description: "Uses AI and gamified tools to deliver stigma-free youth mental health support.",
        details: "Uses AI technology and a unique gameboard to make mental health support accessible and stigma-free for young people. They offer online therapy, mental health assessments, and suicide prevention tools tailored for youth.",
        foundingYear: 2022,
        keyPrograms: ["AI-powered mental health platform", "Online therapy and assessments", "Youth suicide prevention tools"],
        impactHighlights: ["Reached 1,000+ young people", "Partnerships with universities for youth access"],
        sectors: ["HEALTH"]
    },
    {
        id: 14,
        name: "Hope for Tomorrow",
        slug: "hope-for-tomorrow",
        description: "Keeps rural girls in school through scholarships, menstrual health, and SRHR support.",
        details: "Supports rural girls in Nyamasheke District to stay in school through scholarships, menstrual health support, and sexual reproductive health education. They create safe spaces where girls can learn and thrive.",
        foundingYear: 2024,
        keyPrograms: ["Girls' school scholarships", "Menstrual health support", "Safe spaces for adolescent girls"],
        impactHighlights: ["20 girls returned to school on full scholarships", "300+ adolescents reached with SRHR education"],
        sectors: ["EDUCATION"]
    },
    {
        id: 15,
        name: "Studio Shodwe",
        slug: "studio-shodwe",
        description: "Amplifies independent youth advocates through storytelling and social justice advocacy.",
        details: "A platform that amplifies the voices of independent youth advocates. Through storytelling and advocacy, they highlight issues like mental health, orphanhood, and social justice, inspiring others to speak up and create change.",
        keyPrograms: ["Youth storytelling campaigns", "Mental health and orphanhood advocacy", "Independent voice amplification"],
        impactHighlights: ["Elevates youth advocates through narrative platforms", "Breaks social stigma via storytelling"],
        sectors: ["ARTS & MEDIA"]
    }
];

const organizationSectorOrder = ["HEALTH", "EDUCATION", "CHILD PROTECTION", "YOUTH EMPOWERMENT", "AGRICULTURE", "ARTS & MEDIA"];

const defaultOrganizationImage = "images/yan-team-image%20.png";

const organizationImageMap = {
    "care-and-help-child-organization": [
        "images/care-and-help-child-organization-image.png",
        "images/care-and-help-child-crganization2.png"
    ],
    "what-if-rwanda": ["images/what-if-rwanda-image.png"],
    "aspire-debate-rwanda": [
        "images/aspire-debate-rwanda-image.png",
        "images/aspire-debate-rwanda2..png"
    ],
    "informed-future-generations-ifg": [
        "images/ifg-mage.png",
        "images/ifg-image2.png"
    ],
    "oazis-health": ["images/oazis-health-image.png"],
    "helping-heart-family-rwanda-hhfr": [defaultOrganizationImage],
    "rwanda-we-want-organization-rww": [defaultOrganizationImage],
    "heza-initiative": [defaultOrganizationImage],
    "urphsa": [defaultOrganizationImage],
    "rise-and-live-organization": [defaultOrganizationImage],
    "nursing-research-club-organization": [defaultOrganizationImage],
    "inshuti-health-organization-iho": [defaultOrganizationImage],
    "mindora-health": [defaultOrganizationImage],
    "hope-for-tomorrow": [defaultOrganizationImage],
    "studio-shodwe": [defaultOrganizationImage]
};

const impactRatingsData = [
    {
        rating: "PLATINUM",
        organization: "Aspire Debate Rwanda",
        evidence: "Partnerships with 50+ secondary schools and 22 higher learning institutions; pioneered national and East African university debating championships; established since 2014 with systemic reach across Rwanda's education sector."
    },
    {
        rating: "PLATINUM",
        organization: "Informed Future Generations (IFG)",
        evidence: "Reached 5,000+ students through school clubs; collaborations with RBC and district governments; conducted 50+ outreaches; 40,000+ online views; founded in 2023 with remarkable rapid scaling."
    },
    {
        rating: "PLATINUM",
        organization: "Helping Heart Family Rwanda (HHFR)",
        evidence: "Supported 500+ children in education; legal aid to 10,000+ individuals; successfully reintegrated 50 former street children with families; founded in 2021 with deep, measurable community impact."
    },
    {
        rating: "GOLD",
        organization: "OAZIS Health",
        evidence: "Trained 850+ healthcare providers; engaged 500,000+ people in awareness campaigns; supported 720 digital health innovators; founded in 2020 with impressive scale in training and awareness."
    },
    {
        rating: "GOLD",
        organization: "Rwanda We Want Organization (RWW)",
        evidence: "Empowered 100+ graduates through leadership program; addressed intergenerational trauma for 126 individuals; reached 2,000+ youth with SRH education; registered NGO since 2015 with strong sustainability."
    },
    {
        rating: "GOLD",
        organization: "Care and Help Child Organization",
        evidence: "Expanded from supporting 35 to 574 vulnerable children; demonstrates powerful growth through partnerships; holistic approach to education, safety, and mental health with deep community roots since 2018."
    },
    {
        rating: "GOLD",
        organization: "MINDORA HEALTH",
        evidence: "Reached 1,000+ young people with AI-driven mental health platform; strong partnerships with universities; innovative tech-forward approach positioned for massive scale; founded in 2022."
    },
    {
        rating: "GOLD",
        organization: "Heza Initiative",
        evidence: "Strategic partnerships with UNICEF, RBC, and NCDA; provides daily nutrition to 200 children; multi-pronged approach to nutrition, agriculture, and teen mother empowerment; founded in 2022."
    },
    {
        rating: "GOLD",
        organization: "WHAT IF- Rwanda",
        evidence: "Installed water tanks and filtration systems; consistent provision of school fees and materials; powerful mentorship program building \"families of the heart\" for children at Iramiro Center."
    },
    {
        rating: "BRONZE",
        organization: "Inshuti Health Organization (IHO)",
        evidence: "Strong community-driven programs like 'HER CHOICE' and 'Learn to Unlearn'; deep personal roots in Nyagatare District suggesting significant localized impact; founded in 2020."
    },
    {
        rating: "BRONZE",
        organization: "Nursing Research Club Organization",
        evidence: "Successfully hosted two annual nursing symposiums (2023, 2024); upcoming Rwamagana Health Connect (July 2025); focuses on professional development with growing community outreach; founded in 2021."
    },
    {
        rating: "BRONZE",
        organization: "Hope for Tomorrow",
        evidence: "Returned 20 girls to school on full scholarships; reached 300+ adolescents with SRHR information; founded in 2024 with targeted, effective impact in Nyamasheke District."
    },
    {
        rating: "BRONZE",
        organization: "Rise and Live Organization",
        evidence: "Powerful individual stories of transformation (e.g., 18-year-old teen mother now sending child to school); crucial mental and reproductive health support for teen mothers in Huye."
    },
    {
        rating: "BRONZE",
        organization: "University of Rwanda Public Health Students' Association (URPHSA)",
        evidence: "Well-established student association since 2017; bridges academic knowledge with community action across NCDs, SRHR, and WASH; provides vital services through student-led initiatives."
    },
    {
        rating: "BRONZE",
        organization: "Studio Shodwe",
        evidence: "Amplifies powerful independent youth voices (e.g., Vidha Kabera, Cynthia Umutoni); focuses on breaking stigmas around mental health and orphanhood through storytelling and advocacy."
    }
];

const modulesData = [
    {
        id: 1,
        title: "Leadership Fundamentals",
        quarter: "Q1",
        description: "Build foundational leadership skills including communication, decision-making, and team management.",
        objectives: [
            "Understand core leadership principles and theories",
            "Develop effective communication strategies",
            "Build team management and delegation skills",
            "Create a personal leadership development plan"
        ],
        materials: [
            {
                type: "pdf",
                name: "Leadership Handbook",
                url: "https://drive.google.com/file/d/1IXJCsNsmhto7tlfB2eGga2cCgHhYnnQE/view",
                size: "2.5 MB"
            },
            {
                type: "slides",
                name: "Leadership Youth NGO",
                url: "https://docs.google.com/presentation/d/1DFuCiZCcJd4YRrWwa37Br449ZA_-3Snu/edit?usp=sharing&ouid=108406441382668787776&rtpof=true&sd=true"
            },
            {
                type: "slides",
                name: "Resilience Adaptive Mindset",
                url: "https://docs.google.com/presentation/d/1kPQH7bWzo7o9hxaIe-2_Tm4A7vNbW7NR/edit?usp=drive_link&ouid=108406441382668787776&rtpof=true&sd=true"
            },
            {
                type: "slides",
                name: "Soft Skills Self Management",
                url: "https://docs.google.com/presentation/d/1bDz2FJ2KJwUfQU31Gv88kNrTAArbIIzc/edit?usp=drive_link&ouid=108406441382668787776&rtpof=true&sd=true"
            },
            {
                type: "video",
                name: "Introduction to Leadership",
                url: "#",
                duration: "45 min"
            },
            {
                type: "pdf",
                name: "Case Studies Collection",
                url: "#",
                size: "1.8 MB"
            }
        ],
        assignment: {
            title: "Leadership Action Plan",
            description: "Develop a comprehensive leadership action plan for your organization or community. Include specific goals, strategies, and timelines.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 2,
        title: "Advocacy & Public Speaking",
        quarter: "Q1",
        description: "Master the art of advocacy and public speaking to amplify youth voices in policy and community discourse.",
        objectives: [
            "Design effective advocacy campaigns",
            "Master public speaking techniques",
            "Learn stakeholder engagement strategies",
            "Understand policy analysis and influence"
        ],
        materials: [
            {
                type: "pdf",
                name: "Advocacy Strategy Guide",
                url: "#",
                size: "3.2 MB"
            },
            {
                type: "video",
                name: "Public Speaking Masterclass",
                url: "#",
                duration: "60 min"
            }
        ],
        assignment: {
            title: "Advocacy Campaign Proposal",
            description: "Design a comprehensive advocacy campaign addressing a youth issue in your community. Include objectives, target audience, strategies, and expected outcomes.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 3,
        title: "Project Management Essentials",
        quarter: "Q2",
        description: "Learn to plan, execute, and manage impactful youth projects from inception to completion.",
        objectives: [
            "Apply project management methodologies",
            "Create detailed project plans and budgets",
            "Master risk management and mitigation",
            "Implement monitoring and evaluation frameworks"
        ],
        materials: [
            {
                type: "pdf",
                name: "Project Management Framework",
                url: "#",
                size: "4.1 MB"
            },
            {
                type: "pdf",
                name: "Budget Template & Guide",
                url: "#",
                size: "1.5 MB"
            }
        ],
        assignment: {
            title: "Complete Project Plan",
            description: "Develop a full project plan for a youth initiative including objectives, activities, timeline, budget, and M&E framework.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 4,
        title: "Digital Marketing & Communications",
        quarter: "Q2",
        description: "Harness digital tools and platforms to amplify your message and reach wider audiences.",
        objectives: [
            "Develop comprehensive digital marketing strategies",
            "Master social media management and analytics",
            "Create compelling visual and written content",
            "Understand SEO and digital advertising"
        ],
        materials: [
            {
                type: "pdf",
                name: "Digital Marketing Playbook",
                url: "#",
                size: "2.9 MB"
            },
            {
                type: "video",
                name: "Content Creation Workshop",
                url: "#",
                duration: "50 min"
            }
        ],
        assignment: {
            title: "Digital Campaign Strategy",
            description: "Create a 3-month digital marketing campaign for a youth organization including content calendar, platform strategy, and success metrics.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 5,
        title: "Fundraising & Resource Mobilization",
        quarter: "Q3",
        description: "Master strategies for securing funding and resources to sustain youth initiatives.",
        objectives: [
            "Understand diverse fundraising approaches",
            "Write compelling grant proposals",
            "Build donor relationships and stewardship",
            "Develop sustainable revenue models"
        ],
        materials: [
            {
                type: "pdf",
                name: "Fundraising Strategy Guide",
                url: "#",
                size: "3.5 MB"
            },
            {
                type: "pdf",
                name: "Grant Proposal Templates",
                url: "#",
                size: "2.1 MB"
            }
        ],
        assignment: {
            title: "Grant Proposal",
            description: "Write a complete grant proposal for a youth project addressing a specific community need. Include all standard sections and a detailed budget.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 6,
        title: "Strategic Planning & Organizational Development",
        quarter: "Q3",
        description: "Build sustainable youth organizations through strategic planning and effective governance.",
        objectives: [
            "Develop organizational strategic plans",
            "Establish governance structures and policies",
            "Implement performance management systems",
            "Plan for organizational sustainability"
        ],
        materials: [
            {
                type: "pdf",
                name: "Strategic Planning Toolkit",
                url: "#",
                size: "4.3 MB"
            },
            {
                type: "video",
                name: "Organizational Development Seminar",
                url: "#",
                duration: "70 min"
            }
        ],
        assignment: {
            title: "Strategic Plan",
            description: "Develop a 3-year strategic plan for a youth organization including vision, mission, goals, strategies, and implementation framework.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 7,
        title: "Monitoring, Evaluation & Impact Measurement",
        quarter: "Q4",
        description: "Learn to measure and communicate the impact of youth initiatives through robust M&E systems.",
        objectives: [
            "Design effective M&E frameworks",
            "Collect and analyze impact data",
            "Create compelling impact reports",
            "Use data for strategic decision-making"
        ],
        materials: [
            {
                type: "pdf",
                name: "M&E Framework Guide",
                url: "#",
                size: "3.8 MB"
            },
            {
                type: "pdf",
                name: "Data Analysis Tools",
                url: "#",
                size: "2.4 MB"
            }
        ],
        assignment: {
            title: "M&E Framework",
            description: "Design a complete M&E framework for a youth project including indicators, data collection methods, analysis plan, and reporting template.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    },
    {
        id: 8,
        title: "Innovation & Social Entrepreneurship",
        quarter: "Q4",
        description: "Transform ideas into sustainable social enterprises that create lasting community impact.",
        objectives: [
            "Apply design thinking to social challenges",
            "Develop viable business models",
            "Create financial projections and sustainability plans",
            "Understand scaling and growth strategies"
        ],
        materials: [
            {
                type: "pdf",
                name: "Social Enterprise Guide",
                url: "#",
                size: "3.1 MB"
            },
            {
                type: "video",
                name: "Design Thinking Workshop",
                url: "#",
                duration: "55 min"
            }
        ],
        assignment: {
            title: "Social Enterprise Proposal",
            description: "Develop a comprehensive social enterprise proposal including problem analysis, solution design, business model, and financial projections.",
            deadline: "2 weeks from start",
            passingGrade: 70
        }
    }
];

const opportunitiesData = [
    {
        id: 1,
        type: "funding",
        title: "Youth Innovation Grant 2026",
        description: "Funding available for innovative youth-led projects addressing community challenges. Grants range from $5,000 to $25,000.",
        deadline: "March 31, 2026",
        amount: "$5,000 - $25,000",
        provider: "Rwanda Innovation Fund"
    },
    {
        id: 2,
        type: "training",
        title: "Leadership Development Fellowship",
        description: "Intensive 6-month fellowship program for emerging youth leaders. Includes training, mentorship, and networking opportunities.",
        deadline: "April 15, 2026",
        duration: "6 months",
        provider: "African Leadership Academy"
    },
    {
        id: 3,
        type: "partnership",
        title: "UNICEF Youth Partnership Program",
        description: "Collaborate with UNICEF on youth advocacy and development initiatives across Rwanda.",
        deadline: "Rolling basis",
        type_detail: "Strategic Partnership",
        provider: "UNICEF Rwanda"
    },
    {
        id: 4,
        type: "funding",
        title: "Green Youth Initiative Fund",
        description: "Support for environmental projects led by young people. Focus on climate action and sustainability.",
        deadline: "May 1, 2026",
        amount: "$3,000 - $15,000",
        provider: "Environment Rwanda"
    },
    {
        id: 5,
        type: "training",
        title: "Digital Skills Bootcamp",
        description: "Free intensive training in web development, data science, and digital marketing for youth leaders.",
        deadline: "March 20, 2026",
        duration: "3 months",
        provider: "kLab Rwanda"
    },
    {
        id: 6,
        type: "partnership",
        title: "Education Ministry Youth Council",
        description: "Join the national youth advisory council to influence education policy and youth development strategies.",
        deadline: "April 30, 2026",
        type_detail: "Advisory Role",
        provider: "Ministry of Education"
    }
];

const eventsData = [
    {
        id: 1,
        title: "Youth Summit 2026",
        description: "Annual gathering of youth leaders from across Rwanda to share innovations, network, and shape the future.",
        date: "2026-03-15",
        time: "9:00 AM - 5:00 PM",
        location: "Kigali Convention Centre",
        type: "Summit"
    },
    {
        id: 2,
        title: "Advocacy Skills Workshop",
        description: "Practical training on advocacy strategies, policy engagement, and stakeholder management.",
        date: "2026-03-22",
        time: "2:00 PM - 5:00 PM",
        location: "YAN Training Center",
        type: "Workshop"
    },
    {
        id: 3,
        title: "Networking Night",
        description: "Casual networking event connecting youth leaders, entrepreneurs, and potential mentors.",
        date: "2026-04-05",
        time: "6:00 PM - 9:00 PM",
        location: "Impact Hub Kigali",
        type: "Networking"
    },
    {
        id: 4,
        title: "Digital Innovation Showcase",
        description: "Showcase of youth-led digital solutions and innovations addressing community challenges.",
        date: "2026-04-12",
        time: "10:00 AM - 4:00 PM",
        location: "kLab Rwanda",
        type: "Showcase"
    }
];

const galleryImages = [
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600",
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600",
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600"
];

// ================================
// STATE MANAGEMENT
// ================================

let currentRole = localStorage.getItem('yanRole') || 'public';
let currentUser = JSON.parse(localStorage.getItem('yanUser')) || null;
let currentModule = null;
let currentGalleryIndex = 0;

// Initialize module progress from localStorage
function getModuleProgress(moduleId) {
    const progress = localStorage.getItem(`module_${moduleId}_progress`);
    return progress ? JSON.parse(progress) : {
        status: 'not-started',
        progress: 0,
        assignmentSubmitted: false,
        submittedFile: null,
        submissionDate: null,
        feedback: null,
        grade: null
    };
}

function saveModuleProgress(moduleId, progress) {
    localStorage.setItem(`module_${moduleId}_progress`, JSON.stringify(progress));
    updateDashboardMetrics();
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize role
    updateRoleDisplay(currentRole);
    
    // Initialize user
    if (currentUser) {
        showLoggedInState();
    }
    
    // Initialize navigation
    initializeNavigation();
    
    // Initialize sections
    initializeOrganizations();
    renderImpactRatings();
    initializeCapacityBuilding();
    initializeOpportunities();
    initializeEvents();
    initializeGallery();
    initializeContact();
    
    // Initialize scroll effects
    initializeScrollEffects();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize dashboard if user is logged in
    if (currentUser) {
        initializeDashboard();
    }
}

// ================================
// NAVIGATION
// ================================

function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Hamburger menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Role selector
    const roleBtns = document.querySelectorAll('.role-btn');
    roleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.dataset.role;
            updateRoleDisplay(role);
        });
    });
    
    // Login button
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.addEventListener('click', () => {
        simulateLogin();
    });
    
    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        if (dropdownMenu) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Dashboard navigation
    const dashboardLink = document.querySelector('a[href="#dashboard"]');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            showDashboard();
        });
    }
    
    const backToSiteBtn = document.getElementById('backToSite');
    if (backToSiteBtn) {
        backToSiteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            hideDashboard();
        });
    }
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function updateRoleDisplay(role) {
    currentRole = role;
    localStorage.setItem('yanRole', role);
    
    // Update role buttons
    document.querySelectorAll('.role-btn').forEach(btn => {
        if (btn.dataset.role === role) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide role-specific elements
    const roleElements = document.querySelectorAll('[data-role]');
    roleElements.forEach(el => {
        const allowedRoles = el.dataset.role.split(',');
        if (allowedRoles.includes(role)) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    });
    
    // Update capacity building view
    updateCapacityBuildingView();
}

function simulateLogin() {
    // Simulate login - in production, this would call an API
    const user = {
        name: "Young Leader",
        email: "leader@example.com",
        initials: "YL",
        joinDate: new Date().toISOString()
    };
    
    currentUser = user;
    localStorage.setItem('yanUser', JSON.stringify(user));
    
    showLoggedInState();
    
    // Show notification
    showNotification('Welcome back! You are now logged in.');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('yanUser');
    
    // Hide profile, show login button
    document.getElementById('loginBtn').style.display = '';
    document.getElementById('profileDropdown').style.display = 'none';
    
    // Return to public role
    updateRoleDisplay('public');
    
    // Hide dashboard
    hideDashboard();
    
    // Show notification
    showNotification('You have been logged out.');
}

function showLoggedInState() {
    document.getElementById('loginBtn').style.display = 'none';
    document.getElementById('profileDropdown').style.display = 'flex';
    
    // Update profile info
    const profileName = document.querySelector('.profile-name');
    const profileAvatar = document.querySelector('.profile-avatar');
    
    if (profileName) profileName.textContent = currentUser.name;
    if (profileAvatar) profileAvatar.textContent = currentUser.initials;
    
    // Switch to member role by default
    if (currentRole === 'public') {
        updateRoleDisplay('member');
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ================================
// SCROLL EFFECTS
// ================================

function initializeScrollEffects() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // Observe stat counters
    document.querySelectorAll('.stat-item').forEach(el => observer.observe(el));
}

function initializeAnimations() {
    // Add reveal class to animated elements
    const animatedElements = document.querySelectorAll('.org-card, .module-card, .opportunity-card, .event-card');
    animatedElements.forEach(el => el.classList.add('reveal'));
    
    // Re-observe with intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => observer.observe(el));
    
    // Counter animation for stats
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ================================
// ORGANIZATIONS SECTION
// ================================

function initializeOrganizations() {
    const categoriesContainer = document.getElementById('organizationsGrid');
    if (!categoriesContainer) {
        return;
    }

    categoriesContainer.innerHTML = '';

    organizationSectorOrder.forEach((sector) => {
        const organizationsInSector = organizationsData.filter((org) => org.sectors && org.sectors.includes(sector));
        if (!organizationsInSector.length) {
            return;
        }

        const sectorBlock = document.createElement('article');
        sectorBlock.className = 'organization-category';

        const heading = document.createElement('h3');
        heading.className = 'organization-category-title';
        heading.textContent = sector;

        const grid = document.createElement('div');
        grid.className = 'organizations-grid';

        organizationsInSector.forEach((org) => {
            const card = createOrganizationCard(org);
            grid.appendChild(card);
        });

        sectorBlock.appendChild(heading);
        sectorBlock.appendChild(grid);
        categoriesContainer.appendChild(sectorBlock);

        applyImageFallbacks(grid);
    });

    if (categoriesContainer.dataset.eventsBound !== 'true') {
        categoriesContainer.addEventListener('click', (event) => {
            const button = event.target.closest('.org-learn-btn');
            if (!button) {
                return;
            }

            event.preventDefault();
            openOrganizationModal(button.dataset.org);
        });
        categoriesContainer.dataset.eventsBound = 'true';
    }
    
    // Add organization button (admin only)
    const addOrgBtn = document.getElementById('addOrgBtn');
    if (addOrgBtn) {
        addOrgBtn.addEventListener('click', () => {
            openModal('addOrgModal');
        });
    }
    
    // Add organization form
    const addOrgForm = document.getElementById('addOrgForm');
    if (addOrgForm) {
        addOrgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addOrganization();
        });
    }
}

function createOrganizationCard(org) {
    const images = getOrganizationImages(org);
    const primaryImage = images[0] || defaultOrganizationImage;

    const card = document.createElement('div');
    card.className = 'org-card reveal';
    card.innerHTML = `
        <img src="${primaryImage}" alt="${org.name}" class="org-image" loading="lazy">
        <div class="org-content">
            <h3 class="org-name">${org.name}</h3>
            <p class="org-description">${org.description}</p>
            <button type="button" class="org-link org-learn-btn" data-org="${org.slug}">
                Learn More
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
    return card;
}

function openOrganizationModal(orgSlug) {
    const org = organizationsData.find(item => item.slug === orgSlug);
    if (!org) {
        return;
    }

    const title = document.getElementById('orgModalTitle');
    const body = document.getElementById('orgModalBody');

    if (title) {
        title.textContent = org.name;
    }
    if (body) {
        const images = getOrganizationImages(org);
        const imageMarkup = images.map((imagePath, index) => `
            <img
                src="${imagePath}"
                alt="${org.name} image ${index + 1}"
                class="org-modal-gallery-image"
                loading="lazy"
            >
        `).join('');

        const founding = org.foundingYear ? `<p class="org-modal-meta"><strong>Founding Year:</strong> ${org.foundingYear}</p>` : '';
        const highlights = (org.impactHighlights || []).map((item) => `<li>${item}</li>`).join('');
        const programs = (org.keyPrograms || []).map((item) => `<li>${item}</li>`).join('');

        body.innerHTML = `
            <div class="org-modal-gallery" aria-label="Organization images">${imageMarkup}</div>
            <p id="orgModalDescription">${org.details || org.description}</p>
            ${founding}
            <div class="org-modal-section">
                <h4>Impact Highlights</h4>
                <ul>${highlights || '<li>Impact evidence to be updated.</li>'}</ul>
            </div>
            <div class="org-modal-section">
                <h4>Key Programs</h4>
                <ul>${programs || '<li>Program details to be updated.</li>'}</ul>
            </div>
        `;

        applyImageFallbacks(body);
    }

    openModal('orgDetailsModal');
}

function addOrganization() {
    const name = document.getElementById('orgName').value;
    const description = document.getElementById('orgDescription').value;
    const image = document.getElementById('orgImage').value;
    
    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newOrg = {
        id: organizationsData.length + 1,
        name,
        slug: slug || `organization-${organizationsData.length + 1}`,
        description,
        details: description,
        keyPrograms: ["Program information coming soon"],
        impactHighlights: ["Impact evidence coming soon"],
        images: image ? [image] : [defaultOrganizationImage],
        sectors: ["EDUCATION"]
    };
    
    organizationsData.push(newOrg);
    
    initializeOrganizations();
    
    closeModal('addOrgModal');
    document.getElementById('addOrgForm').reset();
    showNotification('Organization added successfully!');
}

function getOrganizationImages(org) {
    if (Array.isArray(org.images) && org.images.length) {
        return org.images;
    }

    const mappedImages = organizationImageMap[org.slug];
    if (Array.isArray(mappedImages) && mappedImages.length) {
        return mappedImages;
    }

    return [defaultOrganizationImage];
}

function applyImageFallbacks(container) {
    container.querySelectorAll('img').forEach((imageElement) => {
        imageElement.addEventListener('error', () => {
            if (imageElement.src.includes(defaultOrganizationImage)) {
                return;
            }

            imageElement.src = defaultOrganizationImage;
        }, { once: true });
    });
}

function renderImpactRatings() {
    const grid = document.getElementById('impactRatingGrid');
    if (!grid) {
        return;
    }

    grid.innerHTML = '';
    impactRatingsData.forEach((item) => {
        const card = document.createElement('article');
        const ratingClass = getRatingClass(item.rating);
        card.className = `impact-card ${ratingClass} reveal`;
        card.innerHTML = `
            <div class="impact-card-header">
                <h3 class="impact-org-name">${item.organization}</h3>
                <span class="rating-badge ${ratingClass}">${item.rating}</span>
            </div>
            <p class="impact-evidence">${item.evidence}</p>
        `;
        grid.appendChild(card);
    });
}

function getRatingClass(rating) {
    if (rating === 'PLATINUM') {
        return 'rating-platinum';
    }

    if (rating === 'GOLD') {
        return 'rating-gold';
    }

    return 'rating-bronze';
}

// ================================
// CAPACITY BUILDING SECTION
// ================================

function initializeCapacityBuilding() {
    updateCapacityBuildingView();
    
    // Back to modules button
    const backBtn = document.getElementById('backToModules');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('lmsSection').style.display = 'none';
            document.getElementById('capacity').scrollIntoView({ behavior: 'smooth' });
        });
    }
}

function updateCapacityBuildingView() {
    const publicView = document.getElementById('capacityPublicView');
    const memberView = document.getElementById('capacityMemberView');
    
    if (currentRole === 'public') {
        publicView.style.display = 'block';
        memberView.style.display = 'none';
    } else {
        publicView.style.display = 'none';
        memberView.style.display = 'block';
        renderModules();
    }
}

function renderModules() {
    const grid = document.getElementById('modulesGrid');
    grid.innerHTML = '';
    
    modulesData.forEach(module => {
        const progress = getModuleProgress(module.id);
        const card = createModuleCard(module, progress);
        grid.appendChild(card);
    });
}

function createModuleCard(module, progress) {
    const card = document.createElement('div');
    card.className = 'module-card reveal';
    
    const statusClass = progress.status;
    const statusText = progress.status === 'not-started' ? 'Not Started' : 
                       progress.status === 'in-progress' ? 'In Progress' : 'Completed';
    
    card.innerHTML = `
        <div class="module-header">
            <span class="module-quarter-badge">${module.quarter}</span>
            <span class="module-status ${statusClass}">${statusText}</span>
        </div>
        <h3 class="module-title">${module.title}</h3>
        <p class="module-description">${module.description}</p>
        <div class="module-progress-section">
            <div class="progress-label">
                <span>Progress</span>
                <span>${progress.progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress.progress}%"></div>
            </div>
        </div>
        <div class="module-footer">
            <button class="enter-module-btn" onclick="openModule(${module.id})">
                Enter Module
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    `;
    
    return card;
}

// ================================
// LMS SYSTEM
// ================================

function openModule(moduleId) {
    currentModule = modulesData.find(m => m.id === moduleId);
    if (!currentModule) return;
    
    const progress = getModuleProgress(moduleId);
    
    // Mark as in-progress if not started
    if (progress.status === 'not-started') {
        progress.status = 'in-progress';
        progress.progress = 10;
        saveModuleProgress(moduleId, progress);
    }
    
    // Hide capacity section, show LMS
    document.getElementById('capacity').style.display = 'none';
    const lmsSection = document.getElementById('lmsSection');
    lmsSection.style.display = 'block';
    
    // Update module info
    document.getElementById('moduleTitle').textContent = currentModule.title;
    document.getElementById('moduleQuarter').textContent = currentModule.quarter;
    
    // Update progress
    updateModuleProgress();
    
    // Load overview section by default
    switchLMSSection('overview');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Setup LMS navigation
    setupLMSNavigation();
}

function setupLMSNavigation() {
    const navItems = document.querySelectorAll('.lms-nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchLMSSection(section);
        });
    });
}

function switchLMSSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.lms-nav-item').forEach(item => {
        if (item.dataset.section === sectionName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Render content
    const content = document.getElementById('lmsContent');
    
    switch(sectionName) {
        case 'overview':
            renderOverview(content);
            break;
        case 'materials':
            renderMaterials(content);
            break;
        case 'assignment':
            renderAssignment(content);
            break;
        case 'feedback':
            renderFeedback(content);
            break;
        case 'certificate':
            renderCertificate(content);
            break;
    }
}

function renderOverview(container) {
    const objectives = currentModule.objectives.map(obj => 
        `<li>${obj}</li>`
    ).join('');
    
    container.innerHTML = `
        <div class="content-section active">
            <h2>${currentModule.title}</h2>
            <p>${currentModule.description}</p>
            
            <h3>Learning Objectives</h3>
            <ul class="learning-objectives">
                ${objectives}
            </ul>
            
            <h3>Module Structure</h3>
            <p>This module includes:</p>
            <ul class="learning-objectives">
                <li>Comprehensive learning materials and resources</li>
                <li>Practical assignment to apply your knowledge</li>
                <li>Personalized feedback from instructors</li>
                <li>Certificate of completion upon successful submission</li>
            </ul>
            
            <p style="margin-top: 2rem; color: var(--text-secondary);">
                <strong>Duration:</strong> Approximately 2-3 weeks<br>
                <strong>Commitment:</strong> 5-7 hours per week<br>
                <strong>Passing Grade:</strong> ${currentModule.assignment.passingGrade}%
            </p>
        </div>
    `;
}

function renderMaterials(container) {
    const materialsHTML = currentModule.materials.map(material => {
        const icon = material.type === 'pdf' ? '📄' : 
                    material.type === 'video' ? '🎥' : '📁';
        const meta = material.size ? material.size : material.duration;
        
        return `
            <div class="material-item">
                <div class="material-icon">${icon}</div>
                <div class="material-info">
                    <h4>${material.name}</h4>
                    <div class="material-meta">
                        <span>${material.type.toUpperCase()}</span>
                        <span>${meta}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = `
        <div class="content-section active">
            <h2>Learning Materials</h2>
            <p>Access all course materials, readings, and resources below. Click on any item to view or download.</p>
            
            <div class="materials-grid">
                ${materialsHTML}
            </div>
            
            ${currentRole === 'admin' ? `
                <div style="margin-top: 2rem;">
                    <button class="btn btn-outline" onclick="uploadMaterial()">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <span>Add Material</span>
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

function renderAssignment(container) {
    const progress = getModuleProgress(currentModule.id);
    
    container.innerHTML = `
        <div class="content-section active">
            <h2>Assignment</h2>
            
            <div class="assignment-box">
                <h3>${currentModule.assignment.title}</h3>
                <p>${currentModule.assignment.description}</p>
                <p style="margin-top: 1rem;">
                    <strong>Deadline:</strong> ${currentModule.assignment.deadline}<br>
                    <strong>Passing Grade:</strong> ${currentModule.assignment.passingGrade}%
                </p>
            </div>
            
            ${progress.assignmentSubmitted ? `
                <div class="submission-status">
                    <h4>✓ Assignment Submitted</h4>
                    <p><strong>File:</strong> ${progress.submittedFile}</p>
                    <p><strong>Submitted on:</strong> ${new Date(progress.submissionDate).toLocaleDateString()}</p>
                    <p style="margin-top: 1rem; color: var(--text-secondary);">
                        Your assignment has been submitted successfully. Check the Feedback & Grades section for instructor feedback.
                    </p>
                </div>
            ` : `
                <div class="file-upload-area" id="uploadArea">
                    <div class="upload-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17 8L12 3L7 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 3V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h4>Upload Your Assignment</h4>
                    <p>Click to browse or drag and drop your file here</p>
                    <p style="font-size: 0.875rem; color: var(--text-light); margin-top: 0.5rem;">
                        Accepted formats: PDF, DOCX, PPTX (Max 10MB)
                    </p>
                    <input type="file" id="fileInput" style="display: none;" accept=".pdf,.docx,.pptx">
                </div>
                
                <div id="uploadedFileDisplay" style="display: none;"></div>
                
                <button class="submit-btn" id="submitAssignment" disabled>
                    Submit Assignment
                </button>
            `}
        </div>
    `;
    
    if (!progress.assignmentSubmitted) {
        setupFileUpload();
    }
}

function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const submitBtn = document.getElementById('submitAssignment');
    const fileDisplay = document.getElementById('uploadedFileDisplay');
    let selectedFile = null;
    
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    });
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    });
    
    function handleFileSelect(file) {
        if (!file) return;
        
        selectedFile = file;
        
        fileDisplay.innerHTML = `
            <div class="uploaded-file">
                <div class="file-icon">📄</div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button class="remove-file" onclick="removeFile()">×</button>
            </div>
        `;
        
        fileDisplay.style.display = 'block';
        submitBtn.disabled = false;
    }
    
    window.removeFile = function() {
        selectedFile = null;
        fileInput.value = '';
        fileDisplay.style.display = 'none';
        submitBtn.disabled = true;
    };
    
    submitBtn.addEventListener('click', () => {
        if (selectedFile) {
            submitAssignment(selectedFile);
        }
    });
}

function submitAssignment(file) {
    const progress = getModuleProgress(currentModule.id);
    
    progress.assignmentSubmitted = true;
    progress.submittedFile = file.name;
    progress.submissionDate = new Date().toISOString();
    progress.progress = 75;
    
    saveModuleProgress(currentModule.id, progress);
    
    showNotification('Assignment submitted successfully!');
    
    // Reload assignment section
    switchLMSSection('assignment');
    
    // Update progress display
    updateModuleProgress();
}

function renderFeedback(container) {
    const progress = getModuleProgress(currentModule.id);
    
    if (currentRole === 'admin') {
        // Admin view - can enter feedback
        container.innerHTML = `
            <div class="content-section active">
                <h2>Feedback & Grades</h2>
                
                ${progress.assignmentSubmitted ? `
                    <div class="feedback-box">
                        <h4>Student Submission</h4>
                        <p><strong>File:</strong> ${progress.submittedFile}</p>
                        <p><strong>Submitted:</strong> ${new Date(progress.submissionDate).toLocaleDateString()}</p>
                    </div>
                    
                    <div class="feedback-box" style="margin-top: 1.5rem;">
                        <h4>Enter Feedback & Grade</h4>
                        <form class="admin-feedback-form" id="feedbackForm">
                            <textarea placeholder="Provide detailed feedback..." id="feedbackText">${progress.feedback || ''}</textarea>
                            <input type="number" placeholder="Grade (0-100)" id="gradeInput" min="0" max="100" value="${progress.grade || ''}">
                            <button type="submit" class="btn btn-primary">Save Feedback</button>
                        </form>
                    </div>
                ` : `
                    <p style="color: var(--text-secondary);">No assignment submitted yet.</p>
                `}
            </div>
        `;
        
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveFeedback();
            });
        }
    } else {
        // Member view - can view feedback
        container.innerHTML = `
            <div class="content-section active">
                <h2>Feedback & Grades</h2>
                
                ${progress.feedback ? `
                    <div class="grade-display">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Grade: ${progress.grade}%
                    </div>
                    
                    <div class="feedback-box">
                        <h4>Instructor Feedback</h4>
                        <p>${progress.feedback}</p>
                    </div>
                    
                    ${progress.grade >= currentModule.assignment.passingGrade ? `
                        <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(34, 197, 94, 0.1); border-radius: 0.75rem; border-left: 4px solid #22c55e;">
                            <p style="color: #22c55e; font-weight: 600;">
                                🎉 Congratulations! You've passed this module. Your certificate is now available.
                            </p>
                        </div>
                    ` : `
                        <div style="margin-top: 2rem; padding: 1.5rem; background: rgba(245, 158, 11, 0.1); border-radius: 0.75rem; border-left: 4px solid #f59e0b;">
                            <p style="color: #f59e0b; font-weight: 600;">
                                Please review the feedback and consider resubmitting your assignment to achieve the passing grade.
                            </p>
                        </div>
                    `}
                ` : `
                    <p style="color: var(--text-secondary);">
                        ${progress.assignmentSubmitted ? 
                            'Your assignment is under review. Feedback will be available soon.' :
                            'Submit your assignment to receive feedback and grades.'}
                    </p>
                `}
            </div>
        `;
    }
}

function saveFeedback() {
    const feedback = document.getElementById('feedbackText').value;
    const grade = parseInt(document.getElementById('gradeInput').value);
    
    if (!feedback || isNaN(grade)) {
        showNotification('Please provide both feedback and grade.');
        return;
    }
    
    const progress = getModuleProgress(currentModule.id);
    progress.feedback = feedback;
    progress.grade = grade;
    
    if (grade >= currentModule.assignment.passingGrade) {
        progress.status = 'completed';
        progress.progress = 100;
    }
    
    saveModuleProgress(currentModule.id, progress);
    
    showNotification('Feedback saved successfully!');
    switchLMSSection('feedback');
    updateModuleProgress();
}

function renderCertificate(container) {
    const progress = getModuleProgress(currentModule.id);
    const canDownload = progress.grade >= currentModule.assignment.passingGrade;
    
    container.innerHTML = `
        <div class="content-section active">
            <h2>Certificate</h2>
            
            <div class="certificate-box">
                <div class="certificate-icon ${!canDownload ? 'certificate-locked' : ''}">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                        <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="currentColor" stroke-width="2"/>
                        <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                
                <h3>${canDownload ? 'Certificate Available!' : 'Certificate Locked'}</h3>
                
                ${canDownload ? `
                    <p style="color: var(--text-secondary); margin: 1rem 0 2rem;">
                        Congratulations! You've successfully completed this module. Download your certificate below.
                    </p>
                    <button class="download-certificate-btn" onclick="downloadCertificate()">
                        Download Certificate
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M3 13L3 14C3 15.1046 3.89543 16 5 16L15 16C16.1046 16 17 15.1046 17 14L17 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M10 3L10 12M10 12L7 9M10 12L13 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                ` : `
                    <p style="color: var(--text-secondary); margin: 1rem 0;">
                        Complete the assignment with a passing grade (${currentModule.assignment.passingGrade}%+) to unlock your certificate.
                    </p>
                    <button class="download-certificate-btn" disabled>
                        Certificate Locked
                    </button>
                    
                    <div style="margin-top: 2rem; padding: 1.5rem; background: var(--bg-primary); border-radius: 0.75rem;">
                        <h4 style="margin-bottom: 0.5rem;">Requirements:</h4>
                        <ul style="list-style: none; padding: 0;">
                            <li style="padding: 0.5rem 0; color: ${progress.assignmentSubmitted ? '#22c55e' : 'var(--text-secondary)'};">
                                ${progress.assignmentSubmitted ? '✓' : '○'} Submit assignment
                            </li>
                            <li style="padding: 0.5rem 0; color: ${progress.grade >= currentModule.assignment.passingGrade ? '#22c55e' : 'var(--text-secondary)'};">
                                ${progress.grade >= currentModule.assignment.passingGrade ? '✓' : '○'} Achieve ${currentModule.assignment.passingGrade}%+ grade
                            </li>
                        </ul>
                    </div>
                `}
            </div>
        </div>
    `;
}

function downloadCertificate() {
    // Create certificate HTML
    const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Certificate - ${currentModule.title}</title>
            <style>
                body {
                    font-family: 'Georgia', serif;
                    padding: 60px;
                    text-align: center;
                    background: white;
                }
                .certificate {
                    border: 20px solid #06b6d4;
                    padding: 60px;
                    max-width: 800px;
                    margin: 0 auto;
                    position: relative;
                }
                .certificate::before {
                    content: '';
                    position: absolute;
                    inset: 15px;
                    border: 3px solid #0891b2;
                }
                h1 {
                    font-size: 48px;
                    color: #06b6d4;
                    margin-bottom: 30px;
                }
                .recipient {
                    font-size: 36px;
                    color: #1e293b;
                    margin: 30px 0;
                    font-style: italic;
                }
                .details {
                    font-size: 20px;
                    color: #64748b;
                    margin: 20px 0;
                    line-height: 1.8;
                }
                .module-title {
                    font-size: 28px;
                    color: #1e293b;
                    font-weight: bold;
                    margin: 30px 0;
                }
                .date {
                    margin-top: 50px;
                    font-size: 18px;
                    color: #64748b;
                }
                .signature {
                    margin-top: 60px;
                    padding-top: 20px;
                    border-top: 2px solid #1e293b;
                    display: inline-block;
                    min-width: 300px;
                }
            </style>
        </head>
        <body>
            <div class="certificate">
                <h1>Certificate of Completion</h1>
                <p class="details">This is to certify that</p>
                <div class="recipient">${currentUser.name}</div>
                <p class="details">has successfully completed the module</p>
                <div class="module-title">${currentModule.title}</div>
                <p class="details">
                    as part of the Youth Advocates Network Rwanda<br>
                    Capacity Building Program
                </p>
                <div class="date">
                    Issued on ${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
                <div class="signature">
                    <strong>YAN Leadership Team</strong>
                </div>
            </div>
        </body>
        </html>
    `;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(certificateHTML);
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
        printWindow.print();
    }, 250);
    
    showNotification('Certificate ready! Use Print to PDF to save.');
}

function updateModuleProgress() {
    const progress = getModuleProgress(currentModule.id);
    
    document.getElementById('progressPercent').textContent = `${progress.progress}%`;
    document.getElementById('progressFill').style.width = `${progress.progress}%`;
}

function uploadMaterial() {
    showNotification('Material upload functionality - would integrate with file storage in production.');
}

// ================================
// OPPORTUNITIES SECTION
// ================================

function initializeOpportunities() {
    renderOpportunities('all');
    
    // Filter tabs
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.filter;
            renderOpportunities(filter);
        });
    });
}

function renderOpportunities(filter) {
    const grid = document.getElementById('opportunitiesGrid');
    grid.innerHTML = '';
    
    const filtered = filter === 'all' ? 
        opportunitiesData : 
        opportunitiesData.filter(opp => opp.type === filter);
    
    filtered.forEach(opp => {
        const card = createOpportunityCard(opp);
        grid.appendChild(card);
    });
}

function createOpportunityCard(opp) {
    const card = document.createElement('div');
    card.className = 'opportunity-card reveal';
    
    const badgeClass = `badge-${opp.type}`;
    const typeName = opp.type.charAt(0).toUpperCase() + opp.type.slice(1);
    
    card.innerHTML = `
        <span class="opportunity-badge ${badgeClass}">${typeName}</span>
        <h3 class="opportunity-title">${opp.title}</h3>
        <p class="opportunity-description">${opp.description}</p>
        <div class="opportunity-meta">
            <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13 2H3C2.44772 2 2 2.44772 2 3V13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13V3C14 2.44772 13.5523 2 13 2Z" stroke="currentColor" stroke-width="1.5"/>
                    <path d="M11 1V3M5 1V3M2 5H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                ${opp.deadline}
            </div>
            ${opp.amount ? `
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1V15M11 3H6.5C5.57174 3 4.6815 3.36875 4.02513 4.02513C3.36875 4.6815 3 5.57174 3 6.5C3 7.42826 3.36875 8.3185 4.02513 8.97487C4.6815 9.63125 5.57174 10 6.5 10H9.5C10.4283 10 11.3185 10.3687 11.9749 11.0251C12.6313 11.6815 13 12.5717 13 13.5C13 14.4283 12.6313 15.3185 11.9749 15.9749C11.3185 16.6313 10.4283 17 9.5 17H3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    ${opp.amount}
                </div>
            ` : ''}
            ${opp.duration ? `
                <div class="meta-item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M8 4V8L11 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    ${opp.duration}
                </div>
            ` : ''}
        </div>
        <div class="opportunity-actions">
            <button class="register-btn" onclick="registerOpportunity(${opp.id})">
                Register Interest
            </button>
        </div>
    `;
    
    return card;
}

function registerOpportunity(id) {
    showNotification('Registration submitted! We\'ll contact you with more details.');
}

// ================================
// EVENTS SECTION
// ================================

function initializeEvents() {
    const grid = document.getElementById('eventsGrid');
    
    eventsData.forEach(event => {
        const card = createEventCard(event);
        grid.appendChild(card);
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card reveal';
    
    const date = new Date(event.date);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    card.innerHTML = `
        <div class="event-date">
            <div class="event-day">${day}</div>
            <div class="event-month">${month}</div>
        </div>
        <div class="event-content">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-details">
                <div class="event-detail">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M8 4V8L11 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    ${event.time}
                </div>
                <div class="event-detail">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M14 6.5C14 11 8 15 8 15C8 15 2 11 2 6.5C2 5 2.63 3.58 3.75 2.54C4.87 1.5 6.39 1 8 1C9.61 1 11.13 1.5 12.25 2.54C13.37 3.58 14 5 14 6.5Z" stroke="currentColor" stroke-width="1.5"/>
                        <circle cx="8" cy="6.5" r="2" stroke="currentColor" stroke-width="1.5"/>
                    </svg>
                    ${event.location}
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-actions">
                <button class="add-calendar-btn" onclick="addToCalendar(${event.id})">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="3" width="12" height="12" rx="1" stroke="currentColor" stroke-width="1.5"/>
                        <path d="M11 1V3M5 1V3M2 6H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                    Add to Calendar
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function addToCalendar(id) {
    showNotification('Calendar invite sent to your email!');
}

// ================================
// GALLERY SECTION
// ================================

function initializeGallery() {
    const grid = document.getElementById('galleryGrid');
    
    galleryImages.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item reveal';
        item.innerHTML = `
            <img src="${img}" alt="YAN Gallery Image ${index + 1}" class="gallery-image">
            <div class="gallery-overlay">
                <span class="gallery-caption">YAN Event ${index + 1}</span>
            </div>
        `;
        
        item.addEventListener('click', () => {
            openGalleryModal(index);
        });
        
        grid.appendChild(item);
    });
}

function openGalleryModal(index) {
    currentGalleryIndex = index;
    const modal = document.getElementById('galleryModal');
    const img = document.getElementById('galleryModalImage');
    
    img.src = galleryImages[index];
    modal.classList.add('active');
    
    // Setup navigation
    document.getElementById('galleryPrev').onclick = () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        img.src = galleryImages[currentGalleryIndex];
    };
    
    document.getElementById('galleryNext').onclick = () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        img.src = galleryImages[currentGalleryIndex];
    };
}

// ================================
// CONTACT SECTION
// ================================

function initializeContact() {
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        handleContactSubmit();
    });
}

function handleContactSubmit() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    
    // Simulate form submission
    setTimeout(() => {
        form.reset();
        success.style.display = 'flex';
        
        setTimeout(() => {
            success.style.display = 'none';
        }, 5000);
    }, 500);
}

// ================================
// DASHBOARD
// ================================

function initializeDashboard() {
    updateDashboardMetrics();
}

function updateDashboardMetrics() {
    // Calculate metrics from module progress
    let completedModules = 0;
    let pendingAssignments = 0;
    let certificatesEarned = 0;
    
    modulesData.forEach(module => {
        const progress = getModuleProgress(module.id);
        if (progress.status === 'completed') {
            completedModules++;
            certificatesEarned++;
        }
        if (progress.status === 'in-progress' && !progress.assignmentSubmitted) {
            pendingAssignments++;
        }
    });
    
    document.getElementById('completedModules').textContent = completedModules;
    document.getElementById('pendingAssignments').textContent = pendingAssignments;
    document.getElementById('upcomingEvents').textContent = eventsData.length;
    document.getElementById('certificatesEarned').textContent = certificatesEarned;
    
    // Update dashboard role badge
    const dashboardRole = document.getElementById('dashboardRole');
    if (dashboardRole) {
        dashboardRole.textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    }
}

function showDashboard() {
    // Hide main sections
    document.querySelectorAll('section:not(#dashboard)').forEach(section => {
        section.style.display = 'none';
    });
    
    // Hide navigation and footer
    document.getElementById('navbar').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
    
    // Show dashboard
    document.getElementById('dashboard').style.display = 'block';
    
    // Update metrics
    updateDashboardMetrics();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function hideDashboard() {
    // Show main sections
    document.querySelectorAll('section:not(#dashboard)').forEach(section => {
        section.style.display = '';
    });
    
    // Show navigation and footer
    document.getElementById('navbar').style.display = '';
    document.querySelector('.footer').style.display = '';
    
    // Hide dashboard and LMS
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('lmsSection').style.display = 'none';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ================================
// MODAL UTILITIES
// ================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.focus();
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        return;
    }
    modal.classList.remove('active');

    if (!document.querySelector('.modal.active')) {
        document.body.style.overflow = '';
    }
}

// Close modal when clicking close button
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        if (modalId) {
            closeModal(modalId);
        } else {
            // For gallery modal
            const parentModal = btn.closest('.modal');
            if (parentModal && parentModal.id) {
                closeModal(parentModal.id);
            }
        }
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// ================================
// HERO CTA
// ================================

document.getElementById('heroJoinBtn').addEventListener('click', () => {
    if (currentUser) {
        showNotification('You\'re already a member! Check out our opportunities.');
        document.getElementById('opportunities').scrollIntoView({ behavior: 'smooth' });
    } else {
        showNotification('Please login to join our network.');
        document.getElementById('loginBtn').click();
    }
});

// ================================
// KEYBOARD SHORTCUTS
// ================================

document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
        
        // Close dropdowns
        document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
            menu.classList.remove('active');
        });
    }
    
    // Arrow keys for gallery navigation
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
            document.getElementById('galleryPrev').click();
        } else if (e.key === 'ArrowRight') {
            document.getElementById('galleryNext').click();
        }
    }
});

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================================
// HELPER FUNCTIONS
// ================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(timeString) {
    // Parse and format time string
    return timeString;
}

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ================================
// ERROR HANDLING
// ================================

window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ================================
// INITIALIZATION COMPLETE
// ================================

console.log('%c YAN Rwanda Platform Loaded Successfully! ', 'background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); color: white; padding: 10px 20px; font-size: 16px; font-weight: bold;');
console.log('Role:', currentRole);
console.log('User:', currentUser);
console.log('Modules:', modulesData.length);
console.log('Platform ready for deployment!');