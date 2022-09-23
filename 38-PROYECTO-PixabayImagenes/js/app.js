// Selectores
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');


const registrosPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;


window.onload = ()=>{
    formulario.addEventListener('submit', buscarImagen);
}


function buscarImagen(e){
e.preventDefault();

    const busquedaInput = document.querySelector('#termino').value;

    if(busquedaInput === ''){
        imprimirAlerta('Introduce los términos correctos');
        return;
    }


    consultarAPI();
};

function consultarAPI(){
    const termino = document.querySelector('#termino').value;

    const key = '30128790-ef4430ab0c43dfc2ac106a2b1';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

    fetch(url)
    .then(respuesta => respuesta.json())
    
    .then(resultado => {
        
        totalPaginas = calcularPaginas(resultado.totalHits)
        console.log(totalPaginas)
        mostrarImagenes(resultado.hits)
     });

}

// Creación de generador para el paginado
function * crearPaginador(total){
    // console.log(total);
    for (let i = 1; i <= total; i++){
        yield i;
    }
}

function calcularPaginas(total){
    return parseInt(Math.ceil(total / registrosPorPagina));
}


function mostrarImagenes(imagenes){

    console.log(imagenes);
    // Metodo para eliminar el html previo
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }

    // Iterar sobre el arreglo de imagenes y construir HTML
    imagenes.forEach(imagen => {
        const { webformatURL,likes, views,largeImageURL } = imagen;

        resultado.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <img class="w-full" src="${webformatURL}">

                <div class="p-4">
                    <p class="font-bold"> ${likes} <span class="font-light"> Me gusta </span> </p>
                    
                    <p class="font-bold"> ${views} <span class="font-light"> Vistas </span> </p>
                    
                    <a 
                        class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                        href ="${largeImageURL}" target="_blank" rel="noopener noreferrer"
                    >
                        Ver imagen
                    </a>
                </div> 
            </div>
        </div>    
        `;
    })

    // Limpiar generador previo
    limpiarHTMLPaginador();
    // Generamos eñ HTML
     imprimirPaginador();
    
}

function imprimirPaginador(){
    iterador = crearPaginador(totalPaginas);

    while(true){
        const {value, done} = iterador.next();
        if(done) return;
            
        // Caso contrario
        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-5', 'rounded');
        // Acción para que el botón responda a la página donde se le da click
        boton.onclick = () =>{
           
            paginaActual = value;
           
            consultarAPI();
        }
        
        paginacionDiv.appendChild(boton);
    }
}

// Limpiar html del paginador
function limpiarHTMLPaginador(){
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }
}

function imprimirAlerta(mensaje){
    
    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta){
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3','rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML= `
        <strong class="font-bold">Error!</strong>
        <span class="block" sm:inline">${mensaje}</span>
        `;

        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 5000);
    }     
        
}