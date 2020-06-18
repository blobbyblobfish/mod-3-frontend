document.addEventListener("DOMContentLoaded", () => {
    const COCKTAILS_URL = "http://localhost:3000/api/v1/cocktails"
    const INGREDIENTS_URL = "http://localhost:3000/api/v1/ingredients"
    const cocktailsContainer = document.querySelector("#cocktails-container")
    const searchBar = document.getElementById("search-bar")
    const cocktailsArray = []

    function fetchCocktails() {
        fetch(COCKTAILS_URL)
        .then(resp => resp.json())
        .then(json => renderCocktails(json))
        .catch(error => console.log(error.message))
    }

    function renderCocktails(cocktails) {
        cocktails.forEach(cocktail => renderCocktail(cocktail))
    }

    function renderCocktail(cocktail) {
        cocktailsArray.push(cocktail)
        
        cocktailDiv = document.createElement("div")
        cocktailDiv.className = "cocktail"
        cocktailDiv.dataset.id = `${cocktail.id}`
        cocktailDiv.innerHTML = `
        <button class="delete-button" data-cocktail=${cocktail.id}>Delete Cocktail</button>
        <button class="edit-button" data-cocktail=${cocktail.id} data-status="closed">Edit Cocktail</button>
        <h1>${cocktail.name}</h1>
        <img src = ${cocktail.image_url} alt="${cocktail.name}">
        <br>
        <ul>${renderIngredients(cocktail)}
        </ul>
        <div class ="ingredients-inputs"></div>
        <p>${cocktail.directions}</p>
        <button type="button" data-status="closed" class="add-ingredient-button">+ Add Ingredient</button>
        `
        cocktailsContainer.append(cocktailDiv)
    }

    function renderIngredients(cocktail) {
        ingredientList = ""

        cocktail.ingredients.forEach(
            (ingredient) => {
                ingredientList = ingredientList + `<li data-id=${ingredient.id}><button> - </button> ${ingredient.name}</li>`
            }
        )
        return ingredientList
    }

    //Add Form
    function renderCocktailAddForm() {        
        const form = document.createElement("form")
        form.className = "add-cocktail-form"
        form.innerHTML = `
        <label>Cocktail</label>
        <input type="text" placeholder="name..." name="name">
        <label>Image</label>
        <input type="text" placeholder="url..." name="image_url">
        <label>Directions</label>
        <input type="text" placeholder="step 1...step 2..." name="directions">
        <br>

        <br>
        <input type="submit">
        <button type="button" class="cancel-button" id="cancel-add-cocktail">cancel</button>
        `
        cocktailsContainer.prepend(form)
    }
    
    function renderIngredientInput(cocktailDiv) {
        const inputs = document.createElement("form")
        inputs.className = "ingredients-inputs"
        inputs.innerHTML = `<label>Ingredient</label>
        <input type="text" placeholder="2.5 oz lime juice..." name="name">
        <input type="submit">
        <button type="button" class="cancel-button" id="cancel-ingredient">cancel</button>
        `
        const ingredientsInputs = cocktailDiv.querySelector(".ingredients-inputs")
        ingredientsInputs.append(inputs)
    }

    //Edit Form
    function renderEditForm(id, cocktailDiv) {
        const form = document.createElement("form")
        form.className = "edit-form"

        fetch(`${COCKTAILS_URL}/${id}`)
            .then(resp => resp.json())
            .then((cocktail) => {
                form.innerHTML = `
                <label>Cocktail</label>
                <input type="text" value="${cocktail.name}" name="name">
                <label>Image</label>
                <input type="text" value="${cocktail.image_url}" name="image_url">
                <label>Directions</label>
                <input type="text" value="${cocktail.directions}" name="directions">

                <input type="submit">
                <button type="button" class="cancel-button" id="cancel-edit">cancel</button>
                `
            })
            .catch(error => console.log(error.message))
        
        cocktailDiv.append(form)
    }

    //Create
    function createCocktail(cocktail) {
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(cocktail)
        }

        fetch(COCKTAILS_URL, configObj)
            .then(resp => resp.json())
            .then(cocktail => renderCocktail(cocktail))
            .catch(error => console.log(error.message))
    }

    function createIngredient(ingredient, cocktailDiv) {
        const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(ingredient)
        }

        fetch(INGREDIENTS_URL, configObj)
            .then(resp => resp.json())
            .then(ingredient => renderIngredient(ingredient, cocktailDiv))
            .catch(error => console.log(error.message))
    }

    function renderIngredient(ingredient, cocktailDiv) {
        const ingredientList = cocktailDiv.querySelector("ul")
        const ingredientLi = document.createElement("li")
        ingredientLi.innerHTML = `${ingredient.name}`

        ingredientList.append(ingredientLi)
    }

    //Delete
    function deleteCocktail(id, cocktailDiv) {
        fetch(`${COCKTAILS_URL}/${id}`, {
            method: "DELETE"
        })
        .then(cocktailDiv.remove())
        .catch(error => console.log(error.message))
    }

    function deleteIngredient(id, ingredientLi) {
        const configObj = {
            method: "DELETE"
        }

        fetch(`${INGREDIENTS_URL}/${id}`, configObj)
            .then(ingredientLi.remove())
            .catch(error => console.log(error.message))
    }

    //Listeners
    function addSubmitListener() {
        document.addEventListener("submit", (e) => {
            e.preventDefault()

            if (e.target.className === "add-cocktail-form") {
                const name = e.target.name.value
                const image_url = e.target.image_url.value
                const directions = e.target.directions.value
                const cocktail = {
                    name: name,
                    image_url: image_url,
                    directions: directions
                }

                createCocktail(cocktail)

                e.target.name.value = ""
                e.target.image_url.value = ""
                e.target.directions.value = ""
            }

            else if (e.target.className === "ingredients-inputs") {
                const name = e.target.name.value
                const cocktailDiv = e.target.parentNode.parentNode
                const cocktailId = cocktailDiv.dataset.id
                
                const ingredient = {
                    name: name,
                    cocktail_id: cocktailId
                }

                createIngredient(ingredient, cocktailDiv)

                e.target.name.value = ""
            }

            else if (e.target.className === "edit-form") {
                console.log("edit")
            }
        })
    }

    function addClickListener() {
        document.addEventListener("click", (e) => {
            if (e.target.className === "add-button" && e.target.dataset.status === "closed") {
                renderCocktailAddForm()
                e.target.dataset.status = "opened"
            }

            else if (e.target.textContent === "cancel" && e.target.id === "cancel-add-cocktail") {
                document.querySelector(".add-button").dataset.status = "closed"
                e.target.parentNode.remove()
            }

            else if (e.target.className === "edit-button" && e.target.dataset.status === "closed") {
                const id = e.target.dataset.cocktail
                const cocktailDiv = e.target.parentNode
                renderEditForm(id, cocktailDiv)
                e.target.dataset.status = "opened"
            }
                
            else if (e.target.textContent === "cancel" && e.target.id === "cancel-edit") {
                e.target.parentNode.parentNode.querySelector(".edit-button").dataset.status = "closed"
                e.target.parentNode.remove()
            }
                
            else if (e.target.className === "delete-button") {
                const id = e.target.dataset.cocktail
                const cocktailDiv = e.target.parentNode
                deleteCocktail(id, cocktailDiv)
            }

            else if (e.target.textContent === "+ Add Ingredient" && e.target.dataset.status === "closed") {
                const cocktailDiv = e.target.parentNode
                renderIngredientInput(cocktailDiv)
                e.target.dataset.status = "opened"
            }

            else if (e.target.textContent === "cancel" && e.target.id === "cancel-ingredient") {
                e.target.parentNode.parentNode.parentNode.querySelector(".add-ingredient-button").dataset.status = "closed"
                e.target.parentNode.remove()
            }

            else if (e.target.textContent === " - ") {
                const id = e.target.parentNode.dataset.id
                const ingredientLi = e.target.parentNode

                deleteIngredient(id, ingredientLi)
            }

            else if (e.target.textContent === "Back to Index") {
                cocktailsContainer.innerHTML = `<button class="add-button" data-status="closed">+ Add Cocktail</button><br><br>`       
                
                const uniqueCocktailsArray = Array.from(new Set(cocktailsArray))
                
                renderCocktails(uniqueCocktailsArray)
            }
        })
    }

    //Search Bar
    searchBar.addEventListener("submit", (e) => {
        const searchString = e.target.textinput.value
        const filteredCocktailsNames = []
        const filteredCocktailsIngredients = []

        //Split the searchString
        const csv = searchString.split(",")

        //Filter 
        for (let x = 0; x < csv.length; x++) {
            const nameFilter = cocktailsArray.filter(cocktail => cocktail.name.toLowerCase().includes(csv[x].toLowerCase()))

            if (nameFilter.length > 0) {
                for (let y = 0; y < nameFilter.length; y++) {
                filteredCocktailsNames.push(nameFilter[y])
                }
            }
            
            cocktailsArray.forEach(cocktail =>{
                cocktail.ingredients.forEach(ingredient => {
                    if(ingredient.name.toLowerCase().includes(csv[x].toLowerCase())){
                        filteredCocktailsIngredients.push(cocktail)
                    }
                })
            })
        }
        
        //Combine the results
        const filteredCocktails = filteredCocktailsNames.concat(filteredCocktailsIngredients)
        const uniqueSet = new Set(filteredCocktails)
        const uniqueFilteredCocktails = [...uniqueSet]

        debugger

        //Render to the page
        cocktailsContainer.innerHTML = `<div class="cocktail-buttons"><button class="add-button" data-status="closed">+ Add Cocktail</button><button class="back-button">Back to Index</button><br><br></div>`       
        renderCocktails(uniqueFilteredCocktails)
    })

    fetchCocktails()
    addSubmitListener()
    addClickListener()
})