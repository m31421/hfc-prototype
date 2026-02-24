/**
 * Reviews Carousel – process page testimonials carousel
 */
export class ReviewsCarousel {
  constructor() {
    this.carousel = document.querySelector('.reviews-section__carousel');
    if (!this.carousel) return;
    
    this.track = this.carousel.querySelector('.reviews-section__track');
    this.testimonials = this.carousel.querySelectorAll('.reviews-section__testimonial');
    this.prevBtn = this.carousel.querySelector('.reviews-section__arrow--prev');
    this.nextBtn = this.carousel.querySelector('.reviews-section__arrow--next');
    this.currentIndex = 0;
    
    this.init();
  }
  
  init() {
    if (!this.track || !this.testimonials.length) return;
    
    this.setupEventListeners();
    this.updateButtons();
  }
  
  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }
    
    // Handle touch/swipe
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;
    
    this.track.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - this.track.offsetLeft;
      scrollLeft = this.track.scrollLeft;
    });
    
    this.track.addEventListener('mouseleave', () => {
      isDown = false;
    });
    
    this.track.addEventListener('mouseup', () => {
      isDown = false;
    });
    
    this.track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - this.track.offsetLeft;
      const walk = (x - startX) * 2;
      this.track.scrollLeft = scrollLeft - walk;
    });
  }
  
  getVisibleCount() {
    const width = window.innerWidth;
    if (width >= 1024) return 4;
    if (width >= 768) return 2;
    return 1;
  }
  
  prev() {
    const visibleCount = this.getVisibleCount();
    const testimonialWidth = this.testimonials[0].offsetWidth;
    const gap = 24;
    const scrollAmount = testimonialWidth + gap;
    
    this.track.scrollBy({
      left: -scrollAmount * visibleCount,
      behavior: 'smooth'
    });
    
    this.currentIndex = Math.max(0, this.currentIndex - visibleCount);
    this.updateButtons();
  }
  
  next() {
    const visibleCount = this.getVisibleCount();
    const testimonialWidth = this.testimonials[0].offsetWidth;
    const gap = 24;
    const scrollAmount = testimonialWidth + gap;
    
    this.track.scrollBy({
      left: scrollAmount * visibleCount,
      behavior: 'smooth'
    });
    
    const maxIndex = Math.max(0, this.testimonials.length - visibleCount);
    this.currentIndex = Math.min(maxIndex, this.currentIndex + visibleCount);
    this.updateButtons();
  }
  
  updateButtons() {
    const visibleCount = this.getVisibleCount();
    const maxIndex = Math.max(0, this.testimonials.length - visibleCount);
    
    if (this.prevBtn) {
      this.prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
      this.prevBtn.disabled = this.currentIndex === 0;
    }
    
    if (this.nextBtn) {
      this.nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
  }
}

