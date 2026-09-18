# Weather API

API TypeScript/Express qui transforme une adresse en prévisions météo horaires.

## Lancer le projet

```bash
npm install
npm run dev
```

### Avec Docker

```bash
docker compose up --build
```

L'API est alors disponible sur `http://localhost:3000` et peut être arrêtée avec :

```bash
docker compose down
```

Les fournisseurs sont configurables sans recompilation :

```bash
GEOCODER_PROVIDER=ban \
WEATHER_PROVIDER=met-norway \
MET_NORWAY_USER_AGENT='TP2-MeteoApi/1.0 prenom.nom@ecole.fr' \
docker compose up --build
```

Les valeurs disponibles sont `nominatim` ou `ban` pour le géocodage, et `open-meteo` ou `met-norway` pour la météo.

Puis appeler :

```bash
curl 'http://localhost:3000/weather?address=Paris'
```

La documentation interactive Swagger est disponible sur [http://localhost:3000/docs](http://localhost:3000/docs), et le document OpenAPI brut sur `http://localhost:3000/docs.json`.

La réponse contient l'adresse retenue par Nominatim, les coordonnées, le fuseau horaire et les données horaires `shortwave_radiation` fournies par Open-Meteo.

## Architecture

- `src/domain` contient les modèles et les ports (`Geocoder`, `WeatherProvider`).
- `src/application` contient le cas d'usage, indépendant d'Express et des services externes.
- `src/adapters/inbound/http` contient l'adaptateur HTTP Express et Swagger.
- `src/adapters/outbound` contient les adaptateurs Nominatim et Open-Meteo.
- `src/composition/container.ts` configure le conteneur IoC Awilix.
- `src/composition/config.ts` choisit les fournisseurs depuis les variables d'environnement, sans recompilation.
- `src/main.ts` est le point d'entrée : il résout l'application depuis le conteneur.

Les adaptateurs acceptent une URL de base et une fonction `fetch` injectées, ce qui permet de les tester sans réseau réel. Awilix gère l'assemblage et la durée de vie des dépendances ; remplacer un adaptateur se fait dans `src/composition/container.ts`.

## Vérification

```bash
npm test
npm run build
```

L'API renvoie `400` si `address` est absent, `404` si le lieu n'est pas trouvé et `502` si un service externe échoue.