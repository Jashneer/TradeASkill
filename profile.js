document.addEventListener('DOMContentLoaded', function() {
    let currentUser = getCurrentUser();
    
    // DOM elements
    const userAvatar = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userBio = document.getElementById('userBio');
    const userRating = document.getElementById('userRating');
    const userTrades = document.getElementById('userTrades');
    const memberSince = document.getElementById('memberSince');
    const teachingSkillsContainer = document.getElementById('teachingSkills');
    const learningSkillsContainer = document.getElementById('learningSkills');
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editModal = document.getElementById('editModal');
    const closeModal = document.getElementById('closeModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editForm = document.getElementById('editProfileForm');

    // Initializes the profile page.
    function initializeProfile() {
        if (!currentUser) {
            // If no user is found in local storage, use the sample data as a fallback.
            currentUser = currentUserData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
        
        populateProfile();
        setupEventListeners();
    }

    // Gets the current user from local storage.
    function getCurrentUser() {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    }

    // Fills the profile page with user data.
    function populateProfile() {
        const initials = getInitials(currentUser.firstName + ' ' + currentUser.lastName);
        userAvatar.textContent = initials;
        userName.textContent = currentUser.firstName + ' ' + currentUser.lastName;
        userEmail.textContent = currentUser.email;
        userBio.textContent = currentUser.bio || 'No bio provided yet.';
        userRating.textContent = currentUser.rating || '4.6';
        userTrades.textContent = currentUser.completedTrades || '5';
        
        const joinDate = new Date(currentUser.dateJoined || '2025-01-01');
        memberSince.textContent = joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

        renderSkills();
    }

    // Renders both skill sections.
    function renderSkills() {
        renderSkillList(teachingSkillsContainer, currentUser.skillsToTeach, 'teaching');
        renderSkillList(learningSkillsContainer, currentUser.skillsToLearn, 'learning');
        addSkillRemoveListeners();
    }

    // Renders a single list of skills.
    function renderSkillList(container, skills, type) {
        if (skills && skills.length > 0) {
            container.innerHTML = skills.map(skill => createSkillTag(skill, type)).join('');
        } else {
            container.innerHTML = `<p class="empty-skills">No skills added yet.</p>`;
        }
    }

    // Creates the HTML for a single skill tag.
    function createSkillTag(skill, type) {
        return `
            <div class="skill-tag ${type}">
                <span class="skill-name">${skill}</span>
                <button class="skill-remove" data-skill="${skill}" data-type="${type}" aria-label="Remove skill">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        `;
    }

    // Sets up all event listeners for the page.
    function setupEventListeners() {
        editProfileBtn.addEventListener('click', openEditModal);
        closeModal.addEventListener('click', closeEditModal);
        cancelEdit.addEventListener('click', closeEditModal);
        editForm.addEventListener('submit', saveProfileChanges);
        
        document.getElementById('addTeachSkillBtn').addEventListener('click', () => addNewSkill('teaching'));
        document.getElementById('addLearnSkillBtn').addEventListener('click', () => addNewSkill('learning'));

        editModal.addEventListener('click', (e) => { if (e.target === editModal) closeEditModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && editModal.style.display === 'flex') closeEditModal(); });
    }

    // Opens the profile editing modal.
    function openEditModal() {
        document.getElementById('editFirstName').value = currentUser.firstName;
        document.getElementById('editLastName').value = currentUser.lastName;
        document.getElementById('editBio').value = currentUser.bio || '';
        editModal.style.display = 'flex';
    }

    // Closes the profile editing modal.
    function closeEditModal() {
        editModal.style.display = 'none';
    }

    // Saves changes from the edit profile form.
    function saveProfileChanges(e) {
        e.preventDefault();
        
        // Updates the user object with new values from the form.
        currentUser.firstName = document.getElementById('editFirstName').value.trim();
        currentUser.lastName = document.getElementById('editLastName').value.trim();
        currentUser.bio = document.getElementById('editBio').value.trim();
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        populateProfile();
        closeEditModal();
        showToast('Profile updated successfully!', 'success');
    }

    // Adds a new skill to the user's profile.
    function addNewSkill(type) {
        const skillName = prompt(`Enter a new skill you want to ${type === 'teaching' ? 'teach' : 'learn'}:`);
        
        if (skillName && skillName.trim() !== '') {
            const skillArray = type === 'teaching' ? 'skillsToTeach' : 'skillsToLearn';
            currentUser[skillArray].push(skillName.trim());
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            renderSkills();
            showToast(`"${skillName.trim()}" added to your skills!`, 'success');
        }
    }

    // Attaches event listeners to all skill removal buttons.
    function addSkillRemoveListeners() {
        document.querySelectorAll('.skill-remove').forEach(button => {
            button.addEventListener('click', function() {
                removeSkill(this.dataset.skill, this.dataset.type);
            });
        });
    }

    // Removes a skill from the user's profile.
    function removeSkill(skillName, type) {
        if (confirm(`Are you sure you want to remove "${skillName}"?`)) {
            const skillArray = type === 'teaching' ? 'skillsToTeach' : 'skillsToLearn';
            currentUser[skillArray] = currentUser[skillArray].filter(skill => skill !== skillName);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            renderSkills();
            showToast(`${skillName} removed successfully.`, 'success');
        }
    }

    // --- UTILITY FUNCTIONS ---
    function getInitials(name) { return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(); }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.className = `toast toast-${type}`;
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
    }

    if (!document.getElementById('toast-style')) {
        const style = document.createElement('style');
        style.id = 'toast-style';
        style.innerHTML = `
            .toast { position: fixed; top: 100px; right: 20px; padding: 16px 24px; border-radius: 8px; box-shadow: var(--shadow-lg); z-index: 3000; font-weight: 500; animation: slideInRight 0.3s ease; }
            .toast.toast-success { background-color: var(--success-color); color: white; }
            .toast.toast-error { background-color: var(--error-color); color: white; }
            @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        `;
        document.head.appendChild(style);
    }
    
    // Starts the page logic.
    initializeProfile();
});
