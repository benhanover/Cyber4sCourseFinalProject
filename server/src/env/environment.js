import dotenv from 'dotenv';
console.log(process.env.environment);

switch (process.env.environment) {
  case 'dev':
    dotenv.config({ path: './dev.env' });
    break;
  case 'test':
    dotenv.config({ path: './test.env' });
    break;
  case 'prod':
    dotenv.config({ path: './prod.env' });
    break;
  default:
    // dotenv.config({ path: './dev.env' });
    console.log('did not match any');
    break;
}
