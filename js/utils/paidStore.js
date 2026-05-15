/**
 * PaidStore — persists "paid" status per person in localStorage.
 * All keys are namespaced under a common prefix to avoid collisions.
 */
class PaidStore {
  static PREFIX = 'pilao_paid_';

  /** @param {string} id  person id, e.g. "fran-miojo" */
  isPaid(id) {
    return localStorage.getItem(PaidStore.PREFIX + id) === '1';
  }

  /** @param {string} id */
  markPaid(id) {
    localStorage.setItem(PaidStore.PREFIX + id, '1');
  }

  /** @param {string} id */
  markUnpaid(id) {
    localStorage.removeItem(PaidStore.PREFIX + id);
  }

  /**
   * Returns an array of all person ids currently marked as paid.
   * @returns {string[]}
   */
  getAll() {
    return Object.keys(localStorage)
      .filter(k => k.startsWith(PaidStore.PREFIX))
      .map(k => k.slice(PaidStore.PREFIX.length));
  }
}
