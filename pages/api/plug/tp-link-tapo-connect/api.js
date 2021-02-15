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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTapoDevice = exports.securePassthrough = exports.getDeviceInfo = exports.setBrightness = exports.turnOff = exports.turnOn = exports.loginDeviceByIp = exports.loginDevice = exports.handshake = exports.listDevicesByType = exports.listDevices = exports.cloudLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const tplinkCipher_1 = require("./tplinkCipher");
const network_tools_1 = require("./network-tools");
const baseUrl = 'https://eu-wap.tplinkcloud.com/';
const cloudLogin = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const loginRequest = {
        "method": "login",
        "params": {
            "appType": "Tapo_Android",
            "cloudPassword": password,
            "cloudUserName": email,
            "terminalUUID": "59284a9c-e7b1-40f9-8ecd-b9e70c90d19b"
        }
    };
    const response = yield axios_1.default({
        method: 'post',
        url: baseUrl,
        data: loginRequest
    });
    checkError(response.data);
    return response.data.result.token;
});
exports.cloudLogin = cloudLogin;
const listDevices = (cloudToken) => __awaiter(void 0, void 0, void 0, function* () {
    const getDeviceRequest = {
        "method": "getDeviceList",
    };
    const response = yield axios_1.default({
        method: 'post',
        url: `${baseUrl}?token=${cloudToken}`,
        data: getDeviceRequest
    });
    checkError(response.data);
    return Promise.all(response.data.result.deviceList.map((deviceInfo) => __awaiter(void 0, void 0, void 0, function* () { return augmentTapoDevice(deviceInfo); })));
});
exports.listDevices = listDevices;
const listDevicesByType = (cloudToken, deviceType) => __awaiter(void 0, void 0, void 0, function* () {
    const devices = yield exports.listDevices(cloudToken);
    return devices.filter(d => d.deviceType === deviceType);
});
exports.listDevicesByType = listDevicesByType;
const handshake = (deviceIp) => __awaiter(void 0, void 0, void 0, function* () {
    const keyPair = yield tplinkCipher_1.generateKeyPair();
    const handshakeRequest = {
        method: "handshake",
        params: {
            "key": keyPair.publicKey
        }
    };
    const response = yield axios_1.default({
        method: 'post',
        url: `http://${deviceIp}/app`,
        data: handshakeRequest
    });
    checkError(response.data);
    const setCookieHeader = response.headers['set-cookie'][0];
    const sessionCookie = setCookieHeader.substring(0, setCookieHeader.indexOf(';'));
    const deviceKey = tplinkCipher_1.readDeviceKey(response.data.result.key, keyPair.privateKey);
    return {
        key: deviceKey.subarray(0, 16),
        iv: deviceKey.subarray(16, 32),
        deviceIp,
        sessionCookie
    };
});
exports.handshake = handshake;
const loginDevice = (email, password, device) => __awaiter(void 0, void 0, void 0, function* () { return exports.loginDeviceByIp(email, password, yield network_tools_1.resolveMacToIp(device.deviceMac)); });
exports.loginDevice = loginDevice;
const loginDeviceByIp = (email, password, deviceIp) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceKey = yield exports.handshake(deviceIp);
    const loginDeviceRequest = {
        "method": "login_device",
        "params": {
            "username": tplinkCipher_1.base64Encode(tplinkCipher_1.shaDigest(email)),
            "password": tplinkCipher_1.base64Encode(password)
        }
    };
    const loginDeviceResponse = yield exports.securePassthrough(loginDeviceRequest, deviceKey);
    deviceKey.token = loginDeviceResponse.token;
    return deviceKey;
});
exports.loginDeviceByIp = loginDeviceByIp;
const turnOn = (deviceKey, deviceOn = true) => __awaiter(void 0, void 0, void 0, function* () {
    const turnDeviceOnRequest = {
        "method": "set_device_info",
        "params": {
            "device_on": deviceOn,
        }
    };
    yield exports.securePassthrough(turnDeviceOnRequest, deviceKey);
});
exports.turnOn = turnOn;
const turnOff = (deviceKey) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.turnOn(deviceKey, false);
});
exports.turnOff = turnOff;
const setBrightness = (deviceKey, brightnessLevel = 100) => __awaiter(void 0, void 0, void 0, function* () {
    const setBrightnessRequest = {
        "method": "set_device_info",
        "params": {
            "brightness": brightnessLevel,
        }
    };
    yield exports.securePassthrough(setBrightnessRequest, deviceKey);
});
exports.setBrightness = setBrightness;
const getDeviceInfo = (handshakeResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const turnDeviceOnRequest = {
        "method": "get_device_info"
    };
    return augmentTapoDeviceInfo(yield exports.securePassthrough(turnDeviceOnRequest, handshakeResponse));
});
exports.getDeviceInfo = getDeviceInfo;
const securePassthrough = (deviceRequest, deviceKey) => __awaiter(void 0, void 0, void 0, function* () {
    const encryptedRequest = tplinkCipher_1.encrypt(deviceRequest, deviceKey);
    const securePassthroughRequest = {
        "method": "securePassthrough",
        "params": {
            "request": encryptedRequest,
        }
    };
    const response = yield axios_1.default({
        method: 'post',
        url: `http://${deviceKey.deviceIp}/app?token=${deviceKey.token}`,
        data: securePassthroughRequest,
        headers: {
            "Cookie": deviceKey.sessionCookie
        }
    });
    checkError(response.data);
    const decryptedResponse = tplinkCipher_1.decrypt(response.data.result.response, deviceKey);
    checkError(decryptedResponse);
    return decryptedResponse.result;
});
exports.securePassthrough = securePassthrough;
const augmentTapoDevice = (deviceInfo) => __awaiter(void 0, void 0, void 0, function* () {
    if (exports.isTapoDevice(deviceInfo.deviceType)) {
        return Object.assign(Object.assign({}, deviceInfo), { alias: tplinkCipher_1.base64Decode(deviceInfo.alias) });
    }
    else {
        return deviceInfo;
    }
});
const augmentTapoDeviceInfo = (deviceInfo) => {
    return Object.assign(Object.assign({}, deviceInfo), { ssid: tplinkCipher_1.base64Decode(deviceInfo.ssid), nickname: tplinkCipher_1.base64Decode(deviceInfo.nickname) });
};
const isTapoDevice = (deviceType) => {
    switch (deviceType) {
        case 'SMART.TAPOPLUG':
        case 'SMART.TAPOBULB':
            return true;
        default: return false;
    }
};
exports.isTapoDevice = isTapoDevice;
const checkError = (responseData) => {
    const errorCode = responseData["error_code"];
    if (errorCode) {
        switch (errorCode) {
            case 0: return;
            case -1010: throw new Error("Invalid public key length");
            case -1501: throw new Error("Invalid request or credentials");
            case -1002: throw new Error("Incorrect request");
            case -1003: throw new Error("JSON format error");
            case -20675: throw new Error("Cloud token expired or invalid");
            case 9999: throw new Error("Device token expired or invalid");
            default: throw new Error(`Unexpected Error Code: ${errorCode}`);
        }
    }
};
//# sourceMappingURL=api.js.map