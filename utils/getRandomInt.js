export const getRandomFloat = (mixedDecimal = false, threeDecimalPlaces=false) => {
  let number = '0.00';
  while ( number === '0.00') {
    number = ("0." + ("" + Math.random()).substring(5,4) + ( mixedDecimal ? (""+Math.random()).substring(6,5) : '0')) ;
  }
  if(threeDecimalPlaces) {
    number += (""+Math.random()).substring(6,5)
  }
  
  return number;
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default getRandomInt;