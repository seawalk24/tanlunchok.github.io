document.addEventListener('DOMContentLoaded', () => {
    // Function to update star ratings
    function updateStarRatings() {
        document.querySelectorAll('.star-rating input').forEach(input => {
            input.addEventListener('change', function() {
                const ratingValue = parseInt(this.value);
                const container = this.closest('.star-rating');
                
                // Update the color of stars based on the rating
                container.querySelectorAll('label').forEach((label, index) => {
                    const starValue = index + 1;
                    label.style.color = starValue <= ratingValue ? 'gold' : '#ddd';
                });

                calculateTotalCost(); // Recalculate the total cost
                calculateTotalTime(); // Recalculate the total time
            });
        });

        // Initialize star colors based on default values
        document.querySelectorAll('.star-rating input').forEach(input => {
            const ratingValue = parseInt(input.value);
            const container = input.closest('.star-rating');
            
            container.querySelectorAll('label').forEach((label, index) => {
                const starValue = index + 1;
                label.style.color = starValue <= ratingValue ? 'gold' : '#ddd';
            });
        });
    }

    // Function to calculate the total cost
    function calculateTotalCost() {
        const costs = {
            wood: 12,
            iron: 4,
            steel: 12,
            crystone: 3,
            weaponCrate: 6,
            medCrate: 12,
            foodCrate: 4,
            idCard: 3,
            precisionGear: 6,
            integratedChip: 1,
            energyCore: 0.5
        };
        
        const values = {
            wood: parseFloat(document.getElementById('wood').value) || 0,
            iron: parseFloat(document.getElementById('iron').value) || 0,
            steel: parseFloat(document.getElementById('steel').value) || 0,
            crystone: parseFloat(document.getElementById('crystone').value) || 0,
            weaponCrate: parseFloat(document.getElementById('weapon-crate').value) || 0,
            medCrate: parseFloat(document.getElementById('med-crate').value) || 0,
            foodCrate: parseFloat(document.getElementById('food-crate').value) || 0,
            idCard: parseFloat(document.getElementById('id-card').value) || 0,
            precisionGear: parseFloat(document.getElementById('precision-gear').value) || 0,
            integratedChip: parseFloat(document.getElementById('integrated-chip').value) || 0,
            energyCore: parseFloat(document.getElementById('energy-core').value) || 0
        };
        
        let totalCost = 0;
        
        for (let key in costs) {
            const costPerUnit = costs[key];
            const quantity = values[key];
            const hourGlassCost = 1 / costPerUnit;
            const gemCost = 80 * hourGlassCost;
            totalCost += gemCost * quantity;
        }
        
        document.getElementById('total-cost').textContent = totalCost.toFixed(2);
    }

    // Function to calculate total time needed
    function calculateTotalTime() {
        const starLevels = {
            materialFactory: parseInt(document.getElementById('material-factory-stars').value),
            productionBase: parseInt(document.getElementById('production-base-stars').value),
            craftingCenter: parseInt(document.getElementById('crafting-center-stars').value),
            energyCenter: parseInt(document.getElementById('energy-center-stars').value)
        };

        // Time matrix for each building
        const times = {
            materialFactory: [
                [30, 0, 0, 0], // 1 star
                [15, 45, 0, 0], // 2 stars
                [10, 30, 10, 0], // 3 stars
                [5, 15, 5, 20] // 4 stars
            ],
            productionBase: [
                [60, 0, 0], // 1 star
                [30, 15, 0], // 2 stars
                [20, 10, 30], // 3 stars
                [10, 5, 15] // 4 stars
            ],
            craftingCenter: [
                [120, 0], // 1 star
                [60, 0], // 2 stars
                [40, 20], // 3 stars
                [20, 10] // 4 stars
            ],
            energyCenter: [
                [360, 0], // 1 star
                [180, 0], // 2 stars
                [120, 240], // 3 stars
                [60, 120] // 4 stars
            ]
        };

        const materials = {
            wood: { building: 'materialFactory', index: 0 },
            iron: { building: 'materialFactory', index: 1 },
            steel: { building: 'materialFactory', index: 2 },
            crystone: { building: 'materialFactory', index: 3 },
            weaponCrate: { building: 'productionBase', index: 0 },
            medCrate: { building: 'productionBase', index: 1 },
            foodCrate: { building: 'productionBase', index: 2 },
            idCard: { building: 'craftingCenter', index: 0 },
            precisionGear: { building: 'craftingCenter', index: 1 },
            integratedChip: { building: 'energyCenter', index: 0 },
            energyCore: { building: 'energyCenter', index: 1 }
        };

        let totalMinutes = 0;
        let allMaterialsProduced = true;
        let suggestion = 'a';

        for (let material in materials) {
            const building = materials[material].building;
            const index = materials[material].index;
            const starLevel = starLevels[building];
            const time = times[building][starLevel - 1][index];
            
            if (time === 0) {
                allMaterialsProduced = false;
                suggestion = `Upgrade ${building.replace(/([A-Z])/g, ' $1')} to get ${material.replace(/([A-Z])/g, ' $1')}.`;
            } else {
                totalMinutes += time * (parseFloat(document.getElementById(material).value) || 0);
            }
        }

        // Convert minutes to days, hours, and minutes
        const days = Math.floor(totalMinutes / 1440);
        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        let timeString = '';
        if (days > 0) timeString += `${days} days `;
        if (hours > 0) timeString += `${hours} hours `;
        if (minutes > 0) timeString += `${minutes} minutes`;

        document.getElementById('total-time').textContent = timeString || '';
        document.getElementById('suggestion').textContent = allMaterialsProduced ? '' : suggestion;
    }

    // Function to reset the form
    function resetForm() {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.value = '0';
        });

        document.querySelectorAll('.star-rating input').forEach(input => {
            input.value = '4';
            const container = input.closest('.star-rating');
            
            container.querySelectorAll('label').forEach((label, index) => {
                label.style.color = 'gold';
            });
        });

        document.getElementById('total-cost').textContent = '0.00';
        document.getElementById('total-time').textContent = '';
        document.getElementById('suggestion').textContent = '';
    }

    // Add event listeners to input fields
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', () => {
            calculateTotalCost();
            calculateTotalTime();
        });
    });

    // Add event listeners to star rating inputs
    updateStarRatings();

    // Add event listener to the reset button
    document.querySelector('.resetBtn button').addEventListener('click', resetForm);
});
