import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CursoProvider {

  private DBcursos = this.db.list('cursos');
  private items: Observable<any[]>;
  private ultimoID: number;
  
    constructor(private db: AngularFireDatabase) {
      this.devolverUltimoId();
    }
  
    public devolverUltimoId()
    {
      let ultimoID;
      this.items = this.DBcursos.valueChanges();
      this.items.subscribe(
        data => {
          this.ultimoID = Number.parseInt(data[data.length-1].id);
        }
      )
       
    }

  public addCurso(id_materia, comision)
  {
    if(this.ultimoID == undefined)
    this.ultimoID = 1;
  else
    this.ultimoID += 1;

    this.DBcursos.push({"id": this.ultimoID, "id_materia": id_materia, "comision": comision});
  }

}
