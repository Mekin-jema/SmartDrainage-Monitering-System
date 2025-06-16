// config/thresholds.js
export const THRESHOLDS = {
  SEWAGE: {
    MAX: 10, // cm
    ALERT: "high_sewage_level",
    LEVEL: "critical"
  },
  METHANE: {
    MAX: 5, // ppm
    ALERT: "high_methane",
    LEVEL: "me"
  },
  FLOW: {
    MIN: 1, // m/s
    ALERT: "low_flow",
    LEVEL: "warning"
  },
  TEMP: {
    MAX: 4, // °C
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