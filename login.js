import { getCookie, setCookie } from './cookie.js'
import { signUp, signIn, logOut, getUserData} from './firebase.js'

let email = getCookie("email")
let password = getCookie('password')
let user = null
console.log(email,password)
//check if they are logged in
if((email != null)&&(password!=null)){
  signIn(password,email).then((userCred) => {
    //signed in
    user = userCred.user;
    document.getElementById("not-loggedIn").classList.add("hidden")
    document.getElementById("loggedIn").classList.remove("hidden")
    //set cookies to pass info between diffrent pages
    setCookie("email",email)
    setCookie("password",password)
    setUpAccountScreen();
  })
  .catch((error) =>{
    //error
  })
}

function tryLogin(){
    let form = document.getElementById("login-form")
    let password = form.querySelector('[name="password"]').value
    console.log(password)
    let email = form.querySelector('[name="email"]').value
    console.log(email)
    signIn(password,email).then((userCred) =>{
        user = userCred
        document.getElementById("not-loggedIn").classList.add("hidden")
        document.getElementById("not-loggedIn").classList.remove("displayAccount")
        document.getElementById("not-loggedIn").classList.remove("loginPadding")
        document.getElementById("loggedIn").classList.remove("hidden")
        document.getElementById("loggedIn").classList.add("accPadding")
        document.getElementById("loggedIn").classList.add("displayAccount")
        //set cookies to pass info between diffrent pages
        setCookie("email",email)
        setCookie("password",password)
    })
    .catch((error)=>{
        document.getElementById("loginError").textContent = error;
    })
}

function trySignup(){
    let form = document.getElementById("signup-form")
    let password = form.querySelector('[name="password"]').value
    let email = form.querySelector('[name="email"]').value
    signUp(password,email).then((userCred) => {
        //signed in
        user = userCred.user;
        document.getElementById("not-loggedIn").classList.add("hidden")
        document.getElementById("not-loggedIn").classList.remove("displayAccount")
        document.getElementById("not-loggedIn").classList.remove("loginPadding")
        document.getElementById("loggedIn").classList.remove("hidden")
        document.getElementById("loggedIn").classList.add("accPadding")
        document.getElementById("loggedIn").classList.add("displayAccount")
        //set cookies to pass info between diffrent pages
        setCookie("email",email)
        setCookie("password",password)
    }).catch((error) => {
        document.getElementById("signupError").textContent = error
    })
}

function tryLogout(){
    logOut();
    document.getElementById("not-loggedIn").classList.remove("hidden")
    document.getElementById("not-loggedIn").classList.add("displayAccount")
    document.getElementById("not-loggedIn").classList.add("loginPadding")
    document.getElementById("loggedIn").classList.add("hidden")
    document.getElementById("loggedIn").classList.remove("displayAccount")
    document.getElementById("loggedIn").classList.remove("accPadding")
}

function setUpAccountScreen(){
    let userPromise = getUserData(user.uid)
    userPromise.then((userInfo) => {
        if(userInfo.exists()){
            let userData = userInfo.data()
            console.log(userData)
            console.log(userData.userName)
        }
    })
}
//set on click listners
document.getElementById('loginSubmit').onclick = function() {tryLogin()};
document.getElementById('signupSubmit').onclick = function() {trySignup()};
document.getElementById("switchToSignup").onclick = function() {
    document.getElementById("login-screen").classList.add("hidden")
    document.getElementById("signup-screen").classList.remove("hidden")
}
document.getElementById("switchToLogin").onclick = function() {
    document.getElementById("login-screen").classList.remove("hidden")
    document.getElementById("signup-screen").classList.add("hidden")
}
document.getElementById("logout").onclick = function() {tryLogout()};