import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataProvider {

  private DBalumnos = this.db.list('alumnos');
  private items: Observable<any[]>;


  constructor(private db: AngularFireDatabase) {
  }

  public setItem(votacion) {
    // this.items.push(votacion);
  }
  
  public getItems(entityName) {
    this.items = this.db.list(entityName).valueChanges();
    return this.items;
  }

  //MÈTODO PARA DAR DE ALTA y MODIFICACIÒN
  //entityName: nombre de la entidad del json de firebase
  //object: objeto a insertar en el json de firebase
  //el object debe poseer un campo ID que serà el que identificarà a los elementos hijos del json
  public addItem(entityName, object)
  {
    this.db.database.ref(entityName +'/'+ object.id).set(object);
  }
  

}
