# Actions disponibles 

## Start || Reset

Ces actions vont permettre de démarrer le jeu, en initialisant le jeu avec les valeurs par défaut.

### Paramètres

- Aucun

### Exemple(s) d'utilisation 

- `<action name="reset"/>`
- `<action name="start"/>`

## Hit

Permet d'infliger un dommage au joueur.

### Paramètres

- Aucun

### Exemple(s) d'utilisation

- `<action name="hit"/>`

## ItemUpdate

Permet de mettre à jour l'inventaire, en ajoutant ou mettant à jour les éléments.

Il n'est pas possible de supprimer un élément.

### Paramètres

- item : Le nom de l'item que l'on va gagner.
- count : Le nombre d'item gagné. Si cette valeur est négative, l'item sera décrémenté.

### Exemple(s) d'utilisation

- `<action name="itemUpdate" item="résonateur" count="10"/>` 
    - Va ajouter 10 résonateurs à l'inventaire
- `<action name="itemUpdate" item="résonateur" count="-5"/>`
    - Va ajouter 5 résonateurs de l'inventaire
    
## Glyph

Permet de lancer un mini-jeu de glyph.

Ce jeu est un mémo, qui séléctionne n images, leur attribue un ordre aléatoire, affiche un message d'aide ainsi que la solution pendant un court délai,
et laisse l'utilisateur retracer l'ordre.

L'utilisateur gagne des items en réussissant un glyph, mais perds de la vie, et une partie du gain, si jamais il se trompe dans l'ordre.

### Paramètres

- level : Le nombre d'image à inclure dans le jeu.
- itemWon : L'item que l'on gagne une fois le jeu réussi.
- time : Temps durant lequel la solution est affichée avant le début du jeu.
- itemCount : Le nombre d'item que l'on gagne. 
    - Attention : Dans le cas ou l'on doit recommencer plusieurs fois le jeu de glyph, la valeur sera progressivement décrémentée. Ainsi, le gain sera moindre pour une personne recommençant de nombreuses fois le glyph.

### Exemple(s) d'utilisation

- `<action name="glyph" level="4" itemWon="CeQueJeGagne" itemCount="LaQuantiteGagnee" time="2500"/>`

## cssUpdate

Permet de mettre à jour le CSS. 

### Paramètres

- element : L'element sur lequel appliquer la modification CSS. Le paramètre peut être n'importe quel sélecteur CSS valide.
- rule : La règle CSS à appliquer
- value : La valeur à appliquer à la règle CSS.

### Exemple(s) d'utilisation

- `<action name="cssUpdate" element="body" rule="background-color" value="blue"/>`

## setAgentName

Permet de définir le nom de l'agent, via une fenêtre de dialogue. 

Si le joueur ne définit pas son nom, un nom aléatoire lui sera attribué.
 
Une fois la valeur définie, elle sera affichée dans le selecteur CSS renseigné.

### Paramètres

- message : Le message à afficher dans la fenêtre modale.
- showInto : Le sélecteur CSS ou afficher le nom du joueur.

### Exemple(s) d'utilisation

- `<action name="setAgentName" message="Entrer votre nom d'agent." showInto=".agentName"/>`

## image

Permet d'ajouter, de supprimer ou de mettre à jour des images.

Cette fonctionnalité n'est pas encore totalement opérationnelle.
