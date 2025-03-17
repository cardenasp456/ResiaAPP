import { version } from "./version";

export const environment = {
    production: false,
    apiUrl: 'https://tbtbconnect.com/tbtbconnect2.0_api_qa',
    localStorage: 'user_info_tbtbconnect_2.0_qa',
    key: 'key_de_prueba',
    storageLogin: 'storage_login',
    version: version.number + ' - q',
    date: version.date,
};