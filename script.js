// Star background generation
function createStars() {
    const container = document.getElementById('stars-container');
    if (!container) return;
    
    const starCount = 200;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 2 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDuration = Math.random() * 3 + 2 + 's';
        star.style.opacity = Math.random();
        container.appendChild(star);
    }
}

// Navigation handling
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            
            // Update active button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide sections
            sections.forEach(section => {
                if (section.id === sectionId) {
                    section.classList.remove('hidden');
                    section.classList.add('active');
                } else {
                    section.classList.add('hidden');
                    section.classList.remove('active');
                }
            });
            
            // Initialize quiz if quiz section is shown
            if (sectionId === 'quiz') {
                initQuiz();
            }
            
            // Initialize study materials if materials section is shown
            if (sectionId === 'materials') {
                initStudyMaterialsPage();
                updateCourseStatus();
            }
        });
    });
}

let currentQuiz = 0;
let score = 0;
let answeredQuestions = new Set();

// Quiz data
const quizData = [
    {
        question: "რა არის მზის სისტემის ყველაზე დიდი პლანეტა?",
        options: ["სატურნი", "იუპიტერი", "ურანი", "ნეპტუნი"],
        correct: 1
    },
    {
        question: "რამდენი ბუნებრივი თანამგზავრი ჰყავს დედამიწას?",
        options: ["არცერთი", "ერთი", "ორი", "სამი"],
        correct: 1
    },
    {
        question: "რომელი გალაქტიკის ნაწილია მზის სისტემა?",
        options: ["ანდრომედას გალაქტიკა", "ირმის ნახტომი", "სამკუთხედი გალაქტიკა", "მაგელანის ღრუბელი"],
        correct: 1
    },
    {
        question: "რა მანძილზეა მზე დედამიწიდან?",
        options: ["50 მილიონი კმ", "150 მილიონი კმ", "250 მილიონი კმ", "350 მილიონი კმ"],
        correct: 1
    },
    {
        question: "რომელია მზესთან ყველაზე ახლოს მდებარე პლანეტა?",
        options: ["ვენერა", "მარსი", "მერკური", "დედამიწა"],
        correct: 2
    }
];

function initQuiz() {
    currentQuiz = 0;
    score = 0;
    answeredQuestions.clear();
    
    // Recreate the quiz container structure
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    quizContainer.innerHTML = `
        <div id="quiz-progress" class="mb-6">
            <div class="h-2 bg-blue-900 rounded-full">
                <div id="progress-bar" class="h-full bg-blue-500 rounded-full transition-all duration-300" style="width: 0%"></div>
            </div>
            <div class="text-right text-sm text-gray-400 mt-2">
                კითხვა <span id="current-question">1</span>/<span id="total-questions">5</span>
            </div>
        </div>

        <div id="question-container" class="mb-8 fade-in"></div>
        <div id="options-container" class="space-y-4"></div>
        <div id="feedback-container" class="mt-6 p-4 rounded-lg hidden"></div>

        <div class="mt-6 flex justify-between">
            <button id="prev-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed hidden">
                წინა
            </button>
            <button id="next-btn" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                შემდეგი
            </button>
        </div>
    `;
    
    loadQuiz();
}

function loadQuiz() {
    const questionContainer = document.getElementById('question-container');
    const optionsContainer = document.getElementById('options-container');
    const currentQuestionSpan = document.getElementById('current-question');
    const totalQuestionsSpan = document.getElementById('total-questions');
    const progressBar = document.getElementById('progress-bar');
    const feedbackContainer = document.getElementById('feedback-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (!questionContainer || !optionsContainer) return;
    
    feedbackContainer.classList.add('hidden');
    feedbackContainer.innerHTML = '';
    
    const currentQuizData = quizData[currentQuiz];
    questionContainer.innerHTML = `<h2 class="text-xl font-bold">${currentQuizData.question}</h2>`;
    optionsContainer.innerHTML = '';
    
    currentQuestionSpan.textContent = currentQuiz + 1;
    totalQuestionsSpan.textContent = quizData.length;
    progressBar.style.width = `${((currentQuiz + 1) / quizData.length) * 100}%`;
    
    currentQuizData.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'quiz-option w-full text-left p-4 rounded-lg bg-blue-900/40 hover:bg-blue-800/60 transition border border-blue-700';
        button.innerHTML = option;
        
        if (answeredQuestions.has(currentQuiz)) {
            button.disabled = true;
            if (index === currentQuizData.correct) {
                button.classList.add('correct-answer');
            }
        } else {
            button.addEventListener('click', () => selectAnswer(index));
        }
        optionsContainer.appendChild(button);
    });
    
    updateNavigationButtons();
}

