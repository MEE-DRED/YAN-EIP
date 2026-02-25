const members = [
  {
    name: "CARE AND HELP CHILD ORGANIZATION",
    country: "Rwanda",
    focus: ["Health", "Education", "Child Right"],
    description: "From a Single Act of Kindness, a Ripple of Hope.",
    profile: "./profiles/careAndHelp.html"
  },

  {
    name: "WHAT IF-RWANDA",
    country: "Rwanda",
    focus: ["Child Right, Education"],
    description: "Be The Source Of Their Smile",
    profile: "./profiles/whatIf.html"
  },

  {
    name: "ASPIRE DEBATE RWANDA",
    country: "Rwanda",
    focus: ["Education"],
    description: "Unleashing The Power Of The Youth Voice",
    profile: "./profiles/aspireDebate.html"
  },

  {
    name: "INFORMED FUTURE GENERATIONS",
    country: "Rwanda",
    focus: ["Awareness", "Youth Empowerment", "Equality"],
    description: "FOSTERING EQUALITY: THE LIKE OF YOUR SISTER’S APPROACH",
    profile: "./profiles/informedFutureGenerations.html"
  },

  {
    name: "OAZIS HEALTH",
    country: "Rwanda",
    description: "Bridging Gaps for Marginalized Communities",
    focus: ["Health", "Awareness"],
    profile: "./profiles/oazisHealth.html"
  },

  {
    name: "HELPING HEART FAMILY RWANDA",
    country: "Rwanda",
    description: "A community where every child's rights are not just acknowledged but equally provided and fiercely respected.",
    focus: ["Family Support", "Community Support", "Education"],
    profile: "./profiles/helpingHeartFamily.html"
  },

  {
    name: "RWANDA WE WANT ORGANIZATION",
    country: "Rwanda",
    description: "Our Community, Our Concern, Our Solution",
    focus: ["Governance", "Youth Leadership"],
    profile: "./profiles/rwandaWeWant.html"
  },

  {
    name: "HEZA INITIATIVE",
    country: "Rwanda",
    description: "Cultivating Health, Harvesting Hope: Heza Initiative Nourishing Rwanda's Future",
    focus: ["Youth Empowerment", "Skills Development"],
    profile: "./profiles/hezaInitiative.html"
  },

  {
    name: "URPHSA",
    country: "Rwanda",
    description: "Better health aspirers, better future achievers",
    focus: ["Public Health", "Advocacy"],
    profile: "./profiles/urphsa.html"
  },

  {
    name: "RISE AND LIVE ORGANIZATION",
    country: "Rwanda",
    description: "A world where teen mothers are not defined by their circumstances but are mentally resilient, knowledgeable, and fully equipped to lead fulfilling lives.",
    focus: ["Wellbeing", "Youth Empowerment"],
    profile: "./profiles/riseAndLive.html"
  },

  {
    name: "NURSING RESEARCH CLUB",
    country: "Rwanda",
    description: "A strong advocate for community wellness",
    focus: ["Health", "Research"],
    profile: "./profiles/nursingResearchClub.html"
  },

  {
    name: "INSHUTI HEALTH ORGANIZATION",
    country: "Rwanda",
    description: "Making tangible strides in transforming lives.",
    focus: ["Health", "Community Health"],
    profile: "./profiles/inshutiHealth.html"
  },

  {
    name: "MINDORA HEALTH",
    country: "Rwanda",
    description: "Mental health and wellbeing support through awareness, guidance, and youth programs.",
    focus: ["Mental Health", "Wellbeing"],
    profile: "./profiles/mindoraHealth.html"
  },

  {
    name: "HOPE FOR TOMORROW",
    country: "Rwanda",
    description: "Empowering Youths, Enriching Lives",
    focus: ["Community Support", "Youth Empowerment"],
    profile: "./profiles/hopeForTomorrow.html"
  },

  {
    name: "INDEPENDENT YOUTH ADVOCATES",
    country: "Rwanda",
    description: "catalyzing economic recovery, social cohesion, and mental health awareness through grassroots action.",
    focus: ["Advocacy", "Youth Leadership"],
    profile: "./profiles/independentYouthAdvocates.html"
  },

  {
    name: "BREAKING SILENCE",
    country: "Rwanda",
    description: "Mental Health Youth Advocate",
    focus: ["Awareness", "Mental Health"],
    profile: "./profiles/breakingSilence.html"
  },

  {
    name: "FROM PERSONAL PAIN TO COMMUNITY HEALING",
    description: "Transforming lived experiences into healing initiatives and support for communities.",
    focus: ["Healing", "Mental Health"],
    profile: "./profiles/fromPersonal.html"
  }
];

const listEl = document.getElementById("membersList");
const searchEl = document.getElementById("memberSearch");
const countEl = document.getElementById("membersCountNote");

function getInitials(name) {
  const cleaned = (name || "").trim().replace(/[^A-Za-z0-9\s]/g, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);

  const a = (parts[0] || "").charAt(0);
  const b = (parts[1] || parts[0] || "").charAt(0);
  return (a + b).toUpperCase();
}

function renderMembers(list) {
  if (!listEl) return;

  if (!list.length) {
    listEl.innerHTML = `<div class="emptyState">No members added yet.</div>`;
    if (countEl) countEl.textContent = `showing 0 of ${members.length} members`
    return;
  }

  listEl.innerHTML = list.map(m => `
    <article class="memberRow">
      <div class="memberLogo" aria-hidden="true">${getInitials(m.name)}</div>
      
      <div class="memberInfo">
        <h3>${m.name}</h3>
        <p>${m.description}</p>
        
        <div class="memberMeta">
          ${m.focus.map(f => `<span class="memberTag">${f}</span>`).join("")}
        </div>
      </div>
      
      <div class="memberAction">
        <a class="btn btn-primary btn-small" href="${m.profile}">
          View Profile
        </a>
      <div>
    </article>
  `).join("");

  if (countEl) countEl.textContent = `Showing ${list.length} of ${members.length} members`;
}

function applySearch() {
  const q = (searchEl?.value || "").toLowerCase().trim();
  if (!q) return renderMembers(members);

  const filtered = members.filter(m => {
    const hay = `${m.name} ${m.description} ${m.focus.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });

  renderMembers(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  renderMembers(members);

  if (searchEl) {
    searchEl.addEventListener("input", applySearch);
  }
});
