const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);

const allowedOrigin =
  process.env.FRONTEND_URL || true;

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ['GET', 'POST']
  }
});

app.use(
  cors({
    origin: allowedOrigin
  })
);

app.use(express.json({ limit: '100kb' }));

app.use(
  express.static(
    path.join(__dirname, '..')
  )
);

function loadJson(file) {
  const fullPath = path.join(__dirname, 'data', file);

  try {
    return JSON.parse(
      fs.readFileSync(fullPath, 'utf8')
    );
  } catch (error) {
    console.error(`Failed to load ${file}:`, error);
    process.exit(1);
  }
}

const shelters = loadJson('shelters.json');
const teams = loadJson('teams.json');
const sensors = loadJson('sensors.json');

shelters.forEach(shelter => {
  shelter.originalOccupied = shelter.occupied;
});

const state = {
  shelters,
  teams,
  sensors,
  incidents: [],
  alerts: [],
  logs: [],
  assessments: [],
  checkins: [],
  currentHazard: null,
  lastAllocation: null
};

const orchestrator =
  require('./agents/orchestrator');

const apiRouter =
  require('./routes/api')(
    state,
    orchestrator,
    io
  );

app.use('/api', apiRouter);

io.on('connection', socket => {
  console.log(
    'Client connected:',
    socket.id
  );

  socket.emit('state:init', {
    shelters: state.shelters,
    incidents: state.incidents,
    alerts: state.alerts,
    logs: state.logs
  });

  socket.on('disconnect', () => {
    console.log(
      'Client disconnected:',
      socket.id
    );
  });
});

const PORT =
  Number(process.env.PORT) || 4000;

server.listen(PORT, () => {
  console.log(
    `RakshaNet running on port ${PORT}`
  );
});
