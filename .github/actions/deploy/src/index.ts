import * as core from '@actions/core';
import * as crypto from 'crypto';

const nameToGreet = core.getInput('who-to-greet');
const base64PublicKey = core.getInput('public-key');
const publicKey = Buffer.from(base64PublicKey, 'base64').toString('utf-8');
const encryptedMessage = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    Buffer.from(`Hello, ${nameToGreet}!`)
  );

const encryptedMessageBase64 = encryptedMessage.toString('base64');
console.log(`Encrypted Message (Base64): ${encryptedMessageBase64}`);