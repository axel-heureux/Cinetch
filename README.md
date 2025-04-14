# 🎬 Cinetech

Cinetech est une application web de bibliothèque de films et séries, développée à partir de l’API publique **The Movie Database (TMDB)**. L’objectif est de permettre à l’utilisateur de découvrir, consulter et organiser des films et séries à son image, tout en profitant d'une interface moderne, responsive et intuitive.

## 🚀 Fonctionnalités principales

- **Page d’accueil** :
  - Sélections personnalisées de films et de séries.
  
- **Pages de catégories** :
  - Liste complète de **films** avec pagination.
  - Liste complète de **séries** avec pagination.

- **Pages de détail** :
  - Fiches détaillées pour chaque film ou série (réalisateur, genres, pays d’origine, résumé, casting...).
  - Suggestions de contenus similaires (films et séries).

- **Favoris (via LocalStorage)** :
  - Ajout et gestion de favoris (films et séries).
  - Page dédiée pour retrouver ses éléments favoris.

- **Commentaires** :
  - Affichage des commentaires depuis l’API TMDB.
  - Ajout de commentaires personnalisés et réponses aux commentaires (stockés en localStorage).

- **Recherche intelligente** :
  - Barre de recherche intégrée dans le header.
  - Système d’autocomplétion en JavaScript asynchrone.

- **Responsive design** :
  - Interface adaptée aux écrans **desktop** et **mobiles**.

## 🛠️ Technologies utilisées

- **HTML5 / CSS3 / JavaScript**
- **API Fetch** pour récupérer les données depuis TMDB
- **LocalStorage** pour la gestion des favoris et commentaires utilisateurs
- **Responsive Design** avec Media Queries

## 📦 Installation

1. Cloner le projet :
   ```bash
   git clone https://github.com/prenom-nom/cinetech.git
