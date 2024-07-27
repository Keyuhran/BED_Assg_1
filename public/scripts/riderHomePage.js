document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function moveSlide(direction) {
        items[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + direction + items.length) % items.length;
        items[currentIndex].classList.add('active');
        const translateX = -100 * currentIndex;
        carouselInner.style.transform = `translateX(${translateX}%)`;
    }

    function autoSlide() {
        moveSlide(1);
    }

    setInterval(autoSlide, 4000);

    document.querySelector('.carousel-control.left').addEventListener('click', () => {
        moveSlide(-1);
    });

    document.querySelector('.carousel-control.right').addEventListener('click', () => {
        moveSlide(1);
    });
});
