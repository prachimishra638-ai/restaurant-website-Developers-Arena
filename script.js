// Saffron & Stone - navigation, date handling and form validation
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString().split('T')[0];
  dateInput.min = localDate;
}

const form = document.getElementById('bookingForm');
if (form) {
  const fields = ['name', 'email', 'phone', 'guests', 'date', 'time'];

  function showError(field, message) {
    field.classList.add('invalid');
    const error = field.parentElement.querySelector('.error');
    if (error) error.textContent = message;
  }

  function clearError(field) {
    field.classList.remove('invalid');
    const error = field.parentElement.querySelector('.error');
    if (error) error.textContent = '';
  }

  fields.forEach(id => {
    const field = document.getElementById(id);
    if (field) field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    let valid = true;

    fields.forEach(id => {
      const field = document.getElementById(id);
      if (!field) return;
      clearError(field);
      if (!field.value.trim()) {
        showError(field, 'This field is required.');
        valid = false;
      }
    });

    const email = document.getElementById('email');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Enter a valid email address.');
      valid = false;
    }

    const phone = document.getElementById('phone');
    if (phone.value && !/^\d{10}$/.test(phone.value.replace(/\s+/g, ''))) {
      showError(phone, 'Enter a valid 10-digit phone number.');
      valid = false;
    }

    if (dateInput && dateInput.value) {
      const selected = new Date(dateInput.value + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        showError(dateInput, 'Please choose today or a future date.');
        valid = false;
      }
    }

    const success = document.getElementById('successMessage');
    if (valid) {
      success.textContent = '✓ Reservation request submitted successfully!';
      form.reset();
      fields.forEach(id => clearError(document.getElementById(id)));
    } else {
      success.textContent = '';
    }
  });
}
