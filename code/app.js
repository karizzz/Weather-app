// DOM elements
const form = document.querySelector(".search-form"); // Form element
const inp = document.querySelector("input"); // Input field
const list = document.querySelector(".cities"); // Cities list

// API key
const apiKey = "abbd0934a03a35e0e69902014f15349a";

// Event listener for the form
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form submission from reloading the page

    let inputValue = inp.value.trim(); // Get input value and trim whitespace

    console.log(`Searching for: ${inputValue}`); // Debugging log for input value

    // Check if there is already a city matching the input value in the list
    const list_items = Array.from(list.querySelectorAll("li")); // Select all <li> items
    console.log("List items found:", list_items); // Debugging log for list items

    if (list_items.length > 0) {
        const filtered_list = list_items.filter((el) => {
            let cityName = el.querySelector(".city-name"); // Select city name
            let cityCountry = el.querySelector(".city-code"); // Select city code

            let cityNameText = cityName.textContent.toLowerCase();
            let cityCountryText = cityCountry.textContent.toLowerCase();

            let content = "";

            // Handle input containing a comma (e.g., "Mumbai, IN")
            if (inputValue.includes(",")) {
                let [inputCity, inputCountry] = inputValue.split(",").map((s) => s.trim().toLowerCase());
                if (inputCountry === cityCountryText) {
                    content = inputCity; // Match by city name
                }
            } else {
                // Handle input without a comma (e.g., "Mumbai")
                content = cityNameText;
            }

            return content === inputValue.toLowerCase();
        });

        //if (filtered_list.length > 0) {
        //    console.log("City already exists in the list:", filtered_list);
        //} else {
        //    console.log("City not found in the list.");
        //}
//
        //if (filtered_list.length > 0) {
        //    MessageChannel.textContent = "City already exists in the list.";
        //}

    } else {
        console.log("The list is empty.");

    }

 

    // AJAX MAGIC
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); // Debugging log for API response
        
        if (data.cod == "404"){
            throw new Error("City not found");
        }
        const {main, name, sys, weather} = data;
        const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;
        const li = document.createElement("li");
        
        const markup = `
            <figure>
                <img src="${icon}" alt="${weather[0]['description']}">
            </figure>
            <div>
                <h2 class="city-name">${name}</h2>
                <p class="city-weather">${weather[0]['description'].toUpperCase()}</p>
                <h3>
                    <span class="city-temp">${Math.round(main.temp)}<sup>°C</sup></span>
                    <span class="city-code">${sys.country}</span>
                </h3>
            </div>
        `;

            li.innerHTML = markup

			// Add the new list item to the page
			list.appendChild(li)
        })
});
