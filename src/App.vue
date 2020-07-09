<template>
  <div id="app">
    <div class="header-container">
      <h1>COVID-19 Bay Area Data</h1>
      <button
        v-on:click="includeCA = includeCA ? false : true"
        alt="Toggle California Button"
        class="button"
        v-if="dataLoaded && !apiError"
        :disabled="!dataLoaded"
      >
        {{ !includeCA ? 'Show CA Data' : 'Bay Area Only' }}
      </button>
    </div>
    <div class="refresh-data-container" v-if="!dataLoaded && apiError">
      <span class="error">
        It looks like the Data.CA.Gov API is down, please refresh the data. If
        the error persists, we will have to wait until the Data.CA.Gov service
        comes back up.
      </span>
      <br />
      <button
        v-on:click="loadData()"
        alt="Refresh Button"
        class="button refresh-button"
      >
        Refresh
      </button>
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

    <div class="body-container">
      <div class="chart-row" v-if="dataLoaded">
        <LineChart
          :chart-config="confirmedCasesConfig"
          :include-california="includeCA"
        />
        <LineChart
          :chart-config="confirmedCasesDeltaConfig"
          :include-california="includeCA"
        />
      </div>
      <div class="chart-row" v-if="dataLoaded">
        <LineChart
          :chart-config="deathsConfig"
          :include-california="includeCA"
        />
        <LineChart
          :chart-config="deathsDeltaConfig"
          :include-california="includeCA"
        />
      </div>
      <div class="chart-row" v-if="dataLoaded">
        <LineChart
          :chart-config="hospitalizedConfirmedConfig"
          :include-california="includeCA"
        />
        <LineChart
          :chart-config="availableIcuBedsConfig"
          :include-california="includeCA"
        />
      </div>
      <div class="about-container" v-if="dataLoaded || apiError">
        <h2>About</h2>
        <p>
          My wife is a health care worker in the Bay Area and had been looking
          for COVID-19 data specifically about Bay Area counties. She was only
          able to find data either for all of CA or separated by county; nothing
          that grouped the Bay Area counties together. That ask is where this
          app originated.
        </p>
        <p>
          All the above graphs show data about COVID-19 in certain Bay Area
          counties (see below). The green graphs show the number of confirmed
          COVID-19 cases, while the purple graphs show the number of COVID-19
          deaths. The yellow graph shows hospitalizations with confirmed
          COVID-19: "This includes all inpatients (including those in ICUs and
          Medical/Surgical units), and does not include patients in affiliated
          clinics, outpatient departments, emergency departments and overflow
          locations awaiting an inpatient bed. As of April 21, 2020, COVID ED
          patients were removed from the Hospitalized COVID count and counted
          separately” (see
          <a
            href="https://data.ca.gov/dataset/covid-19-hospital-data/resource/42d33765-20fd-44b8-a978-b083b7542225"
            target="_blank"
            title="Hospitals By County Data Definition"
            >datasource definition</a
          >). The red graph shows available ICU beds: "NICU, PICU, and adult"
          (see
          <a
            href="https://data.ca.gov/dataset/covid-19-hospital-data/resource/42d33765-20fd-44b8-a978-b083b7542225"
            target="_blank"
            title="Hospitals By County Data Definition"
            >datasource definition</a
          >). On some of the graphs, a trendline has been drawn showing the
          seven day average values to provide a more consistent representation
          of the trend and counteracting the sporadic data availability on
          weekends. Optionally, you can also toggle data for all of California
          using the button at the top.
        </p>
        <p>
          <i
            >Note: the yellow and red graphs come from a different underlying
            datasource, so their dates may not exactly line up with the other
            four graphs.</i
          >
        </p>
        <p>Bay Area counties are defined here as:</p>
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
          <i>
            As of 6/29/20: the underlying datasource has changed. A fix has been
            implemented.
          </i>
        </p>
        <p>
          All data presented here is sourced from the
          <a
            title="CA.Gov Open Data Portal"
            target="_blank"
            href="https://data.ca.gov/"
            >CA.Gov Open Data Portal</a
          >, which publicly exposes this data via two public API endpoints:
        </p>
        <ul class="api-endpoint-list">
          <li>
            <a
              title="CA.Gov Open Data Portal COVID-19 Cases"
              target="_blank"
              href="https://data.ca.gov/dataset/covid-19-cases/resource/926fd08f-cc91-4828-af38-bd45de97f8c3"
              >COVID-19 Cases</a
            >
            -
            <a
              title="CA.Gov Open Data Portal Covid-19 Data API endpoint"
              target="_blank"
              href="https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3"
              >API endpoint</a
            >
          </li>
          <li>
            <a
              title="CA.Gov Open Data Portal COVID-19 Hospital Data"
              target="_blank"
              href="https://data.ca.gov/dataset/covid-19-cases/resource/42d33765-20fd-44b8-a978-b083b7542225"
              >COVID-19 Hospital Data</a
            >
            -
            <a
              title="CA.Gov Open Data Portal COVID-19 Hospital Data API endpoint"
              target="_blank"
              href="https://data.ca.gov/api/3/action/datastore_search?resource_id=42d33765-20fd-44b8-a978-b083b7542225"
              >API endpoint</a
            >
          </li>
        </ul>
        <h2>Limitations</h2>
        <ul class="limitations-list">
          <li>
            the biggest limitation is the uptime of the underlying Data.Ca.Gov
            API - if their service goes down, the app will go down
          </li>
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
            >GitHub repository</a
          >.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import LineChart from './components/LineChart.vue';

