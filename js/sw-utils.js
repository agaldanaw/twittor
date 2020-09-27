//guardar en el cache dinamico
function actualizaCacheDinamico(
    dynamicCache, request, resp)
{
    if(resp.ok)
    {
        // hay data para almacenar
       return caches.open( dynamicCache )
            .then( cache => {
                cache.put(request, resp.clone() );
                return resp.clone();
            });
    }
    else
    {
        return resp;
    }
}