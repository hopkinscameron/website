'use strict';

// register the modules
ApplicationConfiguration.registerModule('contact', ['core']);
ApplicationConfiguration.registerModule('contact.services');
ApplicationConfiguration.registerModule('contact.routes', ['core.routes']);