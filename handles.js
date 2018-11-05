const url = require('url');
const querystring = require('querystring')

const NAME = 'maxime';
const head = 
    '<head>'+
        '<meta charset="utf8"/>'+
        '<title>TP1 : Hello</title>'+
    '</head>';

module.exports = {
    serverHandle: function (req, res) {
        //Route
        const path = url.parse(req.url).pathname;
        console.log('Path: ' + path);
        //Parameters
        const params = querystring.parse(url.parse(req.url).query);
        console.log('Parameters: ' + JSON.stringify(params));

        //Route / : explains how /hello works
        if(path === '/') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(
                '<!DOCTYPE html>'+
                '<html>'+
                    head +
                    '<body>'+
                        '<h1>Fonctionnement</h1>'+
                        '<h2>/</h2> Affiche cette page.'+
                        '<h2>/hello</h2>'+
                        '<ul>'+
                            '<li><a href="/hello">Pas de paramètre</a> : affiche "Hello"</li>'+
                            '<li><a href="/hello?name=test"><kbd>?name=...</kbd></a> : affiche "Hello ..."</li>'+
                            '<li><a href="/hello?name=maxime"><kbd>?name=maxime</kbd></a> : affiche une pr&eacute;sentation de l\'auteur</li>'+
                        '</ul>'+
                    '</body>'+
                '</html>'
            );
        }
        //Route /hello : says hello if parameter 'name' is not set, says hello [name] if parameter 'name' is set, displays a short introduction of me if parameter 'name' is set to 'maxime'
        else if(path === '/hello') {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(
                '<!DOCTYPE html>'+
                '<html>'+
                    head +
                    '<body>'+
                       (('name' in params && params['name'] === NAME) ?
                            ('<h1>Maxime Vernusset</h1>'+
                            '<section>'+
                                '<h2>Parcours</h2>'+
                                '&Eacute;tudiant en 5&egrave;me ann&eacute;e d\'&eacute;cole d\'ing&eacute;nieurs (<abbr title="&Eacute;cole Centrale d\'&eacute;l&eacute;ctronique">ECE Paris</abbr>) :'+
                                '<ul>'+
                                    '<li>Majeure : Cybers&eacute;curit&eacute;</li>'+
                                    '<li><abbr title="Option d\'approfondissement">OA</abbr> : Internet Nouvelle G&eacute;n&eacute;ration</li>'+
                                '</ul>'+
                            '</section>'+
                            '<section>'+
                                '<h2>Autre</h2>'+
                                'Tromboniste'+
                            '</section>')
                            : 
                            ('Hello ' + (('name' in params) ? params['name'] : '')))+
                    '</body>'+
                '</html>'
            );
        }
        //Any other routes : sends 404 error code
        else {
            res.writeHead(404, {'Content-Type': 'text/html'});
        }

        res.end();
    }
}
