## cf-worker-saml-proxy-okta-auth0


This demonstrates using a proxy at the Okta SAML ACS Url to re route the SAML Response to an Auth0 ACS/SP. 
For this setup Okta has been setup with a vanity url. proxy is CF.

#### Wrangler

You can use [wrangler](https://github.com/cloudflare/wrangler) to run this sample locally using 

```
wrangler dev index.js
```

Once you are ready, you can publish your code by running the following command:

```
wrangler publish index.js
```
