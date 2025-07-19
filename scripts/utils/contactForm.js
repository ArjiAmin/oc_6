function displayModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');

    const photographerName = document.getElementById('photographer-name')?.textContent || 'le photographe';
    const modalTitle = document.getElementById('contact-modal-title');
    if (modalTitle) {
        modalTitle.innerHTML = `Contactez-moi<br>${photographerName}`;
    }

    document.body.style.overflow = 'hidden';

    const firstInput = modal.querySelector('#first-name');
    if (firstInput) {
        firstInput.focus();
    }

    document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
    const modal = document.getElementById('contact_modal');
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';

    document.removeEventListener('keydown', handleModalKeydown);

    const contactButton = document.querySelector('.contact_button');
    if (contactButton) {
        contactButton.focus();
    }
}

function handleModalKeydown(event) {
    if (event.key === 'Escape') {
        closeModal();
        return;
    }

    if (event.key === 'Tab') {
        trapFocus(event);
    }
}

function trapFocus(event) {
    const modal = document.getElementById('contact_modal');
    const focusableElements = modal.querySelectorAll(
        'button, input, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('contact_modal');
    const closeButton = modal.querySelector('.contact-modal-close');
    const form = modal.querySelector('.contact-form');

    closeButton.addEventListener('click', closeModal);

    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        console.log('Form submitted with data:', data);

        closeModal();

        form.reset();
    });
});
