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
exports.shaDigest = exports.base64Decode = exports.base64Encode = exports.readDeviceKey = exports.decrypt = exports.encrypt = exports.generateKeyPair = void 0;
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
const RSA_CIPHER_ALGORITHM = 'rsa';
const AES_CIPHER_ALGORITHM = 'aes-128-cbc';
const PASSPHRASE = "top secret";
const generateKeyPair = () => __awaiter(void 0, void 0, void 0, function* () {
    const RSA_OPTIONS = {
        modulusLength: 1024,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: PASSPHRASE
        }
    };
    const generateKeyPair = util_1.default.promisify(crypto_1.default.generateKeyPair);
    return generateKeyPair(RSA_CIPHER_ALGORITHM, RSA_OPTIONS);
});
exports.generateKeyPair = generateKeyPair;
const encrypt = (data, deviceKey) => {
    var cipher = crypto_1.default.createCipheriv(AES_CIPHER_ALGORITHM, deviceKey.key, deviceKey.iv);
    var ciphertext = cipher.update(Buffer.from(JSON.stringify(data)));
    return Buffer.concat([ciphertext, cipher.final()]).toString('base64');
};
exports.encrypt = encrypt;
const decrypt = (data, deviceKey) => {
    var cipher = crypto_1.default.createDecipheriv(AES_CIPHER_ALGORITHM, deviceKey.key, deviceKey.iv);
    var ciphertext = cipher.update(Buffer.from(data, 'base64'));
    return JSON.parse(Buffer.concat([ciphertext, cipher.final()]).toString());
};
exports.decrypt = decrypt;
const readDeviceKey = (pemKey, privateKey) => {
    const keyBytes = Buffer.from(pemKey, 'base64');
    const deviceKey = crypto_1.default.privateDecrypt({
        key: privateKey,
        padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
        passphrase: PASSPHRASE,
    }, keyBytes);
    return deviceKey;
};
exports.readDeviceKey = readDeviceKey;
const base64Encode = (data) => {
    return Buffer.from(data).toString('base64');
};
exports.base64Encode = base64Encode;
const base64Decode = (data) => {
    return Buffer.from(data, 'base64').toString();
};
exports.base64Decode = base64Decode;
const shaDigest = (data) => {
    var shasum = crypto_1.default.createHash('sha1');
    shasum.update(data);
    return shasum.digest('hex');
};
exports.shaDigest = shaDigest;
//# sourceMappingURL=tplinkCipher.js.map