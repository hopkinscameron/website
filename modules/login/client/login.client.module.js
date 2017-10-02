'use strict';

// register the modules
ApplicationConfiguration.registerModule('login', ['core']);
ApplicationConfiguration.registerModule('login.services');
ApplicationConfiguration.registerModule('login.routes', ['core.routes']);