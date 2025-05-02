const checkThresholds = (reading, thresholds) => {
  const alerts = [];
  const { sewageLevel, methaneLevel, flowRate } = reading;
  const { maxDistance, maxGas, minFlow } = thresholds;

  // Critical Threshold Checks
  if (methaneLevel > maxGas) alerts.push('gas_leak');
  if (sewageLevel > maxDistance) alerts.push('high_sewage');
  if (flowRate < minFlow) alerts.push('blockage_risk');

  // Warning Threshold Checks (only if no critical alerts)
  if (alerts.length === 0) {
    if (methaneLevel > maxGas/2) alerts.push('methane_warning');
    if (sewageLevel > maxDistance/2) alerts.push('sewage_warning');
    if (flowRate < minFlow*2) alerts.push('flow_warning');
  }

  return alerts.length > 0 ? alerts : null;
};

// Status determination
const determineStatus = (alertTypes) => {
  if (!alertTypes || alertTypes.length === 0) return 'normal';
  
  const criticalAlerts = ['gas_leak', 'high_sewage', 'blockage_risk'];
  return alertTypes.some(alert => criticalAlerts.includes(alert)) 
    ? 'critical' 
    : 'warning';
};

// Usage Example:
const sensorData = {
  sewageLevel: 1.8,  // maxDistance = 2.0 → warning (1.8 > 1.0)
  methaneLevel: 450, // maxGas = 1000 → warning (450 > 500)
  flowRate: 0.15     // minFlow = 0.1 → normal (0.15 > 0.2)
};

const thresholds = {
  maxDistance: 2.0,
  maxGas: 1000,
  minFlow: 0.1
};



export { checkThresholds, determineStatus };