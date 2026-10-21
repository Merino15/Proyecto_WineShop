// ==========================================================================
// 1. CATÁLOGO CENTRALIZADO DE PRODUCTOS
// ==========================================================================
const catalogoVinos = {
    "vino-1": {
        id: "vino-1",
        nombre: "Reserva Especial 2018",
        desc: "Tempranillo, intenso, elegante y estructurado.",
        precio: "24,00 €",
        modelo: "botella_vino.glb",
        vintage: "D.O.Ca. Rioja · Cosecha 2018",
        grape: "Tempranillo 95%, Graciano 5%",
        aging: "24 meses en barrica francesa y americana",
        alcohol: "14,5% Vol.",
        temp: "16°C - 18°C"
    },
    "vino-2": {
        id: "vino-2",
        nombre: "Gran Bordeos Crianza",
        desc: "Aromas a roble tostado, ciruela y frutos rojos.",
        precio: "35,50 €",
        modelo: "botella_vino.glb",
        vintage: "AOC Bordeaux Superieur",
        grape: "Cabernet Sauvignon 70%, Merlot 30%",
        aging: "18 meses en barrica francesa nueva",
        alcohol: "14,0% Vol.",
        temp: "16°C - 17°C"
    },
    "vino-3": {
        id: "vino-3",
        nombre: "Blanco Fermentado en Barrica",
        desc: "Viura fresca, notas cítricas, florales y miel.",
        precio: "18,90 €",
        modelo: "botella_vino.glb",
        vintage: "D.O.Ca. Rioja · Selección Especial",
        grape: "Viura 85%, Malvasía 15%",
        aging: "6 meses sobre lías con battonage",
        alcohol: "13,0% Vol.",
        temp: "10°C - 12°C"
    },
    "vino-4": {
        id: "vino-4",
        nombre: "Espumoso Brut Nature",
        desc: "Burbuja fina persistente, ideal para celebraciones.",
        precio: "29,00 €",
        modelo: "botella_vino.glb",
        vintage: "Método Tradicional · Reserva",
        grape: "Chardonnay 60%, Pinot Noir 40%",
        aging: "30 meses de rima en calado",
        alcohol: "12,5% Vol.",
        temp: "6°C - 8°C"
    },
    "vino-5": {
        id: "vino-5",
        nombre: "Selección de Autor 2017",
        desc: "Edición limitada procedente de viñedos viejos.",
        precio: "42,00 €",
        modelo: "botella_vino.glb",
        vintage: "Viñedo Singular · Edición Limitada",
        grape: "Garnacha 100%",
        aging: "20 meses en foudres de roble austríaco",
        alcohol: "15,0% Vol.",
        temp: "17°C - 19°C"
    },
    "vino-6": {
        id: "vino-6",
        nombre: "Rosado Pálido de Lágrima",
        desc: "Garnacha suave, sutil, aromática y muy refrescante.",
        precio: "15,50 €",
        modelo: "botella_vino.glb",
        vintage: "Prensado Directo · Añada Actual",
        grape: "Garnacha 80%, Tempranillo Blanco 20%",
        aging: "Joven · 3 meses en acero inoxidable",
        alcohol: "13,5% Vol.",
        temp: "8°C - 10°C"
    }
};

