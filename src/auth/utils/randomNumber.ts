const maxSizeNumber = 999999;
const minSizeNumber = 100000;

export const getRandomNumberCode = () => {
  const rand = minSizeNumber + Math.random() * (maxSizeNumber + 1 - minSizeNumber);
  const number = Math.floor(rand);

  return number.toString();
};
