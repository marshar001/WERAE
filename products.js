/* BODEGS — CENTRAL PRODUCT DATA
   Products now come from the BODEGS database (Supabase).
   If the database cannot be reached, the built-in demo products below are used,
   so the site never shows a blank page.

   Pages that use this file must load these two scripts BEFORE it:
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
     <script src="supabase.js"></script>
   and must wait for  window.BODEGS.ready  before reading products.
*/

/* Built-in demo products (used only if the database is unreachable). */
const BODEGS_FALLBACK_PRODUCTS = [
  {
    id: "prod_premium_handbag",
    name: "Premium Handbag",
    slug: "premium-handbag",
    price: 85000,
    currency: "NGN",
    description:
      "A premium handbag from a verified BODEGS seller. This product is processed through BODEGS for secure payment and delivery.",
    category: "Bags",
    sellerId: "seller_demo_001",
    sellerName: "Verified Fashion Store",
    sellerVerified: true,
    productVerified: true,
    condition: "Excellent",
    inventory: 1,
    images: [
      "IMG_20260922_142902.jpg",
      "IMG_20260922_142927.jpg",
      "IMG_20260922_142956.jpg",
      "Screenshot_20260922-142655~2.jpg"
    ],
    colors: [{ name: "Black", value: "#111111" }]
  },
  {
    id: "prod_classic_sneakers",
    name: "Classic Sneakers",
    slug: "classic-sneakers",
    price: 65000,
    currency: "NGN",
    description:
      "Classic sneakers from a verified BODEGS seller. This product is processed through BODEGS for secure payment and delivery.",
    category: "Shoes",
    sellerId: "seller_demo_001",
    sellerName: "Verified Fashion Store",
    sellerVerified: true,
    productVerified: true,
    images: ["product-classic-sneakers.jpg"],
    colors: [{ name: "Classic", value: "#111111" }]
  },
  {
    id: "prod_designer_jacket",
    name: "Designer Jacket",
    slug: "designer-jacket",
    price: 120000,
    currency: "NGN",
    description:
      "Designer jacket from a verified BODEGS seller. This product is processed through BODEGS for secure payment and delivery.",
    category: "Outerwear",
    sellerId: "seller_demo_001",
    sellerName: "Verified Fashion Store",
    sellerVerified: true,
    productVerified: true,
    images: ["product-designer-jacket-portrait-clean.jpg"]
  },
  {
    id: "prod_leather_shoes",
    name: "Leather Shoes",
    slug: "leather-shoes",
    price: 55000,
    currency: "NGN",
    description:
      "Leather shoes from a verified BODEGS seller. This product is processed through BODEGS for secure payment and delivery.",
    category: "Shoes",
    sellerId: "seller_demo_001",
    sellerName: "Verified Fashion Store",
    sellerVerified: true,
    productVerified: true,
    images: ["product-leather-shoes.jpg"]
  }
];

/* The live list. It starts with the demo products and is replaced by the
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
    colors: Array.isArray(row.colors) ? row.colors : []
  };
}

/* Load products from the database. Never rejects: on any problem the demo
   products stay in place. */
function loadProductsFromDatabase() {
  const TIMEOUT_MS = 6000;

  if (typeof sb === "undefined") {
    return Promise.resolve("fallback");
  }

  const request = sb
    .from("products")
    .select(
      "id, name, description, price_ngn, category, condition, inventory, " +
      "images, colors, image_url, seller_id, sellers(boutique_name, verified)"
    )
    .eq("active", true)
    .order("created_at", { ascending: true })
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
    console.warn("BODEGS: using built-in products.", error);
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
  getProductLegacyUrl
};