// ==========================================================================
// 2. NAVEGACIÓN MOBILE RESPONSIVE (MENÚ HAMBURGUESA ACCESIBLE)
// ==========================================================================
function iniciarMenuMobile() {
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector(".main-nav");
    if (!navToggle || !mainNav) return;

    navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("is-open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });

    document.addEventListener("click", (e) => {
        if (!mainNav.contains(e.target) && !navToggle.contains(e.target) && mainNav.classList.contains("is-open")) {
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menú de navegación");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mainNav.classList.contains("is-open")) {
            mainNav.classList.remove("is-open");
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Abrir menú de navegación");
            navToggle.focus();
        }
    });
}

// ==========================================================================
// 3. DICCIONARIO INTERNACIONALIZACIÓN (i18n) Y TRADUCCIONES MULTIIDIOMA
// ==========================================================================
const wineTranslations = {
    "vino-1": {
        es: {
            desc: "Tempranillo, intenso, elegante y estructurado.",
            vintage: "D.O.Ca. Rioja · Cosecha 2018",
            grape: "Tempranillo 95%, Graciano 5%",
            aging: "24 meses en barrica francesa y americana"
        },
        en: {
            desc: "Tempranillo, intense, elegant and structured.",
            vintage: "D.O.Ca. Rioja · 2018 Vintage",
            grape: "Tempranillo 95%, Graciano 5%",
            aging: "24 months in French and American oak"
        },
        fr: {
            desc: "Tempranillo, intense, élégant et structuré.",
            vintage: "D.O.Ca. Rioja · Millésime 2018",
            grape: "Tempranillo 95%, Graciano 5%",
            aging: "24 mois en fûts de chêne français et américain"
        },
        de: {
            desc: "Tempranillo, intensiv, elegant und strukturiert.",
            vintage: "D.O.Ca. Rioja · Jahrgang 2018",
            grape: "Tempranillo 95%, Graciano 5%",
            aging: "24 Monate in französischen und amerikanischen Eichenfässern"
        }
    },
    "vino-2": {
        es: {
            desc: "Aromas a roble tostado, ciruela y frutos rojos.",
            vintage: "AOC Bordeaux Superieur",
            grape: "Cabernet Sauvignon 70%, Merlot 30%",
            aging: "18 meses en barrica francesa nueva"
        },
        en: {
            desc: "Aromas of toasted oak, plum and ripe red fruits.",
            vintage: "AOC Bordeaux Supérieur",
            grape: "Cabernet Sauvignon 70%, Merlot 30%",
            aging: "18 months in new French oak barrels"
        },
        fr: {
            desc: "Arômes de chêne toasté, prune et fruits rouges.",
            vintage: "AOC Bordeaux Supérieur",
            grape: "Cabernet Sauvignon 70%, Merlot 30%",
            aging: "18 mois en fûts de chêne français neufs"
        },
        de: {
            desc: "Aromen von gerösteter Eiche, Pflaume und roten Waldbeeren.",
            vintage: "AOC Bordeaux Supérieur",
            grape: "Cabernet Sauvignon 70%, Merlot 30%",
            aging: "18 Monate in neuen französischen Eichenfässern"
        }
    },
    "vino-3": {
        es: {
            desc: "Viura fresca, notas cítricas, florales y miel.",
            vintage: "D.O.Ca. Rioja · Selección Especial",
            grape: "Viura 85%, Malvasía 15%",
            aging: "6 meses sobre lías con battonage"
        },
        en: {
            desc: "Fresh Viura with citrus, delicate florals and honey notes.",
            vintage: "D.O.Ca. Rioja · Special Selection",
            grape: "Viura 85%, Malvasía 15%",
            aging: "6 months on fine lees with battonage"
        },
        fr: {
            desc: "Viura frais, notes d'agrumes, florales et touche de miel.",
            vintage: "D.O.Ca. Rioja · Sélection Spéciale",
            grape: "Viura 85%, Malvasía 15%",
            aging: "6 mois sur lies fines avec bâtonnage"
        },
        de: {
            desc: "Frischer Viura mit Zitrusnuancen, Blütennoten und Honig.",
            vintage: "D.O.Ca. Rioja · Sonderauslese",
            grape: "Viura 85%, Malvasía 15%",
            aging: "6 Monate auf der Feinhefe mit Bâtonnage"
        }
    },
    "vino-4": {
        es: {
            desc: "Burbuja fina persistente, ideal para celebraciones.",
            vintage: "Método Tradicional · Reserva",
            grape: "Chardonnay 60%, Pinot Noir 40%",
            aging: "30 meses de rima en calado"
        },
        en: {
            desc: "Persistent fine bubbles, ideal for celebrations.",
            vintage: "Traditional Method · Reserva",
            grape: "Chardonnay 60%, Pinot Noir 40%",
            aging: "30 months of cellar bottle aging"
        },
        fr: {
            desc: "Bulle fine et persistante, parfait pour les célébrations.",
            vintage: "Méthode Traditionnelle · Reserva",
            grape: "Chardonnay 60%, Pinot Noir 40%",
            aging: "30 mois sur lattes en cave souterraine"
        },
        de: {
            desc: "Feine anhaltende Perlage, perfekt für Festtage.",
            vintage: "Traditionelle Flaschengärung · Reserva",
            grape: "Chardonnay 60%, Pinot Noir 40%",
            aging: "30 Monate Reife im historischen Keller"
        }
    },
    "vino-5": {
        es: {
            desc: "Edición limitada procedente de viñedos viejos.",
            vintage: "Viñedo Singular · Edición Limitada",
            grape: "Garnacha 100%",
            aging: "20 meses en foudres de roble austríaco"
        },
        en: {
            desc: "Limited edition crafted from centenary vineyards.",
            vintage: "Single Vineyard · Limited Edition",
            grape: "Grenache 100%",
            aging: "20 months in Austrian oak foudres"
        },
        fr: {
            desc: "Édition limitée issue de très vieilles vignes de coteaux.",
            vintage: "Vignoble d'Exception · Édition Limitée",
            grape: "Grenache 100%",
            aging: "20 mois en foudres de chêne autrichien"
        },
        de: {
            desc: "Limitierte Auflage aus historischen alten Rebanlagen.",
            vintage: "Einzellage · Limitierte Edition",
            grape: "Garnacha 100%",
            aging: "20 Monate in österreichischen Eichen-Foudres"
        }
    },
    "vino-6": {
        es: {
            desc: "Garnacha suave, sutil, aromática y muy refrescante.",
            vintage: "Prensado Directo · Añada Actual",
            grape: "Garnacha 80%, Tempranillo Blanco 20%",
            aging: "Joven · 3 meses en acero inoxidable"
        },
        en: {
            desc: "Smooth Grenache, subtle, aromatic and refreshing.",
            vintage: "Direct Press · Current Vintage",
            grape: "Grenache 80%, White Tempranillo 20%",
            aging: "Young · 3 months in stainless steel"
        },
        fr: {
            desc: "Grenache délicat, subtil, aromatique et très frais.",
            vintage: "Pressurage Direct · Millésime Actuel",
            grape: "Grenache 80%, Tempranillo Blanc 20%",
            aging: "Jeune · 3 mois en cuve inox"
        },
        de: {
            desc: "Sanfter Garnacha, subtil, blumig und erfrischend kühl.",
            vintage: "Direktpressung · Aktueller Jahrgang",
            grape: "Garnacha 80%, Weißer Tempranillo 20%",
            aging: "Jung · 3 Monate im Edelstahltank"
        }
    }
};

const i18nData = {
    es: {
        title_index: "WineShop - Vinos de Calidad y Enoturismo",
        title_catalogo: "Catálogo de Vinos - WineShop",
        title_bodegas: "Nuestras Bodegas - WineShop",
        title_experiencias: "Experiencias y Enoturismo - WineShop",
        title_favoritos: "Mis Vinos Favoritos - WineShop",
        title_producto: "Detalle del Vino - WineShop",
        skip_to_content: "Saltar al contenido principal",
        nav_inicio: "Inicio",
        nav_catalogo: "Catálogo de Vinos",
        nav_bodegas: "Bodegas",
        nav_experiencias: "Experiencias",
        lang_label: "Seleccionar idioma",
        fav_aria_label: "Ver mis vinos favoritos",
        account_aria_label: "Mi Cuenta, Iniciar Sesión",
        cart_aria_label: "Ver carrito de compras, 0 productos",
        age_title: "¿Eres mayor de edad?",
        age_desc: "Debes tener al menos 18 años para acceder a este sitio web y consumir bebidas alcohólicas de forma responsable.",
        age_yes: "Soy mayor de 18 años",
        age_no: "Soy menor de 18 años",
        age_legal_notice: "Al acceder confirmas que cumples con la edad legal de consumo de alcohol en tu país de residencia.",
        hero_title: "La bodega se asienta en la fértil cuenca",
        hero_desc: "Cada añada es una composición de tierra, clima y dedicación artesanal que trasciende épocas.",
        hero_btn: "Ver Catálogo Completo",
        destacados_title: "Selección Destacada",
        vino_1_desc: "Tempranillo, estructurado y de paso aterciopelado.",
        vino_2_desc: "Viura seleccionada con crianza sobre lías.",
        vino_3_desc: "Burbuja viva y cremosa, maduración tradicional.",
        precio_label: "Precio: ",
        btn_carrito: "Añadir al carrito",
        cat_title: "Catálogo Exclusivo de Vinos",
        cat_desc: "Explora nuestra colección selecta con visualización 3D interactiva.",
        filter_title: "Filtros",
        filter_reset: "Limpiar",
        filter_search_title: "Buscar vino",
        filter_search_placeholder: "Ej. Reserva Especial...",
        filter_type_title: "Tipo de Vino",
        filter_all: "Todos los vinos",
        filter_red: "Tintos",
        filter_white: "Blancos",
        filter_sparkling: "Espumosos",
        filter_rose: "Rosados",
        filter_price_title: "Precio Máximo",
        price_up_to: "Hasta:",
        results_text: "vinos encontrados",
        vino_1_cat_desc: "Tempranillo, intenso, elegante y estructurado.",
        vino_2_cat_desc: "Aromas a roble tostado, ciruela y frutos rojos.",
        vino_3_cat_desc: "Viura fresca, notas cítricas, florales y miel.",
        vino_4_cat_desc: "Burbuja fina persistente, ideal para celebraciones.",
        vino_5_cat_desc: "Edición limitada procedente de viñedos viejos.",
        vino_6_cat_desc: "Garnacha suave, sutil, aromática y muy refrescante.",
        no_wines_found: "No se han encontrado vinos que coincidan con estos filtros.",
        bodegas_title: "Bodegas Asociadas",
        bodegas_desc: "Tradición centenaria, terruño privilegiado y procesos enológicos de máxima exigencia.",
        bodegas_list_title: "Nuestras bodegas de origen",
        bodega_1_sub: "Rioja Alta · Fundada en 1892",
        bodega_1_text: "Viñedos centenarios en ladera orientada al mediodía. Elaboración artesanal en tinos de roble francés y crianza en calados subterráneos.",
        bodega_2_sub: "Rioja Alavesa · Viticultura Ecológica",
        bodega_2_text: "Suelos arcillo-calcáreos de altura dedicados al cultivo biodinámico. Vinos singulares, frescos y con gran mineralidad.",
        bodega_3_sub: "Rioja Oriental · Selección de Autor",
        bodega_3_text: "Especialistas en Garnachas viejas y uvas autóctonas en terrazas fluviales. Innovación técnica al servicio del equilibrio aromático.",
        btn_ver_vinos: "Ver sus vinos",
        exp_title: "Experiencias y Enoturismo",
        exp_desc: "Visitas a pie de viñedo, catas guiadas por enólogos y maridajes exclusivos.",
        exp_1_banner: "Cata Singular",
        exp_1_title: "Cata Premium y Calados Históricos",
        exp_1_duration: "Duración: 2h 30m · Grupos reducidos",
        exp_1_desc: "Recorrido por bodegas subterráneas del siglo XIX con cata comentada de 4 vinos de alta gama acompañados de quesos e ibéricos.",
        btn_reservar: "Reservar Experiencia",
        exp_2_banner: "Paseo en Viñedo",
        exp_2_title: "Ruta en 4x4 por Viñas Viejas",
        exp_2_duration: "Duración: 3h 30m · Exterior",
        exp_2_desc: "Aventura por las parcelas más singulares, explicación del terruño y aperitivo campestre con cata al aire libre.",
        exp_3_banner: "Maridaje de Autor",
        exp_3_title: "Menú Degustación & Maridaje",
        exp_3_duration: "Comida o Cena · Salón Privado",
        exp_3_desc: "Experiencia gastronómica de 6 pases creada por chefs locales, maridada con las añadas más exclusivas de nuestra bodega.",
        per_person: "/ persona",
        fav_page_title: "Mis Vinos Favoritos",
        fav_page_desc: "Tu colección personal de vinos guardados para consultar o comprar cuando desees.",
        fav_empty: "Aún no has añadido ningún vino a tus favoritos.",
        fav_explore: "Explorar Catálogo",
        fav_remove_aria: "Quitar de favoritos",
        fav_add_aria: "Añadir a favoritos",
        back_to_catalog: "Volver al catálogo",
        hint_3d: "Haz clic y arrastra para rotar en 360° · Usa la rueda o pellizca para hacer zoom",
        product_exclusive_badge: "Colección Exclusiva",
        spec_grape: "Variedad",
        spec_aging: "Crianza",
        spec_alcohol: "Graduación",
        spec_temp: "Temperatura",
        footer_copy: "© 2026 WineShop. Todos los derechos reservados.",
        footer_privacy: "Política de Privacidad",
        footer_terms: "Términos y Condiciones",
        footer_a11y: "Declaración de Accesibilidad"
    },
    en: {
        title_index: "WineShop - Quality Wines & Wine Tourism",
        title_catalogo: "Wine Catalog - WineShop",
        title_bodegas: "Our Wineries - WineShop",
        title_experiencias: "Experiences & Wine Tourism - WineShop",
        title_favoritos: "My Favorite Wines - WineShop",
        title_producto: "Wine Details - WineShop",
        skip_to_content: "Skip to main content",
        nav_inicio: "Home",
        nav_catalogo: "Wine Catalog",
        nav_bodegas: "Wineries",
        nav_experiencias: "Experiences",
        lang_label: "Select language",
        fav_aria_label: "View my favorite wines",
        account_aria_label: "My Account, Log In",
        cart_aria_label: "View shopping cart, 0 items",
        age_title: "Are you of legal age?",
        age_desc: "You must be at least 18 years old to access this website and consume alcoholic beverages responsibly.",
        age_yes: "I am 18 years old or older",
        age_no: "I am under 18 years old",
        age_legal_notice: "By entering you confirm that you meet the legal drinking age in your country of residence.",
        hero_title: "The winery rests in the fertile river basin",
        hero_desc: "Each vintage is a harmony of terroir, climate and artisan dedication that transcends generations.",
        hero_btn: "View Full Catalog",
        destacados_title: "Featured Selection",
        vino_1_desc: "Tempranillo, structured with a velvety palate.",
        vino_2_desc: "Selected Viura aged on fine lees.",
        vino_3_desc: "Lively, creamy bubbles, traditional bottle aging.",
        precio_label: "Price: ",
        btn_carrito: "Add to cart",
        cat_title: "Exclusive Wine Catalog",
        cat_desc: "Explore our curated selection with interactive 3D bottle preview.",
        filter_title: "Filters",
        filter_reset: "Reset",
        filter_search_title: "Search wine",
        filter_search_placeholder: "e.g. Reserva Especial...",
        filter_type_title: "Wine Type",
        filter_all: "All wines",
        filter_red: "Red",
        filter_white: "White",
        filter_sparkling: "Sparkling",
        filter_rose: "Rosé",
        filter_price_title: "Maximum Price",
        price_up_to: "Up to:",
        results_text: "wines found",
        vino_1_cat_desc: "Tempranillo, intense, elegant and structured.",
        vino_2_cat_desc: "Aromas of toasted oak, plum and red berries.",
        vino_3_cat_desc: "Fresh Viura, citrus nuances, floral notes and honey.",
        vino_4_cat_desc: "Persistent fine bubbles, ideal for celebrations.",
        vino_5_cat_desc: "Limited edition crafted from old vineyards.",
        vino_6_cat_desc: "Smooth Grenache, subtle, aromatic and refreshing.",
        no_wines_found: "No wines match your selected filter criteria.",
        bodegas_title: "Partner Wineries",
        bodegas_desc: "Centuries-old heritage, prestigious terroirs and winemaking of the highest distinction.",
        bodegas_list_title: "Our estates of origin",
        bodega_1_sub: "Rioja Alta · Founded in 1892",
        bodega_1_text: "Centenary south-facing hillside vineyards. Handcrafted aging in French oak vats and subterranean cellars.",
        bodega_2_sub: "Rioja Alavesa · Organic Viticulture",
        bodega_2_text: "High-altitude limestone-clay soils dedicated to biodynamic farming. Singular, mineral-driven fresh wines.",
        bodega_3_sub: "Rioja Oriental · Signature Selection",
        bodega_3_text: "Old-vine Grenache and native varietal masters on fluvial terraces. Technical innovation ensuring aromatic harmony.",
        btn_ver_vinos: "View wines",
        exp_title: "Experiences & Wine Tourism",
        exp_desc: "Vineyard footpaths, sommelier-guided tastings and exclusive culinary pairings.",
        exp_1_banner: "Signature Tasting",
        exp_1_title: "Premium Tasting & Historic Cellars",
        exp_1_duration: "Duration: 2h 30m · Small groups",
        exp_1_desc: "Tour through 19th-century underground cellars with guided tasting of 4 prestigious wines paired with artisan cheeses and Iberian meats.",
        btn_reservar: "Book Experience",
        exp_2_banner: "Vineyard Journey",
        exp_2_title: "4x4 Expedition through Old Vines",
        exp_2_duration: "Duration: 3h 30m · Outdoor",
        exp_2_desc: "Adventure across our most scenic plots, in-depth terroir explanations and a country picnic with open-air tasting.",
        exp_3_banner: "Signature Pairing",
        exp_3_title: "Tasting Menu & Wine Pairing",
        exp_3_duration: "Lunch or Dinner · Private Salon",
        exp_3_desc: "6-course gastronomic tasting menu crafted by local master chefs, matched with our winery's rarest reserve vintages.",
        per_person: "/ person",
        fav_page_title: "My Favorite Wines",
        fav_page_desc: "Your saved wine collection ready for consultation or checkout whenever you desire.",
        fav_empty: "You have not added any wines to your favorites yet.",
        fav_explore: "Explore Catalog",
        fav_remove_aria: "Remove from favorites",
        fav_add_aria: "Add to favorites",
        back_to_catalog: "Back to catalog",
        hint_3d: "Click and drag to rotate 360° · Use mouse wheel or pinch to zoom",
        product_exclusive_badge: "Exclusive Collection",
        spec_grape: "Grape Variety",
        spec_aging: "Aging",
        spec_alcohol: "Alcohol",
        spec_temp: "Serving Temp.",
        footer_copy: "© 2026 WineShop. All rights reserved.",
        footer_privacy: "Privacy Policy",
        footer_terms: "Terms & Conditions",
        footer_a11y: "Accessibility Statement"
    },
    fr: {
        title_index: "WineShop - Vins d'Exception & Œnotourisme",
        title_catalogo: "Catalogue de Vins - WineShop",
        title_bodegas: "Nos Domaines - WineShop",
        title_experiencias: "Expériences & Œnotourisme - WineShop",
        title_favoritos: "Mes Vins Favoris - WineShop",
        title_producto: "Détails du Vin - WineShop",
        skip_to_content: "Passer au contenu principal",
        nav_inicio: "Accueil",
        nav_catalogo: "Catalogue de Vins",
        nav_bodegas: "Domaines",
        nav_experiencias: "Expériences",
        lang_label: "Sélectionner la langue",
        fav_aria_label: "Voir mes vins favoris",
        account_aria_label: "Mon Compte, Connexion",
        cart_aria_label: "Voir le panier d'achats, 0 articles",
        age_title: "Êtes-vous majeur ?",
        age_desc: "Vous devez avoir au moins 18 ans pour accéder à ce site et consommer des boissons alcoolisées de manière responsable.",
        age_yes: "J'ai 18 ans ou plus",
        age_no: "J'ai moins de 18 ans",
        age_legal_notice: "En accédant au site, vous confirmez avoir l'âge légal pour consommer de l'alcool dans votre pays.",
        hero_title: "Le domaine s'établit dans le bassin fertile",
        hero_desc: "Chaque millésime est une harmonie de terroir, climat et passion artisanale qui traverse les époques.",
        hero_btn: "Voir le Catalogue Complet",
        destacados_title: "Sélection Coup de Cœur",
        vino_1_desc: "Tempranillo, structuré et velouté en bouche.",
        vino_2_desc: "Viura sélectionné avec élevage sur lies fines.",
        vino_3_desc: "Bulle vive et crémeuse, maturation traditionnelle.",
        precio_label: "Prix : ",
        btn_carrito: "Ajouter au panier",
        cat_title: "Catalogue Exclusif de Vins",
        cat_desc: "Explorez notre sélection prestigieuse avec visualisation 3D interactive.",
        filter_title: "Filtres",
        filter_reset: "Réinitialiser",
        filter_search_title: "Rechercher un vin",
        filter_search_placeholder: "Ex. Reserva Especial...",
        filter_type_title: "Type de Vin",
        filter_all: "Tous les vins",
        filter_red: "Rouges",
        filter_white: "Blancs",
        filter_sparkling: "Effervescents",
        filter_rose: "Rosés",
        filter_price_title: "Prix Maximum",
        price_up_to: "Jusqu'à :",
        results_text: "vins trouvés",
        vino_1_cat_desc: "Tempranillo, intense, élégant et structuré.",
        vino_2_cat_desc: "Arômes de chêne toasté, prune et fruits rouges.",
        vino_3_cat_desc: "Viura frais, nuances d'agrumes, florales et miel.",
        vino_4_cat_desc: "Bulle fine persistante, parfait pour célébrer.",
        vino_5_cat_desc: "Édition limitée issue de vieilles vignes de coteaux.",
        vino_6_cat_desc: "Grenache délicat, subtil, aromatique et rafraîchissant.",
        no_wines_found: "Aucun vin ne correspond aux filtres sélectionnés.",
        bodegas_title: "Domaines Partenaires",
        bodegas_desc: "Tradition centenaire, terroirs privilégiés et exigences œnologiques absolues.",
        bodegas_list_title: "Nos domaines d'origine",
        bodega_1_sub: "Rioja Alta · Fondé en 1892",
        bodega_1_text: "Vignes centenaires exposées plein sud. Élevage artisanal en foudres de chêne français et caves souterraines.",
        bodega_2_sub: "Rioja Alavesa · Viticulture Biologique",
        bodega_2_text: "Sols argilo-calcaires d'altitude dédiés à la biodynamie. Vins authentiques, frais et d'une belle minéralité.",
        bodega_3_sub: "Rioja Oriental · Sélection d'Auteur",
        bodega_3_text: "Spécialistes des vieux Grenaches sur terrasses fluviales. L'innovation technique au service de l'équilibre.",
        btn_ver_vinos: "Voir leurs vins",
        exp_title: "Expériences & Œnotourisme",
        exp_desc: "Visites au cœur des vignes, dégustations guidées par nos œnologues et accords gastronomiques.",
        exp_1_banner: "Dégustation d'Exception",
        exp_1_title: "Dégustation Premium & Caves Historiques",
        exp_1_duration: "Durée : 2h 30m · Petits groupes",
        exp_1_desc: "Parcours dans les caves souterraines du XIXe siècle suivi d'une dégustation de 4 vins haut de gamme avec fromages et charcuteries ibériques.",
        btn_reservar: "Réserver l'Expérience",
        exp_2_banner: "Balade dans le Vignoble",
        exp_2_title: "Circuit en 4x4 parmi les Vieilles Vignes",
        exp_2_duration: "Durée : 3h 30m · En extérieur",
        exp_2_desc: "Aventure à travers nos parcelles emblématiques, découverte géologique du terroir et pique-nique champêtre avec dégustation.",
        exp_3_banner: "Accord d'Auteur",
        exp_3_title: "Menu Dégustation & Accord Mets-Vins",
        exp_3_duration: "Déjeuner ou Dîner · Salon Privé",
        exp_3_desc: "Menu d'exception en 6 temps signé par des chefs réputés, sublimé par les plus grands millésimes de notre réserve.",
        per_person: "/ personne",
        fav_page_title: "Mes Vins Favoris",
        fav_page_desc: "Votre cave personnelle enregistrée pour vos prochaines commandes ou découvertes.",
        fav_empty: "Vous n'avez pas encore ajouté de vin à vos favoris.",
        fav_explore: "Explorer le Catalogue",
        fav_remove_aria: "Retirer des favoris",
        fav_add_aria: "Ajouter aux favoris",
        back_to_catalog: "Retour au catalogue",
        hint_3d: "Cliquez et glissez pour pivoter à 360° · Molette ou pincement pour zoomer",
        product_exclusive_badge: "Collection Exclusive",
        spec_grape: "Cépage",
        spec_aging: "Élevage",
        spec_alcohol: "Degré d'Alcool",
        spec_temp: "Température",
        footer_copy: "© 2026 WineShop. Tous droits réservés.",
        footer_privacy: "Politique de Confidentialité",
        footer_terms: "Conditions Générales",
        footer_a11y: "Déclaration d'Accessibilité"
    },
    de: {
        title_index: "WineShop - Qualitätsweine & Weintourismus",
        title_catalogo: "Weinkatalog - WineShop",
        title_bodegas: "Unsere Weingüter - WineShop",
        title_experiencias: "Erlebnisse & Weintourismus - WineShop",
        title_favoritos: "Meine Lieblingsweine - WineShop",
        title_producto: "Weindetails - WineShop",
        skip_to_content: "Zum Hauptinhalt springen",
        nav_inicio: "Startseite",
        nav_catalogo: "Weinkatalog",
        nav_bodegas: "Weingüter",
        nav_experiencias: "Erlebnisse",
        lang_label: "Sprache auswählen",
        fav_aria_label: "Meine Lieblingsweine anzeigen",
        account_aria_label: "Mein Konto, Anmelden",
        cart_aria_label: "Warenkorb anzeigen, 0 Artikel",
        age_title: "Sind Sie volljährig?",
        age_desc: "Sie müssen mindestens 18 Jahre alt sein, um diese Website zu besuchen und alkoholische Getränke verantwortungsvoll zu genießen.",
        age_yes: "Ich bin 18 Jahre alt oder älter",
        age_no: "Ich bin unter 18 Jahre alt",
        age_legal_notice: "Mit dem Zugriff bestätigen Sie das Erreichen des gesetzlichen Mindestalters für Alkoholkonsum in Ihrem Wohnsitzland.",
        hero_title: "Das Weingut ruht im fruchtbaren Flusstal",
        hero_desc: "Jeder Jahrgang ist ein Kunstwerk aus Boden, Klima und handwerklicher Hingabe, das Epochen überdauert.",
        hero_btn: "Gesamten Katalog ansehen",
        destacados_title: "Ausgewählte Empfehlungen",
        vino_1_desc: "Tempranillo, strukturiert und samtig am Gaumen.",
        vino_2_desc: "Ausgewählter Viura mit feiner Hefelagerung.",
        vino_3_desc: "Lebendige, cremige Perlage, traditionelle Reife.",
        precio_label: "Preis: ",
        btn_carrito: "In den Warenkorb",
        cat_title: "Exklusiver Weinkatalog",
        cat_desc: "Entdecken Sie unsere erlesene Selektion mit interaktiver 3D-Flaschenansicht.",
        filter_title: "Filter",
        filter_reset: "Zurücksetzen",
        filter_search_title: "Wein suchen",
        filter_search_placeholder: "z.B. Reserva Especial...",
        filter_type_title: "Weinsorte",
        filter_all: "Alle Weine",
        filter_red: "Rotweine",
        filter_white: "Weißweine",
        filter_sparkling: "Schaumweine",
        filter_rose: "Roséweine",
        filter_price_title: "Höchstpreis",
        price_up_to: "Bis:",
        results_text: "Weine gefunden",
        vino_1_cat_desc: "Tempranillo, intensiv, elegant und strukturiert.",
        vino_2_cat_desc: "Aromen von geröstetem Eichenholz, Pflaumen und Beeren.",
        vino_3_cat_desc: "Frischer Viura mit Zitrusfrische, Blüten und Honig.",
        vino_4_cat_desc: "Feine anhaltende Perlage, perfekt zum Anstoßen.",
        vino_5_cat_desc: "Limitierte Auflage aus jahrhundertealten Reben.",
        vino_6_cat_desc: "Geschmeidiger Garnacha, subtil, aromatisch und frisch.",
        no_wines_found: "Keine Weine entsprechen den gewählten Filterkriterien.",
        bodegas_title: "Partnerweingüter",
        bodegas_desc: "Jahrhundertealte Tradition, privilegierte Terroirs und allerhöchste önologische Qualitätsmaßstäbe.",
        bodegas_list_title: "Unsere Herkunftsweingüter",
        bodega_1_sub: "Rioja Alta · Gegründet 1892",
        bodega_1_text: "Jahrhundertealte Weinberge in sonniger Südlage. Handwerkliche Reifung in Eichenbottichen und Felsenkellern.",
        bodega_2_sub: "Rioja Alavesa · Ökologischer Weinbau",
        bodega_2_text: "Höhenlagen mit Ton-Kalk-Böden für biodynamischen Weinbau. Außergewöhnliche, mineralisch-frische Weine.",
        bodega_3_sub: "Rioja Oriental · Autorenauslese",
        bodega_3_text: "Experten für alte Garnacha-Reben auf Flussterrassen. Moderne Kellertechnik im Dienste aromatischer Balance.",
        btn_ver_vinos: "Deren Weine ansehen",
        exp_title: "Erlebnisse & Weintourismus",
        exp_desc: "Führungen durch die Weinberge, geführte Sommelier-Verkostungen und exklusive Gourmet-Menüs.",
        exp_1_banner: "Besondere Verkostung",
        exp_1_title: "Premium-Verkostung & Historische Keller",
        exp_1_duration: "Dauer: 2h 30m · Kleine Gruppen",
        exp_1_desc: "Führung durch Gewölbekeller aus dem 19. Jahrhundert samt Verkostung von 4 Spitzenweinen mit Käse und iberischem Schinken.",
        btn_reservar: "Erlebnis buchen",
        exp_2_banner: "Weinberg-Tour",
        exp_2_title: "4x4-Geländetour durch alte Weinberge",
        exp_2_duration: "Dauer: 3h 30m · Im Freien",
        exp_2_desc: "Entdeckungstour durch unsere spektakulärsten Parzellen mit Terroir-Erklärungen und rustikalem Picknick unter freiem Himmel.",
        exp_3_banner: "Gourmet-Pairing",
        exp_3_title: "Degustationsmenü & Weinbegleitung",
        exp_3_duration: "Mittag- oder Abendessen · Privatsalon",
        exp_3_desc: "6-Gänge-Gourmetmenü renommierter Spitzenköche, abgestimmt auf die erlesensten Jahrgänge unserer Schatzkammer.",
        per_person: "/ Person",
        fav_page_title: "Meine Lieblingsweine",
        fav_page_desc: "Ihre persönliche Weinsammlung – jederzeit griffbereit zum Nachbestellen.",
        fav_empty: "Sie haben noch keine Weine zu Ihren Favoriten hinzugefügt.",
        fav_explore: "Katalog durchstöbern",
        fav_remove_aria: "Aus Favoriten entfernen",
        fav_add_aria: "Zu Favoriten hinzufügen",
        back_to_catalog: "Zurück zum Katalog",
        hint_3d: "Klicken und ziehen für 360°-Ansicht · Mausrad oder Finger zum Zoomen",
        product_exclusive_badge: "Exklusive Kollektion",
        spec_grape: "Rebsorte",
        spec_aging: "Reifung",
        spec_alcohol: "Alkoholgehalt",
        spec_temp: "Trinktemperatur",
        footer_copy: "© 2026 WineShop. Alle Rechte vorbehalten.",
        footer_privacy: "Datenschutzerklärung",
        footer_terms: "Allgemeine Geschäftsbedingungen",
        footer_a11y: "Erklärung zur Barrierefreiheit"
    }
};

function obtenerIdiomaActual() {
    try {
        const guardado = localStorage.getItem("wineshop_idioma");
        if (guardado && ["es", "en", "fr", "de"].includes(guardado)) {
            return guardado;
        }
        const match = document.cookie.match(/(^|;\s*)googtrans=([^;]+)/);
        if (match) {
            const partes = decodeURIComponent(match[2]).split("/");
            const lang = partes[2] || "es";
            if (["es", "en", "fr", "de"].includes(lang)) return lang;
        }
    } catch (e) {}
    return "es";
}

function aplicarTraducciones(idioma) {
    const lang = ["es", "en", "fr", "de"].includes(idioma) ? idioma : "es";
    document.documentElement.lang = lang;

    const dicc = i18nData[lang] || i18nData["es"];

    // 1. Textos estáticos con data-i18n
    document.querySelectorAll("[data-i18n]").forEach(elem => {
        const clave = elem.getAttribute("data-i18n");
        if (dicc && dicc[clave] !== undefined) {
            elem.textContent = dicc[clave];
        }
    });

    // 2. Placeholders con data-i18n-placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach(elem => {
        const clave = elem.getAttribute("data-i18n-placeholder");
        if (dicc && dicc[clave] !== undefined) {
            elem.setAttribute("placeholder", dicc[clave]);
        }
    });

    const searchInput = document.getElementById("wine-search");
    if (searchInput && dicc["filter_search_placeholder"]) {
        searchInput.setAttribute("placeholder", dicc["filter_search_placeholder"]);
    }

    // 3. Aria-labels para accesibilidad
    const favLink = document.querySelector('a[href*="favoritos.html"].btn-icon');
    if (favLink && dicc["fav_aria_label"]) {
        favLink.setAttribute("aria-label", dicc["fav_aria_label"]);
    }

    const accountLink = document.querySelector('a[href="#login"].btn-icon');
    if (accountLink && dicc["account_aria_label"]) {
        accountLink.setAttribute("aria-label", dicc["account_aria_label"]);
    }

    const cartBtn = document.querySelector('.btn-icon.cart-btn');
    if (cartBtn && dicc["cart_aria_label"]) {
        cartBtn.setAttribute("aria-label", dicc["cart_aria_label"]);
    }

    // 4. Título del documento
    const path = window.location.pathname;
    let pageTitle = "";
    if (path.includes("catalogo.html")) pageTitle = dicc["title_catalogo"];
    else if (path.includes("bodegas.html")) pageTitle = dicc["title_bodegas"];
    else if (path.includes("experiencias.html")) pageTitle = dicc["title_experiencias"];
    else if (path.includes("favoritos.html")) pageTitle = dicc["title_favoritos"];
    else if (path.includes("producto.html")) pageTitle = dicc["title_producto"];
    else if (path.includes("index.html") || path.endsWith("/") || !path.includes(".html")) pageTitle = dicc["title_index"];

    if (pageTitle) {
        document.title = pageTitle;
    }

    // 5. Si estamos en la página de detalle de producto, actualizar datos dinámicos
    if (document.getElementById("producto-detalle")) {
        cargarDetalleProducto();
    }

    // 6. Si estamos en la página de favoritos, re-renderizar tarjetas
    if (document.getElementById("favoritos-grid")) {
        renderizarPaginaFavoritos();
    }

    // 7. Sincronizar el select en pantalla si existe
    const customSelect = document.getElementById("custom-lang-select");
    if (customSelect && customSelect.value !== lang) {
        customSelect.value = lang;
    }
}

