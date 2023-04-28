/*
  Toutes les comparaisons entre chaînes de caractères
se font en les convertissant en minuscules de sorte à
comparer le contenu de celles-ci plutôt que la forme
*/

// Déclaration variables
let apiUrl; // Lien utilisé pour questionner l'api
let requete; // Type de recherche que l'on effectuera
let contenant; // Contenu de l'input
let option; // Variable qui sert à la création des datalist
let isValid = new Boolean();

// Attribution variables à chaque input
const INPUT_CODEPOSTAL = document.querySelector("#input_codePostal");
const INPUT_VILLE = document.querySelector("#input_ville");
// On determine une variable pour le select qui permet de choisir un code postal si plusieurs sont disponibles pour des situations particulières
let element = document.querySelector("#select_codePostal");

// Identification informations écrites dans input_codePostal
INPUT_CODEPOSTAL.addEventListener("input", recupCodePostal);
// Identification informations écrites dans input_ville
INPUT_VILLE.addEventListener("input", recupVille);
// Vérification validité du code postal
INPUT_CODEPOSTAL.addEventListener("blur", function (event) {
  event.target.form.reportValidity();
});

// Click sur le bouton
document.querySelector("#accesInfos").addEventListener("click", function () {
  // On remplace les espaces par des undescores (convention de wikipedia)
  contenant = INPUT_VILLE.value.replaceAll(" ", "_");
  // On redirige l'utilisateur vers la page wikipedia qu'elle existe ou pas
  window.location.href = `https://fr.wikipedia.org/wiki/${contenant}`;
});
// On vérifie s'il y a un changement dans l'element 'select'
element.addEventListener("change", function () {
  // On met la valeur choisie dans l'input_codePostal
  INPUT_CODEPOSTAL.value = element.value;
  // On repasse l'element en invisible
  document.querySelector("#select_codePostal").style.visibility = "hidden";
  // Suppression des requêtes précédentes
  while (element.hasChildNodes()) {
    element.removeChild(element.lastChild);
  }
});

