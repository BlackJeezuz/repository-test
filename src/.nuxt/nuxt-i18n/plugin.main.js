import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default async ({ app, route, store, req }) => {
  // Options
  const lazy = false
  const vuex = {"moduleName":"i18n","mutations":{"setLocale":"I18N_SET_LOCALE","setMessages":"I18N_SET_MESSAGES"}}

  // Helpers
  const LOCALE_CODE_KEY = 'code'
  const LOCALE_DOMAIN_KEY = 'domain'
  const getLocaleCodes = (locales = []) => {
  if (locales.length) {
    // If first item is a sting, assume locales is a list of codes already
    if (typeof locales[0] === 'string') {
      return locales
    }
    // Attempt to get codes from a list of objects
    if (typeof locales[0][LOCALE_CODE_KEY] === 'string') {
      return locales.map(locale => locale[LOCALE_CODE_KEY])
    }
  }
  return []
}
  const getLocaleFromRoute = (route = {}, routesNameSeparator = '', locales = []) => {
  const codes = getLocaleCodes(locales)
  const localesPattern = `(${codes.join('|')})`
  // Extract from route name
  if (route.name) {
    const regexp = new RegExp(`${routesNameSeparator}${localesPattern}$`, 'i')
    const matches = route.name.match(regexp)
    if (matches && matches.length > 1) {
      return matches[1]
    }
  } else if (route.path) {
    // Extract from path
    const regexp = new RegExp(`^/${localesPattern}/`, 'i')
    const matches = route.path.match(regexp)
    if (matches && matches.length > 1) {
      return matches[1]
    }
  }
  return null
}
  const getHostname = () => (
  process.browser ? window.location.href.split('/')[2] : req.headers.host // eslint-disable-line
)
  const getForwarded = () => (
  process.browser ? window.location.href.split('/')[2] : (req.headers['x-forwarded-host'] ? req.headers['x-forwarded-host'] : req.headers.host)
)
  const getLocaleDomain = () => {
  const hostname = app.i18n.forwardedHost ? getForwarded() : getHostname()
  if (hostname) {
    const localeDomain = app.i18n.locales.find(l => l[LOCALE_DOMAIN_KEY] === hostname) // eslint-disable-line
    if (localeDomain) {
      return localeDomain[LOCALE_CODE_KEY]
    }
  }
  return null
}
  const syncVuex = (locale = null, messages = null) => {
  if (vuex && store) {
    if (locale !== null && vuex.mutations.setLocale) {
      store.dispatch(vuex.moduleName + '/setLocale', locale)
    }
    if (messages !== null && vuex.mutations.setMessages) {
      store.dispatch(vuex.moduleName + '/setMessages', messages)
    }
  }
}

  // Register Vuex module
  if (store) {
    store.registerModule(vuex.moduleName, {
      namespaced: true,
      state: () => ({
        locale: '',
        messages: {}
      }),
      actions: {
        setLocale ({ commit }, locale) {
          commit(vuex.mutations.setLocale, locale)
        },
        setMessages ({ commit }, messages) {
          commit(vuex.mutations.setMessages, messages)
        }
      },
      mutations: {
        [vuex.mutations.setLocale] (state, locale) {
          state.locale = locale
        },
        [vuex.mutations.setMessages] (state, messages) {
          state.messages = messages
        }
      }
    })
  }

  // Set instance options
  app.i18n = new VueI18n({"fallbackLocale":"ru","messages":{"en":{"links":{"shop":"Shop","collection":"Collection","contacts":"Contacts","mainpage":"Main page","tomain":"To main page","news":"News","offer":"Offer","rules":"Rules","partner":"Partnership","faq":"FAQ"},"shop":{"title":"Out goods"},"news":{"title":"News","load":"Load news","more":"more","placehoder":"No news, sorry...","navigation":{"next":"Next","prev":"Previous","back":"Back","to":"to news"}},"collection":{"title":"Collection","tobasket":"To basket"},"contacts":{"title":"Our contacts","mail":"Mail","phone":"Phone","telegram":"Telegram","viber":"Viber","messanger":"Facebook Messanger"},"product":{"buy":"Buy","navigation":{"next":"Next","prev":"Previous","back":"Back"},"tobasket":"To basket"},"basket":{"title":"Your goods","size":"Size","price":"Price","quant":"Quantity","total":"Total","placeholder":"In your basket no goods yet...","toshop":"To shop","tocollection":"To collection","livecontacts":"Live your contacts"},"thanks":{"thanks":"Thank you for your buying!","more":"Need something else?"},"buttons":{"description":"description","look":"look","buy":"Buy","menu":"Menu","close":"Close","order":"Order","back":"Back","submit":"Submit"},"placeholders":{"mail":"Input your mail","phone":"Input your phone","message":"Input your message","name":"Input your name"},"filters":{"hat":"Hats","sweetshot":"Sweetshots","pants":"Pants"},"categories":{"man":"Man","woman":"Woman","kids":"Kids"},"form":{"iagree":"I agree with","agreement":"data processing rules"}},"ru":{"links":{"shop":"Магазин","collection":"Коллекции","contacts":"Контакты","mainpage":"Главная","news":"Новости","tomain":"На главную","offer":"Оферта","rules":"Правила","partner":"Партнерство","faq":"FAQ"},"shop":{"title":"Наши товары"},"news":{"title":"Новости","load":"Загрузить еще","more":"детальнее","placehoder":"Нету новостей, извините...","navigation":{"next":"Следующая","prev":"Предыдущая","back":"Назад","to":"к новостям"}},"collection":{"title":"Коллекции","tobasket":"В корзину"},"contacts":{"title":"Наши контакты","mail":"Почта","phone":"Телефон","telegram":"Телеграм","viber":"Вайбер","messanger":"Фейсбук мессенджер"},"product":{"buy":"Купить","navigation":{"next":"Следующая","prev":"Предыдущая","back":"Назад"},"tobasket":"В корзину"},"basket":{"title":"Ваши товары","size":"Размер","price":"Цена","quant":"Количество","total":"Всего","placeholder":"В вашей корзине еще нет товаров...","toshop":"В магазин","tocollection":"К коллекциям","livecontacts":"Оставьте свои контакты"},"thanks":{"thanks":"Спасибо за покупку!","more":"Хотите купить что-то ещё?"},"buttons":{"description":"Описание","look":"Посмотреть","buy":"Купить","menu":"Меню","close":"Закрыть","order":"Заказать","back":"Назад","submit":"Подтвердить"},"placeholders":{"mail":"Введите свой мейл","phone":"Введите свой телефон","message":"Введите своё сообщение","name":"Введите своё имя"},"filters":{"hat":"Головные уборы","sweetshot":"Свитшоты","pants":"Штаны"},"categories":{"man":"Мужское","woman":"Женское","kids":"Детское"},"form":{"iagree":"Я соглашаюсь с","agreement":"правилами обработки данных"}},"ua":{"links":{"shop":"Магазин","collection":"Колекції","contacts":"Контакти","mainpage":"Головна","tomain":"На головну","news":"Новини","offer":"Оферта","rules":"Правила","partner":"Партнерство","faq":"FAQ"},"shop":{"title":"Наші товари"},"news":{"title":"Новини","load":"Завантажити ще","more":"детальніше","placehoder":"Немає новин..., вибачте","navigation":{"next":"Наступна","prev":"Попередня","back":"Назад","to":"до новин"}},"collection":{"title":"Колекції","tobasket":"До кошику"},"contacts":{"title":"Наші контакти","mail":"Пошта","phone":"Телефон","telegram":"Телеграм","viber":"Вайбер","messanger":"Фейсбук месенджер"},"product":{"buy":"Купити","navigation":{"next":"Наступна","prev":"Попередня","back":"Назад"},"tobasket":"До кошику"},"basket":{"title":"Ваші товари","size":"Розмір","price":"Ціна","quant":"Кількість","total":"Всього","placeholder":"В вашому кошику немає товарів поки що...","toshop":"Магазин","tocollection":"Колекції","livecontacts":"Залиште свої контакти"},"thanks":{"thanks":"Дякуємо за покупку","more":"Бажаєте купити щось ще?"},"buttons":{"description":"Опис","look":"Оглянути","buy":"Купити","menu":"Меню","close":"Закрити","order":"Замовити","back":"Назад","submit":"Підтвердити"},"placeholders":{"mail":"Введіть свій мейл","phone":"Введіть свій телефон","message":"Введіть своє повідомлення","name":"Введіть своє им'я"},"filters":{"hat":"Головні убори","sweetshot":"Світшоти","pants":"Штани"},"categories":{"man":"Чоловіче","woman":"Жіноче","kids":"Дитяче"},"form":{"iagree":"Я погоджуюсь з","agreement":"правилами обрабки даних"}}}})
  app.i18n.locales = [{"code":"ru","iso":"ru-RU"},{"code":"en","iso":"en-US"},{"code":"ua","iso":"ua-UA"}]
  app.i18n.defaultLocale = 'ru'
  app.i18n.differentDomains = false
  app.i18n.forwardedHost = false
  app.i18n.routesNameSeparator = '___'
  app.i18n.beforeLanguageSwitch = () => null
  app.i18n.onLanguageSwitched = () => null

  if (store && store.state.localeDomains) {
    app.i18n.locales.forEach(locale => {
      locale.domain = store.state.localeDomains[locale.code];
    })
  }

  let locale = app.i18n.defaultLocale || null

  if (app.i18n.differentDomains) {
    const domainLocale = getLocaleDomain()
    locale = domainLocale ? domainLocale : locale
  } else {
    const routeLocale = getLocaleFromRoute(route, app.i18n.routesNameSeparator, app.i18n.locales)
    locale = routeLocale ? routeLocale : locale
  }

  app.i18n.locale = locale

  // Lazy-load translations
  if (lazy) {
    const { loadLanguageAsync } = require('./utils')
    const messages = await loadLanguageAsync(app.i18n, app.i18n.locale)
    syncVuex(locale, messages)
    return messages
  } else {
    // Sync Vuex
    syncVuex(locale, app.i18n.getLocaleMessage(locale))
  }
}