function selectAnswer(index) {
    if (answeredQuestions.has(currentQuiz)) return;
    
    const feedback = document.getElementById('feedback-container');
    const options = document.querySelectorAll('.quiz-option');
    const currentQuizData = quizData[currentQuiz];
    
    answeredQuestions.add(currentQuiz);
    options.forEach(option => option.disabled = true);
    
    if (index === currentQuizData.correct) {
        options[index].classList.add('correct-answer');
        feedback.innerHTML = `
            <div class="bg-green-900/40 border border-green-600 rounded-lg p-4">
                <p class="text-green-400">სწორია! 🎉</p>
            </div>
        `;
        score++;
    } else {
        options[index].classList.add('wrong-answer');
        options[currentQuizData.correct].classList.add('correct-answer');
        feedback.innerHTML = `
            <div class="bg-red-900/40 border border-red-600 rounded-lg p-4">
                <p class="text-red-400">არასწორია! სწორი პასუხია: ${currentQuizData.options[currentQuizData.correct]}</p>
            </div>
        `;
    }
    
    feedback.classList.remove('hidden');
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn && nextBtn) {
        prevBtn.classList.toggle('hidden', currentQuiz === 0);
        
        if (currentQuiz === quizData.length - 1) {
            nextBtn.textContent = answeredQuestions.has(currentQuiz) ? 'დასრულება' : 'შემდეგი';
        } else {
            nextBtn.textContent = 'შემდეგი';
        }
        nextBtn.disabled = !answeredQuestions.has(currentQuiz);
    }
}

function showResults() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;
    
    const percentage = (score / quizData.length) * 100;
    quizContainer.innerHTML = `
        <div class="text-center">
            <h2 class="text-2xl font-bold mb-4">ქვიზი დასრულებულია!</h2>
            <p class="text-xl mb-4">თქვენი ქულაა: ${score}/${quizData.length} (${percentage}%)</p>
            <div class="mb-6">
                ${getResultMessage(percentage)}
            </div>
            <button id="restart-quiz-btn" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                თავიდან დაწყება
            </button>
        </div>
    `;
    
    // Add event listener for restart button
    const restartBtn = document.getElementById('restart-quiz-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            initQuiz();
        });
    }
}

function getResultMessage(percentage) {
    if (percentage === 100) {
        return '<p class="text-green-400">შესანიშნავია! თქვენ ბრწყინვალედ იცით ასტრონომია! 🌟</p>';
    } else if (percentage >= 80) {
        return '<p class="text-green-400">ძალიან კარგია! თქვენ კარგად იცით ასტრონომია! 🎉</p>';
    } else if (percentage >= 60) {
        return '<p class="text-yellow-400">კარგია! მცირე დახვეწა გჭირდებათ! 👍</p>';
    } else {
        return '<p class="text-red-400">გააგრძელეთ მეცადინეობა! 📚</p>';
    }
}

// Game functionality (stub, keep only if used)
let gameActive = false;
let gameScore = 0;
let gameLevel = 1;
function initGame() {
    if (!window.THREE) return; // Only run if THREE.js is loaded
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const spacecraft = new THREE.Mesh(geometry, material);
    scene.add(spacecraft);
    camera.position.z = 5;
    function animate() {
        requestAnimationFrame(animate);
        if (gameActive) {
            spacecraft.rotation.x += 0.01;
            spacecraft.rotation.y += 0.01;
        }
        renderer.render(scene, camera);
    }
    animate();
    document.getElementById('start-game').addEventListener('click', () => {
        gameActive = true;
        document.getElementById('mission-info').classList.remove('hidden');
        document.getElementById('mission-description').textContent = `მისია ${gameLevel}: შეაგროვე ${gameLevel * 10} ვარსკვლავი`;
    });
}

