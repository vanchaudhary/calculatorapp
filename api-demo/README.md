# API Demo

This project is a simple REST API built with Node.js and Express. It demonstrates how to create a basic API with two endpoints.

## Project Structure

```
api-demo
├── src
│   ├── index.js           # Entry point of the application
│   ├── routes
│   │   └── api.js         # Defines the API routes
│   ├── controllers
│   │   └── apiController.js # Contains the logic for handling API requests
│   └── config
│       └── config.js      # Configuration settings for the application
├── package.json            # npm configuration file
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```
   cd api-demo
   ```

3. Install the dependencies:

   ```
   npm install
   ```

### Running the API

To start the server, run the following command:

```
npm start
```

The API will be running on `http://localhost:3000` (or the port specified in the configuration).

### API Endpoints

- `GET /api/items`: Retrieves a list of items.
- `POST /api/items`: Creates a new item.

### License

This project is licensed under the MIT License.