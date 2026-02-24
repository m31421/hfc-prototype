/**
 * Our Process – process page steps media rotator
 */
export class OurProcess {
  constructor() {
    this.currentIndex = 0;
    this.autoRotateInterval = null;
    this.isTransitioning = false;
    this.isPaused = false;
    this.rotationDuration = 8000;
    
    this.features = [
      {
        media: 'assets/images/process/Frame 1533211356.png',
        mediaType: 'image',
        alt: 'Budget Blinds consultation process'
      },
      {
        media: 'assets/images/process/Frame 1984077238.png',
        mediaType: 'image',
        alt: 'Budget Blinds personalized experience'
      },
      {
        media: 'assets/images/process/Frame 1984077239.png',
        mediaType: 'image',
        alt: 'Budget Blinds design and measurement'
      },
      {
        media: 'assets/images/process/Frame 1984077240.png',
        mediaType: 'image',
        alt: 'Budget Blinds installation and support'
      }
    ];
    
    this.mediaEl = document.getElementById('active-process-media');
    this.mediaContainer = this.mediaEl ? this.mediaEl.parentElement : null;
    this.buttons = document.querySelectorAll('.our-process__item');
    this.playPauseBtn = document.querySelector('.our-process__play-pause');
    this.pauseIcon = document.querySelector('.our-process__pause-icon');
    this.playIcon = document.querySelector('.our-process__play-icon');
    this.progressRingFill = document.querySelector('.our-process__progress-ring-fill');
    this.progressCircumference = this.progressRingFill
      ? 2 * Math.PI * parseFloat(this.progressRingFill.getAttribute('r') || 0)
      : 0;
    
    if (!this.mediaEl) return;
    
    this.init();
  }
  
  init() {
    // Preload images
    this.preloadImages();
    
    // Setup click handlers for feature buttons
    this.buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (this.isTransitioning) return;
        this.switchToFeature(index);
        if (!this.isPaused) {
          this.stopAutoRotate();
          this.startAutoRotate();
        }
      });
    });
    
    // Setup play/pause button
    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', () => {
        this.togglePlayPause();
      });
    }
    
    // Start auto-rotation
    this.startAutoRotate();
  }
  
  preloadImages() {
    this.features.forEach(feature => {
      if (feature.mediaType === 'image') {
        const img = new Image();
        img.src = feature.media;
      }
    });
  }
  
  switchToFeature(index) {
    if (index === this.currentIndex || this.isTransitioning) return;
    
    this.isTransitioning = true;
    const feature = this.features[index];
    
    // Close all descriptions first
    const allDescriptions = document.querySelectorAll('.our-process__item-description');
    allDescriptions.forEach(desc => desc.classList.remove('open'));
    
    // Update button states
    this.buttons.forEach((btn, i) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
    });
    
    // Remove active class from current media (fade out)
    const currentMedia = this.mediaContainer.querySelector('.active');
    if (currentMedia) {
      currentMedia.classList.remove('active');
    }
    
    // Create and add new media element
    const newMediaEl = this.createMediaElement(feature);
    this.mediaContainer.appendChild(newMediaEl);
    
    // Force reflow to ensure transition works
    newMediaEl.offsetHeight;
    
    // Fade in new media
    requestAnimationFrame(() => {
      newMediaEl.classList.add('active');
    });
    
    // Small delay then activate new button and open description
    setTimeout(() => {
      this.buttons[index].classList.add('active');
      this.buttons[index].setAttribute('aria-expanded', 'true');
      
      const selectedDescription = this.buttons[index].nextElementSibling;
      if (selectedDescription) {
        selectedDescription.classList.add('open');
      }
      
      this.currentIndex = index;
      this.isTransitioning = false;
    }, 100);
    
    // Clean up old media after transition completes
    setTimeout(() => {
      const oldMedia = this.mediaContainer.querySelectorAll('img, video');
      oldMedia.forEach((el, i) => {
        if (i < oldMedia.length - 1) { // Keep only the last (newest) element
          el.remove();
        }
      });
    }, 450);
  }
  
  createMediaElement(feature) {
    if (feature.mediaType === 'video') {
      const video = document.createElement('video');
      video.id = 'active-process-media';
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('aria-label', feature.alt);
      
      const source = document.createElement('source');
      source.src = feature.media;
      source.type = 'video/mp4';
      video.appendChild(source);
      
      return video;
    } else {
      const img = document.createElement('img');
      img.id = 'active-process-media';
      img.src = feature.media;
      img.alt = feature.alt;
      img.loading = 'lazy';
      
      return img;
    }
  }

  startProgressRing() {
    if (!this.playPauseBtn || !this.progressRingFill) return;

    const circumference = this.progressCircumference || 0;

    this.playPauseBtn.classList.remove('playing');
    this.progressRingFill.style.animation = 'none';

    if (circumference > 0) {
      this.progressRingFill.style.strokeDasharray = `${circumference}`;
      this.progressRingFill.style.strokeDashoffset = `${circumference}`;
    }

    void this.progressRingFill.offsetWidth;

    this.progressRingFill.style.animation = '';
    requestAnimationFrame(() => {
      this.playPauseBtn.classList.add('playing');
    });
  }

  freezeProgressRing() {
    if (!this.playPauseBtn || !this.progressRingFill) return;

    const computedOffset = parseFloat(getComputedStyle(this.progressRingFill).strokeDashoffset) || 0;

    this.playPauseBtn.classList.remove('playing');
    this.progressRingFill.style.animation = 'none';
    this.progressRingFill.style.strokeDashoffset = `${computedOffset}`;
  }
  
  startAutoRotate() {
    this.stopAutoRotate();

    this.startProgressRing();
    
    this.autoRotateInterval = setInterval(() => {
      const nextIndex = (this.currentIndex + 1) % this.features.length;
      this.startProgressRing();
      this.switchToFeature(nextIndex);
    }, this.rotationDuration); // Rotate every 8 seconds
  }
  
  stopAutoRotate() {
    if (this.autoRotateInterval) {
      clearInterval(this.autoRotateInterval);
      this.autoRotateInterval = null;
    }
    
    this.freezeProgressRing();
  }
  
  togglePlayPause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // Pause
      this.stopAutoRotate();
      this.pauseIcon.style.display = 'none';
      this.playIcon.style.display = 'block';
      this.playPauseBtn.setAttribute('aria-label', 'Play automatic rotation');
    } else {
      // Play
      this.startAutoRotate();
      this.pauseIcon.style.display = 'block';
      this.playIcon.style.display = 'none';
      this.playPauseBtn.setAttribute('aria-label', 'Pause automatic rotation');
    }
  }
}
