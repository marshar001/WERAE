/* BODEGS — CENTRAL PRODUCT DATA
   Single source of truth for marketplace product data.
   Existing product pages are not changed by this file yet.
*/

const BODEGS_PRODUCTS = [
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
    colors: [
      {
        name: "Black",
        value: "#111111"
      }
    ]
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
    images: [
      "product-classic-sneakers.jpg"
    ],
    colors: [
      {
        name: "Classic",
        value: "#111111"
      }
    ]
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
    images: [
      "product-designer-jacket-portrait-clean.jpg"
    ]
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
    images: [
      "product-leather-shoes.jpg"
    ]
  }
];

function getAllProducts() {
  return BODEGS_PRODUCTS.slice();
}

function getProductById(productId) {
  return BODEGS_PRODUCTS.find(
    product => product.id === productId
  ) || null;
}

function getProductBySlug(slug) {
  return BODEGS_PRODUCTS.find(
    product => product.slug === slug
  ) || null;
}

function formatCurrency(amount, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

/*
  Temporary migration helper.
  This keeps the existing prototype URLs available while we move
  every product link to product IDs.
*/

function getProductLegacyUrl(productId) {
  const legacyUrls = {
    prod_premium_handbag: "product.html",
    prod_classic_sneakers: "product-sneakers.html",
    prod_designer_jacket: "product-jacket.html",
    prod_leather_shoes: "product-leather-shoes.html"
  };

  return legacyUrls[productId] || "product.html";
}

window.BODEGS = {
  products: BODEGS_PRODUCTS,
  getAllProducts,
  getProductById,
  getProductBySlug,
  formatCurrency,
  getProductLegacyUrl
};
