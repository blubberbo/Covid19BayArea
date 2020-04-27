<template>
  <div id="app">
    <div class="header-container">
      <h1>
        Covid-19 Bay Area Data
      </h1>
      <button
        v-on:click="loadData()"
        alt="Refresh Button"
        class="refresh-button"
      >
        Refresh
      </button>
    </div>
    <img
      alt="Loading Spinner"
      class="loading-spinner"
      src="./assets/loading-spinner.gif"
      v-if="!dataLoaded"
    />
    <div class="body-container" v-if="dataLoaded">
      <div class="chart-row">
        <LineChart
          v-if="
            confirmedCasesConfig.data && confirmedCasesConfig.data.length > 0
          "
          :chartConfig="confirmedCasesConfig"
        />
        <LineChart
          v-if="
            confirmedCasesDeltaConfig.data &&
              confirmedCasesDeltaConfig.data.length > 0
          "
          :chartConfig="confirmedCasesDeltaConfig"
        />
      </div>
      <div class="chart-row">
        <LineChart
          v-if="deathsConfig.data && deathsConfig.data.length > 0"
          :chartConfig="deathsConfig"
        />
        <LineChart
          v-if="deathsDeltaConfig.data && deathsDeltaConfig.data.length > 0"
          :chartConfig="deathsDeltaConfig"
        />
      </div>
      <div class="about-container">
        <h2>About</h2>
        <p>
          The above graphs show data about COVID-19 in the Bay Area. My wife
          wanted a way to track the following data but only for specific
          counties. After looking around on the internet, I only found places
          that graphed data based on all of CA (separated by county) but did not
          allow you to group the county data. In this case, data from the
          following counties are included and summed:
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
            href="https://data.chhs.ca.gov/dataset/california-covid-19-hospital-data-and-case-statistics"
            >California Department of Public Health</a
          >, which publicly exposes this data via a .csv file
          <a
            title="CHHS Covid-19 Data CSV"
            href="https://data.chhs.ca.gov/dataset/6882c390-b2d7-4b9a-aefa-2068cee63e47/resource/6cd8d424-dfaa-4bdd-9410-a3d656e1176e/download/covid19data.csv"
            >here</a
          >.
        </p>
        <h2>Limitations</h2>
        <p>
          The most glaring limitation is that the current datasource only has
          this data as far back as 4/1/20. Other limitations of this app include
          that the regular updating of the CHHS datasource and a consistent data
          format therein. The URL of the datasource is a constant in this
          application, meaning a change would cause data retrieval to break.
          Furthermore, any inconsistencies the underlying datasource may
          experience will, naturally, carry over into this app.
        </p>
        <h2>App Code</h2>
        <p>
          The code for this app can be found in the following
          <a
            title="Github repository"
            href="https://github.com/blubberbo/Covid19BayArea"
            >GitHub repository</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './components/LineChart.vue';

