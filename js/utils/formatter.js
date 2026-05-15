/**
 * Formatter — pure utility functions for display formatting.
 * No side-effects; safe to call anywhere.
 */
const Formatter = Object.freeze({
  /**
   * Formats a number as Brazilian Real currency.
   * @param {number} value
   * @returns {string}  e.g. "R$ 39,90"
   */
  BRL(value) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  },

  /**
   * Formats a string of digits as a Brazilian phone number.
   * Accepts raw digits or already-formatted strings.
   * @param {string} raw
   * @returns {string}  e.g. "(16) 99109-1234"
   */
  phone(raw) {
    const digits = raw.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return raw;
  },

  /**
   * Returns up to two uppercase initials from a full name.
   * @param {string} name
   * @returns {string}  e.g. "FL"
   */
  initials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0].toUpperCase())
      .join('');
  },
});
