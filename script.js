// Déclaration variables
let apiUrl; // Lien de pour questionner l'api
let requete; // Type de recherche
let contenant; // Contenu de l'input
let option;

// Attribution variables à chaque input
const input_codePostal = document.querySelector("#input_codePostal");
const input_ville = document.querySelector("#input_ville");

// Identification informations écrites
input_codePostal.addEventListener("input", checkCodePostal);
input_ville.addEventListener("input", checkVille);

// Vérification validité du code postal
function checkCodePostal(event) {
  // Récupération longueuer code postal
  // if (event.target.value.length === 5) {
  // On récupére ce qu'a écrit l'utilisateur
  contenant = event.target.value;
  // On détermine où on va chercher dans l'api
  requete = "codePostal";
  // On assigne l'url de l'api à une variable
  apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${contenant}`;
  // On lance la fonction readApi()
  readApi(apiUrl, requete);
  // }
}
// Vérification validité de la ville
function checkVille(event) {
  // On récupére ce qu'a écrit l'utilisateur
  contenant = event.target.value;
  if (contenant.length > 2) {
    contenant = contenant.replaceAll(" ", "+");
    // On détermine où on va chercher dans l'api
    requete = "nom";
    // On assigne l'url de l'api à une variable
    apiUrl = `https://geo.api.gouv.fr/communes?nom=${contenant}`;
    // On lance la fonction readApi()
    readApi(apiUrl, requete);
  }
}

// On lit les informations renvoyées par l'api
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
      // Choix du type de recherche
      switch (requete) {
        case "nom":
          parVille(data);
          break;
        case "codePostal":
          parCodePostal(data);
          break;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
    });
}

// On recherche parmi les villes
function parVille(data) {
  // Déclaration variables lcoales
  const datalist_ville = document.querySelector("#datalist_ville");
  const dataLength = data.length;

  // Suppression des requêttes précédentes
  while (datalist_ville.hasChildNodes()) {
    datalist_ville.removeChild(datalist_ville.lastChild);
  }

  // Affichage dans une datalist de toutes les villes correspondantes
  for (let i = 0; i < dataLength; i++) {
    option = document.createElement("option");
    option.value = data[i].nom;
    datalist_ville.append(option);
    input_codePostal.value = data[i].codesPostaux[0];
  }
}
// On recherche parmi les codes postaux
function parCodePostal(data) {
  // Déclaration variables locales
  const datalist_codePostal = document.querySelector("#datalist_codePostal");
  const dataLength = data.length;

  // Suppression des requêttes précédentes
  while (datalist_codePostal.hasChildNodes()) {
    console.log("While");
    datalist_codePostal.removeChild(datalist_codePostal.lastChild);
  }

  // Affichage dans une datalist les villes ayant ce code postal
  for (let i = 0; i < dataLength; i++) {
    option = document.createElement("option");
    option.value = data[i].nom;
    datalist_codePostal.append(option);
    // for (let n = 0; n < data[i].codesPostaux.length; n++) {
    //   console.log("For");
    // }
  }
  input_ville.value = data[0].nom;
}
