'use strict';

// register the modules
ApplicationConfiguration.registerModule('dashboard', ['core']);
ApplicationConfiguration.registerModule('dashboard.services');
ApplicationConfiguration.registerModule('dashboard.routes', ['core.routes']);