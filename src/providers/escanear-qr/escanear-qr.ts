import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the EscanearQrProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EscanearQrProvider {

  public ruta = "hosting";
  items: Observable<any[]>;

  constructor(public http: Http, public db: AngularFireDatabase) {
    // console.log('Hello EscanearQrProvider Provider');
  }

  EscanearQr(codigoQR, tipo, usuLog) {
      var jsonAEnviar ={codigoQR: codigoQR, tipo: tipo, usuario: usuLog};
      return this.http.post(this.ruta + "escaneoQr.php",
      JSON.stringify(jsonAEnviar)
    )
    .map(response => localStorage.setItem("ResultadoEscaneo", response.text()));
    // .map(data => data.json());  
  }

  public getExisteQR(entityName) {
    this.items = this.db.list(entityName).valueChanges();
    return this.items;
  }

}
