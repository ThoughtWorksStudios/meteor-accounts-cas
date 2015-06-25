twstudios:accounts-cas
======================

Multitenant CAS login support. Also supports tenant namespacing if supported by CAS server (e.g. CAS server is shared between environments, such as "dev" and "acceptance-test").

## Usage

put CAS settings in Meteor.settings (for exemple using METEOR_SETTINGS env or --settings) like so:

```
"cas": {
    "baseUrl": "https://sso.cas-server.com/cas",
    "namespace": "staging",
    "relaxSSL": true
},
"public": {
    "cas": {
        "baseUrl": "https://sso.cas-server.com/cas",
        "namespace": "staging",
        "serviceParam": "service"
    }
}
```

This happens entirely server-side.
Integration using routes for traditional login flow: more details to come.

TODO:

* Remove duplicative Meteor.settings to simplify configuration.
