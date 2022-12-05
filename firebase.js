//Importing firebase, taken directrly from firebase
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js'
import { getFirestore, collection, doc, setDoc, getDocs, getDoc } from 'https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js'
import {setCookie, getCookie} from "./cookie.js"

const firebaseConfig = {
    apiKey: "AIzaSyCdMLCc3Nwx_Rj3vP4wCteajn3KEpIbc6c",
    authDomain: "foodblog-8d953.firebaseapp.com",
    projectId: "foodblog-8d953",
    storageBucket: "foodblog-8d953.appspot.com",
    messagingSenderId: "140511167625",
    appId: "1:140511167625:web:dd7be49ee0586f39c5f258",
    measurementId: "G-F7GZB21NQS"
    };
// Initialize Firebase Modules
const app = initializeApp(firebaseConfig);
const db =  getFirestore(app);
const auth = getAuth(app);
let user = null;

//https://firebase.google.com/docs/firestore/query-data/get-data#web-version-9
//constructPost
class Post {
    constructor (id,Dislikes, Ingredients, Instructions, Likes, comments, description, image, keywords, title){
        this.id=id;
        this.Dislikes = Dislikes;
        this.Ingredients = Ingredients;
        this.Instructions = Instructions;
        this.Likes = Likes;
        this.comments = comments;
        this.description = description;
        this.image = image;
        this.keywords = keywords;
        this.title = title;
    }
    toString() {
        return `
<div id="${this.id}" class="normal-post">
    <div class="contentTitle"><h3>`+this.title+`</h3></div>
            <div class="normal-content">
                <img class="contentImg" src="`+this.image+`">
                <div class="contentInfo">
                    <p class="desc">`+this.description+`</p>
                </div>
            </div>
            <div class="expanded-content hidden">
                <div class="expanded-top">
                    <img class="contentImg" src="`+this.image+`" alt="`+this.title+`">
                    <div class="contentInfo">
                        <p class="desc">`+this.description+`</p>
                    </div>
                </div>
                <div class="expanded-bottom">
                    <div class="instructions">
                        <h4>Instructions</h4>
                        <ol>
                            `+genIntructions(this.Instructions)+`
                        </ol>
                    </div>
                    <div class="ingredients">
                        <h4>Ingredients</h4>
                        <ul>
                            `+genIngredients(this.Ingredients)+`
                        </ul>
                    </div>
                </div>
            </div>
            <button class="switch-content-view" name="view-more">View more</button>
            <button class="switch-content-view hidden" name="view-less">View less</button>
            <div class="interactions">
                <div class="flex"><i class="fa-solid fa-thumbs-up"></i><p>`+this.Likes+`</p></div>
                <div class="flex"><i class="fa-solid fa-thumbs-down"></i><p>`+this.Dislikes+`</p></div>
            </div>
        </div>
`
    }
}
function genIntructions(instructions){
    let returnString= ""
    for(let i=0;i<instructions.length;i++){
        returnString+="<li>"+instructions[i]+"</li>"
    }
    return returnString;
}
function genIngredients(ingredients){
    let returnString= ""
    console.log(ingredients)
    for(let i=0;i<ingredients.length;i++){
        returnString+="<li>"+ingredients[i]+"</li>"
    }
    return returnString;
}
//Firebase converter
const postConverter = {
    toFirestore: (post) => {
        return{
            id: post.id,
            Dislikes: post.Dislikes,
            Ingredients: post.Ingredients,
            Instructions: post.Instructions,
            Likes: post.Likes,
            comments: post.comments,
            description: post.description,
            image: post.image,
            keywords: post.keywords,
            title: post.title
            };
        },
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options);
            return new Post(snapshot.id,data.Dislikes, data.Ingredients, data.Instructions, data.Likes, data.comments, data.description, data.image, data.keywords, data.title)
    }
};

//read data
//post data
export async function getAllPosts(){
    const postRef = collection(db, 'posts');
    let allPsots = await getDocs(postRef);
    return allPsots
}

export async function getPostById(id){
    const postRef = doc(db, 'posts', id);
    let post = await getDoc(postRef);
    console.log(post.id)
    if(post.exists()){
        return post.data();
    } else{
        console.log("post dose not exist")
    }
}

export async function getPostDataById(id){
    const postRef = doc(db, 'posts', id);
    let post = await getDoc(postRef);
    console.log(post);
    if(post.exists()){
        return post.data();
    } else{
        console.log("post dose not exist")
    }
}

export async function getPostHtmlFromId(id){
    const postRef = doc(db, 'posts', id).withConverter(postConverter);
    let postData = await getDoc(postRef);
    if(postData.exists()){
        const post = await postData.data();
        return post.toString()
    } else{
        console.log("post dose not exist")
    }
}
//user data
export async function getUserData(id){
    console.log(id)
    const userRef = doc(db, 'users', id);
    return getDoc(userRef);
}
//push data
//post data

//userdata

//https://firebase.google.com/docs/auth/web/start
//auth

//signup
export async function signUp(password,email){
    return createUserWithEmailAndPassword(auth,email, password)
}
//login
export async function signIn(password,email){
    return signInWithEmailAndPassword(auth, email, password)
}

//signOut
export function logOut(){
    signOut(auth).then(() => {
        //Sign-out sucessful
        removeCookie("email")
        removeCookie("password")
    }).catch((error) => {
        //faild signOut
    })
}