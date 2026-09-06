/**
 * JengaSmart Kenya — 5x8m House Cost Optimizer & Build Manager
 * Core Application Logic & Calculation Engine
 */

// 1. REGIONAL UNIT RATES (KES)
const REGIONAL_RATES = {
  nairobi: {
    brick: 11,
    cement: 780,
    sandTon: 1600,
    ballastTon: 1500,
    ironSheet: 1450,
    rebarD8: 750,
    rebarR6: 420,
    bindingWire: 250,
    dpmRoll: 1800,
    timber2x4: 65, // per foot
    timber2x2: 35, // per foot
    roofingNails: 280,
    wireNails: 180,
    ridgeCap: 700,
    steelWindow: 6500,
    flushDoor: 4500
  },
  western: {
    brick: 8, // Western clay kilns cheaper
    cement: 820,
    sandTon: 1400,
    ballastTon: 1600,
    ironSheet: 1480,
    rebarD8: 780,
    rebarR6: 440,
    bindingWire: 260,
    dpmRoll: 1900,
    timber2x4: 55,
    timber2x2: 30,
    roofingNails: 290,
    wireNails: 190,
    ridgeCap: 750,
    steelWindow: 6000,
    flushDoor: 4200
  },
  rift: {
    brick: 9,
    cement: 800,
    sandTon: 1500,
    ballastTon: 1400,
    ironSheet: 1460,
    rebarD8: 760,
    rebarR6: 430,
    bindingWire: 250,
    dpmRoll: 1850,
    timber2x4: 50, // Rift timber close to sawmills
    timber2x2: 28,
    roofingNails: 280,
    wireNails: 180,
    ridgeCap: 720,
    steelWindow: 6200,
    flushDoor: 4300
  },
  coast: {
    brick: 13,
    cement: 840,
    sandTon: 1800,
    ballastTon: 1700,
    ironSheet: 1520,
    rebarD8: 800,
    rebarR6: 460,
    bindingWire: 270,
    dpmRoll: 2000,
    timber2x4: 75,
    timber2x2: 40,
    roofingNails: 300,
    wireNails: 200,
    ridgeCap: 780,
    steelWindow: 6800,
    flushDoor: 4800
  }
};

