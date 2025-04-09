// DOM Elements
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const logoutBtn = document.getElementById("logout");
const userNameElement = document.getElementById("userName");

// Base URL for API
const API_BASE_URL = "http://localhost:3000/api";


// Check if user is logged in
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const currentPage = window.location.pathname.split('/').pop();
    const publicPages = ['login.html', 'register.html', 'forgot-password.html', 'reset-password.html'];

    // If on a public page and logged in, redirect to home
    if (token && publicPages.includes(currentPage)) {
        window.location.href = 'index.html';
        return;
    }

    // If token exists, validate it
    if (token) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/user`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Invalid token');
            
            const user = await response.json();
            if (userNameElement) userNameElement.textContent = user.firstName;
            
        } catch (error) {
            localStorage.removeItem('token');
            if (currentPage === 'index.html') {
                window.location.href = 'login.html';
            }
        }
    } 
    // If no token and trying to access protected page
    else if (currentPage === 'index.html') {
        window.location.href = 'login.html';
    }
});

// Registration form submission
if(registerForm){
    registerForm.addEventListener('submit', async(e) => {
        e.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if(password !== confirmPassword){
            alert('Passwords do not match!');
            return;
        }

        try{
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phone,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Registration failed');
            }   

        } catch(e){
            console.error('Error:', e);
            alert('An error occurred during registration');
        }
    });
}

// Login form submission
if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try{
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({email, password})
            });

            const data = await response.json();

            if(response.ok){
                localStorage.setItem('token', data.token);
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch(e){
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    });
}


// Forgot Password
if(forgotPasswordForm){
    forgotPasswordForm.addEventListener('submit', async(e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;

        try{
            const response = await fetch(`${API_BASE_URL}/password-reset/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({email})
            });
            const data = await response.json();

            if(response.ok){
                alert('Password reset link sent to your email!');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Failed to send reset link');
            }
        } catch(e){
            console.error('Error:', error);
            alert('An error occurred');
        }
    });
}

// Logout
if(logoutBtn){
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
}

async function fetchUserData() {
    const token = localStorage.getItem('token');

    try{
        const response = await fetch(
            `${API_BASE_URL}/auth/user`,
            {
                method: "GET",
                headers: {
                    "Authorization" : `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if(response.ok){
            if(userNameElement){
                userNameElement.textContent = data.firstName;
            }
        } else {
            localStorage.removeItem('token');
            window.localStorage.href = 'login.html';
        }
    } catch(e){
        console.error("Error: ",e);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}