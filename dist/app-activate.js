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
const Mailjs = require("@cemalgnlts/mailjs");
const mailjs = new Mailjs();
const moment = require("moment");
const { getMailCode } = require("./helpers");
const { setUser, getUsers } = require("./firebase");
const { signIn, boost, webAuthValidate } = require("./auth");
let mailConfirmationCode = "";
let userIndex = 0;
let endIndex = 0;
let users = [];
function mailjsLogin(_a) {
    return __awaiter(this, arguments, void 0, function* ({ username, password }) {
        const loginUser = yield mailjs.login(username, password);
        if (!loginUser) {
            validateUser(users[userIndex]);
        }
        mailjs.on("arrive", (msg) => {
            mailConfirmationCode = getMailCode(msg);
            signIn(username, mailConfirmationCode)
                .then(() => boost("activate"))
                .then(() => {
                let user = users[userIndex];
                setUser({
                    username: user.username,
                    password: user.password,
                    lastBoosted: new Date(),
                });
                userIndex++;
                if (!users[userIndex] || userIndex === endIndex) {
                    return;
                }
                return validateUser(users[userIndex]);
            })
                .catch(() => validateUser(users[userIndex]));
            setTimeout(() => {
                if (!mailConfirmationCode) {
                    userIndex++;
                    return validateUser(users[userIndex]);
                }
            }, 60000);
            mailjs.off();
        });
    });
}
function validateUsers(startIndex) {
    return __awaiter(this, void 0, void 0, function* () {
        users = Object.values(yield getUsers());
        if (users.length <= startIndex) {
            return;
        }
        userIndex = startIndex;
        validateUser(users[userIndex]).then();
    });
}
function validateUser(user) {
    return mailjsLogin(user).then(() => {
        if (moment().diff(moment(user === null || user === void 0 ? void 0 : user.lastBoosted), "hours") < 22) {
            userIndex++;
            if (!users[userIndex] || userIndex === endIndex) {
                return;
            }
            return validateUser(users[userIndex]);
        }
        return webAuthValidate({ value: user === null || user === void 0 ? void 0 : user.username }).catch((err) => {
            var _a;
            if (((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                setTimeout(() => {
                    validateUser(user);
                }, 40000);
            }
            else {
                validateUser(user);
            }
        });
    });
}
process.on("message", (chunk) => {
    endIndex = chunk[1];
    validateUsers(chunk[0]).then();
});
