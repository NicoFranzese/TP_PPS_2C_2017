import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare let devicePush;
/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  constructor(public http: Http) {
    // console.log('Hello NotificationProvider Provider');
  }

  init() {
    devicePush.register({
        idUser: '5a25d9b4e971b64f6d95e1ee', // Tu ID de usuario en Device Push
        idApplication: '5c31-4e01-ae4c-9ef6', // El ID de aplicación en Device Push
        position: true, // Activa o desactiva la lectura de gps. El valor por defecto es false
        additionalData: {} // Añade datos adicionales para poder segmentar
    });

    document.addEventListener('notificationReceived', (event: any) => console.log(event.data));
  }
}
