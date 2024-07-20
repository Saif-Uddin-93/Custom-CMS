const loginModal = document.querySelector("#login-modal");
const loginBtn = document.querySelector('#login-button');
const user = document.querySelector('#login-user-input');
const pass = document.querySelector('#login-password-input');
// const username = users[0].username;
// const password = users[0].password;
const signInBtn = document.querySelector('#sign-in-button')

document.addEventListener('click', (event)=>{
    // // open/close login modal
    // if (event.target.matches('#login-button') ||
    //     event.target.matches('.close-icon')) {
    //     loginModal.classList.toggle('hide-modal');
    // }

    // check user login
    if (event.target.matches('#sign-in-button') && event.target.textContent === 'Log in'){
        const localObj = Object.entries(localStorage);
        if (String(user.value).toLowerCase() in localObj){
            const username = String(user.value).toLowerCase();
            if (pass.value === localObj[username]){
                console.log('login successful');
                location.href = './userprofile.html';
            } else {console.log('password incorrect')}
        }
        else {
            console.log("user does not exist")
        }
    }

    // add new user
    if (event.target.matches('#sign-in-button') && event.target.textContent === 'Sign up'){
        const reTypePass = document.querySelector("#login-retype-password-input")
        if (pass.value === reTypePass.value){
            const userLogin = {
                username : user.value,
                password : pass.value
            }
            saveLocal(userLogin);
            console.log('user created');
            location.href = `./userprofile.html#${userLogin.username}`;
        } else {console.log('passwords do not match')}
    }

    if (event.target.matches('#log-out')){
        location.href = './index.html'
    }

    // create new user
    if (event.target.matches('#new-user-button')){
        location.href = './create_new_user.html';
    }
})

// close login modal on escape key press
document.addEventListener('keydown', (event)=>{
    if (event.key === "Escape" && !loginModal.className.includes('hide-modal')) {
        loginModal.classList.toggle('hide-modal')
    }
})

function saveLocal(user){
    const users = JSON.parse(localStorage.getItem("users")) || []
    users.push(user)
    localStorage.setItem("users", JSON.stringify(users))
}