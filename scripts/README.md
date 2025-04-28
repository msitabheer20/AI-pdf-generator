# PDF to Pinecone Knowledge Base Uploader

This script extracts text from PDF files, processes it into meaningful chunks, creates embeddings, and uploads them to your Pinecone vector database for use with the DreamScape AI system.

## Prerequisites

1. Node.js installed (v14 or higher)
2. A Pinecone account with API key
3. An OpenAI account with API key
4. A Pinecone index created with dimension 1536 (for OpenAI embeddings)

## Installation

Install the required dependencies:

```bash
npm install pdf-parse openai @pinecone-database/pinecone dotenv
```

## Configuration

Create a `.env` file in the project root with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

## Usage

Run the script with the path to your PDF file:

```bash
node scripts/pdf-to-pinecone.js path/to/your/file.pdf
```

The script will:

1. Extract text from the PDF
2. Split the text into meaningful chunks optimized for retrieval
3. Create a log file (`chunks-log.json`) so you can inspect the chunks
4. Wait for your confirmation before uploading to Pinecone
5. Create embeddings and upload to your Pinecone index

## How It Works

1. **Text Extraction**: The script extracts plain text from your PDF
2. **Chunking**: The text is split into meaningful chunks using various strategies:
   - Split by section headers
   - Split by paragraph boundaries
   - Split by sentence boundaries for long paragraphs
3. **Labeling**: Each chunk gets metadata labels to aid in retrieval
4. **Embedding**: OpenAI's embeddings API creates vector representations
5. **Storage**: Chunks are stored in Pinecone with their full text in metadata

## Optimized for DreamScape AI

This script is specifically designed to work with the DreamScape AI retrieval system, which uses question content to find relevant information in the knowledge base and enhance AI responses.

## Troubleshooting

- If you get rate limit errors, try reducing the batch size 
- If chunks are too large or small, adjust the `maxChunkSize` parameter
- Check `chunks-log.json` to see how your content was processed before uploading 