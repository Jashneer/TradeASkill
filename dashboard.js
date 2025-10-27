// =================================================================
// Configuration and API Endpoint
// =================================================================
const API_URL = 'http://localhost:3000/skills'; 
let allSkills = []; 
let filteredSkills = []; 
let currentView = 'grid'; 
let currentSort = 'title-asc'; // Default sort (title ascending)

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // DOM Element References 
    // ----------------------------------------------------
    const skillsContainer = document.getElementById('skillsContainer');
    const searchInput = document.getElementById('skillSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const sortControl = document.getElementById('sortControl'); 
    const gridViewBtn = document.getElementById('gridView');
    const listViewBtn = document.getElementById('listView');
    const noResultsMessage = document.getElementById('noResultsMessage');
    
    if (!skillsContainer || !searchInput || !categoryFilter || !levelFilter || !sortControl) {
        console.error("Dashboard failed to initialize: Missing required HTML elements.");
        return; 
    }

    // ----------------------------------------------------
    // Core Functions 
    // ----------------------------------------------------

    async function fetchSkills() {
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            allSkills = data;
            // Sort the initial data
            filteredSkills = sortSkills([...allSkills]); 
            renderSkills(filteredSkills);

        } catch (error) {
            console.error('Error fetching skill data:', error);
            // Display error if server is not running
            skillsContainer.innerHTML = '<p style="text-align:center; color: #dc2626; padding: 20px;">Error loading skills. Please ensure the JSON server is running.</p>';
        }
    }

    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCategory = categoryFilter.value;
        const selectedLevel = levelFilter.value;

        // 1. Filtering
        let tempFilteredSkills = allSkills.filter(skill => {
            const matchesSearch = searchTerm === '' || 
                skill.title.toLowerCase().includes(searchTerm) ||
                skill.description.toLowerCase().includes(searchTerm) ||
                skill.teacher.name.toLowerCase().includes(searchTerm);

            const matchesCategory = selectedCategory === '' || skill.category === selectedCategory;
            const matchesLevel = selectedLevel === '' || skill.level === selectedLevel;

            return matchesSearch && matchesCategory && matchesLevel;
        });
        
        // 2. Sorting
        filteredSkills = sortSkills(tempFilteredSkills);

        renderSkills(filteredSkills);
    }
    
    function sortSkills(skills) {
        const [sortBy, sortOrder] = currentSort.split('-'); 

        return skills.sort((a, b) => {
            let comparison = 0;
            
            if (sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            } else if (sortBy === 'rating') {
                // Descending sort for rating (higher rating first)
                comparison = a.teacher.rating - b.teacher.rating; 
            } else if (sortBy === 'duration') {
                // NOTE: This assumes duration is a simple number or similar.
                // For your data ('10 Lessons'), direct subtraction works fine.
                // For more complex time formats, advanced parsing would be needed.
                
                // For 'Lesson' count, we can strip the text and parse the number:
                const parseLessonCount = (d) => parseInt(d.split(' ')[0]) || 0;
                comparison = parseLessonCount(a.duration) - parseLessonCount(b.duration);
            }

            // Apply ascending or descending order
            if (sortOrder === 'desc') {
                // If sorting by rating (desc) or title (desc)
                return comparison * -1;
            } else {
                // If sorting by duration (asc) or title (asc)
                return comparison;
            }
        });
    }

    function renderSkills(skills) {
        if (skills.length === 0) {
            skillsContainer.style.display = 'none'; 
            noResultsMessage.style.display = 'block';
            return; 
        }

        skillsContainer.style.display = 'grid'; // Ensure grid is visible
        noResultsMessage.style.display = 'none';
        
        skillsContainer.className = currentView === 'grid' ? 'skills-grid' : 'skills-list';
        
        skillsContainer.innerHTML = skills.map(createSkillCard).join(''); 

        addContactListeners();
    }

    function setView(view) {
        currentView = view;
        
        if (gridViewBtn) gridViewBtn.classList.toggle('active', view === 'grid');
        if (listViewBtn) listViewBtn.classList.toggle('active', view === 'list');
        
        renderSkills(filteredSkills);
    }
    
    // ----------------------------------------------------
    // Card HTML Generation
    // ----------------------------------------------------

    function createSkillCard(skill) {
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

    function addContactListeners() {
        const contactButtons = document.querySelectorAll('.contact-btn'); 
        const viewButtons = document.querySelectorAll('.btn-primary'); 

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

    function setupEventListeners() {
        const searchForm = searchInput.closest('.search-form');
        
        // FIX: Prevent form submission/page reload
        if (searchForm) {
             searchForm.addEventListener('submit', (e) => e.preventDefault());
        }
        
        // Event listeners for Filtering
        searchInput.addEventListener('input', applyFilters); // 'input' event for live search
        categoryFilter.addEventListener('change', applyFilters);
        levelFilter.addEventListener('change', applyFilters);
        
        // Event listener for Sorting
        sortControl.addEventListener('change', function() {
            currentSort = this.value; // Update the sort state
            applyFilters(); // Re-filter and re-sort the skills
        });
        
        if (gridViewBtn) gridViewBtn.addEventListener('click', () => setView('grid'));
        if (listViewBtn) listViewBtn.addEventListener('click', () => setView('list'));
    }

    function getInitials(name) {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    
    // Initial calls
    setupEventListeners();
    fetchSkills();
});