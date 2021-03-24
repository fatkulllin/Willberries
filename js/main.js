const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const openModal = function(){
	modalCart.classList.add('show')
};

const closeModal = function(){
	modalCart.classList.remove('show')
};

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

//scroll smooth

(function(){
const scrollLinks = document.querySelectorAll('a.scroll-link')

for(const scrollLink of scrollLinks){
	scrollLink.addEventListener('click', function(event){
		event.preventDefault()
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth', //указываем какая будет прокрутка ( smooth - плавная)
			block: 'start' // до куда прокручиваем
		})
	})
}
})()

modalCart.addEventListener('click', function(event){
	if(event.target.classList != 'modal' ){
		this.classList.remove('show')
	}
})

//goods

const more = document.querySelector('.more')
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

//получение данных c БД
const getGoods = async function(){
	const result = await fetch('db/db.json');
	if(!result.ok){
		throw 'Ошибка: ' + result.status
	}
	return await result.json()
};

const createCard = function ({label,img, name, description, id, price}){
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6'


	card.innerHTML = `
	<div class="goods-card">
		${label ? `<span class="label">${label}</span>` : ''}
		
		
		<img src="db/${img}" alt="${name}" class="goods-image">
		<h3 class="goods-title">${name}</h3>
		
		<p class="goods-description">${description}</p>
		

		<button class="button goods-card-btn add-to-cart" data-id="${id}">
			<span class="button-price">$${price}</span>
		</button>
	</div>
	`;
	return card;
}

const renderCards = function(data){
	longGoodsList.textContent = '';
	const cards = data.map(createCard)
	longGoodsList.append(...cards)
	document.body.classList.add('show-goods')
};

more.addEventListener('click', function(event){
	event.preventDefault();

	const id = this.getAttribute('href');
	document.querySelector(id).scrollIntoView({
		behavior: 'smooth', //указываем какая будет прокрутка ( smooth - плавная)
		block: 'start' // до куда прокручиваем
	})

	getGoods().then(renderCards);
});


const filterCards = function(field, value){
	getGoods()
		.then(function(data){
			const filteredGoods = data.filter(function(good){
				return good[field] === value
			});
			return filteredGoods;
		})
		.then(renderCards);
};

// filterCards('gender', 'Womens')

navigationLink.forEach(function(link){
	link.addEventListener('click', function(event){
		event.preventDefault();
		if(link.dataset.field != undefined){
			const field = link.dataset.field;
			const value = link.textContent;
			filterCards(field, value);
		}else{
			getGoods().then(renderCards);
		}
	})
});

const buttons = document.querySelectorAll('.button')
for(let elem of buttons){
	if(elem.dataset.cat != undefined){
		elem.addEventListener('click',function(){

	getGoods()
		.then(function(data){
			const filteredGoods = data.filter(function(good){
				return good['category'] === elem.dataset.cat
			});
			return filteredGoods;
		})
		.then(renderCards);
	});
	
	}
}