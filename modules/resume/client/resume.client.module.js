'use strict';

// register the modules
ApplicationConfiguration.registerModule('resume', ['core']);
ApplicationConfiguration.registerModule('resume.services');
ApplicationConfiguration.registerModule('resume.routes', ['core.routes']);