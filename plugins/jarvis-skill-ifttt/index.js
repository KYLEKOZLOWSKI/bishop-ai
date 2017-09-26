var request = require('request');

var Ifttt = function (config) {
    this.key = config.key;

    this.intent = [];
    this.triggers = {};
    this.examples = [];
    this.context = {};

    // Bind to the intent containing event to be called
    var triggerFunction = function (dfd) {
        self.makeCall(this.event);

        if (this.response) {
            dfd.resolve(this.response);
        } else {
            dfd.resolve();
        }
    };

    var self = this;
    if (config.eventIntents) {
        var i;
        var intent;
        for (i = 0; i < config.eventIntents.length; i++) {
            intent = config.eventIntents[i];

            this.intent.push({
                value: intent.value,
                trigger: "ifttt." + intent.event
            });
            this.triggers[intent.event] = triggerFunction.bind(intent);

            this.examples.push(intent.value);
        }
    }
};

Ifttt.prototype.makeCall = function (event) {
    var uri = 'https://maker.ifttt.com/trigger/' + event + '/with/key/' + this.key;
    request(uri);
};

module.exports = {
    namespace: 'ifttt',
    type: 'SKILL',
    register: function (config) {
        return new Ifttt(config);
    }
};