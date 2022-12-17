export class CountryView {
    #country

    constructor(country, borderCallback, homeCallback, loadMoreCallback) {
        this.#country = country
        this.#render(borderCallback, homeCallback, loadMoreCallback)
    }

    #render(borderCallback, homeCallback, loadMoreCallback) {
        const countryElement = document.createElement('div')
        countryElement.id = 'countryInfo'
        const [controlSection, titleSection, imgSection, infoSection, mapSection, bordersSection] =
            this.#getSections(countryElement)
        this.#createNavigationControls(homeCallback, controlSection)
        titleSection.append(this.#createElement('h1', this.#country.name))
        const img = document.createElement('img')
        img.src = this.#country.flag
        imgSection.append(img)
        this.#createInfoElements(infoSection)
        this.#createLoadMoreButton(loadMoreCallback, infoSection)
        this.#createBordersElements(borderCallback, bordersSection)
        document.getElementById('countriesApp').append(countryElement)
    }

    #getSections(countryElement) {
        let sections = [
            'controlSection',
            'titleSection',
            'imgSection',
            'infoSection',
            'mapSection',
            'bordersSection',
        ]
        return sections.map((section, key) => {
            const sectionElement = document.createElement('section')
            sectionElement.id = section
            countryElement.append(sectionElement)
            return sectionElement
        })
    }

    #createNavigationControls(homeCallback, controlSection) {
        const goHome = this.#createElement('button', `<< back To Countries`)
        goHome.onclick = () => {
            document.getElementById('countriesApp').innerHTML = ''
            homeCallback()
        }
        controlSection.append(goHome)
    }

    #createElement(elementType, html) {
        const element = document.createElement(elementType)
        element.innerHTML = html
        return element
    }

    #createInfoElements(infoSection) {
        infoSection.append(
            this.#createElement('h2', `Country Information`),
            this.#createElement('div', `Population: ${this.#country.population}`),
            this.#createElement('div', `Area: ${this.#country.area} km2`),
            this.#createElement('div', `Density: ${this.#country.density} Persons / km2`)
        )
    }

    #createLoadMoreButton(loadMoreCallback, moreInfoSection) {
        const loadMoreButton = document.createElement('button')
        loadMoreButton.id = 'loadMoreButton'
        loadMoreButton.innerText = 'Load more info'
        loadMoreButton.onclick = () => {
            loadMoreButton.disabled = true
            loadMoreCallback(this.#country.name, this.#renderMoreInfo.bind(this))
        }
        moreInfoSection.append(loadMoreButton)
    }

    #createBordersElements(borderCallback, bordersSection) {
        bordersSection.append(this.#createElement('h2', `Borders`))
        if (this.#country.borders) {
            this.#country.borders.forEach((border) => {
                this.#getBorderElement(border, borderCallback, bordersSection)
            })
        } else {
            bordersSection.append(this.#createElement('div', 'No borders'))
        }
    }

    #getBorderElement(border, borderCallback, bordersSection) {
        const borderElement = document.createElement('div')
        borderElement.onclick = () => {
            document.getElementById('countriesApp').innerHTML = ''
            borderCallback(border)
        }
        const img = document.createElement('img')
        img.src = border.flag
        borderElement.append(this.#createElement('h4', border.name), img)
        bordersSection.append(borderElement)
    }

    #renderMoreInfo(countryExtraInformation) {
        if (countryExtraInformation) {
            document.getElementById('loadMoreButton').remove()
            const infoElements = this.#getInfoElements(countryExtraInformation)
            this.#getInfoSubElements(infoElements.capital, countryExtraInformation.capital)
            this.#getInfoSubElements(infoElements.languages, countryExtraInformation.languages)
            this.#getInfoSubElements(infoElements.continents, countryExtraInformation.continents)
            this.#getInfoSubElements(infoElements.currencies, countryExtraInformation.currencies)
            for (let infoElementsKey in infoElements) {
                document.getElementById('infoSection').append(infoElements[infoElementsKey])
            }
            this.#getCountryMap(countryExtraInformation.mapCoors)
        } else {
            document.getElementById('loadMoreButton').disabled = false
        }
    }

    #getInfoElements(countryExtraInformation) {
        return {
            capital: this.#createElement('div', `Capital:`),
            region: this.#createElement('div', `Region : ${countryExtraInformation.region}`),
            subregion: this.#createElement(
                'div',
                `SubRegion : ${countryExtraInformation.subregion}`
            ),
            languages: this.#createElement('div', `Country languages:`),
            continents: this.#createElement('div', `Continent:`),
            currencies: this.#createElement('div', `Country currencies:`),
        }
    }

    #getInfoSubElements(appendTo, item) {
        for (const itemKey in item) {
            appendTo.append(
                this.#createElement('div', item[itemKey].name ? item[itemKey].name : item[itemKey])
            )
        }
    }

    #getCountryMap(countryMapCoors) {
        const mapIframe = document.createElement('iframe')
        mapIframe.src = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d9882626.984163161!2d${countryMapCoors[1]}!3d${countryMapCoors[0]}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2suk!4v1486486434098`
        mapIframe.loading = 'lazy'
        mapIframe.referrerPolicy = 'no-referrer-when-downgrade'
        document.getElementById('mapSection').append(mapIframe)
    }
}
