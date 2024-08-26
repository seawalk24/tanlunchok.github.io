const buildingTimes = {
    materialFactory: [
        [30, 0, 0, 0],
        [15, 45, 0, 0],
        [10, 30, 10, 0],
        [5, 15, 5, 20]
    ],
    productionBase: [
        [60, 0, 0],
        [30, 15, 0],
        [20, 10, 30],
        [10, 5, 15]
    ],
    craftingCenter: [
        [120, 0],
        [60, 0],
        [40, 20],
        [20, 10]
    ],
    energyCenter: [
        [360, 0],
        [180, 0],
        [120, 240],
        [60, 120]
    ]
};

function getStarRating(id) {
    const checkedInput = document.querySelector(`input[name="${id}"]:checked`);
    return checkedInput ? parseInt(checkedInput.value) - 1 : 3; // Default to 4 stars if none selected
}

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

    const starLevels = {
        materialFactory: getStarRating('materialFactoryStars'),
        productionBase: getStarRating('productionBaseStars'),
        craftingCenter: getStarRating('craftingCenterStars'),
        energyCenter: getStarRating('energyCenterStars')
    };

    let totalCost = 0;
    let totalTime = 0;
    let suggestion = '';

    for (let key in costs) {
        const costPerUnit = costs[key];
        const quantity = values[key];
        const hourGlassCost = 1 / costPerUnit;
        const gemCost = 80 * hourGlassCost;
        totalCost += gemCost * quantity;

        let timeForMaterial = 0;
        switch (key) {
            case 'wood':
            case 'iron':
            case 'steel':
            case 'crystone':
                timeForMaterial = buildingTimes.materialFactory[starLevels.materialFactory][['wood', 'iron', 'steel', 'crystone'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Material Factory. ';
                break;
            case 'weaponCrate':
            case 'medCrate':
            case 'foodCrate':
                timeForMaterial = buildingTimes.productionBase[starLevels.productionBase][['weaponCrate', 'medCrate', 'foodCrate'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Production Base. ';
                break;
            case 'idCard':
            case 'precisionGear':
                timeForMaterial = buildingTimes.craftingCenter[starLevels.craftingCenter][['idCard', 'precisionGear'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Crafting Center. ';
                break;
            case 'integratedChip':
            case 'energyCore':
                timeForMaterial = buildingTimes.energyCenter[starLevels.energyCenter][['integratedChip', 'energyCore'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Energy Center. ';
                break;
        }

        totalTime += timeForMaterial * quantity;
    }

    document.getElementById('total-cost').textContent = totalCost.toFixed(2);

    if (suggestion) {
        document.getElementById('total-time').textContent = 'Upgrade Needed';
        document.getElementById('suggestion').innerHTML = suggestion.trim().replace(/\. /g, '.<br>');
    } else {
        const days = Math.floor(totalTime / (24 * 60));
        const hours = Math.floor((totalTime % (24 * 60)) / 60);
        const minutes = totalTime % 60;
    
        const timeString = `${days > 0 ? days + ' day' + (days > 1 ? 's' : '') + ' ' : ''}${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') + ' ' : ''}${minutes > 0 ? minutes + ' minute' + (minutes > 1 ? 's' : '') : ''}`;
        document.getElementById('total-time').textContent = timeString.trim() || '';
        document.getElementById('suggestion').textContent = '';
    }
}

function resetForm() {
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '0');
    document.querySelectorAll('input[type="radio"]').forEach(radio => radio.checked = false);
    document.querySelector('input[name="materialFactoryStars"][value="4"]').checked = true;
    document.querySelector('input[name="productionBaseStars"][value="4"]').checked = true;
    document.querySelector('input[name="craftingCenterStars"][value="4"]').checked = true;
    document.querySelector('input[name="energyCenterStars"][value="4"]').checked = true;
    document.getElementById('total-cost').textContent = '0';
    document.getElementById('total-time').textContent = '';
    document.getElementById('suggestion').textContent = '';
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateTotalCost);
    input.addEventListener('change', calculateTotalCost);
});

calculateTotalCost(); // Initial calculation
