<template>
  <div id="app">
    <div class="header-container">
      <h1>Covid-19 Bay Area Data</h1>
      <button
        v-on:click="includeCA = includeCA ? false : true"
        alt="Toggle California Button"
        class="button"
        :disabled="!dataLoaded"
      >{{ !includeCA ? 'Compare to CA Data' : 'Bay Area Only' }}</button>
    </div>
    <div class="refresh-data-container" v-if="!dataLoaded && apiError">
      <span class="error">An error occurred, please refresh the data.</span>
      <br />
      <button v-on:click="loadData()" alt="Refresh Button" class="button refresh-button">Refresh</button>
    </div>
    <img
      alt="Loading Spinner"
      class="loading-spinner"
      src="./assets/loading-spinner.gif"
      v-if="!dataLoaded && !apiError"
    />
    <h3 v-if="dataLoadingIsDelayed">
      The data is taking a little while to load. This could be because the
      datasource has fallen asleep. Standby...
    </h3>

    <div class="body-container" v-if="dataLoaded">
      <div class="chart-row">
        <LineChart :chart-config="confirmedCasesConfig" :include-california="includeCA" />
        <LineChart :chart-config="confirmedCasesDeltaConfig" :include-california="includeCA" />
      </div>
      <div class="chart-row">
        <LineChart :chart-config="deathsConfig" :include-california="includeCA" />
        <LineChart :chart-config="deathsDeltaConfig" :include-california="includeCA" />
      </div>
      <div class="about-container">
        <h2>About</h2>
        <p>
          My wife is a health care worker in the Bay Area and had been looking
          for data specifically about Bay Area counties. She was only able to
          find data either for all of CA or separated by county; nothing that
          grouped the Bay Area counties together. That ask is where this app
          originated. The above graphs show data about COVID-19 in certain Bay
          Area counties (see below). The data is summed in the first graphs and
          calculated delta ("New") graphs showing the rate of change of the
          summative graphs are provided afterwards. On the delta graphs, a
          trendline has been drawn showing the seven day average values to
          provide a more consistent representation of the trend and
          counteracting the sporadic data availability on weekends. Optionally,
          you can also compare all Bay Area data with statewide data for all of
          California using the button at the top. Bay Area counties are defined
          here as:
        </p>
        <ul class="counties-list">
          <li>Alameda</li>
          <li>Contra Costa</li>
          <li>Marin</li>
          <li>Napa</li>
          <li>San Francisco</li>
          <li>San Joaquin</li>
          <li>San Jose</li>
          <li>San Mateo</li>
          <li>Santa Clara</li>
          <li>Santa Cruz</li>
          <li>Solano</li>
          <li>Sonoma</li>
          <li>Stanislaus</li>
        </ul>
        <h2>Datasource</h2>
        <p>
          All data presented here is sourced from the
          <a
            title="CHHS Covid-19 Data Website"
            target="_blank"
            href="https://data.chhs.ca.gov/dataset/california-covid-19-hospital-data-and-case-statistics"
          >California Department of Public Health</a>, which publicly exposes this data via a public API endpoint
          <a
            title="CHHS Covid-19 Data API endpoint"
            target="_blank"
            href="https://data.chhs.ca.gov/api/3/action/datastore_search?resource_id
            =6cd8d424-dfaa-4bdd-9410-a3d656e1176e"
          >here</a>.
        </p>
        <h2>Limitations</h2>
        <ul class="limitations-list">
          <li>
            the current API limits calls to 32,000 results (approximately 20
            months of data)
          </li>
          <li>
            the underlying datasource format (eg. field names) must remain
            constant for the app to continue to work
          </li>
          <li>
            any inconsistencies or inaccuracies from the underlying datasource
            will be inherited
          </li>
        </ul>
        <h2>App Code</h2>
        <p>
          The code for this app can be found in the following
          <a
            title="Github repository"
            href="https://github.com/blubberbo/Covid19BayArea"
          >GitHub repository</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './components/LineChart.vue';

const dataUrl =
  'https://data.chhs.ca.gov/api/3/action/datastore_search?resource_id=6cd8d424-dfaa-4bdd-9410-a3d656e1176e&limit=32000';

