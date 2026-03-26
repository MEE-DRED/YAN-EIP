/* ===================================================
   member-dashboard.js
   - Frontend-only interactivity (localStorage demo)
   - Quarter locking by date (Q1 Jan1, Q2 Apr1, Q3 Jul1, Q4 Oct1)
   - Must complete previous quarter before opening next
   - Module viewer modal (PDF iframe)
   - Mark module complete updates progress
   - Profile edit modal (updates UI + localStorage)
   - Assignment upload UI (stores metadata only)
   =================================================== */

(function () {
  // --------Auth--------
  function getAuthSession(){
    const localAuth = localStorage.getItem("yan_auth");
    const sessionAuth = sessionStorage.getItem("yan_auth");
    const raw = localAuth || sessionAuth;

    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  const auth = getAuthSession();

  if(!auth || !auth.token || !auth.user) {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  if(auth.role !== "member") {
    window.location.href = "/pages/auth/login.html";
    return;
  }

  // --------- Helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function formatDate(d) {
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  function quarterStartDate(year, q) {
    // Q1 Jan 1, Q2 Apr 1, Q3 Jul 1, Q4 Oct 1
    const map = { Q1: 0, Q2: 3, Q3: 6, Q4: 9 };
    return new Date(year, map[q], 1, 0, 0, 0, 0);
  }

  function quarterRange(year, q) {
    const starts = { Q1: new Date(year, 0, 1), Q2: new Date(year, 3, 1), Q3: new Date(year, 6, 1), Q4: new Date(year, 9, 1) };
    const ends = { Q1: new Date(year, 2, 31), Q2: new Date(year, 5, 30), Q3: new Date(year, 8, 30), Q4: new Date(year, 11, 31) };
    return { start: starts[q], end: ends[q] };
  }

  function initials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "YA";
    const a = parts[0][0] || "";
    const b = parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] || "");
    return (a + b).toUpperCase();
  }

  function safeText(s) {
    return String(s ?? "").replace(/[<>]/g, "");
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Failed to read file."));
      reader.readAsDataURL(file);
    });
  }

  // --------- Data ----------
  const YEAR = new Date().getFullYear();

  let MODULES = { Q1: [], Q2: [], Q3: [], Q4: [] };

  function buildModulesFromHTML() {
    const modules = { Q1: [], Q2: [], Q3: [], Q4: [] };

    $$("#moduleCatalog .mdModuleDef").forEach((el) => {
      const quarter = (el.dataset.quarter || "").toUpperCase();
      if (!modules[quarter]) return;

      const id = (el.dataset.id || "").trim();
      const title = (el.dataset.title || "").trim();
      if (!id || !title) return;

      const slidesUrl = (
        el.dataset.slidesUrl ||
        el.dataset.fileUrl ||
        el.getAttribute("data-slides-url") ||
        el.getAttribute("data-file-url") ||
        ""
      ).trim()

      const followUpUrl = (
        el.dataset.followUpUrl ||
        el.dataset.followUpUrl ||
        el.getAttribute("data-follow-up-url") ||
        el.getAttribute("data-followup-url") ||
        ""
      ).trim();

      const sessionUrl = (
        el.dataset.sessionUrl ||
        el.getAttribute("data-session-url") ||
        ""
      ).trim;

      modules[quarter].push({
        id,
        title,
        description: (el.dataset.description || "").trim(),
        slidesUrl,
        followUpUrl,
        sessionUrl,
      });
    });

    return modules;
  }

  const STORAGE_KEY = "yan_member_dashboard_v1";
  const ADMIN_SUBMISSIONS_KEY = "yan_member_submissions";

  const ADMIN_STORAGE_KEYS = {
    COURSES: "yan_courses",
    ASSIGNMENTS: "yan_assignments"
  };

  const DEFAULT_STATE = {
    selectedQuarter: "Q1",
    profile: {
      name: "Member Name",
      email: "member@yan.rw",
      org: "Organization Name",
      role: "Member",
      phone: "+250 XXX XXX XXX",
    },
    progress: {
      // moduleId: true/false
    },
    submissions: [
      // { id, quarter, moduleId, moduleTitle, fileName, fileSize, createdAt }
    ],
  };

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);

      // Merge defaults safely
      return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        profile: { ...DEFAULT_STATE.profile, ...(parsed.profile || {}) },
        progress: { ...(parsed.progress || {}) },
        submissions: Array.isArray(parsed.submissions) ? parsed.submissions : [],
      };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function loadAdminSubmissions() {
    try {
      const raw = localStorage.getItem(ADMIN_SUBMISSIONS_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function syncSubmissionToAdmin(entry) {
    const submissions = loadAdminSubmissions();
    const existingIndex = submissions.findIndex((submission) => submission.id === entry.id);

    const memberName = state.profile.name || auth.user?.name || "Member User";
    const memberEmail = state.profile.email || auth.user?.identifier || "";
    const memberOrg = state.profile.org || "Organization Name";
    
    const existingSubmission = existingIndex >= 0 ? submissions[existingIndex] : null;

    const submissionRecord = {
      ...existingSubmission,
      ...entry,
      memberName,
      memberEmail,
      memberOrg,
      submittedAt: new Date(entry.createdAt).toISOString(),
    };

    if (existingIndex >= 0) {
      submissions[existingIndex] = { ...submissions[existingIndex], ...submissionRecord };
    } else {
      submissions.unshift(submissionRecord);
    }

    localStorage.setItem(ADMIN_SUBMISSIONS_KEY, JSON.stringify(submissions));
  }

  function syncAllSubmissionsToAdmin() {
    state.submissions.forEach(syncSubmissionToAdmin);
  }

  function readJSONList(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return[];
    }
  }

  let state = loadState();

  // --------- Quarter gating logic ----------
  function isQuarterDateOpen(q) {
    const now = new Date();
    return now >= quarterStartDate(now.getFullYear(), q);
  }

  function isQuarterCompleted(q) {
    const mods = MODULES[q] || [];
    if (!mods.length) return false;
    return mods.every((m) => Boolean(state.progress[m.id]));
  }

  function canAccessQuarter(q) {
    // Must be date-open AND previous quarter complete (except Q1)
    if (!isQuarterDateOpen(q)) return false;

    if (q === "Q1") return true;
    if (q === "Q2") return isQuarterCompleted("Q1");
    if (q === "Q3") return isQuarterCompleted("Q2");
    if (q === "Q4") return isQuarterCompleted("Q3");
    return false;
  }

  function currentOpenQuarter() {
    // Most advanced quarter the user can access
    const order = ["Q1", "Q2", "Q3", "Q4"];
    let best = "Q1";
    for (const q of order) {
      if (canAccessQuarter(q)) best = q;
    }
    return best;
  }

  function nextUnlockInfo() {
    const now = new Date();
    const year = now.getFullYear();
    const order = ["Q1", "Q2", "Q3", "Q4"];

    for (const q of order) {
      if (!isQuarterDateOpen(q)) {
        return { quarter: q, date: quarterStartDate(year, q) };
      }
    }
    // next year Q1
    return { quarter: "Q1", date: quarterStartDate(year + 1, "Q1") };
  }

  // --------- UI Elements ----------
  const els = {
    today: $("#mdToday"),

    currentQuarterLabel: $("#currentQuarterLabel"),
    currentQuarterDates: $("#currentQuarterDates"),
    overallProgressText: $("#overallProgressText"),
    overallProgressFill: $("#overallProgressFill"),
    submittedCount: $("#submittedCount"),
    gradedCountHint: $("#gradedCountHint"),
    nextUnlockLabel: $("#nextUnlockLabel"),
    nextUnlockDate: $("#nextUnlockDate"),

    quarterName: $("#quarterName"),
    quarterRange: $("#quarterRange"),
    quarterStatus: $("#quarterStatus"),
    quarterTabs: $$(".mdQuarterCard"),
    modulesList: $("#moduleList"),
    assignmentList: $("#assignmentList"),

    // profile
    mdAvatar: $("#mdAvatar"),
    mdUserName: $("#mdUserName"),
    mdUserOrg: $("#mdUserOrg"),
    profileName: $("#profileName"),
    profileEmail: $("#profileEmail"),
    profileOrg: $("#profileOrg"),
    profileRole: $("#profileRole"),
    profilePhone: $("#profilePhone"),
    editProfileBtn: $("#editProfileBtn"),
    editProfileModal: $("#editProfileModal"),
    editProfileForm: $("#editProfileForm"),
    editName: $("#editName"),
    editEmail: $("#editEmail"),
    editOrg: $("#editOrg"),
    editPhone: $("#editPhone"),

    // submissions
    submissionQuarter: $("#submissionQuarter"),
    submissionModule: $("#submissionModule"),
    dropzone: $("#dropzone"),
    fileInput: $("#fileInput"),
    filePreview: $("#filePreview"),
    submitAssignmentBtn: $("#submitAssignmentBtn"),
    submissionAlert: $("#submissionAlert"),
    submissionHistory: $("#submissionHistory"),
    gradeHistory: $("#gradeHistory"),

    // module viewer
    moduleViewerModal: $("#moduleViewerModal"),
    moduleViewerFrame: $("#moduleViewerFrame"),
    viewerTitle: $("#viewerTitle"),
    viewerMeta: $("#viewerMeta"),
    openInNewTabBtn: $("#openInNewTabBtn"),
    markCompleteBtn: $("#markCompleteBtn"),

    //reporting
    generateReportBtn: $("#generateReportBtn"),
    reportPreview: $("#reportPreview"),
    reportPeriod: $("#reportPeriod"),
  };

  // --------- Rendering ----------
  function computeOverallProgress() {
    const all = Object.values(MODULES).flat();
    if (!all.length) return 0;
    const done = all.filter((m) => state.progress[m.id]).length;
    return Math.round((done / all.length) * 100);
  }

  function getGradedSubmissions() {
    return state.submissions.filter((submission) => submission.grade || submission.feedback);
  }

  function syncGradesFromAdmin() {
    const adminSubmissions = loadAdminSubmissions();
    let hasChanges = false;

    state.submissions = state.submissions.map((submission) => {
      const adminMatch = adminSubmissions.find((item) => item.id === submission.id);
      if (!adminMatch) return submission;

      const nextSubmission ={
        ...submission,
        grade: adminMatch.grade || "",
        feedback: adminMatch.feedback || "",
        gradedAt: adminMatch.gradedAt || submission.gradedAt || "",
        gradedBy: adminMatch.gradedBy || submission.gradedBy || "",
      };

      if (
        nextSubmission.grade !== (submission.grade || "") ||
        nextSubmission.feedback !== (submission.feedback || "") ||
        nextSubmission.gradedAt !== (submission.gradedAt || "") ||
        nextSubmission.gradedBy !== (submission.gradedBy || "")
      ) {
        hasChanges = true
      }

      return nextSubmission;
    });

    if (hasChanges) saveState();
  }

  function renderTopStats() {
    const openQ = currentOpenQuarter();
    const range = quarterRange(new Date().getFullYear(), openQ);
    const next = nextUnlockInfo();

    if (els.today) els.today.textContent = `Today: ${formatDate(new Date())}`;

    els.currentQuarterLabel.textContent = openQ;
    els.currentQuarterDates.textContent = `${formatDate(range.start)} – ${formatDate(range.end)}`;

    const pct = computeOverallProgress();
    els.overallProgressText.textContent = `${pct}%`;
    els.overallProgressFill.style.width = `${pct}%`;

    const gradedCount = getGradedSubmissions().length;
    els.submittedCount.textContent = String(state.submissions.length);
    if (els.gradedCountHint) {
      els.gradedCountHint.textContent = `${gradedCount} graded submission ${gradedCount === 1 ? "" : "s"}`;
    }

    els.nextUnlockLabel.textContent = next.quarter;
    els.nextUnlockDate.textContent = formatDate(next.date);
  }

  function renderProfile() {
    const p = state.profile;

    els.mdAvatar.textContent = initials(p.name);
    els.mdUserName.textContent = p.name;
    els.mdUserOrg.textContent = p.org;

    els.profileName.textContent = p.name;
    els.profileEmail.textContent = p.email;
    els.profileOrg.textContent = p.org;
    els.profileRole.textContent = p.role;
    els.profilePhone.textContent = p.phone;

    // Pre-fill edit form
    els.editName.value = p.name;
    els.editEmail.value = p.email;
    els.editOrg.value = p.org;
    els.editPhone.value = p.phone;
  }

  function quarterPrettyName(q) {
    return q === "Q1" ? "Quarter 1" : q === "Q2" ? "Quarter 2" : q === "Q3" ? "Quarter 3" : "Quarter 4";
  }

  function renderQuarterMeta(q) {
    els.quarterName.textContent = quarterPrettyName(q);

    const nowYear = new Date().getFullYear();
    const r = quarterRange(nowYear, q);
    els.quarterRange.textContent = `${formatDate(r.start)} – ${formatDate(r.end)}`;

    const dateOpen = isQuarterDateOpen(q);
    const allowed = canAccessQuarter(q);

    let badgeClass = "open";
    let text = "Open";

    if (!dateOpen) {
      badgeClass = "locked";
      text = `Locked (opens ${formatDate(quarterStartDate(nowYear, q))})`;
    } else if (!allowed) {
      badgeClass = "locked";
      // locked due to prerequisite
      const prereq = q === "Q2" ? "Q1" : q === "Q3" ? "Q2" : q === "Q4" ? "Q3" : "";
      text = `Locked (complete ${prereq} first)`;
    }

    els.quarterStatus.innerHTML = `<span class="mdStatusBadge ${badgeClass}">${safeText(text)}</span>`;
  }

  function renderQuarterTabs(activeQ) {
    els.quarterTabs.forEach((btn) => {
      const q = btn.dataset.quarter;
      const allowed = canAccessQuarter(q);

      btn.classList.toggle("active", q === activeQ);
      btn.setAttribute("aria-selected", q === activeQ ? "true" : "false");

      // visually show locked
      btn.classList.toggle("is-locked", !allowed);
      btn.title = allowed ? quarterPrettyName(q) : `${quarterPrettyName(q)} (locked)`;
    });
  }

  function moduleStatus(moduleId) {
    return state.progress[moduleId] ? "completed" : "not-started";
  }

  function moduleProgressPercent(moduleId) {
    // For now: completed = 100, not completed = 0
    return state.progress[moduleId] ? 100 : 0;
  }

  function renderModules(q) {
    const allowedQuarter = canAccessQuarter(q);
    const mods = MODULES[q] || [];

    els.modulesList.innerHTML = "";

    if (!mods.length) {
      els.modulesList.innerHTML = `<div class="mdEmptyCard">No modules configured yet.</div>`;
      return;
    }

    mods.forEach((m) => {
      const completed = Boolean(state.progress[m.id]);
      const pct = moduleProgressPercent(m.id);
      const status = moduleStatus(m.id);

      const locked = !allowedQuarter;

      const card = document.createElement("div");
      card.className = `mdModuleCard ${locked ? "locked" : ""}`;
      card.innerHTML = `
        <div class="mdModuleTop">
          <div>
            <div class="mdModuleTitle">${safeText(m.title)}</div>
            <div class="mdModuleDesc">${safeText(m.description)}</div>
          </div>
          <div class="mdModuleBadge ${status}">
            ${completed ? "Completed" : locked ? "Locked" : "Not started"}
          </div>
        </div>

        <div class="mdModuleProgress">
          <div class="mdModuleProgressRow">
            <span>Progress</span>
            <span>${pct}%</span>
          </div>
          <div class="mdMiniBar">
            <div class="mdMiniFill" style="width:${pct}%"></div>
          </div>
        </div>

        <div class="mdCourseResources">
          <a class="mdResourceLink ${m.slidesUrl ? "" : "disabled"}" href="${m.slidesUrl ? encodeURI(m.slidesUrl) : "#"}" target="_blank" rel="noopener noreferrer" ${m.slidesUrl ? "" : 'aria-disabled="true" tabindex="-1"'}>
            Slides
          </a>
          <a class="mdResourceLink ${m.followUpUrl ? "" : "disabled"}" href="${m.followUpUrl ? encodeURI(m.followUpUrl) : "#"}" target="_blank" rel="noopener noreferrer" ${m.followUpUrl ? "" : 'aria-disabled="true" tabindex="-1"'}>
            Follow-up Resource
          </a>
        </div>

        <div class="mdModuleActions">
          <button class="btn btn-outline btn-small" data-action="view" data-q="${q}" data-id="${m.id}" ${locked ? "disabled" : ""}>
            Open Slides
          </button>

          <button class="btn btn-primary btn-small" data-action="complete" data-q="${q}" data-id="${m.id}" ${locked || completed ? "disabled" : ""}>
            Mark complete
          </button>
        </div>
      `;

      els.modulesList.appendChild(card);
    });

    // Update submission module dropdown based on current quarter dropdown selection
    syncSubmissionModuleOptions();
  }

  function renderSubmissionHistory() {
    const list = els.submissionHistory;
    list.innerHTML = "";

    if (!state.submissions.length) {
      list.innerHTML = `<div class="mdEmptyState">No submissions yet.</div>`;
      return;
    }

    const recent = [...state.submissions].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8);

    for (const s of recent) {
      const row = document.createElement("div");
      row.className = "mdHistoryItem";
      row.innerHTML = `
        <div class="mdHistoryLeft">
          <div class="mdHistoryTitle">${safeText(s.moduleTitle)}</div>
          <div class="mdHistoryMeta">${safeText(s.quarter)} • ${formatDate(new Date(s.createdAt))}</div>
        </div>
        <div class="mdHistoryRight">
          <span class="mdFileChip" title="${safeText(s.fileName)}">${safeText(s.fileName)}</span>
        </div>
      `;
      list.appendChild(row);
    }
  }

  function renderGradeHistory() {
    const list = els.gradeHistory;
    if (!list) return;

    list.innerHTML = "";
    const graded = [...getGradedSubmissions()].sort((a, b) => Number(b.gradedAt || 0) - Number(a.gradedAt || 0));

    if (!graded.length) {
      list.innerHTML = `<div class="mdEmptyState">Grades from the admin will appear here once reviewed.</div>`;
      return;
    }

    graded.forEach((submission) => {
      const row = document.createElement("div");
      row.className = "mdHistoryItem mdGradeItem";
      row.innerHTML = `
      <div class="mdHistoryLeft">
          <div class="mdHistoryTitle">${safeText(submission.moduleTitle)}</div>
          <div class="mdHistoryMeta">${safeText(submission.quarter)} • Graded ${formatDate(new Date(submission.gradedAt || submission.submittedAt || submission.createdAt))}</div>
        </div>
        <div class="mdHistoryRight mdGradeRight">
          ${submission.grade ? `<span class="mdGradeChip">${safeText(submission.grade)}</span>` : ""}
          <div class="mdGradeFeedback">${safeText(submission.feedback || "No feedback added yet.")}</div>
        </div>
      `;
      list.appendChild(row);
    });
  }

  function getAdminCourseMap() {
    return Object.fromEntries(
      readJSONList(ADMIN_STORAGE_KEYS.COURSES).map((course) => [course.id, course])
    );
  }

  function getAssignmentsForQuarter(q) {
    const courseMap = getAdminCourseMap();

    return readJSONList(ADMIN_STORAGE_KEYS.ASSIGNMENTS).map((assignment) => {
      const course = courseMap[assignment.courseId] || null;
      return {
        ...assignment,
        courseTitle: course?.title || assignment.courseTitle || "Unknown course",
        quarter: course?.quarter || assignment.quarter || "",
      };
    })
    .filter((assignment) => assignment.quarter === q)
    .sort((a, b) => {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });
  }

  function renderAvailableAssignments(q) {
    if (!els.assignmentList) return;

    const assignments = getAssignmentsForQuarter(q);
    els.assignmentList.innerHTML = "";

    if (!assignments.length) {
      els.assignmentList.innerHTML = `<div class="mdEmptyState">No assignments for ${safeText(q)} yet!</div>`;
      return;
    }

    assignments.forEach((assignment) => {
      const card = document.createElement("article");
      card.className = "mdAssignmentCard";
      card.innerHTML = `
      <div class="mdAssignmentTop">
        <div>
          <h4 class="mdAssignmentTitle">
            ${safeText(assignment.title || "Untitled Assignment")}
          </h4>
          <div class="mdAssignmentMeta">
            <span>${safeText(assignment.courseTitle)}</span>
            <span>${assignment.dueDate ? `Due ${safeText(formatDate(new Date(assignment.dueDate)))}` : "No due date"}</span>
          </div>
        </div>
        <span class="mdAssignmentQuarter">${safeText(q)}</span>
      </div>
      <p class="mdAssignmentDesc">${safeText(assignment.description || "No instructions added yet.")}</p>
      `;
      els.assignmentList.appendChild(card);
    });
  }
  
  function syncSubmissionModuleOptions() {
    const q = els.submissionQuarter.value || state.selectedQuarter;
    const mods = MODULES[q] || [];
    const select = els.submissionModule;

    // preserve selection if possible
    const prev = select.value;

    select.innerHTML = `<option value="">Select module…</option>`;
    mods.forEach((m) => {
      const opt = document.createElement("option");
      opt.value = m.id;
      opt.textContent = m.title;
      select.appendChild(opt);
    });

    if ([...select.options].some((o) => o.value === prev)) select.value = prev;
  }

  // --------- Modals ----------
  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function bindModalClosers() {
    $$("[data-close]").forEach((el) => {
      el.addEventListener("click", () => {
        closeModal(el.getAttribute("data-close"));
      });
    });

    // ESC to close any open modal
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      ["moduleViewerModal", "editProfileModal"].forEach((id) => {
        const m = document.getElementById(id);
        if (m && m.classList.contains("active")) closeModal(id);
      });
    });
  }

  // --------- Module Viewer ----------
  let currentViewerModule = null;

  function openModuleViewer(q, moduleId) {
    const m = (MODULES[q] || []).find((x) => x.id === moduleId);
    if (!m) return;

    currentViewerModule = { q, moduleId };

    els.viewerTitle.textContent = m.title;
    const status = state.progress[moduleId] ? "Completed" : "In progress";
    els.viewerMeta.textContent = `${q} • ${status}`;

    // Load file
    els.moduleViewerFrame.src = m.slidesUrl ? encodeURI(m.slidesUrl) : "";

    // Buttons
    if (els.openInNewTabBtn) {
      els.openInNewTabBtn.onclick = () => {
        if (m.slidesUrl) window.open(encodeURI(m.slidesUrl), "_blank", "noopener");
      };
    }

    els.markCompleteBtn.disabled = Boolean(state.progress[moduleId]);
    els.markCompleteBtn.onclick = () => {
      markModuleComplete(q, moduleId);
      closeModal("moduleViewerModal");
    };

    openModal("moduleViewerModal");
  }

  // --------- Reporting ----------
  function buildReportData() {
    const period = els.reportPeriod?.value || "all";
    const modules = Object.entries(MODULES).flatMap(([quarter, items]) =>
      items.map((item) => ({ quarter, ...item }))
    );

    const inScope = period === "all" ? modules : modules.filter((m) => m.quarter === period);
    const completed = inScope.filter((m) => state.progress[m.id]);

    const relatedSubmissions = state.submissions.filter((s) => period === "all" || s.quarter === period);

    return {
      createdAt: new Date().toISOString(),
      period,
      learner: state.profile,
      totals: {
        modules: inScope.length,
        completed: completed.length,
        completionPercent: inScope.length ? Math.round((completed.length / inScope.length) * 100) : 0,
        submissions: relatedSubmissions.length,
      },
      completedModules: completed.map((m) => ({ quarter: m.quarter, title: m.title })),
      submissions: relatedSubmissions.map((s) => ({
        quarter: s.quarter,
        moduleTitle: s.moduleTitle,
        fileName: s.fileName,
        submittedOn: new Date(s.createdAt).toISOString(),
      })),
    };
  }

  function downloadReportFile(fileName, text, mimeType = "text/plain") {
    const blob = new Blob([text], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function bindReportingUI() {
    if (!els.generateReportBtn) return;

    els.generateReportBtn.addEventListener("click", () => {
      const report = buildReportData();
      const generatedOn = formatDate(new Date(report.createdAt));

      if (els.reportPreview) {
        els.reportPreview.innerHTML = `
          <div class="mdReportLine"><strong>Generated:</strong> ${generatedOn}</div>
          <div class="mdReportLine"><strong>Period:</strong> ${safeText(report.period)}</div>
          <div class="mdReportLine"><strong>Completion:</strong> ${report.totals.completed}/${report.totals.modules} (${report.totals.completionPercent}%)</div>
          <div class="mdReportLine"><strong>Submissions:</strong> ${report.totals.submissions}</div>
        `;
      }

      const safeName = state.profile.name.trim().replace(/\s+/g, "-").toLowerCase() || "member";
      const periodLabel = report.period.toLowerCase();
      downloadReportFile(
        `yan-progress-report-${safeName}-${periodLabel}.json`,
        JSON.stringify(report, null, 2),
        "application/json"
      );
    });
  }


  function markModuleComplete(q, moduleId) {
    state.progress[moduleId] = true;
    saveState();

    // If user completes last module that unlocks next quarter, refresh
    renderAll();
  }

  // --------- Submissions ----------
  let selectedFile = null;

  function humanFileSize(bytes) {
    if (!bytes && bytes !== 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let val = bytes;
    let i = 0;
    while (val >= 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return `${val.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  }

  function setAlert(msg, type = "info") {
    const el = els.submissionAlert;
    el.classList.remove("hidden", "success", "error", "info", "warning");
    el.classList.add(type);
    el.textContent = msg;

    window.clearTimeout(setAlert._t);
    setAlert._t = window.setTimeout(() => {
      el.classList.add("hidden");
    }, 2500);
  }

  function updateFilePreview() {
    const box = els.filePreview;
    box.innerHTML = "";

    if (!selectedFile) {
      els.submitAssignmentBtn.disabled = true;
      return;
    }

    const row = document.createElement("div");
    row.className = "mdFileRow";
    row.innerHTML = `
      <div class="mdFileIcon">📎</div>
      <div class="mdFileInfo">
        <div class="mdFileName">${safeText(selectedFile.name)}</div>
        <div class="mdFileSize">${humanFileSize(selectedFile.size)}</div>
      </div>
      <button class="mdFileRemove" type="button" title="Remove file">×</button>
    `;
    row.querySelector(".mdFileRemove").addEventListener("click", () => {
      selectedFile = null;
      els.fileInput.value = "";
      updateFilePreview();
    });

    box.appendChild(row);

    // enable submit only if module selected
    els.submitAssignmentBtn.disabled = !els.submissionModule.value;
  }

  function bindSubmissionUI() {
    if (!els.submissionQuarter || !els.submissionModule || !els.dropzone || !els.fileInput || !els.submitAssignmentBtn || !els.submissionHistory) {
      return;
    }

    // populate initial
    els.submissionQuarter.value = state.selectedQuarter;
    syncSubmissionModuleOptions();

    els.submissionQuarter.addEventListener("change", () => {
      syncSubmissionModuleOptions();
      selectedFile = null;
      els.fileInput.value = "";
      updateFilePreview();
    });

    els.submissionModule.addEventListener("change", () => {
      els.submitAssignmentBtn.disabled = !els.submissionModule.value || !selectedFile;
    });

    // dropzone click triggers file input
    els.dropzone.addEventListener("click", () => els.fileInput.click());
    els.dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") els.fileInput.click();
    });

    els.fileInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      selectedFile = f || null;
      updateFilePreview();
    });

    // drag/drop
    ["dragenter", "dragover"].forEach((evt) => {
      els.dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        els.dropzone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((evt) => {
      els.dropzone.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        els.dropzone.classList.remove("drag-over");
      });
    });

    els.dropzone.addEventListener("drop", (e) => {
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) {
        selectedFile = f;
        updateFilePreview();
      }
    });

    els.submitAssignmentBtn.addEventListener("click", async() => {
      const q = els.submissionQuarter.value;
      const moduleId = els.submissionModule.value;
      if (!q || !moduleId || !selectedFile) return;

      // Quarter must be accessible
      if (!canAccessQuarter(q)) {
        setAlert("This quarter is locked. Complete previous quarter and wait for the start date.", "warning");
        return;
      }

      const module = (MODULES[q] || []).find((m) => m.id === moduleId);
      if (!module) return;

      try {
        const fileDataUrl = await readFileAsDataURL(selectedFile);
        
        const entry = {
          id: `sub-${Date.now()}`,
          quarter: q,
          moduleId,
          moduleTitle: module.title,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type || "application/octet-stream",
          fileDataUrl,
          createdAt: Date.now(),
        };

        state.submissions.push(entry);
        saveState();
        syncSubmissionToAdmin(entry);
      } catch {
        setAlert("We could not read that file. Please try uploading again.", "warning");
        return;
      }

      // reset UI
      selectedFile = null;
      els.fileInput.value = "";
      updateFilePreview();

      renderTopStats();
      renderSubmissionHistory();
      renderGradeHistory();
      setAlert("Submission saved successfully. Awaiting review", "success");
    });
  }

  // --------- Profile editing ----------
  function bindProfileUI() {
    if (!els.editProfileBtn || !els.editProfileForm) return;
    els.editProfileBtn.addEventListener("click", () => openModal("editProfileModal"));

    els.editProfileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      state.profile.name = els.editName.value.trim() || state.profile.name;
      state.profile.email = els.editEmail.value.trim() || state.profile.email;
      state.profile.org = els.editOrg.value.trim() || state.profile.org;
      state.profile.phone = els.editPhone.value.trim() || state.profile.phone;

      saveState();
      renderProfile();
      closeModal("editProfileModal");
    });
  }

  // --------- Quarter tab switching ----------
  function bindQuarterTabs() {
    if (!els.quarterTabs?.length) return;

    els.quarterTabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.dataset.quarter;

        // if (!canAccessQuarter(q)) {
        //   // keep user on current
        //   renderQuarterTabs(state.selectedQuarter);
        //   renderQuarterMeta(state.selectedQuarter);
        //   renderModules(state.selectedQuarter);
        //   return;
        // }

        state.selectedQuarter = q;
        saveState();

        renderQuarterTabs(q);
        renderQuarterMeta(q);
        renderModules(q);

        // keep submission quarter aligned with selected quarter
        els.submissionQuarter.value = q;
        syncSubmissionModuleOptions();
      });
    });
  }

  // --------- Module card actions ----------
  function bindModuleActions() {
    if (!els.modulesList) return;

    els.modulesList.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;
      const q = btn.dataset.q;
      const id = btn.dataset.id;

      if (action === "view") {
        const mod = (MODULES[q] || []).find((m) => m.id === id);
        if (mod?.slidesUrl) {
          window.open(mod.slidesUrl, "_blank", "noopener");
        }
      }
      if (action === "complete") {
        markModuleComplete(q, id);
      }
    });
  }

  // --------- Initial render ----------
  function renderAll() {
    if (!els.modulesList || !els.quarterName || !els.quarterRange || !els.quarterStatus) {
      return;
    }

    // // Fix selected quarter if it is locked
    // if (!canAccessQuarter(state.selectedQuarter)) {
    //   state.selectedQuarter = currentOpenQuarter();
    //   saveState();
    // }

    syncAllSubmissionsToAdmin();
    syncGradesFromAdmin();
    renderTopStats();
    renderProfile();
    renderQuarterTabs(state.selectedQuarter);
    renderQuarterMeta(state.selectedQuarter);
    renderModules(state.selectedQuarter);
    renderAvailableAssignments(state.selectedQuarter);

    // submission selectors
    els.submissionQuarter.value = state.selectedQuarter;
    syncSubmissionModuleOptions();
    updateFilePreview();

    renderSubmissionHistory();
    renderGradeHistory();
  }

  // --------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    MODULES = buildModulesFromHTML();
    syncAllSubmissionsToAdmin();
    // navbar/footer are injected by include.js already
    bindModalClosers();
    bindProfileUI();
    bindQuarterTabs();
    bindModuleActions();
    bindSubmissionUI();
    bindReportingUI();
    renderAll();
  });
})();