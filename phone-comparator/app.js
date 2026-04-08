/**
 * PhoneVS - Premium Phone Comparator v2
 * Enhanced with particles, 3D tilt, animated counters, trophy indicators
 */
(function () {
    'use strict';

    // ============ STATE ============
    const state = {
        phones: [],
        selected: new Set(),
        brandFilter: 'all',
        searchQuery: '',
    };

    const $ = (sel) => document.querySelector(sel);
    const els = {
        excelInput: $('#excelInput'),
        welcomeScreen: $('#welcomeScreen'),
        phoneCatalog: $('#phoneCatalog'),
        phoneGrid: $('#phoneGrid'),
        brandFilters: $('#brandFilters'),
        searchInput: $('#searchInput'),
        catalogSubtitle: $('#catalogSubtitle'),
        comparisonSection: $('#comparisonSection'),
        comparisonTable: $('#comparisonTable'),
        comparisonCount: $('#comparisonCount'),
        floatingBar: $('#floatingBar'),
        floatingPhones: $('#floatingPhones'),
        compareBtn: $('#compareBtn'),
        selectedCount: $('#selectedCount'),
        clearBtn: $('#clearBtn'),
        toast: $('#toast'),
        backToCatalog: $('#backToCatalog'),
    };

    // ============ BRAND COLORS ============
    const BRAND_COLORS = {
        apple: '#a2aaad', samsung: '#1428a0', google: '#4285f4',
        xiaomi: '#ff6900', oneplus: '#eb0028', nothing: '#d7d7d7',
        motorola: '#5c92fa',
    };

    // ============ FIELD MAPPING ============
    const FIELD_MAP = {
        brand: ['marque', 'brand', 'fabricant', 'manufacturer'],
        model: ['modèle', 'modele', 'model', 'nom', 'name'],
        price: ['prix', 'price', 'prix (€)', 'prix (eur)', 'prix €'],
        image: ['image url', 'image', 'url image', 'photo', 'photo url', 'img', 'url'],
        screen: ['écran', 'ecran', 'screen', 'taille écran', 'écran (pouces)', 'ecran (pouces)'],
        resolution: ['résolution', 'resolution'],
        processor: ['processeur', 'processor', 'cpu', 'chipset', 'soc'],
        ram: ['ram', 'ram (go)', 'mémoire vive', 'ram (gb)'],
        storage: ['stockage', 'storage', 'stockage (go)', 'mémoire', 'storage (gb)'],
        battery: ['batterie', 'battery', 'batterie (mah)', 'battery (mah)', 'capacité batterie'],
        mainCamera: ['appareil photo principal', 'main camera', 'caméra principale', 'camera principale', 'appareil photo principal (mp)', 'camera (mp)'],
        frontCamera: ['appareil photo frontal', 'front camera', 'caméra frontale', 'camera frontale', 'appareil photo frontal (mp)', 'selfie (mp)', 'selfie'],
        fiveG: ['5g', '5g support', 'réseau 5g'],
        weight: ['poids', 'weight', 'poids (g)', 'weight (g)'],
        os: ['os', 'système', 'systeme', "système d'exploitation", 'operating system'],
        colors: ['couleurs', 'colors', 'couleurs disponibles', 'coloris'],
        rating: ['note', 'rating', 'note /10', 'note/10', 'score'],
        repairIndex: ['indice réparabilité', 'indice reparabilite', 'réparabilité', 'reparabilite', 'indice réparabilité /10', 'repairability'],
    };

    const SPEC_ROWS = [
        { key: 'screen', label: 'Écran', category: 'AFFICHAGE', unit: '"', type: 'text' },
        { key: 'resolution', label: 'Résolution', category: null, unit: '', type: 'text' },
        { key: 'processor', label: 'Processeur', category: 'PERFORMANCE', unit: '', type: 'text' },
        { key: 'ram', label: 'RAM', category: null, unit: ' Go', type: 'number', higher: true },
        { key: 'storage', label: 'Stockage', category: null, unit: ' Go', type: 'number', higher: true },
        { key: 'battery', label: 'Batterie', category: 'AUTONOMIE', unit: ' mAh', type: 'number', higher: true },
        { key: 'mainCamera', label: 'Caméra Principale', category: 'PHOTO', unit: ' MP', type: 'number', higher: true },
        { key: 'frontCamera', label: 'Caméra Frontale', category: null, unit: ' MP', type: 'number', higher: true },
        { key: 'fiveG', label: '5G', category: 'CONNECTIVITÉ', unit: '', type: 'boolean' },
        { key: 'weight', label: 'Poids', category: 'DESIGN', unit: ' g', type: 'number', higher: false },
        { key: 'os', label: 'Système', category: null, unit: '', type: 'text' },
        { key: 'colors', label: 'Couleurs', category: null, unit: '', type: 'text' },
        { key: 'rating', label: 'Note', category: 'ÉVALUATION', unit: '/10', type: 'score', higher: true },
        { key: 'repairIndex', label: 'Réparabilité', category: null, unit: '/10', type: 'score', higher: true },
    ];

    // ============ PARTICLE SYSTEM ============
    function initParticles() {
        const canvas = $('#particleCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const COUNT = 60;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                r: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.3 + 0.1,
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x, dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ============ 3D TILT EFFECT ============
    function attachTilt(container) {
        container.querySelectorAll('.phone-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = (e.clientX - cx) / (rect.width / 2);
                const dy = (e.clientY - cy) / (rect.height / 2);
                card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) scale(1.02)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
            });
        });
    }

    // ============ EXCEL PARSING ============
    function parseExcel(data) {
        const wb = XLSX.read(data, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: '' });
        if (!json.length) { showToast('Le fichier Excel est vide'); return []; }

        const headers = Object.keys(json[0]);
        const colMap = {};
        for (const [field, variants] of Object.entries(FIELD_MAP)) {
            for (const h of headers) {
                if (variants.includes(h.toLowerCase().trim())) { colMap[field] = h; break; }
            }
        }

        return json.map((row, idx) => ({
            id: idx,
            brand: String(row[colMap.brand] || '').trim(),
            model: String(row[colMap.model] || '').trim(),
            price: parseFloat(row[colMap.price]) || 0,
            image: String(row[colMap.image] || '').trim(),
            screen: String(row[colMap.screen] || '').trim(),
            resolution: String(row[colMap.resolution] || '').trim(),
            processor: String(row[colMap.processor] || '').trim(),
            ram: parseNum(row[colMap.ram]),
            storage: parseNum(row[colMap.storage]),
            battery: parseNum(row[colMap.battery]),
            mainCamera: parseNum(row[colMap.mainCamera]),
            frontCamera: parseNum(row[colMap.frontCamera]),
            fiveG: parseBool(row[colMap.fiveG]),
            weight: parseNum(row[colMap.weight]),
            os: String(row[colMap.os] || '').trim(),
            colors: String(row[colMap.colors] || '').trim(),
            rating: parseFloat(row[colMap.rating]) || 0,
            repairIndex: parseFloat(row[colMap.repairIndex]) || 0,
        })).filter(p => p.brand && p.model);
    }

    function parseNum(v) {
        if (v == null || v === '') return 0;
        const n = parseFloat(String(v).replace(/[^\d.,-]/g, '').replace(',', '.'));
        return isNaN(n) ? 0 : n;
    }
    function parseBool(v) {
        if (v == null || v === '') return false;
        return ['oui', 'yes', 'true', '1', 'o'].includes(String(v).toLowerCase().trim());
    }
    function esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
    function brandKey(b) { return b.toLowerCase().replace(/\s+/g, ''); }

    // ============ RENDERING ============
    function renderCatalog() {
        const brands = [...new Set(state.phones.map(p => p.brand))].sort();
        renderBrandFilters(brands);
        renderPhoneGrid();
        els.welcomeScreen.style.display = 'none';
        els.phoneCatalog.style.display = 'block';
        els.clearBtn.style.display = 'flex';
        els.catalogSubtitle.textContent = `${state.phones.length} téléphones disponibles`;
    }

    function renderBrandFilters(brands) {
        let h = `<button class="chip ${state.brandFilter === 'all' ? 'active' : ''}" data-brand="all">Tous</button>`;
        brands.forEach(b => {
            h += `<button class="chip ${state.brandFilter === b ? 'active' : ''}" data-brand="${b}">${b}</button>`;
        });
        els.brandFilters.innerHTML = h;
        els.brandFilters.querySelectorAll('.chip').forEach(c => {
            c.addEventListener('click', () => {
                state.brandFilter = c.dataset.brand;
                renderBrandFilters(brands);
                renderPhoneGrid();
            });
        });
    }

    function renderPhoneGrid() {
        const filtered = state.phones.filter(p => {
            const mb = state.brandFilter === 'all' || p.brand === state.brandFilter;
            const ms = !state.searchQuery || `${p.brand} ${p.model}`.toLowerCase().includes(state.searchQuery.toLowerCase());
            return mb && ms;
        });

        els.phoneGrid.innerHTML = filtered.map((p, i) => `
            <div class="phone-card ${state.selected.has(p.id) ? 'selected' : ''}"
                 data-id="${p.id}" data-brand="${brandKey(p.brand)}"
                 style="animation-delay: ${i * 0.05}s">
                <div class="phone-card-check">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <div class="phone-card-image">
                    ${p.image
                        ? `<img src="${esc(p.image)}" alt="${esc(p.model)}" onerror="this.classList.add('error');this.parentElement.innerHTML='<div class=\\'no-image\\'>📱</div>'">`
                        : '<div class="no-image">📱</div>'}
                </div>
                <div class="phone-card-brand">${esc(p.brand)}</div>
                <div class="phone-card-model">${esc(p.model)}</div>
                <div class="phone-card-specs">
                    ${p.screen ? `<span class="spec-tag">${esc(p.screen)}"</span>` : ''}
                    ${p.ram ? `<span class="spec-tag">${p.ram} Go RAM</span>` : ''}
                    ${p.storage ? `<span class="spec-tag">${p.storage} Go</span>` : ''}
                    ${p.fiveG ? '<span class="spec-tag">5G</span>' : ''}
                </div>
                <div class="phone-card-price">${p.price.toLocaleString('fr-FR')} <span>€</span></div>
                ${p.rating ? renderStars(p.rating) : ''}
            </div>
        `).join('');

        els.phoneGrid.querySelectorAll('.phone-card').forEach(card => {
            card.addEventListener('click', () => toggleSelection(parseInt(card.dataset.id)));
        });
        attachTilt(els.phoneGrid);
    }

    function renderStars(r) {
        const full = Math.floor(r / 2), half = r % 2 >= 1 ? 1 : 0, empty = 5 - full - half;
        return `<div class="phone-card-rating">
            <div class="stars">${'<span class="star">★</span>'.repeat(full)}${half ? '<span class="star">★</span>' : ''}${'<span class="star empty">★</span>'.repeat(empty)}</div>
            <span class="rating-value">${r}/10</span>
        </div>`;
    }

    function renderFloatingBar() {
        const c = state.selected.size;
        els.selectedCount.textContent = c;
        if (c === 0) { els.floatingBar.style.display = 'none'; return; }
        els.floatingBar.style.display = 'block';

        els.floatingPhones.innerHTML = [...state.selected].map(id => {
            const p = state.phones[id];
            return `<div class="floating-phone-thumb" data-id="${id}" title="${esc(p.brand + ' ' + p.model)}">
                ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.model)}" onerror="this.style.display='none'">` : '📱'}
                <div class="remove-thumb" data-id="${id}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </div>
            </div>`;
        }).join('');

        els.floatingPhones.querySelectorAll('.remove-thumb').forEach(b => {
            b.addEventListener('click', e => { e.stopPropagation(); toggleSelection(parseInt(b.dataset.id)); });
        });
    }

    // ============ COMPARISON ============
    function renderComparison() {
        const phones = [...state.selected].map(id => state.phones[id]);
        if (phones.length < 2) { showToast('Sélectionnez au moins 2 téléphones'); return; }

        els.comparisonCount.textContent = `${phones.length} téléphones`;
        els.comparisonSection.style.display = 'block';
        els.phoneCatalog.style.display = 'none';
        els.floatingBar.style.display = 'none';

        let html = `<table class="comp-table">
            <thead><tr><th></th>
                ${phones.map(p => `<th>
                    <div class="comp-phone-header" data-brand="${brandKey(p.brand)}">
                        <button class="comp-remove-btn" data-id="${p.id}" title="Retirer">×</button>
                        ${p.image ? `<img src="${esc(p.image)}" alt="${esc(p.model)}" onerror="this.style.display='none'">` : ''}
                        <div class="comp-phone-glow"></div>
                        <span class="comp-brand">${esc(p.brand)}</span>
                        <span class="comp-model">${esc(p.model)}</span>
                        <span class="comp-price">${p.price.toLocaleString('fr-FR')} €</span>
                    </div>
                </th>`).join('')}
            </tr></thead>
            <tbody>${buildCompRows(phones)}</tbody>
        </table>`;

        els.comparisonTable.innerHTML = html;

        // Animate bars
        requestAnimationFrame(() => {
            document.querySelectorAll('.score-bar-fill[data-width], .spec-bar-fill[data-width]').forEach(b => {
                b.style.width = b.dataset.width;
            });
        });

        // Back button
        els.backToCatalog.addEventListener('click', showCatalog);

        // Remove buttons
        document.querySelectorAll('.comp-remove-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                state.selected.delete(parseInt(btn.dataset.id));
                renderPhoneGrid();
                renderFloatingBar();
                state.selected.size >= 2 ? renderComparison() : showCatalog();
            });
        });

        els.comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function buildCompRows(phones) {
        let html = '';
        let lastCat = null;

        for (const spec of SPEC_ROWS) {
            if (spec.category && spec.category !== lastCat) {
                lastCat = spec.category;
                html += `<tr class="category-row"><td>${spec.category}</td>${phones.map(() => '<td></td>').join('')}</tr>`;
            }

            let bestIdx = -1, worstIdx = -1;
            if (spec.type === 'number' || spec.type === 'score') {
                const vals = phones.map(p => parseFloat(p[spec.key]) || 0);
                const nz = vals.filter(v => v > 0);
                if (nz.length >= 2 && spec.higher !== undefined) {
                    const best = spec.higher ? Math.max(...nz) : Math.min(...nz);
                    const worst = spec.higher ? Math.min(...nz) : Math.max(...nz);
                    bestIdx = vals.indexOf(best);
                    worstIdx = vals.indexOf(worst);
                    if (bestIdx === worstIdx) worstIdx = -1;
                }
            }

            // For spec bars: find max value
            let maxVal = 0;
            if (spec.type === 'number') {
                maxVal = Math.max(...phones.map(p => parseFloat(p[spec.key]) || 0));
            }

            html += '<tr>';
            html += `<td>${spec.label}</td>`;

            phones.forEach((phone, idx) => {
                const val = phone[spec.key];
                const isBest = idx === bestIdx;
                const isWorst = idx === worstIdx;
                const cls = isBest ? 'best-value' : (isWorst ? 'worst-value' : '');
                html += `<td class="${cls}">`;

                const trophy = isBest ? '<span class="trophy-icon">🏆</span>' : '';

                if (spec.type === 'boolean') {
                    html += val
                        ? '<span class="badge-yes">✓ Oui</span>'
                        : '<span class="badge-no">✗ Non</span>';
                } else if (spec.type === 'score') {
                    const nv = parseFloat(val) || 0;
                    const pct = (nv / 10) * 100;
                    html += `<div class="cell-value">
                        <div class="score-bar-container">
                            <span class="score-bar-value">${trophy}${nv}${spec.unit}</span>
                            <div class="score-bar"><div class="score-bar-fill" data-width="${pct}%"></div></div>
                        </div>
                    </div>`;
                } else if (spec.type === 'number') {
                    const nv = parseFloat(val) || 0;
                    const barPct = maxVal > 0 ? (nv / maxVal) * 100 : 0;
                    html += `<div class="cell-value">
                        <span class="value-main">${trophy}${nv ? nv.toLocaleString('fr-FR') : '—'}${nv ? spec.unit : ''}</span>
                        ${nv ? `<div class="spec-bar-wrap"><div class="spec-bar-fill" data-width="${barPct}%"></div></div>` : ''}
                    </div>`;
                } else {
                    html += `<div class="cell-value"><span class="value-main">${val ? esc(String(val)) : '—'}</span></div>`;
                }
                html += '</td>';
            });
            html += '</tr>';
        }
        return html;
    }

    // ============ INTERACTIONS ============
    function toggleSelection(id) {
        if (state.selected.has(id)) {
            state.selected.delete(id);
        } else {
            if (state.selected.size >= 6) { showToast('Maximum 6 téléphones'); return; }
            state.selected.add(id);
        }
        renderPhoneGrid();
        renderFloatingBar();
        if (state.selected.has(id)) {
            const p = state.phones[id];
            showToast(`${p.brand} ${p.model} ajouté`);
        }
    }

    function showCatalog() {
        els.comparisonSection.style.display = 'none';
        els.phoneCatalog.style.display = 'block';
        renderPhoneGrid();
        renderFloatingBar();
    }

    function showToast(msg) {
        els.toast.textContent = msg;
        els.toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2500);
    }

    // ============ EVENTS ============
    els.excelInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = evt => {
            try {
                state.phones = parseExcel(new Uint8Array(evt.target.result));
                if (!state.phones.length) { showToast('Aucun téléphone trouvé'); return; }
                state.selected.clear();
                state.brandFilter = 'all';
                state.searchQuery = '';
                els.searchInput.value = '';
                renderCatalog();
                showToast(`${state.phones.length} téléphones chargés`);
            } catch (err) {
                console.error(err);
                showToast('Erreur de lecture du fichier');
            }
        };
        reader.readAsArrayBuffer(file);
    });

    els.searchInput.addEventListener('input', e => {
        state.searchQuery = e.target.value;
        renderPhoneGrid();
    });

    els.compareBtn.addEventListener('click', () => renderComparison());

    els.clearBtn.addEventListener('click', () => {
        state.phones = []; state.selected.clear();
        state.brandFilter = 'all'; state.searchQuery = '';
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

    els.backToCatalog.addEventListener('click', showCatalog);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && els.comparisonSection.style.display !== 'none') showCatalog();
        if (e.key === 'Enter' && state.selected.size >= 2 && els.comparisonSection.style.display === 'none') renderComparison();
    });

    // ============ INIT ============
    initParticles();
})();
