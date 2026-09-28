# API de signalement de bugs

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- SQLite (aucune installation séparée nécessaire : géré directement par la bibliothèque `better-sqlite3`, installée via `npm install`)

## Installation

```bash
npm install
```

## Configuration

Copie le fichier d'exemple puis remplis les valeurs si besoin (les valeurs par défaut fonctionnent telles quelles) :

```bash
cp .env.example .env
```

| Variable  | Rôle                                           | Exemple     |
| --------- | ---------------------------------------------- | ----------- |
| `PORT`    | Le port sur lequel le serveur écoute           | `3000`      |
| `DB_PATH` | Le chemin du fichier de base de données SQLite | `./bugs.db` |

## Lancer le serveur

```bash
npm start
```

L'API écoute sur `http://localhost:3000`.

## Base de données

**Choix retenu :** SQLite

**Pourquoi :** PostgreSQL n'était pas installé sur mon ordinateur, et le sujet autorisait SQLite dans ce cas. SQLite ne nécessite ni serveur à lancer ni configuration réseau, tout en restant une vraie base de données relationnelle qui respecte l'exigence de persistance des données.

La table `bugs` est créée automatiquement au démarrage du serveur : quand on lance `npm start`, `index.js` importe `db.js`, ce qui exécute la requête `CREATE TABLE IF NOT EXISTS` qu'il contient. Aucune commande manuelle n'est nécessaire.

## Tester les routes

### Créer un signalement

```bash
curl -X POST http://localhost:3000/bugs \
  -H "Content-Type: application/json" \
  -d '{"titre":"Le bouton ne répond pas","description":"Rien ne se passe au clic","severite":"haute"}'
```

### Lister les signalements

```bash
curl http://localhost:3000/bugs
curl "http://localhost:3000/bugs?statut=ouvert"
```

### Récupérer un signalement

```bash
curl http://localhost:3000/bugs/1
```

### Changer le statut

```bash
curl -X PATCH http://localhost:3000/bugs/1 \
  -H "Content-Type: application/json" \
  -d '{"statut":"en_cours"}'
```

### Supprimer

```bash
curl -X DELETE http://localhost:3000/bugs/1
```

## Codes HTTP renvoyés

| Code | Quand                                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------- |
| 201  | Un nouveau bug est créé avec succès (`POST /bugs`)                                                       |
| 400  | Titre vide, description absente, sévérité invalide (`POST /bugs`) ou statut invalide (`PATCH /bugs/:id`) |
| 404  | L'id demandé n'existe pas (`GET /bugs/:id`, `PATCH /bugs/:id`, `DELETE /bugs/:id`)                       |

## Vérification

Le script `verifier-mon-api.sh` a été lancé sur l'API : **13 tests réussis, 0 échoué**.

## Ce que je n'ai pas réussi

Tout fonctionne (13/13 au script de vérification), mais l'écriture des routes dans `bugs.js` m'a pris du temps, notamment la syntaxe des requêtes préparées avec `better-sqlite3` (les `?` à remplacer, l'ordre des valeurs dans `.run()`), et la logique de validation à mettre en place avant l'insertion en base (vérifier titre/description/severite dans le bon ordre, avec les bons codes HTTP).

## Temps passé

Environ 2h30
