document.addEventListener('DOMContentLoaded', () => {
    const carouselInner = document.querySelector('.carousel-inner');
    const riderId = localStorage.getItem("riderId");
    localStorage.setItem('riderId', riderId);
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

    // Function to fetch and display reviews
    async function fetchReviews(riderId) {
        try {
            const response = await fetch(`/reviews/riderId?riderId=${riderId}`);
            console.log(response);
            const reviews = await response.json();
            console.log(reviews);

            const reviewsContainer = document.getElementById('reviewsContainer');
            reviews.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item');
                reviewItem.innerHTML = `
                    <p class="review-text">"${review.name}"</p>
                    <p class="review-author">- ${review.email}</p>
                `;
                reviewsContainer.appendChild(reviewItem);
            });
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    }

    fetchReviews(riderId);
});
