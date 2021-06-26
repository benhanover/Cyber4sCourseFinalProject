

import { Schema } from 'mongoose';

const profileSchema = new Schema({
    status :String, 
    about  :String,
    intrests :String, 
    relationshipStatus :String
});
export default profileSchema;