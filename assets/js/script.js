const loginModal = document.querySelector("#login-modal");
const loginBtn = document.querySelector('#login-button');
const userEl = document.querySelector('#login-user-input');
const passEl = document.querySelector('#login-password-input');
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
        console.log("user:", user)
        console.log("pass:", pass)
        const submittedLogin = JSON.parse(localStorage.getItem("CMS_users")) 
        ? JSON.parse(localStorage.getItem("CMS_users")).map((u)=>{
            console.log(Object.values(u).includes(user), u, Object.values(u))
            if (Object.keys(u).includes("currentUser")
                || Object.values(u).includes(user)) return u
        }).filter((u)=>{
            console.log(u)
            return u !== undefined
        }) : []

        console.log(submittedLogin)

        if (submittedLogin[1]){
            const username = submittedLogin[1].username;
            const password = submittedLogin[1].password;
            if (user === username){
                if (pass === password){
                    saveLocal(submittedLogin[1], false)
                    location.href = `./userprofile.html#${username}`;
                    console.log('login successful');
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
            const submittedLogin = JSON.parse(localStorage.getItem("CMS_users")) 
            ? JSON.parse(localStorage.getItem("CMS_users")).map((u)=>{
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
                    saveLocal(userLogin, true);
                    console.log(`user: ${user} created`);
                    location.href = `./userprofile.html#${userLogin.username}`;
                } else {console.log('passwords do not match')}
            } else {console.log(`user: ${user} already exists`)}
        } else {console.log('enter a username')}
    }

    if (event.target.matches('#log-out')){
        saveLocal({username:''}, false)
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

function saveLocal(user, push){
    const users = JSON.parse(localStorage.getItem("CMS_users")) || [{currentUser:''}];
    users[0] = {currentUser:user.username};
    console.log("current user:", user.username);
    // console.log(users);
    if(push) users.push(user);
    localStorage.setItem("CMS_users", JSON.stringify(users));
}

function isProfileLoggedIn(href){
    const index = href.indexOf('#');
    const currentUser = JSON.parse(localStorage.getItem('CMS_users'))[0].currentUser
    console.log("load profile", currentUser)
    const user = href.slice(index+1) !== href 
    ? href.slice(index+1)
    : '';
    if(currentUser !== user || currentUser === ''){
        location.href = "./login.html"
    } 
    else {
        console.log(user);
        const profileName = document.querySelector("#real-name");
        profileName.textContent = user.slice(0, 1).toUpperCase() 
        + user.slice(1);
    }
}