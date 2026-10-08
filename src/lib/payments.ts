export const DEPOSIT_PERCENT = 20;

export function getDepositAmount(totalAmount: number) {
  return Math.ceil(totalAmount * DEPOSIT_PERCENT / 100);
}
