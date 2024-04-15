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
const ProxyList = require('free-proxy');
function getProxyUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        const proxyList = new ProxyList();
        try {
            const proxies = yield Promise.race([
                new Promise((resolve, reject) => setTimeout(reject, 5000)), // Proxy timeout
                proxyList.get()
            ]);
            if (!proxies.length) {
                return null; // No proxies found
            }
            const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
            return `http://${randomProxy.ip}:${randomProxy.port}`;
        }
        catch (error) {
            console.error('Error fetching proxies:', error);
            return null; // Handle errors by returning null
        }
    });
}
exports.getProxyUrl = getProxyUrl;
