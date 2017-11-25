import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PapaParseService } from 'ngx-papaparse';
import { MateriaProvider } from '../../providers/materia/materia';
import { DataProvider } from '../../providers/data/data';
import { CursoProvider } from '../../providers/curso/curso';



@IonicPage()
@Component({
  selector: 'page-carga-archivos',
  templateUrl: 'carga-archivos.html',
})
export class CargaArchivosPage {

  constructor(private materiaProvider: MateriaProvider,
              private alumnoProvider: DataProvider,
              private cursoProvider: CursoProvider,
              private papa: PapaParseService) { }

  private title = "Importar CSV Alumnos";
  private hayArchivo = false;
  private arrAlumnosCSV = [];
  private materia;
  private comision;
  private cuatrimestre;
  private anioLectivo;
  private diaHorario;

  ionViewDidLoad() {

    
  }

  private vaciarCSV()
  {
    this.arrAlumnosCSV = [];
    this.hayArchivo = false;
  }

  private cargarCSV(event)
  {
    // this.fileChooser.open()
    // .then(uri => console.log(uri))
    // .catch(e => console.log(e));


    //Archivo subido
    let file = event.srcElement.files[0];

    //Array con el nombre del archivo
    //1ra posición nombre materia
    //2da posición comisión + cuatrimestre + año
    let arrName = file.name.split("-");

    this.materia = arrName[0];
    this.comision = arrName[1];  

    //Descompongo los datos de la posicion 2 de arrName para poder obtener el año lectivo y separar la extensión del archivo
    let arrAnioLectivo = arrName[2].split(".");
    //Obtengo el cuatrimestre y el año lectivo
    this.cuatrimestre = arrAnioLectivo[0][0];
    this.cuatrimestre += arrAnioLectivo[0][1];
    this.anioLectivo = arrAnioLectivo[0][2];
    this.anioLectivo += arrAnioLectivo[0][3];
    this.anioLectivo += arrAnioLectivo[0][4];
    this.anioLectivo += arrAnioLectivo[0][5];


    // Recorro los datos leidos y armo los registros
    let arrCSV = [];
    this.papa.parse(file,{
      encoding: "ISO-8859-1",
      complete: (results) => {
          for(let i = 0; i < results.data.length -1; i++)
          {
            arrCSV.push(results.data[i]);
          }
          arrCSV.forEach(element => {
            let tupla = element[0].split(';') + element[1].split(';');
            let arrAlumno = tupla.split(',');
            this.arrAlumnosCSV.push(arrAlumno)
            
          });
          this.diaHorario = this.arrAlumnosCSV[0][2];
      }
      
  });
  console.log(this.arrAlumnosCSV);
  this.hayArchivo = true;
 
  }


  private cargarDatos()
  {
    this.insertarMateria();
    this.insertarCurso();
    this.insertarALumno();
  }

  private insertarMateria()
  {
    this.materiaProvider.addMateria(this.materia, this.diaHorario);
  }

  private insertarCurso()
  {
    this.cursoProvider.addCurso(this.materiaProvider.ultimoID, this.comision)
  }

  private insertarALumno()
  { 
    let id: number = 0;
    this.arrAlumnosCSV.forEach(element => {
      id += 1;
      this.alumnoProvider.addAlumno({"id": id, "legajo": element[0], "nombre": element[1]});
    });
  }



}
