importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open( STATIC_CACHE )
        .then( cache => {
            cache.addAll( APP_SHELL );
        });

    const cacheInmutable = caches.open( INMUTABLE_CACHE )
        .then( cache => {
            cache.addAll( APP_SHELL_INMUTABLE );
        });
    
    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', e => {
   
    // borrar caches static que ya no se usan
    const cachesStatic = caches.keys().then(keys => {
        keys.forEach( key => {
            if( key.includes('static') && key !== STATIC_CACHE )
            {
                return caches.delete(key);
            }

        });
    });

    const cachesInmutable = caches.keys().then(keys => {
        keys.forEach( key => {
            if( key.includes('inmutable') && key !== INMUTABLE_CACHE )
            {
                return caches.delete(key);
            }

        });
    });


    e.waitUntil( Promise.all([cachesStatic, cachesInmutable]) );
});

self.addEventListener('fetch', e => {

    const response = caches.match( e.request ).then(
        resp => {
            if(resp){
                return resp;
            } 
            else
            {
                return fetch( e.request )
                    .then(newResp => {
                        return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newResp );
                    });
            }
        });

    e.respondWith( response );
})