import {
  baseApiUrl,
  covid19CasesResourceId,
  hospitalDataResourceId,
} from './constants/api.constants';

import {
  confirmedCasesConfig,
  confirmedCasesDeltaConfig,
  deathsConfig,
  deathsDeltaConfig,
  hospitalizedConfirmedConfig,
  availableIcuBedsConfig,
} from './constants/chart-configs.constants';

import processRecords from './functions/process-records';

export default {
  name: 'App',
  components: {
    LineChart,
  },
  data() {
    return {
      confirmedCasesConfig,
      confirmedCasesDeltaConfig,
      deathsConfig,
      deathsDeltaConfig,
      hospitalizedConfirmedConfig,
      availableIcuBedsConfig,
      dataLoaded: false,
      apiError: false,
      includeCA: false,
      dataLoadingIsDelayed: false,
    };
  },
  // process the data returned by the api
  methods: {
    async loadData() {
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

      // declare constants for both the covidRecords and the hospitalData
      let covidRecords;
      let hospitalData;

      // chain the api calls together to happen async but await all of them
      await Promise.all([
        fetch(`${baseApiUrl}${covid19CasesResourceId}`, { cache: 'no-store' }),
        fetch(`${baseApiUrl}${hospitalDataResourceId}`, { cache: 'no-store' }),
      ])
        .then(async ([covid19Response, hospitalDataResponse]) => {
          // pass the responses on to the local variables
          const covidRecordsJson = await covid19Response.json();
          covidRecords = covidRecordsJson.result.records;
          const hospitalDataJson = await hospitalDataResponse.json();
          hospitalData = hospitalDataJson.result.records;
          return [covidRecords, hospitalData];
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

      // process both sets of data returned
      const processedData = processRecords(covidRecords, hospitalData);

      // extract the covid data from the processed data
      this.confirmedCasesConfig.labels = processedData.covidData.dates;
      this.confirmedCasesConfig.data = processedData.covidData.confirmed;
      this.confirmedCasesConfig.dataBayArea =
        processedData.covidData.confirmedBayArea;
      this.confirmedCasesDeltaConfig.labels = processedData.covidData.dates;
      this.confirmedCasesDeltaConfig.data =
        processedData.covidData.confirmedDelta;
      this.confirmedCasesDeltaConfig.sevenDayAvg =
        processedData.covidData.confirmedDeltaSevenDayAvg;
      this.confirmedCasesDeltaConfig.dataBayArea =
        processedData.covidData.confirmedDeltaBayArea;
      this.confirmedCasesDeltaConfig.sevenDayAvgBayArea =
        processedData.covidData.confirmedDeltaSevenDayAvgBayArea;
      this.deathsConfig.labels = processedData.covidData.dates;
      this.deathsConfig.data = processedData.covidData.deaths;
      this.deathsConfig.dataBayArea = processedData.covidData.deathsBayArea;
      this.deathsDeltaConfig.labels = processedData.covidData.dates;
      this.deathsDeltaConfig.data = processedData.covidData.deathsDelta;
      this.deathsDeltaConfig.sevenDayAvg =
        processedData.covidData.deathsDeltaSevenDayAvg;
      this.deathsDeltaConfig.dataBayArea =
        processedData.covidData.deathsDeltaBayArea;
      this.deathsDeltaConfig.sevenDayAvgBayArea =
        processedData.covidData.deathsDeltaSevenDayAvgBayArea;

      // extract the hospital data from the processed data
      this.hospitalizedConfirmedConfig.labels =
        processedData.hospitalData.dates;
      this.hospitalizedConfirmedConfig.data =
        processedData.hospitalData.hospitalizedConfirmed;
      this.hospitalizedConfirmedConfig.sevenDayAvg =
        processedData.hospitalData.hospitalizedConfirmedSevenDayAvg;
      this.hospitalizedConfirmedConfig.dataBayArea =
        processedData.hospitalData.hospitalizedConfirmedBayArea;
      this.hospitalizedConfirmedConfig.sevenDayAvgBayArea =
        processedData.hospitalData.hospitalizedConfirmedSevenDayAvgBayArea;
      this.availableIcuBedsConfig.labels = processedData.hospitalData.dates;
      this.availableIcuBedsConfig.data =
        processedData.hospitalData.availableIcuBeds;
      this.availableIcuBedsConfig.sevenDayAvg =
        processedData.hospitalData.availableIcuBedsSevenDayAvg;
      this.availableIcuBedsConfig.dataBayArea =
        processedData.hospitalData.availableIcuBedsBayArea;
      this.availableIcuBedsConfig.sevenDayAvgBayArea =
        processedData.hospitalData.availableIcuBedsSevenDayAvgBayArea;

      // after all the data has loaded, change the flag
      this.dataLoaded = true;
      // in the event the delayedTimeout has not been triggered yet, stop it
      clearTimeout(delayedTimeout);
      // since the loading has completed, it is no longer delayed as well
      this.dataLoadingIsDelayed = false;
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
