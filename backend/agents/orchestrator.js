
const detection = require('./detectionAgent');
const coordination = require('./coordinationAgent');
const communication = require('./communicationAgent');
const resource = require('./resourceAgent');
const assessment = require('./assessmentAgent');

async function runPipeline(state, io, disasterType=null, logFn) {
  const log = (agent, msg, data=null) => {
    const entry = { agent, message: msg, time: new Date().toLocaleTimeString(), data };
    state.logs.unshift(entry);
    if (state.logs.length>100) state.logs.pop();
    if (io) io.emit('agent:log', entry);
    if (logFn) logFn(entry);
  };

  log('ORCHESTRATOR', `Pipeline triggered for ${disasterType||'auto-detection'}...`);

  // 1 Detection
  log('DETECTION', 'Scanning multi-hazard sensors (Flood, Quake, Cyclone, Fire...)');
  await new Promise(r=>setTimeout(r,600));
  const hazards = detection.detect(state, disasterType);
  if (!hazards.length) {
    log('DETECTION', 'No hazards above threshold. All clear.', {clear:true});
    return { status:'clear' };
  }
  const hazard = hazards[0];
  state.currentHazard = hazard;
  io && io.emit('hazard:detected', hazard);
  log('DETECTION', `Hazard detected: ${hazard.type.toUpperCase()} at ${hazard.location} | Confidence ${hazard.confidence.toFixed(1)}%`, hazard);

  // 2 Coordination
  await new Promise(r=>setTimeout(r,700));
  const incident = coordination.coordinate(hazard, state);
  state.incidents.unshift(incident);
  io && io.emit('incident:created', incident);
  log('COORDINATION', `Incident ${incident.incidentId} verified | Severity ${incident.severity} | Population ${incident.affectedPopulation}`, incident);

  // 3 Communication
  await new Promise(r=>setTimeout(r,600));
  const supportedLanguages = [
  'en',
  'hi',
  'mr',
  'ta',
  'te',
  'bn',
  'gu',
  'kn',
  'ml',
  'pa'
];

const alerts =
  supportedLanguages.map(
    language =>
      communication.composeAlert(
        incident,
        language
      )
  );
  
  alerts.forEach(a=>state.alerts.unshift(a));
  io && io.emit('alerts:new', alerts);
  log('COMMUNICATION', `Multilingual alerts broadcast in 3 languages via App/SMS/Siren`, alerts);

  // 4 Resource
  await new Promise(r=>setTimeout(r,700));
  const allocation = resource.allocate(incident, state);
  state.lastAllocation = allocation;
  io && io.emit('resource:allocated', allocation);
  log('RESOURCE', `Allocated ${allocation.shelters.length} shelters, ${allocation.teams.length} teams. Nearest: ${allocation.shelters[0]?.name}`, allocation);

  // 5 Assessment
  await new Promise(r=>setTimeout(r,800));
  const assessmentResult = assessment.assess(incident, allocation);
  state.assessments.unshift(assessmentResult);
  io && io.emit('assessment:done', assessmentResult);
  log('ASSESSMENT', `Damage score ${assessmentResult.damageScore}/100 | Loss ₹${(assessmentResult.estimatedLossINR/100000).toLocaleString()}L`, assessmentResult);

  return { hazard, incident, alerts, allocation, assessmentResult };
}

module.exports = { runPipeline };
