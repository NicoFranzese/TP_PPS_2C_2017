import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the DataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataProvider {

  private DBalumnos = this.db.list('alumnos');
  private items: Observable<any[]>;


  constructor(public http: Http, public db: AngularFireDatabase) {
    // console.log('Hello DataProvider Provider');
  }


  public setItem(votacion) {
    // this.items.push(votacion);
  }


  
  public getItems(entityName) {
    this.items = this.db.list(entityName).valueChanges();
    return this.items;
  }

  public addAlumno(alumno)
  {
    this.DBalumnos.push(alumno);
  }


}
