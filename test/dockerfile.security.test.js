const execa = require('execa');
const path = require('path');

// Tag used for the temporary test image
const IMAGE_TAG = 'security-test-image';

describe('Dockerfile security hardening', () => {
  // Build the Docker image before any test runs
  beforeAll(async () => {
    // Increase timeout because a full image build can be time‑consuming
    jest.setTimeout(300000); // 5 minutes
    await execa('docker', ['build', '-t', IMAGE_TAG, '.'], {
      cwd: path.resolve(__dirname, '..'),
      stdio: 'inherit',
    });
  });

  // Clean up the image after the suite finishes
  afterAll(async () => {
    await execa('docker', ['rmi', '-f', IMAGE_TAG]).catch(() => {});
  });

  test('container runs as non‑root user', async () => {
    const { stdout } = await execa('docker', [
      'run',
      '--rm',
      IMAGE_TAG,
      'id',
      '-u',
    ]);
    // The UID should not be 0 (root). Any other UID indicates a non‑root user.
    expect(stdout.trim()).not.toBe('0');
  });
});
