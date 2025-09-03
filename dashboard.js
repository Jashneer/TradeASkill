// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    const skillsContainer = document.getElementById('skillsContainer');
    const searchInput = document.getElementById('skillSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const noResultsMessage = document.getElementById('noResultsMessage');

    let currentView = 'grid';
    let filteredSkills = [...skillsData];

    // Initialize dashboard
    function initializeDashboard() {
        renderSkills(filteredSkills);
        setupEventListeners();
    }

    // Setup event listeners
    function setupEventListeners() {
        searchInput.addEventListener('input', handleSearch);
        categoryFilter.addEventListener('change', handleFilter);
        levelFilter.addEventListener('change', handleFilter);
        gridViewBtn.addEventListener('click', () => setView('grid'));
        listViewBtn.addEventListener('click', () => setView('list'));
    }

    // Handle search functionality
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        applyFilters(searchTerm);
    }

    // Handle filter changes
    function handleFilter() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        applyFilters(searchTerm);
    }

    // Apply search and filters
    function applyFilters(searchTerm = '') {
        const selectedCategory = categoryFilter.value;
        const selectedLevel = levelFilter.value;

        filteredSkills = skillsData.filter(function(skill) {
            // Search filter
            const matchesSearch = searchTerm === '' || 
                skill.title.toLowerCase().includes(searchTerm) ||
                skill.description.toLowerCase().includes(searchTerm) ||
                skill.teacher.name.toLowerCase().includes(searchTerm);

            // Category filter
            const matchesCategory = selectedCategory === '' || skill.category === selectedCategory;

            // Level filter
            const matchesLevel = selectedLevel === '' || skill.level === selectedLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });

        renderSkills(filteredSkills);
    }

    // Render skills based on current view
    function renderSkills(skills) {
        if (skills.length === 0) {
            skillsContainer.style.display = 'none';
            noResultsMessage.style.display = 'block';
            return;
        }

        skillsContainer.style.display = currentView === 'grid' ? 'grid' : 'flex';
        noResultsMessage.style.display = 'none';
        
        skillsContainer.className = currentView === 'grid' ? 'skills-grid' : 'skills-list';
        
        skillsContainer.innerHTML = skills.map(function(skill) {
            return createSkillCard(skill);
        }).join('');

        // Add event listeners to contact buttons
        addContactListeners();
    }

    // Create individual skill card HTML
    function createSkillCard(skill) {
        const listViewClass = currentView === 'list' ? 'list-view' : '';
        const teacherInitials = getInitials(skill.teacher.name);
        
        return `
            <article class="skill-card ${listViewClass}" data-skill-id="${skill.id}">
                <div class="skill-content">
                    <div class="skill-header">
                        <h3 class="skill-title">${skill.title}</h3>
                        <span class="skill-category ${skill.category}">${skill.category}</span>
                    </div>
                    
                    <p class="skill-description">${skill.description}</p>
                    
                    <div class="skill-meta">
                        <div class="skill-level">
                            <span class="level-indicator ${skill.level}"></span>
                            ${capitalizeFirst(skill.level)}
                        </div>
                        <div class="skill-duration">${skill.duration}</div>
                    </div>
                </div>

                <div class="skill-teacher">
                    <div class="teacher-avatar">${teacherInitials}</div>
                    <div class="teacher-info">
                        <h4>${skill.teacher.name}</h4>
                        <p>${skill.teacher.rating} ⭐ • ${skill.teacher.completedTrades} trades</p>
                    </div>
                </div>

                <div class="skill-actions">
                    <button class="btn btn-small btn-outline contact-btn" data-teacher-name="${skill.teacher.name}">
                        View Profile
                    </button>
                    <button class="btn btn-small btn-secondary" data-skill-title="${skill.title}">
                        Request Trade
                    </button>
                </div>
            </article>
        `;
    }

    // Add event listeners to contact buttons
    function addContactListeners() {
        const contactButtons = document.querySelectorAll('.contact-btn');
        const tradeButtons = document.querySelectorAll('[data-skill-title]');

        contactButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const teacherName = this.dataset.teacherName;
                alert(Viewing profile of ${teacherName}. This would open their detailed profile page.);
            });
        });

        tradeButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const skillTitle = this.dataset.skillTitle;
                alert(Requesting trade for "${skillTitle}". This would open a trade request form.);
            });
        });
    }

    // Set view mode (grid or list)
    function setView(view) {
        currentView = view;
        
        // Update button states
        gridViewBtn.classList.toggle('active', view === 'grid');
        listViewBtn.classList.toggle('active', view === 'list');
        
        // Re-render skills with new view
        renderSkills(filteredSkills);
    }

    // Utility function to get initials
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    // Utility function to capitalize first letter
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Check if user is logged in (for demo purposes)
    function checkUserStatus() {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const user = JSON.parse(currentUser);
            console.log('Welcome back,', user.firstName + '!');
        }
    }

    // Initialize
    checkUserStatus();
    initializeDashboard();
});