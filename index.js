/**
 * rawHtmlResponse returns HTML inputted directly
 * into the worker script
 * @param {string} html
 */
function rawHtmlResponse(html) {
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };
  return new Response(html, init);
}

/**
 * readRequestBody reads in the incoming request body
 * Use await readRequestBody(..) in an async function to get the string
 * @param {Request} request the incoming request to read from
 */
async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    // Perhaps some other type of data was submitted in the form
    // like an image, or some other binary data.
    return 'a file';
  }
}

function responseForm(samlResponse, relayState) {
  const newLocation = 'https://oidc-tests.auth0.com/login/callback?connection=pse-addons';

  var rStateHtml = "";
  if (typeof relayState !== 'undefined' && relayState !== null) rStateHtml = `<input type="hidden" name="RelayState" value="${relayState}">`;

  return `
<html lang="en">
<body onload="document.forms[0].submit()">
    <form method="POST" action="${newLocation}">
        <input type="hidden" name="SAMLResponse" value="${samlResponse}">
        ${rStateHtml}
    </form>
</body>
</html>
  `;
}

const testForm = `
  <!DOCTYPE html>
  <html>
  <body>
  <h1>Hello World</h1>
  <p>This is all generated using a Worker</p>
  <form action="" method="post">
    <div>
      <label for="SAMLResponse">SAMLResponse</label>
      <input name="SAMLResponse" id="SAMLResponse" value="Response">
    </div>
    <div>
      <label for="RelayState">RelayState</label>
      <input name="RelayState" id="RelayState" value="state">
    </div>
    <div>
      <button>Start</button>
    </div>
  </form>
  </body>
  </html>
  `;

async function handleRequest(request) {
  const reqBody = await readRequestBody(request);
  const jsonBody = JSON.parse(reqBody);
  const samlResponse = jsonBody["SAMLResponse"];
  const relayState = jsonBody["RelayState"];

  const form = responseForm(samlResponse, relayState);
  console.log(form);
  return new Response(form, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    }
  });
}

addEventListener('fetch', event => {
  const { request } = event;
  const { url } = request;

  if (request.method === 'GET' && url.includes('testform')) {
    return event.respondWith(rawHtmlResponse(testForm));
  }

  if (request.method === 'POST') {
    return event.respondWith(handleRequest(request));
  } else if (request.method === 'GET') {
    return fetch(request);
  }
});
