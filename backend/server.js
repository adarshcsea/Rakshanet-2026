
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Load data
const shelters = JSON.parse(fs.readFileSync(path.join(__dirname,'data/shelters.json')));
const teams = JSON.parse(fs.readFileSync(path.join(__dirname,'data/teams.json')));
const sensors = JSON.parse(fs.readFileSync(path.join(__dirname,'data/sensors.json')));

const state = {
  shelters, teams, sensors,
  incidents: [],
  alerts: [],
  logs: [],
  assessments: [],
  checkins: [],
  currentHazard: null,
  lastAllocation: null
};

const orchestrator = require('./agents/orchestrator');
const apiRouter = require('./routes/api')(state, orchestrator, io);
app.use('/api', apiRouter);

io.on('connection', socket=>{
  console.log('Client connected', socket.id);
  socket.emit('state:init', {
    shelters: state.shelters,
    incidents: state.incidents,
    alerts: state.alerts,
    logs: state.logs
  });
  socket.on('citizen:checkin', data=>{
    state.checkins.unshift(data);
    io.emit('checkin:new', data);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=>{
  console.log(`RakshaNet Modern running at http://localhost:${PORT}`);
  console.log(`Landing: http://localhost:${PORT}/index.html`);
  console.log(`Login: http://localhost:${PORT}/login.html`);
  console.log(`Citizen: http://localhost:${PORT}/citizen.html`);
  console.log(`Admin: http://localhost:${PORT}/dashboard.html`);
});
