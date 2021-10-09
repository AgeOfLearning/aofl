/**
 * @author Arian Khosravi <arian.khosravi@aofl.com>
 * @module @aofl/uuid
 * @since 1.0.0
 */
/**
 * Generates uuid like random values
 *
 */
 export const uuid = () => {
  return '10000000-1000-4000-8000-100000000000'
    .replace(/[018]/g, (placeholder: string) => {
      const num = parseInt(placeholder, 10);
      return ((num ^ Math.random() * 16 >> num / 4).toString(16));
    });
};
