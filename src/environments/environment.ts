import { version } from "./version";

export const environment = {
    production: false,
    apiUrl: 'http://127.0.0.1:5000',
    localStorage: 'user_info_RESIA_dev',
    key: 'key_de_prueba',
    storageLogin: 'storage_login',
    version: version.number + ' - q',
    date: version.date,
};