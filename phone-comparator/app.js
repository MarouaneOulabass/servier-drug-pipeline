/**
 * PhoneVS - Premium Phone Comparator
 * Reads phone data from Excel and provides interactive comparison UI
 */

(function () {
    'use strict';

    // ============ STATE ============
    const state = {
        phones: [],           // All loaded phones
        selected: new Set(),  // Selected phone indices
        brandFilter: 'all',
        searchQuery: '',
    };

    // ============ DOM ELEMENTS ============
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const els = {
        excelInput: $('#excelInput'),
        welcomeScreen: $('#welcomeScreen'),
        phoneCatalog: $('#phoneCatalog'),
        phoneGrid: $('#phoneGrid'),
        brandFilters: $('#brandFilters'),
        searchInput: $('#searchInput'),
        comparisonSection: $('#comparisonSection'),
        comparisonTable: $('#comparisonTable'),
        comparisonCount: $('#comparisonCount'),
        floatingBar: $('#floatingBar'),
        floatingPhones: $('#floatingPhones'),
        compareBtn: $('#compareBtn'),
        selectedCount: $('#selectedCount'),
        clearBtn: $('#clearBtn'),
        uploadBtn: $('#uploadBtn'),
        toast: $('#toast'),
    };

    // ============ EXCEL FIELD MAPPING ============
    // Maps expected field names to possible column header variants (case-insensitive)
    const FIELD_MAP = {
        brand:       ['marque', 'brand', 'fabricant', 'manufacturer'],
        model:       ['modèle', 'modele', 'model', 'nom', 'name'],
        price:       ['prix', 'price', 'prix (€)', 'prix (eur)', 'prix €'],
        image:       ['image url', 'image', 'url image', 'photo', 'photo url', 'img', 'url'],
        screen:      ['écran', 'ecran', 'screen', 'taille écran', 'écran (pouces)', 'ecran (pouces)', 'taille ecran'],
        resolution:  ['résolution', 'resolution'],
        processor:   ['processeur', 'processor', 'cpu', 'chipset', 'soc'],
        ram:         ['ram', 'ram (go)', 'mémoire vive', 'ram (gb)'],
        storage:     ['stockage', 'storage', 'stockage (go)', 'mémoire', 'storage (gb)'],
        battery:     ['batterie', 'battery', 'batterie (mah)', 'battery (mah)', 'capacité batterie'],
        mainCamera:  ['appareil photo principal', 'main camera', 'caméra principale', 'camera principale', 'appareil photo principal (mp)', 'camera (mp)'],
        frontCamera: ['appareil photo frontal', 'front camera', 'caméra frontale', 'camera frontale', 'appareil photo frontal (mp)', 'selfie (mp)', 'selfie'],
        fiveG:       ['5g', '5g support', 'réseau 5g'],
        weight:      ['poids', 'weight', 'poids (g)', 'weight (g)'],
        os:          ['os', 'système', 'systeme', 'système d\'exploitation', 'operating system'],
        colors:      ['couleurs', 'colors', 'couleurs disponibles', 'coloris'],
        rating:      ['note', 'rating', 'note /10', 'note/10', 'score'],
        repairIndex: ['indice réparabilité', 'indice reparabilite', 'réparabilité', 'reparabilite', 'indice réparabilité /10', 'repairability'],
    };

    // ============ SPEC DISPLAY CONFIG ============
    const SPEC_ROWS = [
        { key: 'screen',      label: 'Écran',              category: 'AFFICHAGE',  unit: '"',   type: 'text' },
        { key: 'resolution',  label: 'Résolution',         category: null,         unit: '',    type: 'text' },
        { key: 'processor',   label: 'Processeur',         category: 'PERFORMANCE',unit: '',    type: 'text' },
        { key: 'ram',         label: 'RAM',                category: null,         unit: ' Go', type: 'number', higher: true },
        { key: 'storage',     label: 'Stockage',           category: null,         unit: ' Go', type: 'number', higher: true },
        { key: 'battery',     label: 'Batterie',           category: 'AUTONOMIE',  unit: ' mAh',type: 'number', higher: true },
        { key: 'mainCamera',  label: 'Caméra Principale',  category: 'PHOTO',      unit: ' MP', type: 'number', higher: true },
        { key: 'frontCamera', label: 'Caméra Frontale',    category: null,         unit: ' MP', type: 'number', higher: true },
        { key: 'fiveG',       label: '5G',                 category: 'CONNECTIVITÉ', unit: '',  type: 'boolean' },
        { key: 'weight',      label: 'Poids',              category: 'DESIGN',     unit: ' g',  type: 'number', higher: false },
        { key: 'os',          label: 'Système',            category: null,         unit: '',    type: 'text' },
        { key: 'colors',      label: 'Couleurs',           category: null,         unit: '',    type: 'text' },
        { key: 'rating',      label: 'Note',               category: 'ÉVALUATION', unit: '/10', type: 'score', higher: true },
        { key: 'repairIndex', label: 'Indice Réparabilité', category: null,        unit: '/10', type: 'score', higher: true },
    ];

    // ============ EXCEL PARSING ============
    function parseExcel(data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });

        if (json.length === 0) {
            showToast('Le fichier Excel est vide');
            return [];
        }

        // Build column mapping from headers
        const headers = Object.keys(json[0]);
        const colMap = {};

        for (const [field, variants] of Object.entries(FIELD_MAP)) {
            for (const header of headers) {
                const normalized = header.toLowerCase().trim();
                if (variants.includes(normalized)) {
                    colMap[field] = header;
                    break;
                }
            }
        }

        // Parse rows
        return json.map((row, idx) => ({
            id: idx,
            brand: String(row[colMap.brand] || '').trim(),
            model: String(row[colMap.model] || '').trim(),
            price: parseFloat(row[colMap.price]) || 0,
            image: String(row[colMap.image] || '').trim(),
            screen: String(row[colMap.screen] || '').trim(),
            resolution: String(row[colMap.resolution] || '').trim(),
            processor: String(row[colMap.processor] || '').trim(),
            ram: parseNumeric(row[colMap.ram]),
            storage: parseNumeric(row[colMap.storage]),
            battery: parseNumeric(row[colMap.battery]),
            mainCamera: parseNumeric(row[colMap.mainCamera]),
            frontCamera: parseNumeric(row[colMap.frontCamera]),
            fiveG: parseBoolean(row[colMap.fiveG]),
            weight: parseNumeric(row[colMap.weight]),
            os: String(row[colMap.os] || '').trim(),
            colors: String(row[colMap.colors] || '').trim(),
            rating: parseFloat(row[colMap.rating]) || 0,
            repairIndex: parseFloat(row[colMap.repairIndex]) || 0,
        })).filter(p => p.brand && p.model);
    }

    function parseNumeric(val) {
        if (val === undefined || val === null || val === '') return 0;
        const num = parseFloat(String(val).replace(/[^\d.,-]/g, '').replace(',', '.'));
        return isNaN(num) ? 0 : num;
    }

    function parseBoolean(val) {
        if (val === undefined || val === null || val === '') return false;
        const s = String(val).toLowerCase().trim();
        return ['oui', 'yes', 'true', '1', 'o'].includes(s);
    }

    // ============ RENDERING ============

    function renderCatalog() {
        const brands = [...new Set(state.phones.map(p => p.brand))].sort();
        renderBrandFilters(brands);
        renderPhoneGrid();
        els.welcomeScreen.style.display = 'none';
        els.phoneCatalog.style.display = 'block';
        els.clearBtn.style.display = 'flex';
    }

    function renderBrandFilters(brands) {
        let html = `<button class="chip ${state.brandFilter === 'all' ? 'active' : ''}" data-brand="all">Tous</button>`;
        brands.forEach(b => {
            html += `<button class="chip ${state.brandFilter === b ? 'active' : ''}" data-brand="${b}">${b}</button>`;
        });
        els.brandFilters.innerHTML = html;

        els.brandFilters.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                state.brandFilter = chip.dataset.brand;
                renderBrandFilters(brands);
                renderPhoneGrid();
            });
        });
    }

    function renderPhoneGrid() {
        const filtered = state.phones.filter(p => {
            const matchesBrand = state.brandFilter === 'all' || p.brand === state.brandFilter;
            const matchesSearch = !state.searchQuery ||
                `${p.brand} ${p.model}`.toLowerCase().includes(state.searchQuery.toLowerCase());
            return matchesBrand && matchesSearch;
        });

        els.phoneGrid.innerHTML = filtered.map((phone, i) => `
            <div class="phone-card ${state.selected.has(phone.id) ? 'selected' : ''}"
                 data-id="${phone.id}"
                 style="animation-delay: ${i * 0.06}s">
                <div class="phone-card-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <div class="phone-card-image">
                    ${phone.image
                        ? `<img src="${escapeHtml(phone.image)}" alt="${escapeHtml(phone.model)}"
                               onerror="this.classList.add('error'); this.parentElement.innerHTML='<div class=\\'no-image\\'>📱</div>'">`
                        : '<div class="no-image">📱</div>'
                    }
                </div>
                <div class="phone-card-brand">${escapeHtml(phone.brand)}</div>
                <div class="phone-card-model">${escapeHtml(phone.model)}</div>
                <div class="phone-card-specs">
                    ${phone.screen ? `<span class="spec-tag">${escapeHtml(phone.screen)}"</span>` : ''}
                    ${phone.ram ? `<span class="spec-tag">${phone.ram} Go RAM</span>` : ''}
                    ${phone.storage ? `<span class="spec-tag">${phone.storage} Go</span>` : ''}
                    ${phone.fiveG ? `<span class="spec-tag">5G</span>` : ''}
                </div>
                <div class="phone-card-price">${phone.price.toLocaleString('fr-FR')} <span>€</span></div>
                ${phone.rating ? renderStars(phone.rating) : ''}
            </div>
        `).join('');

        // Attach click handlers
        els.phoneGrid.querySelectorAll('.phone-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = parseInt(card.dataset.id);
                toggleSelection(id);
            });
        });
    }

    function renderStars(rating) {
        const full = Math.floor(rating / 2);
        const half = rating % 2 >= 1 ? 1 : 0;
        const empty = 5 - full - half;
        return `
            <div class="phone-card-rating">
                <div class="stars">
                    ${'<span class="star">★</span>'.repeat(full)}
                    ${half ? '<span class="star">★</span>' : ''}
                    ${'<span class="star empty">★</span>'.repeat(empty)}
                </div>
                <span class="rating-value">${rating}/10</span>
            </div>
        `;
    }

    function renderFloatingBar() {
        const count = state.selected.size;
        els.selectedCount.textContent = count;

        if (count === 0) {
            els.floatingBar.style.display = 'none';
            return;
        }

        els.floatingBar.style.display = 'block';

        els.floatingPhones.innerHTML = [...state.selected].map(id => {
            const phone = state.phones[id];
            return `
                <div class="floating-phone-thumb" data-id="${id}" title="${escapeHtml(phone.brand + ' ' + phone.model)}">
                    ${phone.image
                        ? `<img src="${escapeHtml(phone.image)}" alt="${escapeHtml(phone.model)}"
                               onerror="this.style.display='none'">`
                        : '📱'}
                    <div class="remove-thumb" data-id="${id}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </div>
                </div>
            `;
        }).join('');

        // Remove from floating bar
        els.floatingPhones.querySelectorAll('.remove-thumb').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSelection(parseInt(btn.dataset.id));
            });
        });
    }

    function renderComparison() {
        const selectedPhones = [...state.selected].map(id => state.phones[id]);

        if (selectedPhones.length < 2) {
            showToast('Sélectionnez au moins 2 téléphones à comparer');
            return;
        }

        els.comparisonCount.textContent = `${selectedPhones.length} téléphones`;
        els.comparisonSection.style.display = 'block';
        els.phoneCatalog.style.display = 'none';
        els.floatingBar.style.display = 'none';

        // Build table
        let html = `
            <button class="back-to-catalog" id="backToCatalog">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                </svg>
                Retour au catalogue
            </button>
            <table class="comp-table">
                <thead>
                    <tr>
                        <th></th>
                        ${selectedPhones.map(p => `
                            <th>
                                <div class="comp-phone-header">
                                    <button class="comp-remove-btn" data-id="${p.id}" title="Retirer">×</button>
                                    ${p.image
                                        ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.model)}"
                                               onerror="this.style.display='none'">`
                                        : ''}
                                    <span class="comp-brand">${escapeHtml(p.brand)}</span>
                                    <span class="comp-model">${escapeHtml(p.model)}</span>
                                    <span class="comp-price">${p.price.toLocaleString('fr-FR')} €</span>
                                </div>
                            </th>
                        `).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${buildComparisonRows(selectedPhones)}
                </tbody>
            </table>
        `;

        els.comparisonTable.innerHTML = html;

        // Animate score bars
        requestAnimationFrame(() => {
            document.querySelectorAll('.score-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        });

        // Back button
        document.getElementById('backToCatalog').addEventListener('click', showCatalog);

        // Remove buttons
        document.querySelectorAll('.comp-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                state.selected.delete(id);
                renderPhoneGrid();
                renderFloatingBar();
                if (state.selected.size >= 2) {
                    renderComparison();
                } else {
                    showCatalog();
                }
            });
        });

        // Smooth scroll to comparison
        els.comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function buildComparisonRows(phones) {
        let html = '';
        let lastCategory = null;

        for (const spec of SPEC_ROWS) {
            // Category separator
            if (spec.category && spec.category !== lastCategory) {
                lastCategory = spec.category;
                html += `
                    <tr class="category-row">
                        <td>${spec.category}</td>
                        ${phones.map(() => '<td></td>').join('')}
                    </tr>
                `;
            }

            // Find best/worst values for numeric comparisons
            let bestIdx = -1;
            let worstIdx = -1;

            if (spec.type === 'number' || spec.type === 'score') {
                const values = phones.map(p => parseFloat(p[spec.key]) || 0);
                const nonZero = values.filter(v => v > 0);
                if (nonZero.length >= 2) {
                    if (spec.higher !== undefined) {
                        const target = spec.higher ? Math.max(...nonZero) : Math.min(...nonZero);
                        const worst = spec.higher ? Math.min(...nonZero) : Math.max(...nonZero);
                        bestIdx = values.indexOf(target);
                        worstIdx = values.indexOf(worst);
                        if (bestIdx === worstIdx) worstIdx = -1;
                    }
                }
            }

            html += `<tr>`;
            html += `<td>${spec.label}</td>`;

            phones.forEach((phone, idx) => {
                const val = phone[spec.key];
                const isBest = idx === bestIdx;
                const isWorst = idx === worstIdx;
                const cls = isBest ? 'best-value' : (isWorst ? 'worst-value' : '');

                html += `<td class="${cls}">`;

                if (spec.type === 'boolean') {
                    html += val
                        ? '<span class="badge-yes">✓ Oui</span>'
                        : '<span class="badge-no">✗ Non</span>';
                } else if (spec.type === 'score') {
                    const numVal = parseFloat(val) || 0;
                    const pct = (numVal / 10) * 100;
                    html += `
                        <div class="cell-value">
                            <div class="score-bar-container">
                                <span class="score-bar-value">${numVal}${spec.unit}</span>
                                <div class="score-bar">
                                    <div class="score-bar-fill" style="width: 0%" data-width="${pct}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                } else if (spec.type === 'number') {
                    const numVal = parseFloat(val) || 0;
                    html += `
                        <div class="cell-value">
                            <span class="value-main">${numVal ? numVal.toLocaleString('fr-FR') : '—'}${numVal ? spec.unit : ''}</span>
                        </div>
                    `;
                } else {
                    html += `
                        <div class="cell-value">
                            <span class="value-main">${val ? escapeHtml(String(val)) : '—'}</span>
                        </div>
                    `;
                }

                html += `</td>`;
            });

            html += `</tr>`;
        }

        return html;
    }

    // ============ INTERACTIONS ============

    function toggleSelection(id) {
        if (state.selected.has(id)) {
            state.selected.delete(id);
        } else {
            if (state.selected.size >= 6) {
                showToast('Maximum 6 téléphones en comparaison');
                return;
            }
            state.selected.add(id);
        }

        renderPhoneGrid();
        renderFloatingBar();

        const phone = state.phones[id];
        if (state.selected.has(id)) {
            showToast(`${phone.brand} ${phone.model} ajouté à la comparaison`);
        }
    }

    function showCatalog() {
        els.comparisonSection.style.display = 'none';
        els.phoneCatalog.style.display = 'block';
        renderPhoneGrid();
        renderFloatingBar();
    }

    function showToast(message) {
        els.toast.textContent = message;
        els.toast.classList.add('show');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            els.toast.classList.remove('show');
        }, 3000);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============ EVENT LISTENERS ============

    els.excelInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                state.phones = parseExcel(data);

                if (state.phones.length === 0) {
                    showToast('Aucun téléphone trouvé dans le fichier');
                    return;
                }

                state.selected.clear();
                state.brandFilter = 'all';
                state.searchQuery = '';
                els.searchInput.value = '';

                renderCatalog();
                showToast(`${state.phones.length} téléphones chargés avec succès`);
            } catch (err) {
                console.error('Excel parse error:', err);
                showToast('Erreur lors de la lecture du fichier Excel');
            }
        };
        reader.readAsArrayBuffer(file);
    });

    els.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderPhoneGrid();
    });

    els.compareBtn.addEventListener('click', () => {
        renderComparison();
    });

    els.clearBtn.addEventListener('click', () => {
        state.phones = [];
        state.selected.clear();
        state.brandFilter = 'all';
        state.searchQuery = '';
        els.searchInput.value = '';
        els.phoneGrid.innerHTML = '';
        els.comparisonTable.innerHTML = '';
        els.phoneCatalog.style.display = 'none';
        els.comparisonSection.style.display = 'none';
        els.floatingBar.style.display = 'none';
        els.clearBtn.style.display = 'none';
        els.welcomeScreen.style.display = 'flex';
        els.excelInput.value = '';
    });

    // ============ KEYBOARD SHORTCUTS ============
    document.addEventListener('keydown', (e) => {
        // Escape to go back
        if (e.key === 'Escape') {
            if (els.comparisonSection.style.display !== 'none') {
                showCatalog();
            }
        }
        // Enter to compare
        if (e.key === 'Enter' && state.selected.size >= 2 && els.comparisonSection.style.display === 'none') {
            renderComparison();
        }
    });

})();
