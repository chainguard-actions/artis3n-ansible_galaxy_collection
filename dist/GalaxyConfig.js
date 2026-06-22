import { valid } from 'semver';
import { dump as yamlDump } from 'js-yaml';
import { writeFileSync } from 'fs';
import {} from "./types.js";
/**
 * Represents the contents of a galaxy.yml Ansible Galaxy config file.
 */
export class GalaxyConfig {
    config;
    changes = false;
    constructor(config) {
        this.config = config;
    }
    get namespace() {
        return this.config.namespace;
    }
    get name() {
        return this.config.name;
    }
    get version() {
        return this.config.version;
    }
    set version(input) {
        if (valid(input)) {
            this.config.version = input;
            this.changes = true;
        }
        else {
            throw new Error(`${input} is not valid semver`);
        }
    }
    /**
     * Writes this config back into its original file if changes have occurred to its contents.
     */
    commit(filePath) {
        if (this.changes) {
            const yamlAsString = yamlDump(this.config);
            writeFileSync(filePath, yamlAsString, 'utf8');
        }
    }
}
