// Function to fetch Excel data and display products
async function loadExcelData() {
  try {
    const response = await fetch(window.location.origin + '/SCRC/data.xlsx'); // Fetch the Excel file from root
    if (!response.ok) {
      throw new Error('Failed to load Excel file');
    }

    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Read the first sheet
    const products = XLSX.utils.sheet_to_json(worksheet); // Convert to JSON format
    populateProducts(products);
  } catch (error) {
    console.error(error);
    alert("Failed to load Excel file. Please make sure the file is available.");
  }
}

// Function to populate products dynamically
function populateProducts(products) {
  const productGrid = document.getElementById("product-grid");
  productGrid.innerHTML = ""; // Clear any existing content

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

// Load Excel data when the page loads
window.onload = loadExcelData;
