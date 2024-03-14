import { axisoClient } from "./axios";

export async function updateCollection(id: string, collection: CollectionUpdateObject) {
    const response = await axisoClient.patch(`/partners/${id}`, { collection });
    return response.data.collection as Collection;
}
