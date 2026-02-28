// yanApplicationForm.js
// Sends submitted application to Admin Dashboard (localStorage based)

const form = document.getElementById("yanApplicationForm");
const alertBox = document.getElementById("formAlert");
const saveDraftBtn = document.getElementById("saveDraftBtn");
const submitBtn = document.getElementById("submitBtn");

const LS_KEYS = {
  APPS: "yan_applications"
};

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
  if (!form.checkValidity()) {
    form.reportValidity();
    return { ok: false, message: "Please fill all required fields." };
  }

  const ageCheck = validateYouthAgeRange();
  if (!ageCheck.ok) return ageCheck;

  return { ok: true };
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function serializeFormWithFiles(formEl) {
  const fd = new FormData(formEl);
  const data = {};
  const files = {};

  for (const [key, value] of fd.entries()) {

    // FILES
    if (value instanceof File && value.size > 0) {
      if (!files[key]) files[key] = [];
      const base64 = await readFileAsDataURL(value);
      files[key].push({
        name: value.name,
        type: value.type,
        dataUrl: base64
      });
      continue;
    }

    // CHECKBOXES
    if (key === "confirmParticipation" || key === "declaration") {
      data[key] = true;
      continue;
    }

    data[key] = value;
  }

  if (!fd.get("confirmParticipation")) data.confirmParticipation = false;
  if (!fd.get("declaration")) data.declaration = false;

  return { data, files };
}

saveDraftBtn.addEventListener("click", async () => {
  clearAlert();
  const { data } = await serializeFormWithFiles(form);
  localStorage.setItem("yan_application_draft", JSON.stringify(data));
  showAlert("Draft saved on this browser.", "success");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();

  const v = validateRequired();
  if (!v.ok) {
    showAlert(v.message, "danger");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  const { data, files } = await serializeFormWithFiles(form);

  const application = {
    id: "app_" + Date.now(),
    fullName: data.repFullName,
    email: data.repEmail,
    organization: data.orgLegalName,
    status: "pending",
    createdAt: new Date().toISOString(),
    data: data,
    files: files
  };

  const existing = JSON.parse(localStorage.getItem(LS_KEYS.APPS)) || [];
  existing.push(application);
  localStorage.setItem(LS_KEYS.APPS, JSON.stringify(existing));

  localStorage.removeItem("yan_application_draft");

  showAlert("Application submitted successfully. It is now under review.", "success");

  submitBtn.textContent = "Submitted";
});