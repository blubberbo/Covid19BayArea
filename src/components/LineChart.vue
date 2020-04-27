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
  },
  mounted() {
    this.renderChart(
      {
        labels: this.chartConfig.labels,
        datasets: [
          {
            label: this.chartConfig.title,
            backgroundColor: this.chartConfig.color,
            data: this.chartConfig.data,
          },
        ],
      },
      this.chartConfig.options,
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h2 {
  margin-bottom: 0;
  margin-top: 0;
}
.chart-container {
  @media screen and (min-width: 1025px) {
    position: relative;
    height: 40vh;
    width: 48vw;
  }
}
</style>
