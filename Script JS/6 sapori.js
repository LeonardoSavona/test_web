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
    
        document.getElementById("Accesso").innerHTML = `
            <li><a class="dropdown-item" >${doc.data().Nickname}</a></li>
            <li><a class="dropdown-item" href="Preferiti.html">I miei Preferiti</a></li>
            <li><a class="dropdown-item" onclick="logout()">Logout</a></li>
        `
        
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

// SignOut User
function logout(){
    auth.signOut()
    .then(function(){
      window.location.reload();
    }).catch(error => {
      console.log(error.message)
    });
  }

/*per caricare su firebase le ricette*/ 
var ricetta = {
    Titolo:'Arancini di riso',
    Preparazione: '',
    Descrizione: "Gli arancini di riso (o arancine), vanto della cucina siciliana, sono dei piccoli timballi adatti ad essere consumati sia come spuntino che come antipasto, primo piatto o addirittura piatto unico. In Sicilia si trovano ovunque e in ogni momento, sempre caldi e fragranti nelle molte friggitorie, insieme a cazzilli e panelle: di città in città spesso cambiano forma e dimensioni, assumendo fattezze ovali, a pera o rotonde, a seconda del ripieno. Si possono contare circa 100 varianti: dalla più classica al ragù e al prosciutto, a quelle più originali come al pistacchio e agli spinaci, oppure addirittura al forno! Persino nella cucina campana c'è una versione molto simile conosciuta come 'palle di riso' e che si abbina sempre agli altri fritti tipici, comprese le frittelle di sciurilli."+
    "Noi oggi vi presentiamo le due classiche intramontabili, al ragù di carne di maiale e piselli e al prosciutto e mozzarella; voi quale preferite?",
    Tempo: 105,
    Difficoltà: 'Media',
    Portata: 'Antipasto',
    Gusto: '',
    KiloCalorie: '',
    Ingredienti:[
        {
            NomeIngrediente: "",
            Quantità: 9
        }
    ]
}

function create(){
    firebase.firestore().collection('ricette/').add(ricetta)
}

/*------------------------------------------------------BARRA DI RICERCA-----------------------------------------------------------------------------------------*/ 
var x = '';
var ingredientiScelti = [i];
var i = 0;
var a ='';
var contatoreIngredientiScelti = 0;
var input = [];
var display = 0;

/*riempie l'array 'tuttiIngredienti' prendendo di riferimento la lista di ingredienti su firebase*/
var tuttiIngredienti = [c];
var c = 0;
firebase.firestore().collection('Ingredienti').onSnapshot((snapshot)=>{
    snapshot.forEach(function(ingrediente){
        tuttiIngredienti=ingrediente.data().Ingredienti;
    })
})

/*riempie l'array 'tutteRicette' prendendo di riferimento la lista di ricette su firebase*/
var tutteRicette = [n];
var n = 0;
firebase.firestore().collection('ricette').onSnapshot((snapshot)=>{
    snapshot.forEach(function(ricetta){
        tutteRicette[n]=ricetta.data();
        n++;
    })
})

/*fa comparire o scomparire l'elenco di ingredienti che sta sotto alla barra di ricerca, quando si preme sulla barra di ricerca*/
function ricerca(){
    var select = document.getElementById("elencoIngredienti");
    if (select.getAttribute('style')=='display: none')
         select.setAttribute('style', 'display: block; z-index: 1; position: absolute; max-width: 966px')
     else 
         select.setAttribute('style', 'display: none')
 }

