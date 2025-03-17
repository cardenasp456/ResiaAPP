import { version } from "./version";

export const environment = {
    production: false,
    apiUrl: 'https://localhost:44377',
    localStorage: 'user_info_tbtbconnect_2.0_dev',
    key: 'key_de_prueba',
    storageLogin: 'storage_login',
    version: version.number + ' - q',
    date: version.date,
};