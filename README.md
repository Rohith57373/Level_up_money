# Multilingual Conversational Loan Advisor

## Project Overview
The *Multilingual Conversational Loan Advisor* is an AI-powered chatbot designed to help users understand and explore loan options, eligibility, and financial literacy. The system supports *multiple Indian languages, ensuring accessibility for a wider audience. It provides **loan recommendations, **financial insights, and **language-adaptive interactions* using *Sarvam AI, **Google Gemini AI, and **LangChain*.

## Key Features
### 1. *Multilingual Support with Sarvam AI*
- Detects and translates queries from *Hindi, Marathi, Tamil, Telugu, Kannada, Punjabi, Bengali, and more*.
- Uses *Sarvam AI's language detection and translation services* to provide responses in the user's preferred language.

### 2. *Loan Eligibility & Product Guidance*
- Users can ask:
  - "Am I eligible for a personal loan?"
  - "What are the interest rates for a home loan?"
- Provides personalized recommendations based on *user financial conditions and limitations*.

### 3. *AI-Powered Insights*
- Uses *LangChain* and *Google Gemini AI* for:
  - Natural language understanding
  - Loan product comparisons
  - Personalized financial advice

### 4. *Real-Time Web Search*
- *Tavily Search API* fetches the latest financial trends and loan offers.

### 5. *Financial Literacy & Loan Tips*
- Guides users on:
  - Loan repayment strategies
  - Credit score improvement
  - Interest rate comparison

## Technical Stack
### Backend
- *Node.js & Express.js* – API backend and request handling

### AI & NLP
- *Google Gemini AI* – Processes user queries and generates responses
- *LangChain* – Manages conversational AI interactions

### Translation & Language Detection
- *Sarvam AI*
  - Detects input language dynamically
  - Translates responses based on user preference

### Database & Retrieval
- *Qdrant* – Stores and retrieves financial information

### Web Search Integration
- *Tavily Search API* – Retrieves the latest financial data

## System Architecture & User Flow
1. *User Interaction*
   - User enters a loan-related query in any supported language.
2. *Language Detection (Sarvam AI)*
   - Identifies the language of the input.
3. *Processing the Query*
   - *LangChain + Google Gemini AI* understand the query and fetch relevant data.
4. *Retrieving Loan Information*
   - Fetches details from *Qdrant (database)* or performs a *web search (Tavily API)*.
5. *Translation & Response (Sarvam AI)*
   - If required, *Sarvam AI* translates the response into the user's language.
   - The chatbot provides *clear, structured financial guidance*.

## Installation & Setup
### Prerequisites
- *Node.js* (v16+ recommended)
- *MongoDB* (optional for storing user interactions)
- API keys for:
  - Google Gemini AI
  - Sarvam AI
  - Tavily Search API
  - Qdrant

### Steps to Run the Project
1. *Clone the repository*:
   sh
   git clone https://github.com/your-repo/multilingual-loan-advisor.git
   
2. *Navigate to the project directory*:
   sh
   cd multilingual-loan-advisor
   
3. *Install dependencies*:
   sh
   npm install
   
4. *Set up environment variables*:
   Create a .env file and add:
   sh
   GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key
   SARVAM_API_KEY=your_sarvam_api_key
   TAVILY_API_KEY=your_tavily_api_key
   QDRANT_HOST=your_qdrant_host
   
5. *Start the application*:
   sh
   npm start
   

## API Endpoints
- *POST /query*  
  - Accepts a user query and returns loan-related advice.
- *GET /health*  
  - Checks if the service is running.

## Current Status & Future Enhancements
### Completed Features
✔ Multilingual query processing using *Sarvam AI*  
✔ Loan recommendation system  
✔ Financial literacy insights  

### Planned Enhancements
🔹 Integrating *voice-based queries*
🔹 Adding *more loan providers for comparison*
🔹 Expanding *support for additional languages*

## Why Choose This Solution?
- *User-Centric & Multilingual* – Provides financial guidance in a user's *preferred language*.
- *AI-Powered Accuracy* – Uses *Google Gemini AI* for precise loan recommendations.
- *Reliable & Scalable* – Backend powered by *Node.js, Express.js, and Qdrant*.
- *Seamless Financial Assistance* – *Sarvam AI* ensures smooth translation and communication.

---
This project aims to make *financial advice accessible to everyone*, especially in regional languages, improving financial literacy and loan decision-making for users across India.
