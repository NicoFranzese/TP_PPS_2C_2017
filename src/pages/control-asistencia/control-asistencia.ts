import { Component } from '@angular/core';
import { IonicPage,NavController,NavParams,ModalController,ActionSheetController,ViewController, Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { DataProvider } from '../../providers/data/data';
import { GlobalFxProvider } from '../../providers/global-fx/global-fx';
import { AlertController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { ModalCtrlAsistenciaPage} from '../../pages/modal-ctrl-asistencia/modal-ctrl-asistencia';
import { ModalImprimirAlumnosPdfPage} from '../../pages/modal-imprimir-alumnos-pdf/modal-imprimir-alumnos-pdf';
import { Subject } from 'rxjs/Subject';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { LocalNotifications }                           from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-control-asistencia',
  templateUrl: 'control-asistencia.html',
})
export class ControlAsistenciaPage {
  
  items:                any[];
  arrAusencias:         any[];
  tbAsistencias:        any[];
  tbEntidadesPersona:   any[];
  tbCursadasAlumno:     any[];
  tbCursada :           any[];
  tbCursos :            any[];

  lastId :              any;
  lastIdPhoto :         any;
  itemsLengthAux  :     number = 0;
  initialItemsLength :  number = 0;
  comision :            string;
  fechaActual :         string;

  public bandImprimirPDF = 0;
  public bandImprimioPDF = 0;
  public arrAvisos;

  obsDB = new Subject();

   constructor(public navCtrl: NavController,                  public navParams: NavParams,           public db: AngularFireDatabase,
              public dataservice : DataProvider,              public loadingCtrl: LoadingController, public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,  private viewCtrl: ViewController,      private gFx: GlobalFxProvider,
              private alertCtrl: AlertController,
              public  platform: Platform,
              public  localNoti: LocalNotifications) {
    
    console.clear(); 
    this.obtenerAvisos();     
    this.getDate();
    this.comision = this.navParams.get("comision");
    
    if(this.comision!=null){this.initializeItems();}

      this.obsDB.subscribe(
        terminoOperacion =>  this.getListaAlumnos(this.comision)
      );   

  }


  ionViewDidLoad(){   
  }


  getDate(){
    let d = new Date();
    this.fechaActual = d.getDate()+"/"+(Number(d.getMonth())+1)+"/"+d.getFullYear();
    console.log(this.fechaActual);
  }


  // Carga inicial de datos.
   initializeItems(){
    // configuro spinner para mostrar mientras se consultan los datos
      console.log("initializeItems");

      const loading = this.loadingCtrl.create({
        content: 'Espere por favor...'
      });
      loading.present(); 
      
      this.getDBData("cursadas_alumnos");
      this.getDBData("entidades_persona");
      this.getDBData("cursadas");
      this.getDBData("cursos");
      this.getDBData("asistencia_curso");
      this.getDBData("asistencias");

    

      setTimeout(() => {
        loading.dismiss();
      }, 2000);

      
  }//initializeItems()


  getListaAlumnos(comision){
    console.log("getListaAlumnos:"+comision);

    let auxCursos,auxCursadasAlumno,auxCursada,auxCursos2,auxAlumno : any;
    let com = comision.toString().trim().split("-");
    this.items = [];
    this.arrAusencias  = [];

    //filtro los cursos de la comisión (x ej "4A")
    auxCursos = this.tbCursos.filter((item)=> item.comision == com[0]);
    // obtengo el curso para la materia especificada (x ej "PPS")
    auxCursos2 =  auxCursos.find((item)=> item.sigla_materia == com[1]);
    // obtengo la cursada de ese curso
    auxCursada = this.tbCursada.find((item)=> item.id_curso == auxCursos2.id_curso);
    localStorage.setItem("idCursada",auxCursada.id_cursada);
    // filtro todos los alumnos de esa cursada
    auxCursadasAlumno = this.tbCursadasAlumno.filter((item)=> item.id_cursada == auxCursada.id_cursada);

    console.info("auxCursadasAlumno:",auxCursadasAlumno);

    // ya tengo los alumnos que cursan la comision recibida por param
    auxCursadasAlumno.forEach(element => {
      auxAlumno = this.tbEntidadesPersona.find((item)=> item.legajo == element.legajo_alumno);
      this.items.push(auxAlumno);
      this.initialItemsLength = 1;

      // inicializo el array para toma de asistencia
      this.lastId = this.lastId + 1;  
      let obj = 
        {
          'id_asistencia': this.lastId ,
          'id_cursada_alumno' : element.id_cursada_alumno,
          'fecha': this.fechaActual,
          'inasistencia' : 1
        };
          
      this.arrAusencias.push(obj);  
    }); //foreach
   
  }//getListaAlumnos


