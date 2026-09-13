function coordinate(
  hazard,
  state
) {

  const nearbySensors =
    state.sensors.filter(sensor => {

      const latDiff =
        Math.abs(
          sensor.lat -
          hazard.lat
        );

      const lngDiff =
        Math.abs(
          sensor.lng -
          hazard.lng
        );

      return (
        latDiff < 0.05 &&
        lngDiff < 0.05
      );
    });

  const corroboratingSensors =
    nearbySensors.filter(sensor => {

      if (
        hazard.type ===
        'earthquake'
      ) {
        return sensor.type === 'seismic';
      }

      if (
        hazard.type === 'wildfire'
      ) {
        return sensor.type === 'fire_risk';
      }

      return sensor.type === 'weather';
    });

  const corroborated =
    corroboratingSensors.length >= 1;

  const severityScore =
    hazard.severity === 'critical'
      ? 9
      : 6;

  const impactRadius = {
    flood: 5,
    earthquake: 15,
    cyclone: 20,
    wildfire: 8,
    landslide: 3,
    heatwave: 10
  }[hazard.type] || 5;

  const basePopulation =
    Math.floor(
      Math.random() * 5000
    ) + 1000;

  const affectedPopulation =
    corroborated
      ? basePopulation
      : Math.floor(
          basePopulation * 0.5
        );

  return {

    incidentId:
      'INC-' +
      Date.now(),

    hazardId:
      hazard.id,

    type:
      hazard.type,

    status:
      corroborated
        ? 'verified'
        : 'needs-review',

    severity:
      hazard.severity,

    severityScore,

    location:
      hazard.location,

    lat:
      hazard.lat,

    lng:
      hazard.lng,

    impactRadiusKm:
      impactRadius,

    affectedPopulation,

    corroboratingSensors:
      corroboratingSensors.map(
        sensor => sensor.id
      ),

    corroborated,

    verifiedAt:
      new Date(),

    actionPlan: {

      evacuate:
        hazard.type !==
        'heatwave',

      shelterInPlace:
        hazard.type ===
          'heatwave' ||
        hazard.type ===
          'earthquake',

      priority:
        severityScore > 8
          ? 'P0 - Immediate'
          : 'P1 - High'
    }
  };
}

module.exports = {
  coordinate
};