/*inserisce bottone relativo all'ingrediente selezionato, azzera l'input e nasconde l'elenco di ingredienti che sta sotto alla barra di ricerca*/
function aggiungiBottoneIngrediente(){
    var select = document.getElementById("elencoIngredienti");
    document.getElementById('ricercaIngredienti').value = '';
    select.setAttribute('style', 'display: none');

    x = document.getElementById('elencoIngredienti').value;
    var select2 = document.getElementById("ingredientiSelezionati");
    select2.setAttribute('style', 'display: block;')
    
    document.getElementById(x).setAttribute('disabled', true); 

    document.getElementById('1').innerHTML+=`
    <div style="display: inline-block; height: 100%;" disabled class="btn btn-cioccolato mb-1" onclick="riabilitaOpzione(${i}), this.remove()" id="${i}" value="${x}">
    <button class="btn text-white">X</button>${x}
    </div>
    `
    display++;
    ingredientiScelti[i]=x;
    i++;
    contatoreIngredientiScelti++;
    ricercaPerCaratteri();
 }

/*riabilita l'opzione del relativo ingrediente e se non ci sono ingredienti fa sparire il display*/
function riabilitaOpzione(a){
 
    var select2 = document.getElementById("ingredientiSelezionati");
    var select = document.getElementById("elencoIngredienti");
    
    if (document.getElementById(ingredientiScelti[a])){
    
        document.getElementById(ingredientiScelti[a]).removeAttribute('disabled');
        delete ingredientiScelti[a];

    }

    display--;

    if(display==0){
        select2.setAttribute('style', 'display: none')
        select.setAttribute('size', 5)
    }
    else
        select2.setAttribute('style', 'display: block')
    
    contatoreIngredientiScelti--;
}

/*RICERCA PER CARATTERI ALFABETICI*/ 
function ricercaPerCaratteri() {

    input = document.getElementById("ricercaIngredienti").value.toLowerCase().trim(); 

    var select = document.getElementById("elencoIngredienti");

    if(input.length==0){ 
        select.setAttribute('style', 'display: none')
    }
    else{
        select.setAttribute('style', 'display: block; z-index: 1; position: absolute; max-width: 966px')
    }

    lunghezzaInput = input.length; 
    var y = 0;
    
    document.getElementById('elencoIngredienti').innerHTML=``

    for(var d = 0; d < tuttiIngredienti.length; d++){

        var subIngrediente = tuttiIngredienti[d].substr(0,lunghezzaInput); 

        if(subIngrediente==input){
            y++;

            creaLista(tuttiIngredienti[d]);

            if(y < 5){
                select.setAttribute('size', y)
            }
        }
    }
    if(y==0){
        select.setAttribute('style', 'display: none')
    }
}

/*crea l'elenco di ingredienti da visualizzare sotto alla barra di ricerca a seconda dell'input inserito e filtrato tramite la funzione 'ricercaPerCaratteri' */ 
function creaLista(tuttiIngredienti){
 
    for(var z=0; z <= ingredientiScelti.length; z++){
        if(tuttiIngredienti==ingredientiScelti[z]){
            document.getElementById('elencoIngredienti').innerHTML+=`
            <option disabled id="${tuttiIngredienti}" value="${tuttiIngredienti}">${tuttiIngredienti}</option>
            `
            break;
        }
        else if(z==ingredientiScelti.length){
            document.getElementById('elencoIngredienti').innerHTML+=`
            <option id="${tuttiIngredienti}" value="${tuttiIngredienti}">${tuttiIngredienti}</option>
            `
        }
    }
    
}

/*----------------------------------------------------RISULTATI RICERCA----------------------------------------------------*/
var facile = false;
var medio = false;
var difficile = false;
var tempo1 = false;
var tempo2 = false;
var tempo3 = false;
var tempo4 = false;
var ricetteTrovate = 0;

