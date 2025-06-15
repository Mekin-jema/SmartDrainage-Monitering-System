import { THRESHOLDS } from "./checkThreshold.js";

function generateAlertDescription(alertType, value) {
  const descriptions = {
    high_sewage_level: `Sewage level critical at ${value}cm (Max: ${THRESHOLDS.SEWAGE.MAX}cm)`,
    high_methane: `Dangerous methane level at ${value}ppm (Max: ${THRESHOLDS.METHANE.MAX}ppm)`,
    low_flow: `Low flow rate at ${value}m/s (Min: ${THRESHOLDS.FLOW.MIN}m/s)`,
    high_temperature: `High temperature at ${value}°C (Max: ${THRESHOLDS.TEMP.MAX}°C)`,
    low_battery: `Low battery at ${value}% (Min: ${THRESHOLDS.BATTERY.MIN}%)`
  };
  return descriptions[alertType] || `Alert triggered: ${alertType}`;
}
 export default generateAlertDescription;
