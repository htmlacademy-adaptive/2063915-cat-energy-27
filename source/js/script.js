let navPage = document.querySelector('.page-nav');
let navToggle = document.querySelector('.page-nav__toggle');

navPage.classList.remove('page-nav--nojs');

navToggle.addEventListener('click', function () {
  if (navPage.classList.contains('page-nav--closed')) {
    navPage.classList.remove('page-nav--closed');
    navPage.classList.add('page-nav--opened');
  } else {
    navPage.classList.add('page-nav--closed');
    navPage.classList.remove('page-nav--opened');
  }
});