/*funzione che filtra le ricette a seconda degli ingredienti inseriti dall'utente, facendo comparire solamente le ricette che hanno al loro interno quegli ingredienti*/ 
function trovaRicette(){
        
    document.getElementById('div4').setAttribute('style', 'display: none')

    ricetteTrovate = 0;
    var occorrenze = 0;

    document.getElementById('ricetteTrovate').innerHTML=``

    if(ricetteTrovate==0){
        document.getElementById('div1').setAttribute('style', 'display: none; height: 20rem; max-width: 90%; position:relative;');
    }
   
    checkboxDifficoltà();
    checkboxTempo();

    for(var a = 0; a < tutteRicette.length; a++){

        if(contatoreIngredientiScelti==0){
            trovaRicetteSenzaIngredienti(tutteRicette[a]);
        }
        else if(occorrenze==contatoreIngredientiScelti){

            if( (facile==true && medio==true && difficile==true) || (facile==false && medio==false && difficile==false) ){
                if( (tempo1==true && tempo2==true && tempo3==true && tempo4==true) || (tempo1==false && tempo2==false && tempo3==false && tempo4==false)){
                    ricetteTrovate++;
                    stampaRicetteTrovate(tutteRicette[a-1]);
                }
                else{
                    filtraTempo(tutteRicette[a-1]);
                }
            }
            else{
                filtraDifficoltà(tutteRicette[a-1]);
            }
            
        }

        occorrenze = 0;

        for(var b = 0; b < tutteRicette[a].Ingredienti.length; b++){

            for(var c = 0; c < ingredientiScelti.length; c++){

                if(ingredientiScelti[c]!=null){
                    if(tutteRicette[a].Ingredienti[b].NomeIngrediente.toLowerCase()==ingredientiScelti[c].toLowerCase()){
                        occorrenze++;
                    }
                }
            }
        }
    }
    
}

function trovaRicetteSenzaIngredienti(tutteRicette){
    
    checkboxDifficoltà();
    checkboxTempo();

    if( (facile==true && medio==true && difficile==true) || (facile==false && medio==false && difficile==false) ){
        if( (tempo1==true && tempo2==true && tempo3==true && tempo4==true) || (tempo1==false && tempo2==false && tempo3==false && tempo4==false)){
            ricetteTrovate++;
            stampaRicetteTrovate(tutteRicette);
        }
        else{
            filtraTempo(tutteRicette);
        }
    }
    else{
        filtraDifficoltà(tutteRicette);
    }
    
}

function checkboxDifficoltà(){
    if(document.getElementById("facile").checked){
        facile = true;
    }
    else{
        facile = false;
    }

    if(document.getElementById("medio").checked){
        medio = true;
    }
    else{
        medio = false;
    }

    if(document.getElementById("difficile").checked){
        difficile = true;
    }
    else{
        difficile = false;
    }
}

function checkboxTempo(){
    if(document.getElementById("tempo1").checked){
        tempo1 = true;
    }
    else{
        tempo1 = false;
    }

    if(document.getElementById("tempo2").checked){
        tempo2 = true;
    }
    else{
        tempo2 = false;
    }

    if(document.getElementById("tempo3").checked){
        tempo3 = true;
    }
    else{
        tempo3 = false;
    }

    if(document.getElementById("tempo4").checked){
        tempo4 = true;
    }
    else{
        tempo4 = false;
    }
}

function filtraDifficoltà(tutteRicette){
    if(tutteRicette.Difficoltà.toLowerCase()=='facile' && facile==true){
        filtraTempo(tutteRicette);
    }
    else if((tutteRicette.Difficoltà.toLowerCase()=='medio' || tutteRicette.Difficoltà.toLowerCase()=='media') && medio==true){
        filtraTempo(tutteRicette);
    }
    else if(tutteRicette.Difficoltà.toLowerCase()=='difficile' && difficile==true){
        filtraTempo(tutteRicette);
    }
}

function filtraTempo(tutteRicette){
    if( (tempo1==true && tempo2==true && tempo3==true && tempo4==true) || (tempo1==false && tempo2==false && tempo3==false && tempo4==false)){
        ricetteTrovate++;
        stampaRicetteTrovate(tutteRicette);
    }
    else{
        if((tutteRicette.Tempo >= 0 && tutteRicette.Tempo <= 20)  && tempo1==true){
            ricetteTrovate++;
            stampaRicetteTrovate(tutteRicette);
        }
        if((tutteRicette.Tempo > 20 && tutteRicette.Tempo <= 40)  && tempo2==true){
            ricetteTrovate++;
            stampaRicetteTrovate(tutteRicette);
        }
        if((tutteRicette.Tempo > 40 && tutteRicette.Tempo <= 60)  && tempo3==true){
            ricetteTrovate++;
            stampaRicetteTrovate(tutteRicette);
        }
        if(tutteRicette.Tempo > 60 && tempo4==true){
            ricetteTrovate++;
            stampaRicetteTrovate(tutteRicette);
        }
    }
}

