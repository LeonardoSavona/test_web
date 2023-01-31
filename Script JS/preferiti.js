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

var uid;

auth.onAuthStateChanged(user => {
  if(user){
    uid = user.uid;
    firebase.firestore().collection("Utenti/").doc(user.uid).get().then((doc) => {

        caricaPreferiti(doc.data().Preferiti);
        
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }else{
    document.getElementById("Accesso").innerHTML = `
        <li><a class="dropdown-item" href="Login.html">Accedi</a></li>
        <li><a class="dropdown-item" href="Register.html">Registrati</a></li>
    `
  }
});

async function caricaPreferiti(pref){

    console.log(pref);

    if(pref.length==0){
      document.getElementById('bordo').setAttribute('style', 'display: none');
    }
    else{
      firebase.firestore().collection('ricette').onSnapshot(function(snapshot){
        snapshot.forEach(async function(res){

            for(var a = 0; a < pref.length; a++){

                if(res.data().Titolo==pref[a]){
                    document.getElementById('Preferiti').innerHTML+=`
                    <div class="col-lg-6">           
                            <div class="border-dark card my-2 mx-2"  style="min-height: 94% !important;">
                                <h5 class="card-header bg-cioccolato text-white text-start">${res.data().Titolo}
                                <i style="color: red;" id="cuore-${res.data().Titolo}" onclick="addPreferito('${res.data().Titolo}')" class="btn fas fa-heart"></i></h5>
                                
                                <div class="card-body bg-crema" style="position: relative;">
                                    <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                                    
                                    <div class="row mb-3">
                                      
                                        <div class="col-lg-4"  id="immagine-${res.id}">
                                        
                                        </div>
                                        <div class="col-lg-8">
                                            <p class="text-muted" style="height: 96px">${res.data().Descrizione.substring(0,175)}...</p>                                
                                        </div> 

                                    </div>

                                    <div class="row" style="position: absolute; bottom: 4px; width: 100%;">

                                        <div class="col-lg-4 text-black"  >
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                            <i class="fas fa-star"></i>
                                        </div>

                                        <div class="col-lg-8">
                                            <p class="card-text text-start ">
                                            <b class="text-bold text-bottom text-white bordoparola">Difficoltà: </b><span class="text-black" >${res.data().Difficoltà}</span>
                                            <b class="text-bold text-white bordoparola"> | Tempo: </b><span class="text-black" >${res.data().Tempo}</span>
                                            <b class="text-bold text-white bordoparola"> | Gusto: </b><span class="text-black" >${res.data().Gusto}</span>
                                            </p>
                                        </div>

                                    </div>
                                    </a>
                                </div>
                            </div>
                    </div>
                    `
                }  
                getGallery(res.id);
            
            }
        })
      })
    }

}

async function getGallery(param){
    var storageRef = firebase.storage().ref('Immagini/' + param);
    storageRef.listAll()
    .then(function(result){
      result.items.forEach( async function(imageRef){
        await displayGallery(imageRef, param)
      });
    })
}

//document.getElementById('event_gallery').setAttribute('src',url);

  function displayGallery(imageRef, param){
    imageRef.getDownloadURL()
    .then(function(url){
      document.getElementById('immagine-'+param).innerHTML = `
        <div class="px-1 container" >
          <img src="${url}" alt="${url}" style="height: 100%; width: 100%" class="img-fluid card shadow-lg border-0 hover-animate">
        </div>
      `
    })
}