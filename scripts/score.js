const GameComplited = localStorage.getItem('gameComplited');
if (GameComplited == 'true') {
    const userloaded = document.getElementById('userscore');
    userloaded.style.display = 'flex';
}

const firstName = localStorage.getItem('firstName');
const lastName = localStorage.getItem('lastName');
const email = localStorage.getItem('email');
const score = localStorage.getItem('highScore');
const user = JSON.parse(localStorage.getItem('user'));
const avatar = user ? user.avatar : 'default_avatar.jpg';

document.getElementById('FIO').textContent = `${firstName} ${lastName}`;
document.getElementById('email1').textContent = `${email}`;
document.getElementById('score').innerHTML = `${score}`;
document.getElementById('avatar').src = avatar;
