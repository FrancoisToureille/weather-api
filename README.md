# Weather API

API TypeScript/Express qui transforme une adresse en prévisions météo horaires.

## Lancer avec Docker

Les dépendances, les tests et la compilation sont exécutés dans Docker. Il n'est donc pas nécessaire d'installer `node_modules` sur l'hôte.

Copier la configuration d'exemple si nécessaire :

```bash
cp .env.example .env
```

Puis remplacer le contact de `MET_NORWAY_USER_AGENT` par un email ou un site réel.

```bash
docker compose up --build
```

L'API est alors disponible sur `http://localhost:3000` et peut être arrêtée avec :

```bash
docker compose down
```

Le choix des fournisseurs se fait sans recompilation :

```bash
GEOCODER_PROVIDER=ban \
WEATHER_PROVIDER=met-norway \
MET_NORWAY_USER_AGENT='TP2-MeteoApi/1.0 votre.email@ecole.fr' \
docker compose up --build
```

Les valeurs disponibles sont `nominatim` ou `ban` pour le géocodage, et `open-meteo` ou `met-norway` pour la météo. Un `User-Agent` identifiable est obligatoire pour MET Norway.

Si l'utilisateur courant n'a pas encore rechargé son groupe Docker :

```bash
sg docker -c 'docker compose up --build'
```

Puis appeler :

```bash
curl 'http://localhost:3000/weather?address=Paris'
```

La documentation interactive Swagger est disponible sur [http://localhost:3000/docs](http://localhost:3000/docs), et le document OpenAPI brut sur `http://localhost:3000/docs.json`.

La réponse contient l'adresse normalisée, les coordonnées, le fuseau horaire et les prévisions horaires fournies par le fournisseur météo sélectionné.

## Architecture

- `src/domain` contient les modèles et les ports (`Geocoder`, `WeatherProvider`).
- `src/application` contient le cas d'usage, indépendant d'Express et des services externes.
- `src/adapters/inbound/http` contient l'adaptateur HTTP Express et Swagger.
- `src/adapters/outbound` contient les adaptateurs Nominatim et Open-Meteo.
- `src/composition/container.ts` configure le conteneur IoC Awilix.
- `src/composition/config.ts` choisit les fournisseurs depuis les variables d'environnement, sans recompilation.
- `src/main.ts` est le point d'entrée : il résout l'application depuis le conteneur.

Le flux dépend uniquement des ports :

```text
HTTP -> cas d'usage -> Geocoder / WeatherProvider
			 ^                 ^
			 |                 |
		 BAN ou Nominatim   MET Norway ou Open-Meteo
```

Les adaptateurs acceptent une URL de base et une fonction `fetch` injectées, ce qui permet de les tester avec des bouchons HTTP sans réseau réel. Les DTO propres à BAN, Nominatim, MET Norway et Open-Meteo restent confinés à leurs adaptateurs. Awilix gère l'assemblage et la durée de vie des dépendances.

Ajouter un fournisseur consiste à implémenter un port, ajouter l'adaptateur dans `src/adapters/outbound` et l'enregistrer dans `src/composition/container.ts`. Le domaine et le cas d'usage ne changent pas.

## Tests et compilation

Les tests sont exécutés automatiquement pendant le build Docker :

```dockerfile
RUN npm test && npm run build
```

La suite comprend :

- tests unitaires du cas d'usage ;
- tests end-to-end HTTP de `GET /weather` et de Swagger ;
- tests de contrat communs pour BAN/Nominatim et MET Norway/Open-Meteo ;
- tests des réponses vides, adresses accentuées, erreurs HTTP et du `User-Agent` MET Norway.

Pour exécuter les vérifications dans Docker :

```bash
sg docker -c 'docker compose build --no-cache'
```

L'API renvoie `400` si `address` est absent, `404` si le lieu n'est pas trouvé et `502` si un service externe échoue.