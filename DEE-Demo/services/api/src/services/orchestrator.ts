import prisma from '../db/client';
import { scoreNewEvents } from './scorer';
import { runNormalizer } from './normalizer';
import { updateContributorState } from './state';
import { runIssuer } from './issuer';
import { canonicalizeYaml, policyHash as computePolicyHash } from '../lib/policy';

export async function runEpoch(epochId: string, policy: {
  alpha: number;
  beta: number;
  mf_half_life_weeks: number;
  dilution_per_year: number;
  rho_max: number;
  gate: { deadband: [number, number]; slope_pos: number; slope_neg: number; ema_window: number };
}): Promise<void> {
  await runNormalizer();
  await scoreNewEvents({ beta: policy.beta, rhoMax: policy.rho_max });
  await updateContributorState(epochId, policy.mf_half_life_weeks);
  const latest = await prisma.policyVersion.findMany({ orderBy: { createdAt: 'desc' }, take: 1 });
  const canonical = latest[0]?.yaml ? canonicalizeYaml(latest[0].yaml) : '';
  const policyHash = canonical ? computePolicyHash(canonical) : 'pending';
  await runIssuer({ epochId, alpha: policy.alpha, dilutionPerYear: policy.dilution_per_year, gate: policy.gate, weeksPerEpoch: 1, policyHash });
}


