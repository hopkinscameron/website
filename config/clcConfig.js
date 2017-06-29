'use strict';

// chalk for console logging
var clc = require('cli-color');
    
var clcConfig = {
    error: clc.redBright,
    warn: clc.yellowBright,
    success: clc.greenBright,
    info: clc.magentaBright,
    log: clc.blueBright
};

module.exports = clcConfig;