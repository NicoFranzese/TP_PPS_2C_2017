import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { NativeAudio } from '@ionic-native/native-audio';
import { DataProvider } from '../data/data';


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

  //Para saber si es la primera vez que entro a la page principal
  public primeraVez: boolean = true;


  constructor(private nativeAudio: NativeAudio,
    private dataProvider: DataProvider) {
    this.instanciarAudios();
    }

  public calcularHorasDuracion(cuestionario, medida) {

    let arrFechaInicio = cuestionario.fechaInicio.split("/");
    let arrHoraInicio = cuestionario.horaInicio.split(":");
    let arrFechaFin = cuestionario.fechaFin.split("/");
    let arrHoraFin = cuestionario.horaFin.split(":");

    let fecha1 = new Date(Number.parseInt(arrFechaInicio[2]), Number.parseInt(arrFechaInicio[1]) - 1, Number.parseInt(arrFechaInicio[0]), Number.parseInt(arrHoraInicio[0]), Number.parseInt(arrHoraInicio[1])).getTime();
    let fecha2 = new Date(Number.parseInt(arrFechaFin[2]), Number.parseInt(arrFechaFin[1]) - 1, Number.parseInt(arrFechaFin[0]), Number.parseInt(arrHoraFin[0]), Number.parseInt(arrHoraFin[1])).getTime();

    let res = fecha2 - fecha1;

    let minutosTotales = res / 1000 / 60;
    let horasTotales = Math.trunc(minutosTotales / 60);
    let minutosRestantes = minutosTotales % 60;

    if (medida == 'hora') {
      if (minutosRestantes != 0)
        return horasTotales + ' horas, ' + minutosRestantes + ' minutos';
      else
        return horasTotales + ' horas';
    }
    else {
      //Retorno milisegundos
      return res;
    }

  }

  public calcularTiempoRestante(cuestionario) {
    let arrFechaInicio = cuestionario.fechaInicio.split("/");
    let arrHoraInicio = cuestionario.horaInicio.split(":");
    let fecha = new Date();
    console.log(fecha.getDate());
    let fecha1 = new Date(Number.parseInt(arrFechaInicio[2]), Number.parseInt(arrFechaInicio[1]) - 1, Number.parseInt(arrFechaInicio[0]), Number.parseInt(arrHoraInicio[0]), Number.parseInt(arrHoraInicio[1])).getTime();
    let fecha2 = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours(), fecha.getMinutes()).getTime();
    // console.log(fecha1);
    // console.log(fecha2);
    let res = fecha2 - fecha1;

    let duracion = this.calcularHorasDuracion(cuestionario, 'mili');

    return res - Number.parseInt(duracion.toString());
  }

  private instanciarAudios() {
    this.nativeAudio.preloadSimple('plop', 'assets/sound/plop.mp3').then(msg => console.log(msg), err => console.error(err));
    this.nativeAudio.preloadSimple('intro', 'assets/sound/intro.mp3').then(msg => console.log(msg), err => console.error(err));
    this.nativeAudio.preloadSimple('beep', 'assets/sound/beep.mp3').then(msg => console.log(msg), err => console.error(err));
  }

  public reproducirSonido(id: string) {
    this.nativeAudio.play(id).then(msg => console.log(msg), err => console.error(err));
  }

  public verificarLimiteAsistencias(id_cursada_alumno, comision) {
    console.log(comision);
    const limite = 3;

    this.dataProvider.getItems('asistencias').subscribe(
      tbAsistencias => {
        this.dataProvider.getItems('cursadas_alumnos').subscribe(
          tbCursadas_alumnos => {
            let arrInasAlumno = tbAsistencias.filter((item) => item.id_cursada_alumno == id_cursada_alumno);
            let cont = 0;
            console.log(arrInasAlumno);
            arrInasAlumno.forEach(elementInasAlumno => {
              if (elementInasAlumno.inasistencia == 1 || elementInasAlumno.inasistencia == 0.5) {
                cont += Number.parseInt(elementInasAlumno.inasistencia);

                if (cont == 3) {
                  console.log("3 faltas");
                  tbCursadas_alumnos.forEach(elementCursada => {
                    if (elementCursada.id_cursada_alumno == elementInasAlumno.id_cursada_alumno) {
                      console.log("Dentro de if");
                      //Busco el id del curso de la comision que recibo
                      this.dataProvider.getItems('cursos').subscribe(
                        tbCursos => {
                          console.log(tbCursos);
                          let arrComision = comision.split('-');
                          console.log(arrComision)
                          tbCursos.forEach(elementCursos => {
                            if (elementCursos.comision == arrComision[0] && elementCursos.sigla_materia == arrComision[1]) {
                              //Levanto los administrativos
                              this.dataProvider.getItems('entidades_persona').subscribe(
                                tbEntidades => {
                                  tbEntidades.forEach((elementEntidades) => {
                                    if (elementEntidades.tipo_entidad == 'administrativo') {
                                      //Guardo la notificacion para todos los administrativos
                                      this.dataProvider.addItem('aviso_faltas/' + elementEntidades.legajo + '/', {
                                        'mensaje': 'El alumno: ' + elementCursada.legajo_alumno + ' posee 3 inasistencias',
                                        'legajo': elementEntidades.legajo
                                      });
                                    }
                                  });
                                }
                              );

                              //Guardo la notificacion
                              // console.log('addItem');
                              this.dataProvider.addItem('aviso_faltas/' + elementCursada.legajo_alumno + '/', {
                                'mensaje': 'Usted ya posee 3 inasistencias',
                                'legajo': elementCursada.legajo_alumno
                              });

                              this.dataProvider.addItem('aviso_faltas/' + elementCursos.legajo_docente + '/', {
                                'mensaje': 'El alumno: ' + elementCursada.legajo_alumno + ' posee 3 inasistencias',
                                'legajo': elementCursos.legajo_docente
                              });
                            }
                          });
                        }
                      )


                    }
                  });
                }
              }
            });

          }
        )



      }
    )


  }


}


