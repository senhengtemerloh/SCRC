document.addEventListener('DOMContentLoaded', () => {
    const url = 'database.xlsx';
    let allProducts = [];
    let currentSort = '';
    let currentBrandFilter = '';
    let currentSearchQuery = '';

    // Load data and initialize
    fetch(url)
        .then(res => res.arrayBuffer())
        .then(buffer => {
            const workbook = XLSX.read(buffer, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            allProducts = XLSX.utils.sheet_to_json(worksheet);
            
            // Initialize brand filter options
            const uniqueBrands = [...new Set(allProducts.map(p => p.BRAND))].sort();
            const brandFilter = document.getElementById('brandFilter');
            uniqueBrands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand;
                option.textContent = brand;
                brandFilter.appendChild(option);
            });

            renderFilteredProducts();
        })
        .catch(error => console.error('Error loading Excel file:', error));

    // Event listeners
    document.getElementById('searchInput').addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.toLowerCase();
        renderFilteredProducts();
    });

    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderFilteredProducts();
    });

    document.getElementById('brandFilter').addEventListener('change', (e) => {
        currentBrandFilter = e.target.value;
        renderFilteredProducts();
    });

    function renderFilteredProducts() {
        let filtered = allProducts.filter(product => {
            const matchesSearch = product.NAME.toLowerCase().includes(currentSearchQuery) ||
                                  product.SCF.toLowerCase().includes(currentSearchQuery);
            const matchesBrand = currentBrandFilter ? product.BRAND === currentBrandFilter : true;
            return matchesSearch && matchesBrand;
        });

        switch(currentSort) {
            case 'scoin-asc':
                filtered.sort((a, b) => a['S-COIN'] - b['S-COIN']);
                break;
            case 'scoin-desc':
                filtered.sort((a, b) => b['S-COIN'] - a['S-COIN']);
                break;
            case 'brand-asc':
                filtered.sort((a, b) => a.BRAND.localeCompare(b.BRAND));
                break;
            case 'brand-desc':
                filtered.sort((a, b) => b.BRAND.localeCompare(a.BRAND));
                break;
        }

        const container = document.getElementById('productContainer');
        container.innerHTML = '';
        renderProducts(filtered);
    }

    // Existing functions (keep them as is)
    function formatMYR(number) { /* ... */ }
    function formatNumber(number) { /* ... */ }
    function renderProducts(products) { /* ... */ }
    function adjustSpecsFontSize(text) { /* ... */ }
});
