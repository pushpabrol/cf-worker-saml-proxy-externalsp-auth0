// Note: change this URL to point to the OHTTP target.
addEventListener('fetch', event  =>  {
  event.respondWith(handleRequest(event.request))
})



/**
 * Handle relayed requests.
 * @param {Request} request
 */
function handleRequest(request) {

  // Handle all other requests as relay requests
  handleRelayRequest(request)
}

async function handleRelayRequest(request) {
  // Check method type and Content-Type header
  if (request.method != 'POST') {
    return  fetch(request);
  }

  // Forward the request
  const response =  fetch("https://oidc-tests.auth0.com/login/callback?connection=pse-addons", {
    method: 'POST',
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    body: request.body,
  })


  return response;
}