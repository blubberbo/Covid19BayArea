<template>
  <div>
    <h2>{{ chartConfig.title }}</h2>
    <div class="chart-container">
      <canvas ref="canvas" width="900" height="400"></canvas>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  name: 'LineChart',
  props: {
    chartConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    includeCalifornia: {},
  },
  watch: {
    includeCalifornia() {
      // reload the charts, toggling the CA data
      this.loadCharts(this.includeCalifornia);
    },
  },
  methods: {
    loadCharts(includeCA = false) {
      // create the datasets array to build the chart from
      // at the beginning, this should include just the Bay Area data, which we always want
      const datasets = [
        {
          label: 'Bay Area',
          backgroundColor: this.chartConfig.colorBayArea,
          data: this.chartConfig.dataBayArea,
        },
      ];
      // if a seven day avg bay area was passed in
      if (this.chartConfig.sevenDayAvgBayArea) {
        datasets.push({
          ...this.chartConfig.sevenDaysAvgOptions,
          label: 'Seven Day Avg Trend',
          data: this.chartConfig.sevenDayAvgBayArea,
        });
      }
      // if we are meant to include the data for California
      if (includeCA) {
        // add the California data to the datasets array
        datasets.push({
          label: 'CA',
          backgroundColor: this.chartConfig.color,
          data: this.chartConfig.data,
        });
        // if a seven day avg was passed in
        if (this.chartConfig.sevenDayAvg) {
          datasets.push({
            ...this.chartConfig.sevenDaysAvgOptions,
            label: 'Seven Day Avg Trend CA',
            data: this.chartConfig.sevenDayAvg,
          });
        }
      }
      this.renderChart(
        {
          labels: this.chartConfig.labels,
          datasets,
        },
        this.chartConfig.options,
      );
    },
  },
  mounted() {
    // when the component is created, load the charts w/o the CA data
    this.loadCharts(false);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h2 {
  margin-bottom: 0;
  margin-top: 0;

  @media screen and (max-width: 1024px) {
    margin-top: 30px;
  }
}
.chart-container {
  @media screen and (min-width: 1025px) {
    position: relative;
    height: 40vh;
    width: 48vw;
  }
}
</style>