function stampaRicetteTrovate(tutteRicette){

    if(ricetteTrovate==0){
        document.getElementById('div1').setAttribute('style', 'display: none; height: 20rem; max-width: 90%; position:relative;');
    }
    else if(ricetteTrovate==1 || ricetteTrovate==2){
        document.getElementById('div1').setAttribute('style', 'display: block; height: 16.5rem; max-width: 90%; position:relative;');
        
        firebase.firestore().collection('ricette').onSnapshot(function(snapshot){
            snapshot.forEach(async function(res){

                getGallery(res.id);

                if(res.data().Titolo==tutteRicette.Titolo){
                    if(tutteRicette.Descrizione.length < 175){
                        document.getElementById('ricetteTrovate').innerHTML+=`
                        <div class="col-lg-6">           
                            <div class="border-dark card my-2 mx-2" style="min-height: 94% !important;">
                                <h5 class="card-header bg-cioccolato text-white text-start">${tutteRicette.Titolo}
                                <i style="color: white;" id="cuore-${tutteRicette.Titolo}" onclick="addPreferito('${tutteRicette.Titolo}')" class="btn fas fa-heart"></i></h5>
                                
                                <div class="card-body bg-crema" style="position: relative;">
                                    <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                                        
                                    <div class="row mb-3">

                                        <div class="col-lg-4" id="immagine-${res.id}">
                                                                                                                
                                        </div>

                                        <div class="col-lg-8">
                                            <p style="height: 96px" class="text-muted" >${tutteRicette.Descrizione}</p>                                
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
                                            <b class="text-bold text-white bordoparola">Difficoltà: </b><span class="text-black" >${tutteRicette.Difficoltà}</span>
                                            <b class="text-bold text-white bordoparola"> | Tempo: </b><span class="text-black" >${tutteRicette.Tempo}</span>
                                            <b class="text-bold text-white bordoparola"> | Gusto: </b><span class="text-black" >${tutteRicette.Gusto}</span>
                                            </p>
                                        </div>

                                    </div>

                                    </a>
                                </div>

                            </div>
                        </div>
                        `
                    }
                    else{
                        document.getElementById('ricetteTrovate').innerHTML+=`
                        <div class="col-lg-6">
            
                                <div class="border-dark card my-2 mx-2" style="min-height: 94% !important;">
                                    <h5 class="card-header bg-cioccolato text-white text-start">${tutteRicette.Titolo}
                                    <i style="color: white;" id="cuore-${tutteRicette.Titolo}" onclick="addPreferito('${tutteRicette.Titolo}')" class="btn fas fa-heart"></i></h5>
                                    
                                    <div class="card-body bg-crema" style="position: relative;">
                                    <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                                    
                                        <div class="row mb-3">
                                            <div class="col-lg-4"  id="immagine-${res.id}">
                                            
                                            </div>
                                            <div class="col-lg-8">
                                                <p style="height: 96px" class="text-muted" >${tutteRicette.Descrizione.substr(0,175)}...</p>                                
                                            </div>                          
                                        </div>
                                        
                                        <div class="row" style="position: absolute; bottom: 4px; width: 100%;">
                                            <div class="col-lg-4 text-black">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                            </div>
                                            <div class="col-lg-8">
                                                <p class="card-text text-start ">
                                                <b class="text-bold text-bottom text-white bordoparola">Difficoltà: </b><span class="text-black" >${tutteRicette.Difficoltà}</span>
                                                <b class="text-bold text-white bordoparola"> | Tempo: </b><span class="text-black" >${tutteRicette.Tempo}</span>
                                                <b class="text-bold text-white bordoparola"> | Gusto: </b><span class="text-black" >${tutteRicette.Gusto}</span>
                                                </p>
                                            </div>
                                        </div>

                                        </a>
                                    </div>

                                </div>
                        </div>
                        `
                    }
                }
            })
        })      
    }
    else{
        document.getElementById('div1').setAttribute('style', 'display: block; height: 20rem; max-width: 90%; position:relative;');
        
        firebase.firestore().collection('ricette').onSnapshot(function(snapshot){
            snapshot.forEach(async function(res){

                getGallery(res.id);

                if(res.data().Titolo==tutteRicette.Titolo){
                    if(tutteRicette.Descrizione.length < 175){
                        document.getElementById('ricetteTrovate').innerHTML+=`
                        <div class="col-lg-6">           
                            <div class="border-dark card my-2 mx-2" style="min-height: 94% !important;">
                                <h5 class="card-header bg-cioccolato text-white text-center">${tutteRicette.Titolo}
                                <i style="color: white;" id="cuore-${tutteRicette.Titolo}" onclick="addPreferito('${tutteRicette.Titolo}')" class="btn fas fa-heart"></i></h5>
                                
                                <div class="card-body bg-crema" style="position: relative;">
                                    <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                                        
                                    <div class="row mb-3">

                                        <div class="col-lg-4" id="immagine-${res.id}">
                                                                                                                
                                        </div>

                                        <div class="col-lg-8">
                                            <p style="height: 96px" class="text-muted" >${tutteRicette.Descrizione}</p>                                
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
                                            <b class="text-bold text-white bordoparola">Difficoltà: </b><span class="text-black" >${tutteRicette.Difficoltà}</span>
                                            <b class="text-bold text-white bordoparola"> | Tempo: </b><span class="text-black" >${tutteRicette.Tempo}</span>
                                            <b class="text-bold text-white bordoparola"> | Gusto: </b><span class="text-black" >${tutteRicette.Gusto}</span>
                                            </p>
                                        </div>

                                    </div>

                                    </a>
                                </div>

                            </div>
                        </div>
                        `
                    }
                    else{
                        document.getElementById('ricetteTrovate').innerHTML+=`
                        <div class="col-lg-6">
            
                                <div class="border-dark card my-2 mx-2" style="min-height: 94% !important;">
                                    <h5 class="card-header bg-cioccolato text-white text-start">${tutteRicette.Titolo}
                                    <i style="color: white;" id="cuore-${tutteRicette.Titolo}" onclick="addPreferito('${tutteRicette.Titolo}')" class="btn fas fa-heart"></i></h5>
                                    
                                    <div class="card-body bg-crema" style="position: relative;">
                                    <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                                    
                                        <div class="row mb-3">
                                            <div class="col-lg-4"  id="immagine-${res.id}">
                                            
                                            </div>
                                            <div class="col-lg-8">
                                                <p style="height: 96px" class="text-muted" >${tutteRicette.Descrizione.substr(0,175)}...</p>                                
                                            </div>                          
                                        </div>
                                        
                                        <div class="row" style="position: absolute; bottom: 4px; width: 100%;">
                                            <div class="col-lg-4 text-black">
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                                <i class="fas fa-star"></i>
                                            </div>
                                            <div class="col-lg-8">
                                                <p class="card-text text-start ">
                                                <b class="text-bold text-bottom text-white bordoparola">Difficoltà: </b><span class="text-black" >${tutteRicette.Difficoltà}</span>
                                                <b class="text-bold text-white bordoparola"> | Tempo: </b><span class="text-black" >${tutteRicette.Tempo}</span>
                                                <b class="text-bold text-white bordoparola"> | Gusto: </b><span class="text-black" >${tutteRicette.Gusto}</span>
                                                </p>
                                            </div>
                                        </div>

                                        </a>
                                    </div>

                                </div>
                        </div>
                        `
                    }
                }
            })
        })      
    }

    addCuoricino();
}

