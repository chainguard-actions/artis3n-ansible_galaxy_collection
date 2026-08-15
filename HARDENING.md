<!-- markdownlint-disable -->

# Hardening Report: artis3n--ansible_galaxy_collection/v3.0.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **artis3n--ansible_galaxy_collection/v3.0.0** was hardened automatically. 3 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

Multiple `uses:` references in workflow files use mutable version tags instead of pinned 40-character SHA commit digests, making the action vulnerable to supply-chain attacks. Failing references:
- `.github/workflows/main.yml`: `actions/checkout@v6`, `actions/setup-node@v6`
- `.github/workflows/release.yml`: `actions/checkout@v6`, `technote-space/release-github-actions@v8`, `docker/setup-qemu-action@v3`, `docker/setup-buildx-action@v3`, `docker/metadata-action@v5`, `docker/login-action@v3`, `docker/build-push-action@v6`
- `action.yml`: `runs.image: docker://ghcr.io/artis3n/ansible_galaxy_collection:v3.0.0` uses a mutable Docker image tag instead of a SHA digest (e.g., `@sha256:<64-hex-char-digest>`).

Locations:

- `.github/workflows/main.yml:12`
- `.github/workflows/main.yml:14`
- `.github/workflows/release.yml:18`
- `.github/workflows/release.yml:24`
- `.github/workflows/release.yml:30`
- `.github/workflows/release.yml:35`
- `.github/workflows/release.yml:40`
- `.github/workflows/release.yml:46`
- `.github/workflows/release.yml:52`
- `action.yml:44`

### missing-permissions (severity: medium)

Neither `.github/workflows/main.yml` nor `.github/workflows/release.yml` defines a top-level `permissions:` key, and no job-level `permissions:` keys are present in any job. Without explicit permissions, workflows run with the default (potentially broad) token permissions. Each workflow should declare minimal required permissions (e.g., `permissions: read-all` or specific scopes).

Locations:

- `.github/workflows/main.yml:1`
- `.github/workflows/release.yml:1`

### github-env-injection (severity: high)

In `.github/workflows/release.yml`, the `Get the version` step writes the inherited process environment variable `$GITHUB_REF` (after shell substitution) directly to `$GITHUB_ENV` without sanitization. The pattern `echo "RELEASE_VERSION=${GITHUB_REF/refs\/tags\//}" >> $GITHUB_ENV` does not apply the required `printf '%s' ... | tr -d '\n\r'` sanitization before the write. An attacker who can influence the ref (e.g., via a tag name containing newlines) could inject arbitrary environment variables into subsequent steps.

Locations:

- `.github/workflows/release.yml:27`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, missing-permissions, github-env-injection

**Notes:**

1. **unpinned-uses**: Pinned all `uses:` references to full 40-char SHAs with tag comments: actions/checkout@d23441a4 (#v6), actions/setup-node@249970729c (#v6), technote-space/release-github-actions@052f205d (#v8), docker/setup-qemu-action@c7c53464 (#v3), docker/setup-buildx-action@8d2750c6 (#v3), docker/metadata-action@c299e40c (#v5), docker/login-action@c94ce9fb (#v3), docker/build-push-action@10e90e36 (#v6). Pinned action.yml Docker image to `docker://ghcr.io/artis3n/ansible_galaxy_collection:v3.0.0@sha256:21e7ed65...` preserving the docker:// scheme and tag inline.
2. **missing-permissions**: Added `permissions: {}` at the top level of both workflow files. Added job-level `permissions: contents: write` to the `release` job and `permissions: contents: read, packages: write` to the `deploy` job in release.yml.
3. **github-env-injection**: Moved `github.ref` into an env var `GITHUB_REF_VALUE`, performed the tag-prefix substitution in shell, then sanitized with `printf '%s' "$raw" | tr -d '\n\r'` before writing to `$GITHUB_ENV`.

