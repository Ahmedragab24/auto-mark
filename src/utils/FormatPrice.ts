export const formatPrice = (price: number) => {
  const formattedPrice = new Intl.NumberFormat().format(price);
  if (price >= 1000000) return `${formattedPrice}`;
  if (price >= 1000) return `${formattedPrice}`;
  return formattedPrice;
};
