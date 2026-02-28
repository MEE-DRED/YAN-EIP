// /assets/JS/adminDashboard.js

const $ = (id) => document.getElementById(id);

const LS_KEYS = {
  AUTH: "yan_auth",
  APPS: "yan_applications",
  COURSES: "yan_courses",
  ASSIGNMENTS: "yan_assignments",
  OPPS: "yan_opportunities",
  EVENTS: "yan_events",
};

const state = {
  view: "applications",
  search: "",
  activeAppId: null, // currently opened application
};

function safeJSONParse(value, fallback) {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
}
function loadList(key) { return safeJSONParse(localStorage.getItem(key), []); }
function saveList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`; }

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString();
}

function escapeHTML(str) {
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function normalizeStatus(s) {
  // support older "Submitted"
  if (!s) return "pending";
  const v = String(s).toLowerCase();
  if (v === "submitted") return "pending";
  return v;
}

function requireAdmin() {
  const auth =
    safeJSONParse(localStorage.getItem(LS_KEYS.AUTH), null) ||
    safeJSONParse(sessionStorage.getItem(LS_KEYS.AUTH), null);

  if (auth?.role && auth.role !== "admin") {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  $("adminRoleChip").textContent = auth?.role ? auth.role.toUpperCase() : "ADMIN";
}

function setYear() {
  $("year").textContent = new Date().getFullYear();
}

/* ===== Sidebar mobile toggle ===== */
function initSidebarToggle() {
  const sidebar = $("adminSidebar");
  const overlay = $("sidebarOverlay");
  const menuBtn = $("menuBtn");

  function open() { sidebar.classList.add("open"); overlay.classList.add("active"); }
  function close() { sidebar.classList.remove("open"); overlay.classList.remove("active"); }

  menuBtn.addEventListener("click", open);
  overlay.addEventListener("click", close);
  document.querySelectorAll(".admin-nav button").forEach(btn => btn.addEventListener("click", close));
}

/* ===== Views ===== */
const VIEW_META = {
  applications: {
    title: "Applications",
    subtitle: "Review, accept, or reject membership applications.",
    primary: "+ New",
    onPrimary: () => { seedDemoApplications(1); renderAll(); },
  },
  courses: { title: "Courses", subtitle: "Manage training modules that members will see.", primary: "+ New Course",
    onPrimary: () => { resetCourseForm(); $("courseTitle").focus(); } },
  assignments: { title: "Assignments", subtitle: "Create assignments linked to courses for members.", primary: "+ New Assignment",
    onPrimary: () => { resetAssignmentForm(); $("assignmentTitle").focus(); } },
  opportunities: { title: "Opportunities", subtitle: "Add funding, training, and partnership opportunities.", primary: "+ New Opportunity",
    onPrimary: () => { resetOppForm(); $("oppTitle").focus(); } },
  events: { title: "Events", subtitle: "Add upcoming events for members and partners.", primary: "+ New Event",
    onPrimary: () => { resetEventForm(); $("eventTitle").focus(); } },
};

function switchView(view) {
  state.view = view;

  document.querySelectorAll(".admin-nav button").forEach(b => {
    b.classList.toggle("active", b.dataset.view === view);
  });

  const map = {
    applications: "view-applications",
    courses: "view-courses",
    assignments: "view-assignments",
    opportunities: "view-opportunities",
    events: "view-events",
  };

  Object.values(map).forEach(id => $(id).style.display = "none");
  $(map[view]).style.display = "block";

  $("pageTitle").textContent = VIEW_META[view].title;
  $("pageSubtitle").textContent = VIEW_META[view].subtitle;
  $("primaryActionBtn").textContent = VIEW_META[view].primary;

  $("globalSearch").value = "";
  state.search = "";

  renderAll();
}

/* ===== Stats ===== */
function updateStats() {
  const apps = loadList(LS_KEYS.APPS).map(a => ({...a, status: normalizeStatus(a.status)}));
  const courses = loadList(LS_KEYS.COURSES);
  const opps = loadList(LS_KEYS.OPPS);

  $("statPending").textContent = apps.filter(a => a.status === "pending").length;
  $("statAccepted").textContent = apps.filter(a => a.status === "accepted").length;
  $("statCourses").textContent = courses.length;
  $("statOpps").textContent = opps.length;
}

/* ===== Applications ===== */
function badge(status) {
  if (status === "accepted") return `<span class="badge b-accepted">Accepted</span>`;
  if (status === "rejected") return `<span class="badge b-rejected">Rejected</span>`;
  return `<span class="badge b-pending">Pending</span>`;
}

function renderApplications() {
  const tbody = $("applicationsTbody");
  const empty = $("applicationsEmpty");

  const filter = $("appStatusFilter").value; // all/pending/accepted/rejected
  let apps = loadList(LS_KEYS.APPS).map(a => ({...a, status: normalizeStatus(a.status)}));

  if (filter !== "all") apps = apps.filter(a => a.status === filter);

  if (state.search) {
    const q = state.search.toLowerCase();
    apps = apps.filter(a =>
      (a.fullName || "").toLowerCase().includes(q) ||
      (a.email || "").toLowerCase().includes(q) ||
      (a.organization || "").toLowerCase().includes(q)
    );
  }

  apps.sort((a,b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  tbody.innerHTML = "";

  if (!apps.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  for (const a of apps) {
    const canAct = a.status === "pending";
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>
          <div style="font-weight:900; color: var(--secondary);">${escapeHTML(a.fullName || "Unknown")}</div>
          <div class="muted">${escapeHTML(a.email || "")}</div>
        </td>
        <td>${badge(a.status)}</td>
        <td>${escapeHTML(a.organization || "-")}</td>
        <td class="muted">${escapeHTML(formatDate(a.createdAt))}</td>
        <td>
          <div class="actions" style="margin:0;">
            <button class="btn-sm btn-soft" data-act="view" data-id="${a.id}">View</button>
            <button class="btn-sm btn-primary-sm" data-act="accept" data-id="${a.id}" ${canAct ? "" : "disabled"}>Accept</button>
            <button class="btn-sm btn-danger-sm" data-act="reject" data-id="${a.id}" ${canAct ? "" : "disabled"}>Reject</button>
          </div>
        </td>
      </tr>
    `);
  }

  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const act = btn.dataset.act;
      if (act === "view") viewApplication(id);
      if (act === "accept") acceptApplication(id);
      if (act === "reject") openRejectModal(id);
    });
  });
}

