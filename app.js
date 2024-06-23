let users = JSON.parse(localStorage.getItem('users')) || {};
let votes = JSON.parse(localStorage.getItem('votes')) || { 'Option 1': 0, 'Option 2': 0, 'Option 3': 0 };
let votersList = JSON.parse(localStorage.getItem('votersList')) || [];
let currentUser = localStorage.getItem('currentUser');

document.addEventListener('DOMContentLoaded', () => {
    if (currentUser) {
        const page = window.location.pathname.split('/').pop();
        if (page === 'voting.html') showVoting();
        if (page === 'results.html') {
            showResults();
            showVotersList();
        }
        if (page === 'dashboard.html') showDashboard();
    }
});

function signup() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const aadharNumber = document.getElementById('aadharNumber').value;

    if (users[username]) {
        alert('Username already exists.');
        return;
    }

    users[username] = { password, aadharNumber };
    localStorage.setItem('users', JSON.stringify(users));
    alert('Signup successful.');
    loginAfterSignup(username);
}

function loginAfterSignup(username) {
    currentUser = username;
    localStorage.setItem('currentUser', currentUser);
    window.location.href = 'voting.html';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', currentUser);
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid username or password.');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function vote(option) {
    if (votes[option] !== undefined) {
        votes[option]++;
        votersList.push(currentUser);
        localStorage.setItem('votes', JSON.stringify(votes));
        localStorage.setItem('votersList', JSON.stringify(votersList));
        document.querySelectorAll('.vote-button').forEach(button => {
            button.style.backgroundColor = '#007bff';
        });
        document.getElementById(option).style.backgroundColor = '#ffc107';
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 500);
    }
}

function showVoting() {
    showResults();
    showVotersList();
}

function showResults() {
    const resultsDiv = document.getElementById('resultsDisplay');
    if (resultsDiv) {
        resultsDiv.innerHTML = `
            <p>Option 1: ${votes['Option 1']}</p>
            <p>Option 2: ${votes['Option 2']}</p>
            <p>Option 3: ${votes['Option 3']}</p>
        `;
    }
}

function showVotersList() {
    const votersDiv = document.getElementById('votersList');
    if (votersDiv) {
        votersDiv.innerHTML = votersList.map((voter, index) => `<p>${index + 1}. ${voter}</p>`).join('');
    }
}

function showDashboard() {
    document.getElementById('usernameDisplay').innerText = currentUser;
    drawVoteChart();
}

function drawVoteChart() {
    const ctx = document.getElementById('voteChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Option 1', 'Option 2', 'Option 3'],
            datasets: [{
                label: 'Votes',
                data: [votes['Option 1'], votes['Option 2'], votes['Option 3']],
                backgroundColor: ['#007bff', '#ffc107', '#28a745'],
                borderColor: ['#0056b3', '#e0a800', '#1e7e34'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
