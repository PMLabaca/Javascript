const boton_modoOscuro = document.getElementById('darkmode');
boton_modoOscuro.addEventListener('click', function(){
    document.body.classList.toggle('dark');
});