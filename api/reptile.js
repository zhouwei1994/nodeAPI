var request = require('request');
var cheerio = require('cheerio');
var url = 'https://blog.csdn.net/weixin_40614372?orderby=UpdateTime';

function trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
module.exports = function (router) {
    //爬虫CSDN列表
    router.get('/csdn_list', function (req, routerRes) {
        var pageSize = req.query.pageSize || 1;
        var url = "https://blog.csdn.net/weixin_40614372/article/list/" + pageSize;
        var sort = req.query.sort || "";
        var original = req.query.original || 0;
        if (sort && original) {
            url += "?t=1&orderby=" + sort;
        } else if (original) {
            url += "?t=1";
        } else if (sort) {
            url += "?orderby=" + sort;
        }
        //获取页面
        request(url, function (err, res) {
            if (err) {
                routerRes.send(err);
            }
            var $ = cheerio.load(res.body.toString());
            var blogList = [];
            $('.article-list .article-item-box').each(function () {
                var title = $(this).find("h4 a").text().trim().split('\n');
                var url = $(this).find("h4 a").attr('href').trim();
                var content = $(this).find("p").text().trim();
                var time = $(this).find("div.info-box p").eq(0).find("span").text().trim();
                var read = $(this).find("div.info-box p").eq(2).find("span span").text().trim();
                var comment = $(this).find("div.info-box p").eq(4).find("span span").text().trim();
                var articleid = $(this).attr('data-articleid').trim();
                var item = {
                    title: title.length >= 2 ? trim(title[1]) : trim(title[0]),
                    original: title.length >= 2 ? trim(title[0]) : "",
                    url: url,
                    content: content,
                    time: time,
                    read: read,
                    comment: comment,
                    articleid: articleid
                };
                blogList.push(item);
            });
            blogList.splice(0, 1);
            routerRes.send(global.apiInfo(blogList));
        });
    });
    //爬虫-CSDN的详情
    router.get('/csdn_blog_details', function (req, routerRes) {
        var objId = req.query.objId;
        if (objId) {
            var url = "https://blog.csdn.net/weixin_40614372/article/details/" + objId;
            //获取页面
            request(url, function (err, res) {
                if (err) {
                    routerRes.send(err);
                }
                var $ = cheerio.load(res.body.toString());
                var title = $(".title-article").text().trim();
                var content = $(".htmledit_views").html();
                var time = $(".article-info-box .time").text();
                var read = $(".article-info-box .read-count").text();
                routerRes.send(global.apiInfo({
                    title: title,
                    content: content,
                    time: time,
                    read: read,
                }));
            });
        } else {
            routerRes.send(global.apiInfo("", 300, "objId为空"));
        }
    });
}