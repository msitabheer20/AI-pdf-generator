import { getEmbedding } from '../utils/services/openai';
import { getPineconeIndex } from './pinecone';

/**
 * Retrieves most relevant context from Pinecone vector database based on the query
 * @param query - The search query to find relevant context
 * @param topK - Number of relevant results to return (default: 3)
 * @returns Array of text context items
 */
export const retrieveContext = async (query: string, topK: number = 5): Promise<string[]> => {
  try {
    console.log(`=== RETRIEVING CONTEXT FROM PINECONE FOR QUERY: "${query.substring(0, 50)}..." ===`);
    
    // Get embeddings for the query
    const queryEmbedding = await getEmbedding(query);
    console.log(`=== GENERATED EMBEDDING WITH DIMENSION: ${queryEmbedding.length} ===`);
    
    // Get Pinecone index
    const index = await getPineconeIndex();
    console.log(`=== CONNECTED TO PINECONE INDEX: ${process.env.PINECONE_INDEX_NAME} ===`);
    
    // Query Pinecone
    const startTime = Date.now();
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });
    const duration = Date.now() - startTime;
    
    // Extract and process results
    const results = queryResponse.matches
      .map((match) => match.metadata?.text as string)
      .filter((text) => text != null);
    
    console.log(`=== PINECONE QUERY COMPLETED IN ${duration}ms ===`);
    console.log(`=== RETRIEVED ${results.length} CONTEXT ITEMS ===`);
    
    return results;
  } catch (error) {
    console.error('Error retrieving context from Pinecone:', error);
    // Return empty array rather than failing completely
    return [];
  }
};