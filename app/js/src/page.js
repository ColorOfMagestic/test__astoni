const info = document.querySelector('.info'),
toggler = document.querySelector('.btn-toggle');

const toggleMenu = () => {
  info.classList.toggle('info--show');
  toggler.classList.toggle('btn-toggle--active');
}
toggler.addEventListener('click', toggleMenu);
