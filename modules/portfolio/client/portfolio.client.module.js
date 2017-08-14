'use strict';

// register the modules
ApplicationConfiguration.registerModule('portfolio', ['core']);
ApplicationConfiguration.registerModule('portfolio.services');
ApplicationConfiguration.registerModule('portfolio.routes', ['core.routes']);