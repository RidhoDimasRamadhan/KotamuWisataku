let navbar = document.querySelector('.header .navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.add('active');
}

document.querySelector('#nav-close').onclick = () =>{
    navbar.classList.remove('active');
}

let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.add('active');
}

document.querySelector('#close-search').onclick = () =>{
    searchForm.classList.remove('active');
}

window.onscroll = () =>{
    navbar.classList.remove('active');

    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};

window.onload = () =>{
    if(window.scrollY > 0){
        document.querySelector('.header').classList.add('active');
    }else{
        document.querySelector('.header').classList.remove('active');
    }
};


var swiper = new Swiper(".home-slider", {
    loop:true, 
    grabCursor:true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
});


// Load More Rekomendasi
let loadMoreBtn = document.querySelector('#load-more');
let currentItem = 5;

loadMoreBtn.onclick = () =>{
   let boxes = [...document.querySelectorAll('.main .gambarRekomendasi .gambar')];
   for (var i = currentItem; i < currentItem + 5; i++){
      boxes[i].style.display = 'inline-block';
   }
   currentItem += 5;

   if(currentItem >= boxes.length){
      loadMoreBtn.style.display = 'none';
   }
}
// end


// lOad More Artikel
let loadMoreBtn2 = document.querySelector('#load-more2');
let currentItem2 = 5;

loadMoreBtn2.onclick = () =>{
   let boxes2 = [...document.querySelectorAll('.main2 .gambarartikel2 .gambarmain2')];
   for (var x = currentItem2; x < currentItem2 + 5; x++){
      boxes2[x].style.display = 'inline-block';
   }
   currentItem2 += 5;

   if(currentItem2 >= boxes2.length){
      loadMoreBtn.style.display = 'none';
   }
}
// end

//dark-light mode
const body = document.querySelector('body');
const toggle = document.getElementById('darkmode');

toggle.addEventListener('click', function(){
    this.classList.toggle('bi-moon-fill');
    if(this.classList.toggle('bi-sun')){
        body.style.background = '#002132'
        body.style.color = 'white';
        body.style.transition = '.2s';
        document.getElementById("white").style.color = 'white';
        document.getElementById("white2").style.color = 'white';
        document.getElementById("rekomen").style.color = 'white';
        document.getElementById("mandalika").style.color = 'white';
        document.getElementById("komodo").style.color = 'white';
        document.getElementById("karampuang").style.color = 'white';
        document.getElementById("raja").style.color = 'white';
        document.getElementById("berita").style.color = 'white';
        document.getElementById("monas").style.color = 'white';
    }else{
        body.style.background = 'white'
        body.style.color = "black"
        body.style.transition = '.2s';
        document.getElementById("white").style.color = 'black';
        document.getElementById("white2").style.color = 'black';
        document.getElementById("rekomen").style.color = 'black';
        document.getElementById("mandalika").style.color = 'black';
        document.getElementById("komodo").style.color = 'black';
        document.getElementById("karampuang").style.color = 'black';
        document.getElementById("raja").style.color = 'black';
        document.getElementById("berita").style.color = 'black';
        document.getElementById("monas").style.color = 'black';
    }
})
//end



	const map2 = L.map('map').setView([-6.17531772509442, 106.82710988408309], 14);
	const tiles2 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map2);

	const marker2 = L.marker([-6.17531772509442, 106.82710988408309]).addTo(map2)
		.bindPopup('<b>Monas</b>').openPopup();


	const popup2 = L.popup();

	function onMapClick(e) {
		popup2
			.setLatLng(e.latlng)
			.setContent(`You clicked the map at ${e.latlng.toString()}`)
			.openOn(map2);
	}

    map.on('click', onMapClick);
    
    
 
    
    // map.on('click', onMapClick);
    // const map2 = L.map('map2').setView([-6.17531772509442, 106.82710988408309], 14);
	// const tile2 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	maxZoom: 19,
	// 	attribution2: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	// }).addTo(map2);

	// const marker2 = L.marker([-6.17531772509442, 106.82710988408309]).addTo(map2)
	// 	.bindPopup('<b>Monas</b>').openPopup();


	// const popup2 = L.popup();

	// function onMapClick(e) {
	// 	popup2
	// 		.setLatLng(e.latlng)
	// 		.setContent(`You clicked the map at ${e.latlng.toString()}`)
	// 		.openOn(map2);
	// }

    // map2.on('click', onMapClick);
    





    // for email in subscribe
    function sendEmail() {
        let nama = document.getElementById("namaa").value;
    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "ridhoodimass22@gmail.com",
        Password : "D6909DAB304E11DE4884EFC18EDD1136840D",
        To : nama,
        From : "ridhoodimass22@gmail.com",
        Subject : "Berita terbaru Tempat Wisata Favorit kalian !!",
        Body : "<h3>Bosen dirumah? temukan destinasi meraik diwebsite kami dengan pilihan terbaik yang telah kami berikan kepada anda</h3>" 
    }).then(
      message => alert(message)
    );
    }


    $(function(){
        $('.selectpicker').selectpicker();
    });

 