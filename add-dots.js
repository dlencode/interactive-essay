// Fetch data from Google Firebase
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBX60bjMYjIHe3iBxgRAhUrnx0AVg883aw",
    authDomain: "interactive-essay.firebaseapp.com",
    databaseURL: "https://interactive-essay.firebaseio.com",
    projectId: "interactive-essay",
    storageBucket: "interactive-essay.appspot.com",
    messagingSenderId: "822835061",
    appId: "1:822835061:web:ba90bb3adf6bea2cd2453c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var countries = firebase.database().ref('countries');


var inputName = document.getElementById('countryName');
var inputPosition = document.getElementById('countryPosition');
var inputRadius = document.getElementById('countryRadius');
var inputColor = document.getElementById('countryColor');
var inputType = document.getElementById('countryType');
var inputHdi = document.getElementById('countryHdi');
var inputEf = document.getElementById('countryEf');
var inputRing = document.getElementById('countryRing');

var buttonAdd = document.getElementById('addCountry');

buttonAdd.addEventListener('click', function(e) {
    e.preventDefault();

    addNewCountry(inputName.value, inputPosition.value, inputColor.value, inputRadius.value, inputRing.value, inputType.value, inputHdi.value, inputEf.value);
    
    inputPosition.value++;
});

function addNewCountry(name, position, color, radius, ring, type, hdi, ef) {
    firebase.database().ref('countries/' + name).set({
        position: position,
        color: color,
        radius, radius,
        ring: ring,
        type: type,
        hdi: hdi,
        ef: ef
    });
}