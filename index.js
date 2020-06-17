document.addEventListener("DOMContentLoaded", () => {
    const COCKTAILS_URL = "http://localhost:3000/api/v1/cocktails"
    const INGREDIENTS_URL = "http://localhost:3000/api/v1/ingredients"
    const cocktailsContainer = document.querySelector("#cocktails-container")
    let ingredientCounter = 1

    function fetchCocktails() {
        fetch(COCKTAILS_URL)
        .then(resp => resp.json())
        .then(json => renderCocktails(json))
        .catch(error => console.log(error.message))
    }

    const cocktailsArray = []

    function renderCocktails(cocktails) {
        cocktails.forEach(cocktail => renderCocktail(cocktail))
    }

    function renderCocktail(cocktail) {
        cocktailsArray.push(cocktail)                 //--------//**Array for Search Bar**//--------//
        cocktailDiv = document.createElement("div")
        cocktailDiv.className = "cocktail"
        cocktailDiv.innerHTML = `
        <h1>${cocktail.name}</h1>
        <img src = ${cocktail.image_url} alt="${cocktail.name}">
        <ul>${renderIngredients(cocktail)}
        </ul>
        <p>${cocktail.directions}</p>
        <button class="edit-button" data-cocktail=${cocktail.id} data-status="closed">Edit Cocktail</button>
        <button class="delete-button" data-cocktail=${cocktail.id}>Delete Cocktail</button>
        `
        cocktailsContainer.append(cocktailDiv)
    }

    function renderIngredients(cocktail) {
        ingredientList = ""

        cocktail.ingredients.forEach(
            (ingredient) => {
                ingredientList = ingredientList + `<li>${ingredient.name}</li>`
            }
        )
        return ingredientList
    }

    //Add Form
    function renderAddForm() {        
        const form = document.createElement("form")
        form.className = "add-form"
        form.innerHTML = `
        <label>Cocktail</label>
        <input type="text" placeholder="name..." name="name">
        <label>Image</label>
        <input type="text" placeholder="url..." name="image_url">
        <label>Directions</label>
        <input type="text" placeholder="step 1...step 2..." name="directions">
        <br>
        <div class="ingredients-inputs">
        <label>Ingredients</label>
        <input type="text" placeholder="1 oz gin..." name="ingredient1">
        </div>
        <button type="button" data-num=1>+ Add Another Ingredient</button>

        <br>
        <input type="submit">
        `
        cocktailsContainer.prepend(form)
    }
    
    function renderIngredientInput(num) {
        const div = document.createElement("div")
        div.className = "ingredients-inputs"
        div.innerHTML = `<label>Ingredients</label>
        <input type="text" placeholder="2.5 oz lime juice..." name="ingredient${num}">
        `

        const ingredientsInputs = document.querySelectorAll(".ingredients-inputs")
        const lastInput = ingredientsInputs.length - 1
        ingredientsInputs[lastInput].append(div)
        ingredientCounter = ingredientCounter + 1
        console.log(ingredientCounter)

    }

    //Edit Form
    function renderEditForm(id, cocktailDiv) {
        const form = document.createElement("form")
        form.className = "edit-form"

        fetch(`${COCKTAILS_URL}/${id}`)
            .then(resp => resp.json())
            .then((cocktail) => {

                function cocktailIngredients() {
                    innerHTML = "<label>Ingredients</label>"

                    cocktail.ingredients.forEach((ingredient) => {
                        innerHTML = innerHTML + `<input type="text" value="${ingredient.name}" ingredient=${ingredient.id} cocktail=${ingredient.cocktail_id}>`
                    })

                    return innerHTML
                }

                form.innerHTML = `
                    <label>Cocktail</label>
                    <input type="text" value="${cocktail.name}" name="name">
                    <label>Image</label>
                    <input type="text" value="${cocktail.image_url}" name="image_url">
                    <label>Directions</label>
                    <input type="text" value="${cocktail.directions}" name="directions">
                    <div class="ingredients-inputs">
                    ${cocktailIngredients()}
                    </div>

                    <button type="button">+ Add Another Ingredient</button>
                    <input type="submit">
                    `
            })
            .catch(error => console.log(error.message))
        
        cocktailDiv.append(form)
    }

    //Create
    function fetchCreateCocktail(cocktail, ingredients) {
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
            .then(cocktail => fetchCreateIngredients(cocktail, ingredients))
            .catch(error => console.log(error.message))
    }

    function fetchCreateIngredients(cocktail, ingredients) {
        ingredients.forEach(ingredient => {
            const ingredientObj = {
                name: ingredient,
                cocktail_id: cocktail.id
            }

           const configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(ingredientObj)
           }
                        
            fetch(INGREDIENTS_URL, configObj)
                .then(resp => resp.json())
                .catch(error => console.log(error.message))
        })

        renderNewCocktail(cocktail.id)
    }

    function renderNewCocktail(id) {
        fetch(`${COCKTAILS_URL}/${id}`)
            .then(resp => resp.json())
            .then(json => renderCocktail(json))
            .catch(error => console.log(error.message))
    }

    //Delete
    function deleteCocktail(id, cocktailDiv) {
        fetch(`${COCKTAILS_URL}/${id}`, {
            method: "DELETE"
        })
        .then(cocktailDiv.remove())
        .catch(error => console.log(error.message))
    }

    //Listeners
    function addSubmitListener() {
        document.addEventListener("submit", (e) => {
            e.preventDefault()

            if (e.target.className === "add-form") {
                const name = e.target.name.value
                const image_url = e.target.image_url.value
                const directions = e.target.directions.value
                let ingredients = []

                const cocktail = {
                    name: name,
                    image_url: image_url,
                    directions: directions
                }

                for (let x = 1; x < ingredientCounter + 1; x++) {
                    ingredients.push(e.target[`ingredient${x}`].value)
                }

                fetchCreateCocktail(cocktail, ingredients)

                e.target.name.value = ""
                e.target.image_url.value = ""
                e.target.directions.value = ""

                for (let x = 1; x < ingredientCounter + 1; x++) {
                    e.target[`ingredient${x}`].value = ""
                }

            }

            else if (e.target.className === "edit-form") {
                console.log("edit")
            }
        })
    }

    function addClickListener() {
        document.addEventListener("click", (e) => {
            
            if (e.target.className === "add-button" && e.target.dataset.status === "closed") {
                renderAddForm()
                e.target.dataset.status = "opened"
            }

            else if (e.target.className === "add-button" && e.target.dataset.status === "opened") {
                //UNFINISHED
            }

            else if (e.target.className === "edit-button" && e.target.dataset.status === "closed") {
                const id = e.target.dataset.cocktail
                const cocktailDiv = e.target.parentNode
                renderEditForm(id, cocktailDiv)
                e.target.dataset.status = "opened"
            }
                
            else if (e.target.className === "edit-button" && e.target.dataset.status === "opened") {
                //UNFINISHED
            }
                
            else if (e.target.className === "delete-button") {
                const id = e.target.dataset.cocktail
                const cocktailDiv = e.target.parentNode
                deleteCocktail(id, cocktailDiv)
            }

            else if (e.target.textContent === "+ Add Another Ingredient") {
                e.target.dataset.num = parseInt(e.target.dataset.num) + 1
                renderIngredientInput(e.target.dataset.num)
            }
        })
    }
 
    //Search & Filter Bar
    const searchBar = document.getElementById("search-bar") 
    console.log(cocktailsArray)
    console.log(searchBar)
    
        searchBar.addEventListener("submit", (e) => {
            const searchString = e.target.textinput.value
            console.log(searchString)
            const filteredCocktails = cocktailsArray.filter((cocktail) => {
               return (
                   cocktail.name.toLowerCase() === searchString.toLowerCase()
                // cocktail.name.toLowerCase().includes(searchString) ||             
                // cocktail.ingredient.name.toLowerCase().includes(searchString)
               )
            })
            renderCocktails(filteredCocktails)
            console.log(filteredCocktails)
        })
    

    fetchCocktails()
    addSubmitListener()
    addClickListener()
})