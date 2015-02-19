var express = require('express');
var router = express.Router();
var request = require('request');
request = request.defaults({jar: true})

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


router.post('/bitbucket', function (req, res, next) {
    var userMap = {
        'nidheeshdas': 'root',
        'Sruthikv': 'Sruthi_KV',
        'sajma': 'Sajma_TV',
        'Krishnapriya110': 'Krishnapriya',
        'hashbeer': 'Hashbeer_A_P',
        'harsharajan': 'Harsha_Rajan',
        'nirandas': 'Nirandas_Thavorath'
    };

    var payload = req.body.payload;

    payload = decodeURI(payload);

    payload = JSON.parse(payload);
    var runAs = userMap[payload.user];
    if (payload.commits) {
        for (var i = 0; i < payload.commits.length; i++) {
            var bburl = payload.canon_url + payload.repository.absolute_url;
            var commit = payload.commits[i];
            var comment = runAs + ': [' + commit.node + '|' + bburl + 'commits/' + commit.raw_node + '] - ' + commit.message;

            var regex = /[A-Z]{3}-[0-9]*/g;
            var issueIds = [];
            while ((issueId = regex.exec(commit.message)) != null) {
                issueIds.push(issueId[0]);
            }


            //https://bitbucket.org/thavorath/shipper-marketplace/commits/05815c0e038fd49d9ef234fb070ebd3c50ca7fca
            // console.log(bburl, commit, comment, issueId, ytUrl);
            request.post('https://thavorath.myjetbrains.com/youtrack/rest/user/login', {
                form: {
                    login: 'root',
                    password: 'Youtrack#32'
                }
            }, function (err, res1) {
                console.log(JSON.stringify(err));
                for (var i = 0; i < issueIds.length; i++) {
                    var issueId = issueIds[i];
                    var ytUrl = 'https://thavorath.myjetbrains.com/youtrack/rest/issue/execute/' + issueId + '?command=comment&runAs=' + runAs + '&comment=' + encodeURIComponent(comment);
                    request.post(ytUrl, {}, function (err, res2) {
                        console.log(JSON.stringify(err), JSON.stringify(res2));

                        //res.send(res2);
                    });
                    console.log(ytUrl);
                }
            });
            res.send('ok');

        }
    }
});

module.exports = router;
