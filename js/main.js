"use strict";

/**
 * Author: Jaskirat Singh Bhogal
 * Student ID: 100935716
 * Date of Completion: 2025-02-25
 */

// IIFE - Immediately Invoked Functional Expression
(function () {
    // Data for volunteer opportunities
    const volunteerOpportunities = [
        {
            id: 1,
            title: "Community Garden Cleanup",
            description: "Help maintain and beautify our local community garden. No prior gardening experience required.",
            date: "2025-02-15",
            time: "09:00 AM - 12:00 PM",
            location: "Central Community Park"
        },
        {
            id: 2,
            title: "Senior Center Companionship",
            description: "Spend time with seniors, play games, and provide companionship.",
            date: "2025-02-22",
            time: "02:00 PM - 04:00 PM",
            location: "Sunset Senior Center"
        },
        {
            id: 3,
            title: "Food Bank Sorting",
            description: "Help sort and organize donations at our local food bank.",
            date: "2025-03-01",
            time: "10:00 AM - 01:00 PM",
            location: "City Food Bank Warehouse"
        }
    ];

    /**
     * Display the Home Page content.
     */
    function DisplayHomePage() {
        console.log("Calling DisplayHomePage...");

        const getInvolvedButton = document.getElementById("getInvolvedBtn");
        getInvolvedButton.addEventListener("click", function () {
            location.href = "opportunities.html";
        });
    }

    /**
     * Display the Opportunities Page content.
     */
    function DisplayOpportunitiesPage() {
        console.log("Calling DisplayOpportunitiesPage...");

        const opportunitiesContainer = document.getElementById("opportunitiesContainer");
        volunteerOpportunities.forEach((opportunity) => {
            const card = document.createElement("div");
            card.className = "card mb-3";
            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${opportunity.title}</h5>
                    <p class="card-text">${opportunity.description}</p>
                    <p class="card-text"><strong>Date:</strong> ${opportunity.date}</p>
                    <p class="card-text"><strong>Time:</strong> ${opportunity.time}</p>
                    <p class="card-text"><strong>Location:</strong> ${opportunity.location}</p>
                    <button class="btn btn-primary signUpBtn" data-id="${opportunity.id}">Sign Up</button>
                </div>
            `;
            opportunitiesContainer.appendChild(card);
        });

        const signUpButtons = document.querySelectorAll(".signUpBtn");
        signUpButtons.forEach((button) => {
            button.addEventListener("click", function (e) {
                const id = e.target.getAttribute("data-id");
                showSignUpModal(id);
            });
        });
    }

    /**
     * Show the sign-up modal for a specific opportunity.
     * @param {number} opportunityId - The ID of the opportunity.
     */
    function showSignUpModal(opportunityId) {
        const opportunity = volunteerOpportunities.find(op => op.id == opportunityId);
        const modalTitle = document.getElementById("modalTitle");
        modalTitle.textContent = `Sign Up for ${opportunity.title}`;

        const modal = new bootstrap.Modal(document.getElementById("signUpModal"));
        modal.show();
    }

    /**
     * Display the Events Page content.
     */
    function DisplayEventsPage() {
        console.log("Displaying Events Page...");

        const eventsContainer = document.getElementById("eventsContainer");
        const categoryFilter = document.getElementById("categoryFilter");
        const locationFilter = document.getElementById("locationFilter");
        const dateFilter = document.getElementById("dateFilter");

        /**
         * Render the filtered events.
         * @param {Array} filteredEvents - The filtered events to render.
         */
        function renderEvents(filteredEvents) {
            eventsContainer.innerHTML = '';
            filteredEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'col-md-4 mb-4';
                eventElement.innerHTML = `
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text"><strong>Date:</strong> ${event.date}</p>
                            <p class="card-text"><strong>Time:</strong> ${event.time}</p>
                            <p class="card-text"><strong>Category:</strong> ${event.category}</p>
                            <p class="card-text"><strong>Location:</strong> ${event.location}</p>
                            <p class="card-text">${event.description}</p>
                        </div>
                    </div>
                `;
                eventsContainer.appendChild(eventElement);
            });
        }

        /**
         * Filter the events based on selected filters.
         * @param {Array} events - The events to filter.
         */
        function filterEvents(events) {
            const category = categoryFilter.value;
            const location = locationFilter.value;
            const date = dateFilter.value;

            const filteredEvents = events.filter(event => {
                return (category === 'all' || event.category === category) &&
                       (location === 'all' || event.location === location) &&
                       (!date || event.date === date);
            });

            renderEvents(filteredEvents);
        }

        // Fetch events data from JSON file
        fetch('events.json')
            .then(response => response.json())
            .then(data => {
                // Initial render
                renderEvents(data);

                // Add event listeners for filters
                categoryFilter.addEventListener('change', () => filterEvents(data));
                locationFilter.addEventListener('change', () => filterEvents(data));
                dateFilter.addEventListener('change', () => filterEvents(data));
            })
            .catch(error => console.error('Error fetching events data:', error));
    }

    /**
     * Display the Gallery Page content.
     */
    function DisplayGalleryPage() {
        console.log("Displaying Gallery Page...");

        const galleryContainer = document.getElementById("galleryContainer");

        // Fetch image data from gallery.json
        fetch('gallery.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(images => {
                // Clear existing content
                galleryContainer.innerHTML = '';

                // Populate gallery with images
                images.forEach(image => {
                    const col = document.createElement('div');
                    col.className = 'col-lg-3 col-md-4 col-6 mb-4';
                    col.innerHTML = `
                        <a href="${image.fullImage}" data-lightbox="event-gallery" data-title="${image.title}">
                            <img src="${image.thumbnail}" class="img-fluid" alt="${image.title}">
                        </a>
                    `;
                    galleryContainer.appendChild(col);
                });
            })
            .catch(error => {
                console.error('Error fetching gallery images:', error);
                galleryContainer.innerHTML = '<p>An error occurred while loading the gallery. Please try again later.</p>';
            });
    }

    /**
     * Fetch and display community news.
     */
    function fetchCommunityNews() {
        const apiKey = 'pub_7189806c0121d2ef09fe10317d8f68d125e6c';
        const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=community&country=ca`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const newsContainer = document.getElementById('newsContainer');
                newsContainer.innerHTML = ''; // Clear any existing content

                if (data.results && data.results.length > 0) {
                    data.results.forEach(article => {
                        const newsCard = document.createElement('div');
                        newsCard.className = 'col-md-4 mb-4';
                        newsCard.innerHTML = `
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.description || 'No description available.'}</p>
                                    <a href="${article.link}" class="btn btn-primary" target="_blank">Read More</a>
                                </div>
                            </div>
                        `;
                        newsContainer.appendChild(newsCard);
                    });
                } else {
                    newsContainer.innerHTML = '<p>No community news available at the moment.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                const newsContainer = document.getElementById('newsContainer');
                newsContainer.innerHTML = '<p>An error occurred while loading news. Please try again later.</p>';
            });
    }

    // Call the function when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', fetchCommunityNews);

    /**
     * Display the Contact Page content.
     */
    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");

        // Form submission event handler
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Stop form from submitting

            // Collect input values
            const name = nameInput.value;
            const email = emailInput.value;
            const subject = subjectInput.value;
            const message = messageInput.value;

            // Validate inputs
            if (!name || !email || !subject || !message) {
                alert("Please fill out all the fields.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Invalid email address. Please enter a valid email.");
                return;
            }

            // If all validations pass, show confirmation modal
            showConfirmationModal();
        });

        /**
         * Show the confirmation modal.
         */
        function showConfirmationModal() {
            const modalHtml = `
                <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="confirmationModalLabel">Thank You!</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p>Your message has been submitted successfully. Redirecting to the Home Page in 5 seconds...</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Append modal to the body
            const modalContainer = document.createElement("div");
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer);

            // Show modal
            const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
            confirmationModal.show();

            // Redirect to Home Page after 5 seconds
            setTimeout(() => {
                confirmationModal.hide();
                window.location.href = "index.html";
            }, 5000);
        }
    }

    /**
     * Dynamically update the navbar.
     */
    function dynamicNavbar() {
        const navbar = document.querySelector('.navbar-nav');
        if (navbar) {
            const opportunitiesLink = navbar.querySelector('a[href="opportunities.html"]');
            if (opportunitiesLink) {
                opportunitiesLink.textContent = "Volunteer Now";
            }

            // Add Donate link
            const donateLink = document.createElement('li');
            donateLink.className = 'nav-item';
            donateLink.innerHTML = `
                <a class="nav-link" href="donate.html">Donate</a>
            `;
            navbar.appendChild(donateLink);
        }
    }

    /**
     * Handle the Back to Top button functionality.
     */
    function HandleBackToTop() {
        console.log("Initializing Back to Top functionality...");

        // Select the button
        const backToTopButton = document.getElementById("backToTop");

        if (!backToTopButton) {
            console.error("Back to Top button not found in the DOM!");
            return;
        }

        // Scroll event to show or hide the button
        window.addEventListener("scroll", function () {
            if (window.scrollY > 300) {
                console.log("Scroll position > 300. Showing Back to Top button.");
                backToTopButton.style.display = "block";
            } else {
                console.log("Scroll position <= 300. Hiding Back to Top button.");
                backToTopButton.style.display = "none";
            }
        });

        // Click event for smooth scrolling to the top
        backToTopButton.addEventListener("click", function () {
            console.log("Back to Top button clicked. Scrolling to the top.");
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    /**
     * Handle the search functionality.
     */
    function handleSearch() {
        const searchForm = document.getElementById("searchForm");
        const searchInput = document.getElementById("searchInput");
        const searchResults = document.getElementById("searchResults");

        if (!searchForm || !searchInput || !searchResults) {
            console.error("Search form, input, or results container not found in the DOM!");
            return;
        }

        searchForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const query = searchInput.value.toLowerCase();
            searchResults.innerHTML = '';

            // Filter and display volunteer opportunities
            const filteredOpportunities = volunteerOpportunities.filter(opportunity => 
                opportunity.title.toLowerCase().includes(query) || 
                opportunity.description.toLowerCase().includes(query)
            );
            if (filteredOpportunities.length > 0) {
                filteredOpportunities.forEach(opportunity => {
                    const resultItem = document.createElement("div");
                    resultItem.className = "card mb-3";
                    resultItem.innerHTML = `
                        <div class="card-body">
                            <h5 class="card-title">${opportunity.title}</h5>
                            <p class="card-text">${opportunity.description}</p>
                            <p class="card-text"><strong>Date:</strong> ${opportunity.date}</p>
                            <p class="card-text"><strong>Time:</strong> ${opportunity.time}</p>
                            <p class="card-text"><strong>Location:</strong> ${opportunity.location}</p>
                        </div>
                    `;
                    searchResults.appendChild(resultItem);
                });
            }

            // Fetch and filter events data
            fetch('events.json')
                .then(response => response.json())
                .then(events => {
                    const filteredEvents = events.filter(event => 
                        event.title.toLowerCase().includes(query) || 
                        event.description.toLowerCase().includes(query)
                    );
                    if (filteredEvents.length > 0) {
                        filteredEvents.forEach(event => {
                            const resultItem = document.createElement("div");
                            resultItem.className = "card mb-3";
                            resultItem.innerHTML = `
                                <div class="card-body">
                                    <h5 class="card-title">${event.title}</h5>
                                    <p class="card-text">${event.description}</p>
                                    <p class="card-text"><strong>Date:</strong> ${event.date}</p>
                                    <p class="card-text"><strong>Time:</strong> ${event.time}</p>
                                    <p class="card-text"><strong>Location:</strong> ${event.location}</p>
                                </div>
                            `;
                            searchResults.appendChild(resultItem);
                        });
                    }
                })
                .catch(error => console.error('Error fetching events data:', error));

            // Fetch and filter news data
            const apiKey = 'pub_7189806c0121d2ef09fe10317d8f68d125e6c';
            const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&q=${query}&country=ca`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    if (data.results && data.results.length > 0) {
                        data.results.forEach(article => {
                            const resultItem = document.createElement("div");
                            resultItem.className = "card mb-3";
                            resultItem.innerHTML = `
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.description || 'No description available.'}</p>
                                    <a href="${article.link}" class="btn btn-primary" target="_blank">Read More</a>
                                </div>
                            `;
                            searchResults.appendChild(resultItem);
                        });
                    }
                })
                .catch(error => console.error('Error fetching news data:', error));
        });
    }

    /**
     * Handle user authentication.
     */
    function handleUserAuthentication() {
        const welcomeMessage = document.getElementById("welcomeMessage");
        const loginLink = document.getElementById("loginLink");
        const logoutLink = document.getElementById("logoutLink");

        // Check if user is logged in
        const user = localStorage.getItem("user");
        if (user) {
            const userData = JSON.parse(user);
            welcomeMessage.textContent = `Welcome, ${userData.name}`;
            loginLink.style.display = "none";
            logoutLink.style.display = "block";
        } else {
            welcomeMessage.textContent = "";
            loginLink.style.display = "block";
            logoutLink.style.display = "none";
        }

        // Log out functionality
        logoutLink.addEventListener("click", function () {
            localStorage.removeItem("user");
            location.reload();
        });
    }

    /**
     * Handle the login form submission.
     */
    function handleLogin() {
        const loginForm = document.getElementById("loginForm");
        if (!loginForm) return;

        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;

            if (name && email) {
                const user = { name, email };
                localStorage.setItem("user", JSON.stringify(user));
                location.href = "index.html";
            } else {
                alert("Please fill in all fields.");
            }
        });
    }

    /**
     * Handle the contact form submission.
     */
    function handleContactForm() {
        const contactForm = document.getElementById("contactForm");
        if (!contactForm) return;

        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const subject = document.getElementById("subject").value;
            const message = document.getElementById("message").value;

            // Validate inputs
            if (!name || !email || !subject || !message) {
                alert("Please fill out all the fields.");
                return;
            }

            // Submit data using AJAX
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "submit_feedback.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    // Show confirmation modal with submitted details
                    document.getElementById("confirmName").textContent = name;
                    document.getElementById("confirmEmail").textContent = email;
                    document.getElementById("confirmSubject").textContent = subject;
                    document.getElementById("confirmMessage").textContent = message;

                    const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"));
                    confirmationModal.show();
                }
            };
            xhr.send(`name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&message=${encodeURIComponent(message)}`);
        });
    }

    /**
     * Highlight the active page in the navbar.
     */
    function highlightActivePage() {
        const navLinks = document.querySelectorAll('.nav-link');
        const currentPage = window.location.pathname.split('/').pop();

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Start the application based on the current page title.
     */
    function Start() {
        console.log("Starting App...");

        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Opportunities":
                DisplayOpportunitiesPage();
                break;
            case "Events":
                DisplayEventsPage();
                break;
            case "Gallery":
                DisplayGalleryPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
        }
    }

    window.addEventListener("load", Start);
    window.addEventListener("DOMContentLoaded", function () {
        HandleBackToTop();
        dynamicNavbar();
        handleSearch();
        handleUserAuthentication();
        handleLogin();
        handleContactForm();
        highlightActivePage();
    });
})();