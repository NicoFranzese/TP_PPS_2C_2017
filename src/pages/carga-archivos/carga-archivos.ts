import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { PapaParseService } from 'ngx-papaparse';



@IonicPage()
@Component({
  selector: 'page-carga-archivos',
  templateUrl: 'carga-archivos.html',
})
export class CargaArchivosPage {

  constructor(private fileChooser: FileChooser,
              private papa: PapaParseService) { }

  private title = "Importar CSV Alumnos";
  private hayArchivo = false;
  private arrAlumnosCSV = [];
  private materia;
  private comision;
  private anioLectivo;

  ionViewDidLoad() {
    
  }

  private cargarCSV(event)
  {
    // this.fileChooser.open()
    // .then(uri => console.log(uri))
    // .catch(e => console.log(e));


    //Archivo subido
    let file = event.srcElement.files[0];

    //Array donde se guardan los registros
    let arrSCV = [];

    //Array con el nombre del archivo
    //1ra posición nombre materia
    //2da posición comisión + cuatrimestre + año
    let arrName = file.name.split(" ");
    
    //Desconpongo los datos de la primera posicion del arrName con los datos separados por "-"
    let arrDatosCursada = arrName[1].split("-");

    //Descompongo los datos de la posicion 2 de arrDatosCursada para poder obtener el año lectivo y separar la extensión del archivo
    let arrAnioLectivo = arrDatosCursada[2].split(".");

    //Obtengo los datos que necesito "Materia, Comision, Año lectivo"
    this.materia = arrName[0];
    this.comision = arrDatosCursada[1];
    this.anioLectivo = arrAnioLectivo[0];

    //Recorro los datos leidos y armo los registros
    this.papa.parse(file,{
      complete: (results) => {
          for(let i = 0; i < results.data.length -1; i++)
          {
            arrSCV.push(results.data[i]);
          }
        this.arrAlumnosCSV = arrSCV;
        console.log(arrSCV);
      }
  });
  this.hayArchivo = true;
  // this.title = materia + " " + comision + " " + anioLectivo;
  }

}
