require('dotenv').config();
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const http = require('http'); // Required for WebSockets
const WebSocket = require('ws'); // Required for WebSockets

const app = express();
const PORT = 3000;

// Path to our JSON file (Persistence)
const DB_PATH = path.join(__dirname, 'projects.json');

// Middleware to parse JSON bodies
app.use(express.json());

// --- HELPER FUNCTION: DATABASE ACCESS ---
async function readData() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

// --- REST API ROUTES ---

// 1. Home Page
app.get('/', (req, res) => {
    res.send(`
        <h1>API Showcase Server</h1>
        <p>Your server is running successfully.</p>
        <ul>
            <li><a href='/api/projects'>REST API: /api/projects</a></li>
            <li><a href='/graphql'>GraphQL Playground: /graphql</a></li>
            <li>WebSocket endpoint: ws://localhost:${PORT}</li>
        </ul>
    `);
});

// 2. REST GET: Read data
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await readData();
        res.json({ message: "Success", data: projects });
    } catch (error) {
        res.status(500).json({ message: "Error reading database" });
    }
});

// 3. REST POST: Create data
app.post('/api/projects', async (req, res) => {
    try {
        const projects = await readData();
        const newProject = req.body;
        
        // Auto-increment ID and set default status
        newProject.id = projects.length + 1;
        newProject.status = newProject.status || "Pending";

        projects.push(newProject);

        // Write back to file (Persistence)
        await fs.writeFile(DB_PATH, JSON.stringify(projects, null, 2));

        res.status(201).json({ message: "Project saved", data: newProject });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving data" });
    }
});

// --- GRAPHQL SETUP ---

// Define Schema
const schema = buildSchema(`
    type Project {
        id: Int
        name: String
        status: String
    }
    type Query {
        message: String
        projects: [Project]
        project(id: Int!): Project
    }
`);

// Define Resolvers
const root = {
    message: () => "Hello from GraphQL!",
    projects: async () => {
        return await readData();
    },
    project: async ({ id }) => {
        const data = await readData();
        return data.find(p => p.id === id);
    }
};

// Mount GraphQL Endpoint
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

// --- WEBSOCKET SETUP ---

// 1. Create raw HTTP server from Express app
const server = http.createServer(app);

// 2. Create WebSocket server attached to HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (socket) => {
    console.log('New WebSocket Client Connected!');
    
    // Send welcome message
    socket.send(JSON.stringify({ type: 'info', message: 'Connected to Real-Time Server' }));

    socket.on('message', (message) => {
        console.log(`Received via WS: ${message}`);
        
        // Broadcast to all clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                    type: 'broadcast',
                    content: `Broadcast: ${message}`
                }));
            }
        });
    });
});

// --- START SERVER ---
// Important: Use server.listen, not app.listen, to support both HTTP and WS
server.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`   - REST:      http://localhost:${PORT}/api/projects`);
    console.log(`   - GraphQL:   http://localhost:${PORT}/graphql`);
    console.log(`   - WebSocket: ws://localhost:${PORT}\n`);
});