// 2. MASTER MATERIALS DATABASE FOR 5x8m (40m²) HOUSE
const DEFAULT_MATERIALS = [
  {
    id: 'bricks',
    name: 'Clay Bricks (Standard Kiln)',
    sub: 'Substructure & Superstructure walling up to 2.8m',
    unit: 'pcs',
    required: 7000,
    inStock: 2000, // User preloaded inventory
    rateKey: 'brick',
    defaultRate: 10
  },
  {
    id: 'mabati',
    name: 'G28 Corrugated Mabati (Iron Sheets)',
    sub: 'Roofing cover for 8.9m x 6.0m gable pitch',
    unit: 'sheets',
    required: 24,
    inStock: 15, // User preloaded inventory
    rateKey: 'ironSheet',
    defaultRate: 1450
  },
  {
    id: 'cement',
    name: 'Portland Cement (50kg bags)',
    sub: 'Footing, slab, ring beam, mortar & plaster',
    unit: 'bags',
    required: 90,
    inStock: 20, // User preloaded inventory
    rateKey: 'cement',
    defaultRate: 780
  },
  {
    id: 'sand',
    name: 'Clean River Sand',
    sub: 'Concrete casting, mortar mix & interior plaster',
    unit: 'tons',
    required: 17,
    inStock: 10, // User preloaded inventory
    rateKey: 'sandTon',
    defaultRate: 1600
  },
  {
    id: 'ballast',
    name: 'Granite Ballast (3/4" aggregate)',
    sub: 'Foundation footing, 100mm floor slab & ring beam',
    unit: 'tons',
    required: 11,
    inStock: 3, // User preloaded inventory
    rateKey: 'ballastTon',
    defaultRate: 1500
  },
  {
    id: 'rebarD8',
    name: 'D8 Ribbed Rebar (12m rods)',
    sub: 'Ring beam main tension bars (4 longitudinal bars)',
    unit: 'pcs',
    required: 14,
    inStock: 14, // User preloaded (fully covered)
    rateKey: 'rebarD8',
    defaultRate: 750
  },
  {
    id: 'rebarR6',
    name: 'R6 Mild Steel Wall Ties / Stirrups',
    sub: 'Ring beam stirrup rings @ 200mm centers',
    unit: 'pcs',
    required: 10,
    inStock: 10, // User preloaded (fully covered)
    rateKey: 'rebarR6',
    defaultRate: 420
  },
  {
    id: 'bindingWire',
    name: 'Binding Wire (Standard Gauge)',
    sub: 'Tying rebar intersections and stirrups',
    unit: 'kg',
    required: 3,
    inStock: 3, // User preloaded (fully covered)
    rateKey: 'bindingWire',
    defaultRate: 250
  },
  {
    id: 'dpm',
    name: '1000-Gauge Waterproof DPM Sheeting',
    sub: 'Damp-proof membrane under ground floor slab',
    unit: 'rolls',
    required: 8,
    inStock: 8, // User preloaded (fully covered)
    rateKey: 'dpmRoll',
    defaultRate: 1800
  },
  {
    id: 'timberRafters',
    name: '2×4 Cypress Rafters / Trusses',
    sub: 'Main roof structural support trusses (approx. 520 ft)',
    unit: 'feet',
    required: 520,
    inStock: 0,
    rateKey: 'timber2x4',
    defaultRate: 65
  },
  {
    id: 'timberPurlins',
    name: '2×2 Cypress Purlins',
    sub: 'Battens for securing mabati iron sheets (approx. 480 ft)',
    unit: 'feet',
    required: 480,
    inStock: 0,
    rateKey: 'timber2x2',
    defaultRate: 35
  },
  {
    id: 'ridgeCaps',
    name: 'Standard G28 Ridge Caps',
    sub: 'Apex ridge weatherproofing (gable design only)',
    unit: 'pcs',
    required: 5,
    inStock: 0,
    rateKey: 'ridgeCap',
    defaultRate: 700
  },
  {
    id: 'nailsHardware',
    name: 'Roofing Nails & Wire Nails',
    sub: 'Roofing nails with rubber washers (12kg) + wire nails (15kg)',
    unit: 'kg',
    required: 27,
    inStock: 0,
    rateKey: 'roofingNails',
    defaultRate: 240
  },
  {
    id: 'windowsDoors',
    name: 'Steel Casement Windows & External Doors',
    sub: '4 windows (1200x1200mm, 900x900mm) + 2 steel external doors',
    unit: 'set',
    required: 6,
    inStock: 0,
    rateKey: 'steelWindow',
    defaultRate: 6500
  }
];

// 3. CONSTRUCTION PHASES ROADMAP
const CONSTRUCTION_PHASES = [
  {
    id: 1,
    title: 'Phase 1: Setting Out & Foundation Strip Footing',
    desc: 'Site clearing, 600mm deep trenching, leveling, hardcore blinding, and 1:3:6 footing concrete casting.',
    materials: ['Cement: 15 bags', 'Sand: 3 tons', 'Ballast: 3 tons', 'Hardcore'],
    estCost: 48000,
    duration: '4-5 days'
  },
  {
    id: 2,
    title: 'Phase 2: Substructure Brick Walling & 100mm Floor Slab',
    desc: "Using Devin's 2,000 bricks to build foundation wall to DPC level, lay 8 rolls DPM polythene, cast 100mm floor slab.",
    materials: ['Bricks: 2,000 (Covered!)', 'DPM: 8 Rolls (Covered!)', 'Cement: 22 bags', 'Sand: 4 tons', 'Ballast: 4 tons'],
    estCost: 52000,
    duration: '5-6 days'
  },
  {
    id: 3,
    title: 'Phase 3: Superstructure Brick Elevation to Ring Beam (2.8m)',
    desc: 'Erecting 8m x 5m external and internal partition walls. Door and window frames set into position.',
    materials: ['Bricks: 5,000 (Deficit)', 'Cement: 25 bags', 'Sand: 5 tons'],
    estCost: 78000,
    duration: '7-9 days'
  },
  {
    id: 4,
    title: 'Phase 4: Reinforced Concrete Ring Beam (200mm x 200mm)',
    desc: "Tying Devin's D8 & R6 rebar cages, wooden formwork shuttering, and casting 1:2:4 grade concrete.",
    materials: ['D8 Rebar: 14 pcs (Covered!)', 'R6 Rebar: 10 pcs (Covered!)', 'Binding Wire: 3kg (Covered!)', 'Cement: 8 bags', 'Ballast: 2 tons'],
    estCost: 28000,
    duration: '3-4 days'
  },
  {
    id: 5,
    title: 'Phase 5: Roof Framing & Iron Sheets (Mabati) Installation',
    desc: 'Erecting treated cypress trusses, installing purlins, fixing 24 mabati sheets with rubberized nails & ridge caps.',
    materials: ['Mabati: 15 owned + 9 to buy', '2x4 Rafters', '2x2 Purlins', 'Roofing Nails'],
    estCost: 85000,
    duration: '4-5 days'
  },
  {
    id: 6,
    title: 'Phase 6: Steel Windows, Doors & External Plastering',
    desc: 'Mounting burglar-proof steel casement windows, steel entrance door, external weather-resistant plaster.',
    materials: ['4 Windows', '2 Steel Doors', 'Cement: 12 bags', 'Sand: 3 tons'],
    estCost: 58000,
    duration: '5-6 days'
  },
  {
    id: 7,
    title: 'Phase 7: Floor Screed Finish & Electrical 1st Fix',
    desc: 'Polished red oxide cement floor screed, electrical conduit piping, light points and sockets.',
    materials: ['Cement: 8 bags', 'Red Oxide pigment', 'PVC Conduits', 'Switches & Sockets'],
    estCost: 36000,
    duration: '4-5 days'
  }
];

