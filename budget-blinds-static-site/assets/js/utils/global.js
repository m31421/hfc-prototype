/**
 * Global behaviors: smooth scroll, newsletter form
 */
export function initGlobal() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || !document.querySelector(href)) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  const newsletterForm = document.querySelector('.footer__form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      const zipInput = this.querySelector('input[type="text"]');
      if (emailInput.value && zipInput.value) {
        alert("Thank you for subscribing! We'll send design inspiration and exclusive offers to " + emailInput.value);
        emailInput.value = '';
        zipInput.value = '';
      }
    });
  }
}
