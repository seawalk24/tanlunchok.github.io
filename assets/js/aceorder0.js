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

function formatTime(minutes) {
    const days = Math.floor(minutes / (24 * 60));
    const hours = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;
    return `${days > 0 ? days + ' day' + (days > 1 ? 's' : '') + ' ' : ''}${hours > 0 ? hours + ' hour' + (hours > 1 ? 's' : '') + ' ' : ''}${mins > 0 ? mins + ' minute' + (mins > 1 ? 's' : '') : ''}`;
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
    let breakdown = {
        materialFactory: { wood: 0, iron: 0, steel: 0, crystone: 0, total: 0 },
        productionBase: { weaponCrates: 0, medCrates: 0, foodCrates: 0, total: 0 },
        craftingCenter: { idCards: 0, precisionGears: 0, total: 0 },
        energyCenter: { integratedChips: 0, energyCores: 0, total: 0 }
    };
    let overallTimeNeeded = 0;
    let maxFactory = '';
    let maxTime = 0;
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
                if (timeForMaterial > 0) {
                    breakdown.materialFactory[key] += timeForMaterial * quantity;
                    breakdown.materialFactory.total += timeForMaterial * quantity;
                }
                break;
            case 'weaponCrate':
            case 'medCrate':
            case 'foodCrate':
                timeForMaterial = buildingTimes.productionBase[starLevels.productionBase][['weaponCrate', 'medCrate', 'foodCrate'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Production Base. ';
                if (timeForMaterial > 0) {
                    breakdown.productionBase[key] += timeForMaterial * quantity;
                    breakdown.productionBase.total += timeForMaterial * quantity;
                }
                break;
            case 'idCard':
            case 'precisionGear':
                timeForMaterial = buildingTimes.craftingCenter[starLevels.craftingCenter][['idCard', 'precisionGear'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Crafting Center. ';
                if (timeForMaterial > 0) {
                    breakdown.craftingCenter[key] += timeForMaterial * quantity;
                    breakdown.craftingCenter.total += timeForMaterial * quantity;
                }
                break;
            case 'integratedChip':
            case 'energyCore':
                timeForMaterial = buildingTimes.energyCenter[starLevels.energyCenter][['integratedChip', 'energyCore'].indexOf(key)];
                if (timeForMaterial === 0 && quantity > 0) suggestion += 'Upgrade Energy Center. ';
                if (timeForMaterial > 0) {
                    breakdown.energyCenter[key] += timeForMaterial * quantity;
                    breakdown.energyCenter.total += timeForMaterial * quantity;
                }
                break;
        }
    }

    // Determine the maximum time from the breakdown
    overallTimeNeeded = Math.max(
        breakdown.materialFactory.total,
        breakdown.productionBase.total,
        breakdown.craftingCenter.total,
        breakdown.energyCenter.total
    );

    // Update HTML elements
    document.getElementById('total-cost').textContent = totalCost.toFixed(2);

    if (suggestion) {
        document.getElementById('total-time').textContent = 'Upgrade Needed';
        document.getElementById('suggestion').innerHTML = suggestion.trim().replace(/\. /g, '.<br>');
    } else {
        const timeString = formatTime(overallTimeNeeded);
        document.getElementById('total-time').textContent = timeString || '';
        document.getElementById('suggestion').textContent = '';
    }

    updateTimeBreakdown(breakdown, overallTimeNeeded);
}

function updateTimeBreakdown(breakdown, overallTimeNeeded) {
    const formatAndHighlight = (totalTime, highlight) => {
        const formattedTime = formatTime(totalTime);
        return highlight ? `<strong style="color: red;">${formattedTime}</strong>` : formattedTime;
    };

    const materialFactoryTime = breakdown.materialFactory.total;
    const productionBaseTime = breakdown.productionBase.total;
    const craftingCenterTime = breakdown.craftingCenter.total;
    const energyCenterTime = breakdown.energyCenter.total;

    let materialFactoryContent = materialFactoryTime > 0 ? `
        <strong>Material Factory:</strong>
        <ul>
            ${breakdown.materialFactory.wood > 0 ? `<li>Wood: ${formatAndHighlight(breakdown.materialFactory.wood, materialFactoryTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.materialFactory.iron > 0 ? `<li>Iron: ${formatAndHighlight(breakdown.materialFactory.iron, materialFactoryTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.materialFactory.steel > 0 ? `<li>Steel: ${formatAndHighlight(breakdown.materialFactory.steel, materialFactoryTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.materialFactory.crystone > 0 ? `<li>Crystone: ${formatAndHighlight(breakdown.materialFactory.crystone, materialFactoryTime === overallTimeNeeded)}</li>` : ''}
            <li><strong>Total: ${formatAndHighlight(materialFactoryTime, materialFactoryTime === overallTimeNeeded)}</strong></li>
        </ul>
    ` : '';

    let productionBaseContent = productionBaseTime > 0 ? `
        <strong>Production Base:</strong>
        <ul>
            ${breakdown.productionBase.weaponCrates > 0 ? `<li>Weapon Crates: ${formatAndHighlight(breakdown.productionBase.weaponCrates, productionBaseTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.productionBase.medCrates > 0 ? `<li>Med Crates: ${formatAndHighlight(breakdown.productionBase.medCrates, productionBaseTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.productionBase.foodCrates > 0 ? `<li>Food Crates: ${formatAndHighlight(breakdown.productionBase.foodCrates, productionBaseTime === overallTimeNeeded)}</li>` : ''}
            <li><strong>Total: ${formatAndHighlight(productionBaseTime, productionBaseTime === overallTimeNeeded)}</strong></li>
        </ul>
    ` : '';

    let craftingCenterContent = craftingCenterTime > 0 ? `
        <strong>Crafting Center:</strong>
        <ul>
            ${breakdown.craftingCenter.idCards > 0 ? `<li>ID Cards: ${formatAndHighlight(breakdown.craftingCenter.idCards, craftingCenterTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.craftingCenter.precisionGears > 0 ? `<li>Precision Gears: ${formatAndHighlight(breakdown.craftingCenter.precisionGears, craftingCenterTime === overallTimeNeeded)}</li>` : ''}
            <li><strong>Total: ${formatAndHighlight(craftingCenterTime, craftingCenterTime === overallTimeNeeded)}</strong></li>
        </ul>
    ` : '';

    let energyCenterContent = energyCenterTime > 0 ? `
        <strong>Energy Center:</strong>
        <ul>
            ${breakdown.energyCenter.integratedChips > 0 ? `<li>Integrated Chips: ${formatAndHighlight(breakdown.energyCenter.integratedChips, energyCenterTime === overallTimeNeeded)}</li>` : ''}
            ${breakdown.energyCenter.energyCores > 0 ? `<li>Energy Cores: ${formatAndHighlight(breakdown.energyCenter.energyCores, energyCenterTime === overallTimeNeeded)}</li>` : ''}
            <li><strong>Total: ${formatAndHighlight(energyCenterTime, energyCenterTime === overallTimeNeeded)}</strong></li>
        </ul>
    ` : '';

    document.getElementById('material-factory-breakdown').innerHTML = materialFactoryContent;
    document.getElementById('production-base-breakdown').innerHTML = productionBaseContent;
    document.getElementById('crafting-center-breakdown').innerHTML = craftingCenterContent;
    document.getElementById('energy-center-breakdown').innerHTML = energyCenterContent;
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
    updateTimeBreakdown({
        materialFactory: { wood: 0, iron: 0, steel: 0, crystone: 0, total: 0 },
        productionBase: { weaponCrates: 0, medCrates: 0, foodCrates: 0, total: 0 },
        craftingCenter: { idCards: 0, precisionGears: 0, total: 0 },
        energyCenter: { integratedChips: 0, energyCores: 0, total: 0 }
    }, 0);
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateTotalCost);
    input.addEventListener('change', calculateTotalCost);
});

calculateTotalCost(); // Initial calculation
