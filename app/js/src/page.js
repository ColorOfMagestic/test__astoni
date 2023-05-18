const html = document.querySelector('.page'),
 body = document.querySelector('.page-body'),
 header = document.querySelector('.header'),
 info = document.querySelector('.info'),
 modal = document.querySelector('.modal'),
 modalOverlay = document.querySelector('.modal__overlay');

const formBtn = document.querySelector('.contact_us-form__btn'),
toggler = document.querySelector('.btn-toggle'),
closePopup = document.querySelector('.modal__close');

const toggleMenu = () => {
  body.classList.toggle('body_hidden');
  info.classList.toggle('info--show');
  toggler.classList.toggle('btn-toggle--active');
}

const addingPaddingRight = (el) => {
  el.style.paddingRight = `17px`;
}
const deletedPaddingRight = (el) => {
  el.style.paddingRight = `0`;
}

const showPopup = (e) => {
  e.preventDefault();

  body.classList.add('body_hidden');
  modal.classList.add('modal--active');
  addingPaddingRight(html);
  addingPaddingRight(header);
}

const removePopup = () => {
  body.classList.remove('body_hidden');
  modal.classList.remove('modal--active');
  deletedPaddingRight(html);
  deletedPaddingRight(header);
}


document.addEventListener('click',function(e) {
  if(e.target.className === 'modal__overlay') {
    removePopup();
  }
});

toggler.addEventListener('click', toggleMenu);
formBtn.addEventListener('click', showPopup);
closePopup.addEventListener('click', removePopup);
