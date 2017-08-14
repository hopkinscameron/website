'use strict';

// register the modules
ApplicationConfiguration.registerModule('logout', ['core']);
ApplicationConfiguration.registerModule('logout.services');
ApplicationConfiguration.registerModule('logout.routes', ['core.routes']);