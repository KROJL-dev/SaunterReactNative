export default function generateId() {
  return Math.random().toString(20).substr(2, 9);
}
