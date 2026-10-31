/* BODEGS — CENTRAL PRODUCT DATA
   Products now come from the BODEGS database (Supabase).
   If the database cannot be reached, the list stays empty and the pages say so.

   Pages that use this file must load these two scripts BEFORE it:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="supabase.js"></script>
   and must wait for  window.BODEGS.ready  before reading products.
*/

/* No built-in demo products any more: the shop shows only what real sellers have added. */
const BODEGS_FALLBACK_PRODUCTS = [];

/* The live list. It starts empty and is filled with the
   database products as soon as they arrive. The same array object is kept so
   anything holding a reference to it sees the update. */
const BODEGS_PRODUCTS = BODEGS_FALLBACK_PRODUCTS.slice();

function getAllProducts() {
  return BODEGS_PRODUCTS.slice();
}

function getProductById(productId) {
  return BODEGS_PRODUCTS.find(product => product.id === productId) || null;
}

function getProductBySlug(slug) {
  return BODEGS_PRODUCTS.find(product => product.slug === slug) || null;
}

function formatCurrency(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/* Writes a price into an element with a smaller currency sign (the naira sign looks too big at full size). */
function setPrice(element, amount, currency = "NGN") {
  const text = formatCurrency(amount, currency);
  element.textContent = "";
  const match = text.match(/^([^0-9\s]+)\s*(.*)$/);
  if (!match) { element.textContent = text; return; }
  const sign = document.createElement("span");
  sign.className = "cur";
  sign.textContent = match[1];
  element.appendChild(sign);
  element.appendChild(document.createTextNode(match[2]));
}

/* Temporary migration helper (kept from the old file). */
function getProductLegacyUrl(productId) {
  const legacyUrls = {
    prod_premium_handbag: "product.html",
    prod_classic_sneakers: "product-sneakers.html",
    prod_designer_jacket: "product-jacket.html",
    prod_leather_shoes: "product-leather-shoes.html"
  };
  return legacyUrls[productId] || "product.html";
}

/* Turn one database row into the shape the pages already expect. */
function fromDatabaseRow(row) {
  const seller = row.sellers || {};
  const images =
    Array.isArray(row.images) && row.images.length
      ? row.images
      : (row.image_url ? [row.image_url] : []);

  return {
    id: row.id,
    name: row.name,
    slug: row.id,
    price: Number(row.price_ngn),
    currency: "NGN",
    description: row.description || "",
    category: row.category,
    sellerId: row.seller_id,
    sellerName: seller.boutique_name || "BODEGS Seller",
    sellerVerified: !!seller.verified,
    productVerified: !!seller.verified,
    condition: row.condition || undefined,
    inventory: row.inventory,
    images: images,
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    material: row.material || "",
    composition: row.composition || "",
    fit: row.fit || "",
    care: row.care || ""
  };
}

/* Load products from the database. Never rejects: resolves "database" when the
   products loaded, or "fallback" when they could not be reached. */
function loadProductsFromDatabase() {
  const TIMEOUT_MS = 6000;

  if (typeof sb === "undefined") {
    return Promise.resolve("fallback");
  }

  const BASE_COLUMNS =
    "id, name, description, price_ngn, category, condition, inventory, " +
    "images, colors, image_url, seller_id, sellers(boutique_name, verified)";

  function query(columns) {
    return sb
      .from("products")
      .select(columns)
      .eq("active", true)
      .order("created_at", { ascending: false });
  }

  // Ask for the newer detail columns (sizes, material...). If the database
  // does not have them yet, quietly fall back to the basic columns.
  const request = query(BASE_COLUMNS + ", sizes, material, composition, fit, care")
    .then(result => result.error ? query(BASE_COLUMNS) : result)
    .then(result => {
      if (result.error) { throw result.error; }
      BODEGS_PRODUCTS.splice(
        0,
        BODEGS_PRODUCTS.length,
        ...result.data.map(fromDatabaseRow)
      );
      return "database";
    });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS)
  );

  return Promise.race([request, timeout]).catch(error => {
    console.warn("BODEGS: could not load products.", error);
    return "fallback";
  });
}

window.BODEGS = {
  products: BODEGS_PRODUCTS,
  ready: loadProductsFromDatabase(),
  getAllProducts,
  getProductById,
  getProductBySlug,
  formatCurrency,
  setPrice,
  getProductLegacyUrl
};
