const navbarDesplegable = document.getElementsByClassName("navbarDesplegable")[0];
const navbarLinks = document.getElementsByClassName("navbarLinks")[0];

navbarDesplegable.addEventListener("click", () => {
    navbarLinks.classList.toggle("active");
});

let productos = [];
fetch("../Json/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
        productosIndex(productos);
    })

let carrito = [];

const contenedor = document.querySelector("#contenedor");
const carritoContenedor = document.querySelector("#carritoContenedor");
const vaciarCarrito = document.querySelector("#vaciarCarrito");
const precioTotal = document.querySelector("#precioTotal");
const activarFuncion = document.querySelector("#activarFuncion");
const procesarCompra = document.querySelector("#procesarCompra");
const totalProceso = document.querySelector("#totalProceso")
const formulario = document.querySelector("#procesar-pago")
const contenedorIndex = document.querySelector("#contenedor-index")

if (activarFuncion){
    activarFuncion.addEventListener("click", procesarPedido);
}

document.addEventListener("DOMContentLoaded", () => {
    carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    mostrarCarrito();
    document.querySelector("#activarFuncion").click(procesarPedido);
});

if(formulario){
    formulario.addEventListener('submit', enviarCompra)
}

if (vaciarCarrito){
    vaciarCarrito.addEventListener("click", () => {
        carrito.length = [];
        mostrarCarrito();
        Toastify({
            text: "Carrito vaciado",
            duration: 3000,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", 
            position: "left", 
            stopOnFocus: true,
            style: {
              background: "linear-gradient(to right, #E38822, #E34422)",
              borderRadius: "10px",
              textTransform: "uppercase",
            },
            onClick: function(){}
        }).showToast();
    });
}

if (procesarCompra) {
    procesarCompra.addEventListener("click", () => {
        if (carrito.length === 0) {
            Swal.fire({
                title: "Tu carrito no tiene nada",
                text: "Compra algo de la tienda",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }else {
            location.href = "../Paginas/carrito.html";
        }
    });
}

function cargarProductos(productos){
    productos.forEach((prod) => {
      const { id, nombre, precio, desc, img, stock } = prod;
      if (contenedor){
        contenedor.innerHTML += `
        <div class="card mt-3" style="width: 30rem;">
        <img class="card-img-top mt-2" src="${img}" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">${nombre}</h5>
          <p class="card-text-precio">$ ${precio}</p>
          <p class="card-text-descripcion"> ${desc}</p>
          <p class="card-text-cantidad">Cantidad: ${stock}</p>
          <button class="btn btn-dark" onclick="agregarProducto(${id})">Agregar al Carrito</button>
        </div>
      </div>
        `
      }
    });
};

function productosIndex(productos){
    productos.forEach((prod) => {
        const { id, nombre, precio, img } = prod;
        if(prod.oferta === true){
            if(contenedorIndex){
                contenedorIndex.innerHTML += `
                <div class="card mt-3" id="estructura-cards-index" style="width: 25rem;">
                <img class="card-img-top mt-2" src="${img}" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">${nombre}</h5>
                  <p class="card-text-precio">$ ${precio}</p>
                  <button class="btn btn-dark" onclick="agregarProducto(${id})">Agregar al Carrito</button>
                </div>
              </div>
                `;
            }
        }
    })
};

const agregarProducto = (id) => {
    Toastify({
        text: "Agregado al carrito",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "left", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
          borderRadius: "10px",
          textTransform: "uppercase",
    },
    onclick: function(){}
    }).showToast();
    const existe = carrito.some(prod => prod.id === id)

    if (existe){
    const prod = carrito.map(prod => {
        if(prod.id === id){
            prod.stock++
        }
    })
    }else{
    const item = productos.find((prod) => prod.id === id)
    carrito.push(item)
    }
    mostrarCarrito()
};

const mostrarCarrito = () => {
    const modalBody = document.querySelector(".modal .modal-body")
    if (modalBody){
        modalBody.innerHTML = "";
        carrito.forEach((prod) => {
            const { id, nombre, precio, img, stock } = prod;
            modalBody.innerHTML += `
            <div class="modal-contenedor">
              <div>
                <img class="img-fluid img-carrito" src="${img}"/>
              </div>
              <div>
                <p class="nombre-producto-modal">Producto: ${nombre}</p>
                <p class="precio-producto-modal">Precio: $${precio}</p>
                <p class="cantidad-producto-modal">Cantidad : ${stock}</p>
                <button class="btn btn-danger"  onclick="eliminarProducto(${id})">Eliminar producto</button>
              </div>
            </div>
            `;
        });
    }
    if(carrito.length === 0){
        modalBody.innerHTML = `
        <p class="text-center text-primary parrafo">No hay nada por aca...</p>
        `;
    }
    carritoContenedor.textContent = carrito.length;

    if(precioTotal){
        precioTotal.innerText = carrito.reduce(
            (acc, prod) => acc + prod.stock * prod.precio,
            0
        );
    }
    guardarStorage();
};

function guardarStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito))
}

function eliminarProducto(id){
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", 
        position: "left", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #E38822, #E34422)",
          borderRadius: "10px",
          textTransform: "uppercase",
    },
    onClick: function(){}
    }).showToast();
    const productoId = id;
    carrito = carrito.filter((prod) => prod.id !== productoId);
    mostrarCarrito();
}

function procesarPedido(){
    carrito.forEach((prod) => {
        const listaCompra = document.querySelector("#lista-compra tbody");
        const { nombre, precio, img, stock } = prod;
        if(listaCompra){
            const row = document.createElement("tr");
            row.innerHTML += `
            <td>
            <img class="img-fluid img-carrito" src="${img}"/>
            </td>
            <td>${nombre}</td>
          <td>${precio}</td>
          <td>${stock}</td>
          <td>${precio * stock}</td>
          `;
          listaCompra.appendChild(row);
        } 
    });
    totalProceso.innerText = carrito.reduce(
        (acc, prod) => acc + prod.stock * prod.precio,
        0
    );
}

function limpiarCarrito(){
    carrito.length = [];
    localStorage.clear();
}

function enviarCompra(e) {
    e.preventDeFault();
    const cliente = document.querySelector("#cliente").value;
    const email = document.querySelector("#correo").value;

    if (email === "" || cliente === ""){
        Swal.fire({
            title: "Necesitamos un nombre y un mail para la compra",
            text: "Primero rellena el formulario",
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    } else{
        const spinner = document.querySelector("#spinner");
        spinner.classList.add("d-flex");
        spinner.classList.remove("d-none");

        setTimeout(() => {
            spinner.classList.remove("d-flex");
            spinner.classList.add("d-none");
            formulario.reset();
            limpiarCarrito();
            procesarPedido();
        }, 3000)

        setTimeout(() => {
            Swal.fire({
                title: 'Compra Exitosa',
                text: 'Su compra se ha realizado correctamente. Volviendo al menu principal.',
                imageUrl: 'https://media1.giphy.com/media/GeimqsH0TLDt4tScGw/giphy.gif?cid=790b76118ee31a4fe1c5a3fcff04e15bf4389bcdb38f8ed4&rid=giphy.gif&ct=g',
                imageWidth: 400,
                imageHeight: 200,
                imageAlt: 'Custom image',
            })
        }, 3000);

        setTimeout(() => {
            window.location.reload()
            location.href = "../index.html";
        }, 5000);
    };
} 