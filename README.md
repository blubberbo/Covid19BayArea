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
