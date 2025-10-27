// =================================================================
// Configuration and API Endpoint (Variables / Data Types: String)
// =================================================================
// The API URL for fetching the skill data (JSON Server is the REST API)
const API_URL = 'http://localhost:3000/skills'; 
let allSkills = [];      // Array to store fetched JSON data (Data Types: Array)
let filteredSkills = []; // Filtered skill subset (Data Types: Array)
let currentView = 'grid'; // Default view mode (Data Types: String)

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // DOM Element References (DOM Manipulation)
    // ----------------------------------------------------
    // Variables: const for element references
    const skillsContainer = document.getElementById('skillsContainer');
    const searchInput = document.getElementById('skillSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    // JS Validation: Check for critical elements
    if (!skillsContainer || !searchInput || !categoryFilter || !levelFilter) {
        console.error("Dashboard failed to initialize: Missing required HTML elements.");
        return; // Control Flow: Exiting function early
    }

    // ----------------------------------------------------
    // Core Functions (Functions: async, arrow functions)
    // ----------------------------------------------------

    /**
     * Fetch skills data from the mock REST API. (Fetch API / Ajax with JSON Server)
     */
    async function fetchSkills() {
        try {
            // Fetch API call
            const response = await fetch(API_URL);
            
            // JS Validation / Control Flow: Check for HTTP errors
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Parse response body as JSON (JSON Objects)
            const data = await response.json();
            
            allSkills = data;
            filteredSkills = [...allSkills]; // Array: Spread operator
            renderSkills(filteredSkills);

        } catch (error) {
            console.error('Error fetching skill data:', error);
            // DOM Manipulation: Inject error message
            skillsContainer.innerHTML = '<p style="text-align:center; color: #dc2626; padding: 20px;">Error loading skills. Please ensure the JSON server is running.</p>';
        }
    }

    /**
     * Filters the skills based on user input.
     */
    function applyFilters() {
        // Variables: Get values
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedLevel = levelFilter.value;

        // Arrays: filter method
        filteredSkills = allSkills.filter(skill => {
            // Control Flows: Boolean logic for filtering
            const matchesSearch = searchTerm === '' || 
                skill.title.toLowerCase().includes(searchTerm) ||
                skill.description.toLowerCase().includes(searchTerm) ||
                skill.teacher.name.toLowerCase().includes(searchTerm);

            const matchesCategory = selectedCategory === '' || skill.category === selectedCategory;
            const matchesLevel = selectedLevel === '' || skill.level === selectedLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });

        renderSkills(filteredSkills);
    }

    /**
     * Renders skill cards.
     */
    function renderSkills(skills) {
        // Control Flows: If/else block
        if (skills.length === 0) {
            skillsContainer.style.display = 'none'; // DOM Manipulation: Style change
            noResultsMessage.style.display = 'block';
            return; // Control Flow: Exit
        }

        skillsContainer.style.display = ''; 
        noResultsMessage.style.display = 'none';
        
        // DOM Manipulation: Change the class to switch view styles
        skillsContainer.className = currentView === 'grid' ? 'skills-grid' : 'skills-list';
        
        // Arrays: map method and join() for efficient DOM rendering
        skillsContainer.innerHTML = skills.map(createSkillCard).join(''); // DOM Manipulation: innerHTML injection

        addContactListeners();
    }

    /**
     * Toggles the display mode.
     */
    function setView(view) {
        currentView = view;
        
        // DOM Manipulation: Class toggling
        if (gridViewBtn) gridViewBtn.classList.toggle('active', view === 'grid');
        if (listViewBtn) listViewBtn.classList.toggle('active', view === 'list');
        
        renderSkills(filteredSkills);
    }
    
    // ----------------------------------------------------
    // Card HTML Generation (JSON Objects)
    // ----------------------------------------------------

    /**
     * Creates the HTML string for a single skill card using template literals.
     */
    function createSkillCard(skill) {
        // Accessing nested JSON data (e.g., skill.teacher.name)
        const listViewClass = currentView === 'list' ? 'list-view' : '';
        const teacherInitials = getInitials(skill.teacher.name);
        
        return `
            <article class="skill-card ${listViewClass}" data-skill-id="${skill.id}">
                <div class="skill-content">
                    <div class="card-header">
                        <h3 class="skill-title">${skill.title}</h3>
                        <span class="tag ${skill.category}">${capitalizeFirst(skill.category)}</span>
                    </div>
                    
                    <p class="skill-description">${skill.description}</p>
                    
                    <div class="card-meta">
                        <span class="level ${skill.level}">${capitalizeFirst(skill.level)}</span>
                        <span>${skill.duration}</span>
                    </div>
                </div>

                <div class="instructor">
                    <div class="avatar">${teacherInitials}</div>
                    <div class="teacher-info">
                        <h4>${skill.teacher.name}</h4>
                        <p>${skill.teacher.rating} ⭐ • ${skill.teacher.completedTrades} trades</p>
                    </div>
                </div>

                <div class="card-actions">
                    <button class="btn-primary" data-skill-title="${skill.title}">
                        View
                    </button>
                    <button class="btn-outline contact-btn" data-teacher-name="${skill.teacher.name}">
                        Message
                    </button>
                </div>
            </article>
        `;
    }

    // ----------------------------------------------------
    // Event Listeners and Utilities
    // ----------------------------------------------------

    /**
     * Adds event listeners to dynamically created buttons. (DOM Manipulation)
     */
    function addContactListeners() {
        // DOM Manipulation: Selectors
        const contactButtons = document.querySelectorAll('.contact-btn'); 
        const viewButtons = document.querySelectorAll('.btn-primary'); 

        // Control Flow: forEach loop
        contactButtons.forEach(button => {
            button.addEventListener('click', function() {
                const teacherName = this.dataset.teacherName;
                alert(`Starting chat with ${teacherName}.`);
            });
        });

        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const skillTitle = this.dataset.skillTitle;
                alert(`Loading details for "${skillTitle}".`);
            });
        });
    }

    /**
     * Initializes all primary event listeners.
     */
    function setupEventListeners() {
        // DOM Manipulation: Event listeners for form control
        const searchForm = searchInput.closest('.search-form');
        if (searchForm) {
             searchForm.addEventListener('submit', (e) => e.preventDefault());
        }
        
        // Event listeners for Filtering (DOM Manipulation)
        searchInput.addEventListener('input', applyFilters); // 'input' event for live search
        categoryFilter.addEventListener('change', applyFilters);
        levelFilter.addEventListener('change', applyFilters);
        
        if (gridViewBtn) gridViewBtn.addEventListener('click', () => setView('grid'));
        if (listViewBtn) listViewBtn.addEventListener('click', () => setView('list'));
    }
    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    setupEventListeners();
    fetchSkills();

});