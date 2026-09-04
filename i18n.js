/* minecraft.aiskov.com — language switching
   English lives in index.html; this file holds the Polish copy.
   Language is picked from localStorage → navigator.languages → 'en',
   and can be overridden with the EN/PL buttons in the header.
   Markup hooks: data-i18n="key" (innerHTML), data-i18n-aria-label="key".
*/
(function () {
  'use strict';

  var STORAGE_KEY = 'aiskov-lang';
  var DEFAULT_LANG = 'en';

  var pl = {
    'meta.title': 'minecraft.aiskov.com — dwa serwery Minecraft, jeden adres',
    'meta.description': 'Dwa serwery Minecraft pod minecraft.aiskov.com: crossplayowy survival dla Javy i Bedrocka oraz serwer z modami na NeoForge 1.21.1, port 25566. Instrukcja połączenia krok po kroku.',

    'nav.label': 'Sekcje',
    'nav.language': 'Język',
    'nav.crossplay': 'Crossplay',
    'nav.modded': 'Z modami',
    'nav.faq': 'FAQ',

    'hero.eyebrow': 'dwa serwery, jeden adres',
    'hero.title': 'Kop tutaj.<br />Wymówki<br />gdzie indziej.',
    'hero.lead': 'Dwa serwery. Pierwszy to crossplay — wchodzisz z dowolnego urządzenia, bez modów, bez ceregieli. Drugi jest napchany modami i daje zupełnie nowe doświadczenie. Oba pod jednym adresem: <span class="mono-bright">minecraft.aiskov.com</span>.',
    'hero.ctaCrossplay': 'Wejdź na serwer crossplay',
    'hero.ctaModded': 'Wejdź na serwer z modami',

    'cp.kicker': 'SERWER 01',
    'cp.badgeVersion': 'najnowsze wydanie',
    'cp.badgeEditions': 'java + bedrock',
    'cp.badgeMods': 'mody niepotrzebne',
    'cp.title': 'Ten z crossplayem',
    'cp.lead': 'Prawie-vanilla survival na najnowszym wydaniu. Telefon, konsola, laptop — wszyscy lądują w tym samym świecie. Nic nie instalujesz, żadnej gimnastyki z launcherem.',
    'cp.tabsLabel': 'Edycja Minecrafta',
    'cp.tabJava': 'Java Edition',
    'cp.tabBedrock': 'Bedrock Edition',

    'cp.java.step1': 'Odpal Minecrafta: Java Edition w <strong>najnowszej wersji</strong>. Bez modów, bez Forge, bez Fabrica.',
    'cp.java.step2': 'Menu główne → <strong>Tryb wieloosobowy</strong> → <strong>Dodaj serwer</strong>.',
    'cp.java.step3': 'Nazwa serwera: dowolna. Adres serwera: <span class="mono-green">minecraft.aiskov.com</span> — domyślny port jest już poprawny, więc go nie dopisuj.',
    'cp.java.step4': 'Gotowe → kliknij dwa razy w serwer. Do zobaczenia na spawnie.',
    'cp.java.portNote': '(domyślny — nic nie wpisujesz)',
    'cp.java.versionValue': 'najnowsze wydanie',

    'cp.bedrock.step1': 'Otwórz Minecrafta na Windowsie, telefonie, Switchu, PlayStation albo Xboksie — na wszystkim, co nie jest Java Edition.',
    'cp.bedrock.step2': '<strong>Graj</strong> → zakładka <strong>Serwery</strong> → przewiń na sam dół → <strong>Dodaj serwer</strong>.',
    'cp.bedrock.step3': 'Nazwij go dowolnie. Adres <span class="mono-green">minecraft.aiskov.com</span>, port <span class="mono-green">19132</span>. Zapisz.',
    'cp.bedrock.step4': 'Gracze konsolowi: jeśli na waszej platformie serwery zewnętrzne są ukryte, użyjcie sztuczki z DNS albo wbijcie z telefonu — szczegóły w <a href="#faq">FAQ</a>.',
    'cp.bedrock.portNote': '(ten trzeba wpisać)',
    'cp.bedrock.worksOn': 'działa na',
    'cp.bedrock.worksOnValue': 'windows · ios · android · konsole',

    'md.kicker': 'SERWER 02',
    'md.badgeJava': 'tylko java',
    'md.badgePack': 'modpack wymagany',
    'md.title': 'Ten z modami',
    'md.lead': 'Modpack z CurseForge, NeoForge 1.21.1 i port, który nie jest domyślny, bo lubimy patrzeć, jak wszyscy o nim zapominają. Tylko Java Edition — Bedrock na tę imprezę nie wejdzie.',
    'md.step1': 'Zainstaluj <strong>aplikację CurseForge</strong> (albo Prism / ATLauncher — cokolwiek, co importuje paczki z CurseForge).',
    'md.step2': 'Otwórz nasz modpack na CurseForge, kliknij <strong>Install</strong> i pozwól mu ściągnąć całą górę modów.',
    'md.cfLink': 'Modpack na CurseForge',
    'md.step3': 'Uruchom instancję → <strong>Tryb wieloosobowy</strong> → <strong>Dodaj serwer</strong> → <span class="mono-amber">minecraft.aiskov.com:25566</span>. <span class="mono-amber">:25566</span> nie jest opcjonalne.',
    'md.step4': 'Pierwsze ładowanie chwilę trwa. Zrób sobie herbatę, wróć jako czarodziej.',
    'md.loader': 'loader',
    'md.modpack': 'modpack',
    'md.packLink': 'Otwórz paczkę na CurseForge ↗',
    'md.warn': 'Wejście bez dokładnie tej paczki daje czerwoną ścianę tekstu o brakujących modach, a nie świat. Ta sama paczka, ta sama wersja, za każdym razem.',

    'faq.kicker': 'KIEDY COŚ NIE DZIAŁA',
    'faq.title': 'Rozwiązywanie problemów i FAQ',
    'faq.q1': 'Java czy Bedrock — którą w ogóle mam?',
    'faq.a1': 'Jeśli kupiłeś grę na telefonie, konsoli albo w Microsoft Store, to Bedrock. Jeśli odpalasz ją z Minecraft Launchera i możesz instalować mody, to Java. Obie działają na serwerze 01 — trzymaj się po prostu właściwej zakładki.',
    'faq.q2': 'Bedrock nie chce się połączyć.',
    'faq.a2': 'W dziewięciu przypadkach na dziesięć brakuje portu albo jest zły — musi być <span class="mono-bright">19132</span>, nie 25565. Poza tym: zrestartuj grę do końca (Bedrock zapamiętuje nieudane serwery) i upewnij się, że masz aktualną wersję.',
    'faq.q3': 'Wejdę na serwer z modami z Bedrocka albo z czystej Javy?',
    'faq.a3': 'Nie i nie. Serwer 02 wymaga Java Edition z dokładnie tym modpackiem z CurseForge na NeoForge 1.21.1. Czysta Java zostanie odrzucona, a Bedrock w ogóle nie zna tego protokołu.',
    'faq.q4': '„Outdated server” / „Outdated client” na serwerze 01.',
    'faq.a4': 'Serwer 01 chodzi na najnowszym wydaniu. Ustaw profil w launcherze z powrotem na „Latest release” i odpal ponownie. Jeśli właśnie wyszła zupełnie nowa wersja, daj nam kilka dni na nadgonienie.',
    'faq.q5': 'Paczka z modami się crashuje albo chodzi jak pokaz slajdów.',
    'faq.a5': 'Podnieś RAM instancji do 6–8 GB (powyżej 10 GB robi się tylko gorzej), zaktualizuj sterowniki karty graficznej i pozwól paczce dokończyć pierwsze pieczenie shaderów i modeli, zanim ocenisz płynność.',
    'faq.q6': 'Mogę wziąć znajomego?',
    'faq.a6': 'Mała społeczność, więc: tak, jeśli za niego ręczysz. Zapytaj, zanim rozdasz adres, i wszyscy będą zadowoleni.',

    'fact.address': 'adres serwera',
    'fact.port': 'port',
    'fact.version': 'wersja',
    'copy.idle': 'kopiuj',
    'copy.done': 'skopiowano ✓',

    'footer.note': 'Dwa serwery, jeden adres, zero mikropłatności.',
    'footer.tag1': '01 · crossplay · domyślny port',
    'footer.tag2': '02 · z modami · :25566'
  };

  var dicts = { en: null, pl: pl };
  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var attrNodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-aria-label]'));
  var buttons = Array.prototype.slice.call(document.querySelectorAll('.lang-btn[data-lang]'));
  var meta = document.querySelector('meta[name="description"]');

  /* English is whatever the document shipped with — captured once, before any swap. */
  var en = {};
  nodes.forEach(function (n) { en[n.getAttribute('data-i18n')] = n.innerHTML; });
  attrNodes.forEach(function (n) { en[n.getAttribute('data-i18n-aria-label')] = n.getAttribute('aria-label'); });
  en['meta.title'] = document.title;
  en['meta.description'] = meta ? meta.getAttribute('content') : '';
  dicts.en = en;

  function detect() {
    var stored;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (stored && dicts[stored]) return stored;

    var prefs = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || DEFAULT_LANG];

    for (var i = 0; i < prefs.length; i++) {
      var base = String(prefs[i]).toLowerCase().split('-')[0];
      if (dicts[base]) return base;
    }
    return DEFAULT_LANG;
  }

  function apply(lang) {
    var dict = dicts[lang] || dicts[DEFAULT_LANG];
    var fallback = dicts[DEFAULT_LANG];

    nodes.forEach(function (n) {
      var key = n.getAttribute('data-i18n');
      var value = dict[key] != null ? dict[key] : fallback[key];
      if (value != null) n.innerHTML = value;
    });
    attrNodes.forEach(function (n) {
      var key = n.getAttribute('data-i18n-aria-label');
      var value = dict[key] != null ? dict[key] : fallback[key];
      if (value != null) n.setAttribute('aria-label', value);
    });

    if (dict['meta.title']) document.title = dict['meta.title'];
    if (meta && dict['meta.description']) meta.setAttribute('content', dict['meta.description']);
    document.documentElement.lang = lang;

    buttons.forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
      apply(lang);
    });
  });

  apply(detect());
})();
