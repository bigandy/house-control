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
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("./api");
const email = "<TP LINK ACCOUNT EMAIL>";
const password = "<TP LINK ACCOUNT PASSWORD>";
const deviceIp = "192.168.0.62";
xtest('Login & list devices', () => __awaiter(void 0, void 0, void 0, function* () {
    const cloudToken = yield api_1.cloudLogin(email, password);
    const devices = yield api_1.listDevices(cloudToken);
    console.log(devices);
}));
xtest('List smart plugs', () => __awaiter(void 0, void 0, void 0, function* () {
    const cloudToken = yield api_1.cloudLogin(email, password);
    const devices = yield api_1.listDevicesByType(cloudToken, 'SMART.TAPOPLUG');
    console.log(devices);
    const smartPlug = devices[0];
    console.log(smartPlug);
    const deviceToken = yield api_1.loginDevice(email, password, smartPlug);
    const getDeviceInfoResponse = yield api_1.getDeviceInfo(deviceToken);
    console.log(getDeviceInfoResponse);
}));
xtest('Turn device on', () => __awaiter(void 0, void 0, void 0, function* () {
    const deviceToken = yield api_1.loginDeviceByIp(email, password, deviceIp);
    const getDeviceInfoResponse = yield api_1.getDeviceInfo(deviceToken);
    console.log(getDeviceInfoResponse);
    yield api_1.turnOn(deviceToken);
}));
//# sourceMappingURL=api.test.js.map