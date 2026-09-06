/**
 * JengaSmart Kenya — Devin's Special Edition
 * Core Application Logic, Calculation Engine, Audio Synthesizer & AI Copilot
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
    timber2x4: 65,
    timber2x2: 35,
    roofingNails: 280,
    wireNails: 180,
    ridgeCap: 700,
    steelWindow: 6500,
    flushDoor: 4500
  },
  western: {
    brick: 8,
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
    timber2x4: 50,
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
    inStock: 2000, // Devin's preloaded inventory
    rateKey: 'brick',
    defaultRate: 10
  },
  {
    id: 'mabati',
    name: 'G28 Corrugated Mabati (Iron Sheets)',
    sub: 'Roofing cover for 8.9m x 6.0m gable pitch',
    unit: 'sheets',
    required: 24,
    inStock: 15, // Devin's preloaded inventory
    rateKey: 'ironSheet',
    defaultRate: 1450
  },
  {
    id: 'cement',
    name: 'Portland Cement (50kg bags)',
    sub: 'Footing, slab, ring beam, mortar & plaster',
    unit: 'bags',
    required: 90,
    inStock: 20, // Devin's preloaded inventory
    rateKey: 'cement',
    defaultRate: 780
  },
  {
    id: 'sand',
    name: 'Clean River Sand',
    sub: 'Concrete casting, mortar mix & interior plaster',
    unit: 'tons',
    required: 17,
    inStock: 10, // Devin's preloaded inventory
    rateKey: 'sandTon',
    defaultRate: 1600
  },
  {
    id: 'ballast',
    name: 'Granite Ballast (3/4" aggregate)',
    sub: 'Foundation footing, 100mm floor slab & ring beam',
    unit: 'tons',
    required: 11,
    inStock: 3, // Devin's preloaded inventory
    rateKey: 'ballastTon',
    defaultRate: 1500
  },
  {
    id: 'rebarD8',
    name: 'D8 Ribbed Rebar (12m rods)',
    sub: 'Ring beam main tension bars (4 longitudinal bars)',
    unit: 'pcs',
    required: 14,
    inStock: 14, // Devin's preloaded (fully covered)
    rateKey: 'rebarD8',
    defaultRate: 750
  },
  {
    id: 'rebarR6',
    name: 'R6 Mild Steel Wall Ties / Stirrups',
    sub: 'Ring beam stirrup rings @ 200mm centers',
    unit: 'pcs',
    required: 10,
    inStock: 10, // Devin's preloaded (fully covered)
    rateKey: 'rebarR6',
    defaultRate: 420
  },
  {
    id: 'bindingWire',
    name: 'Binding Wire (Standard Gauge)',
    sub: 'Tying rebar intersections and stirrups',
    unit: 'kg',
    required: 3,
    inStock: 3, // Devin's preloaded (fully covered)
    rateKey: 'bindingWire',
    defaultRate: 250
  },
  {
    id: 'dpm',
    name: '1000-Gauge Waterproof DPM Sheeting',
    sub: 'Damp-proof membrane under ground floor slab',
    unit: 'rolls',
    required: 8,
    inStock: 8, // Devin's preloaded (fully covered)
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

// 4. ROOM DETAILS DATA FOR BLUEPRINT
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

// 5. KENYA DEBE BATCHING RATIOS
const BATCH_RATIOS = {
  concrete: {
    cement: "1 Bag (50kg)",
    sand: "2 Wheelbarrows (4 Debes)",
    ballast: "4 Wheelbarrows (8 Debes)",
    note: "💡 Standard 1:2:4 Structural Mix for Devin's 100mm floor slab & 200mm ring beam. Water limit: Max 1.5 Debes (30 Liters) per bag to prevent slab shrinkage cracks."
  },
  mortar: {
    cement: "1 Bag (50kg)",
    sand: "3 Wheelbarrows (6 Debes)",
    ballast: "0 (None for mortar)",
    note: "💡 1:4 Brick Laying Mortar Mix for Devin's clay bricks. Tip: Soak the clay bricks in water 15 minutes before laying so they don't suck moisture out of the cement mortar!"
  },
  plaster: {
    cement: "1 Bag (50kg)",
    sand: "2.5 Wheelbarrows (5 Debes of fine screened sand)",
    ballast: "0 (None)",
    note: "💡 1:3 Plaster Mix. Sand MUST be sieved through fine wire mesh to remove pebbles. Add waterproof bonding agent (e.g. Sika-1 or Pudlo) for external ground-splash protection."
  }
};

// 6. AI COPILOT KNOWLEDGE BASE FOR DEVIN
const COPILOT_ANSWERS = {
  silt: "🧪 **How to do the Sand Silt Bottle Test on Site:**\n1. Take a transparent glass bottle (e.g. 500ml water bottle).\n2. Fill 1/3 with your delivered river sand.\n3. Add clean water until 3/4 full, add 1 teaspoon salt, and shake vigorously for 1 minute.\n4. Let it settle on a flat surface for 3 hours.\n5. You will see clean sand at the bottom and a darker muddy layer (silt/clay) on top.\n6. **Rule:** If the silt layer is thicker than 6% of the total sand height, REJECT the lorry! High silt causes crumbly plaster and cracked walls.",
  quarrydust: "🪨 **Can Devin Use Quarry Dust Instead of Sand? YES, BUT WITH RULES:**\n\n1. **100% Replacement for Hardcore Blinding:** YES! Use pure quarry dust (2-3 inches) over your foundation hardcore before laying your 8 rolls of DPM plastic. Saves KES ~12,000.\n\n2. **50/50 Blend for Floor Slab (100mm):** Mix 1 Wheelbarrow Quarry Dust + 1 Wheelbarrow River Sand for every 1 bag of cement + 4 Wheelbarrows ballast. Gives high strength and zero shrinkage cracks!\n\n3. **50/50 Blend for Brick Mortar:** Mix 1.5 Wheelbarrows Quarry Dust + 1.5 Wheelbarrows River Sand per 1 bag cement. Smooth, strong bond for your 2,000 bricks.\n\n4. **Wall Plastering WARNING:** Do NOT use 100% quarry dust for wall plaster! Its fine powder causes hairline drying cracks. For plaster, use at least 70% river sand or wash the quarry dust to remove dust powder.",
  monopitch: "📐 **Devin's 4 Mono-Pitch Roof Designs Tailored to Your 5×8m Footprint:**\n\n⭐ **Design 1: High-Front Skillion (Front-to-Back 10° Fall)**\n• Front wall at 3.60m, rear at 2.85m. Maximizes airy living room height (3.3m clear).\n• Simplest carpentry (5.6m single-run 4x2 rafters). 100% rain to single rear tank gutter.\n• Requires 20 mabati (deficit only 5 sheets!). Saves KES 28,500!\n\n🏢 **Design 2: Parapet Hidden Mono-Pitch ('Flat Cube Villa')**\n• Modern cubic estate villa look (like high-end Nairobi villas) with zero visible metal eaves from the road!\n• Slope is hidden behind a 450mm brick/stone parapet wall with coping stones.\n• Excellent wind resistance and puts your 2,000 bricks to great use!\n\n🪟 **Design 3: Split-Level Clerestory (Dual Stepped Shed)**\n• High lounge roof (3.80m) and lower bedroom roof (2.65m) with an 800mm glass clerestory window band between them.\n• Floods daylight into the center corridor & bathroom! Hot air escapes naturally.\n\n📐 **Design 4: Side-to-Side Longitudinal (8m Fall)**\n• Slopes across the 8m length. Requires only a single 5m gutter on the side!\n\n⚡ **Fundi Directive:** For all designs, anchor 4x2 rafters using 25mm hoop iron straps cast directly into the concrete ring beam against wind uplift!",
  curing: "💧 **Devin's 7-Day Concrete Curing Directive:**\n• Concrete doesn't 'dry' to get hard—it cures through a chemical reaction (hydration) that demands water.\n• For the first 7 days after casting your floor slab or ring beam, have your fundi spray water twice daily (morning & evening) or cover the slab with wet gunny bags/sand berms.\n• **Fact:** Skipping curing cuts concrete strength by over 45% and causes spiderweb surface cracks!",
  theft: "🔒 **Preventing Cement & Rebar Leakage in Kenya:**\n1. Count every single bag offloaded from the lorry yourself or have a trusted relative present.\n2. Require the fundi to return the **EMPTY paper bags** every evening before paying daily wages (ensures bags weren't resold or taken off site).\n3. Keep cement off the ground on timber pallets covered with your DPM polythene rolls to prevent rising soil moisture from hardening bags into stones.",
  bricks: "🧱 **Utilizing Devin's 2,000 Bricks Efficiently:**\n• Your 2,000 bricks are ideally suited for the **substructure foundation footing wall** (from strip footing up to DPC floor level).\n• Because foundation bricks are buried under backfill, you can use these 2,000 bricks right away in Phase 2.\n• For Phase 3 superstructure (walling to ring beam), you will need ~5,000 more bricks (~KES 50,000) or 480 quarry machine-cut stones (9\"x9\")."
};

// 7. APP STATE
let state = {
  region: 'nairobi',
  soundEnabled: true,
  nightMode: false,
  roofDesign: 'gable',
  materials: JSON.parse(JSON.stringify(DEFAULT_MATERIALS)),
  completedPhases: [1],
  curingDays: [1, 2],
  activeLevers: {
    leverSkillionRoof: false,
    leverQuarryDirect: true,
    leverKandarasiLabor: true,
    leverCementGrade: true,
    leverScreedOverTiles: false,
    leverTimberSpacing: true,
    leverQuarryDust: true
  }
};

function loadState() {
  const saved = localStorage.getItem('jengasmart_devin_state');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.materials) state.materials = parsed.materials;
      if (parsed.region) state.region = parsed.region;
      if (parsed.roofDesign) state.roofDesign = parsed.roofDesign;
      if (parsed.completedPhases) state.completedPhases = parsed.completedPhases;
      if (parsed.activeLevers) state.activeLevers = parsed.activeLevers;
      if (parsed.curingDays) state.curingDays = parsed.curingDays;
      if (parsed.soundEnabled !== undefined) state.soundEnabled = parsed.soundEnabled;
    } catch (e) {
      console.warn('Could not parse state:', e);
    }
  }
}

function saveState() {
  localStorage.setItem('jengasmart_devin_state', JSON.stringify(state));
}

// ROOF DESIGN SWITCHER (Gable vs 4 Mono-Pitch Variations)
window.setRoofDesign = function(type) {
  state.roofDesign = type;
  const isGable = type === 'gable';
  const isMono = !isGable;

  // Update Tab 1 buttons
  const buttons = {
    gable: document.getElementById('btnRoofGable'),
    skillion: document.getElementById('btnRoofSkillion'),
    parapet: document.getElementById('btnRoofParapet'),
    split: document.getElementById('btnRoofSplit'),
    side: document.getElementById('btnRoofSide')
  };

  Object.keys(buttons).forEach(key => {
    if (buttons[key]) {
      const shouldBeActive = (key === type) || (key === 'skillion' && (type === 'monopitch' || !type));
      buttons[key].classList.toggle('active', shouldBeActive);
    }
  });

  // Adjust materials array for Devin
  const ironSheetItem = state.materials.find(m => m.id === 'ironSheets');
  const ridgeCapItem = state.materials.find(m => m.id === 'ridgeCaps');
  const timberRaftersItem = state.materials.find(m => m.id === 'timberRafters');
  const timberPurlinsItem = state.materials.find(m => m.id === 'timberPurlins');

  if (type === 'split') {
    if (ironSheetItem) ironSheetItem.required = 21;
    if (ridgeCapItem) ridgeCapItem.required = 0;
    if (timberRaftersItem) timberRaftersItem.required = 440;
    if (timberPurlinsItem) timberPurlinsItem.required = 400;
  } else if (isMono) {
    if (ironSheetItem) ironSheetItem.required = 20;
    if (ridgeCapItem) ridgeCapItem.required = 0;
    if (timberRaftersItem) timberRaftersItem.required = (type === 'side') ? 400 : 410;
    if (timberPurlinsItem) timberPurlinsItem.required = (type === 'side') ? 380 : 390;
  } else {
    // Traditional Gable
    if (ironSheetItem) ironSheetItem.required = 24;
    if (ridgeCapItem) ridgeCapItem.required = 5;
    if (timberRaftersItem) timberRaftersItem.required = 520;
    if (timberPurlinsItem) timberPurlinsItem.required = 480;
  }

  // Sync with lever checkbox if present
  const skillionLever = document.getElementById('leverSkillionRoof');
  if (skillionLever) {
    skillionLever.checked = isMono;
    state.activeLevers.leverSkillionRoof = isMono;
  }

  renderInventory();
  renderCalculations();
  renderShoppingList();
  saveState();
  playSound(isMono ? 'fanfare' : 'click');
  if (isMono) triggerConfetti();
};

window.showMpVariant = function(variantId) {
  document.querySelectorAll('.mp-variant-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.mp-variant-panel').forEach(panel => panel.classList.remove('active'));

  const idCap = variantId.charAt(0).toUpperCase() + variantId.slice(1);
  const activeBtn = document.getElementById(`btnVar${idCap}`);
  const activePanel = document.getElementById(`mpPanel${idCap}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
  playSound('click');
};

function syncRoofDesignWithLever(isChecked) {
  setRoofDesign(isChecked ? 'skillion' : 'gable');
}

// 8. AUDIO SYNTHESIZER (WEB AUDIO API)
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playSound(type) {
  if (!state.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'chime') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.12, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.18);
      });
    } else if (type === 'fanfare') {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    }
  } catch (e) {
    // Silent fail for audio
  }
}

// 9. CONFETTI CANNON CELEBRATION
function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#10b981', '#38bdf8', '#fbbf24', '#a855f7', '#f43f5e', '#ffffff'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 18,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // gravity
      p.rotation += p.vRot;
      p.alpha -= 0.008;

      if (p.alpha > 0) {
        activeCount++;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    });

    if (activeCount > 0) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }
  render();
}

// 10. DOM REFERENCES
const regionSelect = document.getElementById('regionSelect');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const whatsappShareBtn = document.getElementById('whatsappShareBtn');
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
const curingDaysGrid = document.getElementById('curingDaysGrid');

// 11. INITIALIZATION
function init() {
  loadState();

  // Region dropdown
  if (regionSelect) {
    regionSelect.value = state.region;
    regionSelect.addEventListener('change', (e) => {
      state.region = e.target.value;
      updateRatesForRegion();
      renderAll();
      saveState();
      playSound('click');
    });
  }

  // Sound Toggle Button
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      soundToggleBtn.textContent = state.soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF';
      soundToggleBtn.className = `btn btn-sound ${state.soundEnabled ? 'sound-on' : ''}`;
      playSound('click');
      saveState();
    });
  }

  // WhatsApp Share Button
  if (whatsappShareBtn) {
    whatsappShareBtn.addEventListener('click', generateWhatsAppOrder);
  }

  // Navigation Tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const targetPane = document.getElementById(targetId);
      if (targetPane) targetPane.classList.add('active');
      playSound('click');
    });
  });

  // Blueprint Sub-Views
  document.querySelectorAll('.plan-sub-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.plan-sub-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.plan-sub-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');
      if (view === 'floorplan') document.getElementById('subViewFloorplan')?.classList.add('active');
      if (view === 'monopitch') document.getElementById('subViewMonopitch')?.classList.add('active');
      if (view === 'topdown3d') document.getElementById('subViewTopdown3d')?.classList.add('active');
      if (view === 'entrance3d') document.getElementById('subViewEntrance3d')?.classList.add('active');
      if (view === 'roofs') document.getElementById('subViewRoofs')?.classList.add('active');
      if (view === 'fulldossier') document.getElementById('subViewFullDossier')?.classList.add('active');
      playSound('click');
    });
  });

  // Cost Minimizer Levers
  document.querySelectorAll('.cost-lever').forEach(checkbox => {
    const id = checkbox.id;
    if (state.activeLevers[id] !== undefined) {
      checkbox.checked = state.activeLevers[id];
    }
    checkbox.addEventListener('change', (e) => {
      state.activeLevers[id] = e.target.checked;
      if (id === 'leverSkillionRoof') {
        syncRoofDesignWithLever(e.target.checked);
      }
      renderCalculations();
      saveState();
      playSound('chime');
    });
  });

  // Sync roof design toggle button state on initial load
  const curRoof = state.roofDesign || (state.activeLevers.leverSkillionRoof ? 'skillion' : 'gable');
  setRoofDesign(curRoof);

  // Export / Print button
  const exportBtn = document.getElementById('exportShoppingListBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const contractTabBtn = document.querySelector('[data-tab="contractTab"]');
      if (contractTabBtn) contractTabBtn.click();
      setTimeout(() => window.print(), 300);
    });
  }

  // Reset Button
  const resetBtn = document.getElementById('resetDefaultsBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm("Reset Devin's data back to starting site inventory?")) {
        localStorage.removeItem('jengasmart_devin_state');
        state.materials = JSON.parse(JSON.stringify(DEFAULT_MATERIALS));
        state.completedPhases = [1];
        state.curingDays = [1, 2];
        state.activeLevers = {
          leverSkillionRoof: false,
          leverQuarryDirect: true,
          leverKandarasiLabor: true,
          leverCementGrade: true,
          leverScreedOverTiles: false,
          leverTimberSpacing: true
        };
        renderAll();
        playSound('click');
      }
    });
  }

  renderAll();
  renderCuringTracker();
}

// 12. REGIONAL RATE APPLICATION
function updateRatesForRegion() {
  const currentRates = REGIONAL_RATES[state.region];
  state.materials.forEach(mat => {
    if (currentRates[mat.rateKey]) {
      mat.defaultRate = currentRates[mat.rateKey];
    }
  });
}

// 13. RENDER ALL
function renderAll() {
  renderInventoryTable();
  renderCalculations();
  renderPhases();
  renderShoppingList();
}

// 14. INVENTORY TABLE
function renderInventoryTable() {
  if (!inventoryBody) return;
  inventoryBody.innerHTML = '';

  state.materials.forEach((item, index) => {
    const deficit = Math.max(0, item.required - item.inStock);
    const subtotalSpend = deficit * item.defaultRate;
    const stockVal = item.inStock * item.defaultRate;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td data-label="Material">
        <div class="item-title">${item.name}</div>
        <div class="item-sub">${item.sub}</div>
      </td>
      <td data-label="Required"><strong>${item.required.toLocaleString()}</strong> ${item.unit}</td>
      <td data-label="You Have">
        <div style="display: flex; align-items: center; gap: 0.4rem;">
          <input type="number" min="0" class="input-number stock-input" data-index="${index}" value="${item.inStock}">
          <span class="item-sub">${item.unit}</span>
        </div>
      </td>
      <td data-label="Deficit Status">
        <span class="badge-deficit ${deficit > 0 ? 'has-deficit' : 'is-covered'}">
          ${deficit > 0 ? `Needs +${deficit.toLocaleString()}` : '✓ Fully Covered'}
        </span>
      </td>
      <td data-label="Unit Rate (KES)">
        <input type="number" min="0" class="input-number rate-input" data-index="${index}" value="${item.defaultRate}">
      </td>
      <td data-label="To Spend" class="font-bold text-primary">KES ${subtotalSpend.toLocaleString()}</td>
      <td data-label="Stock Value" class="font-bold text-green">KES ${stockVal.toLocaleString()}</td>
    `;
    inventoryBody.appendChild(tr);
  });

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

// 15. CALCULATIONS
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

  let totalLeverSavings = 0;
  document.querySelectorAll('.cost-lever').forEach(checkbox => {
    if (checkbox.checked) {
      const savings = parseFloat(checkbox.getAttribute('data-savings')) || 0;
      totalLeverSavings += savings;
    }
  });

  const baselineLabor = 150000;
  const grossProjectTotal = grossMaterialsCost + baselineLabor;
  const netCashNeeded = Math.max(0, (netMaterialsSpend + baselineLabor) - totalLeverSavings);

  if (grossTotalDisplay) grossTotalDisplay.textContent = `KES ${grossProjectTotal.toLocaleString()}`;
  if (savedTotalDisplay) savedTotalDisplay.textContent = `KES ${ownedStockValue.toLocaleString()}`;
  if (netCashDisplay) netCashDisplay.textContent = `KES ${Math.round(netCashNeeded).toLocaleString()}`;
  if (optSavingsDisplay) optSavingsDisplay.textContent = `KES ${totalLeverSavings.toLocaleString()}`;

  const stockPercent = Math.min(100, Math.round((ownedStockValue / grossMaterialsCost) * 100)) || 0;
  if (stockCoverPercent) stockCoverPercent.textContent = `${stockPercent}% materials value covered`;

  if (tableSpendTotal) tableSpendTotal.textContent = `KES ${netMaterialsSpend.toLocaleString()}`;
  if (tableStockTotal) tableStockTotal.textContent = `KES ${ownedStockValue.toLocaleString()}`;
  if (totalDeficitQtyCount) totalDeficitQtyCount.textContent = `${deficitItemsCount} items need purchase`;
  if (meterActiveSavings) meterActiveSavings.textContent = `KES ${totalLeverSavings.toLocaleString()}`;
}

// 16. PHASES TIMELINE
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

  phasesTimeline.querySelectorAll('.phase-chk').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const pId = parseInt(e.target.getAttribute('data-phase-id'), 10);
      if (e.target.checked) {
        if (!state.completedPhases.includes(pId)) {
          state.completedPhases.push(pId);
          playSound('fanfare');
          triggerConfetti();
        }
      } else {
        state.completedPhases = state.completedPhases.filter(id => id !== pId);
        playSound('click');
      }
      renderPhases();
      saveState();
    });
  });
}

// 17. SHOPPING LIST
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

// 18. WHATSAPP ORDER GENERATOR
function generateWhatsAppOrder() {
  playSound('click');
  const deficitItems = state.materials.filter(m => (m.required - m.inStock) > 0);
  let totalCost = 0;

  let text = `*DEVIN'S 5×8m HOUSE — HARDWARE PURCHASE ORDER* 🇰🇪\n`;
  text += `Location: Kenya\n`;
  text += `------------------------------------\n`;

  deficitItems.forEach(item => {
    const qty = item.required - item.inStock;
    const subtotal = qty * item.defaultRate;
    totalCost += subtotal;
    text += `• ${item.name}: *${qty.toLocaleString()} ${item.unit}* (~KES ${subtotal.toLocaleString()})\n`;
  });

  text += `------------------------------------\n`;
  text += `*ESTIMATED BUDGET: KES ${totalCost.toLocaleString()}*\n\n`;
  text += `Habari, please review this order and provide your best cash-on-delivery quotation. Thank you! — Devin`;

  const encoded = encodeURIComponent(text);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encoded}`;

  // Copy to clipboard
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert("📋 Devin's Hardware Order copied to clipboard! Opening WhatsApp...");
      window.open(whatsappUrl, '_blank');
    }).catch(() => {
      window.open(whatsappUrl, '_blank');
    });
  } else {
    window.open(whatsappUrl, '_blank');
  }
}

// 19. BLUEPRINT LIGHTING SIMULATOR
window.toggleBlueprintLighting = function() {
  state.nightMode = !state.nightMode;
  const svg = document.getElementById('blueprintSvg');
  const icon = document.getElementById('lightToggleIcon');
  const text = document.getElementById('lightToggleText');

  if (svg) svg.classList.toggle('night-mode', state.nightMode);
  if (icon) icon.textContent = state.nightMode ? '☀️' : '🌙';
  if (text) text.textContent = state.nightMode ? 'Day Mode' : 'Night Mode';
  playSound('click');
};

// 20. ROOM SELECTOR
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
  playSound('click');
};

// 21. DEBE BATCHING STATION
window.setBatchMix = function(mixType) {
  playSound('click');
  document.querySelectorAll('.batch-btn').forEach(b => b.classList.remove('active'));
  const activeBtn = document.querySelector(`.batch-btn[data-mix="${mixType}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  const data = BATCH_RATIOS[mixType] || BATCH_RATIOS.concrete;
  const cEl = document.getElementById('batchCementQty');
  const sEl = document.getElementById('batchSandQty');
  const bEl = document.getElementById('batchBallastQty');
  const nEl = document.getElementById('batchNote');

  if (cEl) cEl.textContent = data.cement;
  if (sEl) sEl.textContent = data.sand;
  if (bEl) bEl.textContent = data.ballast;
  if (nEl) nEl.innerHTML = data.note;
};

// 22. 7-DAY CURING TRACKER
function renderCuringTracker() {
  if (!curingDaysGrid) return;
  curingDaysGrid.innerHTML = '';

  for (let day = 1; day <= 7; day++) {
    const isDone = state.curingDays.includes(day);
    const box = document.createElement('div');
    box.className = `curing-day-box ${isDone ? 'done' : ''}`;
    box.innerHTML = `
      <div class="day-num">Day ${day}</div>
      <span style="font-size: 1.2rem;">${isDone ? '💧' : '⏳'}</span>
      <div class="day-status">${isDone ? 'Watered ✓' : 'Pending'}</div>
    `;
    box.addEventListener('click', () => {
      if (state.curingDays.includes(day)) {
        state.curingDays = state.curingDays.filter(d => d !== day);
      } else {
        state.curingDays.push(day);
        playSound('chime');
      }
      renderCuringTracker();
      saveState();
    });
    curingDaysGrid.appendChild(box);
  }
}

// 23. JENGA AI SITE ADVISOR CHAT
window.sendChatMessage = function() {
  const input = document.getElementById('chatInput');
  const box = document.getElementById('chatMessages');
  if (!input || !box) return;

  const msg = input.value.trim();
  if (!msg) return;

  // Append user message
  const userDiv = document.createElement('div');
  userDiv.className = 'chat-bubble user';
  userDiv.textContent = msg;
  box.appendChild(userDiv);
  input.value = '';
  playSound('click');

  // Generate bot reply
  setTimeout(() => {
    let reply = "Pole Devin, I didn't recognize that specific question. Try asking about 'sand silt test', 'concrete curing', '2,000 bricks', or 'fundi theft control'!";
    const lower = msg.toLowerCase();

    if (lower.includes('mono') || lower.includes('skillion') || lower.includes('shed') || lower.includes('pitch')) {
      reply = COPILOT_ANSWERS.monopitch;
    } else if (lower.includes('quarry') || lower.includes('dust') || lower.includes('vumbi')) {
      reply = COPILOT_ANSWERS.quarrydust;
    } else if (lower.includes('silt') || lower.includes('sand') || lower.includes('soil')) {
      reply = COPILOT_ANSWERS.silt;
    } else if (lower.includes('cure') || lower.includes('curing') || lower.includes('water') || lower.includes('wet')) {
      reply = COPILOT_ANSWERS.curing;
    } else if (lower.includes('theft') || lower.includes('steal') || lower.includes('leak') || lower.includes('empty bag')) {
      reply = COPILOT_ANSWERS.theft;
    } else if (lower.includes('brick') || lower.includes('2000') || lower.includes('wall')) {
      reply = COPILOT_ANSWERS.bricks;
    } else if (lower.includes('mabati') || lower.includes('roof') || lower.includes('sheet')) {
      reply = "🏠 **Devin's Roof Advice:** You have 15 iron sheets. If you choose the **Skillion (Mono-pitch) roof**, you only need 20 sheets total (buy 5 more!). If you choose the traditional Gable roof, you need 24 sheets (buy 9 more). The skillion saves KES ~28,500!";
    } else if (lower.includes('rebar') || lower.includes('ring beam') || lower.includes('d8')) {
      reply = "🏗️ **Ring Beam Status:** Devin, your D8 & R6 rebar + 3kg binding wire 100% covers the ring beam! Ensure fundis use 4 longitudinal D8 bars with R6 stirrups spaced at 200mm center-to-center.";
    }

    const botDiv = document.createElement('div');
    botDiv.className = 'chat-bubble bot';
    botDiv.innerHTML = reply.replace(/\n/g, '<br>');
    box.appendChild(botDiv);
    box.scrollTop = box.scrollHeight;
    playSound('chime');
  }, 400);
};

window.askPreset = function(type) {
  const box = document.getElementById('chatMessages');
  if (!box) return;

  const questions = {
    monopitch: "How does the Mono-Pitch roof work and how do we construct it?",
    quarrydust: "Can I use quarry dust instead of river sand?",
    silt: "How do I test my river sand for silt on site?",
    curing: "What is the 7-day concrete curing rule?",
    theft: "How do I prevent cement and rebar theft by fundis?",
    bricks: "How will my 2,000 bricks be used in the build?"
  };

  const userDiv = document.createElement('div');
  userDiv.className = 'chat-bubble user';
  userDiv.textContent = questions[type] || type;
  box.appendChild(userDiv);
  playSound('click');

  setTimeout(() => {
    const botDiv = document.createElement('div');
    botDiv.className = 'chat-bubble bot';
    botDiv.innerHTML = (COPILOT_ANSWERS[type] || "Checking answer...").replace(/\n/g, '<br>');
    box.appendChild(botDiv);
    box.scrollTop = box.scrollHeight;
    playSound('chime');
  }, 350);
};

// ==========================================================================
// PWA BROWSER APP INSTALLATION LOGIC
// ==========================================================================
let deferredInstallPrompt = null;

// Listen for browser install prompt event (Chrome, Edge, Android, etc.)
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstallPrompt = e;

  const installBtn = document.getElementById('pwaInstallBtn');
  const floatingBanner = document.getElementById('pwaFloatingBanner');

  if (installBtn) installBtn.style.display = 'inline-flex';
  
  // Show floating banner if user hasn't dismissed it in this session
  if (floatingBanner && !sessionStorage.getItem('jengasmart_pwa_dismissed')) {
    floatingBanner.style.display = 'flex';
  }
});

// Check if app is already running in standalone PWA window
window.addEventListener('DOMContentLoaded', () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  const installBtn = document.getElementById('pwaInstallBtn');
  if (isStandalone && installBtn) {
    installBtn.innerHTML = '✓ App Installed';
    installBtn.style.display = 'inline-flex';
    installBtn.disabled = true;
    installBtn.style.background = 'rgba(16, 185, 129, 0.2)';
    installBtn.style.borderColor = '#10b981';
  }
});

window.triggerPwaInstall = async function() {
  playSound('click');
  if (!deferredInstallPrompt) {
    // If browser hasn't fired beforeinstallprompt or on iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      alert("📲 To install Devin's JengaSmart on your iPhone/iPad:\n1. Tap the 'Share' icon (square with arrow up at bottom of screen)\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' in the top right corner.");
    } else {
      alert("📲 To install Devin's JengaSmart on your PC / Mac / Android:\n• In Chrome/Edge on PC: Click the 'Install' icon in the URL address bar (top right)\n• On Android: Tap the 3 dots menu (⋮) and choose 'Install App' or 'Add to Home screen'.");
    }
    return;
  }

  deferredInstallPrompt.prompt();
  const choiceResult = await deferredInstallPrompt.userChoice;
  
  if (choiceResult.outcome === 'accepted') {
    triggerConfetti();
    playSound('fanfare');
    const installBtn = document.getElementById('pwaInstallBtn');
    const floatingBanner = document.getElementById('pwaFloatingBanner');
    if (installBtn) {
      installBtn.innerHTML = '✓ App Installed';
      installBtn.disabled = true;
    }
    if (floatingBanner) floatingBanner.style.display = 'none';
  }
  deferredInstallPrompt = null;
};

window.dismissPwaBanner = function() {
  playSound('click');
  const floatingBanner = document.getElementById('pwaFloatingBanner');
  if (floatingBanner) floatingBanner.style.display = 'none';
  sessionStorage.setItem('jengasmart_pwa_dismissed', 'true');
};

// Register Service Worker for offline capability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('JengaSmart Service Worker registered:', reg.scope))
      .catch((err) => console.log('Service Worker note:', err));
  });
}

// Start app
document.addEventListener('DOMContentLoaded', init);

