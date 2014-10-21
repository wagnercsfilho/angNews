var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var Firebase = require('firebase');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Pass to next layer of middleware
    next();
});

app.use(express.static(__dirname+'/dist'));
app.get('/', function(req, res){
		res.sendfile('./dist/index.html');
});

var myRootRef = new Firebase('https://cariocanews.firebaseio.com/posts/');
var json = [];


var reqGlobo = function(cb){
	    var jsonGlobo = [];
		urlGlobo = 'http://g1.globo.com/dynamo/plantao/rio-de-janeiro/1.json';
		request(urlGlobo, function(error, response, html){
			if(!error){
				
				var jsonObject = JSON.parse(html);
				jsonObject.conteudos.forEach(function(element, index){
					var date = new Date(element.primeira_publicacao);
					var image = element.thumbnail || null;

					var obj = {
			          	title: element.titulo,
			          	subtitle: element.subtitulo,
			          	site: 'G1',
			          	thumbnail: image,
			          	date: date,
			          	link: element.permalink
			        };

			        myRootRef.push(obj);
					jsonGlobo.push(obj);
				});


				return cb(jsonGlobo);

			}
		})
	}

var reqExtra = function(cb){
		var jsonExtra = [];
		urlExtra = 'http://extra.globo.com/noticias/rio/plantao.html';;
		request(urlExtra, function(error, response, html){
			if(!error){
				var $ = cheerio.load(html);			

				$('.breaking_news').filter(function(){
			        var data = $(this);
			        var list = data.find('ol li');   

			        list.each(function(index) {
			          var self = $(this)
			          var title = self.children('a');
			          var info = null;
				      var date = null;
				      var image = null;
				      var link = null;

			          if (title.html() !== null){
				          var link  = title.attr('href');

				          if (title.hasClass('img_link')){
				          	image = title.children('img').attr('src');

				          	var text = self.children('.text');
				          	title = text.children('a');
				          	info  = text.children('.info');
				            date = info.children('time').attr('datetime');
				            date = new Date(date);
				          }

				          info  = self.children('.info');
				          date = info.children('time').attr('datetime');
				          date = new Date(date);

				          //objeto
				          var obj = {
				          	title: title.text(),
				          	subtitle: null,
				          	site: 'Extra',
					        thumbnail: image,
					        date: date,
					        link: link
				          }

				          myRootRef.push(obj);
				          jsonExtra.push(obj)

				          
			          }
					});
		        })

				reqGlobo(function(value){
					value.forEach(function(element){
						jsonExtra.push(element);
					});
					//jsonExtra.push(value);
					return cb(jsonExtra);
				});
				
			}
		});
	}



app.get('/scrape', function(req, res){
	
	//setInterval(function(){
	//	reqExtra(function(value){
	//		return true;
	//	});
	//}, 10000);

	reqExtra(function(value){
		value.sort(function(a, b){
			var dateA=new Date(a.date), dateB=new Date(b.date)
			return dateA-dateB //sort by date ascending
		});
		res.json(value);
	});
	
});

app.listen(process.env.PORT || 5000);