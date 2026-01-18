# Skema MCP Server

[![npm version](https://img.shields.io/npm/v/@skemacms/mcp-server.svg)](https://www.npmjs.com/package/@skemacms/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Serveur MCP (Model Context Protocol) officiel pour **Skema CMS**.  
Connectez Claude Desktop, Cursor, Windsurf ou tout client MCP compatible à vos données Skema.

## Installation

```bash
npm install -g @skemacms/mcp-server
```

## Configuration

### Claude Desktop

Ajoutez dans votre fichier `claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "skema-cms": {
      "command": "skema-mcp",
      "env": {
        "SKEMA_API_KEY": "pk_live_votre_cle_api",
      }
    }
  }
}
```

### Windsurf / Cursor

Ajoutez dans vos paramètres MCP :

```json
{
  "skema-cms": {
    "command": "npx",
    "args": ["-y", "@skemacms/mcp-server"],
    "env": {
      "SKEMA_API_KEY": "pk_live_votre_cle_api",
    }
  }
}
```

## Variables d'environnement

| Variable         | Description                                             | Requis |
| ---------------- | ------------------------------------------------------- | ------ |
| `SKEMA_API_KEY`  | Clé API Skema (format `pk_live_xxx`)                    | Oui    |

## Outils disponibles (11 outils)

### Lecture

| Outil                     | Description                                                    |
| ------------------------- | -------------------------------------------------------------- |
| `get_collections`         | Liste toutes les collections accessibles                       |
| `get_collection`          | Récupère le schéma d'une collection (champs, types, relations) |
| `get_collection_items`    | Liste les items avec pagination, tri, filtres et populate      |
| `get_collection_item`     | Récupère un item par son ID avec ses relations                 |
| `search_collection_items` | Recherche textuelle dans une collection                        |
| `count_collection_items`  | Compte les items avec filtres optionnels                       |

### Écriture

| Outil                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `create_collection_item` | Crée un nouvel item                             |
| `update_collection_item` | Met à jour un item existant (merge partiel)     |
| `delete_collection_item` | Supprime un item                                |
| `batch_create_items`     | Crée plusieurs items en une seule requête       |
| `batch_update_items`     | Met à jour plusieurs items en une seule requête |

## Exemples d'utilisation

### Lister les collections

```
Quelles collections sont disponibles dans mon CMS ?
```

### Récupérer des items avec relations

```
Liste les 10 derniers articles avec leurs auteurs et catégories
```

### Créer un item

```
Crée un nouvel article avec le titre "Mon article" et le statut "draft"
```

### Recherche

```
Recherche les produits contenant "smartphone" dans le titre
```

### Opérations en masse

```
Mets à jour le statut de tous les articles de la catégorie "news" en "published"
```

## API HTTP (alternative)

Vous pouvez aussi utiliser l'API MCP directement via HTTP :

**Endpoint :** `POST https://api.skemacms.com/mcp`

**Headers :**

- `Authorization: Bearer <API_KEY>`
- `Content-Type: application/json`

### Exemple cURL

```bash
curl -X POST https://api.skemacms.com/mcp \
  -H "Authorization: Bearer pk_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_collection_items",
      "arguments": {
        "collection": "articles",
        "page": 1,
        "perPage": 10,
        "populate": "author,category"
      }
    }
  }'
```

### Exemple Python

```python
import requests

API_KEY = "pk_live_xxx"
MCP_URL = "https://api.skemacms.com/mcp"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

response = requests.post(MCP_URL, headers=headers, json={
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
        "name": "get_collection_items",
        "arguments": {"collection": "articles", "populate": "author"}
    }
})
print(response.json())
```

## Méthodes JSON-RPC

| Méthode      | Description                         |
| ------------ | ----------------------------------- |
| `initialize` | Initialise la connexion MCP         |
| `tools/list` | Liste tous les outils disponibles   |
| `tools/call` | Exécute un outil avec ses arguments |

## Permissions

Les outils disponibles dépendent des permissions de votre clé API :

| Permission | Outils autorisés               |
| ---------- | ------------------------------ |
| `read`     | `get_*`, `search_*`, `count_*` |
| `create`   | `create_*`, `batch_create_*`   |
| `update`   | `update_*`, `batch_update_*`   |
| `delete`   | `delete_*`                     |

## Développement local

```bash
git clone https://github.com/skemacms/mcp-server.git
cd mcp-server
npm install
npm run dev
```

## Liens utiles

- [Documentation Skema CMS](https://docs.skemacms.com)
- [Guide MCP](https://docs.skemacms.com/guide/mcp)
- [Créer une clé API](https://app.skemacms.com)

## Licence

MIT - Skema CMS
