document.addEventListener('DOMContentLoaded', () => {
    let slideIndex = 1;
    showSlides(slideIndex);

    function showSlides(n) {
        let slides = document.querySelectorAll('.carousel-slide img');
        let dots = document.querySelectorAll('.dot');
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
    }

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    setInterval(() => {
        showSlides(slideIndex += 1);
    }, 3000); // Change image every 3 seconds

    // Expose the function to be accessible from the HTML
    window.currentSlide = currentSlide;
});
