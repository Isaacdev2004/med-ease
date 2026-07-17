/** Worker release version — override via WORKER_VERSION in deployment. */
export function getWorkerVersion(): string {
  return (
    process.env.WORKER_VERSION ?? process.env.npm_package_version ?? '0.0.0'
  );
}
