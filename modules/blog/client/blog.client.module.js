'use strict';

// register the modules
ApplicationConfiguration.registerModule('blog', ['core']);
ApplicationConfiguration.registerModule('blog.services');
ApplicationConfiguration.registerModule('blog.routes', ['core.routes']);