(function () {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('imageInput');
    const photoGrid = document.getElementById('photoGrid');
    const emptyHint = document.getElementById('emptyHint');
    const form = document.getElementById('createAnimalForm');

    let files = []; // in-memory queue of File objects; index 0 is always "primary"

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
    });

    ['dragover', 'dragenter'].forEach(evt =>
        dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.add('dragover'); })
    );
    ['dragleave', 'drop'].forEach(evt =>
        dropzone.addEventListener(evt, e => { e.preventDefault(); dropzone.classList.remove('dragover'); })
    );
    dropzone.addEventListener('drop', e => {
        addFiles(Array.from(e.dataTransfer.files || []));
    });

    fileInput.addEventListener('change', () => {
        addFiles(Array.from(fileInput.files || []));
        fileInput.value = ''; // reset so selecting the same file again still fires 'change'
    });

    function addFiles(newFiles) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        const maxSize = 5 * 1024 * 1024;
        newFiles.forEach(f => {
            if (!allowed.includes(f.type) || f.size > maxSize) return;
            files.push(f);
        });
        render();
    }

    function removeFile(index) {
        files.splice(index, 1);
        render();
    }

    function setPrimary(index) {
        if (index === 0) return;
        const [chosen] = files.splice(index, 1);
        files.unshift(chosen);
        render();
    }

    function render() {
        photoGrid.innerHTML = '';
        emptyHint.classList.toggle('d-none', files.length > 0);

        files.forEach((file, index) => {
            const url = URL.createObjectURL(file);
            const thumb = document.createElement('div');
            thumb.className = 'photo-thumb' + (index === 0 ? ' is-primary' : '');
            thumb.innerHTML = `
                    <img src="${url}" alt="Preview ${index + 1}" />
                    ${index === 0 ? '<span class="primary-badge">Primary</span>' : ''}
                    <button type="button" class="remove-btn" aria-label="Remove photo">✕</button>
                    ${index !== 0 ? '<button type="button" class="set-primary-btn">Set Primary</button>' : ''}
                `;
            thumb.querySelector('.remove-btn').addEventListener('click', () => removeFile(index));
            const setPrimaryBtn = thumb.querySelector('.set-primary-btn');
            if (setPrimaryBtn) setPrimaryBtn.addEventListener('click', () => setPrimary(index));

            photoGrid.appendChild(thumb);
        });

        syncFileInput();
    }

    // Rebuild the real <input type="file"> so the browser actually submits
    // the current (possibly reordered/filtered) file list on form submit.
    function syncFileInput() {
        const dataTransfer = new DataTransfer();
        files.forEach(f => dataTransfer.items.add(f));
        fileInput.files = dataTransfer.files;
    }

    // Re-sync after the input was reset so the browser submits the queued files.
    form.addEventListener('submit', () => {
        fileInput.name = 'NewImages';
        syncFileInput();
    });
})();
