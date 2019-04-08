import { config } from 'dotenv';

declare const process: {
    // nevermind
    env: {
        [key: string]: string;
    };
};
config(); // load .env file
// Get an env value by key
export const Env = (key: string, fallback: any = null) => {
    return !process.env[key] ? fallback : process.env[key];
};
