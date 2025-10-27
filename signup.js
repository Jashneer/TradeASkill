document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector(".signup-form");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Collect form values
    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const skillsToTeach = document.getElementById("skillsToTeach").value.trim();
    const skillsToLearn = document.getElementById("skillsToLearn").value.trim();
    const terms = document.getElementById("terms").checked;

    // -----------------------------
    // Step 1: Basic validation
    // -----------------------------
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      alert("Please fill all required fields.");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!terms) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }

    // -----------------------------
    // Step 2: Prepare user object
    // -----------------------------
    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password,
      bio,
      skillsToTeach: skillsToTeach
        ? skillsToTeach.split(",").map(skill => skill.trim())
        : [],
      skillsToLearn: skillsToLearn
        ? skillsToLearn.split(",").map(skill => skill.trim())
        : [],
      dateJoined: new Date().toLocaleDateString()
    };

    // -----------------------------
    // Step 3: Try saving to backend, else fallback to localStorage
    // -----------------------------
    try {
      let savedUser = null;

      try {
        // Try contacting backend (if available)
        const existingUsersResponse = await fetch("http://localhost:3000/users");
        if (!existingUsersResponse.ok) throw new Error("Backend not reachable");

        const existingUsers = await existingUsersResponse.json();
        const userExists = existingUsers.some(
          user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (userExists) {
          alert("This email is already registered. Please use another email.");
          return;
        }

        const response = await fetch("http://localhost:3000/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser)
        });

        if (!response.ok) throw new Error("Failed to save user data.");
        savedUser = await response.json();
      } catch (networkError) {
        console.warn("Backend not running — saving locally only.", networkError);
        // Fallback to local save if backend is unavailable
        savedUser = newUser;
      }

      // -----------------------------
      // Step 4: Save to localStorage
      // -----------------------------
      localStorage.setItem("currentUser", JSON.stringify(savedUser));
      localStorage.setItem("loggedInUser", savedUser.email);
      localStorage.setItem("loggedInUserId", savedUser.id);
      localStorage.setItem("isLoggedIn", "true");

      // -----------------------------
      // Step 5: Show success + redirect
      // -----------------------------
      signupForm.innerHTML = `
        <div style="text-align:center; padding:20px;">
          <h3 style="color:green;">🎉 Account Created Successfully!</h3>
          <p>Redirecting to your profile...</p>
        </div>
      `;

      setTimeout(() => {
        window.location.href = "profile.html";
      }, 2500);
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
});
