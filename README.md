# Covid-19 Bay Area

## Website

If you would like to see the site, please head over to: [https://covid-19-bay-area.netlify.app/](https://covid-19-bay-area.netlify.app/).

## About

The above graphs show data about COVID-19 in certain Bay Area counties (see below).
The data is summed in the first graphs and calculated delta ("New") graphs showing the
rate of change of the summative graphs are provided afterwards. On the delta graphs, a
trendline has been drawn showing the seven day average values to provide a more consistent
representation of the trend and counteracting the sporadic data availability on weekends.
Optionally, you can also compare all Bay Area data with statewide data for all of
California using the button at the top. Bay Area counties are defined here as:

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

All data presented here is sourced from the [California Department of Public Health](https://data.chhs.ca.gov/dataset/california-covid-19-hospital-data-and-case-statistics"), which publicly exposes this data via a public API endpoint [here](https://data.chhs.ca.gov/api/3/action/datastore_search?resource_id=6cd8d424-dfaa-4bdd-9410-a3d656e1176e).

## Limitations

- the current API limits calls to 32,000 results (approximately 20 months of data)
- the underlying datasource format (eg. field names) must remain constant for the app to continue to work
- any inconsistencies or inaccuracies from the underlying datasource will be inherited

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
