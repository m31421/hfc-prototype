/**
 * <bb-accordion> – Budget Blinds FAQ accordion component
 */
class BBAccordion extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
  }

  connectedCallback() {
    const question = this.getAttribute('question') || this.querySelector('[slot="question"]')?.textContent || '';
    const answer = this.getAttribute('answer') || this.querySelector('[slot="answer"]')?.innerHTML || '';

    this.innerHTML = `
      <div class="accordion">
        <button class="accordion__button" aria-expanded="false">
          <span>${question}</span>
          <span class="accordion__icon">+</span>
        </button>
        <div class="accordion__panel">
          ${answer}
        </div>
      </div>
    `;

    this.setupEventListeners();
  }

  setupEventListeners() {
    const button = this.querySelector('.accordion__button');
    const panel = this.querySelector('.accordion__panel');

    if (button && panel) {
      button.addEventListener('click', () => {
        const parent = this.closest('.faq-list') || this.parentElement;
        if (parent) {
          parent.querySelectorAll('bb-accordion').forEach(accordion => {
            if (accordion !== this) accordion.close();
          });
        }
        this.toggle();
      });
    }
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const button = this.querySelector('.accordion__button');
    const panel = this.querySelector('.accordion__panel');

    if (this.isOpen) {
      button.classList.add('active');
      panel.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
    } else {
      button.classList.remove('active');
      panel.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  }

  close() {
    if (this.isOpen) {
      this.isOpen = false;
      const button = this.querySelector('.accordion__button');
      const panel = this.querySelector('.accordion__panel');
      button.classList.remove('active');
      panel.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  }
}

customElements.define('bb-accordion', BBAccordion);
