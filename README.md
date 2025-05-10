# Currency Portfolio App Server

A real-time currency data streaming server built with Node.js, Express, WebSocket, and Socket.IO.

## Overview

This server application connects to an external WebSocket service to fetch real-time currency data and streams it to connected clients using Socket.IO. It also provides REST API endpoints for currency definitions and historical data.

## Features

- Real-time currency data streaming via WebSockets
- Client-specific currency subscriptions
- In-memory caching for improved performance
- REST API endpoints for currency definitions and historical data
- Health check endpoint

## Tech Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express** - Web server framework
- **Socket.IO** - Real-time bidirectional event-based communication
- **WebSocket** - Protocol for connecting to external data source
- **Node-Cache** - In-memory caching
- **Axios** - HTTP client for API requests
- **dotenv** - Environment variable management

## Project Structure

```
src/
├── constants/      # Application constants (currency symbols, fields)
├── lib/            # Utility libraries (cache manager)
├── routes/         # API route definitions
├── socket/         # WebSocket and Socket.IO implementation
├── types/          # TypeScript type definitions
└── index.ts        # Main application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Yarn or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   yarn install
   ```
   or
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   WEBSOCKET_SERVER_URL=your_websocket_server_url
   SERVICE_URL=your_service_url
   HISTORY_SERVICE_URL=your_history_service_url
   ```

### Running the Application

Development mode:
```
yarn dev
```
or
```
npm run dev
```

## API Endpoints

### Health Check
```
GET /health
```
Returns "OK" if the server is running.

### Currency Definitions
```
GET /definitions
```
Returns currency definitions from the external service.

### Currency History
```
GET /currency-history/:legacyCode
```
Parameters:
- `legacyCode`: Currency code
- `startDate`: Start date (query parameter)
- `endDate`: End date (query parameter)
- `period`: Period (query parameter)

Returns historical data for the specified currency.

## WebSocket Events

### Client to Server

#### `triggerCurrencyData`
Subscribe to specific currency data streams.
- Payload: Array of currency symbol IDs

### Server to Client

#### `currencyData`
Emitted when new currency data is available.
- Payload: Array of currency data objects

## Cache Management

The application uses Node-Cache to store:
- WebSocket authentication token
- Connected Socket.IO clients
- Currency data
- Currency subscription mappings

## Vercel Deployment

This project is configured for deployment on Vercel. Follow these steps to deploy:

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Link your project to Vercel:
   ```
   vercel login
   vercel link
   ```

3. Add the required environment variables in the Vercel dashboard:
   - `WEBSOCKET_SERVER_URL`
   - `SERVICE_URL`
   - `HISTORY_SERVICE_URL`

4. Deploy to Vercel:
   ```
   vercel --prod
   ```

### GitHub Actions Deployment

For automatic deployments via GitHub Actions:

1. Add these to your GitHub repository:
   - **Secrets**:
     - `VERCEL_TOKEN`: Your Vercel API token
     - `VERCEL_ORG_ID`: Your Vercel organization ID
     - `VERCEL_PROJECT_ID`: Your Vercel project ID
   
   - **Variables** (in repository settings → Variables → Actions):
     - `WEBSOCKET_SERVER_URL`: WebSocket server URL
     - `SERVICE_URL`: Service URL for API calls
     - `HISTORY_SERVICE_URL`: History service URL for API calls

2. The GitHub Actions workflow will automatically pass these environment variables to Vercel during deployment.

3. Push to the `prod-release` branch to trigger deployment.

## License

MIT 