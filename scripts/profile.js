document.addEventListener('DOMContentLoaded', function () {
    const userImg = document.getElementById('userImg');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    function showModal() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            document.getElementById('modalUserImg').src = user.avatar;
            document.getElementById('modalName').textContent =
                `${user.firstName} ${user.lastName}`;
            document.getElementById('modalEmail').textContent = user.email;
            modal.style.display = 'flex';
        }
    }
    userImg.addEventListener('click', showModal);
    modalClose.addEventListener('click', function () {
        modal.style.display = 'none';
    });
    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
