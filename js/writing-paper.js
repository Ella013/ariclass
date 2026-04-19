document.addEventListener('DOMContentLoaded', function() {
    const printBtn      = document.getElementById('print-btn');
    const printBtnTop   = document.getElementById('print-btn-top');
    const puzzlePreview = document.getElementById('puzzle-preview');
    const layoutInputs  = document.querySelectorAll('input[name="layout"]');
    const spacingInputs = document.querySelectorAll('input[name="spacing"]');
    const colorInputs   = document.querySelectorAll('input[name="linecolor"]');

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

    function getGroupCount(spacing, layout) {
        if (layout === '2') {
            // narrow(15mm): 7, normal(22mm): 5, wide(30mm): 4
            return { narrow: 7, normal: 5, wide: 4 }[spacing];
        } else if (layout === '4') {
            return { narrow: 10, normal: 7, wide: 5 }[spacing];
        } else {
            // narrow(15mm): 16, normal(22mm): 11, wide(30mm): 8
            return { narrow: 16, normal: 11, wide: 8 }[spacing];
        }
    }

    function buildLines(count) {
        return '<div class="ns-lines">' + '<div class="wp-line-group"></div>'.repeat(count) + '</div>';
    }

    function getLayout() {
        return document.querySelector('input[name="layout"]:checked').value;
    }

    function getSpacing() {
        return document.querySelector('input[name="spacing"]:checked').value;
    }

    function getColor() {
        return document.querySelector('input[name="linecolor"]:checked').value;
    }

    function updatePreview() {
        const layout  = getLayout();
        const spacing = getSpacing();
        const year    = new Date().getFullYear();
        let html = '';

        if (layout === '1') {
            html += '<div class="ns-one-wrap">';
            html += buildHeader();
            html += buildLines(getGroupCount(spacing, '1'));
            html += '</div>';

        } else if (layout === '2') {
            html += '<div class="ns-two-wrap">';
            html += '<div class="ns-half">' + buildHeader() + buildLines(getGroupCount(spacing, '2')) + '</div>';
            html += '<div class="ns-cut"></div>';
            html += '<div class="ns-half">' + buildHeader() + buildLines(getGroupCount(spacing, '2')) + '</div>';
            html += '</div>';

        } else if (layout === '4') {
            html += '<div class="ns-grid4">';
            for (let i = 0; i < 4; i++) {
                html += '<div class="ns-cell4">' + buildHeader() + buildLines(getGroupCount(spacing, '4')) + '</div>';
            }
            html += '</div>';
        }

        html += `<div class="copyright-footer">© ${year} AriClass. All rights reserved.</div>`;
        puzzlePreview.innerHTML = html;

        // Apply spacing class
        puzzlePreview.classList.remove('wp-narrow', 'wp-normal', 'wp-wide');
        puzzlePreview.classList.add('wp-' + spacing);

        // Apply color class
        puzzlePreview.classList.remove('wp-color-bw', 'wp-color-red', 'wp-color-blue');
        puzzlePreview.classList.add('wp-color-' + getColor());

        // 4-per-page only: no outer margin
        puzzlePreview.classList.toggle('ns-fullpage', layout === '4');
    }

    layoutInputs.forEach(r => r.addEventListener('change', updatePreview));
    spacingInputs.forEach(r => r.addEventListener('change', updatePreview));
    colorInputs.forEach(r => r.addEventListener('change', updatePreview));
    if (printBtn)    printBtn.addEventListener('click', () => window.print());
    if (printBtnTop) printBtnTop.addEventListener('click', () => window.print());

    updatePreview();
});
