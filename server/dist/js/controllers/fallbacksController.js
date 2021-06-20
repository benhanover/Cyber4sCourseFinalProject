"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorRoute = exports.unknownRoute = void 0;
/*----------------------------------------------------------------------------------------------------------- */
//  handles all uncatched requests
const unknownRoute = (req, res) => {
    console.log('trying to go in:', req.url, req.path);
    res.status(404).send("not found - url path-doesnt exist");
    return;
};
exports.unknownRoute = unknownRoute;
/*----------------------------------------------------------------------------------------------------------- */
// handles all uncatched errors.
const errorRoute = (err, req, res) => {
    console.log("error Occurred when trying to reach the server api's", req.url, req.path);
    res.status(500).send("not found - url path-doesnt exist");
    return;
};
exports.errorRoute = errorRoute;
