import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class MateriaProvider {

  private materias = this.db.list('materias');
  private items: Observable<any[]>;
  public ultimoID: number;

  constructor(private db: AngularFireDatabase) {
    this.devolverUltimoId();
  }

  public devolverUltimoId()
  {
    this.items = this.materias.valueChanges();
    this.items.subscribe(
      data => {
        this.ultimoID = Number.parseInt(data[data.length-1].id);
      }
    );
  }

  public addMateria(materia: string, dia: string)
  {
    if(this.ultimoID == undefined)
      this.ultimoID = 1;
    else
      this.ultimoID += 1;

    this.materias.push({"id": this.ultimoID, "materia": materia, "dia": dia});
  }
}
