import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PapaParseService } from 'ngx-papaparse';
import { CsvAlumnosProvider } from '../../providers/csv-alumnos/csv-alumnos';


@IonicPage()
@Component({
  selector: 'page-carga-archivos',
  templateUrl: 'carga-archivos.html',
})

// const fileTransfer: FileTransferObject = this.transfer.create();


export class CargaArchivosPage {

  

  constructor(private csvAlumnosProvider: CsvAlumnosProvider,
              private papa: PapaParseService) { }

            
  private title = "Importar CSV Alumnos";
  private hayArchivo = false;
  private arrAlumnosCSV = [];
  private materia;
  private comision;
  private cuatrimestre;
  private anioLectivo;
  private diaHorario;
  private fondo = "#02648b";


  ionViewDidLoad() {
    this.csvAlumnosProvider.operacionFinalizada$.subscribe(
      data => this.vaciarCSV()
    );
  }

  private vaciarCSV()
  {
    this.arrAlumnosCSV = [];
    this.hayArchivo = false;
    this.fondo = "#02648b";
  }

  private cargarCSV(event)
  {
    this.fondo = "#fff";
    //Archivo subido
    console.log(event);
    let file = event.srcElement.files[0];
    console.log(file);

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

        let res = results.data[0][0].split(';').length

        if(res == 2)
        {
          for(let i = 0; i < results.data.length -1; i++)
          {
            arrCSV.push(results.data[i]);
          }
          console.log(arrCSV);
          arrCSV.forEach(element => {
            let tupla = element[0].split(';') + element[1].split(';');
            // console.log(tupla);
            let arrAlumno = tupla.split(',');
            this.arrAlumnosCSV.push(arrAlumno)
            
          });
          this.diaHorario = this.arrAlumnosCSV[0][2];
        }
        else
        {
          for(let i = 0; i < results.data.length -1; i++)
          {
            this.arrAlumnosCSV.push(results.data[i]);
          }
          this.diaHorario = this.arrAlumnosCSV[0][2];
          console.log(this.arrAlumnosCSV);
        }
      }
      
  });
  console.log(this.arrAlumnosCSV);
  this.hayArchivo = true;

  console.log("Materia: ", this.materia);
  console.log("Comision: ", this.comision);
  console.log(this.arrAlumnosCSV);
 
  }


  private cargarDatos()
  {
    this.operacionFinalizada();
    this.csvAlumnosProvider.cargarAlumnos(this.arrAlumnosCSV, this.materia, this.comision);
  }

  private operacionFinalizada()
  {
    let ref = this.csvAlumnosProvider.operacionFinalizada$.subscribe(
      data =>
      {
        this.vaciarCSV();
        ref.unsubscribe();
      }
    )
  }

  
}
