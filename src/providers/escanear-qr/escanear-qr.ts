import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the EscanearQrProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EscanearQrProvider {

  public ruta = "hosting";

  constructor(public http: Http) {
    // console.log('Hello EscanearQrProvider Provider');
  }

  EscanearQr(codigoQR, tipo) {    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8; Access-Control-Allow-Origin: *; Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"');
     
      var jsonAEnviar ={codigoQR: codigoQR, tipo: tipo};
      return this.http.post(this.ruta + "escaneoQr.php",
      JSON.stringify(jsonAEnviar)
    )
    .map(response => localStorage.setItem("Resultado Escaneo", response.text()));
  }

}
