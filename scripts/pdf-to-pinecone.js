require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const { OpenAI } = require('openai');
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Function to extract text from PDF
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Split text into meaningful topical chunks 
function splitIntoTopicalChunks(text, maxChunkSize = 1500) {
  // Remove excessive whitespace and normalize line breaks
  const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\n+/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

  // Split by common section indicators
  const sectionDelimiters = [
    /Chapter \d+/g,
    /Section \d+/g, 
    /\n[\d\.]+\s+[A-Z]/g, // Numbered sections
    /\n[A-Z][A-Z\s]+\n/g, // ALL CAPS HEADINGS
    /\n[A-Z][a-z]+[\s-][A-Z][a-z]+.*?:/g, // Title Case Headings with colon
  ];
  
  let sections = [cleanedText];
  
  // Apply each delimiter pattern
  for (const pattern of sectionDelimiters) {
    let newSections = [];
    for (const section of sections) {
      // Find all matches of the pattern
      const matches = [...section.matchAll(pattern)];
      if (matches.length > 0) {
        let lastIndex = 0;
        for (const match of matches) {
          const index = match.index;
          if (index > lastIndex) {
            newSections.push(section.substring(lastIndex, index));
          }
          lastIndex = index;
        }
        if (lastIndex < section.length) {
          newSections.push(section.substring(lastIndex));
        }
      } else {
        newSections.push(section);
      }
    }
    sections = newSections.filter(s => s.trim().length > 0);
  }
  
  // Further split any sections that are too large
  let chunks = [];
  for (const section of sections) {
    if (section.length <= maxChunkSize) {
      chunks.push(section);
    } else {
      // Split by paragraphs
      const paragraphs = section.split(/\n\s*\n/);
      let currentChunk = '';
      
      for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > maxChunkSize) {
          if (currentChunk) {
            chunks.push(currentChunk);
            currentChunk = '';
          }
          
          if (paragraph.length > maxChunkSize) {
            // Split long paragraphs into sentences
            const sentences = paragraph.split(/(?<=[.!?])\s+/);
            let sentenceChunk = '';
            
            for (const sentence of sentences) {
              if (sentenceChunk.length + sentence.length > maxChunkSize) {
                chunks.push(sentenceChunk);
                sentenceChunk = sentence;
              } else {
                sentenceChunk += (sentenceChunk ? ' ' : '') + sentence;
              }
            }
            
            if (sentenceChunk) {
              currentChunk = sentenceChunk;
            }
          } else {
            currentChunk = paragraph;
          }
        } else {
          currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
        }
      }
      
      if (currentChunk) {
        chunks.push(currentChunk);
      }
    }
  }
  
  return chunks.map(chunk => chunk.trim()).filter(chunk => chunk.length > 50);
}

// Add context labels to chunks for better retrieval
function addContextLabels(chunks) {
  return chunks.map((text, i) => {
    // Extract potential headings or first sentence
    const firstLine = text.split('\n')[0];
    const firstSentence = text.split(/(?<=[.!?])\s+/)[0];
    
    // Use the shorter of first line or first sentence as label
    const label = firstLine.length < firstSentence.length ? firstLine : firstSentence;
    
    // Limit label length
    const shortLabel = label.length > 100 ? `${label.substring(0, 97)}...` : label;
    
    return {
      text,
      metadata: {
        source: 'knowledge_base',
        chunkIndex: i,
        label: shortLabel
      }
    };
  });
}

// Function to create embeddings
async function createEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  
  return response.data[0].embedding;
}

// Function to upload embeddings to Pinecone
async function uploadToPinecone(labeledChunks) {
  console.log(`Preparing to upload ${labeledChunks.length} chunks to Pinecone...`);
  
  const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
  
  // Process in batches to avoid rate limits
  const batchSize = 50;
  for (let i = 0; i < labeledChunks.length; i += batchSize) {
    const batch = labeledChunks.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(labeledChunks.length / batchSize)}`);
    
    const records = await Promise.all(
      batch.map(async (item, j) => {
        const id = `knowledge-${Date.now()}-${i + j}`;
        const embedding = await createEmbedding(item.text);
        return {
          id,
          values: embedding,
          metadata: { 
            ...item.metadata,
            text: item.text  // Store full text in metadata for retrieval
          }
        };
      })
    );
    
    await index.upsert(records);
    console.log(`Uploaded batch ${Math.floor(i / batchSize) + 1}`);
    
    // Sleep to avoid rate limits
    if (i + batchSize < labeledChunks.length) {
      console.log('Waiting before processing next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('All chunks uploaded to Pinecone successfully!');
}

// Function to log chunks to a file for inspection
function logChunksToFile(chunks, filePath) {
  const chunkLog = chunks.map((chunk, i) => 
    `--- CHUNK ${i+1} ---\n${JSON.stringify(chunk, null, 2)}\n\n`
  ).join('');
  
  fs.writeFileSync(filePath, chunkLog);
  console.log(`Chunks logged to ${filePath} for inspection`);
}

// Main function
async function main() {
  try {
    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("Missing OPENAI_API_KEY environment variable");
    }
    if (!process.env.PINECONE_API_KEY) {
      throw new Error("Missing PINECONE_API_KEY environment variable");
    }
    if (!process.env.PINECONE_INDEX_NAME) {
      throw new Error("Missing PINECONE_INDEX_NAME environment variable");
    }

    // Get PDF path from command line argument
    const pdfPath = process.argv[2];
    if (!pdfPath) {
      throw new Error("Please provide a path to the PDF file as an argument");
    }
    
    // Extract text from PDF
    console.log('Extracting text from PDF...');
    const text = await extractTextFromPDF(pdfPath);
    console.log(`Extracted ${text.length} characters`);
    
    // Split text into topical chunks
    console.log('Splitting text into topical chunks...');
    const chunks = splitIntoTopicalChunks(text);
    console.log(`Created ${chunks.length} topical chunks`);
    
    // Add context labels
    const labeledChunks = addContextLabels(chunks);
    
    // Log chunks to file for inspection
    const logFilePath = path.join(process.cwd(), 'chunks-log.json');
    logChunksToFile(labeledChunks, logFilePath);
    
    // Confirm upload
    console.log(`Ready to upload ${chunks.length} chunks to Pinecone index "${process.env.PINECONE_INDEX_NAME}"`);
    console.log('Press Enter to continue or Ctrl+C to cancel...');
    await new Promise(resolve => {
      process.stdin.once('data', () => {
        resolve();
      });
    });
    
    // Upload chunks to Pinecone
    console.log('Uploading chunks to Pinecone...');
    await uploadToPinecone(labeledChunks);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 