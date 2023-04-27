/*
  Toutes les comparaisons entre chaînes de caarctères
se font en les convertissant en miniscules de sorte à
comparer le contenu de celles-ci plutôt que la forme
*/

// Déclaration variables
let apiUrl; // Lien utilisé pour questionner l'api
let requete; // Type de recherche que l'on effectuera
let contenant; // Contenu de l'input
let option; // Variable qui sert à la création des datalist

// Attribution variables à chaque input
const input_codePostal = document.querySelector("#input_codePostal");
const input_ville = document.querySelector("#input_ville");

// Identification informations écrites dans input_codePostal
input_codePostal.addEventListener("input", checkCodePostal);
// Identification informations écrites dans input_ville
input_ville.addEventListener("input", function () {
  checkVille(event);
});
// Vérification validité du code postal
input_codePostal.addEventListener("blur", function (event) {
  event.target.form.reportValidity();
});

//
// Click sur le bouton
document.querySelector("#accesInfos").addEventListener("click", function () {
  // On remplace les espaces par des undescores (convention de wikipedia)
  contenant = input_ville.value.replaceAll(" ", "_");
  // On redirige l'utilisateur vers la page wikipedia qu'elle existe ou pas
  window.location.href = `https://fr.wikipedia.org/wiki/${contenant}`;
});

//
// Préparation recherche par code postal
function checkCodePostal(event) {
  // On récupére ce qu'a écrit l'utilisateur
  contenant = event.target.value;
  // On détermine si on cherche par département ou par commune
  switch (event.target.value.length) {
    case 2:
      // On détermine où on va chercher dans l'api
      requete = "departement";
      // On assigne l'url de l'api à une variable
      apiUrl = `https://geo.api.gouv.fr/departements/${contenant}/communes`;
      // On lance la fonction readApi()
      readApi(apiUrl, requete);
      break;
    case 5:
      // On détermine où on va chercher dans l'api
      requete = "codePostal";
      // On assigne l'url de l'api à une variable
      apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${contenant}`;
      // On lance la fonction readApi()
      readApi(apiUrl, requete);
      break;
  }
}
// Préparation de la recherche par ville
function checkVille(event) {
  // On récupére ce qu'a écrit l'utilisateur
  contenant = event.target.value;
  // On attend que l'utilisateur écrive deux lettres ou plus avant d'apeller l'api
  if (contenant.length > 1) {
    // On remplace les espaces apr des + (convention de l'api)
    contenant = contenant.replaceAll(" ", "+");
    // On détermine ce qu'on va chercher dans l'api (on l'utilisera dans readApi())
    requete = "nom";
    // On assigne l'url de l'api à une variable
    apiUrl = `https://geo.api.gouv.fr/communes?nom=${contenant}`;
    // On lance la fonction readApi()
    readApi(apiUrl, requete);
  }
}

// On lit les informations renvoyées par l'api
function readApi(apiUrl, requete) {
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
        // Recherche par nom de ville
        case "nom":
          verificationCodePostal(data);
          // input_codePostal.value = "";
          // parVille(data);
          break;
        // Recherche par numéro de département
        case "departement":
          // Si l'objet renvoyé par l'api est vide, on considére que le code postal n'existe pas
          if (data.length === 0) {
            // On remet l'input à zero
            input_codePostal.value = "";
            // On notifie que le département n'existe pas
            input_codePostal.placeholder = "Ce département n'existe pas";
          } else {
            parDepartement(data);
            break;
          }
        // Recherche par code postal
        case "codePostal":
          // Si l'objet renvoyé par l'api est vide, on considére que le code postal n'existe pas
          if (data.length === 0) {
            // On remet l'input à zero
            input_codePostal.value = "";
            // On notifie que le code postal n'existe pas
            input_codePostal.placeholder = "Ce code postal n'existe pas";
          } else {
            parCodePostal(data);
          }
          break;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
    });
}

// On determine une variable pour le select qui permet de choisir un code postal si plusieurs sont disponibles pour des situations particulières
let element = document.querySelector("#select_codePostal");
// On vérifie s'il y a un changement dans l'element 'select'
element.addEventListener("change", function () {
  // On met la valeur choisie dans l'input_codePostal
  input_codePostal.value = element.value;
  // On repasse l'element en invisible
  document.querySelector("#select_codePostal").style.visibility = "hidden";
  // Suppression des requêttes précédentes
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
});

