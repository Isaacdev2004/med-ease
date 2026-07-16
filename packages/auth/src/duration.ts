const UNITS: Record<string, number> = {
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function parseDurationToMs(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value.trim());
  if (!match) {
    throw new Error(`Invalid duration format: ${value}`);
  }

  const amount = Number(match[1]);
  const unit = UNITS[match[2]];
  return amount * unit;
}

export function parseDurationToSeconds(value: string): number {
  return Math.floor(parseDurationToMs(value) / 1_000);
}
