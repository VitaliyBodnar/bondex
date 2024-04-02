const { fork } = require('child_process');

const numberOfChunks = 12;

const childProcesses = [];
for (let i = 0; i < numberOfChunks; i++) {
    const childProcess = fork(__dirname + '/app-create.js');
    childProcesses.push(childProcess);
}

for (let i = 0; i < numberOfChunks; i++) {
    childProcesses[i].send(0);
}
