export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export async function echoAfterMs(value: string, ms: number): Promise<string> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
  return value;
}
