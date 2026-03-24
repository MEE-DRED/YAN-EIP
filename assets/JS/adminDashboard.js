// /assets/JS/adminDashboard.js

const $ = (id) => document.getElementById(id);

const LS_KEYS = {
  AUTH: "yan_auth",
  APPS: "yan_applications",
  COURSES: "yan_courses",
  ASSIGNMENTS: "yan_assignments",
  MEMBER_SUBMISSIONS: "yan_member_submissions",
  OPPS: "yan_opportunities",
  EVENTS: "yan_events",
  LANDING_OPPS: "yanOpportunitiesData",
  LANDING_EVENTS: "yanEventsData",
};

const state = {
  view: "applications",
  search: "",
  activeAppId: null, // currently opened application
  activeSessionGuideQuarter: null,
};

const SESSION_GUIDE_FILES = {
  Q1: [
    { course: "Leadership", label: "Leadership Youth Session Guide", href:"/capacity_building-q1/Leadership/Leadership Youth Session guide ( Final).pdf" },
    { course: "Resilience", label: "Resilience Session Guide", href: "/capacity_building-q1/Resilience/Resilience Session Guide.pdf" },
    { course: "Soft Skills", label: "Soft Skills Session Guide", href: "/capacity_building-q1/Softskills/Session guide 3 (1).pdf" },
  ],
  Q2: [
    { course: "Monitoring & Evaluation", label: "Monitoring & Evaluation Session Guide", href:"/capacity.assets-q2/Monitoring&Evaluation/Monitoring_&_Evaluation_and_Adaptive_Programming_Session_Guide.pdf" },
    { course: "Project Designing & Management Training", label: "Project Designing & Management Training Session Guide", href:"/capacity.assets-q2/Project_designing_&_Management_training/Project_Design_and_Management_Facilitator_Session_Guide.pdf" },
  ],
  Q3: [
    { course: "Sustainability Training", label:"Sustainability Training Session Guide", href:"/capacity.assets-q3/Sustainability_Training/sustainability_session_guide.pdf" },
    { course: "Partnership and Networking", label:"Partnership and Networking Session Guide", href:"/capacity.assets-q3/Partnenrship_&_Networking/Partnership_and_Networking_session_guide.pdf" },
    { course: "Grant Fundraising", label:"Grant fundraising Session Guide", href:"/capacity.assets-q3/Grant_fundraising/Grant_fundraising_training_session_guide.pdf" },
    { course: "Financial Management", label:"Financial Management Session Guide", href:"/capacity.assets-q3/Financial_management/Financial_management_session_guide.pdf" },
  ],
  Q4: [
    { course: "Digital Advocacy", label: "Digital Advocacy Session Guides", href:"/capacity.assets-q4/Digital_Advocacy/FUD_&_DAC_Session_Guide.pdf" },
    { course: "Inclusive", label: "Inclusive Session Guide", href:"/capacity.assets-q4/Inclusive/Inclusive_SESSION_GUIDE.pdf" },
  ],
};

function safeJSONParse(value, fallback) {
  try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
}
function loadList(key) { return safeJSONParse(localStorage.getItem(key), []); }
function saveList(key, list) { localStorage.setItem(key, JSON.stringify(list)); }

function saveSharedList(adminKey, landingKey, adminList, landingList) {
  localStorage.setItem(adminKey, JSON.stringify(adminList));
  localStorage.setItem(landingKey, JSON.stringify(landingList));
}

function mapOppsToLanding(opps) {
  return opps.map((opp, index) => ({
    id: index + 1,
    type: opp.type || "funding",
    title: opp.title,
    description: opp.description,
    deadline: "Rolling basis",
    provider: "YAN Rwanda"
  }));
}

function mapEventsToLanding(events) {
  const fallbackDate = new Date().toISOString().split("T")[0];
  return events.map((event, index) => ({
    id: index + 1,
    title: event.title,
    description: event.description,
    date: event.date || fallbackDate,
    time: "TBD",
    location: event.location,
    type: "Event"
  }));
}

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
  "session-guides": { title: "Session Guides", subtitle: "Open Quarter Session Guides and Review Resources.", primary: "All Quarters",
    onPrimary: () => {showSessionGuideQuarters(); } },
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
    "session-guides": "view-session-guides",
    assignments: "view-assignments",
    opportunities: "view-opportunities",
    events: "view-events",
  };

  Object.values(map).forEach(id => $(id).style.display = "none");
  $(map[view]).style.display = "block";

  $("pageTitle").textContent = VIEW_META[view].title;
  const pageSubtitle = $("pageSubtitle");
  if (pageSubtitle) {
    pageSubtitle.textContent = VIEW_META[view].subtitle;
  }
  $("primaryActionBtn").textContent = VIEW_META[view].primary;

  $("globalSearch").value = "";
  state.search = "";

  renderAll();
}

