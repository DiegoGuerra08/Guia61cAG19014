/* Diego José Ayala Guerra AG19014 Grupo #5*/
var fila =
	"<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td><td class='boton'></td></tr>";
var productos = null;
function codigoCat(catstr) {
	var code = "null";
	switch (catstr) {
		case "electronicos":
			code = "c1";
			break;
		case "joyeria":
			code = "c2";
			break;
		case "caballeros":
			code = "c3";
			break;
		case "damas":
			code = "c4";
			break;
	}
	return code;
}
var orden = 0;

function listarProductos(productos) {
	var precio = document.getElementById("price");
	precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
	var num = productos.length;
	var listado = document.getElementById("listado");
	var nuevo = document.getElementById("nuevo");
	var ids, titles, prices, descriptions, categories, fotos;
	var tbody = document.getElementById("tbody"),
		nfila = 0;
	tbody.innerHTML = "";
	var catcode;
	for (i = 0; i < num; i++) tbody.innerHTML += fila;
	var tr;
	ids = document.getElementsByClassName("id");
	titles = document.getElementsByClassName("title");
	descriptions = document.getElementsByClassName("description");
	categories = document.getElementsByClassName("category");
	fotos = document.getElementsByClassName("foto");
	prices = document.getElementsByClassName("price");
	borrar = document.getElementsByClassName("boton");
	if (orden === 0) {
		orden = -1;
		precio.innerHTML = "Precio";
	} else if (orden == 1) {
		ordenarAsc(productos, "price");
		precio.innerHTML = "Precio A";
		precio.style.color = "darkgreen";
	} else if (orden == -1) {
		ordenarDesc(productos, "price");
		precio.innerHTML = "Precio D";
		precio.style.color = "blue";
	}
	nuevo.style.display = "block";
	listado.style.display = "block";

	for (nfila = 0; nfila < num; nfila++) {
		ids[nfila].innerHTML = productos[nfila].id;
		titles[nfila].innerHTML = productos[nfila].title;
		descriptions[nfila].innerHTML = productos[nfila].description;
		categories[nfila].innerHTML = productos[nfila].category;
		catcode = codigoCat(productos[nfila].category);
		tr = categories[nfila].parentElement;
		tr.setAttribute("class", catcode);
		prices[nfila].innerHTML = "$" + productos[nfila].price;
		fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
		fotos[nfila].firstChild.setAttribute(
			"onclick",
			"window.open('" + productos[nfila].image + "');"
		);
		borrar[nfila].innerHTML = "<button>Eliminar</button>";
		borrar[nfila].firstChild.setAttribute(
			"onclick",
			"eliminarP('" + productos[nfila].id + "');"
		);
	}
}

function obtenerProductos() {
	fetch("https://retoolapi.dev/w8sJCK/productos")
		.then((res) => res.json())
		.then((data) => {
			productos = data;
			productos.forEach(function (producto) {
				producto.price = parseFloat(producto.price);
			});
			listarProductos(data);
		});
}

function agregar() {
	var titulo = document.getElementById("titulo").value;
	var precio = document.getElementById("precio").value;
	var descripcion = document.getElementById("descripción").value;
	var imagen = document.getElementById("image").value;
	var categoria = document.getElementById("categoria").value;

	var valoraceptado = /^[0-9]+$/;
	var nvacio="";
	if(titulo.match(nvacio)||precio.match(nvacio)||descripcion.match(nvacio)||imagen.match(nvacio)){
		alert("Debe ingresar datos");
	}else if(!precio.match(valoraceptado)){
		alert("Debe ingresar precio en formato de numero");
	} else {	
	var add = {
		image: imagen,
		price: precio,
		title: titulo,
		category: categoria,
		description: descripcion
	};

	fetch("https://retoolapi.dev/w8sJCK/productos", {
		method: "POST",
		body: JSON.stringify(add),
		headers: {
			Accept: "application/json",
			"Content-type": "application/json; charset=UTF-8",
		},
	})
		.then((response) => response.json())
		.then((data) => (productos = data));

	obtenerProductos();
	alert("Has agregado un producto");
}}

var id;
function eliminarP(id) {
	fetch("https://retoolapi.dev/w8sJCK/productos/"+id, { method: "DELETE" }).then(response => response.json()).then(data => productos = data);
			obtenerProductos();
			alert("Se ha eliminado el producto N° " + id);
}

function ordenarDesc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return -1;
		if (a[p_key] < b[p_key]) return 1;
		return 0;
	});
}

function ordenarAsc(p_array_json, p_key) {
	p_array_json.sort(function (a, b) {
		if (a[p_key] > b[p_key]) return 1;
		if (a[p_key] < b[p_key]) return -1;
		return 0;
	});
}

