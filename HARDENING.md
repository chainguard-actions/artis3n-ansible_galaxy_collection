<!-- markdownlint-disable -->

# Hardening Report: artis3n--ansible_galaxy_collection/v2.11.0

> This file was generated automatically by the hardening agent.

**Policy SHA:** `d636be7e43ef829af6e853da6b3c7566db9f72fe`

**Test Policy SHA:** `843adf9e4b8f85d0c08b27b9d0b09dd094b54702`

**Harden Agent Version:** `1`

Action **artis3n--ansible_galaxy_collection/v2.11.0** was hardened automatically. 1 finding(s) were identified and resolved across 1 iteration(s).

## Findings Fixed

### unpinned-uses (severity: high)

The `runs.image:` field in action.yml references a Docker image by mutable tag (`v2.11.0`) instead of an immutable SHA digest. This means the action could silently pull a different (potentially malicious) image if the tag is moved. The failing reference is: `image: docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0`. It should be pinned to a SHA digest, e.g. `image: docker://ghcr.io/artis3n/ansible_galaxy_collection@sha256:<64-hex-char-digest>`

Locations:

- `action.yml:62`

## Iteration Notes

### Iteration 1

**Fixes applied:** unpinned-uses

**Notes:**

Replaced the mutable Docker image tag reference `docker://ghcr.io/artis3n/ansible_galaxy_collection:v2.11.0` with the immutable SHA digest `docker://ghcr.io/artis3n/ansible_galaxy_collection@sha256:5b3d08cf91d41e2090e72cf4e57d19b8b6c6a033aced59e00a185c2de1b71ef3 # v2.11.0` in action.yml line 62. The original tag is preserved as a comment for readability.