// Mobile navigation
function initMobileNavigation() {
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const mobileNavItems = document.querySelector('.mobile-nav-items');
    
    if (mobileMenuButton && mobileNavItems) {
        mobileMenuButton.addEventListener('click', () => {
            mobileNavItems.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav') && mobileNavItems.classList.contains('active')) {
                mobileNavItems.classList.remove('active');
            }
        });
    }
}

// Course modal functionality
const courseInfo = {
    'შესავალი ასტრონომიაში': {
        description: 'ასტრონომია არის მეცნიერება, რომელიც სწავლობს ციურ სხეულებს, მათ შორის ვარსკვლავებს, პლანეტებს, კომეტებს და გალაქტიკებს. ამ კურსში თქვენ შეისწავლით:',
        topics: [
            'მზის სისტემის აგებულება',
            'ვარსკვლავთა ტიპები და ევოლუცია',
            'გალაქტიკების კლასიფიკაცია',
            'კოსმოლოგიის საფუძვლები'
        ],
        duration: '12 კვირა',
        difficulty: 'საწყისი დონე'
    },
    'ეგზოპლანეტები': {
        description: 'ეგზოპლანეტები არის პლანეტები, რომლებიც მოძრაობენ სხვა ვარსკვლავების გარშემო. ამ კურსში განვიხილავთ:',
        topics: [
            'ეგზოპლანეტების აღმოჩენის მეთოდები',
            'ჰაბიტაბელური ზონები',
            'ცნობილი ეგზოპლანეტური სისტემები',
            'სიცოცხლის შესაძლებლობა სხვა პლანეტებზე'
        ],
        duration: '8 კვირა',
        difficulty: 'საშუალო დონე'
    },
    'კოსმოსური მისიები': {
        description: 'კოსმოსური მისიები მოიცავს ადამიანის და რობოტულ მოგზაურობებს კოსმოსში. კურსში განხილული იქნება:',
        topics: [
            'კოსმოსური ხომალდების ტიპები',
            'ისტორიული კოსმოსური მისიები',
            'თანამედროვე კოსმოსური პროგრამები',
            'მომავლის კოსმოსური მისიები'
        ],
        duration: '10 კვირა',
        difficulty: 'მაღალი დონე'
    }
};

// Create course modal
function createCourseModal() {
    const modalHTML = `
        <div id="courseModal" class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm hidden flex items-center justify-center p-4 z-50">
            <div class="bg-blue-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full relative">
                <button id="closeCourseModal" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div id="courseModalContent" class="space-y-6"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listener for close button
    const closeBtn = document.getElementById('closeCourseModal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCourseModal);
    }
    
    // Add event listener for clicking outside modal
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCourseModal();
            }
        });
    }
}

function openCourseModal(courseTitle, courseId = null) {
    const course = courseInfo[courseTitle];
    const modal = document.getElementById('courseModal');
    const modalContent = document.getElementById('courseModalContent');
    
    if (!modal || !modalContent || !course) return;
    
    // Check if user is already registered for this course
    const isRegistered = courseId ? registeredCourses.has(courseId) : false;
    
    modalContent.innerHTML = `
        <div class="border-b border-blue-500/30 pb-4">
            <h2 class="text-3xl font-bold text-white mb-2">${courseTitle}</h2>
            <div class="flex gap-4">
                <span class="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">${course.duration}</span>
                <span class="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">${course.difficulty}</span>
            </div>
        </div>
        <div class="py-4">
            <p class="text-gray-300 leading-relaxed">${course.description}</p>
        </div>
        <div class="space-y-4">
            <h4 class="font-bold text-xl text-white">კურსის თემები</h4>
            <ul class="space-y-3">
                ${course.topics.map(topic => `<li class="text-gray-300 pl-2">• ${topic}</li>`).join('')}
            </ul>
        </div>
        <div class="pt-6 flex justify-between items-center border-t border-blue-500/30 mt-6">
            <div class="text-blue-300 text-sm">
                <span class="block">დაიწყე სწავლა დღესვე</span>
                <span class="block mt-1">შემოგვიერთდი კოსმოსურ მოგზაურობაში</span>
            </div>
            ${isRegistered ? 
                `<button onclick="showStudyMaterialsPage()" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105">
                    სასწავლო მასალების ნახვა
                </button>` :
                `<button onclick="showRegistrationModal('${courseTitle}', '${courseId}')" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105">
                    კურსზე რეგისტრაცია
                </button>`
            }
        </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Gallery modal functionality
function initGalleryModal() {
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeModalBtn = document.getElementById('closeModal');
    
    if (!imageModal || !modalImage || !modalCaption || !closeModalBtn) return;
    
    // Add click listeners to gallery items
    document.querySelectorAll('#gallery-grid > div').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('p');
            if (img && caption) {
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                modalCaption.textContent = caption.textContent;
                imageModal.classList.remove('hidden');
            }
        });
    });
    
    // Close modal functionality
    closeModalBtn.addEventListener('click', () => {
        imageModal.classList.add('hidden');
    });
    
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.add('hidden');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !imageModal.classList.contains('hidden')) {
            imageModal.classList.add('hidden');
        }
    });
}

