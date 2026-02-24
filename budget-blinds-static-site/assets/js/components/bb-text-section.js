/**
 * <bb-text-section> – Budget Blinds text section component
 */
class BBTextSection extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title') || '';
    const content = this.getAttribute('content') || '';

    const titleSlot = this.querySelector('[slot="title"]');
    const contentSlot = this.querySelector('[slot="content"]');

    const titleText = titleSlot ? titleSlot.innerHTML : title;
    const contentText = contentSlot ? contentSlot.innerHTML : `<p>${content}</p>`;

    this.innerHTML = `
      <div class="text-section">
        <div class="container">
          <div class="text-section__content">
            ${titleText ? `<h2 class="text-section__title">${titleText}</h2>` : ''}
            <div class="text-section__body">${contentText}</div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('bb-text-section', BBTextSection);
