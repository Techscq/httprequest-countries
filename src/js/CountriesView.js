export class CountriesView {
    #countries = []
    #countryCallback

    constructor(countries, countryCallback) {
        if (!countries.length > 0) {
            const noCountries = document.createElement('div')
            noCountries.innerHTML = 'Sorry theres no Country to show try again'
            document.getElementById('countriesApp').append(noCountries)
        } else {
            this.#countryCallback = countryCallback
            countries.forEach((country) => this.#countries.push(country))
            this.#render()
        }
    }

    #render() {
        this.#countries.forEach((country) => {
            const countryElement = this.#createCountryElement(country)
            document.getElementById('countriesApp').append(countryElement)
            countryElement.onclick = () => {
                document.getElementById('countriesApp').innerHTML = ''
                this.#countryCallback(country)
            }
        })
    }

    #createCountryElement(country) {
        const countryElement = document.createElement('article')
        countryElement.id = country.name
        const countryName = document.createElement('h3')
        countryName.innerHTML = country.name
        const countryFlag = document.createElement('img')
        countryFlag.src = country.flag
        countryElement.append(countryName, countryFlag)
        return countryElement
    }
}
