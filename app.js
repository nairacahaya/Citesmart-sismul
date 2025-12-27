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

    // --- 2. LOGIKA KATALOG ---
    function displayBooks(books) {
        if (!bookGrid) return;
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
                            <button class="btn-icon heart-btn" onclick="toggleFavorite('${book.id}')">
                                <i class="${isFavorite(book.id) ? 'ph-fill' : 'ph'} ph-heart" 
                                   style="color: ${isFavorite(book.id) ? '#BE1622' : 'inherit'}"></i>
                            </button>
                            <button class="btn-icon">
                                <i class="ph ph-eye"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            bookGrid.innerHTML += card;
        });
    }

    // Jalankan tampilan awal
    if (typeof booksData !== 'undefined' && bookGrid) {
        displayBooks(booksData);
    }

    // Pencarian
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

    // Chips Filter
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const category = chip.getAttribute('data-category');
            const filtered = category === 'all' ? booksData : booksData.filter(b => b.category === category);
            displayBooks(filtered);
        });
    });

    // --- 3. MODE GELAP ---
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

    // --- 4. MODAL AKSESIBILITAS ---
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
});

// --- 5. GLOBAL FUNCTIONS (Di luar DOMContentLoaded) ---

// Fungsi Favorit
let favorites = JSON.parse(localStorage.getItem('citesmart_favorites')) || [];
window.isFavorite = function(bookId) {
    return favorites.some(fav => fav.id === bookId);
};

window.toggleFavorite = function(bookId) {
    const bookIndex = favorites.findIndex(fav => fav.id === bookId);
    if (bookIndex > -1) {
        favorites.splice(bookIndex, 1);
    } else {
        const bookData = booksData.find(b => b.id === bookId);
        if (bookData) favorites.push(bookData);
    }
    localStorage.setItem('citesmart_favorites', JSON.stringify(favorites));
    
    // Refresh Grid
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const filtered = booksData.filter(book => book.title.toLowerCase().includes(query));
    if (typeof displayBooks === 'function') displayBooks(filtered);
};

// Fungsi Aksesibilitas
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

window.resetAccessibility = function() {
    document.body.className = '';
    document.body.style.fontSize = '';
    const guide = document.getElementById('readingGuide');
    if (guide) guide.style.display = 'none';
    const accessModal = document.getElementById('accessModal');
    if (accessModal) accessModal.style.display = 'none';
};

// --- 6. ADVANCED SEARCH ---
const advModal = document.getElementById('advancedSearchModal');
const advBtn = document.querySelector('.btn-outline');
const closeAdv = document.getElementById('closeAdvancedSearch');

if (advBtn) {
    advBtn.onclick = (e) => { e.preventDefault(); advModal.style.display = 'block'; };
}
if (closeAdv) {
    closeAdv.onclick = () => advModal.style.display = 'none';
}

const advForm = document.getElementById('advSearchForm');
if (advForm) {
    advForm.onsubmit = (e) => {
        e.preventDefault();
        const category = document.getElementById('advCategory').value;
        const title = document.getElementById('advTitle').value.toLowerCase();
        const author = document.getElementById('advAuthor').value.toLowerCase();

        const filtered = booksData.filter(book => {
            const matchCategory = category === 'all' || book.category === category;
            const matchTitle = book.title.toLowerCase().includes(title);
            const matchAuthor = book.author.toLowerCase().includes(author);
            return matchCategory && matchTitle && matchAuthor;
        });

        const bookGrid = document.getElementById('bookGrid');
        if (bookGrid) {
            // Kita panggil fungsi displayBooks yang ada di dalam scope DOMContentLoaded melalui trik global atau memindahkannya
            location.reload(); // Cara termudah untuk refresh hasil filter jika scope bermasalah
        }
    };
}
