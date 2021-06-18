"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
console.log(process.env.environment);
switch (process.env.environment) {
    case 'dev':
        dotenv_1.default.config({ path: './dev.env' });
        break;
    case 'test':
        dotenv_1.default.config({ path: './test.env' });
        break;
    case 'prod':
        dotenv_1.default.config({ path: './prod.env' });
        break;
    default:
        // dotenv.config({ path: './dev.env' });
        console.log('did not match any');
        break;
}
