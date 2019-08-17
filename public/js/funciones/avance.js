import Swal from "sweetalert2"

export const actualizarAvance = () => {
    //seleccionar tareas existentes
    const tareas = document.querySelectorAll('li.tarea');
    if (tareas.length) {
        //seleccionar completadas
            const completas = document.querySelectorAll('i.completo');
        //calcular porcentaje
            const avance = Math.round((completas.length / tareas.length)*100);
        //mostrar avance
            const porcentaje = document.querySelector('#porcentaje');
            porcentaje.style.width = avance + '%';

            if (
                avance === 100
            ) {
                Swal.fire(
                    'Proyecto Finalizado',
                    'Felicidades, lo lograste',
                    'success'

                )
            }
    }
}