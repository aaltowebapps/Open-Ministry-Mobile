## Open-Ministry-Mobile

### Online Version

The Online version is offline at the moment because it is not possible to access the API from the client with ember-data.js from a different URL. Cross-site HTTP requests are not allowed.

### Installation guide  - client

1. Download client folder
2. Start REST API (see next point)
3. Change the IP address and port to the one of the API. Settings can be found in /js/app.js -> App.APIurl, App.APIport
3. run index.html in your browser or mobile device simulator (optimized for iPhone 3G/4 and iPad)

### Installation guide - REST API

The rest code is deployed on a herokuapp server. Links to the REST Services can be found on the [`wiki pages`](https://github.com/aaltowebapps/Open-Ministry-Mobile/wiki/API-Documentation).

### Structure of the repository

* client: contains the webpages for the mobile client (singlepages)
* client_old: old structure of the web client (multipages)
* screenshots: screenshots of the client in the iPhone Simulator
* phonegap-android: phoneGap project to test client in an Android Simulator
* phonegap-windows: phoneGap project to test client in a Windows Phone Simulator
* lab3: submitted solution of lab3
* lab4: submitted solution of lab4
* wiki_docs: files for the wiki pages of the repo