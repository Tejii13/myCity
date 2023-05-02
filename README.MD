# myCity

## HTML

> On a une page très simple avec un paragraphe, deux inputs ayant chacun leur label, un bouton et un element select qui sera affiché que quand nécessaire. On utilise Bootstrap pour la mise en forme.

## JavaScript

### Organisation du code

> On déclare les variables locales au début pour qu'elles soient facilement accessibles, ensuite on aura accès aux événements qui déclencheront les scripts à proprement parler. Chaque fonctionnalité aura sa fonction dédiée et même des sous-fonctions pour une meilleure compréhension du code.

### Variables

> Nous avons 6 variables globales :

* variable - apiUrl : Servira à récupérer l'url que l'on utilisera pour interroger l'api
* variable - requette : Servira à enregistrer une chaîne de caractères qui déterminera le type de recherche que l'on fera, elle permettra de changer l'url utilisée en fonctionne de ce que veut l'utilisateur
* variable - contenant : Servira à enregistrer ce qu'a tapé l'utilisateur dans les inputs.
* variable - option : Servira à créer de façon dynamique les options présentes dans les éléments datalist et select
* boolean - isValid : Servira à déterminer si  le code postal est valide ce qui le verrouillera en tapant la ville.

> Et 3 constantes :

* INPUT_CODEPOSTAL : Fais le lien avec un élément input dédié au code postale dans le html
* INPUT_VILLE : Fais le lien avec un élément input dédié à la ville dans le html
* element : Fait le lien avec un élément select qui s'affiche quand plusieurs villes ont le même nom

### Event Listeners

### Bugs connus

* None (mais il y en a)
