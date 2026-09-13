const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET ||
  'dev-only-change-this-secret';


/*
 * Demo users
 *
 * NOTE:
 * These are hackathon/demo credentials.
 * Do not use plaintext passwords like this
 * in a real production authentication system.
 */
const USERS = {

  admin: {
    username: 'Dheksha',
    password: 'Dheksha@1',
    role: 'admin',
    name: 'Dheksha'
  },

  citizen: {
    username: 'Chandra Prakash',
    password: 'Chandraprakash@1',
    role: 'citizen',
    name: 'Chandra Prakash'
  },

  ndrf: {
    username: 'Adarsh',
    password: 'Adarsh@1',
    role: 'admin',
    name: 'Adarsh Rai'
  }

};


/*
 * Authenticate JWT
 */
function authenticateToken(req, res, next) {

  const authHeader =
    req.headers.authorization;

  if (
    !authHeader ||
    !authHeader.startsWith('Bearer ')
  ) {

    return res.status(401).json({
      error: 'Authentication required'
    });
  }

  const token =
    authHeader.substring(7);

  try {

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET
      );

    req.user = decoded;

    next();

  } catch (err) {

    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
}


/*
 * Require administrator access
 */
function requireAdmin(req, res, next) {

  if (req.user?.role !== 'admin') {

    return res.status(403).json({
      error: 'Administrator access required'
    });
  }

  next();
}


/*
 * Validate citizen check-in
 */
function validateCheckin(req, res, next) {

  const {
    name,
    lat,
    lng,
    status
  } = req.body;


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


  if (
    !allowedStatuses.includes(status)
  ) {

    return res.status(400).json({
      error: 'Invalid check-in status'
    });
  }


  next();
}


/*
 * API routes
 */
module.exports = (
  state,
  orchestrator,
  io
) => {


  /*
   * LOGIN
   */
  router.post(
    '/login',
    (req, res) => {

      const {
        username,
        password,
        role
      } = req.body;


      /*
       * Validate input
       */
      if (
        typeof username !== 'string' ||
        typeof password !== 'string'
      ) {

        return res.status(400).json({
          error:
            'Username and password are required'
        });
      }


      const enteredUsername =
        username.trim();


      /*
       * Find user using the actual
       * username property.
       *
       * This fixes the original problem:
       *
       * USERS[username]
       *
       * was incorrect because the object
       * keys are admin/citizen/ndrf while
       * actual usernames are Dheksha,
       * Chandra Prakash and Adarsh.
       */
      const user =
        Object.values(USERS).find(
          currentUser =>
            currentUser.username ===
            enteredUsername
        );


      /*
       * Username doesn't exist
       */
      if (!user) {

        return res.status(401).json({
          error: 'Username is incorrect'
        });
      }


      /*
       * Check selected role.
       *
       * This prevents someone selecting
       * Administrator while using a
       * citizen account.
       */
      if (
        role &&
        role === 'admin' &&
        user.role !== 'admin'
      ) {

        return res.status(401).json({
          error:
            'This account does not have administrator access'
        });
      }


      if (
        role &&
        role === 'citizen' &&
        user.role !== 'citizen'
      ) {

        return res.status(401).json({
          error:
            'This account does not have citizen access'
        });
      }


      /*
       * Password is incorrect
       */
      if (
        user.password !== password
      ) {

        return res.status(401).json({
          error: 'Password is incorrect'
        });
      }


      /*
       * Never put the password inside
       * the JWT or return it to frontend.
       */
      const safeUser = {

        username: user.username,

        role: user.role,

        name: user.name

      };


      /*
       * Create JWT
       */
      const token =
        jwt.sign(
          safeUser,
          JWT_SECRET,
          {
            expiresIn: '24h'
          }
        );


      /*
       * Return token + safe user
       */
      return res.json({

        token,

        user: safeUser

      });

    }
  );


  /*
   * SHELTERS
   */
  router.get(
    '/shelters',
    (req, res) => {

      res.json(
        state.shelters
      );

    }
  );


  /*
   * TEAMS
   */
  router.get(
    '/teams',
    (req, res) => {

      res.json(
        state.teams
      );

    }
  );


  /*
   * SENSORS
   */
  router.get(
    '/sensors',
    (req, res) => {

      res.json(
        state.sensors
      );

    }
  );


  /*
   * INCIDENTS
   */
  router.get(
    '/incidents',
    (req, res) => {

      res.json(
        state.incidents
      );

    }
  );


  /*
   * ALERTS
   */
  router.get(
    '/alerts',
    (req, res) => {

      res.json(
        state.alerts.slice(0, 20)
      );

    }
  );


  /*
   * LOGS
   */
  router.get(
    '/logs',
    (req, res) => {

      res.json(
        state.logs.slice(0, 50)
      );

    }
  );


  /*
   * STATISTICS
   */
  router.get(
    '/stats',
    (req, res) => {

      res.json({

        totalShelters:
          state.shelters.length,

        openShelters:
          state.shelters.filter(
            shelter =>
              shelter.status === 'open'
          ).length,

        totalCapacity:
          state.shelters.reduce(
            (total, shelter) =>
              total + shelter.capacity,
            0
          ),

        occupied:
          state.shelters.reduce(
            (total, shelter) =>
              total + shelter.occupied,
            0
          ),

        incidents:
          state.incidents.length,

        activeTeams:
          state.teams.filter(
            team =>
              team.status !== 'standby'
          ).length

      });

    }
  );


  /*
   * CITIZEN CHECK-IN
   */
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

        id:
          'CHK-' +
          Date.now(),

        /*
         * IMPORTANT:
         * Use the authenticated user's
         * identity instead of trusting
         * the name sent by the browser.
         */
        name:
          req.user.name,

        username:
          req.user.username,

        lat,

        lng,

        status,

        time:
          new Date().toISOString()

      };


      state.checkins.unshift(
        checkin
      );


      /*
       * Prevent unlimited memory growth
       */
      if (
        state.checkins.length > 500
      ) {

        state.checkins.pop();

      }


      /*
       * Broadcast to connected clients
       */
      io.emit(
        'checkin:new',
        checkin
      );


      res.json(
        checkin
      );

    }
  );


  /*
   * DISASTER SIMULATION
   */
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


      const type =
        req.body?.type ||
        'flood';


      /*
       * Validate disaster type
       */
      if (
        !allowedTypes.includes(type)
      ) {

        return res.status(400).json({
          error:
            'Unsupported disaster type'
        });

      }


      try {

        const result =
          await orchestrator.runPipeline(
            state,
            io,
            type
          );


        res.json(
          result
        );


      } catch (error) {

        console.error(
          'Simulation failed:',
          error
        );


        res.status(500).json({
          error:
            'Simulation failed'
        });

      }

    }
  );


  /*
   * RESET SYSTEM
   */
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


      /*
       * Reset teams
       */
      state.teams.forEach(
        team => {

          team.status =
            'standby';

          team.assignedTo =
            null;

        }
      );


      /*
       * Reset shelter occupancy
       */
      state.shelters.forEach(
        shelter => {

          if (
            typeof shelter.originalOccupied ===
            'number'
          ) {

            shelter.occupied =
              shelter.originalOccupied;

          }

        }
      );


      /*
       * Notify connected clients
       */
      io.emit(
        'system:reset'
      );


      res.json({
        ok: true
      });

    }
  );


  return router;
};
