# Covid-19 Bay Area

## Website

If you would like to see the site, please head over to: [https://covid-19-bay-area.netlify.app/](https://covid-19-bay-area.netlify.app/).

## About

The above graphs show data about COVID-19 in the Bay Area. My wife
wanted a way to track the following data but only for specific counties.
After looking around on the internet, I only found places that graphed
data based on all of CA (separated by county) but did not allow you to
group the county data. In this case, data from the following counties
are included and summed:

- Alameda
- Contra Costa
- Marin
- Napa
- San Francisco
- San Joaquin
- San Jose
- San Mateo
- Santa Clara
- Santa Cruz
- Solano
- Sonoma
- Stanislaus

## Datasource

All data presented here is sourced from the [California Department of Public Health](https://data.chhs.ca.gov/dataset/california-covid-19-hospital-data-and-case-statistics"), which publicly exposes this data via a .csv file [here](https://data.chhs.ca.gov/dataset/6882c390-b2d7-4b9a-aefa-2068cee63e47/resource/6cd8d424-dfaa-4bdd-9410-a3d656e1176e/download/covid19data.csv).

## Limitations

The limitations of this app include that the regular updating of the CHHS datasource and a consistent data format therein. The URL of the datasource is a constant in this application, meaning a change would cause data retrieval to break. Furthermore, any inconsistencies the underlying datasource may experience will, naturally, carry over into this app.

## Technologies

This app was built using [Vue.js](https://vuejs.org/) and [Chart.js](https://www.chartjs.org/) and is currently deployed and hosted through [Netlify](https://www.netlify.com/).

## Project setup

```bash
npm install
```

### Compiles and hot-reloads for development

```bash
npm start
```
