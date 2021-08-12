const cards = document.getElementById('cards');
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.querySelector('#template-card').content;
const templateFooter = document.querySelector('#template-footer').content;
const templateCarrito = document.querySelector('#template-carrito').content;
const fragment = document.createDocumentFragment();
let carrito =  {};

document.addEventListener('DOMContentLoaded', ()=>{
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})

cards.addEventListener('click', (e)=> {
    addCarrito(e)
})

items.addEventListener('click', e =>{
    btnAccion(e)
})

const fetchData = async() =>{
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        /* console.log(data); */
        pintarCartds(data);
    } catch (error) {
        console.log(error);
    }
}

const pintarCartds = data =>{
    data.forEach(element => {
        templateCard.querySelector('img').setAttribute("src", element.thumbnailUrl);
        templateCard.querySelector('h5').textContent = element.title;
        templateCard.querySelector('p').textContent = element.precio;
        templateCard.querySelector('.btn').dataset.id = element.id 
        const clone = templateCard.cloneNode(true);
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment);
}

const addCarrito = e =>{
    /* console.log(e.target); */
    //console.log(e.target.classList.contains('btn-dark'));
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation();
}

const setCarrito = objeto =>{
    //console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    /* console.log(carrito) */
    pintarCarrito()
}

const pintarCarrito = () => {
    
    /* console.log(carrito); */
    items.innerHTML = ""
    Object.values(carrito).forEach(element => {
        templateCarrito.querySelector('th').textContent = element.id;
        templateCarrito.querySelectorAll('td')[0].textContent = element.title;
        templateCarrito.querySelectorAll('td')[1].textContent = element.cantidad;
        templateCarrito.querySelector('.btn-info').dataset.id = element.id;
        templateCarrito.querySelector('.btn-danger').dataset.id = element.id;
        templateCarrito.querySelector('span').textContent = element.cantidad * element.precio;
        const clone = templateCarrito.cloneNode(true);
        fragment.appendChild(clone)
    });
    items.appendChild(fragment)
    
    pintarFooter()
}

const pintarFooter = ()=>{
    footer.innerHTML = ""
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
         `
         return
    }

    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad;
    templateFooter.querySelector('span').textContent = nPrecio;
    
    const clone = templateFooter.cloneNode(true);
    fragment.appendChild(clone);
    footer.appendChild(fragment)

    const btnvaciar = document.getElementById('vaciar-carrito')
    btnvaciar.addEventListener('click', ()=>{
        carrito = {}
        pintarCarrito()

        localStorage.setItem('carrito', JSON.stringify(carrito))
    })
}

const btnAccion = e =>{
    if(e.target.classList.contains('btn-info')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad ++;
        carrito[e.target.dataset.id] = {...producto };
        pintarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id];
        producto.cantidad --;
        if (producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    e.stopPropagation()
}