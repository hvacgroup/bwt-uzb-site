/**
 * Blog articles. Each one grows out of a carousel already published in the
 * @bwt_uzb Telegram channel and keeps the same sources.
 *
 * Content lives here as typed data rather than MDX: no extra dependency, the
 * texts sit next to their sources, and TypeScript catches a missing locale.
 * Inline links use [text](href). An href starting with "/" is an internal
 * route (rendered through the locale-aware Link), anything else opens in a
 * new tab.
 */

export type Block =
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] };

export type PostText = {
  /** On-page H1 and card title. */
  title: string;
  /** <title> tag. Kept under ~65 characters. */
  seoTitle: string;
  /** Meta description and card teaser. */
  description: string;
  lead: string;
  body: Block[];
  coverAlt: string;
};

export type Source = { label: string; url?: string };

export type Post = {
  slug: string;
  /** ISO date the article went live on the site. */
  date: string;
  /** Telegram message the article grew from. */
  telegram: string;
  cover: string;
  readMin: number;
  sources: Source[];
  ru: PostText;
  uz: PostText;
};

export const POSTS: Post[] = [
  {
    slug: "zhestkaya-voda-priznaki",
    date: "2026-09-30",
    telegram: "https://t.me/bwt_uzb/271",
    cover: "/images/blog/zhestkaya-voda.webp",
    readMin: 4,
    sources: [
      {
        label: "USGS Water Science School — Hardness of Water",
        url: "https://www.usgs.gov/water-science-school/science/hardness-water",
      },
    ],
    ru: {
      title: "Жёсткая вода: 5 признаков, которые видно дома",
      seoTitle: "Жёсткая вода: 5 признаков дома и как узнать точно",
      description:
        "Как понять, что вода жёсткая: мыло не пенится, накипь в чайнике, пятна на стаканах. Шкала жёсткости в мг/л и что делать дальше.",
      lead:
        "Жёсткость — это количество кальция и магния, растворённых в воде. Для первой оценки прибор не нужен: большинство признаков видно на кухне и в ванной.",
      coverAlt: "Стаканы с белыми пятнами после мытья жёсткой водой",
      body: [
        { t: "h2", text: "Что такое жёсткость" },
        {
          t: "p",
          text: "Вода проходит через горные породы и забирает из них кальций и магний. Чем больше этих солей, тем жёстче вода. Глазом их не видно, на вкус почти не заметно. Проявляются они, когда вода встречается с мылом или нагревается.",
        },
        { t: "h2", text: "Пять признаков" },
        { t: "h3", text: "1. Мыло плохо пенится" },
        {
          t: "p",
          text: "Геологическая служба США (USGS) объясняет: мыло вступает в реакцию с кальцием и образует нерастворимый белый осадок. Моющего средства уходит больше.",
        },
        { t: "h3", text: "2. Плёнка на руках и белое кольцо на раковине" },
        {
          t: "p",
          text: "Это тот же осадок. Часть мыла не смывается и остаётся на коже и на эмали.",
        },
        { t: "h3", text: "3. Пятна и мутный налёт на стаканах" },
        {
          t: "p",
          text: "По данным USGS, жёсткая вода — одна из самых частых причин, по которым посуда после мытья выглядит мутной.",
        },
        { t: "h3", text: "4. Накипь в чайнике и бойлере" },
        {
          t: "p",
          text: "При нагреве кальций выпадает в виде карбоната кальция. Это твёрдый белый слой, который все знают как накипь.",
        },
        { t: "h3", text: "5. Засоры и растущие расходы на нагрев" },
        {
          t: "p",
          text: "USGS пишет, что накипь сокращает срок службы водонагревателя, снижает КПД электрических бойлеров и забивает трубы.",
        },
        { t: "h2", text: "Жёсткая вода опасна для здоровья?" },
        {
          t: "p",
          text: "USGS прямо указывает: жёсткость не относится к вопросам здоровья, это бытовое неудобство. ВОЗ отмечает, что питьевая вода может давать часть кальция и магния в рационе. Поэтому задача в том, чтобы защитить технику и сантехнику от накипи.",
        },
        { t: "h2", text: "Как узнать точную цифру" },
        {
          t: "p",
          text: "Признаки подсказывают направление, число даёт только лабораторный анализ. Шкала USGS, мг/л в пересчёте на карбонат кальция:",
        },
        {
          t: "ul",
          items: [
            "0–60: мягкая",
            "61–120: умеренно жёсткая",
            "121–180: жёсткая",
            "выше 180: очень жёсткая",
          ],
        },
        {
          t: "p",
          text: "TDS-метр, популярная «ручка» для воды, показывает общее количество растворённых веществ. Жёсткость отдельно он не измеряет.",
        },
        { t: "h2", text: "Что делать дальше" },
        {
          t: "p",
          text: "Если признаки есть, начните с анализа воды. По результату станет понятно, нужен ли умягчитель на вводе в дом или для питья хватит фильтра под мойкой. [Оставьте заявку на анализ воды](/request), и мы поможем прочитать результат.",
        },
      ],
    },
    uz: {
      title: "Qattiq suv: uyda koʻrinadigan 5 belgi",
      seoTitle: "Qattiq suv: uyda 5 belgi va aniq raqamni bilish",
      description:
        "Suv qattiqligini uyda qanday bilish mumkin: sovun koʻpirmaydi, choynakda ohak, stakanda dogʻ. Qattiqlik shkalasi mg/l da va keyingi qadam.",
      lead:
        "Qattiqlik — suvda erigan kalsiy va magniy miqdori. Dastlabki baho uchun asbob kerak emas: belgilarning koʻpi oshxona va hammomda koʻrinib turadi.",
      coverAlt: "Qattiq suvda yuvilgan, oq dogʻli stakanlar",
      body: [
        { t: "h2", text: "Qattiqlik nima" },
        {
          t: "p",
          text: "Suv tosh qatlamlaridan oʻtib, ulardan kalsiy va magniyni oladi. Bu tuzlar qancha koʻp boʻlsa, suv shuncha qattiq boʻladi. Ularni koʻz bilan koʻrmaysiz, taʼmi ham deyarli sezilmaydi. Suv sovun bilan uchrashganda yoki isitilganda ular bilinib qoladi.",
        },
        { t: "h2", text: "Beshta belgi" },
        { t: "h3", text: "1. Sovun yaxshi koʻpirmaydi" },
        {
          t: "p",
          text: "AQSh Geologiya xizmati (USGS) yozishicha, sovun kalsiy bilan birikib, erimaydigan oq qoldiq hosil qiladi. Yuvish uchun koʻproq vosita ketadi.",
        },
        { t: "h3", text: "2. Qoʻlda parda, rakovinada oq halqa" },
        {
          t: "p",
          text: "Bu oʻsha qoldiq. Sovunning bir qismi yuvilib ketmaydi, teri va emal ustida qoladi.",
        },
        { t: "h3", text: "3. Stakan va tarelkada dogʻ" },
        {
          t: "p",
          text: "USGS maʼlumotiga koʻra, yuvilgan idishning xira boʻlib qolishiga koʻpincha qattiq suv sabab boʻladi.",
        },
        { t: "h3", text: "4. Choynak va isitgichda ohak" },
        {
          t: "p",
          text: "Suv isiganda kalsiy karbonat choʻkmaga tushadi. Bu qattiq oq qatlam, uni ohak yoki nakip deymiz.",
        },
        { t: "h3", text: "5. Quvur tiqiladi, isitish qimmatlashadi" },
        {
          t: "p",
          text: "USGS yozishicha, ohak suv isitgichning xizmat muddatini qisqartiradi, elektr isitgichning samaradorligini pasaytiradi va quvurlarni tiqib qoʻyadi.",
        },
        { t: "h2", text: "Qattiq suv sogʻliq uchun xavflimi?" },
        {
          t: "p",
          text: "USGS aniq yozadi: qattiqlik sogʻliq masalasi emas, u maishiy noqulaylik. JSST esa ichimlik suvi ratsiondagi kalsiy va magniyga hissa qoʻshishi mumkinligini qayd etadi. Demak, vazifa texnika va santexnikani ohakdan himoya qilish.",
        },
        { t: "h2", text: "Aniq raqamni qanday bilish mumkin" },
        {
          t: "p",
          text: "Belgilar yoʻnalish beradi, raqamni esa faqat laboratoriya tahlili aytadi. USGS shkalasi, mg/l, kalsiy karbonat hisobida:",
        },
        {
          t: "ul",
          items: [
            "0–60: yumshoq",
            "61–120: oʻrtacha qattiq",
            "121–180: qattiq",
            "180 dan yuqori: juda qattiq",
          ],
        },
        {
          t: "p",
          text: "TDS-metr, yaʼni suv uchun qalamcha, suvda erigan barcha moddalarning umumiy miqdorini koʻrsatadi. Qattiqlikni u alohida oʻlchamaydi.",
        },
        { t: "h2", text: "Keyingi qadam" },
        {
          t: "p",
          text: "Belgilar boʻlsa, suv tahlilidan boshlang. Natijaga qarab, uyga kirishda yumshatgich kerakmi yoki ichish uchun rakovina tagidagi filtr yetadimi, aniq boʻladi. [Suv tahliliga ariza qoldiring](/request), natijani tushunishga yordam beramiz.",
        },
      ],
    },
  },

  {
    slug: "voda-dlya-detskoj-smesi",
    date: "2026-09-30",
    telegram: "https://t.me/bwt_uzb/334",
    cover: "/images/blog/voda-dlya-smesi.webp",
    readMin: 4,
    sources: [
      {
        label: "NHS — How to make up baby formula",
        url: "https://www.nhs.uk/baby/breastfeeding-and-bottle-feeding/bottle-feeding/making-up-baby-formula/",
      },
      {
        label:
          "WHO/FAO — Safe preparation, storage and handling of powdered infant formula: guidelines, 2007",
        url: "https://iris.who.int/server/api/core/bitstreams/423f27ea-b94d-447c-aa0c-46cdbc80e5b3/content",
      },
    ],
    ru: {
      title: "Какая вода нужна для детской смеси",
      seoTitle: "Вода для детской смеси: нужно ли кипятить фильтрованную",
      description:
        "ВОЗ и NHS: смесь разводят водой не ниже 70 °C. Почему фильтр не заменяет кипячение, порядок приготовления и какую воду брать нельзя.",
      lead:
        "Частый вопрос родителей: если вода прошла через фильтр, её можно не кипятить? Для детской смеси ответ однозначный: кипятить нужно.",
      coverAlt: "Мама держит на руках малыша в розовом полотенце",
      body: [
        { t: "h2", text: "Главное правило: не ниже 70 °C" },
        {
          t: "p",
          text: "Сухая смесь не стерильна. Даже в закрытой банке в порошке могут быть бактерии. ВОЗ и ФАО рекомендуют разводить смесь водой температурой не ниже 70 °C: такая вода их уничтожает. Национальная служба здравоохранения Великобритании (NHS) даёт то же правило.",
        },
        { t: "h2", text: "Почему фильтр не заменяет кипячение" },
        {
          t: "p",
          text: "Ультрафильтрационная мембрана задерживает бактерии, которые есть в воде. Но здесь бактерии могут находиться в самом порошке, и до них не доберётся ни один фильтр. Поэтому фильтрованную воду для смеси тоже кипятят. Фильтр даёт чистую основу для кипячения.",
        },
        { t: "h2", text: "Порядок приготовления по NHS" },
        {
          t: "ol",
          items: [
            "Вымойте руки. Бутылочка и соска должны быть чистыми и простерилизованными.",
            "Вскипятите свежую воду и дайте ей остыть не дольше 30 минут. Так она останется не ниже 70 °C.",
            "Сначала налейте в бутылочку воду, затем насыпьте порошок.",
            "Остудите закрытую бутылочку под струёй холодной воды.",
            "Капните смесь на внутреннюю сторону запястья: она должна быть тёплой, но не горячей.",
            "Остатки смеси после кормления вылейте.",
          ],
        },
        { t: "h2", text: "Какую воду не использовать" },
        {
          t: "ul",
          items: [
            "Воду после умягчителя.",
            "Воду, которую уже кипятили.",
            "Бутилированную воду: NHS обычно её не рекомендует, потому что она не стерильна и в ней может быть много натрия или сульфатов.",
          ],
        },
        { t: "h2", text: "Если дома стоит умягчитель" },
        {
          t: "p",
          text: "Умягчитель на вводе обычно подаёт умягчённую воду на все краны. Для смеси набирайте воду из крана, куда идёт неумягчённая вода. На какой кран какая вода идёт, скажет мастер, который ставил систему. Если систему устанавливали мы, позвоните в call-центр: [+998 77 407-87-77](tel:+998774078777).",
        },
      ],
    },
    uz: {
      title: "Chaqaloq aralashmasi uchun qanday suv kerak",
      seoTitle: "Chaqaloq aralashmasi uchun suv: filtrlangani qaynatiladimi",
      description:
        "JSST va NHS: aralashma kamida 70 °C li suvda tayyorlanadi. Filtr nega qaynatish oʻrnini bosmaydi, tayyorlash tartibi va qaysi suv mos emas.",
      lead:
        "Ota-onalar koʻp soʻraydi: suv filtrdan oʻtgan boʻlsa, uni qaynatmasa ham boʻladimi? Chaqaloq aralashmasi uchun javob aniq: qaynatish kerak.",
      coverAlt: "Ona pushti sochiqqa oʻralgan chaqaloqni koʻtarib turibdi",
      body: [
        { t: "h2", text: "Asosiy qoida: kamida 70 °C" },
        {
          t: "p",
          text: "Quruq aralashma steril emas. Qutisi ochilmagan boʻlsa ham, kukunda bakteriya boʻlishi mumkin. JSST va FAO aralashmani kamida 70 °C li suvda tayyorlashni tavsiya qiladi: bunday suv ularni yoʻq qiladi. Buyuk Britaniya sogʻliqni saqlash xizmati (NHS) ham xuddi shu qoidani beradi.",
        },
        { t: "h2", text: "Filtr nega qaynatish oʻrnini bosmaydi" },
        {
          t: "p",
          text: "Ultrafiltratsiya membranasi suvdagi bakteriyani ushlaydi. Lekin bu holatda bakteriya kukunning oʻzida boʻlishi mumkin va unga hech qanday filtr yetib bormaydi. Shuning uchun filtrlangan suv ham qaynatiladi. Filtr qaynatish uchun toza asos beradi.",
        },
        { t: "h2", text: "NHS boʻyicha tayyorlash tartibi" },
        {
          t: "ol",
          items: [
            "Qoʻlingizni yuving. Shisha va soʻrgʻich toza va sterillangan boʻlsin.",
            "Yangi suvni qaynating va 30 daqiqadan koʻp kutmang. Shunda u kamida 70 °C boʻlib turadi.",
            "Shishaga avval suvni quying, keyin kukunni soling.",
            "Qopqogʻi yopiq shishani oqib turgan sovuq suv ostida soviting.",
            "Bilakning ichki tomoniga tomizib koʻring: iliq boʻlsin, issiq emas.",
            "Ovqatlantirishdan keyin qolgan aralashmani toʻking.",
          ],
        },
        { t: "h2", text: "Qaysi suv mos emas" },
        {
          t: "ul",
          items: [
            "Yumshatgichdan oʻtgan suv.",
            "Oldin qaynatilgan suv.",
            "Butilka suvi: NHS uni odatda tavsiya etmaydi, chunki u steril emas va tarkibida natriy yoki sulfat koʻp boʻlishi mumkin.",
          ],
        },
        { t: "h2", text: "Uyda yumshatgich boʻlsa" },
        {
          t: "p",
          text: "Kirishdagi yumshatgich odatda barcha joʻmraklarga yumshatilgan suv beradi. Aralashma uchun suvni yumshatilmagan suv keladigan joʻmrakdan oling. Qaysi joʻmrakka qanday suv kelishini tizimni oʻrnatgan usta aytadi. Tizimni biz oʻrnatgan boʻlsak, call-markazga qoʻngʻiroq qiling: [+998 77 407-87-77](tel:+998774078777).",
        },
      ],
    },
  },

  {
    slug: "obratnyj-osmos-drenazh",
    date: "2026-09-30",
    telegram: "https://t.me/bwt_uzb/293",
    cover: "/images/blog/osmos-drenazh.webp",
    readMin: 4,
    sources: [
      { label: "BWT Domestic Technology Sales Catalogue 2026, p. 106, 122" },
      {
        label: "BWT OsmoCare datasheet (bwt.com)",
        url: "https://www.bwt.com/fr/-/media/bwt/bwt-wam/filterkerzen-details/bwtwam_osmocare_datenblatt.pdf",
      },
    ],
    ru: {
      title: "Обратный осмос: что уходит в дренаж",
      seoTitle: "Обратный осмос и дренаж: что сливается в канализацию",
      description:
        "Зачем фильтру обратного осмоса трубка в канализацию, что такое концентрат, почему в нём вдвое больше минералов и когда дома хватает ультрафильтрации.",
      lead:
        "У каждого фильтра обратного осмоса есть вторая трубка, которая подключается к канализации под мойкой. Разберём, что по ней течёт и почему без неё осмос не работает.",
      coverAlt: "Сифон и трубы под кухонной мойкой",
      body: [
        { t: "h2", text: "Как работает обратный осмос" },
        {
          t: "p",
          text: "Вода под давлением подаётся на мембрану с порами около 0,0001 мкм. Такая цифра указана в каталоге BWT 2026 для мембраны BWT Pure SLIM RO-DF. Это в тысячу раз мельче, чем у ультрафильтрационной мембраны 0,1 мкм. Поэтому осмос задерживает и растворённые соли: нитраты, сульфаты, хлориды, тяжёлые металлы.",
        },
        { t: "h2", text: "Вода делится на два потока" },
        {
          t: "p",
          text: "Одна часть проходит через мембрану. Это пермеат, его вы пьёте. Остальная вода через мембрану не проходит и уносит всё, что мембрана задержала. Это концентрат, он уходит в дренаж. Так устроен любой обратный осмос: если бы задержанные соли оставались на мембране, она бы забилась.",
        },
        { t: "h2", text: "Что в концентрате" },
        {
          t: "p",
          text: "В техническом листе BWT OsmoCare сказано: в концентрате минералов примерно вдвое больше, чем в исходной воде. Новых веществ там нет. Это те же соли, что пришли из водопровода, только собранные в меньшем объёме воды.",
        },
        {
          t: "p",
          text: "Поэтому линия концентрата со временем покрывается отложениями. Для её очистки у BWT есть отдельное сервисное средство OsmoCare: таблетка растворяет отложения за цикл промывки 15–20 минут и не затрагивает мембрану.",
        },
        { t: "h2", text: "Значит, осмос — плохой выбор?" },
        {
          t: "p",
          text: "Нет. Там, где нужна вода почти без солей, осмос делает свою работу: в лабораториях, парогенераторах, стоматологии, профессиональных кофемашинах. Дома он оправдан, если в воде много растворённых солей, например нитратов.",
        },
        { t: "h2", text: "Когда хватает ультрафильтрации" },
        {
          t: "p",
          text: "Если анализ показывает, что солей в воде немного, для питья обычно достаточно ультрафильтрации. Мембрана 0,1 мкм задерживает частицы и микроорганизмы и оставляет минералы. Такой фильтр не сливает воду в дренаж. Так работает BWT SLIM, модели есть в [каталоге](/catalog).",
        },
        { t: "h2", text: "Что выбрать для вашего дома" },
        {
          t: "p",
          text: "Ответ даёт анализ воды. Если солей много, нужен осмос с дренажной трубкой и ступенью реминерализации, которую рекомендует BWT. Если солей мало, хватит ультрафильтрации. [Оставьте заявку](/request), и мы подберём систему по анализу.",
        },
      ],
    },
    uz: {
      title: "Osmos drenajga nimani oqizadi",
      seoTitle: "Teskari osmos va drenaj: kanalizatsiyaga nima oqadi",
      description:
        "Teskari osmos filtrida nega drenaj quvuri bor, konsentrat nima, unda nega minerallar ikki barobar koʻp va uyda qachon ultrafiltratsiya yetadi.",
      lead:
        "Har bir teskari osmos filtrida ikkinchi quvur bor, u rakovina tagidagi kanalizatsiyaga ulanadi. Unda nima oqishini va osmos nega usiz ishlamasligini koʻramiz.",
      coverAlt: "Oshxona rakovinasi tagidagi sifon va quvurlar",
      body: [
        { t: "h2", text: "Teskari osmos qanday ishlaydi" },
        {
          t: "p",
          text: "Suv bosim bilan teshiklari taxminan 0,0001 mkm boʻlgan membranaga beriladi. BWT 2026 katalogida BWT Pure SLIM RO-DF membranasi uchun shu raqam yozilgan. Bu 0,1 mkm li ultrafiltratsiya membranasidan ming barobar mayda. Shuning uchun osmos erigan tuzlarni ham ushlaydi: nitrat, sulfat, xlorid, ogʻir metallar.",
        },
        { t: "h2", text: "Suv ikkiga boʻlinadi" },
        {
          t: "p",
          text: "Bir qismi membranadan oʻtadi. Bu permeat, uni ichasiz. Qolgan suv membranadan oʻtmaydi va membrana ushlab qolgan hamma narsani olib ketadi. Bu konsentrat, u drenajga ketadi. Har qanday teskari osmos shunday ishlaydi: ushlangan tuzlar membranada qolsa, u tiqilib qoladi.",
        },
        { t: "h2", text: "Konsentratda nima bor" },
        {
          t: "p",
          text: "BWT OsmoCare texnik varaqasida yozilgan: konsentratda minerallar xom suvdagidan taxminan ikki barobar koʻp. U yerda yangi modda yoʻq. Bu vodoprovoddan kelgan oʻsha tuzlar, faqat kamroq suvga yigʻilgan.",
        },
        {
          t: "p",
          text: "Shu sababli konsentrat quvurida vaqt oʻtib choʻkma hosil boʻladi. Uni tozalash uchun BWT da alohida servis vositasi bor, OsmoCare: tabletka 15–20 daqiqalik yuvish siklida choʻkmani eritadi va membranaga tegmaydi.",
        },
        { t: "h2", text: "Demak, osmos yomon tanlovmi?" },
        {
          t: "p",
          text: "Yoʻq. Tuzsiz suv kerak boʻlgan joyda osmos oʻz ishini qiladi: laboratoriya, bugʻ generatori, stomatologiya, professional qahva mashinasi. Uyda esa suvda erigan tuz, masalan nitrat koʻp boʻlsa, osmos oʻrinli.",
        },
        { t: "h2", text: "Qachon ultrafiltratsiya yetadi" },
        {
          t: "p",
          text: "Tahlil suvda tuz kam ekanini koʻrsatsa, ichish uchun odatda ultrafiltratsiya yetadi. 0,1 mkm li membrana zarra va mikroorganizmlarni ushlaydi, minerallarni esa qoldiradi. Bunday filtr drenajga suv oqizmaydi. BWT SLIM shunday ishlaydi, modellarini [katalogda](/catalog) koʻring.",
        },
        { t: "h2", text: "Uyingiz uchun qaysi biri" },
        {
          t: "p",
          text: "Javobni suv tahlili beradi. Tuz koʻp boʻlsa, drenaj quvurli osmos va BWT tavsiya qiladigan remineralizatsiya bosqichi kerak. Tuz kam boʻlsa, ultrafiltratsiya yetadi. [Ariza qoldiring](/request), tahlilga qarab tizim tanlaymiz.",
        },
      ],
    },
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Newest first. */
export function sortedPosts(): Post[] {
  return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
}

export function postText(post: Post, locale: string): PostText {
  return locale === "uz" ? post.uz : post.ru;
}
