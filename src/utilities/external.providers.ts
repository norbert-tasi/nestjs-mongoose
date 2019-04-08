import axios from 'axios';

const config = require('../../keys/settings.json');

export const externalProviders = {
    provide: 'Externals',
    useFactory: () => {
        const externals = {};
        for (const lang in config.externals) {
            externals[lang] = axios.create({
                baseURL: config.externals[lang]
            });
        }
        return externals;
    }
};
