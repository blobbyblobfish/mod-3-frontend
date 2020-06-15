document.addEventListener("DOMContentLoaded", () => {
    const COCKTAILS_URL = "http://localhost:3000/api/v1/cocktails"
    const INGREDIENTS_URL = "http://localhost:3000/api/v1/ingredients"
    const cocktailsContainer = document.querySelector("#cocktails-container")

    function fetchCocktails() {
        fetch(COCKTAILS_URL)
        .then(resp => resp.json())
        .then(json => renderCocktails(json))
        .catch(error => window.alert(error.message))
    }

    function renderCocktails(cocktails) {
        cocktails.forEach(cocktail => renderCocktail(cocktail))
    }

    function renderCocktail(cocktail) {
        cocktailDiv = document.createElement("div")
        cocktailDiv.className = "cocktail"
        cocktailDiv.innerHTML = `
        <h1>${cocktail.name}</h1>
        <img src = ${cocktail.image_url} alt="${cocktail.name}">
        <ul>Ingredients: ${renderIngredients(cocktail)}
        </ul>
        <p>${cocktail.directions}</p>
        <button class="edit-button" data-cocktail=${cocktail.id} data-status="closed">Edit Cocktail</button>
        <button class="delete-button" data-cocktail=${cocktail.id}>Delete Cocktail</button>
        `
        cocktailsContainer.append(cocktailDiv)
    }

    function renderIngredients(cocktail) {
        ingredientList = ""

        cocktail.cocktail_ingredients.forEach(
            ci =>
                ingredientList = ingredientList + `<li>${ci.ingredient_quantity} ${fetchIngredient(ci.ingredient_id)}</li>`
        )

        return ingredientList
    }

    function fetchIngredient(id) {
        let name = "Steven"

        fetch(`${INGREDIENTS_URL}/${id}`)
            .then(resp => resp.json())
            .then(json => name = json.name)
            .then(console.log)
            .catch(error => window.alert(error.message))
        
        return name
    }

    //Forms
    function renderAddForm() {        
        const form = document.createElement("form")
        form.className = "add-form"
        form.innerHTML = `
        <label>Cocktail</label>
        <input type="text" placeholder="name...">
        <label>Image</label>
        <input type="text" placeholder="url...">
        <label>Directions</label>
        <input type="text" placeholder="step 1...step 2...">
        <br>
        <div class="ingredients-inputs">
        <label>Ingredients</label>
        <input type="text" list="ingredients">
        <datalist id="ingredients"></datalist>
        <input type="text" placeholder="quantity...">
        <input type="text" placeholder="special notes...">
        </div>
        <button>+ Add Another Ingredient</button>

        <br>
        <input type="submit">
        `
        cocktailsContainer.prepend(form)
        renderIngredientSelect()
    }

    function renderIngredientSelect() {
        const datalist = document.querySelector("#ingredients")
        datalist.innerHTML = `
        <option value="ingredients.all.each.name"></option>
        `
    }

    function renderIngredientInput() {
        const div = document.createElement("div")
        div.className = "ingredients-inputs"
        div.innerHTML = `<label>Ingredients</label>
        <input type="text" list="ingredients">
        <datalist id="ingredients"></datalist>
        <input type="text" placeholder="quantity...">
        <input type="text" placeholder="special notes...">`

        const ingredientsInputs = document.querySelectorAll(".ingredients-inputs")
        const lastInput = ingredientsInputs.length - 1
        ingredientsInputs[lastInput].append(div)
    }

    function renderEditForm(id, cocktailDiv) {
        const form = document.createElement("form")
        form.className = "edit-form"

        fetch(`${COCKTAILS_URL}/${id}`)
            .then(resp => resp.json())
            .then(cocktail => form.innerHTML = `
            <label>Cocktail</label>
            <input type="text" value="${cocktail.name}">
            <label>Image</label>
            <input type="text" value="${cocktail.image_url}">
            <label>Directions</label>
            <input type="text" value="${cocktail.directions}">

            <input type="submit">
            `)
            .catch(error => window.alert(error.message))
        
        cocktailDiv.append(form)
    }

    function deleteCocktail() {
        console.log("delete")

        // fetch(`${COCKTAILS_URL}/${id}`, {
        //     method: "DELETE"
        // })
        // .catch(error => window.alert(error.message))
    }

    //Listeners
    function addSubmitListener() {
        document.addEventListener("submit", (e) => {
            e.preventDefault()
        })
    }

    function addClickListener() {
        document.addEventListener("click", (e) => {
            
            if (e.target.className === "add-button" && e.target.dataset.status === "closed") {
                renderAddForm()
                e.target.dataset.status = "opened"
            }

            else if (e.target.className === "add-button" && e.target.dataset.status === "opened") {
            
            }

            else if (e.target.className === "edit-button" && e.target.dataset.status === "closed") {
                const id = e.target.dataset.cocktail
                const cocktailDiv = e.target.parentNode
                renderEditForm(id, cocktailDiv)
                e.target.dataset.status = "opened"
            }
                
            else if (e.target.className === "edit-button" && e.target.dataset.status === "opened") {
            
            }
                
            else if (e.target.className === "delete-button") {
                const id = e.target.dataset.cocktail
                const cocktailDiv = e.target.parentNode
                deleteCocktail(id, cocktailDiv)
            }

            else if (e.target.textContent === "+ Add Another Ingredient") {
                renderIngredientInput()
            }
        })
    }
 
    fetchCocktails()
    addSubmitListener()
    addClickListener()
})