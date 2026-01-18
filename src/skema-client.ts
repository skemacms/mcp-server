/**
 * Client HTTP pour communiquer avec l'API MCP Skema (JSON-RPC 2.0)
 */

const API_KEY = process.env.SKEMA_API_KEY || "";
const BASE_URL = process.env.SKEMA_BASE_URL || "https://api.skemacms.com";

let requestId = 0;

interface JsonRpcResponse<T = unknown> {
  jsonrpc: "2.0";
  id: number;
  result?: {
    content: Array<{ type: string; text: string }>;
  };
  error?: {
    code: number;
    message: string;
  };
}

/**
 * Appelle un outil MCP via JSON-RPC
 */
export const mcpCall = async <T = unknown>(
  toolName: string,
  args: Record<string, unknown> = {}
): Promise<T> => {
  requestId++;

  const response = await fetch(`${BASE_URL}/mcp`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: requestId,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erreur inconnue" }));
    throw new Error(error.message || `Erreur HTTP ${response.status}`);
  }

  const jsonRpc: JsonRpcResponse<T> = await response.json();

  if (jsonRpc.error) {
    throw new Error(jsonRpc.error.message);
  }

  if (!jsonRpc.result?.content?.[0]?.text) {
    throw new Error("Reponse MCP invalide");
  }

  return JSON.parse(jsonRpc.result.content[0].text);
};

/**
 * Recupere la liste des collections
 */
export const getCollections = () => mcpCall("get_collections");

/**
 * Recupere le schema d'une collection
 */
export const getCollection = (collection: string) =>
  mcpCall("get_collection", { collection });

/**
 * Liste les items d'une collection
 */
export const getItems = (
  collection: string,
  options?: {
    page?: number;
    perPage?: number;
    sort?: string;
    populate?: string;
    filters?: Record<string, unknown>;
  }
) =>
  mcpCall("get_collection_items", {
    collection,
    page: options?.page,
    perPage: options?.perPage,
    sort: options?.sort,
    populate: options?.populate,
    filters: options?.filters,
  });

/**
 * Recupere un item par son ID
 */
export const getItem = (
  collection: string,
  id: string,
  options?: { populate?: string }
) =>
  mcpCall("get_collection_item", {
    collection,
    id,
    populate: options?.populate,
  });

/**
 * Cree un nouvel item
 */
export const createItem = (collection: string, data: Record<string, unknown>) =>
  mcpCall("create_collection_item", { collection, data });

/**
 * Met a jour un item
 */
export const updateItem = (
  collection: string,
  id: string,
  data: Record<string, unknown>
) =>
  mcpCall("update_collection_item", { collection, id, data });

/**
 * Supprime un item
 */
export const deleteItem = (collection: string, id: string) =>
  mcpCall("delete_collection_item", { collection, id });

/**
 * Recherche dans une collection
 */
export const searchItems = (
  collection: string,
  query: string,
  options?: { fields?: string; page?: number; perPage?: number }
) =>
  mcpCall("search_collection_items", {
    collection,
    query,
    fields: options?.fields,
    page: options?.page,
    perPage: options?.perPage,
  });

/**
 * Compte les items d'une collection
 */
export const countItems = (
  collection: string,
  filters?: Record<string, unknown>
) =>
  mcpCall("count_collection_items", { collection, filters });

/**
 * Cree plusieurs items en une seule requete
 */
export const batchCreate = (
  collection: string,
  items: Record<string, unknown>[]
) =>
  mcpCall("batch_create_items", { collection, items });

/**
 * Met a jour plusieurs items en une seule requete
 */
export const batchUpdate = (
  collection: string,
  items: Array<{ id: string } & Record<string, unknown>>
) =>
  mcpCall("batch_update_items", { collection, items });
