var Future = Npm.require('fibers/future');
var url = Npm.require('url');
var CAS = Npm.require('cas');

var _casCredentialTokens = {};

if (Meteor.settings.cas && !!Meteor.settings.cas.relaxSSL) {
  console.log("** DISABLING SSL CERTIFICATE VERIFICATION **");

  // SSL certificate verification can be disabled for dev environments
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

var casTicket = function (ticket, token, site) {

  var fut = new Future();
  // get configuration
  if (!Meteor.settings.cas && !Meteor.settings.cas.validate) {
    console.log("accounts-cas: unable to get configuration");
    return;
  }

  var casSiteID = Meteor.settings.cas.namespace ? Meteor.settings.cas.namespace + "$" + site : site;
  var cas = new CAS({
    base_url: [Meteor.settings.cas.baseUrl, casSiteID].join("/"),
    service: [Meteor.absoluteUrl().replace(/\/+$/, ""), "cas", site, token].join("/")
  });

  cas.validate(ticket, function(err, status, username) {
    if (err) {
      console.log("accounts-cas: error when trying to validate " + err);
    } else {
      if (status) {
        var siteUser = [username, casSiteID].join("@");
        console.log("accounts-cas: user validated " + siteUser);
        _casCredentialTokens[token] = { id: siteUser };
      } else {
        console.log("accounts-cas: unable to validate " + ticket);
      }
    }
    fut.return("done");
  });

  fut.wait();

  return;
};

/*
 * Register a server-side login handle.
 * It is call after Accounts.callLoginMethod() is call from client.
 *
 */
 Accounts.registerLoginHandler(function (options) {
  if (!options.cas)
    return undefined;

  casTicket(options.cas.ticket, options.cas.credentialToken, options.cas.site);

  if (!_hasCredential(options.cas.credentialToken)) {
    throw new Meteor.Error(Accounts.LoginCancelledError.numericError,
      'no matching login attempt found');
  }

  var result = _retrieveCredential(options.cas.credentialToken);
  var data = { profile: { name: result.id } };
  var user = Accounts.updateOrCreateUserFromExternalService("cas", result, data);
  return user;
});

var _hasCredential = function(credentialToken) {
  return _.has(_casCredentialTokens, credentialToken);
};

/*
 * Retrieve token and delete it to avoid replaying it.
 */
var _retrieveCredential = function(credentialToken) {
  var result = _casCredentialTokens[credentialToken];
  delete _casCredentialTokens[credentialToken];
  return result;
};