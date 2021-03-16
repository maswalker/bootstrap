export { default as modelValidate } from './model.validate';

export function verifyCardNumber(cardNumber: string) {
  if (cardNumber.length < 10) return false;
  let tmp = true;
  let total = 0;
  for (let i = cardNumber.length; i > 0; i--) {
    let num = parseInt(cardNumber.substring(i, i - 1));
    if (((tmp = !tmp), tmp)) num = num * 2;
    let gw = num % 10;
    total += gw + (num - gw) / 10;
  }
  return total % 10 == 0;
}
