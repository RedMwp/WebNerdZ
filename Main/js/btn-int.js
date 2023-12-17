const mainMenuBtn = document.getElementById('main-menu-btn');
const closeBtn = document.getElementById('close-btn');
const sideNavMenu = document.querySelector('.sf-nav-container');

function toggleShowMainMenu(){
    sideNavMenu.classList.toggle('active');
}

mainMenuBtn.addEventListener('click',toggleShowMainMenu);
closeBtn.addEventListener('click',toggleShowMainMenu);