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
const { getMailCode, generateRandomUsername, generateRandomSurname, generateRandomNumbers, generateRandomJob, } = require("./helpers");
const { signIn, accountOnboard, boost, authenticationValidate, } = require("./auth");
const { setUser } = require("./firebase");
const inviteCode = "DLJSW";
let mailConfirmationCode = "";
function mailjsCreateAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const acc = yield mailjs.createOneAccount();
        if (!acc) {
            create();
        }
        const user = acc.data;
        mailjs.on("arrive", (msg) => {
            mailConfirmationCode = getMailCode(msg);
            mailjs.off();
            signInProcess(user, mailConfirmationCode)
                .then(() => setUser(user))
                .then(() => create());
        });
        setTimeout(() => {
            if (!mailConfirmationCode) {
                mailjs.off();
                create();
            }
        }, 60000);
        return user;
    });
}
function signInProcess(user, mailConfirmationCode) {
    return signIn(user.username, mailConfirmationCode)
        .then(() => accountOnboard({
        inviteCode,
        step: 0,
    }))
        .then(() => accountOnboard({
        firstName: generateRandomUsername(),
        lastName: generateRandomSurname(),
        headline: generateRandomJob(),
        step: 1,
    }))
        .then(() => accountOnboard({
        step: 2,
        skip: true,
    }))
        .then(() => accountOnboard({
        step: 3,
        phone: generateRandomNumbers(),
        countryCode: +1,
        isoCode: "UA",
    }))
        .then(() => accountOnboard({
        step: 4,
        country: "United States",
        city: "Columbus",
        latitude: 39.9862,
        longitude: -82.9855,
    }))
        .then(() => accountOnboard({
        step: 5,
        skip: true,
    }))
        .then(() => boost('create'))
        .catch((err) => {
        var _a;
        console.error({ signInProcessErr: (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status });
    });
}
function create() {
    mailjsCreateAccount()
        .then((user) => authenticationValidate(user.username).catch((err) => {
        var _a, _b;
        console.log({ createErr: ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || err });
        if (((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status) === 429) {
            setTimeout(() => {
                create();
            }, 40000);
        }
        else {
            create();
        }
    }));
}
create();
