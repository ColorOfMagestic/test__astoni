
const swiper = new Swiper('.intro-swiper', {
    loop: true,
    spaceBetween: 10,
    speed: 1000,
    autoplay: {
      delay: 5000,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: `[data-role="next"]`,
        prevEl: `[data-role="prev"]`,
    },
});
