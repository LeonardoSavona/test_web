// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyCgsvHHU-1vJLcbwBNVKkWU3_GFZ_aDUiM",
    authDomain: "ricette-8e80f.firebaseapp.com",
    projectId: "ricette-8e80f",
    storageBucket: "ricette-8e80f.appspot.com",
    messagingSenderId: "616850628843",
    appId: "1:616850628843:web:1913072149001d5f749eae",
    measurementId: "G-9Z23RN8TE8"
  };
  
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const auth = firebase.auth();

function login(){

    var loginUtente = {
        Email: document.forms["myForm"]["emailLogin"].value,
        Password: document.forms["myForm"]["passwordLogin"].value,
    }

    if(loginUtente.Email == "" || loginUtente.Password == ""){
        if(loginUtente.Email == "" && loginUtente.Password != ""){
            alert("Inserire Email.");
            return false;
        }
        else if(loginUtente.Password == "" && loginUtente.Email != ""){
            alert("Inserire Password.");
            return false;
        }
        else{
            alert("Inserire Email e Password.");
            return false;
        }
        
    }
    else{
        auth.signInWithEmailAndPassword(loginUtente.Email, loginUtente.Password)
        .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        window.location.href = "Cucina.html";
        // ...
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        alert(errorMessage);
        });
    }
}

var show = document.getElementById('showPassword');

show.addEventListener('click', () => {

    var loginPassword = document.getElementById('passwordLogin');

    if(loginPassword.getAttribute('type')=='password'){
        document.getElementById('passwordLogin').setAttribute('type', 'text')
    }
    else{
        document.getElementById('passwordLogin').setAttribute('type', 'password')
    }
})

    

