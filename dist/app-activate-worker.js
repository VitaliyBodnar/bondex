"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function createProcess() {
    return __awaiter(this, void 0, void 0, function* () {
        const arrayToSplit = Object.keys(yield getUsers());
        const numberOfChunks = 4;
        const childProcesses = [];
        for (let i = 0; i < numberOfChunks; i++) {
            const childProcess = fork(__dirname + "/app-activate.js");
            childProcesses.push(childProcess);
        }
        // Split array into chunks and send chunks to child processes
        let chunkSize = Math.ceil(arrayToSplit.length / numberOfChunks);
        for (let i = 0; i < numberOfChunks; i++) {
            childProcesses[i].send([chunkSize * i, chunkSize * (i + 1)]);
        }
    });
}
createProcess().then();
