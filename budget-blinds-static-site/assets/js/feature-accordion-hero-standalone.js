/**
 * Feature Accordion Hero – standalone (no module/bundler).
 * Accordion expand/collapse and background image switching for .feature-hero.
 */
(function() {
  function init() {
    var hero = document.querySelector('.feature-hero');
    if (!hero) return;

    var accordionItems = hero.querySelectorAll('.feature-accordion-item');
    var backgrounds = hero.querySelectorAll('.feature-hero__bg');
    var videos = hero.querySelectorAll('.feature-hero__bg-video');
    var mobileMatch = window.matchMedia('(max-width: 1029px)');

    function getImageForBg(bg) {
      var isMobile = mobileMatch.matches;
      var desktopImage = bg.getAttribute('data-desktop-image');
      var mobileImage = bg.getAttribute('data-mobile-image');
      return (isMobile && mobileImage) ? mobileImage : desktopImage;
    }

    function getVideoSrc(video) {
      var isMobile = mobileMatch.matches;
      var desktopSrc = video.getAttribute('data-desktop-src');
      var mobileSrc = video.getAttribute('data-mobile-src');
      return (isMobile && mobileSrc) ? mobileSrc : (desktopSrc || '');
    }

    function applyVideoSources() {
      videos.forEach(function(video) {
        var src = getVideoSrc(video);
        if (!src) return;
        var source = video.querySelector('source');
        if (source && source.getAttribute('src') !== src) {
          source.setAttribute('src', src);
          video.load();
          if (video.classList.contains('active')) {
            video.play && video.play();
          }
        }
      });
    }

    function preloadImages() {
      backgrounds.forEach(function(bg) {
        var targetImage = getImageForBg(bg);
        if (targetImage) {
          bg.style.backgroundImage = "url('" + targetImage + "')";
          var img = new Image();
          img.src = targetImage;
        }
      });
    }

    function expandItem(button, content) {
      button.setAttribute('aria-expanded', 'true');
      content.classList.add('open');
    }

    function collapseItem(button, content) {
      button.setAttribute('aria-expanded', 'false');
      content.classList.remove('open');
    }

    function closeAllItems() {
      accordionItems.forEach(function(item) {
        var btn = item.querySelector('.feature-accordion-item__header');
        var content = item.querySelector('.feature-accordion-item__content');
        if (btn && content) collapseItem(btn, content);
      });
    }

    function changeBackground(featureNumber) {
      backgrounds.forEach(function(bg) {
        bg.classList.remove('active');
      });
      videos.forEach(function(v) {
        v.classList.remove('active');
      });

      var targetBg = hero.querySelector('.feature-hero__bg[data-image="' + featureNumber + '"]');
      if (targetBg) {
        var targetImage = getImageForBg(targetBg);
        if (targetImage) {
          targetBg.style.backgroundImage = "url('" + targetImage + "')";
        }
        targetBg.classList.add('active');
      }

      var targetVideo = hero.querySelector('.feature-hero__bg-video[data-feature="' + featureNumber + '"]');
      if (targetVideo) {
        targetVideo.classList.add('active');
        targetVideo.play && targetVideo.play();
      }
    }

    function resetBackground() {
      backgrounds.forEach(function(bg) {
        bg.classList.remove('active');
      });
      videos.forEach(function(v) {
        v.classList.remove('active');
      });
      var firstBg = hero.querySelector('.feature-hero__bg[data-image="1"]');
      if (firstBg) {
        var targetImage = getImageForBg(firstBg);
        if (targetImage) {
          firstBg.style.backgroundImage = "url('" + targetImage + "')";
        }
        firstBg.classList.add('active');
      }
    }

    function handleClick(item, button, content, featureNumber) {
      var isOpen = button.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        collapseItem(button, content);
        resetBackground();
      } else {
        closeAllItems();
        expandItem(button, content);
        changeBackground(featureNumber);
      }
    }

    preloadImages();
    applyVideoSources();
    if (mobileMatch.addEventListener) {
      mobileMatch.addEventListener('change', function() {
        preloadImages();
        applyVideoSources();
      });
    } else if (mobileMatch.addListener) {
      mobileMatch.addListener(function() {
        preloadImages();
        applyVideoSources();
      });
    }

    var firstOpen = hero.querySelector('.feature-accordion-item__content.open');
    if (firstOpen) {
      var firstItem = firstOpen.closest('.feature-accordion-item');
      var firstFeature = firstItem ? firstItem.getAttribute('data-feature') : '1';
      changeBackground(firstFeature);
    } else {
      resetBackground();
    }

    accordionItems.forEach(function(item) {
      var button = item.querySelector('.feature-accordion-item__header');
      var content = item.querySelector('.feature-accordion-item__content');
      var featureNumber = item.getAttribute('data-feature');
      if (!button || !content) return;
      button.addEventListener('click', function() {
        handleClick(item, button, content, featureNumber);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