// Room Details Data for Visualizer
const ROOM_DATA = {
  master: {
    title: "Master Bedroom",
    specs: [
      { label: "Dimensions", val: "2.90m × 2.80m (8.12 m²)" },
      { label: "Bed Capacity", val: "Queen 5ft × 6ft Bed with dual bedside tables" },
      { label: "Wardrobe", val: "2.20m full-height 3-door built-in wardrobe" },
      { label: "Natural Light", val: "1200×1200mm steel casement window (South wall)" },
      { label: "Electrical", val: "1 central LED light point + 2 double sockets + 1 bedside two-way switch" }
    ]
  },
  kids: {
    title: "Kids' / Second Bedroom",
    specs: [
      { label: "Dimensions", val: "2.90m × 2.00m (5.80 m²)" },
      { label: "Bed Capacity", val: "3ft × 6ft Double-Deck Bunk Bed (sleeps 2 comfortably)" },
      { label: "Wardrobe & Study", val: "1.60m built-in wardrobe with study book nook" },
      { label: "Natural Light", val: "1000×1000mm steel casement window (West wall)" },
      { label: "Electrical", val: "1 central ceiling light + 2 double sockets" }
    ]
  },
  living: {
    title: "Open Living Lounge & Circulation",
    specs: [
      { label: "Dimensions", val: "4.80m × 2.80m Main Lounge Area" },
      { label: "Seating Layout", val: "Dual-zone sofa arrangement: 3-seater couch + 2 armchairs" },
      { label: "Walkway", val: "1.80m wide open corridor — zero middle chair blockage" },
      { label: "Natural Light", val: "Large 1500×1200mm front window beside main door" },
      { label: "Electrical", val: "TV aerial point, 3 double power outlets, 2 ceiling lights" }
    ]
  },
  kitchen: {
    title: "Corner Kitchen Pantry & Breakfast Bar",
    specs: [
      { label: "Cabinets", val: "L-shaped wall storage pantry (1.6m × 1.2m)" },
      { label: "Dining Island", val: "1.60m attached breakfast bar with 4 bar stools" },
      { label: "Open Space", val: "Uncluttered: no built-in cooker or sink blocking counter space" },
      { label: "Ventilation", val: "900×900mm window directly above counter" },
      { label: "Electrical", val: "2 dedicated appliance double sockets on counter backsplash" }
    ]
  }
};

// 4. APP STATE
let state = {
  region: 'nairobi',
  materials: JSON.parse(JSON.stringify(DEFAULT_MATERIALS)),
  completedPhases: [1], // phase 1 or none by default
  activeLevers: {
    leverSkillionRoof: false,
    leverQuarryDirect: true,
    leverKandarasiLabor: true,
    leverCementGrade: true,
    leverScreedOverTiles: false,
    leverTimberSpacing: true
  }
};

// Load saved state from localStorage if available
function loadState() {
  const saved = localStorage.getItem('jengasmart_5x8m_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.materials) state.materials = parsed.materials;
      if (parsed.region) state.region = parsed.region;
      if (parsed.completedPhases) state.completedPhases = parsed.completedPhases;
      if (parsed.activeLevers) state.activeLevers = parsed.activeLevers;
    } catch (e) {
      console.warn('Could not parse saved state:', e);
    }
  }
}

