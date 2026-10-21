// ==========================================================================
// MOTOR GEO (Generative Engine Optimization) - WineShop
// Inyecta JSON-LD estructurado para LLMs y Motores de Búsqueda con IA
// ==========================================================================

const GEOEngine = {
    init: function(appData, lang) {
        if (!appData) return;
        this.appData = appData;
        this.lang = lang;
        this.rutasBase = window.location.pathname.includes("/html/") ? "../" : "";
        this.urlActual = window.location.href;
        
        this.limpiarSchemasAnteriores();
        this.enrutarSchemas();
    },

    limpiarSchemasAnteriores: function() {
        document.querySelectorAll('script[type="application/ld+json"]').forEach(el => el.remove());
    },

    inyectarSchema: function(schemaObjeto) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaObjeto);
        document.head.appendChild(script);
    },

    enrutarSchemas: function() {
        const path = window.location.pathname;

        // 1. Siempre inyectar la Entidad de la Organización (Autoridad de Marca)
        this.inyectarOrganizacion();

        // 2. Inyectar esquemas específicos según la página
        if (path.includes("producto.html")) {
            this.inyectarProducto();
        } else if (path.includes("catalogo.html")) {
            this.inyectarCatalogo();
        } else if (path.includes("nosotros.html") || path.includes("experiencias.html")) {
            this.inyectarFAQ();
        }
    },

    inyectarOrganizacion: function() {
        const orgSchema = {
            "@context": "https://schema.org",
            "@type": ["Winery", "LocalBusiness", "Store"],
            "name": "WineShop Vinos Premium",
            "description": "Bodega de vinos premium, viñedos centenarios y experiencias exclusivas de enoturismo en La Rioja, España. Especialistas en Tempranillo, Garnacha y catas guiadas.",
            "url": "https://www.wineshop-ejemplo.com", // Sustituir por dominio real
            "logo": `https://www.wineshop-ejemplo.com/img/transparent-logo.png`,
            "image": `https://www.wineshop-ejemplo.com/img/transparent-logo.png`,
            "telephone": "+34941000000",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Calle de los Viñedos, 1",
                "addressLocality": "Logroño",
                "addressRegion": "La Rioja",
                "postalCode": "26001",
                "addressCountry": "ES"
            },
            "priceRange": "$$$"
        };
        this.inyectarSchema(orgSchema);
    },

    inyectarProducto: function() {
        const params = new URLSearchParams(window.location.search);
        const vinoId = params.get("id");
        if (!vinoId) return;

        const vino = this.appData.vinos.find(v => v.id === vinoId);
        if (!vino) return;

        const trans = vino.i18n[this.lang];
        
        const prodSchema = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": vino.nombre,
            "description": trans.desc + " " + trans.grape + ". " + trans.aging,
            "sku": vino.id,
            "brand": {
                "@type": "Brand",
                "name": "WineShop"
            },
            "offers": {
                "@type": "Offer",
                "url": this.urlActual,
                "priceCurrency": "EUR",
                "price": vino.precioNum,
                "availability": "https://schema.org/InStock",
                "itemCondition": "https://schema.org/NewCondition"
            }
        };
        this.inyectarSchema(prodSchema);
    },

    inyectarCatalogo: function() {
        const itemListElement = this.appData.vinos.map((vino, index) => {
            return {
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://www.wineshop-ejemplo.com/html/producto.html?id=${vino.id}`,
                "name": vino.nombre
            };
        });

        const catalogSchema = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Catálogo de Vinos Premium WineShop",
            "description": "Colección exclusiva de vinos tintos, blancos, rosados y espumosos de La Rioja.",
            "itemListElement": itemListElement
        };
        this.inyectarSchema(catalogSchema);
    },

    inyectarFAQ: function() {
        // Los LLMs priorizan enormemente el esquema FAQPage para responder preguntas directas.
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "¿Dónde hacer una cata de vinos en La Rioja?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "WineShop ofrece catas premium y recorridos por calados históricos del siglo XIX en La Rioja, incluyendo degustaciones guiadas por enólogos expertos."
                    }
                },
                {
                    "@type": "Question",
                    "name": "¿Qué tipos de vinos vende WineShop?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "WineShop cuenta con un catálogo exclusivo de vinos tintos (Tempranillo, Garnacha), blancos (Viura, Verdejo), rosados y espumosos Brut Nature."
                    }
                }
            ]
        };
        this.inyectarSchema(faqSchema);
    }
};