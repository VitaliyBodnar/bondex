const { fork } = require('child_process');

function runProcesses() {
    const childProcesses = [];
    const createWorker = fork(__dirname + '/app-create-worker.js');
    childProcesses.push(createWorker);
    
    const activateWorker = fork(__dirname + '/app-activate-worker.js');
    childProcesses.push(activateWorker);
    
    for (let i = 0; i < childProcesses.length; i++) {
        childProcesses[i].send(0);
    }
}

exports.runProcesses = runProcesses;