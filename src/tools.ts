/**
 * Définition des outils MCP pour Skema
 * Version 2 : 11 outils (sans get_related_items, on utilise populate)
 */

import type { Tool } from "@modelcontextprotocol/sdk/types.js";

export const tools: Tool[] = [
  {
    name: "get_collections",
    description: "Liste toutes les collections accessibles avec la clé API configurée",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_collection",
    description: "Récupère le schéma complet d'une collection (champs, types, relations)",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
      },
      required: ["collection"],
    },
  },
  {
    name: "get_collection_items",
    description: "Liste les items d'une collection avec pagination, tri, filtres et populate",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        page: {
          type: "number",
          description: "Numéro de page (défaut: 1)",
        },
        perPage: {
          type: "number",
          description: "Items par page (défaut: 20, max: 100)",
        },
        sort: {
          type: "string",
          description: "Champ de tri. Préfixe - pour descendant (ex: -created_at)",
        },
        populate: {
          type: "string",
          description: "Relations à inclure, séparées par des virgules (ex: author,category)",
        },
        filters: {
          type: "object",
          description: "Filtres JSON (ex: { status: 'active' })",
        },
      },
      required: ["collection"],
    },
  },
  {
    name: "get_collection_item",
    description: "Récupère un item spécifique par son ID avec ses relations (populate)",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        id: {
          type: "string",
          description: "ID de l'item (UUID)",
        },
        populate: {
          type: "string",
          description: "Relations à inclure, séparées par des virgules",
        },
      },
      required: ["collection", "id"],
    },
  },
  {
    name: "create_collection_item",
    description: "Crée un nouvel item dans une collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        data: {
          type: "object",
          description: "Données de l'item à créer",
        },
      },
      required: ["collection", "data"],
    },
  },
  {
    name: "update_collection_item",
    description: "Met à jour un item existant (merge partiel)",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        id: {
          type: "string",
          description: "ID de l'item à modifier",
        },
        data: {
          type: "object",
          description: "Données à mettre à jour",
        },
      },
      required: ["collection", "id", "data"],
    },
  },
  {
    name: "delete_collection_item",
    description: "Supprime un item d'une collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        id: {
          type: "string",
          description: "ID de l'item à supprimer",
        },
      },
      required: ["collection", "id"],
    },
  },
  {
    name: "search_collection_items",
    description: "Recherche textuelle dans une collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        query: {
          type: "string",
          description: "Terme de recherche",
        },
        fields: {
          type: "string",
          description: "Champs où chercher, séparés par des virgules (ex: title,description)",
        },
        page: {
          type: "number",
          description: "Numéro de page",
        },
        perPage: {
          type: "number",
          description: "Items par page",
        },
      },
      required: ["collection", "query"],
    },
  },
  {
    name: "count_collection_items",
    description: "Compte le nombre d'items dans une collection avec filtres optionnels",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        filters: {
          type: "object",
          description: "Filtres JSON optionnels",
        },
      },
      required: ["collection"],
    },
  },
  {
    name: "batch_create_items",
    description: "Crée plusieurs items en une seule requête",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        items: {
          type: "array",
          items: { type: "object" },
          description: "Tableau d'items à créer",
        },
      },
      required: ["collection", "items"],
    },
  },
  {
    name: "batch_update_items",
    description: "Met à jour plusieurs items en une seule requête",
    inputSchema: {
      type: "object",
      properties: {
        collection: {
          type: "string",
          description: "Nom de la collection",
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
            },
            required: ["id"],
          },
          description: "Tableau d'items avec leur ID et les données à modifier",
        },
      },
      required: ["collection", "items"],
    },
  },
];
