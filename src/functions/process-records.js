import countiesMonitored from '../constants/counties.constants';
import formatDate from './toolbox';
import {
  addDataToArray,
  sortAndTrimArray,
  calculateDeltaArray,
  calculateSevenDayAvgArray,
} from './array-functions';

const processCovidRecords = (covidRecords) => {
  // create areas for California-wide covid data
  let covidDatesArray = [];
  let sumConfirmedArray = [];
  let deltaConfirmedArray = [];
  let sevenDayAvgDeltaConfirmedArray = [];
  let sumDeathsArray = [];
  let deltaDeathsArray = [];
  let sevenDayAvgDeltaDeathsArray = [];
  // create arrays for just the Bay Area covid data
  let sumConfirmedBayAreaArray = [];
  let deltaConfirmedBayAreaArray = [];
  let sevenDayAvgDeltaConfirmedBayAreaArray = [];
  let sumDeathsBayAreaArray = [];
  let deltaDeathsBayAreaArray = [];
  let sevenDayAvgDeltaDeathsBayAreaArray = [];

  // iterate through every covid record
  covidRecords.forEach((originalRecord) => {
    // extract the county, date, confirmed cases, and deaths from the original data piece
    const { county } = originalRecord;
    // clean the format of the date
    const date = originalRecord.date
      ? formatDate(originalRecord.date)
      : originalRecord.date;

    // if the date is valid
    if (date) {
      // extract the number of confirmed cases and deaths
      const confirmed = originalRecord.totalcountconfirmed;
      const deaths = originalRecord.totalcountdeaths;

      // ? process the confirmed and deaths count for the entire state and push them
      // build an array with all the dates
      // check if the date does not exist in the dates array
      // if the index is -1, that means this date's value does not exist
      if (covidDatesArray.indexOf(date) === -1) {
        // insert the date
        covidDatesArray.push(date);
      }
      // call the local function to add the data to the array intelligently
      // sumConfirmedArray[dateIndex] += confirmed;
      // sumDeathsArray[dateIndex] += deaths;
      sumConfirmedArray = addDataToArray(
        sumConfirmedArray,
        date,
        'confirmed',
        confirmed,
      );
      sumDeathsArray = addDataToArray(sumDeathsArray, date, 'deaths', deaths);

      // ? now, check to see if the county is one of the Bay Area counties we are tracking
      // if is, do the same logic as above, but for the Bay Area arrays
      if (countiesMonitored.includes(county)) {
        // call the local function to add the data to the array intelligently
        sumConfirmedBayAreaArray = addDataToArray(
          sumConfirmedBayAreaArray,
          date,
          'confirmed',
          confirmed,
        );
        sumDeathsBayAreaArray = addDataToArray(
          sumDeathsBayAreaArray,
          date,
          'deaths',
          deaths,
        );
      }
    }
  });

  // before continuing with the processing, we need to sort and trim the arrays we have built
  // start by sorting the date array
  covidDatesArray = covidDatesArray.sort((a, b) => new Date(a) - new Date(b));

  // sort the other 4 arrays and trim them down to just include the properties we want
  sumConfirmedArray = sortAndTrimArray(sumConfirmedArray, 'confirmed');
  sumDeathsArray = sortAndTrimArray(sumDeathsArray, 'deaths');
  sumConfirmedBayAreaArray = sortAndTrimArray(
    sumConfirmedBayAreaArray,
    'confirmed',
  );
  sumDeathsBayAreaArray = sortAndTrimArray(sumDeathsBayAreaArray, 'deaths');

  // ? Calculate the delta arrays for the entire state of CA
  deltaConfirmedArray = calculateDeltaArray(sumConfirmedArray);
  deltaDeathsArray = calculateDeltaArray(sumDeathsArray);

  // ? Calculate the seven day average arrays for the entire state of CA
  sevenDayAvgDeltaConfirmedArray = calculateSevenDayAvgArray(
    deltaConfirmedArray,
  );
  sevenDayAvgDeltaDeathsArray = calculateSevenDayAvgArray(deltaDeathsArray);

  // ? Do the same calculation as above for the deltas but just for the Bay Area counties
  deltaConfirmedBayAreaArray = calculateDeltaArray(sumConfirmedBayAreaArray);
  deltaDeathsBayAreaArray = calculateDeltaArray(sumDeathsBayAreaArray);

  // ? Calculate the seven day average arrays but just for the Bay Area counties
  sevenDayAvgDeltaConfirmedBayAreaArray = calculateSevenDayAvgArray(
    deltaConfirmedBayAreaArray,
  );
  sevenDayAvgDeltaDeathsBayAreaArray = calculateSevenDayAvgArray(
    deltaDeathsBayAreaArray,
  );

  return {
    dates: covidDatesArray,
    confirmed: sumConfirmedArray,
    confirmedDelta: deltaConfirmedArray,
    confirmedDeltaSevenDayAvg: sevenDayAvgDeltaConfirmedArray,
    deaths: sumDeathsArray,
    deathsDelta: deltaDeathsArray,
    deathsDeltaSevenDayAvg: sevenDayAvgDeltaDeathsArray,
    confirmedBayArea: sumConfirmedBayAreaArray,
    confirmedDeltaBayArea: deltaConfirmedBayAreaArray,
    confirmedDeltaSevenDayAvgBayArea: sevenDayAvgDeltaConfirmedBayAreaArray,
    deathsBayArea: sumDeathsBayAreaArray,
    deathsDeltaBayArea: deltaDeathsBayAreaArray,
    deathsDeltaSevenDayAvgBayArea: sevenDayAvgDeltaDeathsBayAreaArray,
  };
};
const processHospitalRecords = (hospitalDataRecords) => {
  // create areas for California-wide hospital data
  let hospitalDatesArray = [];
  let hospitalizedConfirmedArray = [];
  let availableIcuBedsArray = [];
  // create arrays for just the Bay Area hospital data
  let hospitalizedConfirmedBayAreaArray = [];
  let availableIcuBedsBayAreaArray = [];

  // iterate through every hospital data record
  hospitalDataRecords.forEach((originalRecord) => {
    // extract the county, date, confirmed hospitalizations, and available icu beds from the original data piece
    const { county } = originalRecord;
    // clean the format of the date
    // ? Note: the datasource for the hospital data has a property 'todays_date' rather than 'date'
    const date = originalRecord.todays_date
      ? formatDate(originalRecord.todays_date)
      : originalRecord.todays_date;

    // if the date is valid
    if (date) {
      // extract the number of confirmed hospitalizations and available icu beds
      const hospitalizedConfirmed =
        originalRecord.hospitalized_covid_confirmed_patients;
      const availableIcuBeds = originalRecord.icu_available_beds;

      // ? process the hospitalized confirmed and available icu beds for the entire state and push them
      // build an array with all the dates
      // check if the date does not exist in the dates array
      // if the index is -1, that means this date's value does not exist
      if (hospitalDatesArray.indexOf(date) === -1) {
        // insert the date
        hospitalDatesArray.push(date);
      }
      // call the local function to add the data to the array intelligently
      // sumConfirmedArray[dateIndex] += confirmed;
      // sumDeathsArray[dateIndex] += deaths;
      hospitalizedConfirmedArray = addDataToArray(
        hospitalizedConfirmedArray,
        date,
        'hospitalizedConfirmed',
        hospitalizedConfirmed,
      );
      availableIcuBedsArray = addDataToArray(
        availableIcuBedsArray,
        date,
        'availableIcuBeds',
        availableIcuBeds,
      );

      // ? now, check to see if the county is one of the Bay Area counties we are tracking
      // if is, do the same logic as above, but for the Bay Area arrays
      if (countiesMonitored.includes(county)) {
        // call the local function to add the data to the array intelligently
        hospitalizedConfirmedBayAreaArray = addDataToArray(
          hospitalizedConfirmedBayAreaArray,
          date,
          'hospitalizedConfirmed',
          hospitalizedConfirmed,
        );
        availableIcuBedsBayAreaArray = addDataToArray(
          availableIcuBedsBayAreaArray,
          date,
          'availableIcuBeds',
          availableIcuBeds,
        );
      }
    }
  });

  // we need to sort and trim the arrays we have built
  // start by sorting the date array
  hospitalDatesArray = hospitalDatesArray.sort(
    (a, b) => new Date(a) - new Date(b),
  );

  // sort the other 4 arrays and trim them down to just include the properties we want
  hospitalizedConfirmedArray = sortAndTrimArray(
    hospitalizedConfirmedArray,
    'hospitalizedConfirmed',
  );
  availableIcuBedsArray = sortAndTrimArray(
    availableIcuBedsArray,
    'availableIcuBeds',
  );
  hospitalizedConfirmedBayAreaArray = sortAndTrimArray(
    hospitalizedConfirmedBayAreaArray,
    'hospitalizedConfirmed',
  );
  availableIcuBedsBayAreaArray = sortAndTrimArray(
    availableIcuBedsBayAreaArray,
    'availableIcuBeds',
  );

  return {
    dates: hospitalDatesArray,
    hospitalizedConfirmed: hospitalizedConfirmedArray,
    hospitalizedConfirmedBayArea: hospitalizedConfirmedBayAreaArray,
    availableIcuBeds: availableIcuBedsArray,
    availableIcuBedsBayArea: availableIcuBedsBayAreaArray,
  };
};
const processRecords = (covidRecords, hospitalDataRecords) => {
  // process the covid records
  const processedCovidRecords = processCovidRecords(covidRecords);
  // process the hospital records
  const processedHospitalRecords = processHospitalRecords(hospitalDataRecords);

  // return the processed records
  return {
    covidData: processedCovidRecords,
    hospitalData: processedHospitalRecords,
  };
};

export default processRecords;
