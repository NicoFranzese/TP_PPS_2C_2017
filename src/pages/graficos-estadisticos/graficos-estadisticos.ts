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
  public encuesta;
  public grafico;
  public encuestas;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private dataProvider: DataProvider) {
    this.CargaMaterias();
    this.obtenerCantidadPersonas();
    this.obtenerEncuestas();
    this.curso = 'Seleccione Curso'
  }

  ionViewDidLoad() {

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

}