function saveState() {
  localStorage.setItem('jengasmart_5x8m_state', JSON.stringify(state));
}

// 5. DOM ELEMENTS
const regionSelect = document.getElementById('regionSelect');
const inventoryBody = document.getElementById('inventoryBody');
const grossTotalDisplay = document.getElementById('grossTotalDisplay');
const savedTotalDisplay = document.getElementById('savedTotalDisplay');
const netCashDisplay = document.getElementById('netCashDisplay');
const optSavingsDisplay = document.getElementById('optSavingsDisplay');
const stockCoverPercent = document.getElementById('stockCoverPercent');
const tableSpendTotal = document.getElementById('tableSpendTotal');
const tableStockTotal = document.getElementById('tableStockTotal');
const totalDeficitQtyCount = document.getElementById('totalDeficitQtyCount');
const meterActiveSavings = document.getElementById('meterActiveSavings');
const phasesTimeline = document.getElementById('phasesTimeline');
const buildProgressBar = document.getElementById('buildProgressBar');
const buildProgressPercent = document.getElementById('buildProgressPercent');
const shoppingListPrintable = document.getElementById('shoppingListPrintable');

// 6. INITIALIZATION & RENDERING
function init() {
  loadState();

  // Set region dropdown
  if (regionSelect) {
    regionSelect.value = state.region;
    regionSelect.addEventListener('change', (e) => {
      state.region = e.target.value;
      updateRatesForRegion();
      renderAll();
      saveState();
    });
  }

  // Bind Tab Navigation
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Bind Blueprint Sub-views
  document.querySelectorAll('.plan-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.plan-sub-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.plan-sub-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');
      if (view === 'floorplan') document.getElementById('subViewFloorplan')?.classList.add('active');
      if (view === 'topdown3d') document.getElementById('subViewTopdown3d')?.classList.add('active');
      if (view === 'entrance3d') document.getElementById('subViewEntrance3d')?.classList.add('active');
      if (view === 'roofs') document.getElementById('subViewRoofs')?.classList.add('active');
      if (view === 'fulldossier') document.getElementById('subViewFullDossier')?.classList.add('active');
    });
  });

  // Bind Optimizer Levers
  document.querySelectorAll('.cost-lever').forEach(checkbox => {
    const id = checkbox.id;
    if (state.activeLevers[id] !== undefined) {
      checkbox.checked = state.activeLevers[id];
    }
    checkbox.addEventListener('change', (e) => {
      state.activeLevers[id] = e.target.checked;
      renderAll();
      saveState();
    });
  });

  // Export / Print button
  const exportBtn = document.getElementById('exportShoppingListBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      // Switch to contract/shopping tab and trigger window print
      const contractTabBtn = document.querySelector('[data-tab="contractTab"]');
      if (contractTabBtn) contractTabBtn.click();
      setTimeout(() => window.print(), 300);
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('resetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('Reset all values back to initial project inventory?')) {
        localStorage.removeItem('jengasmart_5x8m_state');
        state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
        state.completedPhases = [];
        state.activeLevers = {
          leverSkillionRoof: false,
          leverQuarryDirect: true,
          leverKandarasiLabor: true,
          leverCementGrade: true,
          leverScreedOverTiles: false,
          leverTimberSpacing: true
        };
        renderAll();
      }
    });
  }

  renderAll();
}

// 7. REGIONAL RATE APPLICATION
function updateRatesForRegion() {
  const currentRates = REGIONAL_RATES[state.region];
  state.materials.forEach(mat => {
    if (currentRates[mat.rateKey]) {
      mat.defaultRate = currentRates[mat.rateKey];
    }
  });
}

// 8. RENDER ALL
function renderAll() {
  renderInventoryTable();
  renderCalculations();
  renderPhases();
  renderShoppingList();
}

