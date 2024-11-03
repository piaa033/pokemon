document.addEventListener("DOMContentLoaded", function() {
    let products = []; // Declare products array
    const divInfo = document.getElementById("container");
    const searchBar = document.getElementById('search-bar');
    const boton = document.getElementById("btn");

    boton.addEventListener("click", (event) => {
        const busqueda = searchBar.value.trim();
        fetch("https://pokeapi.co/api/v2/pokemon/" + busqueda)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json(); 
            })
            .then(data => {
                console.log(data); 
                // Pass the Pokémon data to renderProducts
                renderProducts([data]); // Wrap in an array
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });

    function renderProducts(productsToRender) {
        divInfo.innerHTML = ''; // Clear the container

        productsToRender.forEach((product) => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = product.sprites.front_default; // Use the Pokémon image
            img.className = 'card-img-top';
            img.alt = product.name;

            card.appendChild(img);
            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            const title = document.createElement('h5');
            title.className = 'card-title';
            title.innerHTML = product.name; // Pokémon name
            cardBody.appendChild(title);

            const statsList = document.createElement('ul');
            statsList.className = 'list-group list-group-flush';

            // Display base stats
            if (product.stats) {
                product.stats.forEach(stat => {
                    const statItem = document.createElement('li');
                    statItem.className = 'list-group-item';
                    statItem.innerHTML = `${stat.stat.name}: ${stat.base_stat}`; // Display stat name and value
                    statsList.appendChild(statItem);
                });
            }

            // Abilities
            const abilitiesBody = document.createElement('div');
            abilitiesBody.className = 'card-body';
            const abilitiesLabel = document.createElement('h6');
            abilitiesLabel.innerHTML = 'Abilities:';
            abilitiesBody.appendChild(abilitiesLabel);

            product.abilities.forEach(ability => {
                const abilityItem = document.createElement('div');
                abilityItem.innerHTML = `<strong>${ability.ability.name}</strong>`; // Display ability name
                abilitiesBody.appendChild(abilityItem);

                // Fetch ability details
                fetch(ability.ability.url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(abilityData => {
                        // Check for description
                        const description = abilityData.effect_entries.find(entry => entry.language.name === 'en');
                        const abilityDescription = document.createElement('div');
                        abilityDescription.innerHTML = description ? description.effect : 'No description available.';
                        abilityItem.appendChild(abilityDescription);
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation for ability:', error);
                    });
            });

            // Append everything to the card
            card.appendChild(cardBody);
            card.appendChild(statsList);
            card.appendChild(abilitiesBody);
            divInfo.appendChild(card);
        });
    }
});