const csvUrl =
  'https://data.chhs.ca.gov/dataset/6882c390-b2d7-4b9a-aefa-2068cee63e47/resource/6cd8d424-dfaa-4bdd-9410-a3d656e1176e/download/covid19data.csv';
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
const chartOptionsDefault = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    onClick: null,
  },
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
        color: 'rgba(60, 186, 159, 0.5)',
        options: chartOptionsDefault,
        labels: [],
        data: [],
      },
      confirmedCasesDeltaConfig: {
        title: 'Confirmed Cases Delta',
        color: 'rgba(60, 186, 159, 0.5)',
        options: chartOptionsDefault,
        labels: [],
        data: [],
      },
      deathsConfig: {
        title: 'Deaths',
        color: 'rgba(142, 94, 162, .5)',
        options: chartOptionsDefault,
        labels: [],
        data: [],
      },
      deathsDeltaConfig: {
        title: 'Deaths Delta',
        color: 'rgba(142, 94, 162, .5)',
        options: chartOptionsDefault,
        labels: [],
        data: [],
      },
      dataLoaded: false,
    };
  },
  // process the data returned by the api
  methods: {
    loadData() {
      // indicate data is loading
      this.dataLoaded = false;
      // retrieve the data from the csv URL
      this.$papa.parse(csvUrl, {
        download: true,
        complete: (data) => {
          // process the data returned
          const processedData = this.processData(data.data);
          this.confirmedCasesConfig.labels = processedData.dates;
          this.confirmedCasesConfig.data = processedData.confirmed;
          this.confirmedCasesDeltaConfig.labels = processedData.dates;
          this.confirmedCasesDeltaConfig.data = processedData.confirmedDelta;
          this.deathsConfig.labels = processedData.dates;
          this.deathsConfig.data = processedData.deaths;
          this.deathsDeltaConfig.labels = processedData.dates;
          this.deathsDeltaConfig.data = processedData.deathsDelta;
          // after all the data has loaded, change the flag
          this.dataLoaded = true;
        },
      });
    },
    processData(data) {
      const datesArray = [];
      const sumConfirmedArray = [];
      const deltaConfirmedArray = [0];
      const sumDeathsArray = [];
      const deltaDeathsArray = [0];
      // remove the first item from the array because it is the definitions
      data.shift();
      // iterate through every item in the array
      data.forEach((originalDataPiece) => {
        // extract the county, date, confirmed cases, and deaths from the original data piece
        const county = originalDataPiece[0];
        // clean the format of the date
        const date = originalDataPiece[1]
          ? this.formatDate(originalDataPiece[1])
          : originalDataPiece[1];
        // in the event either of these are empty strings, insert 0
        const confirmed =
          originalDataPiece[2] && originalDataPiece[2].length > 0
            ? Number(originalDataPiece[2])
            : 0;
        const deaths =
          originalDataPiece[3] && originalDataPiece[3].length > 0
            ? Number(originalDataPiece[3])
            : 0;

        // if the date is valid
        if (date) {
          // only continue is the county is in our list of counties we are tracking
          if (countiesMonitored.includes(county)) {
            // check if the date does not exist in the dates array
            // that means this is the first time we are encountering this date
            const dateIndex = datesArray.indexOf(date);
            // if the index is -1, that means this date's values do not exist
            if (dateIndex === -1) {
              // insert the date, confirmed, and deaths
              datesArray.push(date);
              sumConfirmedArray.push(confirmed);
              sumDeathsArray.push(deaths);
            } else {
              // the index exists
              // so add the value to the previous value at the given index in each array
              sumConfirmedArray[dateIndex] += confirmed;
              sumDeathsArray[dateIndex] += deaths;
            }
          }
        }
      });
      // iterate through the entire sum confirmed array to create the delta array
      for (let sumIndex = 1; sumIndex < sumConfirmedArray.length; sumIndex++) {
        deltaConfirmedArray.push(
          sumConfirmedArray[sumIndex] - sumConfirmedArray[sumIndex - 1],
        );
      }

      // iterate through the entire sum deaths array to create the delta array
      for (let sumIndex = 1; sumIndex < sumDeathsArray.length; sumIndex++) {
        deltaDeathsArray.push(
          sumDeathsArray[sumIndex] - sumDeathsArray[sumIndex - 1],
        );
      }

      return {
        dates: datesArray,
        confirmed: sumConfirmedArray,
        confirmedDelta: deltaConfirmedArray,
        deaths: sumDeathsArray,
        deathsDelta: deltaDeathsArray,
      };
    },
    formatDate(date) {
      let formattedDate = date;
      // if the first character is 0, remove it
      if (formattedDate.charAt(0) === '0') {
        formattedDate = formattedDate.substring(1);
      }
      // remove any 0 after a '/' - this should only be possible with the day
      formattedDate = formattedDate.replace('/0', '/');
      // replace the year 2020 with just 20
      formattedDate = formattedDate.replace('2020', '20');
      // return the formatted date
      return formattedDate;
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

    > .refresh-button {
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
    }
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
      h2 {
        margin-bottom: 0;
        margin-top: 30px;
      }
      p {
        margin-top: 0;
      }
      > .counties-list {
        max-width: 500px;
        margin: 0 auto;
        text-align: left;
        columns: 2;
        -webkit-columns: 2;
        -moz-columns: 2;
      }
    }
  }
}
</style>
