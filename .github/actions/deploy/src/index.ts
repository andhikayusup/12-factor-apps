import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

const host: string = core.getInput('host', { required: true });
const privateKey: string = core.getInput('private_key', { required: true });
const commands: string = core.getInput('commands', { required: true });

const sshDir = path.join(process.env.HOME || '', '.ssh');
const privateKeyPath = path.join(sshDir, 'id_rsa');

// Debug: Log the private key to ensure it's being read correctly
core.debug(`Private key: ${privateKey.substring(0, 50)}...`); // Log the first 50 characters of the key

// Create .ssh directory and write private key in a single flush operation
fs.mkdirSync(sshDir, { recursive: true });
fs.writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });

// Debug: Log the permissions of the private key file
const stats = fs.statSync(privateKeyPath);
core.debug(`Private key file permissions: ${stats.mode.toString(8)}`);

// Create SSH config file
const sshConfig = `Host *\n\tStrictHostKeyChecking no\n\n`;
fs.writeFileSync(path.join(sshDir, 'config'), sshConfig);

// Execute SSH commands
const sshCommand = `ssh -i ${privateKeyPath} ${host} "${commands}"`;
try {
  exec.exec(`cat ${privateKeyPath}`);
  exec.exec(sshCommand);
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(`SSH command execution failed: ${error.message}`);
  } else {
    core.setFailed('An unexpected error occurred');
  }
}