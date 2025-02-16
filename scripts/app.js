"use strict";


// IIFE - Immediately Invoked Function Expression
(function () {

    async function DisplayWeather(){
        const apiKey ="ca2125e6be90c820fa2c4252731d88f7";
        const city = "Toronto";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        try{
            const response = await fetch(url);

            if(!response.ok){
                throw new Error("Failed to fetch weather data");
            }

            const data = await response.json();
            console.log("weather API response", data);

            const weatherDataElement = document.getElementById("weather-data");

            weatherDataElement.innerHTML = `<strong>City: </strong> ${data.name}<br>
                                            <strong>Temperature: </strong> ${data.main.temp}<br>
                                            <strong>Weather: </strong> ${data.weather[0].description}<br>`;

        }catch(error){
            console.log("Error fetching weather data", error);
            document.getElementById("weather-data").textContent = "unable to fetch weather data at this time";
        }
    }

    function AddContact(fullName, contactNumber, emailAddress) {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()) {
            let key = contact.fullName.substring(0, 1) + Date.now();
            localStorage.setItem(key, contact.serialize());
            return true;
        }
        return false;
    }

    function DisplayLoginPage() {
        console.log("[INFO] DisplayLoginPage() called...");

        const messageArea = document.getElementById("messageArea");
        const loginButton = document.getElementById("loginButton");
        const cancelButton = document.getElementById("cancelButton");
        const loginForm = document.getElementById("loginForm"); // Fixed case sensitivity

        // Initialize message area
        messageArea.style.display = "none";
        messageArea.classList.add("alert"); // Pre-add base alert class

        if (!loginButton || !cancelButton || !loginForm) {
            console.error("[ERROR] Required elements not found in the DOM");
            return;
        }

        // Login Handler
        loginButton.addEventListener("click", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("data/user.json");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const jsonData = await response.json();

                if (!Array.isArray(jsonData?.Users)) {
                    throw new Error("Invalid user data structure");
                }

                const authenticatedUser = jsonData.Users.find(user =>
                    user.Username === username &&
                    user.Password === password
                );

                if (authenticatedUser) {
                    sessionStorage.setItem("user", JSON.stringify({
                        DisplayName: authenticatedUser.DisplayName,
                        EmailAddress: authenticatedUser.EmailAddress,
                        Username: authenticatedUser.Username
                    }));

                    // Clear error state
                    messageArea.style.display = "none";
                    messageArea.classList.remove("alert-danger");

                    window.location.href = "contact-list.html";
                } else {
                    // Show error message
                    messageArea.textContent = "Invalid username or password. Please try again.";
                    messageArea.classList.add("alert-danger");
                    messageArea.style.display = "block";

                    document.getElementById("username").focus();
                    document.getElementById("username").select();
                }
            } catch (error) {
                console.error("[ERROR] Authentication failed:", error);
                messageArea.textContent = "Failed to connect to authentication service. Please try again later.";
                messageArea.classList.add("alert-danger");
                messageArea.style.display = "block";
            }
        });

        // Cancel Handler
        cancelButton.addEventListener("click", (event) => {
            event.preventDefault();
            loginForm.reset();
            window.location.href = "index.html";
        });
    }

    function DisplayHomePage() {
        console.log("Called DisplayHomePage() ... ");

        let AboutUsBtn = document.getElementById("AboutUsBtn");
        AboutUsBtn.addEventListener("click", ()=> {
            location.href = "about.html";
        });

        DisplayWeather();

        document.querySelector("main").insertAdjacentHTML(
            "beforeend",
            `<p id ="MainParagraph" class="mt-3">This is my first paragraph</p>`
        );

        document.body.insertAdjacentHTML(
            "beforeend",
            `<article class="container"> <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p></article>`
        );
    }

    const VALIDATION_RULES = {
        fullName:{
            regex:/^[A-Za-z\s]+$/,
            errorMessages: "Full name must contain only letters and spaces"
        },
        contactNumber:{
            regex:/^d{3}-\d{3}-\d{4}$/,
            errorMessages: "Contact Number must be in format ###-###-####"
        },
        emailAddress:{
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            errorMessages: "Invalid Email address format"
        }
    }

    function UpdateActiveNavLink(){
        console.log("[INFO] UpdateActiveNavLink() called...");
        const currentPage = document.title.trim();
        const navLinks = document.querySelectorAll("nav a");
        navLinks.forEach(link => {
            if(link.textContent.trim() === currentPage){
                link.classList.add("active");
            }else{
                link.classList.remove("active");
            }
        });
    }

    function LoadHeader() {
        console.log("[INFO] LoadHeader() called...");

        return fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.querySelector('header').innerHTML = data;
                UpdateActiveNavLink();
            })
            .catch(error => console.log("[ERROR] Unable to load header", error));
    }


    function DisplayEditPage() {
        console.log("Edit Contact Page");

        const params = new URLSearchParams(window.location.search);
        const contactKey = params.get("contact");

        const isAddOperation = !contactKey;

        const pageTitle = document.querySelector("h1");
        const submitButton = document.getElementById("editButton");

        if (isAddOperation) {
            pageTitle.textContent = "Add Contact";
            submitButton.textContent = "Add Contact";
            submitButton.classList.replace("btn-primary", "btn-success");
        } else {
            pageTitle.textContent = "Edit Contact";
            submitButton.textContent = "Update Contact";
            submitButton.classList.replace("btn-success", "btn-primary");

            // Retrieve and pre-populate form fields with the contact's details
            const contactData = localStorage.getItem(contactKey);
            if (contactData) {
                let contact = new core.Contact();
                contact.deserialize(contactData);
                document.getElementById("fullName").value = contact.fullName;
                document.getElementById("contactNumber").value = contact.number;
                document.getElementById("emailAddress").value = contact.email;
            }
        }
        submitButton.addEventListener("click", function(event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value;
            const contactNumber = document.getElementById("contactNumber").value;
            const emailAddress = document.getElementById("emailAddress").value;

            if (isAddOperation) {
                if (AddContact(fullName, contactNumber, emailAddress)) {
                    window.location.href = "contact-list.html";
                }
            } else {
                // Update the existing contact in localStorage
                let contact = new core.Contact(fullName, contactNumber, emailAddress);
                if (contact.serialize()) {
                    localStorage.setItem(contactKey, contact.serialize());
                    window.location.href = "contact-list.html";
                }
            }
        });

        const cancelButton = document.getElementById("cancelButton");
        if (cancelButton) {
            cancelButton.addEventListener("click", function(event) {
                event.preventDefault();
                window.location.href = "contact-list.html";
            });
        }
    }

    function DisplayContactListPage() {
        fetch("header.html")
            .then(response => response.text())
            .then(data => {
                document.body.insertAdjacentHTML("afterbegin", data);
                HighlightActiveLink();
            })
            .catch(error => console.error("Error loading header:", error));

        console.log("ContactList Page");

        const existingButton = document.getElementById("addContactButton");
        if (existingButton) {
            existingButton.addEventListener("click", () => {
                window.location.href = "edit.html#add";
            });
        } else {
            const addButton = document.createElement("button");
            addButton.id = "addContactButton";
            addButton.className = "btn btn-success mt-3";
            addButton.innerHTML = '<i class="fas fa-plus"></i> Add New Contact';
            addButton.addEventListener("click", () => {
                window.location.href = "edit.html#add";
            });
            document.querySelector("main").appendChild(addButton);
        }

        if (localStorage.length > 0) {
            let contactList = document.getElementById("contactList");
            let data = "";
            let keys = Object.keys(localStorage);

            keys.forEach((key, index) => {
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr>
                    <th scope="row" class="text-center">${index + 1}</th>
                    <td>${contact.fullName}</td>
                    <td>${contact.number}</td>
                    <td>${contact.email}</td>
                    <td>
                        <button class="btn btn-primary edit" data-key="${key}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-danger delete" data-key="${key}">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>`;
            });
            contactList.innerHTML = data;
        }
        document.querySelectorAll('.edit').forEach(button => {
            button.addEventListener('click', function() {
                const contactKey = this.getAttribute("data-key");
                // Navigate to edit.html passing the contact key as a query parameter
                window.location.href = `edit.html?contact=${contactKey}`;
            });
        });

        document.querySelectorAll('.delete').forEach(button => {
            button.addEventListener('click', function() {
                const contactKey = this.getAttribute("data-key");

                if (confirm("Are you sure you want to delete this contact?")) {
                    localStorage.removeItem(contactKey);
                    window.location.reload(); // Refresh to show updated list
                }
            });
        });
    }

    function CheckLogin(){
        console.log("[INFO] Checking user login status.")

        const loginNav = document.getElementsByClassName("login");

        if(!loginNav){
            console.warn("[WARNING] loginNav element not found! Skipping CheckLogin().")
            return;
        }

        const userSession = sessionStorage.getItem("user");
        if(userSession){
            loginNav.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
            loginNav.href = "#";

            loginNav.addEventListener("click", (event)=> {
                event.preventDefault();
                sessionStorage.removeItem("user");
                location.href = "login.html";
            });
        }
    }

    function TestFullName() {
        let messageArea = $("#messageArea");
        let fullNamePattern = /^([A-Z][a-z]{1,25})(\s[A-Z][a-z]{1,25})+$/;

        $("#fullName").on("blur", function() {
            let fullNameText = $(this).val();
            if (!fullNamePattern.test(fullNameText)) {
                $(this).focus().select();
                messageArea.addClass("alert alert-danger");
                messageArea.text("Please enter a valid first and last name (Firstname [Middle] Lastname).");
                messageArea.show();
            } else {
                messageArea.removeAttr("class");
                messageArea.hide();
            }
        });
    }


    // ========== OTHER PAGE FUNCTIONS ========== //
    function DisplayProductsPage() {
        console.log("Calling DisplayProductsPage...");
    }

    function DisplayServicesPage() {
        console.log("Calling DisplayServicesPage...");
    }

    function DisplayAboutPage() {
        console.log("Calling DisplayAboutPage...");
    }

    function DisplayContactPage() {
        console.log("Calling DisplayContactPage...");
        let sendButton = document.getElementById("SendButton");
        let subscribeCheckbox = document.getElementById("SubmitButton");

        sendButton.addEventListener("click", function (event) {
            event.preventDefault();
            if (subscribeCheckbox.checked) {
                let contact = new core.Contact(
                    fullName.value,
                    contactNumber.value,
                    emailAddress.value
                );
                if (contact.serialize()) {
                    let key = contact.fullName.substring(0, 1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }

    function loadHeader() {
        const headerElement = document.querySelector('header');

        // Check if header exists on the page
        if (!headerElement) {
            console.error('Header element not found in the document');
            return;
        }

        // Fetch header.html content
        fetch('header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {

                headerElement.innerHTML = html;


                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');

                if (navbarToggler && navbarCollapse) {
                    navbarToggler.addEventListener('click', () => {
                        navbarCollapse.classList.toggle('show');
                    });
                }
            })
            .catch(error => {
                console.error('Error loading header:', error);
                headerElement.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Error loading navigation header: ${error.message}
                </div>
            `;
            });
    }

    document.addEventListener('DOMContentLoaded', loadHeader);

    function HighlightActiveLink() {
        // Get the current page title
        const pageTitle = document.title;

        // Get all nav links in the navbar
        const navLinks = document.querySelectorAll("header nav a");

        // Loop through each nav link
        navLinks.forEach(link => {
            // Compare the link text with the page title
            if (link.textContent.trim() === pageTitle) {
                // Add the "active" class if there's a match
                link.classList.add("active");
            } else {
                // Remove the "active" class if there's no match
                link.classList.remove("active");
            }
        });
    }

    function DisplayLoginPage() {
        console.log("Calling DisplayLoginPage...");
    }

    function DisplayRegisterPage() {
        console.log("Calling DisplayRegisterPage...");
    }

    // ========== START FUNCTION ========== //
    function Start() {
        console.log("Starting App...");

        loadHeader();

        switch (document.title) {
            case "Home":
                DisplayHomePage();
                break;
            case "Products":
                DisplayProductsPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "About":
                DisplayAboutPage();
                break;
            case "Contact":
                DisplayContactPage();
                break;
            case "Contact List":
                DisplayContactListPage();
                break;
            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
        }
    }

    window.addEventListener("load", Start);
})();
