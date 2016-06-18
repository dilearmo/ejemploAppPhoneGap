function BuscarArtista() {
	//javascrpt
	//var txtArtista = document.getElementById("artista");
	//var	nombreArtista = txtArtista.value;

	//JQuery

	$('body').addClass('ui-loading');


	var nombreArtista = $('#artista').val();
	var req = $.ajax({
		url: 'https://api.spotify.com/v1/search?type=artist&q='+nombreArtista,
		timeout: 10000,
		success: function(datos) { procesarArtistas(datos) }
	});
}

function procesarArtistas(datos) {
	$('#listaArtistas').empty();
	//var lista = document.getElementById("listaArtistas");
	$.each(datos.artists.items, function() {
		var nuevoA = document.createElement('a');
		nuevoA.innerHTML = this.name;
		nuevoA.href = "#artista";

		var nuevoLi = document.createElement('li');
		nuevoLi.appendChild(nuevoA);

		nuevoLi.setAttribute("id", this.id);
		nuevoLi.setAttribute("onclick", "CargarInfoArtista(this.id)");
		$('#listaArtistas').append(nuevoLi);
	});

	//ESTO SIRVE PARA DARLE EL CSS A LO QUE SE GENERA***********************

	$('#listaArtistas').listview('refresh');
	//$('ui-page').trigger('create');

	$('body').removeClass('ui-loading');
}

function CargarInfoArtista(id) {
	//var id = getParameterByName('id');

	var req = $.ajax({ 
				url: 'https://api.spotify.com/v1/artists/' + id,
				timeout: 10000,
				success: function(datos) {MostrarDatosArtista(datos);}
				//error: function() {ProcesarError();}
	});

	var reqCanciones = $.ajax({
						url: 'https://api.spotify.com/v1/artists/' + id +'/top-tracks?country=US',
						timeout: 10000,
						success: function (datos2) {Populares(datos2)}
	});
}

function ProcesarError() {
	$('body').removeClass('ui-loading');
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function MostrarDatosArtista(datos) {
	$('#nombreArtista').html("" + datos.name); //Aqui se usa datos porque no es un recorrido, es un solo objeto
	$('#seguidores').html('' + datos.followers.total); // El HTML es para sobreescribir y no append
	var img = document.getElementById("imagen");
	img.src = datos.images[2].url;
}

function Populares(datos) {
	$('#cancionesMasPopulares').empty();

	var liTitulo = document.createElement("li");
	liTitulo.innerHTML = "canciones Populares";
	liTitulo.setAttribute('data-role', "list-divider");
	$('#cancionesMasPopulares').append(liTitulo);

	$.each(datos.tracks, function() {
		var nuevoLi = document.createElement('li');
		var a = document.createElement('a');
		a.innerHTML = this.name; // Se usa this porque estamos recorriendo
		a.href = this.preview_url;
		nuevoLi.appendChild(a);
		$('#cancionesMasPopulares').append(nuevoLi);
	});

	$('#cancionesMasPopulares').listview('refresh');
}