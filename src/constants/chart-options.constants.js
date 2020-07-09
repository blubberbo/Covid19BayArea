const confirmedBayAreaChartColor = 'rgba(60, 186, 159, .5)';
const deathsBayAreaChartColor = 'rgba(142, 94, 162, .5)';
const hospitalizedConfirmedChartColor = 'rgba(255, 248, 39, 0.5)';
const availableIcuBedsChartColor = 'rgba(255, 99, 132, 0.5)';
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

export {
  confirmedBayAreaChartColor,
  deathsBayAreaChartColor,
  hospitalizedConfirmedChartColor,
  availableIcuBedsChartColor,
  californiaChartColor,
  chartOptionsDefault,
  sevenDayAvgChartOptionsDefault,
};
