import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'


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

  constructor() {
    
  }

  public calcularHorasRestantes(cuestionario)
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

    console.log(fecha1);
    console.log(fecha2);

    if(minutosRestantes <= 0 || horasTotales <= 0)
      return "Finalizada";
    else 
      return horasTotales +' horas, '+ minutosRestantes +' minutos';

  }

}
