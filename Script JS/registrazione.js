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

function registrazione(){

    var utente = {
        Nome: document.getElementById("nomeRegistrazione").value,
        Cognome: document.getElementById("cognomeRegistrazione").value,
        Nickname: document.getElementById("nicknameRegistrazione").value, 
        Email: document.getElementById("emailRegistrazione").value,
        Password: document.getElementById("passwordRegistrazione").value,
        ConfermaPassword: document.getElementById("confermaPasswordRegistrazione").value,
        Preferiti : [

        ]
    }

    if(utente.Email == "" || utente.Password == "" || utente.Nome == "" 
        || utente.Cognome == "" || utente.Nickname == "" || utente.ConfermaPassword == ""){
        alert("Devi compilare tutti i campi.");
    }
    else{
        if(utente.Password == utente.ConfermaPassword){
            auth.createUserWithEmailAndPassword(utente.Email, utente.Password)
            .then((userCredential) => {
                // Signed in 
                firebase.firestore().collection('Utenti/').doc(userCredential.user.uid).set(utente).then(() => {
                    window.location.href = "Cucina.html";
                })
                // ...
            })
            .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
            // ..
            });
        }
        else{
            alert("Password e Conferma Password devono essere uguali.")
        }
    }

}

var show = document.getElementById('showPassword');

show.addEventListener('click', () => {

    var RegPassword = document.getElementById('passwordRegistrazione');
    

    if(RegPassword.getAttribute('type')=='password'){
        document.getElementById('passwordRegistrazione').setAttribute('type', 'text')
    }
    else{
        document.getElementById('passwordRegistrazione').setAttribute('type', 'password')
    }
    
})


var showC = document.getElementById('showPasswordConfirm');

showC.addEventListener('click', () => {

    var confirmRegPassword = document.getElementById('confermaPasswordRegistrazione');
    

    if(confirmRegPassword.getAttribute('type')=='password'){
        document.getElementById('confermaPasswordRegistrazione').setAttribute('type', 'text')
    }
    else{
        document.getElementById('confermaPasswordRegistrazione').setAttribute('type', 'password')
    }
    
})
