// yanApplicationForm.js
// Frontend-only behavior:
// - Basic required field checks
// - Youth age range check (20–35)
// - Save Draft to localStorage
// - "Submit" shows success message and stores payload locally
// NOTE: Later you will replace submit handler with fetch() to backend.

const form = document.getElementById("yanApplicationForm");
const alertBox = document.getElementById("formAlert");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const submitBtn = document.getElementById("submitBtn");

function showAlert(message, type = "success") {
  alertBox.textContent = message;
  alertBox.classList.add("is-show");
  alertBox.classList.remove("is-danger", "is-success");
  alertBox.classList.add(type === "danger" ? "is-danger" : "is-success");
}

function clearAlert() {
  alertBox.textContent = "";
  alertBox.classList.remove("is-show", "is-danger", "is-success");
}

function getAgeFromDob(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  if (Number.isNaN(dob.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function serializeFormToJson(formEl) {
  const data = {};
  const fd = new FormData(formEl);

  // Multi-select values:
  const geo = fd.getAll("geoFocus");
  data.geoFocus = geo;

  // Text values:
  for (const [key, value] of fd.entries()) {
    if (key === "geoFocus") continue;

    // Files: keep just file names for draft preview
    if (value instanceof File) {
      if (!data[key]) data[key] = [];
      if (value && value.name) data[key].push(value.name);
      continue;
    }

    // Checkboxes:
    if (key === "confirmParticipation" || key === "declaration") {
      data[key] = true;
      continue;
    }

    data[key] = value;
  }

  // Ensure unchecked checkboxes appear as false
  if (!fd.get("confirmParticipation")) data.confirmParticipation = false;
  if (!fd.get("declaration")) data.declaration = false;

  return data;
}

function loadDraft() {
  const raw = localStorage.getItem("yan_application_draft");
  if (!raw) return;
  try {
    const data = JSON.parse(raw);

    // Fill simple fields
    Object.keys(data).forEach((key) => {
      const el = form.elements[key];
      if (!el) return;

      // geoFocus is handled below
      if (key === "geoFocus") return;

      // Checkboxes
      if (el.type === "checkbox") {
        el.checked = Boolean(data[key]);
        return;
      }

      // Inputs/textareas/selects (ignore file inputs)
      if (el.type !== "file") {
        el.value = data[key] ?? "";
      }
    });

    // Multi-select: geoFocus
    const geoEl = form.elements["geoFocus"];
    if (geoEl && geoEl.options && Array.isArray(data.geoFocus)) {
      for (const opt of geoEl.options) {
        opt.selected = data.geoFocus.includes(opt.value);
      }
    }

    showAlert("Draft loaded from this browser.", "success");
  } catch {
    // ignore
  }
}

function validateYouthAgeRange() {
  const dobEl = form.elements["repDob"];
  const age = getAgeFromDob(dobEl.value);
  if (age === null) return { ok: false, message: "Please select a valid Date of Birth." };
  if (age < 20 || age > 35) {
    return { ok: false, message: "Representative age must be within YAN youth range (20–35)." };
  }
  return { ok: true };
}

function validateRequired() {
  // Use built-in browser validation first
  if (!form.checkValidity()) {
    // Trigger built-in UI
    form.reportValidity();
    return { ok: false, message: "Please fill all required fields." };
  }

  // Custom: Age range
  const ageCheck = validateYouthAgeRange();
  if (!ageCheck.ok) return ageCheck;

  return { ok: true };
}

saveDraftBtn.addEventListener("click", () => {
  clearAlert();
  const data = serializeFormToJson(form);
  localStorage.setItem("yan_application_draft", JSON.stringify(data));
  showAlert("Draft saved on this browser.", "success");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearAlert();

  const v = validateRequired();
  if (!v.ok) {
    showAlert(v.message, "danger");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  // Frontend-only "submit"
  const payload = serializeFormToJson(form);
  payload.status = "Submitted";
  payload.submittedAt = new Date().toISOString();

  localStorage.setItem("yan_application_last_submit", JSON.stringify(payload));
  localStorage.removeItem("yan_application_draft");

  setTimeout(() => {
    showAlert("Application submitted successfully. Status: Submitted (frontend only).", "success");
    submitBtn.textContent = "Submitted";
  }, 500);
});

// Auto-load draft on page open
loadDraft();