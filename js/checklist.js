document.addEventListener('DOMContentLoaded', function() {
    const printBtn        = document.getElementById('print-btn');
    const printBtnTop     = document.getElementById('print-btn-top');
    const puzzlePreview   = document.getElementById('puzzle-preview');
    const worksheetTitle  = document.getElementById('worksheet-title');
    const titleTypeInputs = document.querySelectorAll('input[name="title-type"]');
    const layoutInputs    = document.querySelectorAll('input[name="layout"]');
    const spacingInputs   = document.querySelectorAll('input[name="spacing"]');
    const numberingInputs = document.querySelectorAll('input[name="numbering"]');
    const columnInputs    = document.querySelectorAll('input[name="columns"]');

    // Row counts per layout per spacing
    const rowCounts = {
        '1': { narrow: 21, normal: 16, wide: 12 },
        '2': { narrow:  9, normal:  7, wide:  5 },
        '4': { narrow: 16, normal: 12, wide:  9 }
    };
    const rowCounts2col = {
        '1': { narrow: 42, normal: 32, wide: 24 },
        '2': { narrow: 18, normal: 14, wide: 10 },
        '4': { narrow: 32, normal: 24, wide: 18 }
    };

    // student-header for 1-per-page (matches other generator pages)
    function buildHeader1() {
        return `
        <div class="student-header">
            <div class="header-left">
                <div class="puzzle-header">
                    <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass Logo" class="preview-logo">
                </div>
            </div>
            <div class="info-group">
                <div class="info-line"><label>Name:</label><div class="input-field"></div></div>
                <div class="info-line"><label>Date:</label><div class="input-field"></div></div>
            </div>
        </div>`;
    }

    // ns-header for 2/4-per-page (compact)
    function buildHeader() {
        return `
        <div class="ns-header">
            <div class="ns-logo-wrap">
                <img src="https://ariclass.com/images/worksheet-logo.png" alt="AriClass">
            </div>
            <div class="ns-fields">
                <span class="ns-field">Date&nbsp;<span class="ns-line-short"></span></span>
                <span class="ns-field">Name&nbsp;<span class="ns-line-short"></span></span>
            </div>
        </div>`;
    }

    function getTitleType() {
        return document.querySelector('input[name="title-type"]:checked').value;
    }

    function buildTitle(layout) {
        const type = getTitleType();
        if (type === 'none') return '';
        if (type === 'line') {
            if (layout === '1') return '<div class="cl-title-line-only puzzle-title-line"></div>';
            return '<div class="cl-title-line-only"></div>';
        }
        const title = worksheetTitle.value.trim() || 'Checklist';
        if (layout === '1') return `<div class="puzzle-title">${title}</div>`;
        return `<div class="cl-title">${title}</div>`;
    }

    function updateTitleInput() {
        worksheetTitle.disabled = getTitleType() !== 'text';
    }

    function buildRows(count) {
        const numbered = document.querySelector('input[name="numbering"]:checked').value === 'yes';
        let html = '<div class="cl-rows">';
        for (let i = 0; i < count; i++) {
            html += '<div class="cl-row">';
            if (numbered) html += `<span class="cl-num">${i + 1}.</span>`;
            html += '<span class="cl-box"></span>';
            html += '<span class="cl-line"></span>';
            html += '</div>';
        }
        html += '</div>';
        return html;
    }

    function getLayout()   { return document.querySelector('input[name="layout"]:checked').value; }
    function getSpacing()  { return document.querySelector('input[name="spacing"]:checked').value; }
    function getColumns()  { return document.querySelector('input[name="columns"]:checked').value; }

    function build2ColRows(count) {
        const numbered = document.querySelector('input[name="numbering"]:checked').value === 'yes';
        const half = Math.ceil(count / 2);
        let col1 = '<div class="cl-rows">', col2 = '<div class="cl-rows">';
        for (let i = 0; i < count; i++) {
            const row = '<div class="cl-row">' +
                (numbered ? `<span class="cl-num">${i + 1}.</span>` : '') +
                '<span class="cl-box"></span><span class="cl-line"></span></div>';
            if (i < half) col1 += row; else col2 += row;
        }
        col1 += '</div>'; col2 += '</div>';
        return `<div class="cl-2col">${col1}${col2}</div>`;
    }

    function updatePreview() {
        const layout    = getLayout();
        const spacing   = getSpacing();
        const titleType = getTitleType();
        const columns   = getColumns();
        const year      = new Date().getFullYear();
        let html = '';

        if (layout === '1' && columns === '2') {
            const count = (rowCounts2col['1'][spacing] || rowCounts['1'][spacing] * 2) + (titleType === 'none' ? 2 : 0);
            html += '<div class="ns-one-wrap">';
            html += buildHeader1();
            html += buildTitle('1');
            html += build2ColRows(count);
            html += '</div>';

        } else if (layout === '1') {
            const count = rowCounts['1'][spacing] + (titleType === 'none' ? 1 : 0);
            html += '<div class="ns-one-wrap">';
            html += buildHeader1();
            html += buildTitle(layout);
            html += buildRows(count);
            html += '</div>';

        } else if (layout === '2' && columns === '2') {
            const count = rowCounts2col['2'][spacing] + (titleType === 'none' ? 2 : 0);
            html += '<div class="ns-two-wrap">';
            html += '<div class="ns-half">' + buildHeader() + buildTitle(layout) + build2ColRows(count) + '</div>';
            html += '<div class="ns-cut"></div>';
            html += '<div class="ns-half">' + buildHeader() + buildTitle(layout) + build2ColRows(count) + '</div>';
            html += '</div>';

        } else if (layout === '2') {
            const count = rowCounts['2'][spacing] + (titleType === 'none' ? 1 : 0);
            html += '<div class="ns-two-wrap">';
            html += '<div class="ns-half">' + buildHeader() + buildTitle(layout) + buildRows(count) + '</div>';
            html += '<div class="ns-cut"></div>';
            html += '<div class="ns-half">' + buildHeader() + buildTitle(layout) + buildRows(count) + '</div>';
            html += '</div>';

        } else if (layout === '4' && columns === '2') {
            const count = rowCounts2col['4'][spacing] + (titleType === 'none' ? 2 : 0);
            html += '<div class="ns-grid4">';
            for (let i = 0; i < 4; i++) {
                html += '<div class="ns-cell4">' + buildHeader() + buildTitle(layout) + build2ColRows(count) + '</div>';
            }
            html += '</div>';

        } else if (layout === '4') {
            const count = rowCounts['4'][spacing] + (titleType === 'none' ? 1 : 0);
            html += '<div class="ns-grid4">';
            for (let i = 0; i < 4; i++) {
                html += '<div class="ns-cell4">' + buildHeader() + buildTitle(layout) + buildRows(count) + '</div>';
            }
            html += '</div>';
        }

        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        puzzlePreview.innerHTML = html;

        puzzlePreview.classList.remove('ns-lh-narrow', 'ns-lh-normal', 'ns-lh-wide');
        puzzlePreview.classList.add('ns-lh-' + spacing);
        puzzlePreview.classList.toggle('ns-fullpage', layout === '4');
    }

    layoutInputs.forEach(r => r.addEventListener('change', updatePreview));
    spacingInputs.forEach(r => r.addEventListener('change', updatePreview));
    numberingInputs.forEach(r => r.addEventListener('change', updatePreview));
    columnInputs.forEach(r => r.addEventListener('change', updatePreview));
    titleTypeInputs.forEach(r => r.addEventListener('change', () => { updateTitleInput(); updatePreview(); }));
    worksheetTitle.addEventListener('input', updatePreview);
    if (printBtn)    printBtn.addEventListener('click', () => window.print());
    if (printBtnTop) printBtnTop.addEventListener('click', () => window.print());

    updateTitleInput();
    updatePreview();
});
