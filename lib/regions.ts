import type { PublicLocale } from "@/lib/public-copy";
import type { PropertyRecord } from "@/lib/property-shared";

export const regionSlugs = [
  "torrevieja",
  "la-mata",
  "orihuela-costa",
  "la-zenia",
  "cabo-roig",
  "guardamar-del-segura",
] as const;

export type RegionSlug = (typeof regionSlugs)[number];

type RegionContent = {
  areaLabel: string;
  body: string;
  highlights: string[];
  title: string;
};

type RegionEntry = {
  imageUrl: string;
  imageCreditLabel: string;
  imageSourceUrl: string;
  localeContent: Record<PublicLocale, RegionContent>;
  matchLocation: (property: PropertyRecord) => boolean;
  name: string;
  slug: RegionSlug;
};

export const regions: Record<RegionSlug, RegionEntry> = {
  torrevieja: {
    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Paseo%20Juan%20Aparicio.jpg",
    imageCreditLabel: "Wikimedia Commons",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/Category:Beaches_of_Torrevieja",
    localeContent: {
      en: {
        areaLabel: "Torrevieja",
        body:
          "Torrevieja blends a lively seafront, city services, marinas, and the town’s salt-lagoon identity. It suits clients who want everyday convenience, a walkable coastline, and an active property market that works for both year-round living and second homes.",
        highlights: [
          "Lively promenade and marina atmosphere",
          "Strong year-round services and international community",
          "Easy access to beaches, dining, and everyday amenities",
        ],
        title: "A coastal city with an active seafront and strong everyday convenience.",
      },
      es: {
        areaLabel: "Torrevieja",
        body:
          "Torrevieja combina paseo marítimo, servicios urbanos, marinas y la identidad propia de sus salinas. Encaja muy bien para quien busca vida diaria cómoda, costa caminable y un mercado inmobiliario activo tanto para vivir todo el año como para segunda residencia.",
        highlights: [
          "Paseo marítimo animado y ambiente de puerto",
          "Buenos servicios todo el año y comunidad internacional",
          "Acceso fácil a playas, restauración y vida diaria",
        ],
        title: "Una ciudad costera con paseo marítimo activo y mucha comodidad en el día a día.",
      },
      ru: {
        areaLabel: "Торревьеха",
        body:
          "Торревьеха сочетает активную набережную, городскую инфраструктуру, марины и узнаваемый характер соляных лагун. Этот район подходит тем, кто хочет удобство повседневной жизни, прогулочную береговую линию и активный рынок недвижимости для постоянного проживания или второго дома.",
        highlights: [
          "Живая набережная и атмосфера морского города",
          "Сильная инфраструктура круглый год и международная среда",
          "Близость к пляжам, ресторанам и повседневным сервисам",
        ],
        title: "Прибрежный город с активной набережной и сильной городской инфраструктурой.",
      },
      uk: {
        areaLabel: "Торрев'єха",
        body:
          "Торрев'єха поєднує активну набережну, міську інфраструктуру, марини та впізнаваний характер соляних лагун. Цей район підходить тим, хто хоче зручність повсякденного життя, прогулянкову берегову лінію та активний ринок нерухомості для постійного проживання чи другого дому.",
        highlights: [
          "Жвава набережна й атмосфера морського міста",
          "Сильна інфраструктура цілий рік і міжнародне середовище",
          "Близькість до пляжів, ресторанів і повсякденних сервісів",
        ],
        title: "Прибережне місто з активною набережною та сильною міською інфраструктурою.",
      },
      de: {
        areaLabel: "Torrevieja",
        body:
          "Torrevieja verbindet eine lebendige Promenade, städtische Infrastruktur, Marinas und die besondere Identität der Salzlagunen. Die Lage passt gut zu Menschen, die Alltagskomfort, eine gut erreichbare Küste und einen aktiven Immobilienmarkt für Dauerwohnen oder Zweitwohnsitz suchen.",
        highlights: [
          "Lebendige Promenade und maritimes Stadtgefühl",
          "Starke Ganzjahres-Infrastruktur und internationale Community",
          "Kurze Wege zu Stränden, Gastronomie und Alltag",
        ],
        title: "Eine Küstenstadt mit aktiver Uferpromenade und viel Alltagskomfort.",
      },
    },
    matchLocation: (property) =>
      property.location.toLowerCase().includes("torrevieja") && !property.location.toLowerCase().includes("la mata"),
    name: "Torrevieja",
    slug: "torrevieja",
  },
  "la-mata": {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Playa%20de%20la%20Mata%20in%20La%20Mata%2C%20Torrevieja%2C%20Alicante%2C%20Spain%2C%202022%20January.jpg",
    imageCreditLabel: "Wikimedia Commons",
    imageSourceUrl:
      "https://commons.wikimedia.org/wiki/File:Playa_de_la_Mata_in_La_Mata%2C_Torrevieja%2C_Alicante%2C_Spain%2C_2022_January.jpg",
    localeContent: {
      en: {
        areaLabel: "La Mata",
        body:
          "La Mata stands out for its long sandy beach, open seafront, and calmer residential rhythm. It is especially attractive for clients who care about sea views, long beach walks, and a more relaxed coastal atmosphere without feeling isolated.",
        highlights: [
          "One of the broadest and longest beaches in the area",
          "Promenade, dunes, and easy outdoor lifestyle",
          "A calmer pace that still stays connected to Torrevieja",
        ],
        title: "Beachfront calm, open light, and a more relaxed coastal rhythm.",
      },
      es: {
        areaLabel: "La Mata",
        body:
          "La Mata destaca por su playa larga, su frente marítimo abierto y un ritmo residencial más calmado. Resulta muy atractiva para quien valora vistas al mar, paseos junto a la playa y una sensación costera más relajada sin quedar aislado.",
        highlights: [
          "Una de las playas más largas y amplias de la zona",
          "Paseo, dunas y estilo de vida muy exterior",
          "Un ritmo más tranquilo pero bien conectado con Torrevieja",
        ],
        title: "Calma frente al mar, mucha luz y una forma de vivir más relajada.",
      },
      ru: {
        areaLabel: "Ла Мата",
        body:
          "Ла Мата выделяется длинным песчаным пляжем, открытой береговой линией и более спокойным жилым ритмом. Это хороший выбор для тех, кто ценит виды на море, прогулки вдоль пляжа и более расслабленную атмосферу у воды без ощущения изоляции.",
        highlights: [
          "Один из самых длинных и широких пляжей в районе",
          "Набережная, дюны и выраженный outdoor-ритм",
          "Спокойнее, но при этом рядом с Торревьехой",
        ],
        title: "Спокойствие у моря, много света и более расслабленный ритм побережья.",
      },
      uk: {
        areaLabel: "Ла-Мата",
        body:
          "Ла-Мата вирізняється довгим піщаним пляжем, відкритою береговою лінією та спокійнішим житловим ритмом. Це хороший вибір для тих, хто цінує краєвиди на море, прогулянки вздовж пляжу та більш розслаблену атмосферу біля води без відчуття ізоляції.",
        highlights: [
          "Один із найдовших і найширших пляжів у районі",
          "Набережна, дюни та виражений outdoor-ритм",
          "Спокійніше, але поруч із Торрев'єхою",
        ],
        title: "Спокій біля моря, багато світла та більш розслаблений ритм узбережжя.",
      },
      de: {
        areaLabel: "La Mata",
        body:
          "La Mata zeichnet sich durch seinen langen Sandstrand, den offenen Küstenraum und ein ruhigeres Wohngefühl aus. Die Lage ist besonders attraktiv für Menschen, die Meerblick, lange Strandspaziergänge und eine entspanntere Küstenatmosphäre suchen, ohne abgelegen zu wohnen.",
        highlights: [
          "Einer der längsten und breitesten Strände der Gegend",
          "Promenade, Dünen und starkes Outdoor-Gefühl",
          "Ruhigeres Wohnen mit guter Verbindung nach Torrevieja",
        ],
        title: "Mehr Ruhe direkt am Meer, viel Licht und ein entspannter Küstenrhythmus.",
      },
    },
    matchLocation: (property) => property.location.toLowerCase().includes("la mata"),
    name: "La Mata",
    slug: "la-mata",
  },
  "orihuela-costa": {
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Coastal%20walking%20path%20at%20Playa%20de%20Cabo%20Roig%20in%20Orihuela%20Costa%2C%20Orihuela%2C%20Alicante%2C%20Spain%2C%202022%20January.jpg",
    imageCreditLabel: "Wikimedia Commons",
    imageSourceUrl: "https://commons.wikimedia.org/wiki/Category:Beaches_of_Orihuela",
    localeContent: {
      en: {
        areaLabel: "Orihuela Costa",
        body:
          "Orihuela Costa offers a long stretch of coastline with beaches, coves, promenades, and residential communities spread across multiple coastal pockets. It is a strong fit for clients who want resort-style inventory, outdoor living, and established international demand.",
        highlights: [
          "16 km of coastline with beaches, coves, and coastal walks",
          "Large residential choice across Punta Prima, Cabo Roig, Campoamor, and more",
          "Popular for second homes, rentals, and lifestyle buyers",
        ],
        title: "Resort energy, broad inventory, and a coastline shaped by distinct micro-areas.",
      },
      es: {
        areaLabel: "Orihuela Costa",
        body:
          "Orihuela Costa ofrece un largo frente litoral con playas, calas, paseos y urbanizaciones repartidas en distintos núcleos costeros. Encaja muy bien para clientes que buscan oferta residencial amplia, vida exterior y demanda internacional consolidada.",
        highlights: [
          "16 km de costa con playas, calas y senderos litorales",
          "Gran variedad residencial entre Punta Prima, Cabo Roig, Campoamor y más",
          "Muy valorada para segunda residencia, alquiler y estilo de vida costero",
        ],
        title: "Ambiente residencial y turístico con mucha oferta y una costa muy diversa.",
      },
      ru: {
        areaLabel: "Ориуэла Коста",
        body:
          "Ориуэла Коста предлагает длинную береговую линию с пляжами, бухтами, прогулочными маршрутами и жилыми урбанизациями в разных прибрежных зонах. Это сильный вариант для клиентов, которым нужен большой выбор, outdoor-образ жизни и устойчивый международный спрос.",
        highlights: [
          "16 км побережья с пляжами, бухтами и прогулочными тропами",
          "Широкий выбор жилых зон: Punta Prima, Cabo Roig, Campoamor и другие",
          "Высокий интерес со стороны владельцев второй недвижимости и аренды",
        ],
        title: "Курортная энергия, широкий выбор объектов и побережье с разными микролокациями.",
      },
      uk: {
        areaLabel: "Оріуела-Коста",
        body:
          "Оріуела-Коста пропонує довгу берегову лінію з пляжами, бухтами, прогулянковими маршрутами та житловими урбанізаціями в різних прибережних зонах. Це сильний варіант для клієнтів, яким потрібен великий вибір, outdoor-спосіб життя та стабільний міжнародний попит.",
        highlights: [
          "16 км узбережжя з пляжами, бухтами та прогулянковими стежками",
          "Широкий вибір житлових зон: Punta Prima, Cabo Roig, Campoamor та інші",
          "Високий інтерес з боку власників другої нерухомості та оренди",
        ],
        title: "Курортна енергія, широкий вибір об'єктів і узбережжя з різними мікролокаціями.",
      },
      de: {
        areaLabel: "Orihuela Costa",
        body:
          "Orihuela Costa bietet einen langen Küstenabschnitt mit Stränden, Buchten, Promenaden und Wohnanlagen in mehreren Küstenlagen. Die Gegend passt gut zu Menschen, die breite Auswahl, Outdoor-Lebensstil und stabile internationale Nachfrage suchen.",
        highlights: [
          "16 km Küste mit Stränden, Buchten und Küstenwegen",
          "Große Auswahl zwischen Punta Prima, Cabo Roig, Campoamor und weiteren Lagen",
          "Beliebt für Zweitwohnsitze, Vermietung und Lifestyle-Käufe",
        ],
        title: "Resort-Atmosphäre, breite Auswahl und eine Küste mit klar unterscheidbaren Teilbereichen.",
      },
    },
    matchLocation: (property) => property.location.toLowerCase().includes("orihuela costa"),
    name: "Orihuela Costa",
    slug: "orihuela-costa",
  },
  "la-zenia": {
    imageUrl:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80",
    imageCreditLabel: "Unsplash",
    imageSourceUrl: "https://unsplash.com",
    localeContent: {
      en: {
        areaLabel: "La Zenia",
        body:
          "La Zenia pairs some of the Orihuela Costa's best Blue Flag beaches with Zenia Boulevard, the largest shopping centre on the Costa Blanca. It's lively in summer and comfortable year-round, with mostly modern apartments and villas — popular for both holiday letting and permanent living.",
        highlights: [
          "Two excellent Blue Flag beaches",
          "Zenia Boulevard shopping and dining on the doorstep",
          "Modern homes, many with communal pools",
        ],
        title: "Beaches and the Costa Blanca's biggest shopping centre on your doorstep.",
      },
      es: {
        areaLabel: "La Zenia",
        body:
          "La Zenia une algunas de las mejores playas con Bandera Azul de Orihuela Costa con Zenia Boulevard, el mayor centro comercial de la Costa Blanca. Animada en verano y cómoda todo el año, con vivienda mayoritariamente moderna, muy demandada para alquiler vacacional y para vivir.",
        highlights: [
          "Dos excelentes playas con Bandera Azul",
          "Compras y restauración en Zenia Boulevard al lado",
          "Viviendas modernas, muchas con piscina comunitaria",
        ],
        title: "Playas y el mayor centro comercial de la Costa Blanca a un paso.",
      },
      ru: {
        areaLabel: "Ла-Зения",
        body:
          "Ла-Зения сочетает одни из лучших пляжей Ориуэла-Коста с «Голубым флагом» и торговым центром Zenia Boulevard — крупнейшим на Коста-Бланке. Оживлённо летом и комфортно круглый год, преимущественно современное жильё, популярное для аренды и постоянного проживания.",
        highlights: [
          "Два отличных пляжа с «Голубым флагом»",
          "Магазины и рестораны Zenia Boulevard рядом",
          "Современное жильё, часто с общим бассейном",
        ],
        title: "Пляжи и крупнейший торговый центр Коста-Бланки рядом с домом.",
      },
      uk: {
        areaLabel: "Ла-Сенія",
        body:
          "Ла-Сенія поєднує одні з найкращих пляжів Оріуела-Кости з «Блакитним прапором» і торговий центр Zenia Boulevard — найбільший на Коста-Бланці. Жваво влітку та комфортно цілий рік, переважно сучасне житло, популярне для оренди та постійного проживання.",
        highlights: [
          "Два чудові пляжі з «Блакитним прапором»",
          "Магазини та ресторани Zenia Boulevard поруч",
          "Сучасне житло, часто зі спільним басейном",
        ],
        title: "Пляжі та найбільший торговий центр Коста-Бланки поруч із домом.",
      },
      de: {
        areaLabel: "La Zenia",
        body:
          "La Zenia verbindet einige der besten Blaue-Flagge-Strände der Orihuela Costa mit dem Zenia Boulevard, dem größten Einkaufszentrum der Costa Blanca. Im Sommer lebhaft, das ganze Jahr angenehm, überwiegend moderne Wohnungen und Villen — beliebt für Ferienvermietung und zum Wohnen.",
        highlights: [
          "Zwei ausgezeichnete Blaue-Flagge-Strände",
          "Zenia Boulevard mit Shopping und Gastronomie direkt nebenan",
          "Moderne Häuser, viele mit Gemeinschaftspool",
        ],
        title: "Strände und das größte Einkaufszentrum der Costa Blanca direkt nebenan.",
      },
    },
    matchLocation: (property) => property.location.toLowerCase().includes("la zenia"),
    name: "La Zenia",
    slug: "la-zenia",
  },
  "cabo-roig": {
    imageUrl:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80",
    imageCreditLabel: "Unsplash",
    imageSourceUrl: "https://unsplash.com",
    localeContent: {
      en: {
        areaLabel: "Cabo Roig",
        body:
          "Cabo Roig is one of the most prestigious spots on the Orihuela Costa, known for its marina, cliff-top restaurant strip and sheltered sandy coves linked by a scenic coastal path. Homes range from beachside apartments to detached villas, often at a premium for the location.",
        highlights: [
          "Marina and sheltered sandy coves",
          "Renowned seafront restaurant strip",
          "Sought-after, higher-end coastal location",
        ],
        title: "A prestigious headland with a marina, coves and a seafront dining strip.",
      },
      es: {
        areaLabel: "Cabo Roig",
        body:
          "Cabo Roig es uno de los enclaves con más prestigio de Orihuela Costa, conocido por su puerto deportivo, su zona de restaurantes sobre el acantilado y sus calas resguardadas unidas por un bonito sendero costero. La oferta va de apartamentos junto al mar a villas independientes, con precios superiores por su ubicación.",
        highlights: [
          "Puerto deportivo y calas resguardadas",
          "Reconocida zona de restaurantes frente al mar",
          "Ubicación costera exclusiva y demandada",
        ],
        title: "Un cabo con prestigio: puerto deportivo, calas y restaurantes frente al mar.",
      },
      ru: {
        areaLabel: "Кабо-Роиг",
        body:
          "Кабо-Роиг — один из самых престижных уголков Ориуэла-Коста, известный мариной, рестораном на вершине утёса и укромными песчаными бухтами, соединёнными живописной прибрежной тропой. Жильё — от квартир у моря до отдельных вилл, часто с наценкой за расположение.",
        highlights: [
          "Марина и укромные песчаные бухты",
          "Известная набережная с ресторанами",
          "Престижное и востребованное прибрежное расположение",
        ],
        title: "Престижный мыс с мариной, бухтами и ресторанами у моря.",
      },
      uk: {
        areaLabel: "Кабо-Роіг",
        body:
          "Кабо-Роіг — один із найпрестижніших куточків Оріуела-Кости, відомий мариною, ресторанною зоною на вершині скелі та затишними піщаними бухтами, з'єднаними мальовничою прибережною стежкою. Житло — від квартир біля моря до окремих вілл, часто з надбавкою за розташування.",
        highlights: [
          "Марина й затишні піщані бухти",
          "Відома набережна з ресторанами",
          "Престижне та затребуване прибережне розташування",
        ],
        title: "Престижний мис із мариною, бухтами та ресторанами біля моря.",
      },
      de: {
        areaLabel: "Cabo Roig",
        body:
          "Cabo Roig ist einer der prestigeträchtigsten Orte der Orihuela Costa, bekannt für seinen Yachthafen, die Restaurantmeile auf der Steilküste und geschützte Sandbuchten, verbunden durch einen schönen Küstenweg. Die Angebote reichen von Wohnungen am Strand bis zu freistehenden Villen, oft mit Aufpreis für die Lage.",
        highlights: [
          "Yachthafen und geschützte Sandbuchten",
          "Bekannte Restaurantmeile am Meer",
          "Begehrte, gehobene Küstenlage",
        ],
        title: "Eine prestigeträchtige Landzunge mit Yachthafen, Buchten und Restaurantmeile.",
      },
    },
    matchLocation: (property) => property.location.toLowerCase().includes("cabo roig"),
    name: "Cabo Roig",
    slug: "cabo-roig",
  },
  "guardamar-del-segura": {
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    imageCreditLabel: "Unsplash",
    imageSourceUrl: "https://unsplash.com",
    localeContent: {
      en: {
        areaLabel: "Guardamar del Segura",
        body:
          "Guardamar combines long sandy beaches, pinewoods, dunes, and a quieter town atmosphere that feels softer than the denser resort areas to the south. It suits clients who want more space, a greener edge, and a coastal setting that still feels grounded year-round.",
        highlights: [
          "About 9 km of beaches with dunes and pinewoods",
          "A calmer town feel with strong natural surroundings",
          "Appeals to buyers and renters looking for space and a softer pace",
        ],
        title: "Greener edges, long beaches, and a quieter pace by the sea.",
      },
      es: {
        areaLabel: "Guardamar del Segura",
        body:
          "Guardamar combina largas playas de arena, pinares, dunas y una atmósfera más tranquila que las zonas residenciales más densas del sur. Encaja muy bien para quien busca más espacio, entorno natural y una vida costera con ritmo más suave durante todo el año.",
        highlights: [
          "Cerca de 9 km de playas con dunas y pinares",
          "Un ambiente más sereno con fuerte presencia natural",
          "Atractivo para compradores e inquilinos que valoran espacio y calma",
        ],
        title: "Más verde, playas largas y un ritmo costero más pausado.",
      },
      ru: {
        areaLabel: "Гуардамар-дель-Сегура",
        body:
          "Гуардамар сочетает длинные песчаные пляжи, сосновые рощи, дюны и более спокойную городскую атмосферу, чем в плотных курортных зонах южнее. Это хороший выбор для тех, кто ищет больше пространства, зеленое окружение и мягкий прибрежный ритм круглый год.",
        highlights: [
          "Около 9 км пляжей с дюнами и сосновыми лесами",
          "Более спокойный городской ритм и сильное природное окружение",
          "Подходит тем, кто ценит простор, природу и размеренную жизнь",
        ],
        title: "Больше зелени, длинные пляжи и более тихий ритм у моря.",
      },
      uk: {
        areaLabel: "Гуардамар-дель-Сегура",
        body:
          "Гуардамар поєднує довгі піщані пляжі, соснові гаї, дюни та спокійнішу міську атмосферу, ніж у щільних курортних зонах південніше. Це хороший вибір для тих, хто шукає більше простору, зелене оточення та м'який прибережний ритм цілий рік.",
        highlights: [
          "Близько 9 км пляжів із дюнами та сосновими лісами",
          "Спокійніший міський ритм і сильне природне оточення",
          "Підходить тим, хто цінує простір, природу та розмірене життя",
        ],
        title: "Більше зелені, довгі пляжі та тихіший ритм біля моря.",
      },
      de: {
        areaLabel: "Guardamar del Segura",
        body:
          "Guardamar verbindet lange Sandstrände, Pinienwälder, Dünen und ein ruhigeres Ortsgefühl als die dichteren Resortlagen weiter südlich. Die Gegend passt gut zu Menschen, die mehr Raum, Natur und einen weicheren Küstenrhythmus für das ganze Jahr suchen.",
        highlights: [
          "Rund 9 km Strände mit Dünen und Pinienwäldern",
          "Ruhigeres Ortsgefühl mit starkem Naturbezug",
          "Gut für Käufer und Mieter, die Platz und Gelassenheit suchen",
        ],
        title: "Mehr Grün, lange Strände und ein ruhigeres Leben am Meer.",
      },
    },
    matchLocation: (property) => property.location.toLowerCase().includes("guardamar del segura"),
    name: "Guardamar del Segura",
    slug: "guardamar-del-segura",
  },
};

export function getRegionBySlug(slug: string) {
  return regions[slug as RegionSlug] ?? null;
}
