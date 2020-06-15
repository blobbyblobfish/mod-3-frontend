console.log("hi")

document.addEventListener("DOMContentLoaded", () => {
    const COCKTAILS_URL = "http://localhost:3000/api/v1/cocktails/"
    const cocktailsContainer = document.querySelector("#cocktails-container")

    function fetchCocktails() {
        fetch(COCKTAILS_URL)
        .then(resp => resp.json())
        .then(json => renderCocktails(json))
    }

    function renderCocktails(cocktails) {
        cocktails.forEach(cocktail => renderCocktail(cocktail))
    }

    function renderCocktail(cocktail) {
        cocktailDiv = document.createElement("div")
        cocktailDiv.className = "cocktail"
        cocktailDiv.innerHTML = `
        <h1>${cocktail.name}</h1>
        <ul>Ingredients: 
        </ul>
        <p>${cocktail.directions}</p>
        `
        cocktailsContainer.append(cocktailDiv)
    }

    fetchCocktails()
})