import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the ResultadoEscaneadoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ResultadoEscaneadoProvider {

  public ruta = "hosting";

  constructor(public http: Http) {
    // console.log('Hello ResultadoEscaneadoProvider Provider');
  }

  ResultadoEscaneado() {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8; Access-Control-Allow-Origin: *; Access-Control-Allow-Methods "GET,POST,PUT,DELETE,OPTIONS"');
    var ResultadoEscaneado = localStorage.getItem("ResultadoEscaneo");
    //var empEscaneada = "Prueba";

    var jsonAEnviar ={resultado: ResultadoEscaneado};
    return this.http.post(this.ruta + "traerResultadoEscaneado.php",
    JSON.stringify(jsonAEnviar)
    )
    .map(data => data.json());          
  }   

}
