const types = {
    glass: {
        tintado: "tintado",
        metalizado: "metalizado",
        ir: "ir"
    },
    client: {
        private: "private",
        company: "company"
    },
    window: {
        simple: "simple",
        double: "double"
    },
    placement: {
        indoor: "indoor",
        outdoor: "outdoor"
    }
};

const constants = {
    actualKwPrice: 0.16,
    co2EmissionsFactor: 0.27,
    savings: {
        simple: {
            indoor: {
                metalizado: 216.03,
                tintado: 165.19,
                ir: 119.46
            },        
            outdoor: {
                metalizado: 246.91,
                tintado: 190.53,
                ir: 115
            }
        },
        double: {
            indoor: {
                metalizado: 123.96,
                tintado: 77.53,
                ir: 53.04
            },        
            outdoor: {
                metalizado: 222.57,
                tintado: 183.06,
                ir: 134.00
            }
        }
    },
    price: {
        indoor: {
            metalizado: 40,
            tintado: 40,
            ir: 50
        },        
        outdoor: {
            metalizado: 56,
            tintado: 60,
            ir: 75
        }
    }
};

const selectors = {
    surface: 'input[nta-calc="superficie"]',
    glassImages: {
        tintado: 'img[nta-calc="tipo-tintado"]',
        metalizado: 'img[nta-calc="tipo-metalizado"]',
        ir: 'img[nta-calc="tipo-IR"]',
    },
    glassLabels: {
        tintado: 'label[nta-calc="tipo-tintado"]',
        metalizado: 'label[nta-calc="tipo-metalizado"]',
        ir: 'label[nta-calc="tipo-IR"]',
    },
    clientLabels: {
        private: 'label[nta-calc="cliente-particular"]',
        company: 'label[nta-calc="cliente-empresa"]'
    },
    windowLabels: {
        simple: 'label[nta-calc="ventana-simple"]',
        double: 'label[nta-calc="ventana-doble"]'
    },
    placementLabels: {
        indoor: 'label[nta-calc="colocacion-interior"]',
        outdoor: 'label[nta-calc="colocacion-exterior"]'
    }, 
    results: {
        saving: 'div[nta-calc="ahorro-anual"]',
        roi: 'div[nta-calc="retorno-inversion"]',
        co2Reduction: 'div[nta-calc="reduccion-emisiones"]',
    }
};

const currentSelection = {
    glass: types.glass.metalizado,
    client: types.client.private,
    window: types.window.simple,
    placement: types.placement.indoor,
    surface: 0
};

const updateResults = () => {
    const saving = constants.savings[currentSelection.window][currentSelection.placement][currentSelection.glass];
    const price = constants.price[currentSelection.placement][currentSelection.glass];
    const surface = currentSelection.surface;

    anualSaving = constants.actualKwPrice * saving * surface;
    roi = anualSaving === 0 ? 0 : price * surface / anualSaving;
    co2Reduction = saving * surface * constants.co2EmissionsFactor / 1000;

    const nFormat = new Intl.NumberFormat();

    document.querySelector(selectors.results.saving).innerText = nFormat.format(anualSaving.toFixed(2)) + " €/año";
    document.querySelector(selectors.results.roi).innerText = nFormat.format(roi.toFixed(1)) + " años";
    document.querySelector(selectors.results.co2Reduction).innerText = nFormat.format(co2Reduction.toFixed(0)) + " Kg CO2";
}

const onGlassChange = (type) => {
    currentSelection.glass = type;
    document.querySelector(selectors.glassImages[type]).style.display = "";

    for (var key in selectors.glassImages) {
        if (key !== type) {
            hideImage(selectors.glassImages[key]);
        }
    }

    updateResults();
}

const onClientChange = (type) => {
    currentSelection.client = type;

    updateResults();
};

const onWindowChange = (type) => {
    currentSelection.window = type;

    updateResults();
};

const onPlacementChange = (type) => {
    currentSelection.placement = type;

    updateResults();
};

const onSurfaceChange = (value) => {
    currentSelection.surface = Number.parseFloat(value);

    updateResults();
}

const hideImage = (selector) => document.querySelector(selector).style.display = "none";

const selectRadio = (labelSelector) => document.querySelector(labelSelector + ' > input').checked = true;

const addEventListeners = () => {
    document.querySelector(selectors.glassLabels.tintado).addEventListener('change', () => onGlassChange(types.glass.tintado));
    document.querySelector(selectors.glassLabels.metalizado).addEventListener('change', () => onGlassChange(types.glass.metalizado));
    document.querySelector(selectors.glassLabels.ir).addEventListener('change', () => onGlassChange(types.glass.ir));

    document.querySelector(selectors.clientLabels.private).addEventListener('change', () => onClientChange(types.client.private));
    document.querySelector(selectors.clientLabels.company).addEventListener('change', () => onClientChange(types.client.company));
    
    document.querySelector(selectors.windowLabels.simple).addEventListener('change', () => onWindowChange(types.window.simple));
    document.querySelector(selectors.windowLabels.double).addEventListener('change', () => onWindowChange(types.window.double));

    document.querySelector(selectors.placementLabels.indoor).addEventListener('change', () => onPlacementChange(types.placement.indoor));
    document.querySelector(selectors.placementLabels.outdoor).addEventListener('change', () => onPlacementChange(types.placement.outdoor));

    document.querySelector(selectors.surface).addEventListener('input', function() { onSurfaceChange(this.value) });
}

addEventListeners();

onGlassChange(currentSelection.glass);
selectRadio(selectors.glassLabels[currentSelection.glass]);
selectRadio(selectors.clientLabels[currentSelection.client]);
selectRadio(selectors.windowLabels[currentSelection.window]);
selectRadio(selectors.placementLabels[currentSelection.placement]);
document.querySelector(selectors.surface).value = 0;