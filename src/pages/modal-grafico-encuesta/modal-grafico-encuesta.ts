import { Component,ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { DataProvider } from '../../providers/data/data';

/**
 * Generated class for the ModalGraficoEncuestaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-grafico-encuesta',
  templateUrl: 'modal-grafico-encuesta.html',
})
export class ModalGraficoEncuestaPage {
  @ViewChild('doughnutCanvas') doughnutCanvas;

  doughnutChart: any;
  public idEncuesta;
  public CantidadPersonas;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    private dataProvider: DataProvider) {
      this.obtenerCantidadPersonas();
      this.idEncuesta =  this.navParams.get('idEncuesta');

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ModalGraficoEncuestaPage');
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

  CargarGraficoEncuesta(){

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
  }

}