function iniciarControladorIdioma() {
    const customSelect = document.getElementById("custom-lang-select");
    const idiomaActual = obtenerIdiomaActual();

    if (customSelect) {
        customSelect.value = idiomaActual;

        customSelect.addEventListener("change", (e) => {
            const nuevoIdioma = e.target.value;
            try {
                localStorage.setItem("wineshop_idioma", nuevoIdioma);
                document.cookie = `googtrans=/es/${nuevoIdioma}; path=/; SameSite=Lax;`;
                if (window.location.hostname) {
                    document.cookie = `googtrans=/es/${nuevoIdioma}; domain=${window.location.hostname}; path=/; SameSite=Lax;`;
                }
            } catch (err) {}

            aplicarTraducciones(nuevoIdioma);
        });
    }

    aplicarTraducciones(idiomaActual);
}

// ==========================================================================
// 4. FAVORITOS (localStorage)
// ==========================================================================
function getFavoritos() {
    return JSON.parse(localStorage.getItem("wineshop_favoritos")) || [];
}

function setFavoritos(favs) {
    localStorage.setItem("wineshop_favoritos", JSON.stringify(favs));
    actualizarBadgeFavoritos();
}

function actualizarBadgeFavoritos() {
    const favs = getFavoritos();
    const countElement = document.getElementById("header-fav-count");
    if (countElement) {
        if (favs.length > 0) {
            countElement.textContent = favs.length;
            countElement.setAttribute("data-count", favs.length);
        } else {
            countElement.textContent = "";
            countElement.removeAttribute("data-count");
        }
    }
}

