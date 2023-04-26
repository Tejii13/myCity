// Déclaration variables
let apiUrl; // Lien de pour questionner l'api
let requete; // Type de recherche
let contenant; // Contenu de l'input

// Attribution variables à chaque input
const input_codePostal = document.querySelector("#input_codePostal");
const input_ville = document.querySelector("#input_ville");

// Identification informations écrites
input_codePostal.addEventListener("input", checkCodePostal);
input_ville.addEventListener("input", checkVille);

// Vérification validité du code postal
function checkCodePostal(event) {
  // Récupération longueuer code postal
  if (event.target.value.length === 5) {
    contenant = event.target.value;
    requete = "codePostal";
    apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${contenant}`;
    readApi(apiUrl, requete);
  }
}
function checkVille(event) {
  contenant = event.target.value;
  requete = "nom";
  apiUrl = `https://geo.api.gouv.fr/communes?nom=${contenant}`;
  readApi(apiUrl, requete);
}

function readApi(apiUrl, requete) {
  console.log(apiUrl);
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Requete: " + requete);
      switch (requete) {
        case "nom":
          parVille();
          break;
        case "codePostal":
          parCodePostal();
          break;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
    });
}

function parVille() {
  console.log("Recherche par ville");
}
function parCodePostal() {
  console.log("Recherche par code postal");
}
