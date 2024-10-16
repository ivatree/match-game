document
    .getElementById('openReg')
    .addEventListener('click', showRegistrationForm);
document
    .getElementById('registrationForm')
    .addEventListener('submit', registerUser);
document.getElementById('logoutBtn').addEventListener('click', logoutUser);
document
    .getElementById('cancelButton')
    .addEventListener('click', hideRegistrationForm);
document.getElementById('modalClose').addEventListener('click', hideModal);
document.getElementById('userImg').addEventListener('click', showModal);
document.getElementById('startGameBtn').addEventListener('click', GamePage);
document.getElementById('modal').addEventListener('click', function (event) {
    if (event.target === this) {
        hideModal();
    }
});

function showRegistrationForm() {
    document.getElementById('registration').classList.remove('hidden');
    document.getElementById('openReg').classList.add('hidden');
}

function hideRegistrationForm() {
    document.getElementById('registration').classList.add('hidden');
    document.getElementById('openReg').classList.remove('hidden');
}

function registerUser(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const avatar = document.getElementById('UserIMG');

    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('email', email);

    if (firstName && lastName && email) {
        let avatarURL;

        if (avatar.files[0]) {
            avatarURL = URL.createObjectURL(avatar.files[0]);
        } else {
            avatarURL = '/picture/photo_5_2024-10-02_16-52-10.jpg';
        }

        const user = {
            firstName,
            lastName,
            email,
            avatar: avatarURL,
        };

        localStorage.setItem('user', JSON.stringify(user));
        displayDashboard(user);
        localStorage.setItem('isRegistered', 'true');
        updateUI();
        hideRegistrationForm();
    } else {
        alert('Пожалуйста, заполните все поля!');
    }
}

function displayDashboard(user) {
    document.getElementById('startGameBtn').classList.remove('hidden');
    document.getElementById('userImg').src = user.avatar;
    document.getElementById('userName').textContent =
        `${user.firstName} ${user.lastName}`;
    document.getElementById('userImg').style.display = 'block';
}

function GamePage() {
    window.location.href = 'game.html';
}

function logoutUser() {
    localStorage.clear();
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('openReg').classList.remove('hidden');
    document.getElementById('startGameBtn').classList.add('hidden');
    document.getElementById('userImg').style.display = 'none';
    document.getElementById('userName').style.display = 'none';
    updateUI();
    hideModal();
}

function updateUI() {
    const isRegistered = localStorage.getItem('isRegistered');
    const registerBtn = document.getElementById('openReg');

    if (isRegistered === 'true') {
        registerBtn.style.display = 'none';
    } else {
        registerBtn.style.display = 'block';
    }
}

function showModal() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('modalUserImg').src = user.avatar;
    document.getElementById('modalName').textContent =
        `${user.firstName} ${user.lastName}`;
    document.getElementById('modalEmail').textContent = user.email;
    document.getElementById('modal').style.display = 'flex';
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onload = function () {
    updateUI();
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        displayDashboard(user);
        document.getElementById('openReg').classList.add('hidden');
    } else {
        hideRegistrationForm();
        document.getElementById('openReg').classList.remove('hidden');
    }
};
