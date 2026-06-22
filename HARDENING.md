<!-- markdownlint-disable -->

# Hardening Report: artis3n--ansible_galaxy_collection/v3.0.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **artis3n--ansible_galaxy_collection/v3.0.0** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The action.yml uses a Docker image reference with a mutable version tag (`v3.0.0`) instead of an immutable SHA digest. This means the image could be replaced with a different (potentially malicious) version without changing the action reference. The failing reference is: `image: docker://ghcr.io/artis3n/ansible_galaxy_collection:v3.0.0`. It should be pinned to a full SHA256 digest, e.g. `image: docker://ghcr.io/artis3n/ansible_galaxy_collection@sha256:<64-hex-char-digest> # v3.0.0`.

Locations:

- `action.yml:44`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Replaced the mutable Docker image tag reference `docker://ghcr.io/artis3n/ansible_galaxy_collection:v3.0.0` with the immutable SHA256 digest `docker://ghcr.io/artis3n/ansible_galaxy_collection@sha256:21e7ed653601199e89895647854c47feee50d3edd97df05deccbc9e6a708d983 # v3.0.0` in action.yml line 44. The digest was resolved via the Docker Registry HTTP API v2.

