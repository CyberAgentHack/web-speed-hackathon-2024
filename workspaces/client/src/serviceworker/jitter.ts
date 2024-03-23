export async function jitter(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));
}
