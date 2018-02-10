import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PapaParseService } from 'ngx-papaparse';
import { CsvAlumnosProvider } from '../../providers/csv-alumnos/csv-alumnos';
import { LocalNotifications }                           from '@ionic-native/local-notifications';
import { DataProvider } from '../../providers/data/data';
@IonicPage()
@Component({
  selector: 'page-carga-archivos',
  templateUrl: 'carga-archivos.html',
})

// const fileTransfer: FileTransferObject = this.transfer.create();


export class CargaArchivosPage {

  public arrAvisos;

  constructor(private csvAlumnosProvider: CsvAlumnosProvider,
              private papa: PapaParseService,
              public  platform: Platform,
              public  localNoti: LocalNotifications,
              private dataProvider: DataProvider) { 
                //Si aún no se presionó ningún lenguaje, se setea por defecto Español
                if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
                  localStorage.setItem("Lenguaje", "Es");
                }
                //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
                this.traducir(localStorage.getItem("Lenguaje"));


                this.obtenerAvisos();
              }

  private hayArchivo = false;
  private arrAlumnosCSV = [];
  private materia;
  private comision;
  private cuatrimestre;
  private anioLectivo;
  private diaHorario;
  private fondo = "#02648b";

  public traduccionTitulo;
  public traduccionCargarArchivo;
  public traduccionLegajo;
  public traduccionAlumno;
  public traduccionTitle;

  ionViewDidLoad() {
    this.csvAlumnosProvider.operacionFinalizada$.subscribe(
      data => this.vaciarCSV()
    );
  }

  //Método que traduce objetos de la pagina 
  traducir(lenguaje){    
    //Según lenguaje seleccionado se traducen los objetos.
    if(lenguaje == 'Es'){
      this.traduccionTitulo = "Importar CSV Alumnos";
      this.traduccionCargarArchivo ="Cargar Archivo";
      this.traduccionLegajo ="Legajo";
      this.traduccionAlumno ="Alumno";
      this.traduccionTitle = "Alerta de Gestión Académica!"
    }else if(lenguaje == 'Usa'){
      this.traduccionTitulo = "Import CSV Students";
      this.traduccionCargarArchivo ="File upload";
      this.traduccionLegajo ="File";
      this.traduccionAlumno ="Student";
      this.traduccionTitle = "Academic Management Alert!"
    }else if(lenguaje == 'Br'){
      this.traduccionTitulo = "Estudantes CSV importados";
      this.traduccionCargarArchivo ="Carregar arquivo";
      this.traduccionLegajo ="Arquivo";
      this.traduccionAlumno ="Estudante";
      this.traduccionTitle = "Alerta de Gestão Acadêmica!"
    }

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
  // console.log(this.arrAlumnosCSV);
 
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

  private obtenerAvisos()
  {
    this.dataProvider.getItems('avisos_importancia').subscribe(
      data => 
      {
        // this.arrPersonas = data;

        if(data == undefined)
        {
          // alert("No existen personas cargadas en la BD");
        }
        else
        {
          this.arrAvisos = data;

          for (let i=0;i<this.arrAvisos.length;i++){ 
            let legajo = this.arrAvisos[i].legajo;
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
                }else{
                  this.platform.ready().then(() => {
                    this.localNoti.schedule({
                      title: this.traduccionTitle,
                      text: this.arrAvisos[i].mensaje,
                      at: new Date(new Date().getTime() + 3600),
                      led: 'FF0000',
                      icon:'', //ruta del icono
                      sound: 'assets/sonidos/notificacion.mp3' //Ruta del archivo de sonido
                    });
                  //Elimino aviso para que no vuelva a enviarlo.
                    // this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                  });
                }
          }

          for (let i=0;i<this.arrAvisos.length;i++){ 
            let legajo = this.arrAvisos[i].legajo;
            if ((legajo < localStorage.getItem("legajoLogueado").toString()) || 
                (legajo > localStorage.getItem("legajoLogueado").toString())){
                  
                }else{
                  this.platform.ready().then(() => {
                  //Elimino aviso para que no vuelva a enviarlo.
                    this.dataProvider.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                  });
                }
          }
        }
        // console.log(this.arrAvisos);
      },
      err => console.log(err)
    );
  }
  
}
