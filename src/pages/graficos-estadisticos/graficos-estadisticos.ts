import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

import { LocalNotifications }                           from '@ionic-native/local-notifications';

/**
 * Generated class for the GraficosEstadisticosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-graficos-estadisticos',
  templateUrl: 'graficos-estadisticos.html',
})
export class GraficosEstadisticosPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  @ViewChild('lineCanvas') lineCanvas;
  
  barChart: any;
  doughnutChart: any;
  lineChart: any;

  public data;
  public view;
  public tipoGrafico;
  public cursos;
  public curso;
  public CantidadPersonas;
  public encuesta;
  public grafico;
  public encuestas;
  public arrAvisos;

  public traduccionTitulo;
  public traduccionElijaCurso;
  public traduccionSeleccioneCurso;
  public traduccionQueDeseaGraficar;
  public traduccionSeleccioneGrafico;
  public traduccionAsistencias;
  public traduccionEncuestas;
  public traduccionSeleccioneEncuesta;
  public traduccionElijaEncuesta;
  public traduccionTipoAsistenciaDeseaGraficar;
  public traduccionSeleccioneTipoAsistencia;
  public traduccionPresente;
  public traduccionMediaFalta;
  public traduccionAusente;
  public traduccionGraficoDeAsistencias;
  public traduccionPersonasQueRealizaronEncuesta;
  

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private dataProvider: DataProvider,
    public  platform: Platform,
    public  localNoti: LocalNotifications) {
          //Si aún no se presionó ningún lenguaje, se setea por defecto Español
    if ((localStorage.getItem("Lenguaje") == "") || (localStorage.getItem("Lenguaje") == null) || (localStorage.getItem("Lenguaje") == undefined)){
      localStorage.setItem("Lenguaje", "Es");
    }
    //Le paso el lenguaje que se presionó en sesiones anteriores dentro de la APP
    this.traducir(localStorage.getItem("Lenguaje"));
    this.obtenerAvisos();
    this.CargaMaterias();
    this.obtenerCantidadPersonas();
    this.obtenerEncuestas();
    this.curso = 'Seleccione Curso'
  }

  ionViewDidLoad() {

  }

//Método que traduce objetos de la pagina 
traducir(lenguaje){    
  //Según lenguaje seleccionado se traducen los objetos.
  if(lenguaje == 'Es'){
    this.traduccionTitulo = "Gráficos Estadisticos";
    this.traduccionElijaCurso ="Elija Curso";
    this.traduccionSeleccioneCurso ="Seleccione Curso";
    this.traduccionQueDeseaGraficar = "Que desea Graficar?";
    this.traduccionSeleccioneGrafico = "Seleccione gráfico";
    this.traduccionAsistencias = "Asistencias";
    this.traduccionEncuestas = "Encuestas";
    this.traduccionSeleccioneEncuesta = "Seleccione Encuesta";
    this.traduccionElijaEncuesta = "Elija Encuesta";
    this.traduccionTipoAsistenciaDeseaGraficar = "Que tipo de asistencia desea graficar?";
    this.traduccionSeleccioneTipoAsistencia = "Seleccione tipo de asistencia";
    this.traduccionPresente = "Presente";
    this.traduccionMediaFalta = "Media Falta";
    this.traduccionAusente = "Ausente";
    this.traduccionGraficoDeAsistencias = "Gráfico de Asistencia";
    this.traduccionPersonasQueRealizaronEncuesta ="Personas Que realizaron Encuesta";


  }else if(lenguaje == 'Usa'){
    this.traduccionTitulo = "Statistical Graphs";
    this.traduccionElijaCurso ="Choose Course";
    this.traduccionSeleccioneCurso ="Select Course";
    this.traduccionQueDeseaGraficar = "What do you want to graph?";
    this.traduccionSeleccioneGrafico = "Select graphic";
    this.traduccionAsistencias = "Assists";
    this.traduccionEncuestas = "Surveys";
    this.traduccionSeleccioneEncuesta = "Select Survey";
    this.traduccionElijaEncuesta = "Choose Survey";
    this.traduccionTipoAsistenciaDeseaGraficar = "What kind of assistance do you want to graph?";
    this.traduccionSeleccioneTipoAsistencia = "Select type of assistance";
    this.traduccionPresente = "I presented";
    this.traduccionMediaFalta = "Half Fault";
    this.traduccionAusente = "Absent";
    this.traduccionGraficoDeAsistencias = "Attendance Chart";
    this.traduccionPersonasQueRealizaronEncuesta ="People Who Surveyed";

  }else if(lenguaje == 'Br'){
    this.traduccionTitulo = "Gráficos estatísticos";
    this.traduccionElijaCurso ="Escolha Curso";
    this.traduccionSeleccioneCurso ="Selecione Curso";
    this.traduccionQueDeseaGraficar = "O que você deseja representar?";
    this.traduccionSeleccioneGrafico = "Selecione gráfico";
    this.traduccionAsistencias = "Assistências";
    this.traduccionEncuestas = "Pesquisas";
    this.traduccionSeleccioneEncuesta = "Selecione Pesquisa";
    this.traduccionElijaEncuesta = "Escolha Pesquisa";
    this.traduccionTipoAsistenciaDeseaGraficar = "Que tipo de assistência você deseja representar?";
    this.traduccionSeleccioneTipoAsistencia = "Selecione o tipo de assistência";
    this.traduccionPresente = "Presente";
    this.traduccionMediaFalta = "Half Fault";
    this.traduccionAusente = "Ausente";
    this.traduccionGraficoDeAsistencias = "Gráfico de participação";
    this.traduccionPersonasQueRealizaronEncuesta ="Pessoas que pesquisaram";

  }

}

  private obtenerCantidadPersonas()
  {
    this.dataProvider.getItems('entidades_persona').subscribe(
      data =>
      {
        this.CantidadPersonas = data.length;

      },
      err => console.error(err)
    );
  }

  private obtenerEncuestas()
  {
    this.dataProvider.getItems('cuestionarios').subscribe(
      data =>
      {
        this.encuestas = data;

      },
      err => console.error(err)
    );
  }

  CargaMaterias() {
    // configuro spinner para mientras se cargan los datos 
    const loading = this.loadingCtrl.create({
      content: 'Espere por favor...'
    });
    loading.present();

    //recupero los datos, mientras muestra spinner
    this.dataProvider.getItems("cursos").subscribe(
      datos => {      
        this.cursos = datos;

        setTimeout(() => {
          loading.dismiss();
        }, 3000);

      },
      error => console.error(error),
      () => console.log("ok")
    );
  }

  MostrarCurso(){
    console.log(this.curso);
  }

    CargaGraficos(){
        if ((this.tipoGrafico != "seleccioneTipo") && (this.grafico = "Asistencias")){
            this.barChart = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }

            });
        }


        if ((this.encuesta != "seleccioneEncuesta") && (this.grafico = "Encuestas")){
            this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {      
                type: 'doughnut',
                data: {
                    labels: ["Gente que Respondió", "Gente que no respondió"],
                    datasets: [{
                        label: '# de gente que realizó encuesta seleccionada',
                        data: [12, 19],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)'
                        ],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB"
                        ]
                    }]
                }
            });        
        }
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