function toggleFavorito(vinoId, btn) {
    let favs = getFavoritos();
    const vino = catalogoVinos[vinoId];
    const nombreVino = vino ? vino.nombre : "Vino";

    if (favs.includes(vinoId)) {
        favs = favs.filter(id => id !== vinoId);
        if (btn) {
            btn.classList.remove("active");
            btn.setAttribute("aria-pressed", "false");
            btn.setAttribute("aria-label", "Añadir a favoritos");
        }
        if (typeof mostrarToast === "function") {
            mostrarToast(`"${nombreVino}" quitado de favoritos`, "heart");
        }
    } else {
        favs.push(vinoId);
        if (btn) {
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");
            btn.setAttribute("aria-label", "Quitar de favoritos");
        }
        if (typeof mostrarToast === "function") {
            mostrarToast(`"${nombreVino}" añadido a favoritos`, "heart");
        }
    }
    setFavoritos(favs);

    if (document.getElementById("favoritos-grid")) {
        renderizarPaginaFavoritos();
    }
}

function renderizarPaginaFavoritos() {
    const grid = document.getElementById("favoritos-grid");
    const emptyMsg = document.getElementById("favoritos-vacio");
    if (!grid) return;

    const favs = getFavoritos();
    grid.innerHTML = "";

    if (favs.length === 0) {
        grid.style.display = "none";
        if (emptyMsg) emptyMsg.style.display = "block";
        return;
    }

    grid.style.display = "grid";
    if (emptyMsg) emptyMsg.style.display = "none";

    const isSubdir = window.location.pathname.includes("/html/");
    const rutaBase = isSubdir ? "../" : "";
    const rutaProducto = isSubdir ? "producto.html" : "html/producto.html";
    const lang = obtenerIdiomaActual();
    const dicc = i18nData[lang] || i18nData["es"];

    favs.forEach(id => {
        const vino = catalogoVinos[id];
        if (!vino) return;

        const trans = wineTranslations[id] && wineTranslations[id][lang] ? wineTranslations[id][lang] : null;
        const descTexto = (trans && trans.desc) ? trans.desc : vino.desc;
        const removeFavText = dicc["fav_remove_aria"] || "Quitar de favoritos";
        const btnCarritoText = dicc["btn_carrito"] || "Añadir al carrito";
        const precioLabel = dicc["precio_label"] || "Precio: ";

        const card = document.createElement("article");
        card.className = "wine-card";
        card.setAttribute("data-id", vino.id);
        card.innerHTML = `
            <div class="model-container">
                <button type="button" class="btn-fav-card active" aria-label="${removeFavText}" aria-pressed="true">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                    </svg>
                </button>
                <model-viewer 
                    src="${rutaBase}${vino.modelo}" 
                    alt="Modelo 3D de ${vino.nombre}" 
                    touch-action="pan-y"
                    shadow-intensity="1" 
                    camera-controls="false" 
                    disable-zoom
                    class="wine-3d-model">
                </model-viewer>
            </div>
            <div class="wine-info">
                <h3 class="wine-name">${vino.nombre}</h3>
                <p class="body-regular">${descTexto}</p>
                <p class="wine-price"><span class="sr-only">${precioLabel}</span>${vino.precio}</p>
                <button class="btn btn-primary btn-full">${btnCarritoText}</button>
            </div>
        `;

        const btn = card.querySelector(".btn-fav-card");
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorito(vino.id, btn);
        });

        const openProduct = (e) => {
            if (e.target.closest(".btn-fav-card") || e.target.closest(".btn-primary")) return;
            window.location.href = `${rutaProducto}?id=${vino.id}`;
        };
        card.querySelector(".wine-name").addEventListener("click", openProduct);
        card.querySelector(".model-container").addEventListener("click", openProduct);

        grid.appendChild(card);
    });
}

