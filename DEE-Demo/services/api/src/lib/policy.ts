import crypto from 'crypto';
import YAML from 'yaml';

export type Policy = {
  alpha: number;
  beta: number;
  mf_half_life_weeks: number;
  dilution_per_year: number;
  rho_max: number;
  epsilon: number;
  gate: {
    type: 'piecewise_linear_deadband';
    deadband: [number, number];
    slope_pos: number;
    slope_neg: number;
    ema_window: number;
  };
  milestone_rule: {
    grace_days: number;
    adoption_threshold: string;
  };
  review_precision: {
    prior_alpha: number;
    prior_beta: number;
  };
  payout_caps: {
    per_epoch_multiple_of_median: number;
  };
  anti_gaming: {
    ring_density_cap: number;
    min_unique_reviewers: number;
  };
};

export function canonicalizeYaml(yamlText: string): string {
  // Parse then re-emit in stable order for deterministic hashing
  const doc = YAML.parse(yamlText);
  return YAML.stringify(doc, { sortMapEntries: true });
}

export function policyHash(canonicalYaml: string): string {
  return crypto.createHash('sha256').update(canonicalYaml).digest('hex');
}

export function parsePolicy(yamlText: string): Policy {
  const doc = YAML.parse(yamlText) as Policy;
  return doc;
}


