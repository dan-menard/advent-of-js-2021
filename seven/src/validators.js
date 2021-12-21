export function validatePeople(value) {
  return Math.floor(Math.abs(Number(value)));
}

export function validateBill(value) {
  return Number(value).toFixed(2);
}