// ==========================================================================
// 5. DETALLE EN PRODUCTO.HTML
// ==========================================================================
function cargarDetalleProducto() {
    const params = new URLSearchParams(window.location.search);
    const vinoId = params.get("id") || "vino-1";
    const vino = catalogoVinos[vinoId];
    if (!vino) return;

    const title = document.getElementById("detail-title");
    const vintage = document.getElementById("detail-vintage");
    const price = document.getElementById("detail-price");
    const desc = document.getElementById("detail-desc");
    const grape = document.getElementById("detail-grape");
    const aging = document.getElementById("detail-aging");
    const alcohol = document.getElementById("detail-alcohol");
    const temp = document.getElementById("detail-temp");
    const model = document.getElementById("detail-model");
    const btnFav = document.getElementById("btn-fav-detail");

    const isSubdir = window.location.pathname.includes("/html/");
    const rutaBase = isSubdir ? "../" : "";

    const lang = obtenerIdiomaActual();
    const trans = wineTranslations[vinoId] && wineTranslations[vinoId][lang] ? wineTranslations[vinoId][lang] : null;

    if (title) title.textContent = vino.nombre;
    if (vintage) vintage.textContent = (trans && trans.vintage) ? trans.vintage : vino.vintage;
    if (price) price.textContent = vino.precio;
    if (desc) desc.textContent = (trans && trans.desc) ? trans.desc : vino.desc;
    if (grape) grape.textContent = (trans && trans.grape) ? trans.grape : vino.grape;
    if (aging) aging.textContent = (trans && trans.aging) ? trans.aging : vino.aging;
    if (alcohol) alcohol.textContent = vino.alcohol;
    if (temp) temp.textContent = vino.temp;
    if (model && !model.getAttribute("src")) {
        model.setAttribute("src", `${rutaBase}${vino.modelo}`);
        model.setAttribute("touch-action", "pan-y");
    }

    if (btnFav && !btnFav.dataset.bound) {
        btnFav.dataset.bound = "true";
        const favs = getFavoritos();
        if (favs.includes(vino.id)) {
            btnFav.classList.add("active");
            btnFav.setAttribute("aria-pressed", "true");
        }
        btnFav.addEventListener("click", () => toggleFavorito(vino.id, btnFav));
    }

    const qtyInput = document.getElementById("qty-input");
    const qtyMinus = document.getElementById("qty-minus");
    const qtyPlus = document.getElementById("qty-plus");

    if (qtyMinus && qtyPlus && qtyInput && !qtyMinus.dataset.bound) {
        qtyMinus.dataset.bound = "true";
        qtyPlus.dataset.bound = "true";
        qtyMinus.addEventListener("click", () => {
            let val = parseInt(qtyInput.value) || 1;
            if (val > 1) qtyInput.value = val - 1;
        });
        qtyPlus.addEventListener("click", () => {
            let val = parseInt(qtyInput.value) || 1;
            qtyInput.value = val + 1;
        });
    }
}

