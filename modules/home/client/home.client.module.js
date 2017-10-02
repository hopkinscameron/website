'use strict';

// register the modules
ApplicationConfiguration.registerModule('home', ['core']);
ApplicationConfiguration.registerModule('home.services');
ApplicationConfiguration.registerModule('home.routes', ['core.routes']);