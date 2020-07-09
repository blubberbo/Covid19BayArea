# Covid-19 Bay Area

## Website

If you would like to see the site, please head over to: [https://covid-19-bay-area.netlify.app/](https://covid-19-bay-area.netlify.app/).

## About

My wife is a health care worker in the Bay Area and had been looking
for COVID-19 data specifically about Bay Area counties. She was only
able to find data either for all of CA or separated by county; nothing
that grouped the Bay Area counties together. That ask is where this
app originated.

All the above graphs show data about COVID-19 in certain
Bay Area counties (see below). The green graphs show the number of confirmed
COVID-19 cases, while the purple graphs show the number of COVID-19
deaths. The yellow graph shows hospitalizations with confirmed
COVID-19: "This includes all inpatients (including those in ICUs and
Medical/Surgical units), and does not include patients in affiliated
clinics, outpatient departments, emergency departments and overflow
locations awaiting an inpatient bed. As of April 21, 2020, COVID ED
patients were removed from the Hospitalized COVID count and counted
separately” (see [datasource definition](https://data.ca.gov/dataset/covid-19-hospital-data/resource/42d33765-20fd-44b8-a978-b083b7542225)). The red graph shows available
ICU beds: "NICU, PICU, and adult" (see [datasource definition](https://data.ca.gov/dataset/covid-19-hospital-data/resource/42d33765-20fd-44b8-a978-b083b7542225)). On some of the graphs, a trendline
has been drawn showing the seven day average values to provide a
more consistent representation of the trend and counteracting the
sporadic data availability on weekends. Optionally, you can also
toggle data for all of California using the button at the top.

_Note: the yellow and red graphs come from a different underlying
datasource, so their dates may not exactly line up with the other
four graphs._

Bay Area counties are defined here as:

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

_As of 6/29/20: the underlying datasource has changed. A fix has been implemented._

All data presented here is sourced from the [CA.Gov Open Data Portal](https://data.ca.gov/), which publicly exposes this data via two public API endpoints:

- [COVID-19 Cases](https://data.ca.gov/dataset/covid-19-cases/resource/926fd08f-cc91-4828-af38-bd45de97f8c3) - [API endpoint](https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3)
- [COVID-19 Hospital Data](https://data.ca.gov/dataset/covid-19-hospital-data/resource/42d33765-20fd-44b8-a978-b083b7542225) - [API endpoint](https://data.ca.gov/api/3/action/datastore_search?resource_id=42d33765-20fd-44b8-a978-b083b7542225)

## Limitations

- the biggest limitation is the uptime of the underlying Data.Ca.Gov API - if their service goes down, the app will go down
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
