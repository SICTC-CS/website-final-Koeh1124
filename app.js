import {getPostById,getAllPosts,getPostHtmlFromId, signIn } from "./firebase.js";
import {setCookie, getCookie} from "./cookie.js"
//main page

//get email and password
let email = getCookie("email")
let password = getCookie('password')
let user = null
console.log(email,password)
//check if they are logged in
if((email != null)&&(password!=null)){
  signIn(password,email).then((userCred) => {
    //signed in
    user = userCred.user;
    //set cookies to pass info between diffrent pages
    setCookie("email",email)
    setCookie("password",password)
  })
  .catch((error) =>{
    //error
    console.log(error)
  })
}
window.onload = function() {
  testFunction()
  testFunction()
  testFunction()
  testFunction()
  testFunction()
  testFunction()
  /*
  await(user)
  console.log(user)
  if(user){
    console.log("logged in")
  } */
}

function testFunction(){
  getPostById("examplePost")
  getPostHtmlFromId("examplePost").then(htmlData => {
    if(htmlData!=undefined){
      document.getElementById("content").innerHTML+=htmlData;
      addFunctionToPosts()
    }
  })
}

function addFunctionToPosts(){
  let getAllPosts = document.querySelectorAll(".switch-content-view");
  getAllPosts.forEach(button =>{
    if(button.getAttribute('name') == "view-more"){
      button.onclick = function() {
        expandParentDiv(button)
      }
    }
    else{
      button.onclick = function() {
        collapseParentDiv(button)
      }
    }
  })
}

function expandParentDiv(moreBTN){
  let post = moreBTN.parentNode;
  let lessBTN = post.querySelector('[name = "view-less"]')
  let normal = post.querySelector('.normal-content');
  let expanded = post.querySelector('.expanded-content')
  lessBTN.classList.remove('hidden')
  expanded.classList.remove('hidden')
  moreBTN.classList.add("hidden")
  normal.classList.add("hidden")
}

function collapseParentDiv(lessBTN){
  let post = lessBTN.parentNode;
  let moreBTN = post.querySelector('[name = "view-more"]')
  let normal = post.querySelector('.normal-content');
  let expanded = post.querySelector('.expanded-content')
  lessBTN.classList.add('hidden')
  expanded.classList.add('hidden')
  moreBTN.classList.remove("hidden")
  normal.classList.remove("hidden")
}

function login(form){
 console.log(form)
}

function switchToContent(){
  let contentDiv = document.getElementById("content")
  let accDiv = document.getElementById("account")
  let friendDiv = document.getElementById("friends")
  contentDiv.classList.remove("hideContent")
  contentDiv.classList.add("displayContent")
  accDiv.classList.add("hideContent")
  accDiv.classList.remove("displaySplitLeft")
  friendDiv.classList.add("hideContent")
  friendDiv.classList.remove("displaySplitRight")
}
function switchToAccount(){
  let contentDiv = document.getElementById("content")
  let accDiv = document.getElementById("account")
  let friendDiv = document.getElementById("friends")
  contentDiv.classList.add("hideContent")
  contentDiv.classList.remove("displayContent")
  accDiv.classList.remove("hideContent")
  accDiv.classList.add("displaySplitLeft")
  friendDiv.classList.remove("hideContent")
  friendDiv.classList.add("displaySplitRight")
}
//not done, button just there because I'm planning on continuing this site after the project is turned in and want to add this later :)
//document.getElementById('settings').onclick = function() {window.location = "index.html"};

document.getElementById('user').onclick = function() {window.location = "account.html"};
document.getElementById('accountBTN').onclick = function() {switchToAccount()};
document.getElementById('contentBTN').onclick = function() {switchToContent()};