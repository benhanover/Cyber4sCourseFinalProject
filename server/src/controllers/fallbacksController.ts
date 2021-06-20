import {  Request, Response } from 'express';

/*----------------------------------------------------------------------------------------------------------- */
//  handles all uncatched requests
export const unknownRoute = (req : Request , res: Response): void => {
    console.log('trying to go in:', req.url, req.path);
    res.status(404).send("not found - url path-doesnt exist");
    return;
}

/*----------------------------------------------------------------------------------------------------------- */
// handles all uncatched errors.
export const errorRoute = (err: unknown , req : Request , res: Response): void => {
    console.log("error Occurred when trying to reach the server api's", req.url, req.path);
    res.status(500).send("not found - url path-doesnt exist");
    return;
}