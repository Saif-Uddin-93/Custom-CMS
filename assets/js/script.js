const loginModal = document.querySelector("#login-modal");
const loginBtn = document.querySelector('#login-button');
const fnameEl = document.querySelector('#login-fname-input');
const lnameEl = document.querySelector('#login-lname-input');
const userEl = document.querySelector('#login-user-input');
const passEl = document.querySelector('#login-password-input');
const signInBtn = document.querySelector('#sign-in-button');
const loginError = document.querySelector(".login-error");

function checkUserLogin(){
    // checks user login for valid login

    // user and pass takes input from inputs on login/sign up pages
    const user = String(userEl.value).toLowerCase();
    const pass = String(passEl.value);

    // submittedLogin checks input with stored user data in local storage
    // returns array with 1 object containing a valid login or and empty array if invalid login
    const submittedLogin = JSON.parse(localStorage.getItem("CMS_users")) 
    ? JSON.parse(localStorage.getItem("CMS_users")).map((u)=>{
        // console.log(Object.values(u).includes(user), u, Object.values(u))
        return u.username === user ? u : undefined
    }).filter((u)=>{
        return u !== undefined
    }) : []

    // Timer used to control error messages appearing on invalid inputs for login/sign up pages
    Timer.timeoutClr();
    // if valid login found
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

// function to add user when entering a new user
function addNewUser(){
    // user and pass takes input from inputs on login/sign up pages
    const user = String(userEl.value).toLowerCase();
    const pass = String(passEl.value);
    const reTypePass = String(document.querySelector("#login-retype-password-input").value)
    Timer.timeoutClr();
    // checks if a username has been entered
    if (user){
        // check user database if username already exists
        const submittedLogin = JSON.parse(localStorage.getItem("CMS_users")) 
        ? JSON.parse(localStorage.getItem("CMS_users")).map((u)=>{
            return u.username === user ? u : undefined
        }).filter((u)=>{
            return u !== undefined
        }) : []
        if (!submittedLogin[0]) {
            // if user doesn't exist, check is entered passwords match
            if (pass === reTypePass){
                // creates a new user as an object which is saved to local storage
                const now = new Date().toLocaleDateString()
                const userLogin = {
                    username : user,
                    password : pass,
                    firstName : fnameEl.value,
                    lastName : lnameEl.value,
                    created : now
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
    // function is invoked if login is successful and redirects to application dashboard
    console.log('login successful');
    location.href = `./application_dashboard.html`
}

function logOut(){
    saveLocal({username:''}, false)
    location.href = './index.html'
}

function userSignUpPage(){
    location.href = './create_new_user.html';
}

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
     // funtion to open/close side bar menu
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

// function checkUserDB(){
//     // localStorage.setItem('CMS_users', JSON.stringify([{'currentUser':''}]));
//     saveLocal()
// }

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

// array of pages that include the login button in the nav bar in header
const loginBtnPages = [
    '/application_dashboard.html',
    '/index.html',
    '/allposts.html',
    '/create_post.html',
    '/categories.html',
    '/edit_post.html',
    '/tags.html',
]

// runs onload from body tag. if the user is not logged in then redirect to login page.
function isProfileLoggedIn(href){
    console.log(href)
    // index checks if webpage running in local test environment or live github pages environment
    let index = href.slice(0,10)==='http://127' ? href.indexOf('01') : href.indexOf('MS/');
    console.log(index)
    // currentUser checks which user currently logged in or returns '' if no-one logged in.
    let currentUser = JSON.parse(localStorage.getItem('CMS_users'))[0].currentUser;
    console.log("load profile", currentUser)
    // page checks which webpage currently on
    const page = href.slice(index+2)
    console.log(page)
    // redirect if no-one logged in
    if(currentUser === ''){
        if(page !== '/index.html' && href !== 'https://saif-uddin-93.github.io/Custom-CMS/'){
            location.href = "./index.html"
        }
    }
    else if(loginBtnPages.includes(page) || href === 'https://saif-uddin-93.github.io/Custom-CMS/' || href === 'http://127.0.0.1:5501/') {
        const loginBtnTxt = document.querySelector("#login-button span");
        loginBtnTxt.textContent = currentUser.slice(0,1);
    }
    else if (page === '/userprofile.html') {
        console.log(currentUser, page)
        const profileName = document.querySelector("#real-name");
        const profileLoginName = document.querySelector("#login-name");
        const profileInfoName = document.querySelector("#info-name");
        const profileInfoEmail = document.querySelector("#info-email");
        const profileInfoAge = document.querySelector("#info-age");
        db = JSON.parse(localStorage.getItem('CMS_users'))
        for (let i=1; i < db.length; i++){
            if (db[i].username.toLowerCase() === currentUser.toLowerCase()){
                profileName.textContent = `${capitalise(db[i].firstName)} ${capitalise(db[i].lastName)}`;
                profileLoginName.textContent = currentUser;
                profileInfoName.value = profileName.textContent
                profileInfoEmail.value = currentUser
                profileInfoAge.value = db[i].created
            }
        }
    } 
}

function toggleUploadModal(){
    // loginModal.classList.toggle('hide-modal');
    const uploadModal = document.querySelector('#upload-modal');
    const hideBg = document.querySelector('.hide-bg');
    uploadModal.classList.toggle('hide-modal');
    hideBg.classList.toggle('hide-modal');
    console.log('open upload modal')
}

document.addEventListener('click', (event)=>{
    // // open/close login modal
    console.log('click event', event.target)
    console.log('click event text', event.target.textContent)

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

    // toggle opne/close sidebar
    else if(event.target.matches("#sidebar-button *") || event.target.matches("#sidebar-button")){
        openSideBar();
    }

    // open/close upload menu
    else if (event.target.matches('#new-post-images-btn') ||
        event.target.matches('.btn-close') ||
        event.target.textContent==='Upload' ||
        event.target.textContent==='Cancel')
    {
            toggleUploadModal();
    }
})

document.addEventListener('keydown', (event)=>{
    // log in/sign up submission using enter key
    active = document.activeElement.id;
    // console.log(active, typeof active)
    if (event.key === "Enter" && (active === "login-user-input" 
        || active === "login-password-input" 
        || active === "login-retype-password-input")){
        if (location.href.includes("index.html")){
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

function loadUserProfile(){
    const currentUser = JSON.parse(localStorage.getItem('CMS_users'))[0].currentUser;
    console.log(currentUser)
    if (currentUser) location.href = './userprofile.html'
    else location.href = './index.html'
}

// Timer object to simplify setTimeout/clearTimeout functions
const Timer = {
    timerInterval: undefined,
    timeoutInterval: undefined,
    timeoutSet: (callBack, ms=1)=> Timer.timeoutInterval = setTimeout(callBack, ms*1000),
    timeoutClr: ()=> clearTimeout(Timer.timeoutInterval),
}

// function to display error messages on login/sign up pages
function loginErrorMsg(msg=''){
    loginError.classList.toggle('hide')
    console.log(msg)
    loginError.textContent = msg;
    Timer.timeoutSet(()=>{
        loginError.classList.toggle('hide')
        loginError.textContent = '';
    },2)
}


function capitalise(string){
    return string.slice(0, 1).toUpperCase() + string.slice(1).toLowerCase();
}