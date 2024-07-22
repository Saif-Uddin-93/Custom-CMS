const loginModal = document.querySelector("#login-modal");
const loginBtn = document.querySelector('#login-button');
const userEl = document.querySelector('#login-user-input');
const passEl = document.querySelector('#login-password-input');
const signInBtn = document.querySelector('#sign-in-button');
const loginError = document.querySelector(".login-error");

function checkUserLogin(){
    const user = String(userEl.value).toLowerCase();
    const pass = String(passEl.value);
    const submittedLogin = JSON.parse(localStorage.getItem("CMS_users")) 
    ? JSON.parse(localStorage.getItem("CMS_users")).map((u)=>{
        // console.log(Object.values(u).includes(user), u, Object.values(u))
        return u.username === user ? u : undefined
    }).filter((u)=>{
        //console.log(u)
        return u !== undefined
    }) : []

    // console.log(submittedLogin)
    Timer.timeoutClr();
    if (submittedLogin[0]) {
        const password = submittedLogin[0].password;
        if (pass === password){
            saveLocal(submittedLogin[0], false)
            location.href = `./userprofile.html#${user}`;
            console.log('login successful');
        } else {loginErrorMsg('password incorrect')}
    } else {
        if (user === '') loginErrorMsg(`Enter a username`)
        else loginErrorMsg(`${user} does not exist`)
    }
}

function addNewUser(){
    const user = String(userEl.value).toLowerCase();
    const pass = String(passEl.value);
    const reTypePass = String(document.querySelector("#login-retype-password-input").value)
    Timer.timeoutClr();
    if (user){
        const submittedLogin = JSON.parse(localStorage.getItem("CMS_users")) 
        ? JSON.parse(localStorage.getItem("CMS_users")).map((u)=>{
            // console.log(Object.values(u).includes(user), user, Object.values(u))
            return u.username === user ? u : undefined
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
            } else {
                loginErrorMsg('Passwords do not match');
            }
        } else {
            loginErrorMsg(`user: ${user} already exists`);
        }
    } else {
        loginErrorMsg('enter a username');
    }
}

function logOut(){
    saveLocal({username:''}, false)
    location.href = './login.html'
}

function userSignUpPage(){
    location.href = './create_new_user.html';
}

function openPosts(){
    const postsTab = document.querySelector(".tab-content");
    postsTab.classList.toggle("show")
}

function saveLocal(user, push){
    const users = JSON.parse(localStorage.getItem("CMS_users")) || [{currentUser:''}];
    users[0] = {currentUser:user.username};
    console.log("current user:", user.username);
    // console.log(users);
    if(push) users.push(user);
    localStorage.setItem("CMS_users", JSON.stringify(users));
}

// runs onload from body tag
function isProfileLoggedIn(href){
    const index = href.indexOf('#');
    const currentUser = JSON.parse(localStorage.getItem('CMS_users'))[0].currentUser
    console.log("load profile", currentUser)
    const user = href.slice(index+1)
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

document.addEventListener('click', (event)=>{
    // // open/close login modal
    // if (event.target.matches('#login-button') ||
    //     event.target.matches('.close-icon')) {
    //     loginModal.classList.toggle('hide-modal');
    // }

    // check user login
    if (event.target.matches('#sign-in-button') && event.target.textContent === 'Log in'){
        checkUserLogin();
    }

    // add new user
    if (event.target.matches('#sign-in-button') && event.target.textContent === 'Sign up'){
        addNewUser();
    }

    // logout
    if (event.target.matches('#log-out')){
        logOut();
    }

    // load user sign up
    if (event.target.matches('#new-user-button')){
        userSignUpPage();
    }

    // clicked on posts tab
    if(event.target.matches("#posts-button *") || event.target.matches("#posts-button")){
        openPosts();
    }
})

document.addEventListener('keydown', (event)=>{
    // log in/sign up submission using enter key
    active = document.activeElement.id;
    // console.log(active, typeof active)
    if (event.key === "Enter" && (active === "login-user-input" 
        || active === "login-password-input" 
        || active === "login-retype-password-input")){
        if (location.href.includes("login.html")){
            checkUserLogin();
        }
        if (location.href.includes("create_new_user.html")){
            addNewUser();
        }
    }

    // close login modal on escape key press
    // if (event.key === "Escape" && !loginModal.className.includes('hide-modal')) {
    //     loginModal.classList.toggle('hide-modal')
    // }
})

const Timer = {
    timerInterval: undefined,
    timeoutInterval: undefined,
    timeoutSet: (callBack, ms=1)=> Timer.timeoutInterval = setTimeout(callBack, ms*1000),
    timeoutClr: ()=> clearTimeout(Timer.timeoutInterval),
}

function loginErrorMsg(msg=''){
    loginError.classList.toggle('hide')
    console.log(msg)
    loginError.textContent = msg;
    Timer.timeoutSet(()=>{
        loginError.classList.toggle('hide')
        loginError.textContent = '';
    },2)
}