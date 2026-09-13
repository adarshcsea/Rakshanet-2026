const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-this-secret';

const USERS = {
  admin: {
    username: 'admin',
    password: 'demo123',
    role: 'admin',
    name: 'District Collector'
  },
  citizen: {
    username: 'citizen',
    password: 'demo123',
    role: 'citizen',
    name: 'Om Prakash'
  },
  ndrf: {
    username: 'ndrf',
    password: 'demo123',
    role: 'admin',
    name: 'NDRF Commander'
  }
};

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Administrator access required'
    });
  }

  next();
}

function validateCheckin(req, res, next) {
  const { name, lat, lng, status } = req.body;

  if (
    typeof name !== 'string' ||
    name.trim().length < 1 ||
    name.trim().length > 100
  ) {
    return res.status(400).json({
      error: 'Name must be between 1 and 100 characters'
    });
  }

  if (
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return res.status(400).json({
      error: 'Invalid coordinates'
    });
  }

  const allowedStatuses = [
    'Safe',
    'Need Help',
    'At Shelter'
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: 'Invalid check-in status'
    });
  }

  next();
}

module.exports = (state, orchestrator, io) => {

  router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    const user = USERS[username];

    if (!user || user.password !== password) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    const safeUser = {
      username: user.username,
      role: user.role,
      name: user.name
    };

    const token = jwt.sign(
      safeUser,
      JWT_SECRET,
      {
        expiresIn: '24h'
      }
    );

    res.json({
      token,
      user: safeUser
    });
  });

  router.get('/shelters', (req, res) => {
    res.json(state.shelters);
  });

  router.get('/teams', (req, res) => {
    res.json(state.teams);
  });

  router.get('/sensors', (req, res) => {
    res.json(state.sensors);
  });

  router.get('/incidents', (req, res) => {
    res.json(state.incidents);
  });

  router.get('/alerts', (req, res) => {
    res.json(state.alerts.slice(0, 20));
  });

  router.get('/logs', (req, res) => {
    res.json(state.logs.slice(0, 50));
  });

  router.get('/stats', (req, res) => {
    res.json({
      totalShelters: state.shelters.length,
      openShelters: state.shelters.filter(
        s => s.status === 'open'
      ).length,
      totalCapacity: state.shelters.reduce(
        (a, s) => a + s.capacity,
        0
      ),
      occupied: state.shelters.reduce(
        (a, s) => a + s.occupied,
        0
      ),
      incidents: state.incidents.length,
      activeTeams: state.teams.filter(
        t => t.status !== 'standby'
      ).length
    });
  });

  router.post(
    '/checkin',
    authenticateToken,
    validateCheckin,
    (req, res) => {
      const {
        lat,
        lng,
        status
      } = req.body;

      const checkin = {
        id: 'CHK-' + Date.now(),
        name: req.user.name,
        username: req.user.username,
        lat,
        lng,
        status,
        time: new Date().toISOString()
      };

      state.checkins.unshift(checkin);

      if (state.checkins.length > 500) {
        state.checkins.pop();
      }

      io.emit('checkin:new', checkin);

      res.json(checkin);
    }
  );

  router.post(
    '/simulate',
    authenticateToken,
    requireAdmin,
    async (req, res) => {
      const allowedTypes = [
        'flood',
        'earthquake',
        'cyclone',
        'wildfire',
        'landslide',
        'heatwave'
      ];

      const type = req.body?.type || 'flood';

      if (!allowedTypes.includes(type)) {
        return res.status(400).json({
          error: 'Unsupported disaster type'
        });
      }

      try {
        const result = await orchestrator.runPipeline(
          state,
          io,
          type
        );

        res.json(result);
      } catch (error) {
        console.error('Simulation failed:', error);

        res.status(500).json({
          error: 'Simulation failed'
        });
      }
    }
  );

  router.post(
    '/reset',
    authenticateToken,
    requireAdmin,
    (req, res) => {
      state.incidents = [];
      state.alerts = [];
      state.logs = [];
      state.assessments = [];
      state.checkins = [];
      state.currentHazard = null;
      state.lastAllocation = null;

      state.teams.forEach(team => {
        team.status = 'standby';
        team.assignedTo = null;
      });

      state.shelters.forEach(shelter => {
        if (typeof shelter.originalOccupied === 'number') {
          shelter.occupied = shelter.originalOccupied;
        }
      });

      io.emit('system:reset');

      res.json({
        ok: true
      });
    }
  );

  return router;
};
