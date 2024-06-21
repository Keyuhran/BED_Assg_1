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
$(window).on('resize', function() {
    if($(window).width() > 600) {
        $('#body').addClass('limit1200');
        $('#body').removeClass('limit400');
    }
    else {
        $('#body').addClass('limit400');
        $('#body').removeClass('limit1200');
    }
})
