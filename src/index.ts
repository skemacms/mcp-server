#!/usr/bin/env node
/**
 * Serveur MCP pour Skema CMS
 * Expose les fonctionnalités de gestion de contenu via le protocole MCP
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { tools } from "./tools.js";
import * as skema from "./skema-client.js";

const server = new Server(
  {
    name: "skema-cms",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Liste des outils disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

// Execution des outils
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result: unknown;

    switch (name) {
      // Collections
      case "get_collections": {
        result = await skema.getCollections();
        break;
      }

      case "get_collection": {
        const { collection } = args as { collection: string };
        result = await skema.getCollection(collection);
        break;
      }

      // Content CRUD
      case "get_collection_items": {
        const { collection, page, perPage, sort, populate, filters } = args as {
          collection: string;
          page?: number;
          perPage?: number;
          sort?: string;
          populate?: string;
          filters?: Record<string, unknown>;
        };
        result = await skema.getItems(collection, {
          page,
          perPage,
          sort,
          populate,
          filters,
        });
        break;
      }

      case "get_collection_item": {
        const { collection, id, populate } = args as {
          collection: string;
          id: string;
          populate?: string;
        };
        result = await skema.getItem(collection, id, { populate });
        break;
      }

      case "create_collection_item": {
        const { collection, data } = args as {
          collection: string;
          data: Record<string, unknown>;
        };
        result = await skema.createItem(collection, data);
        break;
      }

      case "update_collection_item": {
        const { collection, id, data } = args as {
          collection: string;
          id: string;
          data: Record<string, unknown>;
        };
        result = await skema.updateItem(collection, id, data);
        break;
      }

      case "delete_collection_item": {
        const { collection, id } = args as {
          collection: string;
          id: string;
        };
        result = await skema.deleteItem(collection, id);
        break;
      }

      case "search_collection_items": {
        const { collection, query, fields, page, perPage } = args as {
          collection: string;
          query: string;
          fields?: string;
          page?: number;
          perPage?: number;
        };
        result = await skema.searchItems(collection, query, {
          fields,
          page,
          perPage,
        });
        break;
      }

      case "count_collection_items": {
        const { collection, filters } = args as {
          collection: string;
          filters?: Record<string, unknown>;
        };
        result = await skema.countItems(collection, filters);
        break;
      }

      case "batch_create_items": {
        const { collection, items } = args as {
          collection: string;
          items: Record<string, unknown>[];
        };
        result = await skema.batchCreate(collection, items);
        break;
      }

      case "batch_update_items": {
        const { collection, items } = args as {
          collection: string;
          items: Array<{ id: string } & Record<string, unknown>>;
        };
        result = await skema.batchUpdate(collection, items);
        break;
      }

      default:
        throw new Error(`Outil inconnu: ${name}`);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Erreur outil ${name}:`, message);

    return {
      content: [
        {
          type: "text",
          text: `Erreur: ${message}`,
        },
      ],
      isError: true,
    };
  }
});

// Démarrage du serveur
const main = async () => {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Serveur MCP Skema démarre");
};

main().catch((error) => {
  console.error("Erreur fatale:", error);
  process.exit(1);
});
