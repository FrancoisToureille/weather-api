# Licence audit

Audit réalisé avec `license-checker` sur les dépendances directes et transitives du projet.

Le fichier brut est [licenses.json](licenses.json). Le scan porte sur le lockfile installé avec `npm ci`.

## Classification

| Famille | Licences détectées | Nombre de paquets | Décision |
| --- | --- | ---: | --- |
| Permissive | MIT | 185 | Acceptée |
| Permissive | Apache-2.0 | 6 | Acceptée |
| Permissive | ISC | 17 | Acceptée |
| Permissive | BSD-3-Clause | 4 | Acceptée |
| Copyleft faible | MPL-2.0 | 3 | Acceptée après revue, voir la décision ci-dessous |
| Propriétaire | Aucune | 0 | N/A |
| Non identifiée | Aucune | 0 | N/A |
| Copyleft fort | GPL, AGPL, LGPL | 0 | Bloquée par la CI |

## Décision MPL-2.0

### `lightningcss`, `lightningcss-linux-x64-gnu`, `lightningcss-linux-x64-musl`

- **Position exacte** : dépendances transitives de développement, absentes des dépendances directes de `package.json` :
	- `weather-api` → `vitest` → `vite` → `lightningcss` : profondeur 3 ;
	- `weather-api` → `vitest` → `vite` → `lightningcss` → `lightningcss-linux-x64-gnu` : profondeur 4 ;
	- `weather-api` → `vitest` → `vite` → `lightningcss` → `lightningcss-linux-x64-musl` : profondeur 4.
- Elles ne sont pas embarquées par le runtime `npm ci --omit=dev`.
- **Licence** : MPL-2.0, copyleft faible au niveau des fichiers.
- **Stratégie** : conserver après revue et isoler derrière les outils de build existants.
- **Justification** : ces paquets sont confinés à la chaîne de développement et n’entrent pas dans le cœur métier ni dans les adapters runtime. Le remplacement serait possible par un outil de build équivalent si la politique du projet interdisait MPL-2.0.

Cette exception est explicite et limitée à `MPL-2.0`. Toute licence GPL, AGPL, LGPL, inconnue ou absente de la whitelist fait échouer l’audit.

## Commandes

```bash
npx --yes license-checker --json > licenses.json
node scripts/check-licenses.js licenses.json
```