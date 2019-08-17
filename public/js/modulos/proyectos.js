import Swal from "sweetalert2";
import Axios from "axios";

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        //e.target se utiliza para tomar valor de un elemento html
        //dataset toma el atributo personalizdo
        const urlProyecto = e.target.dataset.proyectUrl;

        Swal.fire({
            title: 'Deseas eliminar el proyecto',
            text: 'Un proyecto eliminado no se puede recuperar',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, borrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                console.log(result);
                //enviar peticion con axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                Axios.delete(url, { params: { urlProyecto } })
                    .then((resp) => {
                        console.log(resp);
                        Swal.fire(
                            'Eliminado',
                            resp.data,
                            'success'
                        );

                        //redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch(()=>{
                        Swal.fire({
                            type:'error',
                            title:'Hubo un error',
                            text:'No se pudo eliminar un proyecto'
                        })
                    })
            }
        })
    })
}

export default btnEliminar;