function showSessionGuideQuarters() {
  state.activeSessionGuideQuarter = null;
  $("sessionGuidesQuarterGrid").style.display = "grid";
  $("sessionGuidesListView").style.display = "none";
}

function renderSessionGuidesList(quarter) {
  const listEl = $("sessionGuidesList");
  const emptyEl = $("sessionGuidesEmpty");
  const titleEl = $("sessionGuidesQuarterTitle");
  const quarterGrid = $("sessionGuidesQuarterGrid");
  const listView = $("sessionGuidesListView");

  state.activeSessionGuideQuarter = quarter;
  titleEl.textContent = `${quarter} Session Guides`;
  quarterGrid.style.display = "none";
  listView.style.display = "grid";

  let guides = SESSION_GUIDE_FILES[quarter] || [];
  if (state.search) {
    const q = state.search.toLowerCase();
    guides = guides.filter((guide) =>
      (guide.course || "").toLowerCase().includes(q) ||
      (guide.label || "").toLowerCase().includes(q)
    );
  }

  listEl.innerHTML = "";
  if (!guides.length) {
    emptyEl.style.display = "block";
    return;
  }

  emptyEl.style.display = "none";
  guides.forEach((guide) => {
    listEl.insertAdjacentHTML("beforeend", `
      <li>
        <span class="session-guides-course-name">${escapeHTML(guide.course)}</span>
        <a class="session-guides-file-link" href="${encodeURI(guide.href)}" target="_blank" rel="noopener noreferrer">
          Open guide
        </a>
      </li>
    `);
  });
}

function renderSessionGuides() {
  if (!state.activeSessionGuideQuarter) {
    showSessionGuideQuarters();
    return;
  }
  renderSessionGuidesList(state.activeSessionGuideQuarter);
}

/* ===== Courses (safe placeholders) ===== */
function renderCourses() {
  const tbody = $("coursesTbody");
  const empty = $("coursesEmpty");
  if (!tbody || !empty) return;

  const courses = loadList(LS_KEYS.COURSES);
  tbody.innerHTML = "";
  empty.style.display = courses.length ? "none" : "block";

  courses.forEach((course) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${escapeHTML(course.title || "-")}</td>
        <td>${escapeHTML(course.quarter || "-")}</td>
        <td><span class="muted">Managed in saved data</span></td>
      </tr>
    `);
  });
}

function resetCourseForm() {
  if ($("courseId")) $("courseId").value = "";
  if ($("courseTitle")) $("courseTitle").value = "";
  if ($("courseQuarter")) $("courseQuarter").value = "Q1";
  if ($("courseDesc")) $("courseDesc").value = "";
}

/* ===== Assignments (safe placeholders) ===== */
function renderAssignments() {
  const tbody = $("assignmentsTbody");
  const empty = $("assignmentsEmpty");
  if (!tbody || !empty) return;

  const assignments = loadList(LS_KEYS.ASSIGNMENTS);
  tbody.innerHTML = "";
  empty.style.display = assignments.length ? "none" : "block";

  assignments.forEach((assignment) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${escapeHTML(assignment.title || "-")}</td>
        <td>${escapeHTML(assignment.courseTitle || "-")}</td>
        <td>${escapeHTML(formatDate(assignment.dueDate || ""))}</td>
        <td><span class="muted">Managed in saved data</span></td>
      </tr>
    `);
  });
}

function resetAssignmentForm() {
  if ($("assignmentId")) $("assignmentId").value = "";
  if ($("assignmentCourse")) $("assignmentCourse").value = "";
  if ($("assignmentTitle")) $("assignmentTitle").value = "";
  if ($("assignmentDue")) $("assignmentDue").value = "";
  if ($("assignmentDesc")) $("assignmentDesc").value = "";
}

/* ===== Opportunities ===== */
function resetOppForm() {
  $("oppId").value = "";
  $("oppType").value = "funding";
  $("oppTitle").value = "";
  $("oppLink").value = "";
  $("oppDesc").value = "";
}

