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
const fs = require('fs');
const filePath = 'src/db/db.json';
function setUser(user) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }
        const jsonData = JSON.parse(data || '{}');
        jsonData[user.username] = Object.assign(Object.assign({}, user), { lastBoosted: new Date() });
        const updatedJsonData = JSON.stringify(jsonData, null, 2);
        fs.writeFile(filePath, updatedJsonData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
        });
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data || '{}');
        return jsonData;
    });
}
exports.setUser = setUser;
exports.getUsers = getUsers;
