import type { FixedAsset } from '@/services/finance/types';

export function straightLineDepreciation(
  asset: FixedAsset,
  periodMonths = 1,
): number {
  const monthly = asset.acquisitionCost / (asset.usefulLifeYears * 12);
  return Math.round(monthly * periodMonths);
}

export function decliningBalanceDepreciation(
  asset: FixedAsset,
  rate = 0.2,
): number {
  return Math.round((asset.netBookValue * rate) / 12);
}

export function calculateDepreciation(asset: FixedAsset): number {
  if (asset.status === 'fully_depreciated' || asset.status === 'disposed')
    return 0;
  return asset.depreciationMethod === 'straight_line'
    ? straightLineDepreciation(asset)
    : decliningBalanceDepreciation(asset);
}

export function disposeAsset(
  asset: FixedAsset,
  disposalProceeds: number,
): { gainLoss: number; journalDescription: string } {
  const gainLoss = disposalProceeds - asset.netBookValue;
  return {
    gainLoss,
    journalDescription: `Disposal of ${asset.name} — ${gainLoss >= 0 ? 'gain' : 'loss'} €${Math.abs(gainLoss)}`,
  };
}