async function stampaTutteRicette(){

    await firebase.firestore().collection('ricette').onSnapshot(function(snapshot){
        document.getElementById('stamparicette').innerHTML=``
        snapshot.forEach(async function(res){

            if(res.data().Descrizione.length < 175)
            {
                document.getElementById('stamparicette').innerHTML+=`
                <div class="col-lg-6">           
                    <div class="border-dark card my-2 mx-2" style="min-height: 94% !important;">
                        <h5 class="card-header bg-cioccolato text-white text-start">${res.data().Titolo}
                        <i style="color: white;" id="cuore-${res.data().Titolo}" onclick="addPreferito('${res.data().Titolo}')" class="btn fas fa-heart"></i></h5>
                        
                        <div class="card-body bg-crema" style="position: relative;">
                            <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                                
                            <div class="row mb-3">

                                <div class="col-lg-4" id="immagine-${res.id}">
                                                                                                        
                                </div>

                                <div class="col-lg-8">
                                    <p style="height: 96px" class="text-muted" >${res.data().Descrizione}</p>                                
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
                                    <b class="text-bold text-white bordoparola">Difficoltà: </b><span class="text-black" >${res.data().Difficoltà}</span>
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
            else{

                document.getElementById('stamparicette').innerHTML+=`
                <div class="col-lg-6">
            
                        <div class="border-dark card my-2 mx-2" style="min-height: 94% !important;">
                            <h5 class="card-header bg-cioccolato text-white text-start">${res.data().Titolo}
                            <i style="color: white;" id="cuore-${res.data().Titolo}" onclick="addPreferito('${res.data().Titolo}')" class="btn fas fa-heart"></i></h5>
                            
                            <div class="card-body bg-crema" style="position: relative;">
                            <a style="text-decoration: none;" href="Ricetta.html?ricetta=${res.id}" class="tile-link">
                               
                                <div class="row mb-3">
                                    <div class="col-lg-4"  id="immagine-${res.id}">
                                      
                                    </div>
                                    <div class="col-lg-8">
                                        <p style="height: 96px" class="text-muted" >${res.data().Descrizione.substr(0,175)}...</p>                                
                                    </div>                          
                                </div>
                                
                                <div class="row" style="position: absolute; bottom: 4px; width: 100%;">
                                    <div class="col-lg-4 text-black">
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
            addCuoricino();
            
        })        
    })
}

/*----------------------Pagina RICETTA singola-----------------*/

function funzione(){

    var url_string = window.location.href;
    var url = new URL(url_string);
    var param = url.searchParams.get('ricetta');

    firebase.firestore().collection('ricette').onSnapshot(function(snapshot){
        snapshot.forEach(async function(res){

            if(res.id==param){

                document.getElementById('sezione').innerHTML=``

                getImage(param);

                document.getElementById('sezione').innerHTML+=`
                <div class="container-fluid">
                    <div class="row">

                        <div class="bg-tirapiedi bordo-tirapiedi rounded shadow mx-auto py-3 px-5" style="width: 80%;">

                            <h1 style="margin-top: 1rem; margin-bottom: 1rem" class="text-center font-weight-bold">${res.data().Titolo}</h1>

                            <div class="row">
                                <div class="col-lg-5"  id="immagine-${res.id}">
                                        
                                </div>
            
                                <div  class="col-lg-7">
                                    <p align="justify">
                                    ${res.data().Descrizione}  
                                    </p>
                                </div>
                            </div>

                            <div class="row">

                                <div class="col-lg-8">

                                    <h3 class="text-center font-weight-bold mb-3" style="margin-top: 2.5rem;">Preparazione</h3>
                                    <p class="mx-auto" align="justify">
                                    ${res.data().Preparazione} 
                                    </p>
                                
                                </div>

                                <div class="col-lg-4">
                                    <div class="mx-auto ombra2 rounded" style="width: 80%; margin-top: 3rem; margin-bottom: 1rem; border: 2px solid black;"> 
                                        <p style="padding-left: 6px"><b>Difficoltà:</b> ${res.data().Difficoltà}</p> 
                                        <p style="padding-left: 6px"><b>Portata:</b> ${res.data().Portata}</p> 
                                        <p style="padding-left: 6px"><b>KCal:</b> ${res.data().KiloCalorie}</p> 
                                        <p style="padding-left: 6px;"><b>Tempo:</b> ${res.data().Tempo}</p>
                                        <table>
                                            <p class="font-weight-bold" style="padding-left: 8px;">
                                                Ingredienti:
                                            </p>
                                            <ol>
                                                ${res.data().Ingredienti.map((ingrediente, counter)=>{
                                                    return '<li style="padding-left: 10px;">'+ingrediente.NomeIngrediente+' x '+ingrediente.Quantità+'\n</li>'}).join('')}
                                            </ol>
                                        </table>
                                    </div>
                                </div>

                            </div>
                    
                        </div>
        
                    </div>
                </div>
            `

            document.getElementById('titolo').innerHTML = `6 Sapori - ${res.data().Titolo}`
            } 
        })
    })
}

/*-------------------Serve ad aggiungere ai preferiti una ricetta--------------*/

async function addPreferito(ricetta){

    doc = await firebase.firestore().collection('Utenti/').doc(uid).get();
     
    for(var a = -1; a < doc.data().Preferiti.length;  a++){

        if(doc.data().Preferiti[a]==ricetta){

            document.getElementById('cuore-'+ricetta).setAttribute('style', 'color: white');

            await firebase.firestore().collection('Utenti/').doc(uid).update({
                Preferiti: firebase.firestore.FieldValue.arrayRemove(ricetta)
            });

            break;
        }
        else if(a+1 == doc.data().Preferiti.length){

            document.getElementById('cuore-'+ricetta).setAttribute('style', 'color: red');

            await firebase.firestore().collection('Utenti/').doc(uid).update({
                Preferiti: firebase.firestore.FieldValue.arrayUnion(ricetta)
            });

        }
        
    }
              
}

function addCuoricino(){
    firebase.firestore().collection("Utenti/").doc(uid).get().then((doc) => {
        for(var a = 0; a < doc.data().Preferiti.length;  a++){
            if(document.getElementById('cuore-'+doc.data().Preferiti[a])){
                document.getElementById('cuore-'+doc.data().Preferiti[a]).setAttribute('style', 'color: red;');
            } 
        }
    })
}

/*------------------Servono per caricare immagini da firebase--------------------*/

async function getGallery(param){
    var storageRef = firebase.storage().ref('Immagini/' + param);
    storageRef.listAll()
    .then(function(result){
      result.items.forEach( async function(imageRef){
        await displayGallery(imageRef, param)
      });
    })
}

function displayGallery(imageRef, param){
    imageRef.getDownloadURL()
    .then(function(url){
      document.getElementById('immagine-'+param).innerHTML = `
        <div class="px-1 container" >
          <img src="${url}" alt="${url}" style="height: 100%; width: 100%" class="img-fluid card ombra2 border-0 hover-animate">
        </div>
      `
    })
}

async function getImage(param){
    var storageRef = firebase.storage().ref('Immagini/' + param);
    storageRef.listAll()
    .then(function(result){
      result.items.forEach( async function(imageRef){
        await displayImage(imageRef, param)
      });
    })
}

function displayImage(imageRef, param){
    imageRef.getDownloadURL()
    .then(function(url){
      document.getElementById('immagine-'+param).innerHTML = `
        <div class="col-8 container" style="height: 100%; width: 100%">
          <img src="${url}" alt="${url}" class="img-fluid card ombra2 border-0 hover-animate">
        </div>
      `
    })
}


