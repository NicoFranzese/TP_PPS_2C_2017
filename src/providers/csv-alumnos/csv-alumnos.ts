import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DataProvider } from '../data/data';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Subject } from 'Rxjs';



@Injectable()
export class CsvAlumnosProvider {

  private arrCursadas = [];
  private arrCursos = [];
  private arrCursadasAlumnos = [];
  private ultimoIdCursadasAlumnos: number = 0;
  private toast;
  private loader = this.loadingCtrl.create({
    content: "Inscribiendo alumnos..."
  });

  private operacionFinalizada = new Subject();
  public operacionFinalizada$ = this.operacionFinalizada.asObservable();


  constructor(private dataProvider: DataProvider,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController) 
  {
    this.traerArrCursadas();
    this.traerArrCursos();
    this.traerArrCursadasAlumnos();
  }

  private traerArrCursadas()
  {
    this.dataProvider.getItems('cursadas').subscribe(
      data => 
       {
         this.arrCursadas = data; 
         console.log(this.arrCursadas);
        },
      err => console.error(err)
    );
  }

  private traerArrCursos()
  {
    this.dataProvider.getItems('cursos').subscribe(
      data => 
      {
        this.arrCursos = data; 
        console.log(this.arrCursos);
      },
      err => console.error(err)
    );
  }

  private traerArrCursadasAlumnos()
  {
    this.dataProvider.getItems('cursadas_alumnos').subscribe(
      data => 
      {
        this.arrCursadasAlumnos = data; 
        this.obtenerUltimoIdCursadasAlumnos();
      },
      err => console.error(err)
    );
  }

  private obtenerUltimoIdCursadasAlumnos()
  {
    if(this.arrCursadasAlumnos.length != 0)
    {
      this.ultimoIdCursadasAlumnos = this.arrCursadasAlumnos[this.arrCursadasAlumnos.length-1].id_cursada_alumno;
    }
    console.log(this.ultimoIdCursadasAlumnos);
  }

  private obtenerIdCurso(materia: string, comision: string)
  {
    let idCurso = -1;
    let materiaUpp = materia.toUpperCase();
    let comisionUpp = comision.toUpperCase();

    this.arrCursos.forEach(element => {
      
     
      let matElementUpp = element.sigla_materia.toUpperCase();
      let comElementUpp = element.comision.toUpperCase();

      console.log("Materia: ", materiaUpp);
      console.log("Materia element: ", matElementUpp);
      console.log('////');
      console.log("Comision: ", comisionUpp);
      console.log("Comision element: ", comElementUpp);

      if(materiaUpp.localeCompare(matElementUpp) == 0 && comisionUpp.localeCompare(comElementUpp) == 0)
      {
        idCurso = element.id_curso;
      }
      
    });

    if(idCurso != -1)
      return idCurso;
    else
      return false;
  }

  private obtenerIdCursada(id_curso)
  {
    let idCursadaEncontrada = -1;

    this.arrCursadas.forEach(element => {
      if(element.id_curso == id_curso)
       idCursadaEncontrada = element.id_cursada;
    });

    if(idCursadaEncontrada != -1)
      return idCursadaEncontrada;
    else
      return false;
  } 

  public cargarAlumnos(arrAlumnos, materia, comision)
  {
    this.loader.present();

    let idCurso = this.obtenerIdCurso(materia, comision);

    if(idCurso)
    {
      let idCursada = this.obtenerIdCursada(idCurso);
      let cantSubidas: number = 0;

      //CARGO LOS ALUMNOS
      arrAlumnos.forEach(element => {
        this.ultimoIdCursadasAlumnos += 1;
        this.dataProvider.addItem('cursadas_alumnos',
        {
          'id_cursada_alumno': this.ultimoIdCursadasAlumnos, 
          'legajo_alumno': element[0],
          'id_cursada': idCursada
        });
        cantSubidas += 1;
      }); 
      
      //Si se suben todos los alumnos cargo la pantalla
      if(cantSubidas == arrAlumnos.length)
      {
        this.loader.dismiss();
        this.crearToast("¡Usuarios guardados exitosamente!");
      }
      else
      {
        this.loader.dismiss();
        this.crearToast("Hubo un problema al guardar los usuarios");
      }
      this.operacionFinalizada.next();
    }
    else
    {
      alert("Materia o comisiòn no cargadas");
    }

  }

  private crearToast(msg: string)
  {
    this.toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    }).present();
  }



}
