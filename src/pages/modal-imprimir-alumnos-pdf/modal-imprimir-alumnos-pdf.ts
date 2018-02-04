import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalImprimirAlumnosPdfPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-imprimir-alumnos-pdf',
  templateUrl: 'modal-imprimir-alumnos-pdf.html',
})
export class ModalImprimirAlumnosPdfPage {
  public items;

  //Traducciones

  public traduccionTitulo;
  public traduccionLegajo;
  public traduccionAlumno;
  public traduccionExportarPDF;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    //Si aún no se presionó ningún lenguaje, se setea por defecto Español
    if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
      localStorage.setItem("Lenguaje", "Es");
    }
    //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
    this.traducir(localStorage.getItem("Lenguaje"));

    this.items =  this.navParams.get('items');
    // this.confirmarExportacion();

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalImprimirAlumnosPdfPage');
  }

    //Método que traduce objetos de la pagina 
traducir(lenguaje){    
  //Según lenguaje seleccionado se traducen los objetos.
  if(lenguaje == 'Es'){
    this.traduccionTitulo = "Imprimir Listado de Alumnos Pdf";
    this.traduccionLegajo ="Legajo";
    this.traduccionAlumno ="Alumno";
    this.traduccionExportarPDF = "Exportar PDF";

  }else if(lenguaje == 'Usa'){
    this.traduccionTitulo = "Print List of Students Pdf";
    this.traduccionLegajo ="File";
    this.traduccionAlumno ="Student";
    this.traduccionExportarPDF = "Export PDF";


  }else if(lenguaje == 'Br'){
    this.traduccionTitulo = "Imprimir lista de alunos Pdf";
    this.traduccionLegajo ="Arquivo";
    this.traduccionAlumno ="Estudante";
    this.traduccionExportarPDF = "Exportar PDF";

  }

}


  confirmarExportacion(){
    if(document.getElementById("divImprimir") != null){
      let printContents, popupWin;
      printContents = document.getElementById('divImprimir').innerHTML;

      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>

          </head>
            <body onload="window.print();window.close()">${printContents}</body>
        </html>`
      );
      popupWin.document.close();
    }
  }

}
