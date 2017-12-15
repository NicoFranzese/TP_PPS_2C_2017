import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private dataProvider: DataProvider) {
    this.CargaMaterias();
    this.obtenerCantidadPersonas();
    this.curso = 'Seleccione Curso'
  }

  ionViewDidLoad() {
        //NICO: cuando le tengo que mostrar al usuario el resultado de la encuesta lo mando a esta pàgina
    //y te mando el id de la encuesta

    if(this.navParams.get('idEncuesta'))
      this.idEncuesta = this.navParams.get('idEncuesta');
    
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

  CargarGraficosAsistencias(){
    if (this.tipoGrafico != "seleccioneTipo"){
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



    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      
                 type: 'doughnut',
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
                         hoverBackgroundColor: [
                             "#FF6384",
                             "#36A2EB",
                             "#FFCE56",
                             "#FF6384",
                             "#36A2EB",
                             "#FFCE56"
                         ]
                     }]
                 }
      
             });
      
             this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      
                 type: 'line',
                 data: {
                     labels: ["January", "February", "March", "April", "May", "June", "July"],
                     datasets: [
                         {
                             label: "My First dataset",
                             fill: false,
                             lineTension: 0.1,
                             backgroundColor: "rgba(75,192,192,0.4)",
                             borderColor: "rgba(75,192,192,1)",
                             borderCapStyle: 'butt',
                             borderDash: [],
                             borderDashOffset: 0.0,
                             borderJoinStyle: 'miter',
                             pointBorderColor: "rgba(75,192,192,1)",
                             pointBackgroundColor: "#fff",
                             pointBorderWidth: 1,
                             pointHoverRadius: 5,
                             pointHoverBackgroundColor: "rgba(75,192,192,1)",
                             pointHoverBorderColor: "rgba(220,220,220,1)",
                             pointHoverBorderWidth: 2,
                             pointRadius: 1,
                             pointHitRadius: 10,
                             data: [65, 59, 80, 81, 56, 55, 40],
                             spanGaps: false,
                         }
                     ]
                 }
      
             });


  }



}

