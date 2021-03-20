const addDataToArray = (originalArray, date, property, data) => {
  // create a temporary array
  const tempArray = originalArray;

  // ensure that there was data passed
  // if there is no data, then just pass the original array back
  if (data) {
    // find index of item to be replaced
    const targetIndex = originalArray.findIndex((obj) => obj.date === date);

    // if the date does not exist in the array
    if (targetIndex === -1) {
      // build an item to add to the array
      const tempItem = { date };
      tempItem[property] = data;
      // add the item to the array
      tempArray.push(tempItem);
    } else {
      // else, update the value by adding the data to it
      tempArray[targetIndex][property] += data;
    }
  }
  // return the temporary array
  return tempArray;
};
const sortAndTrimArray = (originalArray, property) => {
  const sortedAndTrimmedArray = [];
  // sort the original array by date, converting the date strings to dates
  const sortedArray = originalArray.sort(
    (a, b) => new Date(a.date) - new Date(b.date),
  );
  // loop through the sortedArray
  sortedArray.forEach((obj) => sortedAndTrimmedArray.push(obj[property]));

  // return the sorted and trimmed array
  return sortedAndTrimmedArray;
};
const calculateDeltaArray = (originalArray) => {
  // start with a single 0 in the array
  const returnArray = [0];
  // iterate through the entire sum confirmed array to create the delta array
  // begin at index 1, since the delta can only be calculated when there is a previous element
  for (let sumIndex = 1; sumIndex < originalArray.length; sumIndex++) {
    returnArray.push(originalArray[sumIndex] - originalArray[sumIndex - 1]);
  }
  return returnArray;
};
const calculateSevenDayAvgArray = (originalArray) => {
  // start with a six 0s in the array
  const returnArray = [null, null, null, null, null, null];
  // iterate through the entire sum confirmed array to create the delta array
  // begin at index 6 - the seven day average can only be calculated with six previous elements
  for (let sumIndex = 6; sumIndex < originalArray.length; sumIndex++) {
    // calculate the 7 element average
    let average = 0;
    // add the 7 values together
    for (let avgIndex = sumIndex; avgIndex >= sumIndex - 6; avgIndex--) {
      average += originalArray[avgIndex];
    }
    // divide the result by 7
    average /= 7;
    returnArray.push(average);
  }
  return returnArray;
};

export {
  addDataToArray,
  sortAndTrimArray,
  calculateDeltaArray,
  calculateSevenDayAvgArray,
};
