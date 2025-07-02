// Banner Sliding Functionality
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.querySelectorAll('.banner-slide');
    let currentSlide = 0;

    // Show first slide
    slides[0].classList.add('active');

    // Function to show next slide
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);
}); 