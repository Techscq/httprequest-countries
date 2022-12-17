import { CountriesApiView } from './CountriesApiView.js'
import { CountriesView } from './CountriesView.js'
import { CountryView } from './CountryView.js'

export class CountriesAppView {
    #currentView
    #countriesApiView
    #countries

    constructor() {
        this.#countriesApiView = new CountriesApiView()
        this.#countriesApiView.getAllCountries((countries)=>{
            this.#countries = countries
            this.#renderAllCountries(countries)
        })
        this.#renderFilter()
    }

    #renderAllCountries(countries) {
        this.#currentView = new CountriesView(countries, this.#renderCountry.bind(this))
    }

    #renderFilter() {
        const searchInput = document.createElement('input')
        searchInput.type = 'text'
        searchInput.onkeyup = () => this.#filterCountries(searchInput.value)
        const searchLabel = document.createElement('label')
        searchLabel.innerHTML = 'Filter by Country Name :'
        searchLabel.append(searchInput)
        const filterSection = document.createElement('section')
        filterSection.id = 'filterSection'
        filterSection.append(searchLabel)
        document.getElementById('header').append(filterSection)
    }

    #filterCountries(value) {
        const filteredCountries = this.#countries.filter((country) =>
            country.name.toLowerCase().includes(value.toLowerCase())
        )
        document.getElementById('countriesApp').innerHTML = ''
        this.#renderAllCountries(filteredCountries)
    }

    #renderCountry(country) {
        document.getElementById('filterSection')?.remove()
        this.#currentView = new CountryView(
            {
                name: country.name,
                population: country.population,
                area: country.area,
                flag: country.flag,
                borders: country.borders?.map((countryAbbreviation) => this.#getBorderCountry(countryAbbreviation)),
                density: Math.round(country.population / country.area),
            },
            this.#renderCountry.bind(this),
            () => {
                document.getElementById('filterSection')?.remove()
                this.#renderAllCountries(this.#countries)
                this.#renderFilter()
            },
            this.#loadMoreCountryInfo.bind(this)
        )
    }

    #getBorderCountry(countryAbbreviation) {
        return this.#countries.find((country) => {
            return country.abbreviation === countryAbbreviation
        })
    }

    #loadMoreCountryInfo(countryName, callback) {
        this.#countriesApiView.getCountryExtraInfo(countryName, callback)
    }
}

window.onload = () => {
    new CountriesAppView()
}
