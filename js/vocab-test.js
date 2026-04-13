document.addEventListener('DOMContentLoaded', function() {
    const printBtn      = document.getElementById('print-btn');
    const printBtnTop   = document.getElementById('print-btn-top');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const layoutInputs  = document.querySelectorAll('input[name="layout"]');
    const spacingInputs = document.querySelectorAll('input[name="spacing"]');
    const styleInputs   = document.querySelectorAll('input[name="linestyle"]');

    // Line counts per layout per spacing
    const lineCounts = {
        '1': { narrow: 28, normal: 21, wide: 15 },
        '2': { narrow: 13, normal: 10, wide:  7 },
        '4': { narrow:  9, normal:  7, wide:  5 }
    };

    function buildHeader() {
        return `
        <div class="ns-header">
            <div class="ns-logo-wrap">
                <img src="images/worksheet-logo.png" alt="AriClass">
            </div>
            <div class="ns-fields">
                <span class="ns-field">Date&nbsp;<span class="ns-line-short"></span></span>
                <span class="ns-field">Name&nbsp;<span class="ns-line-short"></span></span>
            </div>
        </div>`;
    }

    function buildLines(count) {
        return '<div class="ns-lines">' + '<div class="ns-line"></div>'.repeat(count) + '</div>';
    }

    function getLayout() {
        return document.querySelector('input[name="layout"]:checked').value;
    }

    function getSpacing() {
        return document.querySelector('input[name="spacing"]:checked').value;
    }

    function updatePreview() {
        const layout  = getLayout();
        const spacing = getSpacing();
        const count   = lineCounts[layout][spacing];
        const year    = new Date().getFullYear();
        let html = '';

        if (layout === '1') {
            html += '<div class="ns-one-wrap">';
            html += buildHeader();
            html += buildLines(40);
            html += '</div>';

        } else if (layout === '2') {
            html += '<div class="ns-two-wrap">';
            html += '<div class="ns-half">' + buildHeader() + buildLines(40) + '</div>';
            html += '<div class="ns-cut"></div>';
            html += '<div class="ns-half">' + buildHeader() + buildLines(40) + '</div>';
            html += '</div>';

        } else if (layout === '4') {
            html += '<div class="ns-grid4">';
            for (let i = 0; i < 4; i++) {
                html += '<div class="ns-cell4">' + buildHeader() + buildLines(40) + '</div>';
            }
            html += '</div>';
        }

        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        puzzlePreview.innerHTML = html;

        // Apply spacing class
        puzzlePreview.classList.remove('ns-lh-narrow', 'ns-lh-normal', 'ns-lh-wide');
        puzzlePreview.classList.add('ns-lh-' + spacing);

        // Apply line style class
        const style = document.querySelector('input[name="linestyle"]:checked').value;
        puzzlePreview.classList.remove('ns-ls-solid', 'ns-ls-dashed', 'ns-ls-bold');
        puzzlePreview.classList.add('ns-ls-' + style);

        // 4-per-page only: no outer margin
        puzzlePreview.classList.toggle('ns-fullpage', layout === '4');
    }

    layoutInputs.forEach(r => r.addEventListener('change', updatePreview));
    spacingInputs.forEach(r => r.addEventListener('change', updatePreview));
    styleInputs.forEach(r => r.addEventListener('change', updatePreview));
    if (printBtn)    printBtn.addEventListener('click', () => window.print());
    if (printBtnTop) printBtnTop.addEventListener('click', () => window.print());

    updatePreview();
});