function acceptApplication(id) {
  const apps = loadList(LS_KEYS.APPS);
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return;

  apps[idx].status = "accepted";
  apps[idx].updatedAt = new Date().toISOString();
  saveList(LS_KEYS.APPS, apps);

  renderAll();
}

function openRejectModal(id) {
  $("rejectAppId").value = id;
  $("rejectMessage").value = "";
  $("rejectModal").classList.add("active");
}
function closeRejectModal() {
  $("rejectModal").classList.remove("active");
}

/* ===== View Modal (fixed IDs) ===== */
function openViewModal() {
  $("viewApplicationModal").classList.add("active");
}
function closeViewModal() {
  $("viewApplicationModal").classList.remove("active");
  state.activeAppId = null;
}

function renderFileLinks(files) {
  if (!files || !Object.keys(files).length) return "<p class='muted'>No files uploaded.</p>";

  let html = "";
  for (const key of Object.keys(files)) {
    const list = files[key] || [];
    if (!list.length) continue;

    html += `<div style="margin:10px 0;"><strong>${escapeHTML(key)}</strong></div>`;

    for (const file of list) {
      const name = escapeHTML(file.name || "file");
      const size = file.size ? ` (${Math.round(file.size / 1024)} KB)` : "";
      // if dataUrl exists we can download/open, else show metadata-only note
      if (file.dataUrl) {
        html += `
          <div style="margin-bottom:6px;">
            📎 <a href="${file.dataUrl}" download="${name}" target="_blank">${name}</a>${escapeHTML(size)}
          </div>
        `;
      } else {
        html += `
          <div class="muted" style="margin-bottom:6px;">
            📄 ${name}${escapeHTML(size)} — (metadata only, will be downloadable after backend upload)
          </div>
        `;
      }
    }
  }
  return html || "<p class='muted'>No files uploaded.</p>";
}

function renderParagraphs(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return `<p class="muted">-</p>`;

  return raw
  .split(/\n\s*\n+/)
  .map(p => `<p>${escapeHTML(p).replace(/\n/g, "<br>")}</p>`)
  .join("");
}

