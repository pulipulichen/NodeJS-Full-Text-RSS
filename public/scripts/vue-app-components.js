/* global Vue, httpVueLoader */

//httpVueLoader.register(Vue, './components/device-notification-bar.vue');

var appComponents = {
  //'template': httpVueLoader('./components/template.vue'),
  'app-header': httpVueLoader('./components/app-header/app-header.vue'),
  'full-text-rss-tester': httpVueLoader('./components/full-text-rss-tester/full-text-rss-tester.vue'),
  'subscription-list': httpVueLoader('./components/subscription-list/subscription-list.vue')
}