const { exec } = require('child_process');
const server = exec('NODE_ENV=production node dist/server.cjs');
server.stdout.on('data', console.log);
server.stderr.on('data', console.error);
setTimeout(() => {
  fetch('http://localhost:3001/game/123', { headers: { 'Accept': 'text/html' } })
    .then(res => { console.log("Prod status:", res.status); return res.text(); })
    .then(text => console.log(text.substring(0, 100)))
    .catch(console.error)
    .finally(() => process.exit(0));
}, 3000);