// ==========================================================================
// 6. FILTRADO MULTI-VARIABLE (Buscador por Nombre, Tipo y Precio)
// ==========================================================================
function inicializarFiltrosCatalogo() {
    const wineCardsCatalog = document.querySelectorAll("#catalogo-grid .wine-card");
    const searchInput = document.getElementById("wine-search");
    const typeRadios = document.querySelectorAll('input[name="wine-type"]');
    const priceRange = document.getElementById("price-range");
    const priceVal = document.getElementById("price-val");
    const btnReset = document.getElementById("btn-reset-filters");
    const resultsCount = document.getElementById("results-count");
    const noResultsMsg = document.getElementById("no-results");

    if (wineCardsCatalog.length === 0) return;

    const normalizar = (txt) => txt.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

    function aplicarFiltros() {
        const query = searchInput ? normalizar(searchInput.value) : "";
        const radioActivo = document.querySelector('input[name="wine-type"]:checked');
        const tipoSeleccionado = radioActivo ? radioActivo.value : "todos";
        const precioMax = priceRange ? parseFloat(priceRange.value) : 100;
        let visibles = 0;

        wineCardsCatalog.forEach(card => {
            const nombreVino = normalizar(card.querySelector(".wine-name")?.textContent || "");
            const tipoVino = card.getAttribute("data-type") || "";
            const precioVino = parseFloat(card.getAttribute("data-price")) || 0;

            const coincideNombre = query === "" || nombreVino.includes(query);
            const coincideTipo = (tipoSeleccionado === "todos" || tipoVino.toLowerCase() === tipoSeleccionado.toLowerCase());
            const coincidePrecio = (precioVino <= precioMax);

            if (coincideNombre && coincideTipo && coincidePrecio) {
                card.style.display = "flex";
                visibles++;
            } else {
                card.style.display = "none";
            }
        });

        if (resultsCount) resultsCount.textContent = visibles;
        if (noResultsMsg) {
            noResultsMsg.style.display = (visibles === 0) ? "block" : "none";
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", aplicarFiltros);
    }

    typeRadios.forEach(radio => {
        radio.addEventListener("change", aplicarFiltros);
    });

    if (priceRange) {
        priceRange.addEventListener("input", (e) => {
            if (priceVal) priceVal.textContent = e.target.value;
            aplicarFiltros();
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            const radioTodos = document.querySelector('input[name="wine-type"][value="todos"]');
            if (radioTodos) radioTodos.checked = true;

            if (priceRange) {
                priceRange.value = 50;
                if (priceVal) priceVal.textContent = "50";
            }
            aplicarFiltros();
        });
    }

    aplicarFiltros();
}

// ==========================================================================
// 7. INICIALIZACIÓN GENERAL (DOM Ready)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // A. INICIALIZAR MENÚ MÓVIL Y TOUCH ACTION EN 3D
    iniciarMenuMobile();

    document.querySelectorAll("model-viewer").forEach(mv => {
        mv.setAttribute("touch-action", "pan-y");
    });

    // B. CONTROL DE MAYORÍA DE EDAD (+18) CON DESENFOQUE
    const modalEdad = document.getElementById("modal-edad");
    const contenedorSitio = document.getElementById("sitio-web");
    const btnMayor = document.getElementById("btn-mayor-edad");
    const btnMenor = document.getElementById("btn-menor-edad");
    const verificado = sessionStorage.getItem("wineshop_mayor_edad");

    if (modalEdad && contenedorSitio) {
        if (verificado === "true") {
            modalEdad.classList.add("oculto");
            contenedorSitio.classList.remove("contenido-bloqueado");
            document.documentElement.classList.add("edad-verificada");
            document.body.style.overflow = "";
        } else {
            modalEdad.classList.remove("oculto");
            contenedorSitio.classList.add("contenido-bloqueado");
            document.documentElement.classList.remove("edad-verificada");
            document.body.style.overflow = "hidden";
        }

        if (btnMayor) {
            btnMayor.addEventListener("click", () => {
                sessionStorage.setItem("wineshop_mayor_edad", "true");
                document.documentElement.classList.add("edad-verificada");
                modalEdad.classList.add("oculto");
                contenedorSitio.classList.remove("contenido-bloqueado");
                document.body.style.overflow = "";
            });
        }

        if (btnMenor) {
            btnMenor.addEventListener("click", () => {
                const rutaJuego = window.location.pathname.includes("/html/") 
                    ? "juego_menores.html" 
                    : "html/juego_menores.html";
                window.location.href = rutaJuego;
            });
        }
    } else if (verificado !== "true" && window.location.pathname.includes("/html/") && !window.location.pathname.includes("juego_menores.html")) {
        window.location.replace("../index.html");
        return;
    }

    // C. INICIALIZAR GESTOR DE IDIOMAS
    iniciarControladorIdioma();

    // D. INICIALIZACIÓN DE FAVORITOS Y TARJETAS
    actualizarBadgeFavoritos();

    const favs = getFavoritos();
    document.querySelectorAll(".wine-card[data-id]").forEach(card => {
        const id = card.getAttribute("data-id");
        const btnFav = card.querySelector(".btn-fav-card");

        if (btnFav) {
            if (favs.includes(id)) {
                btnFav.classList.add("active");
                btnFav.setAttribute("aria-pressed", "true");
                btnFav.setAttribute("aria-label", "Quitar de favoritos");
            }

            btnFav.addEventListener("click", (e) => {
                e.stopPropagation();
                toggleFavorito(id, btnFav);
            });
        }

        const isSubdir = window.location.pathname.includes("/html/");
        const rutaProducto = isSubdir ? "producto.html" : "html/producto.html";
        const clickableName = card.querySelector(".wine-name");
        const clickableModel = card.querySelector(".model-container");

        const irAlProducto = (e) => {
            if (e.target.closest(".btn-fav-card") || e.target.closest(".btn-primary")) return;
            window.location.href = `${rutaProducto}?id=${id}`;
        };

        if (clickableName) clickableName.addEventListener("click", irAlProducto);
        if (clickableModel) clickableModel.addEventListener("click", irAlProducto);
    });

    if (document.getElementById("favoritos-grid")) {
        renderizarPaginaFavoritos();
    }

    if (document.getElementById("producto-detalle")) {
        cargarDetalleProducto();
    }

    // E. EJECUTAR FILTROS DEL CATÁLOGO
    inicializarFiltrosCatalogo();

    // F. ROTACIÓN 3D AL HACER HOVER SOBRE MODELOS
    const wineCards = document.querySelectorAll(".wine-card");
    wineCards.forEach(card => {
        const model = card.querySelector("model-viewer");
        if (model) {
            let rotationFrame = null;
            let currentAngle = 0;

            const rotateBottle = () => {
                currentAngle = (currentAngle + 1.2) % 360;
                model.setAttribute("camera-orbit", `${currentAngle}deg 75deg 105%`);
                rotationFrame = requestAnimationFrame(rotateBottle);
            };

            card.addEventListener("mouseenter", () => {
                rotationFrame = requestAnimationFrame(rotateBottle);
            });

            card.addEventListener("mouseleave", () => {
                if (rotationFrame) {
                    cancelAnimationFrame(rotationFrame);
                }
                model.setAttribute("camera-orbit", "0deg 75deg 105%");
                currentAngle = 0;
            });
        }
    });

    // G. INICIALIZAR CARRITO LATERAL Y ANIMACIONES
    iniciarCarrito();
    iniciarAnimacionesScroll();
});

