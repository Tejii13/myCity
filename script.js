const input_codePostal = document.querySelector("#input_codePostal");
const input_ville = document.querySelector("#input_ville");
let apiUrl;
let codePostalLength;
let requete;

input_codePostal.addEventListener("input", checkCodePostal);
input_ville.addEventListener("input", checkVille);

function checkCodePostal(event) {
  let codePostalLength = event.target.value.length;
  if (codePostalLength === 5) {
    requete = event.target.value;
    apiUrl = `https://geo.api.gouv.fr/communes?codePostal=${requete}`;
    readApi(apiUrl);
  }
}
function checkVille(event) {
  let codePostalLength = event.target.value.length;
  requete = event.target.value;
  console.log(requete);
  apiUrl = `https://geo.api.gouv.fr/communes?nom=${requete}`;
  readApi(apiUrl);
}

function readApi(requete) {
  console.log(apiUrl);
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Ok 1");
      console.log(data[0].nom);
      test();
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation: ", error);
    });
}

function test(cp) {
  console.log("Ok 2");
}
