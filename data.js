// Sample data for skills (simulating backend data)
const skillsData = [
    {
        id: 1,
        title: 'JavaScript Programming',
        description: 'Learn modern JavaScript including ES6+, async/await, and DOM manipulation. Perfect for beginners looking to start web development.',
        category: 'technology',
        level: 'beginner',
        duration: '4-6 weeks',
        teacher: {
            name: 'Alex Johnson',
            rating: 4.9,
            completedTrades: 23,
            bio: 'Full-stack developer with 8 years experience'
        }
    },
    {
        id: 2,
        title: 'Spanish Conversation',
        description: 'Practice conversational Spanish with a native speaker. Focus on real-world scenarios and cultural context.',
        category: 'languages',
        level: 'intermediate',
        duration: '8-10 weeks',
        teacher: {
            name: 'Maria Rodriguez',
            rating: 4.8,
            completedTrades: 34,
            bio: 'Native Spanish speaker and certified language teacher'
        }
    },
    {
        id: 3,
        title: 'Digital Photography',
        description: 'Master the fundamentals of digital photography including composition, lighting, and post-processing techniques.',
        category: 'arts',
        level: 'beginner',
        duration: '6-8 weeks',
        teacher: {
            name: 'David Chen',
            rating: 4.7,
            completedTrades: 18,
            bio: 'Professional photographer specializing in portraits'
        }
    },
    {
        id: 4,
        title: 'Guitar Basics',
        description: 'Learn to play guitar from scratch. Covers basic chords, strumming patterns, and simple songs.',
        category: 'music',
        level: 'beginner',
        duration: '3-4 weeks',
        teacher: {
            name: 'Sarah Williams',
            rating: 4.9,
            completedTrades: 41,
            bio: 'Music teacher with 12 years of guitar experience'
        }
    },
    {
        id: 5,
        title: 'Python Data Analysis',
        description: 'Dive into data analysis using Python, pandas, and matplotlib. Learn to clean, analyze, and visualize data effectively.',
        category: 'technology',
        level: 'intermediate',
        duration: '6-8 weeks',
        teacher: {
            name: 'Dr. Emily Foster',
            rating: 4.8,
            completedTrades: 15,
            bio: 'Data scientist with PhD in Computer Science'
        }
    },
    {
        id: 6,
        title: 'Italian Cooking',
        description: 'Learn authentic Italian recipes and cooking techniques. From pasta to risotto, master the classics.',
        category: 'cooking',
        level: 'beginner',
        duration: '5-6 weeks',
        teacher: {
            name: 'Giuseppe Romano',
            rating: 4.9,
            completedTrades: 28,
            bio: 'Professional chef from Rome with 20 years experience'
        }
    },
    {
        id: 7,
        title: 'Watercolor Painting',
        description: 'Explore the beautiful world of watercolor painting. Learn basic techniques, color theory, and composition.',
        category: 'arts',
        level: 'beginner',
        duration: '4-5 weeks',
        teacher: {
            name: 'Jennifer Park',
            rating: 4.7,
            completedTrades: 22,
            bio: 'Fine arts graduate specializing in watercolor techniques'
        }
    },
    {
        id: 8,
        title: 'Business Strategy',
        description: 'Understand strategic planning, market analysis, and competitive positioning for growing businesses.',
        category: 'business',
        level: 'advanced',
        duration: '8-10 weeks',
        teacher: {
            name: 'Michael Thompson',
            rating: 4.8,
            completedTrades: 12,
            bio: 'MBA and former Fortune 500 strategy consultant'
        }
    },
    {
        id: 9,
        title: 'French Language Basics',
        description: 'Start your French journey with essential vocabulary, pronunciation, and basic grammar structures.',
        category: 'languages',
        level: 'beginner',
        duration: '6-8 weeks',
        teacher: {
            name: 'Claire Dubois',
            rating: 4.9,
            completedTrades: 31,
            bio: 'Native French speaker and certified language instructor'
        }
    },
    {
        id: 10,
        title: 'Yoga for Beginners',
        description: 'Learn fundamental yoga poses, breathing techniques, and mindfulness practices for physical and mental wellness.',
        category: 'sports',
        level: 'beginner',
        duration: '4-6 weeks',
        teacher: {
            name: 'Priya Sharma',
            rating: 4.8,
            completedTrades: 37,
            bio: 'Certified yoga instructor with 10 years of teaching experience'
        }
    },
    {
        id: 11,
        title: 'Advanced React Development',
        description: 'Deep dive into React hooks, context API, performance optimization, and modern development patterns.',
        category: 'technology',
        level: 'advanced',
        duration: '8-12 weeks',
        teacher: {
            name: 'Kevin Wu',
            rating: 4.9,
            completedTrades: 19,
            bio: 'Senior React developer at tech startup'
        }
    },
    {
        id: 12,
        title: 'Piano Fundamentals',
        description: 'Learn to read music, understand chord progressions, and play beautiful melodies on the piano.',
        category: 'music',
        level: 'beginner',
        duration: '6-8 weeks',
        teacher: {
            name: 'Anna Kozlov',
            rating: 4.8,
            completedTrades: 26,
            bio: 'Classically trained pianist and music theory expert'
        }
    }
];

// Sample user data (simulating logged-in user)
const currentUserData = {
    id: 'user123',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    bio: 'Passionate learner and teacher looking to expand my skillset while sharing my knowledge with others.',
    skillsToTeach: ['Web Design', 'Photography', 'Spanish'],
    skillsToLearn: ['Python', 'Guitar', 'Cooking'],
    dateJoined: '2025-01-01',
    completedTrades: 5,
    rating: 4.6,
    avatar: null
};

// Export data for other scripts to use
// if (typeof module !== 'undefined' && module.exports) {
    // module.exports = { skillsData, currentUserData };
// }

window.skillsData = skillsData;
window.currentUserData = currentUserData;