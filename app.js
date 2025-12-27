document.addEventListener('DOMContentLoaded', () => {
    const bookGrid = document.getElementById('bookGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const chips = document.querySelectorAll('.chip');

    // Fungsi untuk menampilkan buku
    function displayBooks(books) {
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

    // Tampilkan semua buku saat pertama load
    displayBooks(booksData);

    // Fitur Pencarian
    function handleSearch() {
        const query = searchInput.value.toLowerCase();
        const filtered = booksData.filter(book => 
            book.title.toLowerCase().includes(query) || 
            book.author.toLowerCase().includes(query)
        );
        displayBooks(filtered);
    }

    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Fitit Kategori (Chips)
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            
            const category = chip.getAttribute('data-category');
            if (category === 'all') {
                displayBooks(booksData);
            } else {
                const filtered = booksData.filter(book => book.category === category);
                displayBooks(filtered);
            }
        });
    });

    // Theme Toggle Logic
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('citesmart_theme');

    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="ph ph-sun"></i>';
    }

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
});
