document.addEventListener('DOMContentLoaded', () => {
    const dots = document.querySelectorAll('.dot');
    const advert = document.querySelector('.advert');

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            advert.textContent = `Advert/Display ${index + 1}`;
            dots.forEach(d => d.style.backgroundColor = '#bbb');
            dot.style.backgroundColor = '#333';
        });
    });
});