// Préparation recherche par code postal
function recupCodePostal(event) {
  // On récupère ce qu'a écrit l'utilisateur
  // Si l'objet renvoyé par l'api est vide, on considére que le code postal n'existe pas
  if (INPUT_CODEPOSTAL.value >= 96 && INPUT_CODEPOSTAL.length == 2) {
    // On remet l'input à zero
    INPUT_CODEPOSTAL.value = "";
    // On notifie que le département n'existe pas
    INPUT_CODEPOSTAL.placeholder = "Ce département n'existe pas";
  } else {
    switch (event.target.value.length) {
      case 2:
        // On détermine où on va chercher dans l'api
        requete = "departement";
        contenant = INPUT_CODEPOSTAL.value;
        // On assigne l'url de l'api à une variable
        apiUrl = `https://geo.api.gouv.fr/departements/${contenant}/communes?fields=nom,codesPostaux`;
        // On lance la fonction readApi()
        readApi(apiUrl, requete);
        break;
      case 5:
        // On détermine où on va chercher dans l'api
        requete = "codePostal";
        contenant = INPUT_CODEPOSTAL.value;
        // On assigne l'url de l'api à une variable
        apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${contenant}&fields=nom,codesPostaux`;
        // On lance la fonction readApi()
        readApi(apiUrl, requete);
        break;
      default:
        INPUT_VILLE.value = "";
        while (element.hasChildNodes()) {
          element.removeChild(element.lastChild);
        }
        document.querySelector("#select_codePostal").style.visibility =
          "hidden";
    }
  }
}
// Préparation de la recherche par ville
function recupVille(event) {
  // On récupére ce qu'a écrit l'utilisateur
  contenant = event.target.value;
  // On attend que l'utilisateur écrive deux lettres ou plus avant d'apeller l'api
  if (contenant.length > 1) {
    // On remplace les espaces apr des + (convention de l'api)
    contenant = contenant.replaceAll(" ", "+");
    // On détermine ce qu'on va chercher dans l'api (on l'utilisera dans readApi())
    requete = "nom";
    // On assigne l'url de l'api à une variable
    apiUrl = `https://geo.api.gouv.fr/communes?nom=${contenant}&fields=nom,codesPostaux`;
    // On lance la fonction readApi()
    readApi(apiUrl, requete);
  } else if (!isValid) {
    // On remet l'input_codePostal à zéro s'il n'a pas été validé
    INPUT_CODEPOSTAL.value = "";
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
          verificationDoublons(data);
          break;
        // Recherche par numéro de département
        case "departement":
          // Si l'objet renvoyé par l'api est vide, on considére que le code postal n'existe pas
          parDepartement(data);
          break;
        // Recherche par code postal
        case "codePostal":
          // Si l'objet renvoyé par l'api est vide, on considére que le code postal n'existe pas
          if (data.length === 0) {
            // On remet l'input à zero
            INPUT_CODEPOSTAL.value = "";
            // On notifie que le code postal n'existe pas
            INPUT_CODEPOSTAL.placeholder = "Ce code postal n'existe pas";
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

// On détermine le code postal d'une ville depuis son nom
function verificationDoublons(data) {
  // Déclaration variables locales
  let doublons = [];
  let n = 0;
  // Suppression des requêttes précédentes
  while (datalist_ville.hasChildNodes()) {
    datalist_ville.removeChild(datalist_ville.lastChild);
  }
  // Recherche de villes ayant le même nom
  for (let i = 0; i < data.length; i++) {
    // On compare si le nom écrit dans input_ville est égal à ceux données par l'api
    if (INPUT_VILLE.value.toLowerCase() == data[i].nom.toLowerCase()) {
      // On ajoute les villes correspondantes à notre liste
      doublons[n] = data[i].nom;
      // On fera cela à chaque ville rencontrée
      n++;
    }
  }
  // Récupération des codes postaux de villes ayant le même nom
  if (doublons.length > 1) {
    villesDoublons(data, doublons);
  } else {
    villesPasDoublons(data);
  }
  // On lance la fonction par ville
  parVille(data);
}
// On traite les doublons
function villesDoublons(data, Doublons) {
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
    if (Doublons[n].toLowerCase() == data[i].nom.toLowerCase()) {
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
function villesPasDoublons(data) {
  // On masque le select s'il n'y plus de doublons à la suite de la saisie
  document.querySelector("#select_codePostal").style.visibility = "hidden";
  // S'il n'y a pas de doublons
  for (let i = 0; i < data.length; i++) {
    // On cherche la ville correspondant à notre saisie
    if (data[i].nom.toLowerCase() == INPUT_VILLE.value.toLowerCase()) {
      // On récupère son code postal
      INPUT_CODEPOSTAL.value = data[i].codesPostaux[0];
      break;
    } else if (!isValid) {
      // On réinitialise l'input_codePosatl si aucune ville n'est trouvée et qu'il n'y a pas de code postal d'écrit
      INPUT_CODEPOSTAL.value = "";
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
  INPUT_VILLE.value = "";
  // Déclaration variables locales
  const datalist_ville = document.querySelector("#datalist_ville");
  const dataLength = data.length;
  // Suppression des requêttes précédentes
  while (datalist_ville.hasChildNodes()) {
    datalist_ville.removeChild(datalist_ville.lastChild);
  }

  if (dataLength == 1) {
    INPUT_VILLE.value = data[0].nom;
    isValid = true;
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
    INPUT_VILLE.placeholder = "Cliquez pour voir les villes";
    // On nomme la page en fonction du code postal choisi
    document.title = INPUT_CODEPOSTAL.value;
    // On switch sur l'input ville automatiquement
    if (INPUT_CODEPOSTAL.value != "") {
      INPUT_VILLE.focus();
      isValid = true;
    }
  }
}
