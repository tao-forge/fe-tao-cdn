import 'select2-origin/select2';

function getUserLanguage() {
    var documentLang = window.document.documentElement.getAttribute('lang');
    var documentLocale = documentLang && documentLang.split('-')[0];

    return documentLocale;
}

var lang = getUserLanguage();

switch (lang) {
    case 'ar':
        import('select2-origin/select2_locale_ar');
        break;
    case 'bg':
        import('select2-origin/select2_locale_bg');
        break;
    case 'ca':
        import('select2-origin/select2_locale_ca');
        break;
    case 'cs':
        import('select2-origin/select2_locale_cs');
        break;
    case 'da':
        import('select2-origin/select2_locale_da');
        break;
    case 'de':
        import('select2-origin/select2_locale_de');
        break;
    case 'el':
        import('select2-origin/select2_locale_el');
        break;
    case 'es':
        import('select2-origin/select2_locale_es');
        break;
    case 'et':
        import('select2-origin/select2_locale_et');
        break;
    case 'eu':
        import('select2-origin/select2_locale_eu');
        break;
    case 'fa':
        import('select2-origin/select2_locale_fa');
        break;
    case 'fi':
        import('select2-origin/select2_locale_fi');
        break;
    case 'fr':
        import('select2-origin/select2_locale_fr');
        break;
    case 'gl':
        import('select2-origin/select2_locale_gl');
        break;
    case 'he':
        import('select2-origin/select2_locale_he');
        break;
    case 'hr':
        import('select2-origin/select2_locale_hr');
        break;
    case 'hu':
        import('select2-origin/select2_locale_hu');
        break;
    case 'id':
        import('select2-origin/select2_locale_id');
        break;
    case 'is':
        import('select2-origin/select2_locale_is');
        break;
    case 'it':
        import('select2-origin/select2_locale_it');
        break;
    case 'ja':
        import('select2-origin/select2_locale_ja');
        break;
    case 'ko':
        import('select2-origin/select2_locale_ko');
        break;
    case 'lt':
        import('select2-origin/select2_locale_lt');
        break;
    case 'lv':
        import('select2-origin/select2_locale_lv');
        break;
    case 'mk':
        import('select2-origin/select2_locale_mk');
        break;
    case 'ms':
        import('select2-origin/select2_locale_ms');
        break;
    case 'nl':
        import('select2-origin/select2_locale_nl');
        break;
    case 'no':
        import('select2-origin/select2_locale_no');
        break;
    case 'pl':
        import('select2-origin/select2_locale_pl');
        break;
    case 'br':
        import('select2-origin/select2_locale_pt-BR');
        break;
    case 'pt':
        import('select2-origin/select2_locale_pt-PT');
        break;
    case 'ro':
        import('select2-origin/select2_locale_ro');
        break;
    case 'ru':
        import('select2-origin/select2_locale_ru');
        break;
    case 'sk':
        import('select2-origin/select2_locale_sk');
        break;
    case 'sv':
        import('select2-origin/select2_locale_sv');
        break;
    case 'th':
        import('select2-origin/select2_locale_th');
        break;
    case 'tr':
        import('select2-origin/select2_locale_tr');
        break;
    case 'vi':
        import('select2-origin/select2_locale_vi');
        break;
    case 'zh':
        import('select2-origin/select2_locale_zh-CN');
        break;
}
