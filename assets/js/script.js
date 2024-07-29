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
            // login success
            logInSuccess(user)
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
                // login success
                logInSuccess(user)
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

function logInSuccess(user){
    console.log('login successful');
    // location.href = `./userprofile.html#${user}`;
    location.href = `./application_dashboard.html`
    // const loginBtnTxt = document.querySelector("#login-button span");
    // loginBtnTxt.value = user;
}

function logOut(){
    saveLocal({username:''}, false)
    location.href = './index.html'
}

function userSignUpPage(){
    location.href = './create_new_user.html';
}

// function loadUserProfile(){
//     location.href = './userprofile.html';
// }

function openPosts(open){
    const postsTab = document.querySelector(".tab-content");
    if (!open){
        postsTab.classList.toggle("show")
        const aside = document.querySelector("aside")
        if (aside.classList[0]==='minimise'){
            openSideBar()
        }
    }
    else if (open === 'open'){
        postsTab.classList.add("show")
        openSideBar()
    }
    else if (open === 'close'){
        postsTab.classList.remove("show")
    }
}

function openSideBar(){
    const aside = document.querySelector("aside"),
    asideWrapper = document.querySelector("#aside-wrapper"),
    tabNames = document.querySelectorAll(".tab-name"),
    sideBarBtnImg = document.querySelector("#sidebar-button img");
    // tabItems = document.querySelectorAll(".tab-content-item");
    aside.classList.toggle("minimise")
    asideWrapper.classList.toggle("minimise")
    tabNames.forEach((tab)=>{
        tab.classList.toggle("hide")
    })    
    if(aside.classList[0]==="minimise"){
        sideBarBtnImg.src="./assets/images/sidebar-panel-expand-icon-open.svg"
        sideBarBtnImg.alt="sidebar-open button"
        openPosts('close')
    }
    else{
        sideBarBtnImg.src="./assets/images/sidebar-panel-expand-icon-close.svg"
        sideBarBtnImg.alt="sidebar-close button"
    }
}

function checkUserDB(){
    // localStorage.setItem('CMS_users', JSON.stringify([{'currentUser':''}]));
    saveLocal()
}

function saveLocal(user, push){
    const users = JSON.parse(localStorage.getItem("CMS_users")) || [{currentUser:''}];
    if (user) {
        users[0] = {currentUser:user.username};
        console.log("current user:", user.username);
    }
    // console.log(users);
    if(push) users.push(user);
    localStorage.setItem("CMS_users", JSON.stringify(users));
}

const loginBtnPages = [
    '/application_dashboard.html',
    '/index.html',
    '/allposts.html',
]

// runs onload from body tag
function isProfileLoggedIn(href){
    console.log(href)
    const index = href.slice(0,10)==='http://127' ? href.indexOf('01') : href.indexOf('io');
    console.log(index)
    let currentUser = JSON.parse(localStorage.getItem('CMS_users'))[0].currentUser;
    currentUser = currentUser.slice(0, 1).toUpperCase() + currentUser.slice(1);
    console.log("load profile", currentUser)
    const page = href.slice(index+2)
    console.log(page)
    if(currentUser === ''){
        if(page !== '/index.html'){
            location.href = "./login.html"
        }
    }
    else if(loginBtnPages.includes(page)) {
        const loginBtnTxt = document.querySelector("#login-button span");
        loginBtnTxt.textContent = currentUser.slice(0,1);
    }
    else if (page === '/userprofile.html') {
        console.log(currentUser, page)
        const profileName = document.querySelector("#real-name");
        profileName.textContent = currentUser;
        // const loginBtnTxt = document.querySelector("#login-button span");
        // loginBtnTxt.textContent = profileName.textContent;
    } 
}

function loadUserProfile(){
    const currentUser = JSON.parse(localStorage.getItem('CMS_users'))[0].currentUser;
    console.log(currentUser)
    if (currentUser) location.href = './userprofile.html'
    else location.href = './login.html'
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
    else if (event.target.matches('#sign-in-button') && event.target.textContent === 'Sign up'){
        addNewUser();
    }

    // logout
    else if (event.target.matches('#log-out')){
        logOut();
    }

    // load user sign up
    else if (event.target.matches('#new-user-button')){
        userSignUpPage();
    }

    // clicked on posts tab
    else if(event.target.matches("#posts-button *") || event.target.matches("#posts-button")){
        openPosts();
    }

    else if(event.target.matches("#sidebar-button *") || event.target.matches("#sidebar-button")){
        openSideBar();
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
        else if (location.href.includes("create_new_user.html")){
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