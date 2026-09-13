function detect(
  state,
  disasterTypeOverride = null
) {

  const hazards = [];
  const now = new Date();

  state.sensors.forEach(sensor => {

    if (
      sensor.value <
      sensor.threshold * 0.8
    ) {
      return;
    }

    let type;

    if (sensor.type === 'seismic') {

      type = 'earthquake';

    } else if (
      sensor.type === 'weather'
    ) {

      type =
        sensor.value > 100
          ? 'cyclone'
          : 'flood';

    } else if (
      sensor.type === 'fire_risk'
    ) {

      type = 'wildfire';

    } else {

      type = 'flood';
    }

    hazards.push({

      id:
        'HZ-' +
        Date.now() +
        '-' +
        sensor.id,

      type:
        disasterTypeOverride || type,

      sensorId:
        sensor.id,

      location:
        sensor.location,

      lat:
        Number(sensor.lat),

      lng:
        Number(sensor.lng),

      severity:
        sensor.value >= sensor.threshold
          ? 'critical'
          : 'warning',

      confidence:
        Math.min(
          95,
          60 +
          (
            sensor.value /
            sensor.threshold
          ) * 30
        ),

      timestamp:
        now,

      raw:
        sensor
    });
  });

  if (disasterTypeOverride) {

    const simulatedLocations = {

      flood: {
        location:
          'Mithi River Basin',
        lat: 19.0822,
        lng: 72.8411
      },

      earthquake: {
        location:
          'Mumbai Western Fault',
        lat: 19.0760,
        lng: 72.8777
      },

      cyclone: {
        location:
          'Arabian Sea Coast',
        lat: 19.0596,
        lng: 72.8295
      },

      wildfire: {
        location:
          'SGNP Forest Edge',
        lat: 19.2314,
        lng: 72.9047
      },

      landslide: {
        location:
          'Hillside Region',
        lat: 19.2183,
        lng: 72.9781
      },

      heatwave: {
        location:
          'Central Mumbai',
        lat: 19.0760,
        lng: 72.8777
      }
    };

    const config =
      simulatedLocations[
        disasterTypeOverride
      ] ||
      simulatedLocations.flood;

    hazards.push({
      id:
        'HZ-' +
        Date.now(),

      type:
        disasterTypeOverride,

      sensorId:
        'SIM',

      location:
        config.location,

      lat:
        config.lat,

      lng:
        config.lng,

      severity:
        'critical',

      confidence:
        92,

      timestamp:
        now,

      raw: {
        value: 95,
        threshold: 80,
        simulated: true
      }
    });
  }

  return hazards;
}

module.exports = {
  detect
};
