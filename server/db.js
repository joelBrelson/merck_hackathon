import { Client } from 'ssh2';
import mongoose from 'mongoose';
import fs from 'fs';
import net from 'net'

const SSH_HOST = 'ec2-184-72-65-75.compute-1.amazonaws.com';
const SSH_PORT = 22;
const SSH_USER = 'ubuntu';
const SSH_KEY_PATH = '../keys/merck_boltzmann.pem';

const MONGO_HOST = 'docdb-boltzmann.cluster-ck3ckgo6eerl.us-east-1.docdb.amazonaws.com';
const MONGO_PORT = 27017;
const MONGO_USER = 'boltz';
const MONGO_PASSWORD = 'boltzmann123';
const MONGO_AUTH_DB = 'admin'; // Authentication database

const LOCAL_HOST = '127.0.0.1';
const LOCAL_PORT = 27017;

const DOCDB_CA_FILE = '../keys/global-bundle.pem'; // DocumentDB CA certificate file

const DATABASE_NAME = 'test'; // The specific database you want to use in Mongoose

// --- Path Checks ---
if (!fs.existsSync(SSH_KEY_PATH)) {
  console.error(`Error: SSH key file not found at ${SSH_KEY_PATH}`);
  process.exit(1);
}

if (!fs.existsSync(DOCDB_CA_FILE)) {
    console.error(`Error: DocumentDB CA file not found at ${DOCDB_CA_FILE}`);
    process.exit(1);
}

const MONGO_URI = `mongodb://boltz:password@${LOCAL_HOST}:${LOCAL_PORT}/test?authSource=admin`;

// --- Main Connection Function ---
export async function connectWithTunnel() {
  const ssh = new Client();

  return new Promise((resolve, reject) => {
    // When SSH connection is ready
    ssh
      .on('ready', () => {
        console.log('SSH Connection established.');

        // Create a local server to forward MongoDB traffic
        net.createServer(function (localSocket) {
          // Forward the traffic to the MongoDB server via SSH
          ssh.forwardOut(
            localSocket.remoteAddress || '127.0.0.1',
            localSocket.remotePort || 0,
            MONGO_HOST,
            MONGO_PORT,
            function (err, stream) {
              if (err) {
                console.error('forwardOut error:', err);
                localSocket.end();
                return;
              }
              // Pipe data to/from the local socket to the SSH stream
              localSocket.pipe(stream).pipe(localSocket);
            }
          );
        })
          .listen(LOCAL_PORT, LOCAL_HOST, async () => {
            console.log(`Tunnel ready at ${LOCAL_HOST}:${LOCAL_PORT}`);

            // Attempt to connect to MongoDB via the SSH tunnel
            try {
              await mongoose.connect(MONGO_URI, {
                tls: true,
                tlsCAFile: DOCDB_CA_FILE,
                tlsAllowInvalidHostnames: true,
                tlsAllowInvalidCertificates: true,
              });
              console.log('Connected to MongoDB via tunnel');
              resolve();
            } catch (mongoErr) {
              // Reject with specific MongoDB connection error
              console.error('Mongoose connection error:', mongoErr.message);
              reject(new Error('Mongoose connection error: ' + mongoErr.message));
            }
          });
      })
      .on('error', (err) => {
        // Reject with the SSH connection error
        console.error('SSH Connection Error:', err.message);
        reject(new Error('SSH Connection Error: ' + err.message));
      })
      .connect({
        host: SSH_HOST,
        port: SSH_PORT,
        username: SSH_USER,
        privateKey: fs.readFileSync(SSH_KEY_PATH),
      });
  });
}