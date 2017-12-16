import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { NativeAudio } from '@ionic-native/native-audio';


  //Este servicio se usa para comunicar datos entre componentes
  //Tambièn poveè de algunas funcionalidades


@Injectable()
export class AlmacenDatosProvider {

  public usuarioLogueado;
  
  public arrMenuOpciones = new BehaviorSubject([]);
  public arrMenuOpciones$ = this.arrMenuOpciones.asObservable();

  //Utilizado en el modal de Cuestionarios.
  //Para saber si es alta o modificación.
  public operacionCuestionario: string;
  public ultimoIdCuestionario: number;
  public cuestionarioEditar;

  //Para saber si es la primera vez que se abre la app, le asigno tiempo o no al sonido
  public primeraVezApp: boolean = true;

  p

  constructor(private nativeAudio: NativeAudio) {
    this.instanciarAudios();
  }

  public calcularHorasDuracion(cuestionario, medida)
  {

    let arrFechaInicio = cuestionario.fechaInicio.split("/");
    let arrHoraInicio = cuestionario.horaInicio.split(":");
    let arrFechaFin = cuestionario.fechaFin.split("/");
    let arrHoraFin = cuestionario.horaFin.split(":");

    let fecha1 = new Date(Number.parseInt(arrFechaInicio[2]), Number.parseInt(arrFechaInicio[1]) -1, Number.parseInt(arrFechaInicio[0]), Number.parseInt(arrHoraInicio[0]), Number.parseInt(arrHoraInicio[1])).getTime();
    let fecha2 = new Date(Number.parseInt(arrFechaFin[2]), Number.parseInt(arrFechaFin[1]) -1, Number.parseInt(arrFechaFin[0]), Number.parseInt(arrHoraFin[0]), Number.parseInt(arrHoraFin[1])).getTime();

    let res = fecha2 - fecha1;

    let minutosTotales = res /1000 /60;
    let horasTotales = Math.trunc(minutosTotales / 60);
    let minutosRestantes = minutosTotales % 60;

    // console.log(fecha1);
    // console.log(fecha2);

    if(medida == 'hora')
    {
      if(minutosRestantes != 0)
        return horasTotales +' horas, '+ minutosRestantes +' minutos';
      else
        return horasTotales +' horas';
    }
    else
    {
      //Retorno milisegundos
      return res;
    }

  }

  public calcularTiempoRestante(cuestionario)
  {
    let arrFechaInicio = cuestionario.fechaInicio.split("/");
    let arrHoraInicio = cuestionario.horaInicio.split(":");
    let fecha = new Date();
    console.log(fecha.getDate());
    let fecha1 = new Date(Number.parseInt(arrFechaInicio[2]), Number.parseInt(arrFechaInicio[1]) -1, Number.parseInt(arrFechaInicio[0]), Number.parseInt(arrHoraInicio[0]), Number.parseInt(arrHoraInicio[1])).getTime();
    let fecha2 = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours(),fecha.getMinutes()).getTime();
    // console.log(fecha1);
    // console.log(fecha2);
    let res = fecha2 - fecha1;

    let duracion = this.calcularHorasDuracion(cuestionario, 'mili');

    return res - Number.parseInt(duracion.toString());
  }

  private instanciarAudios()
  {
    this.nativeAudio.preloadSimple('plop', 'assets/sound/plop.mp3').then(msg => console.log(msg), err => console.error(err));
    this.nativeAudio.preloadSimple('intro', 'assets/sound/intro.mp3').then(msg => console.log(msg), err => console.error(err));
    this.nativeAudio.preloadSimple('beep', 'assets/sound/beep.mp3').then(msg => console.log(msg), err => console.error(err));
  }

  public reproducirSonido(id: string)
  {
    this.nativeAudio.play(id).then(msg => console.log(msg), err => console.error(err));
  }


}
