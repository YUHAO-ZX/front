'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider',
      function ($stateProvider,   $urlRouterProvider) {
          
          $urlRouterProvider
          .otherwise('/app/link');
          $stateProvider
          .state('app.localcacheManage', {
              url: '/localcacheManage',
              templateUrl: 'views/localcache/cacheManage.html',
              resolve: {
                  deps: ['uiLoad',
                      function( uiLoad ){
                          return uiLoad.load(['../localcache/localcache_manage.js','views/js/bootstrap.js']);
                      }]
              }
          })
    }]
  );