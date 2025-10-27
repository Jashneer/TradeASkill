// -------- Profile.js --------

// Load profile data from localStorage or use demo data
let userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
  name: "Khushi Verma",
  email: "khushi@example.com",
  bio: "Passionate about learning and sharing skills through TradeASkill.",
  rating: 4.8,
  trades: 12,
  memberSince: "2025",
};

// ---- When DOM loads ----
document.addEventListener("DOMContentLoaded", () => {
  updateProfileDisplay();
  setupEditProfileButton();
  loadSkills(); // Load saved skills
});

// ---- Function to update displayed profile info ----
function updateProfileDisplay() {
  const nameEl = document.querySelector(".profile-info h2");
  const emailEl = document.querySelector(".user-email");
  const bioEl = document.querySelector(".user-bio");
  const stats = document.querySelectorAll(".stat-number");

  if (nameEl) nameEl.textContent = userProfile.name;
  if (emailEl) emailEl.textContent = userProfile.email;
  if (bioEl) bioEl.textContent = userProfile.bio;

  if (stats.length >= 3) {
    stats[0].textContent = userProfile.rating;
    stats[1].textContent = userProfile.trades;
    stats[2].textContent = userProfile.memberSince;
  }
}

// ---- Setup Edit Profile Button ----
function setupEditProfileButton() {
  const editBtn = document.getElementById("editProfileBtn");
  if (!editBtn) {
    console.error("Edit Profile button not found! Make sure it has id='editProfileBtn'");
    return;
  }

  editBtn.addEventListener("click", () => {
    // Ask for each field, stop if Cancel is pressed
    const newName = prompt("Enter your name:", userProfile.name);
    if (newName === null) return; // user cancelled

    const newEmail = prompt("Enter your email:", userProfile.email);
    if (newEmail === null) return;

    const newBio = prompt("Enter your bio:", userProfile.bio);
    if (newBio === null) return;

    const newRating = prompt("Enter your rating (0 - 5):", userProfile.rating);
    if (newRating === null) return;

    const newTrades = prompt("Enter number of trades:", userProfile.trades);
    if (newTrades === null) return;

    const newMemberSince = prompt("Enter member since year:", userProfile.memberSince);
    if (newMemberSince === null) return;

    // Update only if input is given, else keep old values
    userProfile.name = newName.trim() || userProfile.name;
    userProfile.email = newEmail.trim() || userProfile.email;
    userProfile.bio = newBio.trim() || userProfile.bio;
    userProfile.rating = parseFloat(newRating) || userProfile.rating;
    userProfile.trades = parseInt(newTrades) || userProfile.trades;
    userProfile.memberSince = newMemberSince.trim() || userProfile.memberSince;

    // Save to localStorage
    localStorage.setItem("userProfile", JSON.stringify(userProfile));

    // Update display instantly
    updateProfileDisplay();
  });
}

// ---- Skill Storage in LocalStorage ----
function loadSkills() {
  const teachSkills = JSON.parse(localStorage.getItem("teachSkills")) || [];
  const learnSkills = JSON.parse(localStorage.getItem("learnSkills")) || [];

  const teachContainer = document.getElementById("teach-skills");
  const learnContainer = document.getElementById("learn-skills");

  if (teachContainer) teachContainer.innerHTML = "";
  if (learnContainer) learnContainer.innerHTML = "";

  teachSkills.forEach(skill => addSkillTag(skill, teachContainer));
  learnSkills.forEach(skill => addSkillTag(skill, learnContainer));
}

// ---- Function to add skill tag ----
function addSkillTag(skill, container) {
  if (!container) return;
  const span = document.createElement("span");
  span.classList.add("skill-tag");
  span.textContent = skill;

  // Add remove option (X)
  const removeBtn = document.createElement("button");
  removeBtn.textContent = " ✖";
  removeBtn.classList.add("remove-btn");
  removeBtn.onclick = () => {
    span.remove();
    saveSkills();
  };

  span.appendChild(removeBtn);
  container.appendChild(span);
}

// ---- Add new skill ----
const addTeachBtn = document.getElementById("addTeachSkillBtn");
const addLearnBtn = document.getElementById("addLearnSkillBtn");

if (addTeachBtn) {
  addTeachBtn.addEventListener("click", () => {
    const skill = prompt("Enter a skill you can teach:");
    if (skill && skill.trim() !== "") {
      const container = document.getElementById("teach-skills");
      addSkillTag(skill.trim(), container);
      saveSkills();
    }
  });
}

if (addLearnBtn) {
  addLearnBtn.addEventListener("click", () => {
    const skill = prompt("Enter a skill you want to learn:");
    if (skill && skill.trim() !== "") {
      const container = document.getElementById("learn-skills");
      addSkillTag(skill.trim(), container);
      saveSkills();
    }
  });
}

// ---- Save skills to localStorage ----
function saveSkills() {
  const teachSkills = Array.from(document.querySelectorAll("#teach-skills .skill-tag"))
    .map(tag => tag.firstChild.textContent.trim());
  const learnSkills = Array.from(document.querySelectorAll("#learn-skills .skill-tag"))
    .map(tag => tag.firstChild.textContent.trim());

  localStorage.setItem("teachSkills", JSON.stringify(teachSkills));
  localStorage.setItem("learnSkills", JSON.stringify(learnSkills));
}
