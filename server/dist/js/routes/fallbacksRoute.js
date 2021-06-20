"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import libraries
const express_1 = require("express");
//import controllers
const fallbacksController_1 = require("../controllers/fallbacksController");
//Declerations
const fallbacks = express_1.Router();
fallbacks.use(fallbacksController_1.unknownRoute);
fallbacks.use(fallbacksController_1.errorRoute);
exports.default = fallbacks;
