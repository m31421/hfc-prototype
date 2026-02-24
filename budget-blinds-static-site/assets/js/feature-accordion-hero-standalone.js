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

    function preloadImages() {
      var isMobile = mobileMatch.matches;
      backgrounds.forEach(function(bg) {
        var desktopImage = bg.getAttribute('data-desktop-image');
        var mobileImage = bg.getAttribute('data-mobile-image');
        var targetImage = isMobile && mobileImage ? mobileImage : desktopImage;
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
        var desktopImage = targetBg.getAttribute('data-desktop-image');
        if (desktopImage && !targetBg.style.backgroundImage) {
          targetBg.style.backgroundImage = "url('" + desktopImage + "')";
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
        var desktopImage = firstBg.getAttribute('data-desktop-image');
        if (desktopImage && !firstBg.style.backgroundImage) {
          firstBg.style.backgroundImage = "url('" + desktopImage + "')";
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
    mobileMatch.addListener(preloadImages);

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