// ==========================================================================
// 8. SISTEMA DE TOASTS / NOTIFICACIONES FLOTANTES
// ==========================================================================
function mostrarToast(mensaje, icono = "check") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        container.setAttribute("role", "status");
        container.setAttribute("aria-live", "polite");
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";

    let iconSvg = `
        <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    `;

    if (icono === "cart") {
        iconSvg = `
            <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
            </svg>
        `;
    } else if (icono === "heart") {
        iconSvg = `
            <svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
        `;
    }

    toast.innerHTML = `${iconSvg}<span>${mensaje}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("toast-exit");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 3200);
}

// ==========================================================================
// 9. CARRITO DE COMPRAS (COMPLETO, PERSISTENTE EN LOCALSTORAGE)
// ==========================================================================
const CART_STORAGE_KEY = "wineshop_carrito_items";

function obtenerCarrito() {
    try {
        const guardado = localStorage.getItem(CART_STORAGE_KEY);
        return guardado ? JSON.parse(guardado) : [];
    } catch (e) {
        return [];
    }
}

function guardarCarrito(items) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
    actualizarBadgesCarrito();
    renderizarCarritoUI();
}

function parsePrecioNumero(precioStr) {
    if (!precioStr) return 0;
    const limpio = precioStr.toString().replace(/[^\d.,]/g, "").replace(",", ".");
    return parseFloat(limpio) || 0;
}

function formatearPrecio(num) {
    return num.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}

function anadirAlCarrito(idProducto, cantidad = 1) {
    const info = catalogoVinos[idProducto];
    if (!info) return;

    let items = obtenerCarrito();
    const index = items.findIndex(item => item.id === idProducto);

    if (index > -1) {
        items[index].cantidad += cantidad;
    } else {
        items.push({
            id: info.id,
            nombre: info.nombre,
            precio: info.precio,
            precioNum: parsePrecioNumero(info.precio),
            vintage: info.vintage,
            cantidad: cantidad
        });
    }

    guardarCarrito(items);
    mostrarToast(`"${info.nombre}" añadido al carrito`, "cart");
    abrirPanelCarrito();
}

function modificarCantidadCarrito(idProducto, delta) {
    let items = obtenerCarrito();
    const index = items.findIndex(item => item.id === idProducto);
    if (index > -1) {
        items[index].cantidad += delta;
        if (items[index].cantidad <= 0) {
            items.splice(index, 1);
        }
        guardarCarrito(items);
    }
}

function eliminarDelCarrito(idProducto) {
    let items = obtenerCarrito();
    const eliminado = items.find(item => item.id === idProducto);
    items = items.filter(item => item.id !== idProducto);
    guardarCarrito(items);
    if (eliminado) {
        mostrarToast(`"${eliminado.nombre}" eliminado del carrito`, "cart");
    }
}

function vaciarCarrito() {
    guardarCarrito([]);
    mostrarToast("Carrito vaciado");
}

function actualizarBadgesCarrito() {
    const items = obtenerCarrito();
    const totalCantidad = items.reduce((acc, it) => acc + (it.cantidad || 0), 0);

    document.querySelectorAll(".cart-btn .badge-count").forEach(badge => {
        badge.textContent = totalCantidad;
    });

    document.querySelectorAll(".cart-btn").forEach(btn => {
        btn.setAttribute("aria-label", `Ver carrito de compras, ${totalCantidad} productos`);
    });
}

function crearEstructuraCarritoDOM() {
    if (document.getElementById("cart-slide-panel")) return;

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cart-overlay";

    const panel = document.createElement("aside");
    panel.className = "cart-panel";
    panel.id = "cart-slide-panel";
    panel.setAttribute("aria-labelledby", "cart-panel-title");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");

    panel.innerHTML = `
        <header class="cart-panel-header">
            <h2 id="cart-panel-title" class="cart-panel-title">Tu Carrito</h2>
            <button type="button" class="cart-close-btn" id="cart-close-btn" aria-label="Cerrar carrito de compras">&times;</button>
        </header>
        <div class="cart-panel-body" id="cart-panel-body">
            <!-- Items generados dinámicamente -->
        </div>
        <footer class="cart-panel-footer" id="cart-panel-footer">
            <div class="cart-total-row">
                <span class="cart-total-label">Total estimado:</span>
                <span class="cart-total-value" id="cart-total-value">0,00 €</span>
            </div>
            <button type="button" class="btn btn-primary btn-full" id="cart-checkout-btn">
                Tramitar Pedido
            </button>
        </footer>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);

    const closeBtn = panel.querySelector("#cart-close-btn");
    closeBtn.addEventListener("click", cerrarPanelCarrito);
    overlay.addEventListener("click", cerrarPanelCarrito);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("is-open")) {
            cerrarPanelCarrito();
        }
    });

    const checkoutBtn = panel.querySelector("#cart-checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", () => {
            const items = obtenerCarrito();
            if (items.length === 0) {
                mostrarToast("El carrito está vacío");
                return;
            }
            mostrarToast("¡Gracias por tu compra simulada!", "check");
            guardarCarrito([]);
            cerrarPanelCarrito();
        });
    }
}

