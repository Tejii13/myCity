# myCity

## Consigne

### Evaluation JS

> Créer un formulaire avec un fieldset contenant un champ permettant de saisir un
code postal et un champ permettant de saisir la ville. Le champ de la ville
s'auto-remplit avec la liste des villes ayant ce code postal dès qu'un code
postal complet est saisi. La première ville de la liste est auto-sélectionnée.

### Environnement technique

> Le projet est enregistré sur Git et utilise Bootstrap si possible (fortement
recommandé).

### Choix des éléments

> Le champ de saisie du code postal est un champ texte avec une contrainte sur le
format (5 chiffres dont le premier peut être un 0). Le champ de saisie de la
ville est à déterminer.

### Choix de l'événement

> La recherche des villes correspondant au code postal saisi doit se faire dès que
possible et sans action particulière autre que la saisie du cinquième chiffre.

### Recherche de l'API

> Une API de l'INSEE permet de retrouver la ou les villes ayant un code postal
donné.

### Validation

> Chaque étape du projet doit être validée après avoir été poussée sur Git :

- la maquette HTML ;
- le JS correspondant à l'événement choisi ;
- le choix de l'API, renseigné dans le README ;
- le JS de la recherche des villes.

## Exercice

### Maquette

J'ai mis un input dédié au code postal et un deuxième dédié à la ville. En écrivant le code postale, nous devrions avoir des propositions nous permettant d'y acceder directement. On pourra remplacer les codes postaux par des villes afin de remplir l'input dédié rapidement.

### Evenement JavaScript

On utilisera un evenement "input" avec un addEventListener. Chaque fois que l'utilisateur écrit quoi que ce soit, les informations seront analysées. Quelque soit le champ rempli par l'utilisateur, on pourra lui donner une réponsE.

### Choix de l'API

J'ai trouvé cet API qui semble correspondre à ce que l'on veut faire :
<https://api.gouv.fr/les-api/api-geo>
