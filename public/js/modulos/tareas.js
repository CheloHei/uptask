import axios from "axios";
import Swal from "sweetalert2"
const tareas = document.querySelector('.listado-pendientes');
import avance, { actualizarAvance } from '../funciones/avance';

if (tareas) {

    tareas.addEventListener('click', e => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            //console.log(idTarea);

            //request hacia router de tareas
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then((respuesta) => {
                    //console.log(respuesta);
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })

        }

        if (e.target.classList.contains('fa-trash')) {

            const tareaHtml = e.target.parentElement.parentElement,
                idTarea = tareaHtml.dataset.tarea;

            Swal.fire({
                title: 'Deseas eliminar esta Tarea',
                text: 'Una tarea eliminada no se puede recuperar',
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar',
                cancelButtonText: 'Cancelar'
            })
                .then((result) => {
                    if (result.value) {

                        const url = `${location.origin}/tareas/${idTarea}`;
                        axios.delete(url,{params: idTarea})
                        .then((respuesta)=>{
                            if (respuesta.status === 200) {
                                //Eliminar el nodo
                                tareaHtml.parentElement.removeChild(tareaHtml);
                                //opcional alerta
                                Swal.fire(
                                    'Eliminado',
                                    respuesta.data,
                                    'success'

                                )
                                actualizarAvance();
                            }
                        })
                    }
                })
        }
    })

}

export default tareas;