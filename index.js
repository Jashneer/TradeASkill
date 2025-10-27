document.addEventListener('DOMContentLoaded', () => {

    const menuToggleBtn = document.querySelector('.nav-toggle');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggleBtn && navLinksList) {
        menuToggleBtn.addEventListener('click', () => {
            navLinksList.classList.toggle('nav-links-active');
            
            menuToggleBtn.classList.toggle('nav-toggle-active');
        });
    }

    const learnMoreBtn = document.querySelector('.btn-secondary[href="#how-it-works"]');

    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', (event) => {
            event.preventDefault(); 
            
            const targetId = learnMoreBtn.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    async function loadFeatures() {
        const featuresGrid = document.querySelector('.features-grid');
        if (!featuresGrid) return; 

        const apiUrl = 'http://localhost:3000/features';

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const features = await response.json(); 

            featuresGrid.innerHTML = ''; 

            features.forEach(feature => {
                const featureElement = document.createElement('div');
                featureElement.className = 'feature'; 

                featureElement.innerHTML = `
                    <div class.feature-icon" role="img" aria-label="${feature.title} emoji">${feature.icon}</div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                `;

                featuresGrid.appendChild(featureElement);
            });

        } catch (error) {
            console.error("Could not fetch features:", error);

            featuresGrid.innerHTML = '<p style="color: red; text-align: center;">Error loading features. Please try again later.</p>';
        }
    }
    
    loadFeatures();

});