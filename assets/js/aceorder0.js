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
        productionBase: { weaponCrate: 0, medCrate: 0, foodCrate: 0, total: 0 },
        craftingCenter: { idCard: 0, precisionGear: 0, total: 0 },
        energyCenter: { integratedChip: 0, energyCore: 0, total: 0 }
    };
    let overallTimeNeeded = 0;
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

    // Round up the total cost
    const roundedTotalCost = Math.ceil(totalCost);

    // Update HTML elements
    document.getElementById('total-cost').textContent = roundedTotalCost;

    if (suggestion) {
        document.getElementById('total-time').textContent = 'Upgrade Needed';
        document.getElementById('suggestion').innerHTML = suggestion.trim().replace(/\. /g, '.<br>');
    } else {
        const timeString = formatTime(overallTimeNeeded);
        document.getElementById('total-time').textContent = timeString || '';
        document.getElementById('suggestion').textContent = '';
    }

    // Update the breakdown and show the container
    updateTimeBreakdown(breakdown, overallTimeNeeded);

    // Show the time breakdown container if there is any content
    const timeBreakdownContainer = document.getElementById('time-breakdown');
    if (document.querySelector('#time-breakdown .factory-breakdown')) {
        timeBreakdownContainer.style.display = 'block';
    } else {
        timeBreakdownContainer.style.display = 'none';
    }
}


const factoryNames = {
    'material-factory-breakdown': 'Material Factory',
    'production-base-breakdown': 'Production Base',
    'crafting-center-breakdown': 'Crafting Center',
    'energy-center-breakdown': 'Energy Center'
};

function createBreakdownHTML(factoryId, breakdownObj, isMaxTime) {
    const factoryName = factoryNames[factoryId] || factoryId; // Use the display name from the mapping or default to the ID
    let content = `<div class="factory-breakdown">
        <div class="factory-total">${factoryName}<span class="factory-total-time">${formatAndHighlight(breakdownObj.total, isMaxTime)}</span></div>
        <ul class="material-list">`;

    for (let material in breakdownObj) {
        if (material !== 'total' && breakdownObj[material] > 0) {
            content += `<li class="material-time">${materialIcons[material]}<span class="hidden">${material}: </span><span class="timeNeeded">${formatTime(breakdownObj[material])}</span></li>`;
        }
    }

    content += '</ul></div>';
    return content;
}

function updateTimeBreakdown(breakdown, overallTimeNeeded) {
    const formatAndHighlight = (totalTime, isMaxTime) => {
        const formattedTime = formatTime(totalTime);
        return isMaxTime ? `<strong class="redText">${formattedTime}</strong>` : formattedTime;
    };

    const materialIcons = {
        wood: '<img src="images/aceCal/wood.png" alt="Wood Icon" class="icon">',
        iron: '<img src="images/aceCal/iron.png" alt="Iron Icon" class="icon">',
        steel: '<img src="images/aceCal/steel.png" alt="Steel Icon" class="icon">',
        crystone: '<img src="images/aceCal/crys.png" alt="Crystone Icon" class="icon">',
        weaponCrate: '<img src="images/aceCal/weap.png" alt="Weapon Crate Icon" class="icon">',
        medCrate: '<img src="images/aceCal/med.png" alt="Med Crate Icon" class="icon">',
        foodCrate: '<img src="images/aceCal/food.png" alt="Food Crate Icon" class="icon">',
        idCard: '<img src="images/aceCal/id.png" alt="ID Card Icon" class="icon">',
        precisionGear: '<img src="images/aceCal/gear.png" alt="Precision Gear Icon" class="icon">',
        integratedChip: '<img src="images/aceCal/chip.png" alt="Integrated Chip Icon" class="icon">',
        energyCore: '<img src="images/aceCal/core.png" alt="Energy Core Icon" class="icon">'
    };

    const createBreakdownHTML = (factoryId, breakdownObj, isMaxTime) => {
        const factoryName = factoryNames[factoryId] || factoryId; // Use the display name from the mapping or default to the ID
        let content = `<div class="factory-breakdown">
            <div class="factory-total">${factoryName}<span class="factory-total-time">${formatAndHighlight(breakdownObj.total, isMaxTime)}</span></div>
            <ul class="material-list">`;

        for (let material in breakdownObj) {
            if (material !== 'total' && breakdownObj[material] > 0) {
                content += `<li class="material-time">${materialIcons[material]}<span class="hidden">${material}: </span><span class="timeNeeded">${formatTime(breakdownObj[material])}</span></li>`;
            }
        }

        content += '</ul></div>';
        return content;
    };

    // Update content and visibility
    const updateContainer = (containerId, breakdownObj, isMaxTime) => {
        const container = document.getElementById(containerId);
        const content = createBreakdownHTML(containerId, breakdownObj, isMaxTime);
        if (content.includes('<li class="material-time"')) {
            container.innerHTML = content;
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    };

    updateContainer(
        'material-factory-breakdown',
        breakdown.materialFactory,
        breakdown.materialFactory.total === overallTimeNeeded
    );

    updateContainer(
        'production-base-breakdown',
        breakdown.productionBase,
        breakdown.productionBase.total === overallTimeNeeded
    );

    updateContainer(
        'crafting-center-breakdown',
        breakdown.craftingCenter,
        breakdown.craftingCenter.total === overallTimeNeeded
    );

    updateContainer(
        'energy-center-breakdown',
        breakdown.energyCenter,
        breakdown.energyCenter.total === overallTimeNeeded
    );
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
    document.getElementById('time-breakdown').style.display = 'none';
}

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', calculateTotalCost);
    input.addEventListener('change', calculateTotalCost);
});

calculateTotalCost(); // Initial calculation
