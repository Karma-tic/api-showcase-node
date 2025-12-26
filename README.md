# 🚀 API Showcase Project

A comprehensive Node.js portfolio project demonstrating different API architectures and data persistence mechanisms in a single application.

## 📋 Overview

This project showcases the evolution of API development by integrating three distinct communication protocols side-by-side:
1.  **REST API:** Standard Request/Response model.
2.  **GraphQL:** Flexible data querying.
3.  **WebSockets:** Real-time, bidirectional communication.

It also features **File-Based Persistence**, simulating a database using the local file system to ensure data survives server restarts.

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Query Language:** GraphQL (`express-graphql`)
* **Real-Time:** WebSockets (`ws`)
* **HTTP Client:** Axios (for the consumer script)

## 📂 Project Structure

```bash
api-showcase-node/
├── consumer.js       # Script that consumes an external public API
├── server.js         # Main server file (REST + GraphQL + WebSocket)
├── projects.json     # Local JSON database (persistence layer)
├── client.html       # Frontend client to test WebSockets
└── README.md         # Documentation
🚀 Getting Started
Prerequisites
Node.js installed on your machine.

Installation
Clone the repository:

Bash

git clone [https://github.com/YOUR_USERNAME/api-showcase-node.git](https://github.com/YOUR_USERNAME/api-showcase-node.git)
cd api-showcase-node
Install dependencies:

Bash

npm install
# If you encounter peer dependency issues with GraphQL:
npm install ws --legacy-peer-deps
Start the Server:

Bash

node server.js
The server will start on http://localhost:3000.

📖 Usage Guide
1. REST API
Standard endpoints for creating and reading projects.

GET (Read): http://localhost:3000/api/projects

POST (Create):

Bash

curl -X POST http://localhost:3000/api/projects \
     -H "Content-Type: application/json" \
     -d '{"name": "My New Project"}'
2. GraphQL
Visit http://localhost:3000/graphql in your browser to use the GraphiQL Playground.

Example Query:

GraphQL

query {
  projects {
    id
    name
  }
}
3. WebSockets (Real-Time)
To test real-time communication:

Open the client.html file in your browser (or run open client.html on Mac).

Click Connect.

Open the same file in a second tab.

Send a message from Tab 1 and watch it appear instantly in Tab 2.

🛡️ Security Note
This project uses a .env file (not included in the repo) to manage sensitive configuration. The .gitignore file ensures system files and secrets are not pushed to production.


