const SINGULAR = 1;

export const dayCountLabel = (days: number) => {
  if (days === SINGULAR) {
    return "1 day";
  }
  return `${days} days`;
};
