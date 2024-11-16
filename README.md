# Todo App

Une API de gestion de tâches construite avec **Node.js**, **Express**, et **Sequelize** pour le backend.

## Prérequis

- [Node.js](https://nodejs.org/) (v14+)
- [npm](https://www.npmjs.com/) (inclus avec Node.js)
- [MySQL](https://www.mysql.com/) ou MariaDB

## Installation

1. Clonez le projet :  
   `git clone https://github.com/votre-utilisateur/votre-repo.git`  
   `cd votre-repo`

2. Installez les dépendances backend :  
   `npm install`

3. Configurez la base de données MySQL :  
   Créez une base nommée `todo`.  
   Ajoutez un fichier `.env` avec les infos de connexion :  
   `DB_HOST=localhost`  
   `DB_USER=root`  
   `DB_PASSWORD=root`  
   `DB_NAME=todo`  
   `DB_PORT=3306`

4. Lancez le serveur backend :  
   `npm start`

5. Configurez le frontend PHP (placez les fichiers dans un serveur web comme Apache).

## API Principale

- **Récupérer toutes les tâches :**  
  Méthode : `GET`  
  URL : `/tasks`  
  Paramètres optionnels : `title`, `page`, `limit`, `done`.

- **Ajouter une tâche :**  
  Méthode : `POST`  
  URL : `/tasks`  
  Corps :  
  `{ "title": "Nouvelle tâche", "description": "Description", "due_date": "2024-11-08", "type_id": 1 }`

- **Mettre à jour une tâche :**  
  Méthode : `PUT`  
  URL : `/tasks/:id`  
  Corps :  
  `{ "title": "Titre modifié", "done": true }`

- **Supprimer une tâche :**  
  Méthode : `DELETE`  
  URL : `/tasks/:id`

## Fonctionnalités

- Ajouter, modifier, supprimer des tâches.
- Filtrer les tâches par titre ou état.
- Pagination intégrée.
