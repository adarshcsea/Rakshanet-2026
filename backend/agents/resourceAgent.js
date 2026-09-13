function calculateDistanceKm(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371;

  const dLat =
    (
      (lat2 - lat1) *
      Math.PI
    ) / 180;

  const dLon =
    (
      (lon2 - lon1) *
      Math.PI
    ) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;

  return (
    2 *
    R *
    Math.asin(
      Math.sqrt(a)
    )
  );
}

function allocate(
  incident,
  state
) {

  const openShelters =
    state.shelters
      .filter(
        shelter =>
          shelter.status === 'open'
      )
      .map(shelter => {

        const distance =
          calculateDistanceKm(
            incident.lat,
            incident.lng,
            shelter.lat,
            shelter.lng
          );

        return {
          ...shelter,
          distanceKm:
            Number(
              distance.toFixed(2)
            )
        };
      })
      .sort(
        (a, b) =>
          a.distanceKm -
          b.distanceKm
      )
      .slice(0, 3);

  const availableTeams =
    state.teams
      .filter(
        team =>
          team.status === 'standby'
      )
      .slice(0, 2);

  availableTeams.forEach(team => {

    team.status = 'deployed';

    team.assignedTo =
      incident.incidentId;

    team.lastDeployment =
      new Date().toISOString();
  });

  return {

    shelters:
      openShelters,

    teams:
      availableTeams,

    safeZones:
      openShelters.map(
        shelter => ({
          name:
            shelter.name,
          lat:
            shelter.lat,
          lng:
            shelter.lng,
          distance:
            shelter.distanceKm
        })
      ),

    evacuationRoutes: [
      {
        type: 'estimated',
        label:
          `Nearest shelter: ${
            openShelters[0]?.name ||
            'No shelter available'
          }`,
        distanceKm:
          openShelters[0]?.distanceKm ??
          null
      },
      {
        type: 'estimated',
        label:
          `Second nearest shelter: ${
            openShelters[1]?.name ||
            'Unavailable'
          }`,
        distanceKm:
          openShelters[1]?.distanceKm ??
          null
      }
    ]
  };
}

module.exports = {
  allocate
};
