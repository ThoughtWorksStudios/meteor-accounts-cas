atoy40:accounts-cas
===================

CAS login support.

## Usage

put CAS settings in Meteor.settings (for exemple using METEOR_SETTINGS env or --settings) like so:

```
"cas": {
	"baseUrl": "https://sso.univ-pau.fr/cas/",
 	"autoClose": true
},
"public": {
	"cas": {
		"loginUrl": "https://sso.univ-pau.fr/cas/login",
		"serviceParam": "service"
	}
}
```

This happens entirely server-side.
Integration using routes for traditional login flow: more details to come.
