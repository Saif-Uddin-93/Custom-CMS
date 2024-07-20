const loginModal = document.querySelector("#login-modal");
const loginBtn = document.querySelector('#login-button');
const userEl = document.querySelector('#login-user-input');
const passEl = document.querySelector('#login-password-input');
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
        const user = String(userEl.value).toLowerCase();
        const pass = String(passEl.value);
        const submittedLogin = JSON.parse(localStorage.getItem("users")) 
        ? JSON.parse(localStorage.getItem("users")).map((u)=>{
            // console.log(Object.values(u).includes(user), user, Object.values(u))
            if (Object.values(u).includes(user)) return u
        }).filter((u)=>{
            return u !== undefined
        }) : []

        // console.log(submittedLogin[0])

        if (submittedLogin[0]){
            const username = submittedLogin[0].username;
            const password = submittedLogin[0].password;
            if (user === username){
                if (pass === password){
                // if (pass === users.indexOf(user)){
                    console.log('login successful');
                    location.href = `./userprofile.html#${username}`;
                } else {console.log('password incorrect')}
            }
        } else {
            console.log(`${user} does not exist`)
        }
    }

    // add new user
    if (event.target.matches('#sign-in-button') && event.target.textContent === 'Sign up'){
        const user = String(userEl.value).toLowerCase();
        const pass = String(passEl.value);
        const reTypePass = String(document.querySelector("#login-retype-password-input").value)
        if (user){
            const submittedLogin = JSON.parse(localStorage.getItem("users")) 
            ? JSON.parse(localStorage.getItem("users")).map((u)=>{
                // console.log(Object.values(u).includes(user), user, Object.values(u))
                if (Object.values(u).includes(user)) return u
            }).filter((u)=>{
                return u !== undefined
            }) : []
            if (!submittedLogin[0]) {
                if (pass === reTypePass){
                    const userLogin = {
                        username : user,
                        password : pass
                    }
                    saveLocal(userLogin);
                    console.log(`user: ${user} created`);
                    location.href = `./userprofile.html#${userLogin.username}`;
                } else {console.log('passwords do not match')}
            } else {console.log(`user: ${user} already exists`)}
        } else {console.log('enter a username')}
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
    const users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
}

function loadProfile(href){
    const index = href.indexOf('#');
    const user = href.slice(index+1);
    console.log(user);
    const profileName = document.querySelector("#real-name");
    profileName.textContent = user.slice(0, 1).toUpperCase() 
    + user.slice(1);
}