const countiesMonitored = [
  'Alameda',
  'Marin',
  'Contra Costa',
  'San Francisco',
  'San Mateo',
  'Santa Clara',
  'San Jose',
  'Santa Cruz',
  'Sonoma',
  'Napa',
  'Solano',
  'Stanislaus',
  'San Joaquin',
];

const confirmedBayAreaChartColor = 'rgba(60, 186, 159, .5)';
const deathsBayAreaChartColor = 'rgba(142, 94, 162, .5)';
const californiaChartColor = 'rgba(62,149,205, 0.1)';
const sevenDayAvgChartColor = 'rgba(62,149,205, 1)';
const chartOptionsDefault = {
  responsive: true,
  maintainAspectRatio: false,
};
const sevenDayAvgChartOptionsDefault = {
  fill: false,
  borderWidth: 2,
  pointRadius: 0,
  borderColor: sevenDayAvgChartColor,
};

export default {
  name: 'App',
  components: {
    LineChart,
  },
  data() {
    return {
      confirmedCasesConfig: {
        title: 'Confirmed Cases',
        color: californiaChartColor,
        colorBayArea: confirmedBayAreaChartColor,
        options: chartOptionsDefault,
        labels: [],
        data: [],
      },
      confirmedCasesDeltaConfig: {
        title: '# of New Confirmed Cases',
        color: californiaChartColor,
        colorBayArea: confirmedBayAreaChartColor,
        options: chartOptionsDefault,
        sevenDaysAvgOptions: sevenDayAvgChartOptionsDefault,
        labels: [],
        data: [],
      },
      deathsConfig: {
        title: 'Deaths',
        color: californiaChartColor,
        colorBayArea: deathsBayAreaChartColor,
        options: chartOptionsDefault,
        labels: [],
        data: [],
      },
      deathsDeltaConfig: {
        title: '# of New Deaths',
        color: californiaChartColor,
        colorBayArea: deathsBayAreaChartColor,
        options: chartOptionsDefault,
        sevenDaysAvgOptions: sevenDayAvgChartOptionsDefault,
        labels: [],
        data: [],
      },
      dataLoaded: false,
      apiError: false,
      includeCA: false,
      dataLoadingIsDelayed: false,
    };
  },
  // process the data returned by the api
  methods: {
    loadData() {
      // reset the apiError flag
      this.apiError = false;
      // indicate data is loading
      this.dataLoaded = false;
      // reset the includeCA flag
      this.includeCA = false;

      // create a timeout that - after 5 seconds, indicate the loading is delayed (aka show the text)
      const delayedTimeout = setTimeout(() => {
        this.dataLoadingIsDelayed = true;
      }, 5000);

      // make the api call
      fetch(dataUrl, { cache: 'no-store' })
        .then((response) => response.json())
        .then((data) => {
          // extract the records
          const { records } = data.result;
          // process the data returned
          const processedData = this.processRecords(records);

          this.confirmedCasesConfig.labels = processedData.dates;
          this.confirmedCasesConfig.data = processedData.confirmed;
          this.confirmedCasesConfig.dataBayArea =
            processedData.confirmedBayArea;
          this.confirmedCasesDeltaConfig.labels = processedData.dates;
          this.confirmedCasesDeltaConfig.data = processedData.confirmedDelta;
          this.confirmedCasesDeltaConfig.sevenDayAvg =
            processedData.confirmedDeltaSevenDayAvg;
          this.confirmedCasesDeltaConfig.dataBayArea =
            processedData.confirmedDeltaBayArea;
          this.confirmedCasesDeltaConfig.sevenDayAvgBayArea =
            processedData.confirmedDeltaSevenDayAvgBayArea;
          this.deathsConfig.labels = processedData.dates;
          this.deathsConfig.data = processedData.deaths;
          this.deathsConfig.dataBayArea = processedData.deathsBayArea;
          this.deathsDeltaConfig.labels = processedData.dates;
          this.deathsDeltaConfig.data = processedData.deathsDelta;
          this.deathsDeltaConfig.sevenDayAvg =
            processedData.deathsDeltaSevenDayAvg;
          this.deathsDeltaConfig.dataBayArea = processedData.deathsDeltaBayArea;
          this.deathsDeltaConfig.sevenDayAvgBayArea =
            processedData.deathsDeltaSevenDayAvgBayArea;
          // after all the data has loaded, change the flag
          this.dataLoaded = true;
          // in the event the delayedTimeout has not been triggered yet, stop it
          clearTimeout(delayedTimeout);
          // since the loading has completed, it is no longer delayed as well
          this.dataLoadingIsDelayed = false;
        })
        .catch((error) => {
          console.error(error);
          // indicate there was an error
          this.apiError = true;
          // in the event the delayedTimeout has not been triggered yet, stop it
          clearTimeout(delayedTimeout);
          // since the loading has completed, it is no longer delayed as well
          this.dataLoadingIsDelayed = false;
        });
    },
    processRecords(records) {
      // create areas for California-wide data
      let datesArray = [];
      let sumConfirmedArray = [];
      let deltaConfirmedArray = [];
      let sevenDayAvgDeltaConfirmedArray = [];
      let sumDeathsArray = [];
      let deltaDeathsArray = [];
      let sevenDayAvgDeltaDeathsArray = [];
      // create arrays for just the Bay Area data
      let sumConfirmedBayAreaArray = [];
      let deltaConfirmedBayAreaArray = [];
      let sevenDayAvgDeltaConfirmedBayAreaArray = [];
      let sumDeathsBayAreaArray = [];
      let deltaDeathsBayAreaArray = [];
      let sevenDayAvgDeltaDeathsBayAreaArray = [];

      // iterate through every item in the array
      records.forEach((originalRecord) => {
        // extract the county, date, confirmed cases, and deaths from the original data piece
        const county = originalRecord['County Name'];
        // clean the format of the date
        const date = originalRecord['Most Recent Date']
          ? this.formatDate(originalRecord['Most Recent Date'])
          : originalRecord['Most Recent Date'];

        // if the date is valid
        if (date) {
          // extract the number of confirmed cases and deaths
          const confirmed = originalRecord['Total Count Confirmed'];
          const deaths = originalRecord['Total Count Deaths'];

          // ? process the confirmed and deaths count for the entire state and push them
          // build an array with all the dates
          // check if the date does not exist in the dates array
          // if the index is -1, that means this date's value does not exist
          if (datesArray.indexOf(date) === -1) {
            // insert the date
            datesArray.push(date);
          }
          // call the local function to add the data to the array intelligently
          // sumConfirmedArray[dateIndex] += confirmed;
          // sumDeathsArray[dateIndex] += deaths;
          sumConfirmedArray = this.addDataToArray(
            sumConfirmedArray,
            date,
            'confirmed',
            confirmed,
          );
          sumDeathsArray = this.addDataToArray(
            sumDeathsArray,
            date,
            'deaths',
            deaths,
          );

          // ? now, check to see if the county is one of the Bay Area counties we are tracking
          // if is, do the same logic as above, but for the Bay Area arrays
          if (countiesMonitored.includes(county)) {
            // call the local function to add the data to the array intelligently
            sumConfirmedBayAreaArray = this.addDataToArray(
              sumConfirmedBayAreaArray,
              date,
              'confirmed',
              confirmed,
            );
            sumDeathsBayAreaArray = this.addDataToArray(
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
      datesArray = datesArray.sort((a, b) => new Date(a) - new Date(b));

      // sort the other 4 arrays using the local method
      sumConfirmedArray = this.sortAndTrimArray(sumConfirmedArray, 'confirmed');
      sumDeathsArray = this.sortAndTrimArray(sumDeathsArray, 'deaths');
      sumConfirmedBayAreaArray = this.sortAndTrimArray(
        sumConfirmedBayAreaArray,
        'confirmed',
      );
      sumDeathsBayAreaArray = this.sortAndTrimArray(
        sumDeathsBayAreaArray,
        'deaths',
      );

      // ? Calculate the delta arrays for the entire state of CA
      deltaConfirmedArray = this.calculateDeltaArray(sumConfirmedArray);
      deltaDeathsArray = this.calculateDeltaArray(sumDeathsArray);

      // ? Calculate the seven day average arrays for the entire state of CA
      sevenDayAvgDeltaConfirmedArray = this.calculateSevenDayAvgArray(
        deltaConfirmedArray,
      );
      sevenDayAvgDeltaDeathsArray = this.calculateSevenDayAvgArray(
        deltaDeathsArray,
      );

      // ? Do the same calculation as above for the deltas but just for the Bay Area counties
      deltaConfirmedBayAreaArray = this.calculateDeltaArray(
        sumConfirmedBayAreaArray,
      );
      deltaDeathsBayAreaArray = this.calculateDeltaArray(sumDeathsBayAreaArray);

      // ? Calculate the seven day average arrays but just for the Bay Area counties
      sevenDayAvgDeltaConfirmedBayAreaArray = this.calculateSevenDayAvgArray(
        deltaConfirmedBayAreaArray,
      );
      sevenDayAvgDeltaDeathsBayAreaArray = this.calculateSevenDayAvgArray(
        deltaDeathsBayAreaArray,
      );

      return {
        dates: datesArray,
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
    },
    formatDate(date) {
      let formattedDate = date;
      // remove the time
      formattedDate = formattedDate.replace('T00:00:00', '');
      // change the '-'s to '/'s
      formattedDate = formattedDate.replace(/-/g, '/');
      // parse it into a date and then back into a string with a 2 digit year
      formattedDate = new Date(formattedDate).toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      });
      // if the first character is 0, remove it
      if (formattedDate.charAt(0) === '0') {
        formattedDate = formattedDate.substring(1);
      }
      // remove any 0 after a '/' - this should only be possible with the day
      formattedDate = formattedDate.replace('/0', '/');
      // return the formatted date
      return formattedDate;
    },
    addDataToArray(originalArray, date, property, data) {
      // create a temporary array
      const tempArray = originalArray;

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

      // return the temporary array
      return tempArray;
    },
    sortAndTrimArray(originalArray, property) {
      const sortedAndTrimmedArray = [];
      // sort the original array by date, converting the date strings to dates
      const sortedArray = originalArray.sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      );
      // loop through the sortedArray
      sortedArray.forEach((obj) => sortedAndTrimmedArray.push(obj[property]));

      // return the sorted and trimmed array
      return sortedAndTrimmedArray;
    },
    calculateDeltaArray(originalArray) {
      // start with a single 0 in the array
      const returnArray = [0];
      // iterate through the entire sum confirmed array to create the delta array
      // begin at index 1, since the delta can only be calculated when there is a previous element
      for (let sumIndex = 1; sumIndex < originalArray.length; sumIndex++) {
        returnArray.push(originalArray[sumIndex] - originalArray[sumIndex - 1]);
      }
      return returnArray;
    },
    calculateSevenDayAvgArray(originalArray) {
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
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-bottom: 50px;

  > .loading-spinner {
    margin-top: 30px;
  }

  > .header-container {
    > h1 {
      margin-bottom: 5px;
    }
  }

  .button {
    background-color: #3e95cd;
    border-radius: 28px;
    border: 1px solid #1c7ab7;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-size: 17px;
    padding: 12px 15px;
    &:hover {
      background-color: #0870b3;
    }
    &:active {
      position: relative;
      top: 1px;
    }
    &:focus {
      outline: none;
    }
    &:disabled,
    &[disabled] {
      opacity: 0.6;

      &:hover {
        cursor: default;
        background-color: #3e95cd;
      }
    }

    &.refresh-button {
      background-color: #41b883;
      border-color: #2fa26f;
      margin-top: 20px;

      &:hover {
        background-color: #23865a;
      }
    }
  }

  > .refresh-data-container {
    font-weight: bold;
    color: red;
    margin-top: 20px;
  }

  > .body-container {
    > .chart-row {
      margin-top: 30px;
      @media screen and (min-width: 1025px) {
        display: flex;
        justify-content: space-between;
      }
    }
    > .about-container {
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;

      h2 {
        width: 100%;
        margin-bottom: 0;
        margin-top: 30px;
      }
      p {
        width: 100%;
        margin-top: 0;
      }

      > ul {
        text-align: left;
        display: inline-block;
        margin: 0 auto;

        &.counties-list {
          columns: 2;
          -webkit-columns: 2;
          -moz-columns: 2;
          column-gap: 50px;
        }
      }
    }
  }
}
</style>