// User state management
let currentUser = null;
let registeredCourses = new Set();

// Initialize course buttons with registration functionality
function initCourseButtons() {
    document.querySelectorAll('.course-btn').forEach(button => {
        button.addEventListener('click', function() {
            const courseTitle = this.getAttribute('data-course-title');
            const courseId = this.getAttribute('data-course-id');
            
            if (courseTitle && courseId) {
                // Show course info modal first
                openCourseModal(courseTitle, courseId);
            }
        });
    });
}

// Show registration modal
function showRegistrationModal(courseTitle, courseId) {
    // First close the course modal
    closeCourseModal();
    
    const modal = document.getElementById('registrationModal');
    const courseTitleElement = document.getElementById('registration-course-title');
    
    if (modal && courseTitleElement) {
        courseTitleElement.textContent = `კურსზე რეგისტრაციისთვის: ${courseTitle}`;
        modal.setAttribute('data-course-id', courseId);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Close registration modal
function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Reset form
        document.getElementById('registrationForm').reset();
    }
}

// Close course modal
function closeCourseModal() {
    const modal = document.getElementById('courseModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Handle registration form submission
function handleRegistration(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const userData = {
        name: formData.get('userName'),
        email: formData.get('userEmail'),
        age: formData.get('userAge'),
        type: formData.get('userType'),
        registrationDate: new Date().toISOString()
    };
    
    // Store user data (in a real app, this would go to a database)
    currentUser = userData;
    localStorage.setItem('astrobrain_user', JSON.stringify(userData));
    
    // Get course ID from modal
    const modal = document.getElementById('registrationModal');
    const courseId = modal.getAttribute('data-course-id');
    
    // Register user for this course
    registeredCourses.add(courseId);
    localStorage.setItem('astrobrain_registered_courses', JSON.stringify(Array.from(registeredCourses)));
    
    // Close both modals immediately
    closeRegistrationModal();
    closeCourseModal();
    
    // Show success message
    showNotification('რეგისტრაცია წარმატებით დასრულდა! 🎉', 'success');
    
    // Redirect to study materials page after a short delay
    setTimeout(() => {
        showStudyMaterialsPage();
    }, 500);
}

// Show learning materials for a specific course
function showLearningMaterials(courseId) {
    // Hide all course materials first
    document.querySelectorAll('.course-materials').forEach(material => {
        material.classList.add('hidden');
    });
    
    // Show learning materials section
    const learningMaterialsSection = document.getElementById('learning-materials');
    if (learningMaterialsSection) {
        learningMaterialsSection.classList.remove('hidden');
        
        // Show specific course materials
        const courseMaterials = document.getElementById(`${courseId}-materials`);
        if (courseMaterials) {
            courseMaterials.classList.remove('hidden');
        }
        
        // Scroll to learning materials
        learningMaterialsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white z-50 transition-all duration-300 transform translate-x-full`;
    
    if (type === 'success') {
        notification.classList.add('bg-green-600');
    } else if (type === 'error') {
        notification.classList.add('bg-red-600');
    } else {
        notification.classList.add('bg-blue-600');
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize registration modal functionality
function initRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    const closeBtn = document.getElementById('closeRegistrationModal');
    const form = document.getElementById('registrationForm');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeRegistrationModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeRegistrationModal();
            }
        });
    }
    
    if (form) {
        form.addEventListener('submit', handleRegistration);
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeRegistrationModal();
        }
    });
}

// Course materials data
const courseMaterials = {
    'astronomy-basics': {
        title: 'შესავალი ასტრონომიაში',
        description: 'შეისწავლეთ კოსმოსის საფუძვლები და მზის სისტემის საიდუმლოებები',
        modules: [
            {
                title: '📖 მოდული 1: მზის სისტემა',
                description: 'შეისწავლეთ მზის სისტემის აგებულება და პლანეტების მახასიათებლები',
                content: `მზის სისტემა შედგება მზისგან და მის გარშემო მოძრავი ციური სხეულებისგან. მზის სისტემაში შედის 8 პლანეტა: მერკური, ვენერა, დედამიწა, მარსი, იუპიტერი, სატურნი, ურანი და ნეპტუნი.

**ძირითადი თემები:**
• მზის სტრუქტურა და ნათება
• პლანეტების კლასიფიკაცია (მშრალი და გაზური)
• ასტეროიდული ზოლი და კომეტები
• კეიპლერის კანონები

**საშუალო ხანგრძლივობა:** 45 წუთი
**სირთულე:** საწყისი დონე`,
                duration: '45 წუთი',
                difficulty: 'საწყისი',
                resources: ['ვიდეო ლექცია', 'ინტერაქტიული სიმულაცია', 'ვიქტორინა']
            },
            {
                title: '🌟 მოდული 2: ვარსკვლავები',
                description: 'ვარსკვლავთა ტიპები, ევოლუცია და ცხოვრების ციკლი',
                content: `ვარსკვლავები არის გიგანტური გაზის ბურთები, რომლებიც თერმობირთვული რეაქციების გამო ნათება. თითოეულ ვარსკვლავს აქვს თავისი ცხოვრების ციკლი.

**ძირითადი თემები:**
• ვარსკვლავთა კლასიფიკაცია (O, B, A, F, G, K, M)
• ჰერცშპრუნგ-რასელის დიაგრამა
• ვარსკვლავთა ევოლუცია
• სუპერნოვები და შავი ხვრელები

**საშუალო ხანგრძლივობა:** 60 წუთი
**სირთულე:** საშუალო დონე`,
                duration: '60 წუთი',
                difficulty: 'საშუალო',
                resources: ['ვიდეო ლექცია', '3D მოდელი', 'პრაქტიკული სავარჯიშოები']
            },
            {
                title: '🌌 მოდული 3: გალაქტიკები',
                description: 'გალაქტიკების ტიპები და სამყაროს სტრუქტურა',
                content: `გალაქტიკები არის ვარსკვლავების, გაზის და მტვრის უზარმაზარი კლასტერები. ჩვენი გალაქტიკა - ირმის ნახტომი - შეიცავს 100-400 მილიარდ ვარსკვლავს.

**ძირითადი თემები:**
• გალაქტიკების ტიპები (სპირალური, ელიფსური, უსწორმასწორო)
• ირმის ნახტომის სტრუქტურა
• გალაქტიკათშორისი ურთიერთქმედება
• კოსმოლოგიის საფუძვლები

**საშუალო ხანგრძლივობა:** 50 წუთი
**სირთულე:** საშუალო დონე`,
                duration: '50 წუთი',
                difficulty: 'საშუალო',
                resources: ['ვიდეო ლექცია', 'ვირტუალური ტური', 'ფინალური ტესტი']
            }
        ]
    },
    'exoplanets': {
        title: 'ეგზოპლანეტები',
        description: 'აღმოაჩინეთ უცხო სამყაროები და სიცოცხლის ძიება',
        modules: [
            {
                title: '🔍 მოდული 1: აღმოჩენის მეთოდები',
                description: 'როგორ ვიპოვოთ პლანეტები სხვა ვარსკვლავების გარშემო',
                content: `ეგზოპლანეტების აღმოსაჩენად გამოიყენება რამდენიმე მეთოდი. ყველაზე წარმატებულია ტრანზიტის მეთოდი, რომელიც იყენებს პლანეტის მიერ ვარსკვლავის სინათლის დაბლოკვას.

**ძირითადი მეთოდები:**
• ტრანზიტის მეთოდი (Kepler მისია)
• რადიალური სიჩქარის მეთოდი
• მიკროლინზირება
• პირდაპირი დაკვირვება

**საშუალო ხანგრძლივობა:** 55 წუთი
**სირთულე:** საშუალო დონე`,
                duration: '55 წუთი',
                difficulty: 'საშუალო',
                resources: ['ვიდეო ლექცია', 'სიმულაცია', 'ინტერაქტიული სავარჯიშოები']
            },
            {
                title: '🌍 მოდული 2: ჰაბიტაბელური ზონები',
                description: 'სად შეიძლება არსებობდეს სიცოცხლე',
                content: `ჰაბიტაბელური ზონა არის ტერიტორია ვარსკვლავის გარშემო, სადაც პლანეტაზე შეიძლება არსებობდეს თხევადი წყალი. ეს არის სიცოცხლის არსებობის ერთ-ერთი მთავარი პირობა.

**ძირითადი კრიტერიუმები:**
• ვარსკვლავიდან მანძილი
• პლანეტის ზომა და მასა
• ატმოსფეროს შემადგენლობა
• მაგნიტური ველი

**საშუალო ხანგრძლივობა:** 40 წუთი
**სირთულე:** საწყისი დონე`,
                duration: '40 წუთი',
                difficulty: 'საწყისი',
                resources: ['ვიდეო ლექცია', 'ინტერაქტიული რუკა', 'პრაქტიკული სავარჯიშოები']
            },
            {
                title: '👽 მოდული 3: სიცოცხლის ძიება',
                description: 'როგორ ვეძებოთ სიცოცხლის ნიშნები',
                content: `სიცოცხლის ძიება სხვა პლანეტებზე მოითხოვს სპეციალურ ინსტრუმენტებს და მეთოდებს. ჩვენ ვეძებთ ბიოსიგნატურებს - ქიმიურ ნიშნებს, რომლებიც მხოლოდ სიცოცხლის არსებობისას შეიძლება წარმოიქმნას.

**ძიების მეთოდები:**
• ატმოსფეროს ანალიზი
• ბიოსიგნატურების დეტექცია
• რადიო სიგნალების ძიება
• SETI პროგრამა

**საშუალო ხანგრძლივობა:** 65 წუთი
**სირთულე:** მაღალი დონე`,
                duration: '65 წუთი',
                difficulty: 'მაღალი',
                resources: ['ვიდეო ლექცია', 'სპეციალური ანალიზი', 'ფინალური პროექტი']
            }
        ]
    },
    'space-missions': {
        title: 'კოსმოსური მისიები',
        description: 'გაეცანით კოსმოსურ მოგზაურობებს და ტექნოლოგიებს',
        modules: [
            {
                title: '🚀 მოდული 1: კოსმოსური ხომალდები',
                description: 'ხომალდების ტიპები, ტექნოლოგიები და კონსტრუქცია',
                content: `კოსმოსური ხომალდები არის კომპლექსური მანქანები, რომლებიც შექმნილია კოსმოსში მოგზაურობისთვის. ისინი მოიცავს სხვადასხვა სისტემებს: ძრავებს, ნავიგაციას, კომუნიკაციას და სიცოცხლის მხარდაჭერას.

**ძირითადი კომპონენტები:**
• რაკეტული ძრავები (ქიმიური, იონური, ელექტრული)
• ნავიგაციის სისტემები
• კომუნიკაციის აღჭურვილობა
• სიცოცხლის მხარდაჭერის სისტემები

**საშუალო ხანგრძლივობა:** 50 წუთი
**სირთულე:** საშუალო დონე`,
                duration: '50 წუთი',
                difficulty: 'საშუალო',
                resources: ['ვიდეო ლექცია', '3D მოდელი', 'ვირტუალური ტური']
            },
            {
                title: '📡 მოდული 2: ისტორიული მისიები',
                description: 'ყველაზე მნიშვნელოვანი კოსმოსური მისიები',
                content: `კოსმოსური ეპოქა დაიწყო 1957 წელს სპუტნიკის გაშვებით. მას შემდეგ ჩვენ ვნახეთ მრავალი ისტორიული მომენტი: პირველი ადამიანი კოსმოსში, მთვარეზე პირველი ნაბიჯები, მარსზე პირველი როვერები.

**მთავარი მისიები:**
• სპუტნიკი (1957) - პირველი ხელოვნური თანამგზავრი
• ვოსტოკი (1961) - გაგარინი კოსმოსში
• აპოლო 11 (1969) - მთვარეზე პირველი ადამიანები
• ვოიაჯერები (1977) - მზის სისტემის საზღვრებს მიღმა

**საშუალო ხანგრძლივობა:** 70 წუთი
**სირთულე:** საწყისი დონე`,
                duration: '70 წუთი',
                difficulty: 'საწყისი',
                resources: ['ვიდეო ლექცია', 'ისტორიული ფოტოები', 'ინტერაქტიული რუკა']
            },
            {
                title: '🔮 მოდული 3: მომავლის მისიები',
                description: 'რა გველის კოსმოსური მოგზაურობების მომავალი',
                content: `მომავალში ჩვენ ველოდებით მარსზე კოლონიების შექმნას, მთვარეზე მუდმივი ბაზების აშენებას და ღრმა კოსმოსში მისიების გაშვებას. ახალი ტექნოლოგიები, როგორიცაა იონური ძრავები და მზის იალქნები, გახდის შესაძლებელ უფრო შორეულ მოგზაურობებს.

**მომავლის გეგმები:**
• მარსზე კოლონიები (2030-2040)
• მთვარეზე მუდმივი ბაზები
• ეგზოპლანეტების ძიება
• ვარსკვლავთშორისი მისიები

**საშუალო ხანგრძლივობა:** 45 წუთი
**სირთულე:** საშუალო დონე`,
                duration: '45 წუთი',
                difficulty: 'საშუალო',
                resources: ['ვიდეო ლექცია', 'ფუტურისტული კონცეფციები', 'ფინალური პროექტი']
            }
        ]
    }
};

// Show course materials with detailed content
function showCourseMaterials(courseId) {
    const course = courseMaterials[courseId];
    if (!course) return;

    // Hide course selection
    document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3').classList.add('hidden');
    
    // Show materials content
    const materialsContent = document.getElementById('materials-content');
    if (materialsContent) {
        materialsContent.classList.remove('hidden');
    }

    // Update title and description
    const titleElement = document.getElementById('materials-course-title');
    const descriptionElement = document.getElementById('materials-course-description');
    if (titleElement) titleElement.textContent = course.title;
    if (descriptionElement) descriptionElement.textContent = course.description;

    // Generate modules HTML
    const modulesContainer = document.getElementById('materials-modules');
    if (modulesContainer) {
        modulesContainer.innerHTML = course.modules.map((module, index) => `
            <div class="bg-blue-900/20 backdrop-blur-lg rounded-xl p-6 border border-blue-800 hover:bg-blue-800/30 transition cursor-pointer" onclick="readModule('${courseId}', ${index})">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-white">${module.title}</h3>
                    <div class="flex gap-2">
                        <span class="bg-blue-600/20 text-blue-300 px-2 py-1 rounded-full text-xs">${module.duration}</span>
                        <span class="bg-green-600/20 text-green-300 px-2 py-1 rounded-full text-xs">${module.difficulty}</span>
                    </div>
                </div>
                <p class="text-gray-300 mb-4">${module.description}</p>
                <div class="flex flex-wrap gap-2 mb-4">
                    ${module.resources.map(resource => `
                        <span class="bg-blue-800/30 text-blue-200 px-2 py-1 rounded text-xs">${resource}</span>
                    `).join('')}
                </div>
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 transform hover:scale-105">
                    მოდულის ნახვა →
                </button>
            </div>
        `).join('');
    }
}

// Read specific module content
function readModule(courseId, moduleIndex) {
    const course = courseMaterials[courseId];
    if (!course || !course.modules[moduleIndex]) return;

    const module = course.modules[moduleIndex];
    
    // Create modal for module content
    const modalHTML = `
        <div id="moduleModal" class="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div class="bg-blue-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                <button onclick="closeModuleModal()" class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div class="space-y-6">
                    <div class="border-b border-blue-500/30 pb-4">
                        <h2 class="text-3xl font-bold text-white mb-2">${module.title}</h2>
                        <div class="flex gap-4">
                            <span class="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">${module.duration}</span>
                            <span class="bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-sm">${module.difficulty}</span>
                        </div>
                    </div>
                    
                    <div class="prose prose-invert max-w-none">
                        <div class="text-gray-300 leading-relaxed whitespace-pre-line">${module.content}</div>
                    </div>
                    
                    <div class="border-t border-blue-500/30 pt-4">
                        <h4 class="font-bold text-xl text-white mb-3">შესაძლო რესურსები</h4>
                        <div class="flex flex-wrap gap-2">
                            ${module.resources.map(resource => `
                                <span class="bg-blue-800/30 text-blue-200 px-3 py-2 rounded-lg">${resource}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-center pt-4">
                        <button onclick="closeModuleModal()" class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-all duration-200">
                            დახურვა
                        </button>
                        <button onclick="markModuleComplete('${courseId}', ${moduleIndex})" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105">
                            ✅ მოდული დასრულებულია
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('moduleModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close module modal
function closeModuleModal() {
    const modal = document.getElementById('moduleModal');
    if (modal) {
        modal.remove();
    }
}

// Mark module as complete
function markModuleComplete(courseId, moduleIndex) {
    showNotification(`🎉 მოდული წარმატებით დასრულდა!`, 'success');
    closeModuleModal();
    
    // Here you could save progress to localStorage
    const progressKey = `course_progress_${courseId}`;
    let progress = JSON.parse(localStorage.getItem(progressKey) || '[]');
    if (!progress.includes(moduleIndex)) {
        progress.push(moduleIndex);
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }
}

// Update course status display
function updateCourseStatus() {
    const statusElements = {
        'astronomy-basics': document.getElementById('astronomy-status'),
        'exoplanets': document.getElementById('exoplanets-status'),
        'space-missions': document.getElementById('missions-status')
    };

    Object.keys(statusElements).forEach(courseId => {
        const element = statusElements[courseId];
        if (element) {
            if (registeredCourses.has(courseId)) {
                element.textContent = '✅ ხელმისაწვდომია';
                element.className = 'text-sm text-green-400';
            } else {
                element.textContent = '🔒 რეგისტრაცია საჭიროა';
                element.className = 'text-sm text-yellow-400';
            }
        }
    });
}

// Show study materials page
function showStudyMaterialsPage() {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('active');
    });

    // Show materials section
    const materialsSection = document.getElementById('materials');
    if (materialsSection) {
        materialsSection.classList.remove('hidden');
        materialsSection.classList.add('active');
    }

    // Update course status
    updateCourseStatus();
}

// Load user data and update navigation
function loadUserData() {
    const userData = localStorage.getItem('astrobrain_user');
    const registeredCoursesData = localStorage.getItem('astrobrain_registered_courses');
    
    if (userData) {
        currentUser = JSON.parse(userData);
    }
    
    if (registeredCoursesData) {
        registeredCourses = new Set(JSON.parse(registeredCoursesData));
    }
}

// Initialize study materials page
function initStudyMaterialsPage() {
    // Course card click handlers
    document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course');
            if (registeredCourses.has(courseId)) {
                showCourseMaterials(courseId);
            } else {
                showNotification('ამ კურსისთვის რეგისტრაცია საჭიროა!', 'error');
            }
        });
    });

    // Back to courses button
    const backButton = document.getElementById('back-to-courses');
    if (backButton) {
        backButton.addEventListener('click', function() {
            document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3').classList.remove('hidden');
            document.getElementById('materials-content').classList.add('hidden');
        });
    }
    

}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    createStars();
    createCourseModal();
    initNavigation();
    initMobileNavigation();
    initGalleryModal();
    initCourseButtons();
    initRegistrationModal();
    initStudyMaterialsPage();
    loadUserData();
    
    // Set up quiz navigation
    document.addEventListener('click', (e) => {
        if (e.target.id === 'next-btn') {
            if (currentQuiz === quizData.length - 1) {
                showResults();
            } else {
                currentQuiz++;
                loadQuiz();
            }
        } else if (e.target.id === 'prev-btn') {
            if (currentQuiz > 0) {
                currentQuiz--;
                loadQuiz();
            }
        }
    });
    
    // Set up escape key for course modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCourseModal();
        }
    });
    
    // Show home section by default
    const home = document.getElementById('home');
    if (home) {
        home.classList.remove('hidden');
        home.classList.add('active');
    }
    
    // Animate features and courses
    const featuresGrid = document.getElementById('features-grid');
    const coursesGrid = document.getElementById('courses-grid');
    
    if (featuresGrid && coursesGrid) {
        setTimeout(() => {
            featuresGrid.style.opacity = '1';
            featuresGrid.style.transform = 'translateY(0)';
            setTimeout(() => {
                coursesGrid.style.opacity = '1';
                coursesGrid.style.transform = 'translateY(0)';
            }, 200);
        }, 100);
    }
});


















