export function clamp(x: number, lo: number, hi: number): number {
  if (x < lo) return lo;
  if (x > hi) return hi;
  return x;
}

export function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

export function piecewiseDeadband(deltaK: number, deadband: [number, number], slopePos: number, slopeNeg: number): number {
  const [lo, hi] = deadband;
  if (deltaK >= lo && deltaK <= hi) return 0;
  return deltaK > hi ? slopePos * (deltaK - hi) : slopeNeg * (deltaK - lo);
}

export function halfLifeDecayFactor(epochsElapsed: number, halfLifeEpochs: number): number {
  return Math.pow(2, -epochsElapsed / halfLifeEpochs);
}

export function epochDilutionFraction(annualDilution: number, weeksPerEpoch: number): number {
  return 1 - Math.pow(1 - annualDilution, weeksPerEpoch / 52);
}


