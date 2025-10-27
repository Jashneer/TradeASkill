// -------- Profile.js --------

// Load logged-in user info
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

// If no logged-in user, use guest info
if (!currentUser) {
  currentUser = {
    firstName: "Guest",
    lastName: "User",
    email: "guest@example.com",
    bio: "Welcome to TradeASkill! Sign in to personalize your profile.",
    skillsToTeach: [],
    skillsToLearn: [],
    rating: 0,
    trades: 0,
    dateJoined: new Date().toLocaleDateString(),
  };
  localStorage.setItem("isLoggedIn", "false");
} else {
  localStorage.setItem("isLoggedIn", "true");
}

// ---- When DOM loads ----
document.addEventListener("DOMContentLoaded", () => {
  updateProfileDisplay();
  setupEditProfileButton();
  loadSkills();
  setupAuthButton();
});

// ---- Function: Update Profile Info ----
function updateProfileDisplay() {
  document.querySelector(".profile-info h2").textContent =
    `${currentUser.firstName} ${currentUser.lastName}`;
  document.querySelector(".user-email").textContent = currentUser.email;
  document.querySelector(".user-bio").textContent = currentUser.bio;

  const stats = document.querySelectorAll(".stat-number");
  stats[0].textContent = currentUser.rating || 0;
  stats[1].textContent = currentUser.trades || 0;
  stats[2].textContent = currentUser.dateJoined || new Date().toLocaleDateString();
}

// ---- Function: Edit Profile ----
function setupEditProfileButton() {
  const editBtn = document.getElementById("editProfileBtn");
  if (!editBtn) return;

  editBtn.addEventListener("click", () => {
    const newFirstName = prompt("Enter your first name:", currentUser.firstName);
    if (newFirstName === null) return;

    const newLastName = prompt("Enter your last name:", currentUser.lastName);
    if (newLastName === null) return;

    const newEmail = prompt("Enter your email:", currentUser.email);
    if (newEmail === null) return;

    const newBio = prompt("Enter your bio:", currentUser.bio);
    if (newBio === null) return;

    currentUser.firstName = newFirstName.trim() || currentUser.firstName;
    currentUser.lastName = newLastName.trim() || currentUser.lastName;
    currentUser.email = newEmail.trim() || currentUser.email;
    currentUser.bio = newBio.trim() || currentUser.bio;

    saveProfile();
    updateProfileDisplay();
    alert("Profile updated successfully!");
  });
}

// ---- Function: Manage Skills ----
function loadSkills() {
  const teachContainer = document.getElementById("teach-skills");
  const learnContainer = document.getElementById("learn-skills");
  teachContainer.innerHTML = "";
  learnContainer.innerHTML = "";

  (currentUser.skillsToTeach || []).forEach(skill =>
    addSkillTag(skill, teachContainer, "teach")
  );
  (currentUser.skillsToLearn || []).forEach(skill =>
    addSkillTag(skill, learnContainer, "learn")
  );

  setupSkillButtons();
}

function addSkillTag(skill, container, type) {
  const span = document.createElement("span");
  span.classList.add("skill-tag");
  span.textContent = skill;

  const removeBtn = document.createElement("button");
  removeBtn.textContent = " ✖";
  removeBtn.classList.add("remove-btn");
  removeBtn.onclick = () => {
    span.remove();
    removeSkill(skill, type);
  };

  span.appendChild(removeBtn);
  container.appendChild(span);
}

function setupSkillButtons() {
  const addTeachBtn = document.getElementById("addTeachSkillBtn");
  const addLearnBtn = document.getElementById("addLearnSkillBtn");

  if (addTeachBtn) {
    addTeachBtn.addEventListener("click", () => {
      const skill = prompt("Enter a skill you can teach:");
      if (skill && skill.trim() !== "") {
        currentUser.skillsToTeach.push(skill.trim());
        saveProfile();
        loadSkills();
      }
    });
  }

  if (addLearnBtn) {
    addLearnBtn.addEventListener("click", () => {
      const skill = prompt("Enter a skill you want to learn:");
      if (skill && skill.trim() !== "") {
        currentUser.skillsToLearn.push(skill.trim());
        saveProfile();
        loadSkills();
      }
    });
  }
}

function removeSkill(skill, type) {
  if (type === "teach") {
    currentUser.skillsToTeach = currentUser.skillsToTeach.filter(s => s !== skill);
  } else {
    currentUser.skillsToLearn = currentUser.skillsToLearn.filter(s => s !== skill);
  }
  saveProfile();
}

function saveProfile() {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// ---- Function: Sign In / Out Button ----
function setupAuthButton() {
  const authBtn = document.getElementById("authBtn");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    authBtn.textContent = "Sign Out";
  } else {
    authBtn.textContent = "Sign In";
  }

  authBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (authBtn.textContent === "Sign Out") {
      const confirmLogout = confirm("Are you sure you want to sign out?");
      if (confirmLogout) {
        localStorage.removeItem("currentUser");
        localStorage.setItem("isLoggedIn", "false");
        authBtn.textContent = "Sign In";
        window.location.reload();
      }
    } else {
      // Go to login/signup page (change this if needed)
      window.location.href = "signup.html";
    }
  });
}
