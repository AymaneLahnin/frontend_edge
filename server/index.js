// index.js  –  pure JS, can be run with:  node server/index.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebSocket } from 'ws';
import { execSync, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173', methods: ['GET', 'POST'] },
});

/* ————————————————— METRICS relay (unchanged) ——————————————————— */
const springBootWs = new WebSocket('ws://localhost:8090/ws/vms');
springBootWs.on('message', d => {
  try { io.emit('vmMetrics', JSON.parse(d.toString())); }
  catch (e) { console.error('[metrics] bad JSON:', e); }
});
springBootWs.on('error', e => console.error('[metrics] WS error:', e));

/* ——————————— find VBox.log for a VM (JS version) ——————————— */
function getVBoxLogFile(vmName) {
  const vbm = process.platform === 'win32' ? 'VBoxManage.exe' : 'VBoxManage';
  const raw = execSync(`${vbm} showvminfo "${vmName}" --machinereadable`).toString();
  const match = raw.match(/LogFldr="([^"]+)"/);
  if (!match) throw new Error(`No LogFldr entry for VM “${vmName}”`);
  const file = path.join(match[1], 'VBox.log');
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);
  return file;
}

/* ——————————— Socket.IO: stream logs on demand ——————————— */
io.on('connection', socket => {
  console.log('[io] client connected');

  socket.on('requestLogs', vmName => {
    let logFile;
    try { logFile = getVBoxLogFile(vmName); }
    catch (err) {
      socket.emit('vmLogsError', { vmName, msg: err.message });
      return;
    }

    const tail = spawn('tail', ['-n', '+1', '-F', logFile]);
    tail.stdout.setEncoding('utf8').on('data', chunk =>
      socket.emit('vmLogs', { vmName, log: chunk })
    );
    tail.stderr.setEncoding('utf8').on('data', chunk =>
      socket.emit('vmLogsError', { vmName, msg: chunk.toString() })
    );
    socket.on('disconnect', () => tail.kill());
  });
});

const PORT = 3000;
httpServer.listen(PORT, () =>
  console.log(`WebSocket server running on port ${PORT}`),
);
