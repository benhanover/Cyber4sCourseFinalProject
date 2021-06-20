
// import libraries
import { Router } from 'express';

//import controllers
import {unknownRoute,errorRoute} from "../controllers/fallbacksController"
//Declerations
const fallbacks: Router= Router();

fallbacks.use(unknownRoute)
fallbacks.use(errorRoute)




export default fallbacks