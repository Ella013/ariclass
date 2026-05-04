document.addEventListener('DOMContentLoaded', function () {
    const printBtn      = document.getElementById('print-btn');
    const printBtnTop   = document.getElementById('print-btn-top');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const titleInput    = document.getElementById('worksheet-title');
    const showTitleChk  = document.getElementById('show-title');
    const sleepChk  = document.getElementById('sleep-enable');
    const sleepWrap = document.getElementById('sleep-options');

    function buildTimePicker(id, defH, defM, defAP, onChange) {
        const wrap = document.getElementById(id);
        let selH = defH, selM = defM, selAP = defAP;

        wrap.innerHTML =
            '<div class="cp-tp-display"><span class="cp-tp-text"></span><span class="cp-tp-arrow">▾</span></div>' +
            '<div class="cp-tp-panel">' +
            '<div class="cp-tp-col" data-col="h"></div>' +
            '<div class="cp-tp-col" data-col="m"></div>' +
            '<div class="cp-tp-col" data-col="ap"></div>' +
            '</div>';

        const display = wrap.querySelector('.cp-tp-display');
        const panel   = wrap.querySelector('.cp-tp-panel');
        const hCol    = wrap.querySelector('[data-col="h"]');
        const mCol    = wrap.querySelector('[data-col="m"]');
        const apCol   = wrap.querySelector('[data-col="ap"]');

        function updateDisplay() {
            wrap.querySelector('.cp-tp-text').textContent =
                selH + ' : ' + String(selM).padStart(2, '0') + ' ' + selAP;
        }

        function makeItem(col, text, isActive, onClick) {
            const el = document.createElement('div');
            el.className = 'cp-tp-item' + (isActive ? ' active' : '');
            el.textContent = text;
            el.addEventListener('click', function(e) { e.stopPropagation(); onClick(el, col); });
            col.appendChild(el);
        }

        for (let h = 1; h <= 12; h++) {
            makeItem(hCol, h, h === selH, function(el, col) {
                selH = parseInt(el.textContent);
                col.querySelectorAll('.cp-tp-item').forEach(function(i) { i.classList.remove('active'); });
                el.classList.add('active');
                updateDisplay(); onChange();
            });
        }
        for (let m = 0; m < 60; m += 10) {
            makeItem(mCol, String(m).padStart(2, '0'), m === selM, function(el, col) {
                selM = parseInt(el.textContent);
                col.querySelectorAll('.cp-tp-item').forEach(function(i) { i.classList.remove('active'); });
                el.classList.add('active');
                updateDisplay(); onChange();
            });
        }
        ['AM', 'PM'].forEach(function(ap) {
            makeItem(apCol, ap, ap === selAP, function(el, col) {
                selAP = el.textContent;
                col.querySelectorAll('.cp-tp-item').forEach(function(i) { i.classList.remove('active'); });
                el.classList.add('active');
                updateDisplay(); onChange();
            });
        });

        display.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = panel.classList.contains('open');
            document.querySelectorAll('.cp-tp-panel.open').forEach(function(p) { p.classList.remove('open'); });
            if (!isOpen) {
                panel.classList.add('open');
                [hCol, mCol, apCol].forEach(function(col) {
                    const active = col.querySelector('.cp-tp-item.active');
                    if (active) col.scrollTop = active.offsetTop - col.clientHeight / 2 + active.clientHeight / 2;
                });
            }
        });
        document.addEventListener('click', function() { panel.classList.remove('open'); });

        updateDisplay();

        return {
            getHour24: function() {
                let h = selH;
                if (selAP === 'AM' && h === 12) h = 0;
                if (selAP === 'PM' && h !== 12) h += 12;
                return h;
            }
        };
    }

    function escXml(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // midnight (0) = 0° top, each hour = 15° clockwise
    function hourAngle(h) {
        return h * 15;
    }

    function polarXY(cx, cy, r, deg) {
        const rad = (deg - 90) * Math.PI / 180;
        return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
    }

    function buildSleepSector(cx, cy, r, fromH, toH, color, moonStyle, moonPos) {
        const a1 = hourAngle(fromH);
        let   a2 = hourAngle(toH);
        if (a2 <= a1) a2 += 360;
        const spanDeg = a2 - a1;
        const large   = spanDeg > 180 ? 1 : 0;

        const [x1, y1] = polarXY(cx, cy, r, a1);
        const [x2, y2] = polarXY(cx, cy, r, a2 % 360);
        const sectorPath = `M ${cx} ${cy} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`;

        const midDeg   = a1 + spanDeg / 2;
        const moonR    = 32;
        const posAngle = {
            p1: a1 + spanDeg * 0.2,
            p2: a1 + spanDeg * 0.4,
            p3: a1 + spanDeg * 0.6,
            p4: a1 + spanDeg * 0.8
        };
        const [mx, my] = polarXY(cx, cy, r * 0.62, posAngle[moonPos] !== undefined ? posAngle[moonPos] : midDeg);

        let moonSvg = '';
        if (moonStyle === 'crescent') {
            const ct = -15 * Math.PI / 180;
            const cox = (mx + moonR * 0.42 * Math.cos(ct)).toFixed(1);
            const coy = (my + moonR * 0.42 * Math.sin(ct)).toFixed(1);
            moonSvg = `<defs><mask id="crescent-mask">
                <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${moonR}" fill="white"/>
                <circle cx="${cox}" cy="${coy}" r="${(moonR * 0.78).toFixed(1)}" fill="black"/>
            </mask></defs>
            <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${moonR}" fill="white" opacity="0.9" mask="url(#crescent-mask)"/>`;
        } else if (moonStyle === 'waning') {
            moonSvg = `<defs><mask id="waning-mask">
                <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${moonR}" fill="white"/>
                <circle cx="${(mx - moonR * 0.42).toFixed(1)}" cy="${my.toFixed(1)}" r="${(moonR * 0.78).toFixed(1)}" fill="black"/>
            </mask></defs>
            <circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${moonR}" fill="white" opacity="0.9" mask="url(#waning-mask)"/>`;
        } else if (moonStyle === 'half') {
            moonSvg = `<path d="M ${mx.toFixed(1)} ${(my - moonR).toFixed(1)} A ${moonR} ${moonR} 0 1 0 ${mx.toFixed(1)} ${(my + moonR).toFixed(1)} Z" fill="white" opacity="0.88" transform="rotate(-7, ${mx.toFixed(1)}, ${my.toFixed(1)})"/>`;
        } else if (moonStyle === 'full') {
            moonSvg = `<circle cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" r="${moonR}" fill="white" opacity="0.88"/>`;
        } else if (moonStyle === 'star') {
            const starDefs = [
                { dx:  0,           dy:  0,           r: moonR * 0.42, op: 0.95 },
                { dx:  moonR * 1.5, dy: -moonR * 0.6, r: moonR * 0.28, op: 0.8  },
                { dx: -moonR * 1.3, dy: -moonR * 0.8, r: moonR * 0.35, op: 0.85 },
                { dx:  moonR * 0.5, dy:  moonR * 1.5, r: moonR * 0.22, op: 0.75 },
                { dx: -moonR * 1.1, dy:  moonR * 1.1, r: moonR * 0.30, op: 0.8  },
                { dx:  moonR * 1.8, dy:  moonR * 0.8, r: moonR * 0.18, op: 0.7  },
                { dx: -moonR * 0.3, dy: -moonR * 1.5, r: moonR * 0.24, op: 0.78 },
                { dx:  moonR * 1.0, dy:  moonR * 0.9, r: moonR * 0.16, op: 0.65 },
            ];
            moonSvg = starDefs.map(function(s) {
                const sx = mx + s.dx, sy = my + s.dy;
                const pts = [];
                for (let i = 0; i < 10; i++) {
                    const sr = i % 2 === 0 ? s.r : s.r * 0.42;
                    const a = (i * 36 - 90) * Math.PI / 180;
                    pts.push((sx + sr * Math.cos(a)).toFixed(1) + ',' + (sy + sr * Math.sin(a)).toFixed(1));
                }
                return '<polygon points="' + pts.join(' ') + '" fill="white" opacity="' + s.op + '"/>';
            }).join('');
        }

        return `<path d="${sectorPath}" fill="${color}" fill-opacity="0.28" stroke="none"/>${moonSvg}`;
    }

    function getStyle() {
        const r = document.querySelector('input[name="cp-style"]:checked');
        return r ? r.value : 'clean';
    }

    function buildCircleSVG(sleepEnabled, fromH, toH, style, sectorColor, moonStyle, moonPos) {
        const decorative = style === 'decorative';

        // Same viewBox + same r for both modes → numbers stay same size
        const cx = 270, cy = 270, r = 248;

        let svg = `<svg class="cp-svg" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">`;

        // ── Decorative: thick yellow ring + bear ears (overflow:visible handles clipping) ──
        if (decorative) {
            const yellow    = '#fed978';
            const ringInner = r + 4;   // 252
            const ringOuter = r + 38;  // 286 — ring thickness

            // Ears at top corners
            const earR     = 80;
            const earAngle = 38;
            const earDist  = ringOuter - 12;  // 274
            const [eLx, eLy] = polarXY(cx, cy, earDist, 360 - earAngle);
            const [eRx, eRy] = polarXY(cx, cy, earDist, earAngle);
            svg += `<circle cx="${eLx.toFixed(1)}" cy="${eLy.toFixed(1)}" r="${earR}" fill="${yellow}"/>`;
            svg += `<circle cx="${eRx.toFixed(1)}" cy="${eRy.toFixed(1)}" r="${earR}" fill="${yellow}"/>`;

            // Feet: rounded triangle wedges pointing outward (wide base at ring, tapers to tip)
            const footAngle = 148;
            const footDist  = ringOuter - 14;
            const fBW = 88, fLen = 58, fTipR = 24;
            const hw = fBW / 2;
            const footPath = `M 0 ${-hw} Q ${fLen} ${-fTipR} ${fLen} 0 Q ${fLen} ${fTipR} 0 ${hw} Z`;

            const [fRx, fRy] = polarXY(cx, cy, footDist, footAngle);
            svg += `<path d="${footPath}" transform="translate(${fRx.toFixed(1)},${fRy.toFixed(1)}) rotate(${footAngle - 90})" fill="${yellow}"/>`;

            const [fLx, fLy] = polarXY(cx, cy, footDist, 360 - footAngle);
            svg += `<path d="${footPath}" transform="translate(${fLx.toFixed(1)},${fLy.toFixed(1)}) rotate(${360 - footAngle - 90})" fill="${yellow}"/>`;

            // Yellow ring
            svg += `<circle cx="${cx}" cy="${cy}" r="${ringOuter}" fill="${yellow}"/>`;
            // White interior restores the clean clock face
            svg += `<circle cx="${cx}" cy="${cy}" r="${ringInner}" fill="white"/>`;
        }

        // ── Sleep sector (behind tick/spokes) ──
        if (sleepEnabled) {
            svg += buildSleepSector(cx, cy, decorative ? r + 4 : r, fromH, toH, sectorColor, moonStyle, moonPos);
        }

        // ── Main clock circle border (clean mode only) ──
        if (!decorative) {
            svg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#c8c8c8" stroke-width="1.3"/>`;
        }

        // ── Faded spokes (8 directions) ──
        for (let i = 0; i < 8; i++) {
            const [x2, y2] = polarXY(cx, cy, r, i * 45);
            svg += `<line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#ebebeb" stroke-width="0.5"/>`;
        }

        // ── Faded tick marks every 15° (between hour labels) ──
        const tickOuter = r;
        const tickInner = r - 7;
        for (let h = 0; h < 24; h++) {
            const deg = h * 15;
            if (h % 3 === 0) continue; // skip spoke positions
            const [ox, oy] = polarXY(cx, cy, tickOuter, deg);
            const [ix, iy] = polarXY(cx, cy, tickInner, deg);
            svg += `<line x1="${ix.toFixed(1)}" y1="${iy.toFixed(1)}" x2="${ox.toFixed(1)}" y2="${oy.toFixed(1)}" stroke="#d8d8d8" stroke-width="0.5"/>`;
        }

        // ── All 24 hour labels (1-12 twice) ──
        // In decorative mode, place labels at the center of the yellow ring
        const ringInnerDist = r + 4;
        const ringOuterDist = r + 38;
        const labelDist = decorative ? (ringInnerDist + ringOuterDist) / 2 : r + 13;
        for (let h = 0; h < 24; h++) {
            const deg = h * 15;
            const [lx, ly] = polarXY(cx, cy, labelDist, deg);
            const labelText = (h % 12 === 0) ? 12 : (h % 12);
            const fontSize = decorative ? 13 : 14;
            svg += `<text x="${lx.toFixed(1)}" y="${(ly + 4.5).toFixed(1)}" text-anchor="middle" font-size="${fontSize}" font-weight="600" fill="#555" font-family="sans-serif">${labelText}</text>`;
        }

        // ── Center: face logo (decorative) or dot (clean) ──
        if (decorative) {
            const faceSize = 60;
            svg += `<image href="images/ariface.png" x="${(cx - faceSize / 2).toFixed(1)}" y="${(cy - faceSize / 2).toFixed(1)}" width="${faceSize}" height="${faceSize}"/>`;
        } else {
            svg += `<circle cx="${cx}" cy="${cy}" r="5" fill="#bbb"/>`;
        }

        svg += '</svg>';
        return svg;
    }

    const sleepColorInput = document.getElementById('sleep-color');
    const sleepExtras     = document.getElementById('sleep-extras');
    let currentMoon = 'crescent';
    let currentPos  = 'p2';

    const placeRow = document.querySelector('.cp-pos-btn').closest('.cp-extra-row');

    document.querySelectorAll('.cp-moon-btn:not(.cp-pos-btn)').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cp-moon-btn:not(.cp-pos-btn)').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentMoon = btn.dataset.moon;
            placeRow.classList.toggle('disabled', currentMoon === 'none');
            render();
        });
    });

    document.querySelectorAll('.cp-pos-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.cp-pos-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentPos = btn.dataset.pos;
            render();
        });
    });

    function buildPage() {
        const title       = titleInput.value.trim() || 'Circle Planner';
        const showTitle   = showTitleChk.checked;
        const sleepOn     = sleepChk.checked;
        const fromH       = fromPicker.getHour24();
        const toH         = toPicker.getHour24();
        const style       = getStyle();
        const sectorColor = sleepColorInput.value;
        const moonStyle   = currentMoon;
        const moonPos     = currentPos;
        const year        = new Date().getFullYear();

        let html = '<div class="cp-page">';
        html += `<div class="student-header">
            <div class="header-left"><div class="puzzle-header">
                <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
            </div></div>
            <div class="info-group">
                <div class="info-line"><label>Name:</label><div class="input-field"></div></div>
                <div class="info-line"><label>Date:</label><div class="input-field"></div></div>
            </div></div>`;
        html += `<div class="puzzle-title" style="${showTitle ? '' : 'visibility:hidden;'}">${escXml(title)}</div>`;
        html += `<div class="cp-circle-wrap">${buildCircleSVG(sleepOn, fromH, toH, style, sectorColor, moonStyle, moonPos)}</div>`;
        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        html += '</div>';
        return html;
    }

    function render() {
        puzzlePreview.innerHTML = buildPage();
    }

    function doPrint() { window.print(); }

    printBtn.addEventListener('click', doPrint);
    printBtnTop.addEventListener('click', doPrint);
    titleInput.addEventListener('input', render);
    showTitleChk.addEventListener('change', render);

    document.querySelectorAll('input[name="cp-style"]').forEach(function (el) {
        el.addEventListener('change', render);
    });

    sleepChk.addEventListener('change', function () {
        sleepWrap.classList.toggle('enabled', this.checked);
        sleepExtras.classList.toggle('enabled', this.checked);
        render();
    });
    const fromPicker = buildTimePicker('sleep-from-picker', 10, 0, 'PM', render);
    const toPicker   = buildTimePicker('sleep-to-picker',   7,  0, 'AM', render);
    sleepColorInput.addEventListener('input', render);

    render();
});