function viewApplication(id) {
  const apps = loadList(LS_KEYS.APPS);
  const app = apps.find(a => a.id === id);
  if (!app) return;

  state.activeAppId = id;

  const data = app.data || {};
  const files = app.files || {};

  const html = `
    <h3 style="margin-top:0;">Organization Information</h3>
    <p><strong>Legal Name:</strong> ${escapeHTML(data.orgLegalName || "")}</p>
    <p><strong>Acronym:</strong> ${escapeHTML(data.orgAcronym || "")}</p>
    <p><strong>Year Established:</strong> ${escapeHTML(data.yearEstablished || "")}</p>
    <p><strong>Type:</strong> ${escapeHTML(data.orgType || "")}</p>
    <p><strong>HQ Address:</strong> ${escapeHTML(data.hqAddress || "")}</p>
    <p><strong>Org Email:</strong> ${escapeHTML(data.orgEmail || "")}</p>
    <p><strong>Org Phone:</strong> ${escapeHTML(data.orgPhone || "")}</p>
    <p><strong>Website:</strong> ${escapeHTML(data.orgWebsite || "")}</p>
    <p><strong>Socials:</strong> ${escapeHTML(data.orgSocials || "")}</p>
    <p><strong>Geo Focus:</strong> ${escapeHTML(data.geoFocus || "")}</p>

    <h3>Mission & Vision</h3>

    <h4 style="margin:10px 0 6px;">Mission</h4>
    <div class="longtext">${renderParagraphs(data.missionStatement)}</div>

    <h4 style="margin:10px 0 6px;">Vision</h4>
    <div class="longtext">${renderParagraphs(data.visionStatement)}</div>
    
    <h4 style="margin:10px 0 6px;">Core Values</h4>
    <div class="longtext">${renderParagraphs(data.coreValues)}</div>
    
    <h4 style="margin:10px 0 6px;">Key Projects</h4>
    <div class="longtext">${renderParagraphs(data.keyProjects)}</div>

    <div>
    <h3>Representative Information</h3>
    <p><strong>Name:</strong> ${escapeHTML(data.repFullName || "")}</p>
    <p><strong>Role:</strong> ${escapeHTML(data.repRole || "")}</p>
    <p><strong>Email:</strong> ${escapeHTML(data.repEmail || "")}</p>
    <p><strong>Phone:</strong> ${escapeHTML(data.repPhone || "")}</p>
    <p><strong>DOB:</strong> ${escapeHTML(data.repDob || "")}</p>
    <p><strong>Gender:</strong> ${escapeHTML(data.repGender || "")}</p>
    </div>

    <h3>Alignment & Engagement</h3>
    <h4 style="margin:10px 0 6px;">Mission Alignment</h4>
    <div class="longtext">${renderParagraphs(data.missionAlignment)}</div>
    
    <h4 style="margin:10px 0 6px;">Ethics</h4>
    <div class="longtext">${renderParagraphs(data.valuesEthics)}</div>
    
    <h4 style="margin:10px 0 6px;">Community Engagement</h4>
    <div class="longtext">${renderParagraphs(data.communityEngagement)}</div>
    
    <h4 style="margin:10px 0 6px;">Skills Contribution</h4>
    <div class="longtext">${renderParagraphs(data.skillsContribution)}</div>

    <h3>Commitment</h3>
    <h4 style="margin:10px 0 6px;">Learn/Grow</h4>
    <div class="longtext">${renderParagraphs(data.learnGrow)}</div>
    
    <h4 style="margin:10px 0 6px;">Participation Plan</h4>
    <div class="longtext">${renderParagraphs(data.participationPlan)}</div>
    
    <h4 style="margin:10px 0 6px;">Key Projects</h4>
    <div class="longtext">${renderParagraphs(data.keyProjects)}</div>
    <p><strong>Confirmed Participation:</strong> ${data.confirmParticipation ? "Yes" : "No"}</p>
    <p><strong>Declaration:</strong> ${data.declaration ? "Yes" : "No"}</p>

    <h3>Uploaded Documents</h3>
    ${renderFileLinks(files)}

    ${app.note ? `<p class="muted" style="margin-top:12px;">${escapeHTML(app.note)}</p>` : ""}
  `;

  $("applicationDetailsBody").innerHTML = html;
  openViewModal();
}