function abrirPanelCarrito() {
    crearEstructuraCarritoDOM();
    renderizarCarritoUI();
    const panel = document.getElementById("cart-slide-panel");
    const overlay = document.getElementById("cart-overlay");
    if (panel && overlay) {
        panel.classList.add("is-open");
        overlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
        const closeBtn = panel.querySelector("#cart-close-btn");
        if (closeBtn) closeBtn.focus();
    }
}

function cerrarPanelCarrito() {
    const panel = document.getElementById("cart-slide-panel");
    const overlay = document.getElementById("cart-overlay");
    if (panel && overlay) {
        panel.classList.remove("is-open");
        overlay.classList.remove("is-open");
        document.body.style.overflow = "";
    }
}

function renderizarCarritoUI() {
    const body = document.getElementById("cart-panel-body");
    const totalEl = document.getElementById("cart-total-value");
    const footer = document.getElementById("cart-panel-footer");
    if (!body) return;

    const items = obtenerCarrito();

    if (items.length === 0) {
        body.innerHTML = `
            <div class="cart-empty-msg">
                <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        if (totalEl) totalEl.textContent = "0,00 €";
        if (footer) footer.style.display = "none";
        return;
    }

    if (footer) footer.style.display = "block";

    let html = "";
    let totalGeneral = 0;

    items.forEach(it => {
        const subtotal = (it.precioNum || parsePrecioNumero(it.precio)) * it.cantidad;
        totalGeneral += subtotal;

        html += `
            <div class="cart-item" data-id="${it.id}">
                <div class="cart-item-img">
                    <span>🍷<br>Wine</span>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${it.nombre}</div>
                    <div class="cart-item-price">${it.precio}</div>
                </div>
                <div class="cart-item-qty">
                    <button type="button" class="btn-cart-dec" data-id="${it.id}" aria-label="Restar una unidad de ${it.nombre}">-</button>
                    <span>${it.cantidad}</span>
                    <button type="button" class="btn-cart-inc" data-id="${it.id}" aria-label="Sumar una unidad de ${it.nombre}">+</button>
                </div>
                <button type="button" class="cart-remove-btn" data-id="${it.id}" aria-label="Eliminar ${it.nombre} del carrito">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        `;
    });

    body.innerHTML = html;
    if (totalEl) totalEl.textContent = formatearPrecio(totalGeneral);

    body.querySelectorAll(".btn-cart-dec").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            modificarCantidadCarrito(id, -1);
        });
    });

    body.querySelectorAll(".btn-cart-inc").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            modificarCantidadCarrito(id, 1);
        });
    });

    body.querySelectorAll(".cart-remove-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            eliminarDelCarrito(id);
        });
    });
}

function iniciarCarrito() {
    crearEstructuraCarritoDOM();
    actualizarBadgesCarrito();

    // Event listener en botones del carrito del header
    document.querySelectorAll(".cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            abrirPanelCarrito();
        });
    });

    // Delegación de eventos para botones "Añadir al carrito" en tarjetas de vino
    document.addEventListener("click", (e) => {
        const btnAdd = e.target.closest(".btn-primary");
        if (!btnAdd) return;

        // Botón en la página de detalle de producto
        if (btnAdd.id === "btn-add-detail") {
            const params = new URLSearchParams(window.location.search);
            const id = params.get("id") || "vino-1";
            const qtyInput = document.getElementById("qty-input");
            const qty = qtyInput ? (parseInt(qtyInput.value, 10) || 1) : 1;
            anadirAlCarrito(id, qty);
            return;
        }

        // Botón en tarjetas de vino del catálogo o inicio
        const card = btnAdd.closest(".wine-card[data-id]");
        if (card && btnAdd.textContent.trim().toLowerCase().includes("carrito")) {
            e.stopPropagation();
            const id = card.getAttribute("data-id");
            anadirAlCarrito(id, 1);
        }
    });
}

// ==========================================================================
// 10. ANIMACIONES AL SCROLL (INTERSECTION OBSERVER)
// ==========================================================================
function iniciarAnimacionesScroll() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Asignar clase .reveal a elementos clave
    const selectores = [
        ".hero-content",
        ".catalog-section",
        ".winery-card",
        ".exp-card",
        ".catalog-layout",
        ".wine-card",
        ".product-view-layout"
    ];

    selectores.forEach(sel => {
        document.querySelectorAll(sel).forEach((el, index) => {
            el.classList.add("reveal");
            // Asignar retraso escalonado a tarjetas en grid
            if (el.classList.contains("wine-card") || el.classList.contains("exp-card")) {
                el.setAttribute("data-reveal-delay", (index % 6) + 1);
            }
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px"
    });

    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}
