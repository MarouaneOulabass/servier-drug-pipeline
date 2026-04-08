# PhoneVS - Comparateur de Téléphones Premium

Application web de comparaison de téléphones pour affichage en magasin.
Design premium dark theme optimisé pour les écrans TV.

## Démarrage rapide

1. **Ouvrir l'application** : Ouvrez `index.html` dans un navigateur (Chrome/Edge recommandé)
2. **Charger les données** : Cliquez sur "Charger Excel" et sélectionnez votre fichier `.xlsx`
3. **Sélectionner les téléphones** : Cliquez sur les cartes pour les ajouter à la comparaison
4. **Comparer** : Cliquez sur le bouton "Comparer" dans la barre flottante

## Fichier Excel

### Générer le fichier de test

```bash
pip install openpyxl
python generate_sample_data.py
```

### Format attendu

Le fichier Excel doit contenir une feuille avec les colonnes suivantes (les noms sont flexibles) :

| Colonne | Exemples acceptés |
|---------|-------------------|
| Marque | Marque, Brand |
| Modèle | Modèle, Model, Nom |
| Prix (€) | Prix, Price |
| Image URL | Image URL, Image, Photo |
| Écran (pouces) | Écran, Screen |
| Résolution | Résolution, Resolution |
| Processeur | Processeur, CPU, Chipset |
| RAM (Go) | RAM, Mémoire vive |
| Stockage (Go) | Stockage, Storage |
| Batterie (mAh) | Batterie, Battery |
| Appareil Photo Principal (MP) | Caméra principale |
| Appareil Photo Frontal (MP) | Caméra frontale, Selfie |
| 5G | 5G (Oui/Non) |
| Poids (g) | Poids, Weight |
| OS | OS, Système |
| Couleurs | Couleurs, Colors |
| Note /10 | Note, Rating |
| Indice Réparabilité /10 | Réparabilité |

## Fonctionnalités

- Lecture de fichiers Excel (.xlsx) côté client
- Grille de téléphones avec images et specs clés
- Filtrage par marque et recherche textuelle
- Comparaison côte à côte jusqu'à 6 téléphones
- Mise en valeur des meilleures/pires specs
- Barres de score animées pour les notes
- Design glassmorphism avec animations fluides
- Optimisé pour affichage TV (1920px+)
- Raccourcis clavier : Entrée (comparer), Échap (retour)
- 100% client-side, aucun serveur requis

## Technologies

- HTML5 / CSS3 / JavaScript vanilla
- [SheetJS (xlsx)](https://sheetjs.com/) pour la lecture Excel
- Google Fonts (Inter, Space Grotesk)
