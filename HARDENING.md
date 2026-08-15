<!-- markdownlint-disable -->

# Hardening Report: artis3n--ansible_galaxy_collection/v2.11.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `2`

Action **artis3n--ansible_galaxy_collection/v2.11.0** was hardened automatically. 4 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

All `uses:` references in workflow files use mutable version tags instead of full 40-character SHA commit hashes, making the workflows vulnerable to supply-chain attacks. Additionally, `action.yml` references a Docker image by mutable tag (`docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0`) instead of a SHA digest.

Failing references in `.github/workflows/main.yml`:
- `uses: actions/checkout@v4` (multiple steps)
- `uses: actions/setup-node@v4`
- `uses: docker/setup-buildx-action@v3`
- `uses: docker/login-action@v3`
- `uses: docker/metadata-action@v5`
- `uses: docker/build-push-action@v6`

Failing references in `.github/workflows/release.yml`:
- `uses: technote-space/release-github-actions@v8`
- `uses: actions/checkout@v4`
- `uses: docker/setup-qemu-action@v3`
- `uses: docker/setup-buildx-action@v3`
- `uses: docker/metadata-action@v5`
- `uses: docker/login-action@v3`
- `uses: docker/build-push-action@v6`

Failing image reference in `action.yml`:
- `image: docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0`

Locations:

- `.github/workflows/main.yml:13`
- `.github/workflows/main.yml:15`
- `.github/workflows/main.yml:32`
- `.github/workflows/main.yml:55`
- `.github/workflows/main.yml:72`
- `.github/workflows/main.yml:80`
- `.github/workflows/main.yml:86`
- `.github/workflows/main.yml:93`
- `.github/workflows/release.yml:14`
- `.github/workflows/release.yml:24`
- `.github/workflows/release.yml:29`
- `.github/workflows/release.yml:33`
- `.github/workflows/release.yml:39`
- `.github/workflows/release.yml:47`
- `.github/workflows/release.yml:53`
- `action.yml:57`

### permissions (severity: medium)

Neither `.github/workflows/main.yml` nor `.github/workflows/release.yml` has a top-level `permissions:` key, and no individual job within either file defines a `permissions:` block. This means workflows run with the default (broad) token permissions, violating the principle of least privilege.

Locations:

- `.github/workflows/main.yml:1`
- `.github/workflows/release.yml:1`

### github-env-injection (severity: high)

In `.github/workflows/release.yml`, the `run:` step named 'Get the version' writes the value of `${GITHUB_REF}` (a GitHub-controlled environment variable) directly to `$GITHUB_ENV` without sanitization. The exact command is:

  `echo "RELEASE_VERSION=${GITHUB_REF/refs\/tags\/}" >> $GITHUB_ENV`

Although `GITHUB_REF` is set by GitHub, it is still an untrusted process env var that can contain newlines in edge cases and must be sanitized with `printf '%s' ... | tr -d '\n\r'` before being written to `$GITHUB_ENV`. Without sanitization, a crafted ref value could inject additional environment variable assignments.

Locations:

- `.github/workflows/release.yml:27`

### script-injection (severity: high)

Sub-rule (b): In `.github/workflows/release.yml`, the `run:` step named 'Get the version' expands `${GITHUB_REF}` unquoted inside a shell command:

  `echo "RELEASE_VERSION=${GITHUB_REF/refs\/tags\/}" >> $GITHUB_ENV`

The `$GITHUB_REF` variable is not double-quoted, allowing the shell to parse metacharacters (`;`, `|`, `&`, `$(...)`, whitespace, glob characters) from the value before the substitution is applied. A specially crafted tag ref could cause unintended shell command execution. The value should be captured into a quoted variable first, or the expansion should be fully double-quoted.

Locations:

- `.github/workflows/release.yml:27`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses, permissions, github-env-injection, script-injection

**Notes:**

Fixed all four findings:

1. **unpinned-uses**: Pinned all `uses:` references to full SHA hashes with tag comments in both workflow files. Pinned the Docker image in action.yml to its sha256 digest (preserving `docker://` scheme and `:v2.11.0` tag inline).

2. **permissions**: Added `permissions: {}` at the top level of both workflow files, and per-job minimal permissions (`contents: read` for checkout-only jobs, `packages: write` for Docker push jobs, `contents: write` for the release job).

3. **github-env-injection** + **script-injection**: Rewrote the 'Get the version' step in release.yml to move `${{ github.ref }}` into the step's `env:` block as `RAW_GITHUB_REF`, strip the `refs/tags/` prefix with shell parameter expansion, sanitize with `printf '%s' ... | tr -d '\n\r'`, and write the sanitized value to `$GITHUB_ENV`.