function rejectApplicationWithEmail(id, message) {
  const apps = loadList(LS_KEYS.APPS);
  const idx = apps.findIndex(a => a.id === id);
  if (idx === -1) return;

  apps[idx].status = "rejected";
  apps[idx].updatedAt = new Date().toISOString();
  apps[idx].rejectionMessage = message || "";
  saveList(LS_KEYS.APPS, apps);

  const email = apps[idx].email || "";
  const name = apps[idx].fullName || "Applicant";

  const subject = "YAN Membership Application Update";
  const body =
`Hello ${name},

Thank you for applying to join Youth Advocates Network (YAN) Rwanda.

Unfortunately, your application was not successful at this time.

Reason:
${message || "(No reason provided)"}

If you would like to re-apply or need clarification, you can reply to this email.

Kind regards,
YAN Admin Team`;

  if (email) {
    const gmailUrl =
      "https://mail.google.com/mail/?view=cm&fs=1" +
      `&to=${encodeURIComponent(email)}` +
      `&su=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
  }

  renderAll();
}

/* ===== The rest of your Courses/Assignments/Opportunities/Events code can stay as-is ===== */
/* (no changes needed below unless you want improvements) */

/* ===== Seed Demo ===== */
function seedDemoApplications(n = 2) {
  const apps = loadList(LS_KEYS.APPS);

  for (let i = 0; i < n; i++) {
    apps.push({
      id: uid("app"),
      fullName: i === 0 ? "Aline Mukamana" : "Jean Uwimana",
      email: i === 0 ? "aline@example.com" : "jean@example.com",
      organization: i === 0 ? "Youth Voices Rwanda" : "Green Future Initiative",
      status: "pending",
      createdAt: new Date(Date.now() - (i+1) * 86400000).toISOString(),
      data: {},
      files: {}
    });
  }

  saveList(LS_KEYS.APPS, apps);
}

function renderAll() {
  updateStats();
  if (state.view === "applications") renderApplications();
  if (state.view === "courses") renderCourses();
  if (state.view === "assignments") renderAssignments();
  if (state.view === "opportunities") renderOpps();
  if (state.view === "events") renderEvents();
}

/* ===== Init ===== */
function init() {
  requireAdmin();
  setYear();
  initSidebarToggle();

  document.querySelectorAll(".admin-nav button").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  $("primaryActionBtn").addEventListener("click", () => VIEW_META[state.view].onPrimary());

  $("globalSearch").addEventListener("input", (e) => {
    state.search = e.target.value.trim();
    renderAll();
  });

  $("appStatusFilter").addEventListener("change", renderApplications);

  $("clearRejectedBtn").addEventListener("click", () => {
    saveList(LS_KEYS.APPS, loadList(LS_KEYS.APPS).filter(a => normalizeStatus(a.status) !== "rejected"));
    renderAll();
  });

  $("rejectCloseBtn").addEventListener("click", closeRejectModal);
  $("cancelRejectBtn").addEventListener("click", closeRejectModal);
  $("confirmRejectBtn").addEventListener("click", () => {
    const id = $("rejectAppId").value;
    const msg = $("rejectMessage").value.trim();
    closeRejectModal();
    rejectApplicationWithEmail(id, msg);
  });

  // $("seedBtn").addEventListener("click", seedDemoCore);

  $("goHomeBtn").addEventListener("click", () => window.location.href = "/index.html");

  $("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem(LS_KEYS.AUTH);
    sessionStorage.removeItem(LS_KEYS.AUTH);
    window.location.href = "/pages/auth/login.html";
  });

  // View modal close
  $("viewCloseBtn").addEventListener("click", closeViewModal);

  // Modal accept/reject actions
  $("modalAcceptBtn").addEventListener("click", () => {
    if (!state.activeAppId) return;
    acceptApplication(state.activeAppId);
    closeViewModal();
  });

  $("modalRejectBtn").addEventListener("click", () => {
    if (!state.activeAppId) return;
    closeViewModal();
    openRejectModal(state.activeAppId);
  });

  switchView("applications");
  renderAll();
}

document.addEventListener("DOMContentLoaded", init);