// On détermine le code postal d'une ville depuis son nom
function verificationCodePostal(data) {
  // Déclaration variables locales
  let villesDoublons = [];
  let n = 0;
  // Suppression des requêttes précédentes
  while (datalist_ville.hasChildNodes()) {
    datalist_ville.removeChild(datalist_ville.lastChild);
  }
  // Recherche de villes ayant le même nom
  for (let i = 0; i < data.length; i++) {
    // On compare si le nom écrit dans input_ville est égal à ceux données par l'api
    if (input_ville.value.toLowerCase() == data[i].nom.toLowerCase()) {
      // On ajoute les villes correspondantes à notre liste
      villesDoublons[n] = data[i].nom;
      // On fera cela à chaque ville rencontrée
      n++;
    }
  }
  // Récupération des codes postaux de villes ayant le même nom
  if (villesDoublons.length > 1) {
    doublons(data, villesDoublons);
  } else {
    pasDeDoublons(data);
  }
  // On lance la fonction par ville
  parVille(data);
}
// On traite les doublons
function doublons(data, villesDoublons) {
  // Suppression des requêttes précédentes
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
  // On crée un élement option pour notre select
  option = document.createElement("option");
  // On le nomme choisir pour aider l'utilisateur
  option.textContent = "Choisir";
  // On l'ajoute à notre select
  element.append(option);
  // On parcours les données de l'api pour identifier les doublons
  for (let i = 0; i < data.length; i++) {
    let n = 0;
    // On compare chaque entrée pour trouver un doublon
    if (villesDoublons[n].toLowerCase() == data[i].nom.toLowerCase()) {
      // On crée un élement option pour notre select
      option = document.createElement("option");
      // On lui ajoute le code postal du doublon en question
      option.textContent = data[i].codesPostaux[0];
      // On l'ajoute à notre select
      element.append(option);
      n++;
    }
  }
  // On remet le select en invisible
  element.style.visibility = "visible";
}
// On récupère le code postal
function pasDeDoublons(data) {
  // On masque le select s'il n'y plus de doublons à la suite de la saisie
  document.querySelector("#select_codePostal").style.visibility = "hidden";
  // S'il n'y a pas de doublons
  for (let i = 0; i < data.length; i++) {
    // On cherche la ville correspondant à notre saisie
    if (data[i].nom.toLowerCase() == input_ville.value.toLowerCase()) {
      // On récupère son code postal
      input_codePostal.value = data[i].codesPostaux[0];
      break;
    } else {
      // On réinitialise l'input_codePosatl si aucune ville n'est trouvée
      input_codePostal.value = "";
    }
  }
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
    // On crée un élement option pour notre datalist
    option = document.createElement("option");
    // On lui ajoute le nom trouvé
    option.value = data[i].nom;
    // On l'ajoute à notre select
    datalist_ville.append(option);
  }
}
// On recherche dans le département
function parDepartement(data) {
  // Déclaration variables locales
  const datalist_codePostal = document.querySelector("#datalist_codePostal");
  const dataLength = data.length;

  // Suppresison des requêtes précedentes
  while (datalist_codePostal.hasChildNodes()) {
    datalist_codePostal.removeChild(datalist_codePostal.lastChild);
  }
  // Affichage dans une datalist les codes postaux
  for (let i = 0; i < dataLength; i++) {
    if (data[i].codesPostaux.length > 1) {
      for (let n = 0; n < data[i].codesPostaux.length; n++) {
        // On crée un élement option pour notre datalist
        option = document.createElement("option");
        // On lui ajoute le nom trouvé
        option.textContent = data[i].codesPostaux[n];
        // On l'ajoute à notre select
        datalist_codePostal.append(option);
      }
    }
    // On crée un élement option pour notre datalist
    option = document.createElement("option");
    // On lui ajoute le code postal trouvé
    option.textContent = data[i].codesPostaux[0];
    // On l'ajoute à notre datalist
    datalist_codePostal.append(option);
  }
}
// On recherche parmi les codes postaux
function parCodePostal(data) {
  input_ville.value = "";
  // Déclaration variables locales
  const datalist_ville = document.querySelector("#datalist_ville");
  const dataLength = data.length;
  // Suppression des requêttes précédentes
  while (datalist_ville.hasChildNodes()) {
    datalist_ville.removeChild(datalist_ville.lastChild);
  }

  if (dataLength == 1) {
    input_ville.value = data[0].nom;
  } else {
    // Affichage dans une datalist les villes ayant ce code postal
    for (let i = 0; i < dataLength; i++) {
      // On crée un élement option pour notre datalist
      option = document.createElement("option");
      // On lui ajoute le code postal trouvé
      option.textContent = data[i].nom;
      // On l'ajoute à notre datalist
      datalist_ville.append(option);
    }
    // On remplace le placeholder
    input_ville.placeholder = "Cliquez pour voir les villes";
    // On nomme la page en fonction du code postal choisi
    document.title = input_codePostal.value;
    // On switch sur l'input ville automatiquement
    input_ville.focus();
  }
}
