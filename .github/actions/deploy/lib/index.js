"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const host = core.getInput('host', { required: true });
const privateKey = core.getInput('private_key', { required: true });
const commands = core.getInput('commands', { required: true });
const sshDir = path.join(process.env.HOME || '', '.ssh');
const privateKeyPath = path.join(sshDir, 'id_rsa');
// Create .ssh directory and write private key
fs.mkdirSync(sshDir, { recursive: true });
fs.writeFileSync(privateKeyPath, privateKey, { mode: 0o600 });
// Create SSH config file
const sshConfig = `Host *\n\tStrictHostKeyChecking no\n\n`;
fs.writeFileSync(path.join(sshDir, 'config'), sshConfig);
// Execute SSH commands
const sshCommand = `ssh -i ${privateKeyPath} ${host} "${commands}"`;
try {
    exec.exec(sshCommand);
}
catch (error) {
    if (error instanceof Error) {
        core.setFailed(`SSH command execution failed: ${error.message}`);
    }
    else {
        core.setFailed('An unexpected error occurred');
    }
}
