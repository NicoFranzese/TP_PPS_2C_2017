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

  public addItem(entityName, object)
  {
    return this.db.list(entityName).push(object);
  }

}
