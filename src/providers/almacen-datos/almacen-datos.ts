import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'


  //Este servicio se usa para comunicar datos entre componentes


@Injectable()
export class AlmacenDatosProvider {

  public arrMenuOpciones = new BehaviorSubject([]);
  public arrMenuOpciones$ = this.arrMenuOpciones.asObservable();

  constructor() {
    
  }

}
