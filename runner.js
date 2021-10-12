const newman = require('newman'),
    fs = require('fs');
fs.truncate('./response.json', 0, function () { console.log('clean-up') });
const request = require('postman-request');
let counter = 1;
newman.run({
    collection: require('./TrueLayer_Test_Challenge.postman_collection.json'),
	iterationData: require('./test_data/data.json'),
    //environment: require('./env.json'),
    reporters: ['cli','junit'],
    insecure: true,
    reporter: {
        junit: {
            export: './test_results/test-results.xml',
        }
    },
},process.exit)
.on('request', function (error, args) {
    if (error) {
        console.error(error);
    }
    else {
        
        fs.appendFile('./response_output/response.json', args.response.stream + "\r\n\n", function (error) {
            if (error) {
                console.error(error);
            }

        });
    }

}).on('done', function (err, summary) {
    if (err || summary.run.failures.length) {
        if (err) {
            console.error(err)
        }
        summary.run.failures.forEach(element => {
            console.error("------------------------------------------")
            console.error(element.source.name)
            console.error(element.error.name)
            console.error(element.error.message)
        });
        console.error("------------------------------------------")
        
        console.error('collection run encountered an error.');
        process.exit(1);
    }
    else {
        console.log('collection run completed.');
    }
});