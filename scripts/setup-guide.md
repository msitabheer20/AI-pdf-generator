# DreamScape AI - Pinecone Integration Setup Guide

This guide walks you through the process of setting up and integrating Pinecone with your DreamScape AI application to enhance AI responses with relevant contextual knowledge.

## Overview

1. Set up a Pinecone account and create an index
2. Configure environment variables
3. Upload your knowledge base from PDF files
4. Test the retrieval system

## 1. Pinecone Account Setup

### Creating an Account

1. Go to [https://app.pinecone.io/](https://app.pinecone.io/)
2. Sign up for an account (free tier is available)
3. Verify your email if required

### Getting Your API Key

1. After logging in, navigate to **API Keys** in the left sidebar
2. Copy your API key and keep it safe
3. You'll need this key for both uploading data and for the application to retrieve data

### Creating an Index

1. Go to **Indexes** in the left sidebar
2. Click **Create Index**
3. Enter the following details:
   - **Name**: `dreamscape-knowledge-base` (or your preferred name)
   - **Dimensions**: `1536` (for OpenAI embeddings)
   - **Metric**: `cosine` (recommended for semantic search)
   - Select your preferred cloud provider and region
4. Click **Create Index**
5. Wait for the index to initialize (can take a few minutes)

## 2. Environment Variables

Create or update your `.env` file in the project root with the following variables:

```
# OpenAI API key for embeddings
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone config
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=dreamscape-knowledge-base
```

## 3. Upload Knowledge Base from PDF

### Install Dependencies

```bash
npm install pdf-parse openai @pinecone-database/pinecone dotenv
```

### Process and Upload PDF Content

1. Place your PDF file in an accessible location
2. Run the uploader script:

```bash
node scripts/pdf-to-pinecone.js path/to/your/file.pdf
```

3. Review the chunks in the generated `chunks-log.json` file
4. Press Enter when prompted to begin the upload process
5. Wait for the upload to complete

### Upload Multiple PDFs

To upload multiple PDFs, simply run the script multiple times with different file paths:

```bash
node scripts/pdf-to-pinecone.js path/to/file1.pdf
node scripts/pdf-to-pinecone.js path/to/file2.pdf
```

## 4. Test the Retrieval System

### Checking the Index Stats

1. Login to the Pinecone console
2. Go to the **Indexes** section
3. Select your index
4. Check the vector count and other statistics

### Testing Retrieval in Your Application

1. Make sure your application is running with the proper environment variables
2. Fill out the assessment form with test questions
3. Check the console logs for messages about Pinecone retrieval
4. Verify that the AI responses incorporate contextual knowledge

## How Retrieval Works

The DreamScape AI system:

1. Extracts the questions from the assessment form
2. Creates a query vector from those questions
3. Searches Pinecone for the most relevant chunks of information
4. Includes that context in the system prompt to the AI
5. The AI generates more informed and contextually relevant responses

## Troubleshooting

### No Relevant Context Found

If you see "No relevant context found in Pinecone" in your logs:

1. Verify your index has vectors (check Pinecone console)
2. Ensure your application is using the correct index name
3. Check that the PDF content is relevant to the types of questions being asked
4. Try uploading more diverse content to improve coverage

### API Key Issues

If you encounter authentication errors:

1. Verify your Pinecone API key is correctly set in the `.env` file
2. Check that the key is being properly loaded by the application
3. Ensure your Pinecone account is active and the key hasn't expired

### Index Not Found

If your application can't find the index:

1. Verify the index name in your `.env` file matches exactly the name in the Pinecone console
2. Check that the index has been properly created and is in the "Ready" state
3. Ensure you're using the correct region and environment

## Next Steps

Once your knowledge base is set up, consider:

1. Regularly updating it with new information
2. Refining your chunking strategy based on retrieval performance
3. Adding metadata filters to target specific parts of your knowledge base
4. Implementing hybrid search for even better results 