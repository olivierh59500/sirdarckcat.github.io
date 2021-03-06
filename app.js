var sdcGithub = angular.module('sdcGithub', ['ngRoute']);

sdcGithub.filter('escape', function() {
  return escape;
});

sdcGithub.controller('IndexCtrl', function ($scope) {
  debugger;
});

sdcGithub.controller('ServiceWorkerCtrl', function ($scope, $location, $filter) {
  $scope.serviceWorkerController = navigator.serviceWorker.controller;
  $scope.serviceWorkerUrl = '/sw.js';
  $scope.serviceWorkerInit = $filter('json')({'scope': '/'});
  $scope.registerServiceWorker = function() {
    navigator.serviceWorker.register(
      $scope.serviceWorkerUrl,
      JSON.parse($scope.serviceWorkerInit));
  };
  // beacon
  $scope.beaconFetch = function (beaconUrl, beaconData, beaconType) {
    navigator.sendBeacon(beaconUrl, new Blob([beaconData], {type: beaconType}));
  };
  // event source
  $scope.eventSourceFetch = function(eventSourceUrl, eventSourceWithCredentials) {
    var eventSource = new EventSource(eventSourceUrl, {withCredentials: eventSourceWithCredentials});
    eventSource.onerror = console.log.bind(console, 'EventSource.onerror');
    eventSource.onmessage = console.log.bind(console, 'EventSource.onmessage');
    eventSource.onopen = console.log.bind(console, 'EventSource.onopen');
  };
  // favicon
  $scope.faviconFetch = function(faviconUrl) {
    var link = document.createElement('link');
    link.setAttribute('rel', 'shortcut icon');
    link.setAttribute('href', faviconUrl);
    document.getElementsByTagName('head')[0].appendChild(link);
  };
  // fetch
  $scope.fetchFetch = function(fetchUrl, fetchMethod, fetchHeader, fetchBody, fetchMode, fetchCredentials, fetchCache, fetchRedirect) {
    var url = fetchUrl;
    var info = {
      method: fetchMethod,
      headers: fetchHeader,
      body: fetchBody,
      mode: fetchMode,
      credentials: fetchCredentials,
      cache: fetchCache,
      redirect: fetchRedirect
    };
    fetch(url, info).then(console.log.bind(console, 'Fetch'));
  };
  // font
  $scope.fontFetch = function(fontUrl) {
    new FontFace("fontName", "url(" + JSON.stringify(fontUrl) + ")").load().then(console.log.bind(console, 'Font'));
  };
  // manifest
  $scope.locationFetch = function(locationUrl) {
    open().location = locationUrl;
  };
  // script
  $scope.scriptFetch = function (scriptUrl) {
    var script = document.createElement('script');
    script.src = scriptUrl;
    document.documentElement.appendChild(script)
    console.log('script', script);
  };
  // sharedworker
  $scope.sharedWorkerFetch = function(sharedWorkerUrl) {
    console.log('SharedWorker', new SharedWorker(sharedWorkerUrl));
  };
  // worker
  $scope.workerFetch = function(workerUrl) {
    console.log('Worker', new Worker(workerUrl));
  };
  // XMLHttpRequest
  function logXhrProgress(prefix, target) {
    var events = ['loadstart', 'progress', 'abort', 'error', 'load', 'timeout', 'loadend', 'readystatechange'];
    for (var i=0; i<events.length; i++) {
      target.addEventListener(events[i], console.log.bind(console, prefix + events[i]));
    }
  };
  $scope.xhrFetch = function(xhrMethod, xhrUrl, xhrAsync, xhrUsername, xhrPassword, xhrHeader, xhrTimeout, xhrWithCredentials, xhrData) {
    var xhr = new XMLHttpRequest;
    xhr.open(xhrMethod, xhrUrl, xhrAsync===true, xhrUsername?xhrUsername:undefined, xhrPassword?xhrPassword:undefined);
    for (header in xhrHeader) {
      xhr.setRequestHeader(header, xhrHeader[header]);
    }
    if (xhrAsync)
      xhr.timeout = xhrTimeout * 1;
    xhr.withCredentials = xhrWithCredentials === true;
    logXhrProgress('XHR.upload.', xhr.upload);
    logXhrProgress('XHR.', xhr);
    xhr.send(xhrData);
  };
});

sdcGithub.config(['$routeProvider', '$sceDelegateProvider', function($routeProvider, $sceDelegateProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'partials/index.html',
      controller: 'IndexCtrl'
    }).
    when('/service-worker', {
      templateUrl: 'partials/service-worker.html',
      controller: 'ServiceWorkerCtrl'
    }).
    otherwise({
      redirectTo: '/'
    });
  // allow all URLs as resource URLs
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
}]);
