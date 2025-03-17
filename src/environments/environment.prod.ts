import { version } from "./version";

export const environment = {
  production: true,
  apiUrl: 'https://localhost:44377',
  localStorage: 'user_info_tbtbconnect_2.0',
  key: 'key_de_prueba',
  storageLogin: 'storage_login',
  version: version.number + ' - q',
  date: version.date,
};
