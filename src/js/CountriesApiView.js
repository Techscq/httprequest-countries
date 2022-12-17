export class CountriesApiView {
    #httpRequest = new XMLHttpRequest()
    getAllCountries(setCountriesCallback) {
        this.#request('all', () => this.#receiveCountries(setCountriesCallback))
    }

    #request(params, callback) {
        this.#httpRequest.open('get', encodeURI(`https://restcountries.com/v3.1/${params}`), true)
        this.#httpRequest.responseType = 'json'
        this.#httpRequest.onload = callback
        this.#httpRequest.send()
    }

    #receiveCountries(setCountriesCallback) {
        if (this.#httpRequest.status !== 200) {
            return {}
        }
        const thatCountries = this.#httpRequest.response.map((country) => {
            return {
                abbreviation: country.cca3,
                name: country.name.common,
                flag: country.flags.svg,
                population: country.population,
                area: country.area,
                borders: country.borders,
                density: Math.round(country.population / country.area),
            }
        })
        setCountriesCallback(thatCountries)
    }

    getCountryExtraInfo(countryName, extraInfoCallback) {
        this.#request(`name/${countryName}`, () => this.#receiveCountryExtraInfo(extraInfoCallback))
    }

    #receiveCountryExtraInfo(extraInfoCallback) {
        if (this.#httpRequest.status !== 200) {
            return {}
        }

        extraInfoCallback({
            currencies: this.#httpRequest.response[0].currencies,
            capital: this.#httpRequest.response[0].capital,
            region: this.#httpRequest.response[0].region,
            subregion: this.#httpRequest.response[0].subregion,
            languages: this.#httpRequest.response[0].languages,
            mapCoors: this.#httpRequest.response[0].capitalInfo.latlng,
            continents: this.#httpRequest.response[0].continents,
        })
    }
}
