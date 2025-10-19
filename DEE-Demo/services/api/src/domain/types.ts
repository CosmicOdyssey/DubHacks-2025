export type KPI = Record<string, number>;

export type ScoredEvent = {
  eventId: string;
  contributorId: string;
  toMB: number;
  toMF: number;
};

export type GateConfig = {
  type: 'piecewise_linear_deadband';
  deadband: [number, number];
  slope_pos: number;
  slope_neg: number;
  ema_window: number;
};


