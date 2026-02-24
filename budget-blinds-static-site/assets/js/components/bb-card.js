/**
 * <bb-card> – Budget Blinds card component
 */
class BBCard extends HTMLElement {
  connectedCallback() {
    const image = this.getAttribute('image') || '';
    const imageAlt = this.getAttribute('image-alt') || '';
    const title = this.getAttribute('title') || '';
    const description = this.getAttribute('description') || '';
    const href = this.getAttribute('href') || '#';
    const buttonText = this.getAttribute('button-text') || 'View Details';
    const showButton = this.getAttribute('show-button') !== 'false';

    const customContent = this.innerHTML.trim();

    if (customContent) {
      const content = customContent;
      this.innerHTML = `
        <div class="card">
          ${content}
        </div>
      `;
    } else {
      this.innerHTML = `
        <div class="card${this.hasAttribute('product') ? ' product-card' : ''}">
          ${image ? `
            <div class="card__image">
              <img src="${image}" alt="${imageAlt}">
            </div>
          ` : ''}
          ${title ? `<h3>${title}</h3>` : ''}
          ${description ? `<p>${description}</p>` : ''}
          ${showButton && href ? `
            <a href="${href}" class="btn btn--secondary">${buttonText}</a>
          ` : ''}
        </div>
      `;
    }
  }
}

customElements.define('bb-card', BBCard);
