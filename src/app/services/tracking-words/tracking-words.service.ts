import { Injectable } from '@angular/core';
import { WordsDictionaryInterface } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class TrackingWordsService {

  constructor() { }

  words: WordsDictionaryInterface = {
    address: ['Direcciones'],
    App: ['Usuario'],
    city: ['Ciudad'],
    country: ['País'],
    dashboard: ['Tablero'],
    emaillink: ['Enlace de correo electrónico'],
    gender: ['Género'],
    institution: ['Institución'],
    patient: ['Paciente'],
    rol: ['Rol'],
    catalogue: ['Catálogo'],
    users: ['Usuarios'],
    user: ['App'],
    home: ['Inicio'],
    email: ['Correo'],
  };

  keyWordsIncludes = [
    '/Support/get-support-setting',
  ];
}
