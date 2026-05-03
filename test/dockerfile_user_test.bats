#!/usr/bin/env bats

# This test builds the Docker image and verifies that the default user inside the container
# is not root (UID 0). It ensures the security fix is present.

setup() {
  # Build a temporary image tag for testing
  IMAGE_TAG="dockerfile-user-test:$(date +%s)"
  docker build -t "$IMAGE_TAG" . > /dev/null
}

teardown() {
  # Remove the test image to keep CI environment clean
  docker rmi -f "$IMAGE_TAG" > /dev/null 2>&1 || true
}

@test "container runs as non‑root user" {
  run docker run --rm "$IMAGE_TAG" id -u
  # The command should succeed
  [ "$status" -eq 0 ]
  # UID must not be 0 (root)
  [ "$output" != "0" ]
}