  getDBData(entityName){
 
    this.dataservice.getItems(entityName).subscribe(
      datos => {
          
            // guardo las tablas para luego poder obtener las comisiones
            switch(entityName) { 
              case 'cursos': { 
                this.tbCursos = datos;
                break; 
              } 
              case 'cursadas':{
                this.tbCursada = datos;
                break;
              }
              case 'cursadas_alumnos':{
                this.tbCursadasAlumno = datos;
                break;
              }
              case 'entidades_persona':{
                this.tbEntidadesPersona = datos;
                break;
              }
              case 'asistencia_curso':{
                this.lastIdPhoto = (datos.length == 0 ? 0 : datos[datos.length-1].id_asistencia_curso );
                break;
              }
              case 'asistencias':{
                this.tbAsistencias = datos;
                this.lastId = (datos.length == 0 ? 0 : datos[datos.length-1].id_asistencia );
                this.obsDB.next();
                break;
              }
    
            }     
      },
      error => console.error(error),
      () => console.log("ok")
    );

  }//getDBData


  getStyle(parLegajo,styleType){
    let result : any;
    let auxAlumno : any;
    auxAlumno = this.tbCursadasAlumno.find((item)=> item.legajo_alumno == parLegajo);
    this.arrAusencias.forEach(element => {
      if (element.id_cursada_alumno==auxAlumno.id_cursada_alumno) {
          if(Number.parseFloat(element.inasistencia) == 0.0){
              result = styleType == "icon" ? 0 : "#367F4F";
          }else if(Number.parseFloat(element.inasistencia) == 1.0){
              result = styleType == "icon" ? 2 : "#FF7A66";
          }else {
              result = styleType == "icon" ? 1 : "#BF9D38";
          }
      }
    });
    return result;
  }


  presentActionSheet() {
    let viewIndex = this.viewCtrl.index;

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selección de comisión por...',
      buttons: [
        {
          text: 'Día',
          icon: 'calendar',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'dia' });
            optionModal.present()
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Materia',
          icon: 'book',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'materia' });
            optionModal.present()
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Aula',
          icon: 'locate',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'aula' });
            optionModal.present() 
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Docente',
          icon: 'person',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'docente' });
            optionModal.present() 
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },
        {
          text: 'Alumno',
          icon: 'school',
          handler: () => {
            let optionModal = this.modalCtrl.create(ModalCtrlAsistenciaPage,{selectedOption:'alumno' });
            optionModal.present()
            .then(() => {
              // first we find the index of the current view controller:
              const index = this.viewCtrl.index;
              // then we remove it from the navigation stack
              this.navCtrl.remove(index);
            });
          }
        },

        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();    
  }//presentActionSheet()


  addAbsence(parLegajo){
    let auxAlumno : any;
    auxAlumno = this.tbCursadasAlumno.find((item)=> item.legajo_alumno == parLegajo);

    this.arrAusencias.forEach(element => {
      if (element.id_cursada_alumno==auxAlumno.id_cursada_alumno) {
        if (element.inasistencia == 1){
          element.inasistencia= 0
        }else if (element.inasistencia == 0){
          element.inasistencia = Number.parseFloat("0.5");
        }else{
          element.inasistencia= 1;
        }
      }
    });
   
  }//addAbsence()


  clear(){
      
    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Desea reiniciar la lista?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.arrAusencias.forEach(element => {
              element.inasistencia = 1;
            });
          }
        }
      ]
    });
    alert.present();
  }


  sendList() {

    let alert = this.alertCtrl.create({
      title: 'Confirmar',
      message: '¿Desea enviar los datos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            try {
              this.arrAusencias.forEach(element => {
                  this.dataservice.addItem('asistencias/' + element.id_asistencia , element);  
              });
              this.gFx.presentToast("Datos enviados correctamente.");
              this.initialItemsLength = 0 ;
              }
              catch (error) {
                this.gFx.presentToast(error);
              }
          }
        }
      ]
    });
    alert.present();

  }//sendList

  
  takePicture(){
    //data es el base64 de la foto
    this.gFx.getPhoto().subscribe(
      data => {
        this.lastIdPhoto = this.lastIdPhoto + 1; 
        let obj = 
        {
          'id_asistencia_curso': this.lastIdPhoto ,
          'id_cursada' : localStorage.getItem("idCursada") ,
          'fecha': this.fechaActual,
          'foto' : data
        };
      
      this.dataservice.addItem('asistencia_curso/' + this.lastIdPhoto , obj);
           
        
      }
    );
  }


  accionesDescarga() {
    let viewIndex = this.viewCtrl.index;

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Seleccione tipo de archivo a descargar...',
      buttons: [
        {
          text: 'Descargar CSV',
          icon: 'book',
          handler: () => {
            this.exportarAExcel();
          }
        },
        {
          text: 'Descargar PDF',
          icon: 'book',
          handler: () => {
            this.exportarAPDF();
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();    
  }//presentActionSheet()

  exportarAExcel(){        
    var options = { 
      fieldSeparator: ';',
      quoteStrings: '',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      useBom: true
    };

    new Angular2Csv(this.items, 'Alumnos', options);
  
  }  
  
  exportarAPDF() {
    let optionModal = this.modalCtrl.create(ModalImprimirAlumnosPdfPage,{items: this.items});
    optionModal.present()
    .then(() => {
    });
   }

   private obtenerAvisos()
   {
     this.dataservice.getItems('avisos_importancia').subscribe(
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
                       title: 'Alerta de Gestión Académica!',
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
                     this.dataservice.deleteItem('avisos_importancia/'+this.arrAvisos[i].id);
                   });
                 }
           }
         }
         // console.log(this.arrAvisos);
       },
       err => console.log(err)
     );
   }

}//class
