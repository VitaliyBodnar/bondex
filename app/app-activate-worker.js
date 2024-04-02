const { getUsers } = require("./firebase");
const { fork } = require("child_process");

// Function to split array into chunks
function chunkArray(array, chunkSize) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

// Array to split into chunks

// Fork child processes

async function createProcess() {
  const arrayToSplit = await getUsers();
  const numberOfChunks = 4;

  const childProcesses = [];
  for (let i = 0; i < numberOfChunks; i++) {
    const childProcess = fork(__dirname + "/app-activate.js");
    childProcesses.push(childProcess);
  }

  // Split array into chunks and send chunks to child processes
  let chunkSize = Math.ceil(arrayToSplit.length / numberOfChunks);
  const chunks = chunkArray(
    arrayToSplit,
    Math.ceil(arrayToSplit.length / numberOfChunks)
  );
  for (let i = 0; i < chunks.length; i++) {
    childProcesses[i].send([chunkSize * i, chunkSize * (i + 1)]);
  }
}

createProcess().then();
