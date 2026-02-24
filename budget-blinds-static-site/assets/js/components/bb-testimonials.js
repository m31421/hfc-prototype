/**
 * <bb-testimonials> – Budget Blinds testimonials slider component
 */
class BBTestimonials extends HTMLElement {
  constructor() {
    super();
    this.currentIndex = 0;
    this.autoRotateInterval = null;
  }

  async connectedCallback() {
    const dataSrc = this.getAttribute('data-src');
    let testimonials = [];

    if (dataSrc) {
      try {
        const response = await fetch(dataSrc);
        testimonials = await response.json();
      } catch (error) {
        console.error('Error loading testimonials:', error);
        testimonials = this.getInlineTestimonials();
      }
    } else {
      testimonials = this.getInlineTestimonials();
    }

    this.render(testimonials);
    this.setupEventListeners();
    this.startAutoRotate();
  }

  disconnectedCallback() {
    this.stopAutoRotate();
  }

  getInlineTestimonials() {
    const items = [];
    this.querySelectorAll('li').forEach(li => {
      const stars = li.getAttribute('stars') || '5';
      const text = li.querySelector('.text')?.textContent || li.textContent;
      const author = li.querySelector('.author')?.textContent || li.getAttribute('author') || '';
      items.push({ stars, text, author });
    });
    return items;
  }

  render(testimonials) {
    this.testimonials = testimonials;
    this.innerHTML = `
      <div class="testimonials">
        <div class="testimonials__slider">
          <div class="testimonials__track">
            ${testimonials.map(t => `
              <div class="testimonial card">
                <div class="testimonial__stars" aria-label="${t.stars} out of 5 stars">
                  ${'★'.repeat(parseInt(t.stars))}
                </div>
                <p class="testimonial__text">${t.text}</p>
                <p class="testimonial__author">${t.author}</p>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="testimonials__controls">
          <button class="testimonials__btn" aria-label="Previous testimonial" data-direction="prev">‹</button>
          <button class="testimonials__btn" aria-label="Next testimonial" data-direction="next">›</button>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    const track = this.querySelector('.testimonials__track');
    const prevBtn = this.querySelector('[data-direction="prev"]');
    const nextBtn = this.querySelector('[data-direction="next"]');

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        this.prev();
        this.stopAutoRotate();
        setTimeout(() => this.startAutoRotate(), 10000);
      });
      nextBtn.addEventListener('click', () => {
        this.next();
        this.stopAutoRotate();
        setTimeout(() => this.startAutoRotate(), 10000);
      });
    }
    if (track) {
      track.addEventListener('mouseenter', () => this.stopAutoRotate());
      track.addEventListener('mouseleave', () => this.startAutoRotate());
    }
    window.addEventListener('resize', () => this.updateSlider());
    this.updateSlider();
  }

  getVisibleCount() {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  }

  updateSlider() {
    const track = this.querySelector('.testimonials__track');
    const testimonials = this.querySelectorAll('.testimonial');
    const prevBtn = this.querySelector('[data-direction="prev"]');
    const nextBtn = this.querySelector('[data-direction="next"]');
    if (!track || !testimonials.length) return;

    const visibleCount = this.getVisibleCount();
    const maxIndex = Math.max(0, testimonials.length - visibleCount);
    this.currentIndex = Math.min(this.currentIndex, maxIndex);
    this.currentIndex = Math.max(this.currentIndex, 0);

    const testimonialWidth = testimonials[0].offsetWidth;
    const gap = 24;
    const offset = this.currentIndex * (testimonialWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;

    if (prevBtn && nextBtn) {
      prevBtn.disabled = this.currentIndex === 0;
      nextBtn.disabled = this.currentIndex >= maxIndex;
      prevBtn.style.opacity = this.currentIndex === 0 ? '0.5' : '1';
      nextBtn.style.opacity = this.currentIndex >= maxIndex ? '0.5' : '1';
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateSlider();
    }
  }

  next() {
    const visibleCount = this.getVisibleCount();
    const maxIndex = this.testimonials.length - visibleCount;
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateSlider();
    }
  }

  startAutoRotate() {
    this.stopAutoRotate();
    this.autoRotateInterval = setInterval(() => {
      const visibleCount = this.getVisibleCount();
      const maxIndex = this.testimonials.length - visibleCount;
      if (this.currentIndex < maxIndex) {
        this.currentIndex++;
      } else {
        this.currentIndex = 0;
      }
      this.updateSlider();
    }, 5000);
  }

  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
  }
}

customElements.define('bb-testimonials', BBTestimonials);
