import {
  confirmedBayAreaChartColor,
  deathsBayAreaChartColor,
  hospitalizedConfirmedChartColor,
  availableIcuBedsChartColor,
  californiaChartColor,
  chartOptionsDefault,
  sevenDayAvgChartOptionsDefault,
} from './chart-options.constants';

const confirmedCasesConfig = {
  title: 'Total Covid-19 Cases',
  color: californiaChartColor,
  colorBayArea: confirmedBayAreaChartColor,
  options: chartOptionsDefault,
  labels: [],
  data: [],
};
const confirmedCasesDeltaConfig = {
  title: 'Covid-19 Cases Per Day',
  color: californiaChartColor,
  colorBayArea: confirmedBayAreaChartColor,
  options: chartOptionsDefault,
  sevenDaysAvgOptions: sevenDayAvgChartOptionsDefault,
  labels: [],
  data: [],
};
const deathsConfig = {
  title: 'Total Covid-19 Deaths',
  color: californiaChartColor,
  colorBayArea: deathsBayAreaChartColor,
  options: chartOptionsDefault,
  labels: [],
  data: [],
};
const deathsDeltaConfig = {
  title: 'Covid-19 Deaths Per Day',
  color: californiaChartColor,
  colorBayArea: deathsBayAreaChartColor,
  options: chartOptionsDefault,
  sevenDaysAvgOptions: sevenDayAvgChartOptionsDefault,
  labels: [],
  data: [],
};
const hospitalizedConfirmedConfig = {
  title: 'Hospitalized Confirmed Cases Per Day',
  color: californiaChartColor,
  colorBayArea: hospitalizedConfirmedChartColor,
  options: chartOptionsDefault,
  labels: [],
  data: [],
};
const availableIcuBedsConfig = {
  title: 'Available ICU Beds By Day',
  color: californiaChartColor,
  colorBayArea: availableIcuBedsChartColor,
  options: chartOptionsDefault,
  labels: [],
  data: [],
};

export {
  confirmedCasesConfig,
  confirmedCasesDeltaConfig,
  deathsConfig,
  deathsDeltaConfig,
  hospitalizedConfirmedConfig,
  availableIcuBedsConfig,
};
