const loginModal = document.querySelector("#login-modal");

document.addEventListener('click', (event)=>{
    if (event.target.matches('#login-button')) {
        loginModal.classList.toggle('hide-modal')
    }
})

document.addEventListener('keydown', (event)=>{
    if (event.key === "Escape" && loginModal.className != 'hide-modal') {
        loginModal.classList.toggle('hide-modal')
    }
})