// 9. INVENTORY TABLE
function renderInventoryTable() {
  if (!inventoryBody) return;
  inventoryBody.innerHTML = '';

  state.materials.forEach((item, index) => {
    const deficit = Math.max(0, item.required - item.inStock);
    const subtotalSpend = deficit * item.defaultRate;
    const stockVal = item.inStock * item.defaultRate;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="item-title">${item.name}</div>
        <div class="item-sub">${item.sub}</div>
      </td>
      <td><strong>${item.required.toLocaleString()}</strong> ${item.unit}</td>
      <td>
        <input type="number" min="0" class="input-number stock-input" data-index="${index}" value="${item.inStock}">
        <span class="item-sub">${item.unit}</span>
      </td>
      <td>
        <span class="badge-deficit ${deficit > 0 ? 'has-deficit' : 'is-covered'}">
          ${deficit > 0 ? `Needs +${deficit.toLocaleString()}` : '✓ Fully Covered'}
        </span>
      </td>
      <td>
        <input type="number" min="0" class="input-number rate-input" data-index="${index}" value="${item.defaultRate}">
      </td>
      <td class="font-bold text-primary">KES ${subtotalSpend.toLocaleString()}</td>
      <td class="font-bold text-green">KES ${stockVal.toLocaleString()}</td>
    `;
    inventoryBody.appendChild(tr);
  });

  // Attach input listeners
  inventoryBody.querySelectorAll('.stock-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      state.materials[idx].inStock = Math.max(0, parseFloat(e.target.value) || 0);
      renderCalculations();
      renderShoppingList();
      saveState();
    });
  });

  inventoryBody.querySelectorAll('.rate-input').forEach(input => {
    input.addEventListener('input', (e) => {
      const idx = parseInt(e.target.getAttribute('data-index'), 10);
      state.materials[idx].defaultRate = Math.max(0, parseFloat(e.target.value) || 0);
      renderCalculations();
      renderShoppingList();
      saveState();
    });
  });
}

// 10. REAL-TIME CALCULATIONS & METERS
function renderCalculations() {
  let grossMaterialsCost = 0;
  let ownedStockValue = 0;
  let netMaterialsSpend = 0;
  let deficitItemsCount = 0;

  state.materials.forEach(item => {
    const totalRequiredVal = item.required * item.defaultRate;
    const stockVal = Math.min(item.inStock, item.required) * item.defaultRate;
    const deficit = Math.max(0, item.required - item.inStock);
    const spend = deficit * item.defaultRate;

    grossMaterialsCost += totalRequiredVal;
    ownedStockValue += stockVal;
    netMaterialsSpend += spend;
    if (deficit > 0) deficitItemsCount++;
  });

  // Calculate active savings from levers
  let totalLeverSavings = 0;
  document.querySelectorAll('.cost-lever').forEach(checkbox => {
    if (checkbox.checked) {
      const savings = parseFloat(checkbox.getAttribute('data-savings')) || 0;
      totalLeverSavings += savings;
    }
  });

  // Estimated Labor baseline for 5x8m (approx KES 150,000 baseline)
  const baselineLabor = 150000;
  const grossProjectTotal = grossMaterialsCost + baselineLabor;
  
  // Net cash needed = (materials to buy + baseline labor) - active tactical savings
  const netCashNeeded = Math.max(0, (netMaterialsSpend + baselineLabor) - totalLeverSavings);

  // Update Header Meters
  if (grossTotalDisplay) grossTotalDisplay.textContent = `KES ${grossProjectTotal.toLocaleString()}`;
  if (savedTotalDisplay) savedTotalDisplay.textContent = `KES ${ownedStockValue.toLocaleString()}`;
  if (netCashDisplay) netCashDisplay.textContent = `KES ${Math.round(netCashNeeded).toLocaleString()}`;
  if (optSavingsDisplay) optSavingsDisplay.textContent = `KES ${totalLeverSavings.toLocaleString()}`;

  const stockPercent = Math.min(100, Math.round((ownedStockValue / grossMaterialsCost) * 100)) || 0;
  if (stockCoverPercent) stockCoverPercent.textContent = `${stockPercent}% materials value covered`;

  // Update Table Footers
  if (tableSpendTotal) tableSpendTotal.textContent = `KES ${netMaterialsSpend.toLocaleString()}`;
  if (tableStockTotal) tableStockTotal.textContent = `KES ${ownedStockValue.toLocaleString()}`;
  if (totalDeficitQtyCount) totalDeficitQtyCount.textContent = `${deficitItemsCount} items need purchase`;
  if (meterActiveSavings) meterActiveSavings.textContent = `KES ${totalLeverSavings.toLocaleString()}`;
}

// 11. PHASES TIMELINE
function renderPhases() {
  if (!phasesTimeline) return;
  phasesTimeline.innerHTML = '';

  const totalPhases = CONSTRUCTION_PHASES.length;
  const completedCount = state.completedPhases.length;
  const percent = Math.round((completedCount / totalPhases) * 100);

  if (buildProgressBar) buildProgressBar.style.width = `${percent}%`;
  if (buildProgressPercent) buildProgressPercent.textContent = `${percent}%`;

  CONSTRUCTION_PHASES.forEach(phase => {
    const isDone = state.completedPhases.includes(phase.id);

    const card = document.createElement('div');
    card.className = `phase-item-card ${isDone ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="phase-number-badge">${isDone ? '✓' : phase.id}</div>
      <div class="phase-body">
        <h3>${phase.title}</h3>
        <p>${phase.desc}</p>
        <div class="phase-material-pills">
          ${phase.materials.map(m => `<span class="phase-mat-pill">${m}</span>`).join('')}
          <span class="phase-mat-pill" style="color: #38bdf8;">Est. Duration: ${phase.duration}</span>
        </div>
      </div>
      <div class="phase-action-col">
        <span class="phase-cost-tag">KES ${phase.estCost.toLocaleString()}</span>
        <label class="phase-checkbox-label">
          <input type="checkbox" class="phase-chk" data-phase-id="${phase.id}" ${isDone ? 'checked' : ''}>
          ${isDone ? 'Completed' : 'Mark Completed'}
        </label>
      </div>
    `;
    phasesTimeline.appendChild(card);
  });

  // Attach phase checkbox toggles
  phasesTimeline.querySelectorAll('.phase-chk').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const pId = parseInt(e.target.getAttribute('data-phase-id'), 10);
      if (e.target.checked) {
        if (!state.completedPhases.includes(pId)) state.completedPhases.push(pId);
      } else {
        state.completedPhases = state.completedPhases.filter(id => id !== pId);
      }
      renderPhases();
      saveState();
    });
  });
}

// 12. HARDWARE SHOPPING LIST (ONLY DEFICITS)
function renderShoppingList() {
  if (!shoppingListPrintable) return;
  shoppingListPrintable.innerHTML = '';

  const deficitItems = state.materials.filter(m => (m.required - m.inStock) > 0);

  if (deficitItems.length === 0) {
    shoppingListPrintable.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: #10b981;">
        <h3>🎉 Congratulations, Devin!</h3>
        <p>All materials required for your 5x8m house are currently marked as in-stock.</p>
      </div>
    `;
    return;
  }

  let totalDeficitCost = 0;

  deficitItems.forEach(item => {
    const deficitQty = item.required - item.inStock;
    const estCost = deficitQty * item.defaultRate;
    totalDeficitCost += estCost;

    const row = document.createElement('div');
    row.className = 'shopping-item-row';
    row.innerHTML = `
      <div>
        <div class="shopping-item-name">${item.name}</div>
        <div class="shopping-item-sub">${item.sub}</div>
      </div>
      <div style="text-align: right;">
        <div class="shopping-item-qty">${deficitQty.toLocaleString()} ${item.unit}</div>
        <div class="shopping-item-sub">~KES ${estCost.toLocaleString()}</div>
      </div>
    `;
    shoppingListPrintable.appendChild(row);
  });

  const totalRow = document.createElement('div');
  totalRow.className = 'shopping-item-row';
  totalRow.style.marginTop = '1rem';
  totalRow.style.borderTop = '2px solid rgba(255,255,255,0.15)';
  totalRow.style.paddingTop = '1rem';
  totalRow.innerHTML = `
    <div>
      <strong style="color: #fff; font-size: 1rem;">DEVIN'S TOTAL HARDWARE DEFICIT</strong>
    </div>
    <div style="text-align: right;">
      <strong style="color: #38bdf8; font-size: 1.15rem; font-family: var(--font-mono);">KES ${totalDeficitCost.toLocaleString()}</strong>
    </div>
  `;
  shoppingListPrintable.appendChild(totalRow);
}

// 13. INTERACTIVE ROOM SELECTOR (BLUEPRINT)
window.selectRoom = function(roomKey) {
  const room = ROOM_DATA[roomKey];
  if (!room) return;

  const titleEl = document.getElementById('roomDetailTitle');
  const specsEl = document.getElementById('roomDetailSpecs');

  if (titleEl) titleEl.textContent = room.title;
  if (specsEl) {
    specsEl.innerHTML = room.specs.map(s => `
      <div class="spec-row">
        <span>${s.label}:</span>
        <strong>${s.val}</strong>
      </div>
    `).join('');
  }
};

// Start application
document.addEventListener('DOMContentLoaded', init);
