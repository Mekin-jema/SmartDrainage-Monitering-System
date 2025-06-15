// config/thresholds.js
export const THRESHOLDS = {
  SEWAGE: {
    MAX: 8, // cm
    ALERT: "high_sewage_level",
    LEVEL: "critical"
  },
  METHANE: {
    MAX: 500, // ppm
    ALERT: "high_methane",
    LEVEL: "critical"
  },
  FLOW: {
    MIN: 5, // m/s
    ALERT: "low_flow",
    LEVEL: "warning"
  },
  TEMP: {
    MAX: 40, // °C
    ALERT: "high_temperature",
    LEVEL: "warning"
  },
  BATTERY: {
    MIN: 20, // %
    ALERT: "low_battery",
    LEVEL: "warning"
  }
};

export const MANHOLE_STATUS = {
  NORMAL: "normal",
  WARNING: "needs_attention",
  CRITICAL: "critical",
  OVERFLOWING: "overflowing"
};

export const ALERT_STATUS = {
  ACTIVE: "active",
  RESOLVED: "resolved"
};