document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INISIALISASI ELEMEN ---
    const bookGrid = document.getElementById('bookGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const chips = document.querySelectorAll('.chip');
    const themeToggle = document.getElementById('themeToggle');
    const accessBtn = document.getElementById('accessBtn');
    const accessModal = document.getElementById('accessModal');
    const closeAccess = document.getElementById('closeAccess');
    const resetAllBtn = document.getElementById('resetAll');

    // --- 2. LOGIKA KATALOG (Hanya jalan jika ada elemen bookGrid) ---
    function displayBooks(books) {
        if (!bookGrid) return; // Lewati jika bukan di halaman index
        bookGrid.innerHTML = '';
        if (books.length === 0) {
            bookGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Koleksi tidak ditemukan.</p>';
            return;
        }

        books.forEach(book => {
            const card = `
                <div class="card">
                    <div class="card-img-wrapper">
                        <img src="${book.image}" alt="${book.title}" class="card-img">
                    </div>
                    <div class="card-body">
                        <span class="card-tag">${book.tag}</span>
                        <h3 class="card-title" title="${book.title}">${book.title}</h3>
                        <p class="card-author">${book.author}</p>
                        <div class="card-actions">
                            <button class="btn-icon"><i class="ph ph-heart"></i></button>
                            <button class="btn-icon"><i class="ph ph-eye"></i></button>
                        </div>
                    </div>
                </div>
            `;
            bookGrid.innerHTML += card;
        });
    }

    // Jalankan fungsi display jika data tersedia
    if (typeof booksData !== 'undefined' && bookGrid) {
        displayBooks(booksData);
    }

    // Fitur Pencarian & Filter
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const query = searchInput.value.toLowerCase();
            const filtered = booksData.filter(book => 
                book.title.toLowerCase().includes(query) || 
                book.author.toLowerCase().includes(query)
            );
            displayBooks(filtered);
        });
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const category = chip.getAttribute('data-category');
            const filtered = category === 'all' ? booksData : booksData.filter(b => b.category === category);
            displayBooks(filtered);
        });
    });

    // --- 3. LOGIKA MODE GELAP (THEME) ---
    const currentTheme = localStorage.getItem('citesmart_theme');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.innerHTML = '<i class="ph ph-moon"></i>';
                localStorage.setItem('citesmart_theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
                localStorage.setItem('citesmart_theme', 'dark');
            }
        });
    }

    // --- 4. FITUR AKSESIBILITAS (GLOBAL FUNCTIONS) ---
    window.adjustText = function(amount) {
        const body = document.body;
        const currentSize = parseFloat(window.getComputedStyle(body).fontSize);
        body.style.fontSize = (currentSize + amount) + 'px';
    };

    window.toggleAccess = function(className) {
        document.body.classList.toggle(className);
        const guide = document.getElementById('readingGuide');
        if (className === 'reading-guide' && guide) {
            guide.style.display = document.body.classList.contains('reading-guide') ? 'block' : 'none';
        }
    };

    // Modal & Reading Guide Logic
    if (accessBtn) {
        accessBtn.addEventListener('click', () => {
            accessModal.style.display = (accessModal.style.display === 'none' || accessModal.style.display === '') ? 'block' : 'none';
        });
    }
    if (closeAccess) {
        closeAccess.addEventListener('click', () => { accessModal.style.display = 'none'; });
    }

    document.addEventListener('mousemove', (e) => {
        const guide = document.getElementById('readingGuide');
        if (guide && guide.style.display === 'block') {
            guide.style.top = e.clientY + 'px';
        }
    });

    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', () => {
            document.body.className = '';
            document.body.style.fontSize = '';
            const guide = document.getElementById('readingGuide');
            if (guide) guide.style.display = 'none';
            accessModal.style.display = 'none';
        });
    }
});
