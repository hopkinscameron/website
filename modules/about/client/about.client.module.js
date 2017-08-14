'use strict';

// register the modules
ApplicationConfiguration.registerModule('about', ['core']);
ApplicationConfiguration.registerModule('about.services');
ApplicationConfiguration.registerModule('about.routes', ['core.routes']);