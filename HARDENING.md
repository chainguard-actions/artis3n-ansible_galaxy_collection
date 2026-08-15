<!-- markdownlint-disable -->

# Hardening Report: artis3n--ansible_galaxy_collection/v2.12.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **artis3n--ansible_galaxy_collection/v2.12.0** was hardened automatically. 2 finding(s) were identified and resolved across 2 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

All `uses:` references in both workflow files are pinned to mutable version tags rather than immutable 40-character SHA commit hashes, making the workflows vulnerable to supply-chain attacks if those tags are moved. Failing references in .github/workflows/main.yml: actions/checkout@v4, actions/setup-node@v4, docker/setup-buildx-action@v3, docker/login-action@v3, docker/metadata-action@v5, docker/build-push-action@v6. Failing references in .github/workflows/release.yml: technote-space/release-github-actions@v8, actions/checkout@v4, docker/setup-qemu-action@v3, docker/setup-buildx-action@v3, docker/metadata-action@v5, docker/login-action@v3, docker/build-push-action@v6. Additionally, action.yml uses a Docker image referenced by a mutable tag (docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0) instead of a SHA digest.

Locations:

- `.github/workflows/main.yml:12`
- `.github/workflows/main.yml:14`
- `.github/workflows/main.yml:28`
- `.github/workflows/main.yml:47`
- `.github/workflows/main.yml:66`
- `.github/workflows/main.yml:69`
- `.github/workflows/main.yml:74`
- `.github/workflows/main.yml:79`
- `.github/workflows/main.yml:88`
- `.github/workflows/release.yml:14`
- `.github/workflows/release.yml:22`
- `.github/workflows/release.yml:28`
- `.github/workflows/release.yml:31`
- `.github/workflows/release.yml:36`
- `.github/workflows/release.yml:44`
- `.github/workflows/release.yml:49`
- `action.yml:57`

### missing-permissions (severity: medium)

Neither .github/workflows/main.yml nor .github/workflows/release.yml defines a top-level `permissions:` key, and no individual job within either file defines its own `permissions:` block. Without explicit permissions, workflows run with the default (potentially broad) token permissions, violating the principle of least privilege.

Locations:

- `.github/workflows/main.yml:1`
- `.github/workflows/release.yml:1`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions

**Notes:**

Fixed all unpinned `uses:` references in .github/workflows/main.yml and .github/workflows/release.yml by replacing mutable version tags with full 40-character SHA commit hashes (with tag comments for readability). Pinned the Docker image in action.yml from `docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0` to `docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0@sha256:5b3d08cf91d41e2090e72cf4e57d19b8b6c6a033aced59e00a185c2de1b71ef3`, preserving the docker:// scheme and tag. Added top-level `permissions: {}` to both workflow files and per-job minimal permissions: `contents: read` for jobs that only checkout code, `packages: write` added where Docker images are pushed to ghcr.io, and `contents: write` for the release job that needs to push tag updates.

### Iteration 2

**Fixes applied:** github-env-injection

**Notes:**

Fixed the 'Get the version' step in .github/workflows/release.yml: moved `github.ref` into the step's `env:` block as `GITHUB_REF_VAR`, then used `printf '%s' "$version" | tr -d '\n\r'` to strip newlines before writing to `$GITHUB_ENV`. This prevents a tag name containing embedded newlines from injecting arbitrary environment variables into subsequent steps.

