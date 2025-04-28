import { Pinecone, Index } from '@pinecone-database/pinecone';

// Cache the Pinecone client to avoid re-initializing
let pineconeInstance: Pinecone | null = null;
let indexCache: Record<string, Index> = {};

/**
 * Initialize Pinecone client with proper error handling
 */
export const initPinecone = () => {
  if (pineconeInstance) {
    return pineconeInstance;
  }

  try {
    const apiKey = process.env.PINECONE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Missing Pinecone API key');
    }
    
    pineconeInstance = new Pinecone({
      apiKey: apiKey,
    });
    
    return pineconeInstance;
  } catch (error) {
    console.error('Failed to initialize Pinecone:', error);
    throw new Error('Pinecone initialization failed');
  }
};

/**
 * Get Pinecone index with caching and error handling
 */
export const getPineconeIndex = async (indexName?: string): Promise<Index> => {
  const indexToUse = indexName || process.env.PINECONE_INDEX_NAME;
  
  if (!indexToUse) {
    throw new Error('No Pinecone index name provided');
  }
  
  // Return cached index if available
  if (indexCache[indexToUse]) {
    return indexCache[indexToUse];
  }
  
  try {
    const pinecone = initPinecone();
    const index = pinecone.index(indexToUse);
    
    // Cache the index for future use
    indexCache[indexToUse] = index;
    
    return index;
  } catch (error) {
    console.error(`Failed to get Pinecone index "${indexToUse}":`, error);
    throw new Error(`Failed to get Pinecone index: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Check if Pinecone is properly configured
 */
export const isPineconeConfigured = (): boolean => {
  return !!(
    process.env.PINECONE_API_KEY &&
    process.env.PINECONE_INDEX_NAME
  );
};

/**
 * Clear Pinecone cache
 */
export const clearPineconeCache = () => {
  pineconeInstance = null;
  indexCache = {};
};