function renderOpps() {
  const tbody = $("oppsTbody");
  const empty = $("oppsEmpty");
  let opps = loadList(LS_KEYS.OPPS);

  if (state.search) {
    const q = state.search.toLowerCase();
    opps = opps.filter((opp) =>
      (opp.title || "").toLowerCase().includes(q) ||
      (opp.type || "").toLowerCase().includes(q) ||
      (opp.description || "").toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";
  if (!opps.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  opps.forEach((opp) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>
          <div style="font-weight: 900; color: var(--secondary);">${escapeHTML(opp.title)}</div>
          <div class="muted">${escapeHTML(opp.description || "")}</div>
        </td>
        <td>${escapeHTML(opp.type || "-")}</td>
        <td>
          <div class="actions" style="margin: 0;">
            <button class="btn-sm btn-soft" data-edit-opp="${opp.id}">Edit</button>
            <button class="btn-sm btn-danger-sm" data-del-opp="${opp.id}">Delete</button>
          </div>
        </td>
      </tr>
    `);
  });

  tbody.querySelectorAll("button[data-edit-opp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const opp = loadList(LS_KEYS.OPPS).find((item) => item.id === btn.dataset.editOpp);
      if (!opp) return;
      $("oppId").value = opp.id;
      $("oppType").value = opp.type || "funding";
      $("oppTitle").value = opp.title || "";
      $("oppLink").value = opp.link || "";
      $("oppDesc").value = opp.description || "";
      $("oppTitle").focus();
    });
  });

  tbody.querySelectorAll("button[data-del-opp]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const oppsList = loadList(LS_KEYS.OPPS).filter((item) => item.id !== btn.dataset.delOpp);
      saveSharedList(LS_KEYS.OPPS, LS_KEYS.LANDING_OPPS, oppsList, mapOppsToLanding(oppsList));
      renderAll();
    });
  });
}

function saveOpportunity() {
  const id = $("oppId").value || uid("opp");
  const title = $("oppTitle").value.trim();
  const type = $("oppType").value;
  const link = $("oppLink").value.trim();
  const description = $("oppDesc").value.trim();

  if (!title || !description) {
    alert("Please provide opportunity title and description.");
    return;
  }

  const opps = loadList(LS_KEYS.OPPS);
  const payload = { id, title, type, link, description, updatedAt: new Date().toISOString() };
  const idx = opps.findIndex((opp) => opp.id === id);

  if (idx === -1) {
    opps.unshift({ ...payload, createdAt: new Date().toISOString() });
  } else {
    opps[idx] = { ...opps[idx], ...payload };
  }

  // Keep landing page contract in sync
  saveSharedList(LS_KEYS.OPPS, LS_KEYS.LANDING_OPPS, opps, mapOppsToLanding(opps));
  resetOppForm();
  renderAll();
}

/* ===== Events ===== */
function resetEventForm() {
  $("eventId").value = "";
  $("eventTitle").value = "";
  $("eventDate").value = "";
  $("eventLocation").value = "";
  $("eventDesc").value = "";
}

function renderEvents() {
  const tbody = $("eventsTbody");
  const empty = $("eventsEmpty");
  let events = loadList(LS_KEYS.EVENTS);

  if (state.search) {
    const q = state.search.toLowerCase();
    events = events.filter((event) =>
      (event.title || "").toLowerCase().includes(q) ||
      (event.location || "").toLowerCase().includes(q) ||
      (event.description || "").toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";
  if (!events.length) {
    empty.style.display = "block";
    return;
  }

  empty.style.display = "none";
  events.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  events.forEach((event) => {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>
          <div style="font-weight: 900; color: var(--secondary);">${escapeHTML(event.title)}</div>
          <div class="muted">${escapeHTML(event.location || "")}</div>
        </td>
        <td>${escapeHTML(formatDate(event.date || ""))}</td>
        <td>
          <div class="actions" style="margin: 0;">
            <button class="btn-sm btn-soft" data-edit-event="${event.id}">Edit</button>
            <button class="btn-sm btn-danger-sm" data-del-event="${event.id}">Delete</button>
          </div>
        </td>
      </tr>
    `);
  });

  tbody.querySelectorAll("button[data-edit-event]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const event = loadList(LS_KEYS.EVENTS).find((item) => item.id === btn.dataset.editEvent);
      if (!event) return;
      $("eventId").value = event.id;
      $("eventTitle").value = event.title || "";
      $("eventDate").value = event.date || "";
      $("eventLocation").value = event.location || "";
      $("eventDesc").value = event.description || "";
      $("eventTitle").focus();
    });
  });

  tbody.querySelectorAll("button[data-del-event]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const eventsList = loadList(LS_KEYS.EVENTS).filter((item) => item.id !== btn.dataset.delEvent);
      saveSharedList(LS_KEYS.EVENTS, LS_KEYS.LANDING_EVENTS, eventsList, mapEventsToLanding(eventsList));
      renderAll();
    });
  });
}

