// signup.js - TradeASkill Project (Simplified Version)
// Author: Kashish

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".signup-form");
  const submitBtn = form.querySelector('button[type="submit"]');
  const API_URL = "http://localhost:3000/users"; // JSON Server URL

  // -----------------------------
  // Function: Show Error Message
  // -----------------------------
  function showError(input, message) {
    let error = input.parentElement.querySelector(".error-msg");
    if (!error) {
      error = document.createElement("small");
      error.classList.add("error-msg");
      error.style.color = "red";
      input.parentElement.appendChild(error);
    }
    error.textContent = message;
  }

  // -----------------------------
  // Function: Clear Error Message
  // -----------------------------
  function clearError(input) {
    const error = input.parentElement.querySelector(".error-msg");
    if (error) error.textContent = "";
  }

  // -----------------------------
  // Function: Validate All Fields
  // -----------------------------
  function validateForm() {
    let isValid = true;

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const skillsToTeach = document.getElementById("skillsToTeach");
    const skillsToLearn = document.getElementById("skillsToLearn");
    const terms = document.getElementById("terms");

    // First name validation
    if (firstName.value.trim().length < 2) {
      showError(firstName, "First name must be at least 2 characters.");
      isValid = false;
    } else clearError(firstName);

    // Last name validation
    if (lastName.value.trim().length < 2) {
      showError(lastName, "Last name must be at least 2 characters.");
      isValid = false;
    } else clearError(lastName);

    // Email validation
    const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    } else clearError(email);

    // Password validation
    if (password.value.trim().length < 8) {
      showError(password, "Password must be at least 8 characters.");
      isValid = false;
    } else clearError(password);

    // Confirm password
    if (confirmPassword.value.trim() !== password.value.trim()) {
      showError(confirmPassword, "Passwords do not match.");
      isValid = false;
    } else clearError(confirmPassword);

    // Skills validation
    if (skillsToTeach.value.trim() === "") {
      showError(skillsToTeach, "Please enter at least one skill to teach.");
      isValid = false;
    } else clearError(skillsToTeach);

    if (skillsToLearn.value.trim() === "") {
      showError(skillsToLearn, "Please enter at least one skill to learn.");
      isValid = false;
    } else clearError(skillsToLearn);

    // Terms checkbox
    if (!terms.checked) {
      showError(terms, "You must accept the terms.");
      isValid = false;
    } else clearError(terms);

    return isValid;
  }

  // -----------------------------
  // Function: Convert Skills to Array
  // -----------------------------
  function convertSkills(skillsText) {
    return skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);
  }

  // -----------------------------
  // Function: Save Data to JSON Server
  // -----------------------------
  async function saveUser(user) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      return response.ok;
    } catch (error) {
      console.error("Error saving user:", error);
      return false;
    }
  }

  // -----------------------------
  // Form Submission
  // -----------------------------
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // Stop if invalid

    submitBtn.disabled = true;
    submitBtn.textContent = "Creating Account...";

    // Collect user data
    const user = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      bio: document.getElementById("bio").value.trim(),
      skillsToTeach: convertSkills(
        document.getElementById("skillsToTeach").value
      ),
      skillsToLearn: convertSkills(
        document.getElementById("skillsToLearn").value
      ),
      dateJoined: new Date().toISOString(),
    };

    // Save user to JSON Server
    const success = await saveUser(user);

    if (success) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      form.innerHTML = `
        <div style="text-align:center; color:green;">
          <h3>🎉 Account Created Successfully!</h3>
          <p>Redirecting to your profile...</p>
        </div>
      `;
      setTimeout(() => {
        window.location.href = "profile.html";
      }, 2500);
    } else {
      alert("Failed to create account. Please try again.");
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  });
});
