import packageJson from '../../package.json';

const APP_VERSION = packageJson.version + '-dev';

export const environment = {
  production: false,
  APP_VERSION,
  SERVER_URL: 'http://localhost:3000/api',
};