function saveEvent() {
  const id = $("eventId").value || uid("event");
  const title = $("eventTitle").value.trim();
  const date = $("eventDate").value;
  const location = $("eventLocation").value.trim();
  const description = $("eventDesc").value.trim();

  if (!title || !date || !location || !description) {
    alert("Please complete all required fields.");
    return;
  }

  const list = loadList(LS_KEYS.EVENTS);
  const idx = list.findIndex(e => e.id === id);

  const item = {
    id,
    title,
    date,
    location,
    description,
    updatedAt: new Date().toISOString()
  };

  if (idx >= 0) {
    list[idx] = {...list[idx], ...item };
  } else {
    list.unshift({...item, createdAt: new Date().toISOString() });
  }

  list.sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  saveSharedList(
    LS_KEYS.EVENTS,
    LS_KEYS.LANDING_EVENTS,
    list,
    mapEventsToLanding(list)
  );

  resetEventForm();
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

/* ===== Courses ===== */
function resetCourseForm() {
  $("courseId").value = "";
  $("courseTitle").value = "";
  $("courseQuarter").value = "Q1";
  $("courseDesc").value = "";
}

function saveCourse() {
  const id = $("courseId").value || uid("course");
  const title = $("courseTitle").value.trim();
  const quarter = $("courseQuarter").value;
  const description = $("courseDesc").value.trim();
  if (!title) return;

  const courses = loadList(LS_KEYS.COURSES);
  const idx = courses.findIndex(c => c.id === id);
  const item = { id, title, quarter, description, updatedAt: new Date().toISOString() };
  if (idx >= 0) courses[idx] = { ...courses[idx], ...item };
  else courses.unshift({ ...item, createdAt: new Date().toISOString() });

  saveList(LS_KEYS.COURSES, courses);
  resetCourseForm();
  renderAll();
}

function renderCourses() {
  const tbody = $("coursesTbody");
  const empty = $("coursesEmpty");
  let courses = loadList(LS_KEYS.COURSES);

  if (state.search) {
    const q = state.search.toLowerCase();
    courses = courses.filter(c =>
      (c.title || "").toLowerCase().includes(q) ||
      (c.quarter || "").toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";
  if (!courses.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  for (const c of courses) {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${escapeHTML(c.title)}</td>
        <td>${escapeHTML(c.quarter || "-")}</td>
        <td>
          <div class="actions" style="margin:0;">
            <button class="btn-sm btn-soft" data-act="edit-course" data-id="${c.id}">Edit</button>
            <button class="btn-sm btn-danger-sm" data-act="del-course" data-id="${c.id}">Delete</button>
          </div>
        </td>
      </tr>
    `);
  }

  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const coursesList = loadList(LS_KEYS.COURSES);
      const id = btn.dataset.id;
      if (btn.dataset.act === "edit-course") {
        const c = coursesList.find(x => x.id === id);
        if (!c) return;
        $("courseId").value = c.id;
        $("courseTitle").value = c.title || "";
        $("courseQuarter").value = c.quarter || "Q1";
        $("courseDesc").value = c.description || "";
      } else {
        saveList(LS_KEYS.COURSES, coursesList.filter(x => x.id !== id));
        renderAll();
      }
    });
  });
}

/* ===== Assignments ===== */
function resetAssignmentForm() {
  $("assignmentId").value = "";
  $("assignmentCourse").value = "";
  $("assignmentTitle").value = "";
  $("assignmentDue").value = "";
  $("assignmentDesc").value = "";
}

function populateAssignmentCourses() {
  const select = $("assignmentCourse");
  const courses = loadList(LS_KEYS.COURSES);
  const current = select.value;
  select.innerHTML = '<option value="">Select a course</option>';
  courses.forEach(c => {
    select.insertAdjacentHTML("beforeend", `<option value="${c.id}">${escapeHTML(c.title)}</option>`);
  });
  if (current && courses.some(c => c.id === current)) select.value = current;
}


function gradeSubmission(submissionId) {
  const gradeInput = $("grade-" + submissionId);
  const feedbackInput = $("feedback-" + submissionId);
  if (!gradeInput || !feedbackInput) return;

  const grade = gradeInput.value.trim();
  const feedback = feedbackInput.value.trim();
  if (!grade && !feedback) {
    alert("Add a grade or feedback before saving.");
    return;
  }

  const submissions = loadList(LS_KEYS.MEMBER_SUBMISSIONS);
  const idx = submissions.findIndex((submission) => submission.id === submissionId);
  if (idx === -1) return;

  submissions[idx] = {
    ...submissions[idx],
    grade,
    feedback,
    gradedAt: new Date().toISOString(),
    gradedBy: "Admin",
  };

  saveList(LS_KEYS.MEMBER_SUBMISSIONS, submissions);
  renderAssignments();
}

function saveAssignment() {
  const id = $("assignmentId").value || uid("assignment");
  const courseId = $("assignmentCourse").value;
  const title = $("assignmentTitle").value.trim();
  const dueDate = $("assignmentDue").value;
  const description = $("assignmentDesc").value.trim();
  if (!courseId || !title) return;

  const assignments = loadList(LS_KEYS.ASSIGNMENTS);
  const idx = assignments.findIndex(a => a.id === id);
  const item = { id, courseId, title, dueDate, description, updatedAt: new Date().toISOString() };
  if (idx >= 0) assignments[idx] = { ...assignments[idx], ...item };
  else assignments.unshift({ ...item, createdAt: new Date().toISOString() });

  saveList(LS_KEYS.ASSIGNMENTS, assignments);
  resetAssignmentForm();
  renderAll();
}

function renderAssignments() {
  populateAssignmentCourses();
  const tbody = $("assignmentsTbody");
  const empty = $("assignmentsEmpty");
  const submissionsTbody = $("memberSubmissionsTbody");
  const submissionsEmpty = $("memberSubmissionsEmpty");
  const courseMap = Object.fromEntries(loadList(LS_KEYS.COURSES).map(c => [c.id, c.title]));
  let assignments = loadList(LS_KEYS.ASSIGNMENTS);
  let submissions = loadList(LS_KEYS.MEMBER_SUBMISSIONS);

  if (state.search) {
    const q = state.search.toLowerCase();
    assignments = assignments.filter(a =>
      (a.title || "").toLowerCase().includes(q) ||
      (courseMap[a.courseId] || "").toLowerCase().includes(q)
    );
    submissions = submissions.filter((submission) =>
      (submission.memberName || "").toLowerCase().includes(q) ||
      (submission.memberEmail || "").toLowerCase().includes(q) ||
      (submission.memberOrg || "").toLowerCase().includes(q) ||
      (submission.moduleTitle || "").toLowerCase().includes(q) ||
      (submission.quarter || "").toLowerCase().includes(q) ||
      (submission.fileName || "").toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";
  if (!assignments.length) {
    empty.style.display = "block";
  } else {
    empty.style.display = "none";

    for (const a of assignments) {
      tbody.insertAdjacentHTML("beforeend", `
        <tr>
          <td>${escapeHTML(a.title)}</td>
          <td>${escapeHTML(courseMap[a.courseId] || "Unknown course")}</td>
          <td>${escapeHTML(formatDate(a.dueDate))}</td>
          <td>
            <div class="actions" style="margin:0;">
              <button class="btn-sm btn-soft" data-act="edit-assignment" data-id="${a.id}">Edit</button>
              <button class="btn-sm btn-danger-sm" data-act="del-assignment" data-id="${a.id}">Delete</button>
            </div>
          </td>
        </tr>
      `);
    }
  }

  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const list = loadList(LS_KEYS.ASSIGNMENTS);
      const id = btn.dataset.id;
      if (btn.dataset.act === "edit-assignment") {
        const a = list.find(x => x.id === id);
        if (!a) return;
        $("assignmentId").value = a.id;
        $("assignmentCourse").value = a.courseId || "";
        $("assignmentTitle").value = a.title || "";
        $("assignmentDue").value = a.dueDate || "";
        $("assignmentDesc").value = a.description || "";
      } else {
        saveList(LS_KEYS.ASSIGNMENTS, list.filter(x => x.id !== id));
        renderAll();
      }
    });
  });

  if (!submissionsTbody || !submissionsEmpty) return;

  submissions.sort((a, b) => String(b.submittedAt || b.createdAt || "").localeCompare(String(a.submittedAt || a.createdAt || "")));
  submissionsTbody.innerHTML = "";

  if (!submissions.length) {
    submissionsEmpty.style.display = "block";
    return;
  }

  submissionsEmpty.style.display = "none";
  submissions.forEach((submission) => {
    submissionsTbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>
          <div style="font-weight: 900; color: var(--secondary);">${escapeHTML(submission.memberName || "Member")}</div>
          <div class="muted">${escapeHTML(submission.memberEmail || "")}</div>
        </td>
        <td>${escapeHTML(submission.memberOrg || "-")}</td>
        <td>${escapeHTML(submission.quarter || "-")}</td>
        <td>${escapeHTML(submission.moduleTitle || courseMap[submission.moduleId] || "-")}</td>
        <td>
          <div class="submission-file-cell">
            <span>${escapeHTML(submission.fileName || "-")}</span>
            ${submission.fileDataUrl ? `<div class="submission-file-actions">
              <a class="btn-sm btn-soft" href="${escapeHTML(submission.fileDataUrl)}" target="_blank" rel="noopener">View</a>
              <a class="btn-sm" href="${escapeHTML(submission.fileDataUrl)}" download="${escapeHTML(submission.fileName || "submission")}">Download</a>
            </div>` : `<span class="muted small">Legacy submission</span>`}
          </div>
        </td>
        <td>${escapeHTML(formatDate(submission.submittedAt || submission.createdAt || ""))}</td>
        <td>
          <input
            id="grade-${escapeHTML(submission.id || "")}" 
            class="grading-input"
            type="text"
            placeholder="e.g. 85%, A"
            value="${escapeHTML(submission.grade || "")}"
          >
        </td>
        <td>
          <textarea
            id="feedback-${escapeHTML(submission.id || "")}"
            class="grading-textarea"
            placeholder="Add feedback for this member..."
          >${escapeHTML(submission.feedback || "")}</textarea>
        </td>
        <td>
          <button class="btn-sm btn-primary-sm" data-grade-submission="${escapeHTML(submission.id || "")}">Save Grade</button>
        </td>
      </tr>
    `);
  });

  submissionsTbody.querySelectorAll("button[data-grade-submission]").forEach((btn) => {
    btn.addEventListener("click", () => gradeSubmission(btn.dataset.gradeSubmission));
  });
}

/* ===== Opportunities ===== */
function resetOppForm() {
  $("oppId").value = "";
  $("oppType").value = "funding";
  $("oppTitle").value = "";
  $("oppLink").value = "";
  $("oppDesc").value = "";
}

function saveOpp() {
  const id = $("oppId").value || uid("opp");
  const type = $("oppType").value;
  const title = $("oppTitle").value.trim();
  const link = $("oppLink").value.trim();
  const description = $("oppDesc").value.trim();
  if (!title) return;

  const list = loadList(LS_KEYS.OPPS);
  const idx = list.findIndex(o => o.id === id);
  const item = { id, type, title, link, description, updatedAt: new Date().toISOString() };
  if (idx >= 0) list[idx] = { ...list[idx], ...item };
  else list.unshift({ ...item, createdAt: new Date().toISOString() });

  saveList(LS_KEYS.OPPS, list);
  resetOppForm();
  renderAll();
}

function renderOpps() {
  const tbody = $("oppsTbody");
  const empty = $("oppsEmpty");
  let opps = loadList(LS_KEYS.OPPS);

  if (state.search) {
    const q = state.search.toLowerCase();
    opps = opps.filter(o =>
      (o.title || "").toLowerCase().includes(q) ||
      (o.type || "").toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";
  if (!opps.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  for (const o of opps) {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${escapeHTML(o.title)}</td>
        <td>${escapeHTML(o.type)}</td>
        <td>
          <div class="actions" style="margin:0;">
            <button class="btn-sm btn-soft" data-act="edit-opp" data-id="${o.id}">Edit</button>
            <button class="btn-sm btn-danger-sm" data-act="del-opp" data-id="${o.id}">Delete</button>
          </div>
        </td>
      </tr>
    `);
  }

  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const list = loadList(LS_KEYS.OPPS);
      const id = btn.dataset.id;
      if (btn.dataset.act === "edit-opp") {
        const o = list.find(x => x.id === id);
        if (!o) return;
        $("oppId").value = o.id;
        $("oppType").value = o.type || "funding";
        $("oppTitle").value = o.title || "";
        $("oppLink").value = o.link || "";
        $("oppDesc").value = o.description || "";
      } else {
        saveList(LS_KEYS.OPPS, list.filter(x => x.id !== id));
        renderAll();
      }
    });
  });
}

/* ===== Events ===== */
function resetEventForm() {
  $("eventId").value = "";
  $("eventTitle").value = "";
  $("eventDate").value = "";
  $("eventLocation").value = "";
  $("eventDesc").value = "";
}

// function saveEvent() {
//   const id = $("eventId").value || uid("event");
//   const title = $("eventTitle").value.trim();
//   const date = $("eventDate").value;
//   const location = $("eventLocation").value.trim();
//   const description = $("eventDesc").value.trim();
//   if (!title) return;

//   const list = loadList(LS_KEYS.EVENTS);
//   const idx = list.findIndex(e => e.id === id);
//   const item = { id, title, date, location, description, updatedAt: new Date().toISOString() };
//   if (idx >= 0) list[idx] = { ...list[idx], ...item };
//   else list.unshift({ ...item, createdAt: new Date().toISOString() });

//   saveList(LS_KEYS.EVENTS, list);
//   resetEventForm();
//   renderAll();
// }

function renderEvents() {
  const tbody = $("eventsTbody");
  const empty = $("eventsEmpty");
  let events = loadList(LS_KEYS.EVENTS);

  if (state.search) {
    const q = state.search.toLowerCase();
    events = events.filter(e =>
      (e.title || "").toLowerCase().includes(q) ||
      (e.location || "").toLowerCase().includes(q)
    );
  }

  tbody.innerHTML = "";
  if (!events.length) {
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";

  for (const e of events) {
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${escapeHTML(e.title)}</td>
        <td>${escapeHTML(formatDate(e.date))}</td>
        <td>
          <div class="actions" style="margin:0;">
            <button class="btn-sm btn-soft" data-act="edit-event" data-id="${e.id}">Edit</button>
            <button class="btn-sm btn-danger-sm" data-act="del-event" data-id="${e.id}">Delete</button>
          </div>
        </td>
      </tr>
    `);
  }

  tbody.querySelectorAll("button[data-act]").forEach(btn => {
    btn.addEventListener("click", () => {
      const list = loadList(LS_KEYS.EVENTS);
      const id = btn.dataset.id;
      if (btn.dataset.act === "edit-event") {
        const e = list.find(x => x.id === id);
        if (!e) return;
        $("eventId").value = e.id;
        $("eventTitle").value = e.title || "";
        $("eventDate").value = e.date || "";
        $("eventLocation").value = e.location || "";
        $("eventDesc").value = e.description || "";
      } else {
        saveList(LS_KEYS.EVENTS, list.filter(x => x.id !== id));
        renderAll();
      }
    });
  });
}

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
  if (state.view === "session-guides") renderSessionGuides();
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

  // Opportunities
  $("saveOppBtn").addEventListener("click", saveOpportunity);
  $("resetOppBtn").addEventListener("click", resetOppForm);

  // Events
  $("saveEventBtn").addEventListener("click", saveEvent);
  $("resetEventBtn").addEventListener("click", resetEventForm);

  $("rejectCloseBtn").addEventListener("click", closeRejectModal);
  $("cancelRejectBtn").addEventListener("click", closeRejectModal);
  $("confirmRejectBtn").addEventListener("click", () => {
    const id = $("rejectAppId").value;
    const msg = $("rejectMessage").value.trim();
    closeRejectModal();
    rejectApplicationWithEmail(id, msg);
  });

  $("saveCourseBtn").addEventListener("click", saveCourse);
  $("resetCourseBtn").addEventListener("click", resetCourseForm);

  $("saveAssignmentBtn").addEventListener("click", saveAssignment);
  $("resetAssignmentBtn").addEventListener("click", resetAssignmentForm);

  document.querySelectorAll(".session-quarter-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const quarter = link.dataset.quarter;
      if (!quarter) return;
      renderSessionGuidesList(quarter);
    });
  });

  $("sessionGuideBackBtn").addEventListener("click", showSessionGuideQuarters);

  $("seedBtn").addEventListener("click", () => { seedDemoApplications(2); renderAll(); });

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