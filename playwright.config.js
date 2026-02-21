// @ts-check
import { defineConfig} from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  reporter: 'html',

  timeout: 10000,

  use: {
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders:{
        'Content-Type': 'application/json'
      }
  }
   
});

