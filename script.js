// Function to fetch Excel data and display products
async function loadExcelData() {
  try {
    console.log("Fetching Excel data...");
    const response = await fetch('https://senhengtemerloh.github.io/SCRC/data.xlsx'); // Full URL to the Excel file

    if (!response.ok) {
      throw new Error(`Failed to load Excel file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer(); // Read file as binary buffer
    const workbook = XLSX.read(arrayBuffer, { type: 'array' }); // Parse workbook
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Read the first sheet
    const products = XLSX.utils.sheet_to_json(worksheet); // Convert sheet to JSON

    console.log("Excel data fetched successfully:", products);
    populateProducts(products); // Populate products on the page
  } catch (error) {
    console.error("Error loading Excel file:", error);
    alert("Failed to load Excel file. Please check the console for details.");
  }
}

// Function to populate products dynamically
function populateProducts(products) {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = ""; // Clear any existing content

  if (products.length === 0) {
    productGrid.innerHTML = "<p>No products found in the Excel file.</p>";
    return;
  }

  products.forEach((product) => {
    const productBox = document.createElement("div");
    productBox.className = "product-box";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";

    const image = document.createElement("img");
    image.src = product.IMAGE || "https://via.placeholder.com/300x300?text=No+Image"; // Display image URL or placeholder
    image.alt = product["FULL NAME"] || "Product Image";

    imageContainer.appendChild(image);
    productBox.appendChild(imageContainer);

    const fullName = document.createElement("div");
    fullName.className = "full-name";
    fullName.innerText = product["FULL NAME"] || "No Name Provided";
    productBox.appendChild(fullName);

    const scfCode = document.createElement("div");
    scfCode.className = "scf-code";
    scfCode.innerText = `SCF: ${product.SCF || "N/A"}`;
    productBox.appendChild(scfCode);

    const pricing = document.createElement("div");
    pricing.className = "pricing";
    pricing.innerText = `RCP: ${product.RCP || "N/A"} | Member Price: ${product.MEMBER || "N/A"}`;
    productBox.appendChild(pricing);

    const promoPrice = document.createElement("div");
    promoPrice.className = "promo-price";
    promoPrice.innerText = `${product.RM || "RM0.00"} + ${product["S-COIN"] || "0"} S-Coin pts`;
    productBox.appendChild(promoPrice);

    const remark = document.createElement("div");
    remark.className = "remark";
    remark.innerText = `Remark: ${product.REMARK || ""}`;
    productBox.appendChild(remark);

    productGrid.appendChild(productBox);
  });
}

// Load Excel data on page load
window.onload = loadExcelData;
