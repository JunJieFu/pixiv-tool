import { tag, WeElement, h } from "omi";
import { myService, pixivService } from "src/assets/script/service";
import * as css from "./_index.less";
import "@omim/core/text-field";
import TextField from "@omim/core/text-field";
import * as $ from "jquery";
import heightenUtil from "src/assets/script/util/heighten";
import { PixivDetail, PixivTagDetail } from "src/assets/constant/custom_type";

@tag("pixiv-collect")
export default class extends WeElement {
  static css = css;
  type = true;
  errorAmount = 0;
  currentAmount = 0;
  loading = false;
  $interval: TextField;
  $insertStartPageIndex: TextField;
  $insertEndPageIndex: TextField;

  collectTag = async () => {
    let tagTaskList = await myService.listTagTask();
    const interval = parseInt(this.$interval.mdc.value);
    this.loading = true;
    for (let tagTask of tagTaskList.data) {
      try {
        if (!this.loading) {
          return;
        }
        let html = await pixivService.collect(tagTask.pixivId);
        await myService.save(this.getPixivObject(html));
        this.currentAmount++;
      } catch (e) {
        this.errorAmount++;
      } finally {
        await heightenUtil.sleep(interval * 1000);
        this.update();
      }
    }
  };

  getPixivObject(html: string) {
    let sourceObject = JSON.parse(
      $(html)
        .filter((_, item: HTMLElement) => item.id === "meta-preload-data")
        .attr("content")
    );

    let picture: PixivDetail =
      sourceObject.illust[Object.keys(sourceObject.illust)[0]];
    if (!picture) {
      throw Error("picture为空?");
    } else {
      return {
        pixivId: picture.id,
        name: picture.title,
        userName: picture.userName,
        userId: picture.userId,
        tagString: picture.tags.tags
          .map((item: PixivTagDetail) => {
            if (item.translation && item.translation.en) {
              return item.translation.en;
            }
            return item.tag;
          })
          .join("|"),
      };
    }
  }

  getText() {
    const html: string = `
    <!DOCTYPE html>
    <html lang="zh-CN"xmlns:wb="http://open.weibo.com/wb"><head><meta name="viewport" content="width=1366"><link rel="shortcut icon" type="image/vnd.microsoft.icon" href="https://www.pixiv.net/favicon.ico"><title>#ココア ご注文はオトナココアですか？⑱ - KS的插画 - pixiv</title><link rel="canonical" href="https://www.pixiv.net/artworks/84445628"><link rel="alternate" hreflang="ja" href="https://www.pixiv.net/artworks/84445628"><link rel="alternate" hreflang="en" href="https://www.pixiv.net/en/artworks/84445628"><meta property="twitter:card" content="summary_large_image"><meta property="twitter:site" content="@pixiv"><meta property="twitter:url" content="https://www.pixiv.net/artworks/84445628?ref=twitter_photo_card"><meta property="twitter:title" content="ご注文はオトナココアですか？⑱"><meta property="twitter:description" content="※うさぎぴょんぴょん"><meta property="twitter:image" content="https://embed.pixiv.net/decorate.php?illust_id=84445628"><meta property="twitter:app:name:iphone" content="pixiv"><meta property="twitter:app:id:iphone" content="337248563"><meta property="twitter:app:url:iphone" content="pixiv://illusts/84445628"><meta property="twitter:app:name:ipad" content="pixiv"><meta property="twitter:app:id:ipad" content="337248563"><meta property="twitter:app:url:ipad" content="pixiv://illusts/84445628"><meta property="twitter:app:name:googleplay" content="pixiv"><meta property="twitter:app:id:googleplay" content="jp.pxv.android"><meta property="twitter:app:url:googleplay" content="pixiv://illusts/84445628"><meta property="og:site_name" content="pixiv"><meta property="fb:app_id" content="140810032656374"><meta property="og:title" content="#ココア ご注文はオトナココアですか？⑱ - KS的插画 - pixiv"><meta property="og:type" content="article"><meta property="og:image" content="https://embed.pixiv.net/decorate.php?illust_id=84445628"><meta property="og:description" content="※うさぎぴょんぴょん"><meta name="description" content="この作品 「ご注文はオトナココアですか？⑱」 は 「ココア」「ご注文はうさぎですか?」 等のタグがつけられた「KS」さんのイラストです。 「※うさぎぴょんぴょん」"><script async src="https://stats.g.doubleclick.net/dc.js"></script><script>var _gaq = _gaq || [];_gaq.push(['_setAccount', 'UA-1830249-3']);_gaq.push(['_setDomainName', 'pixiv.net']);_gaq.push(['_setCustomVar', 1, 'login', 'yes', 3]);_gaq.push(['_setCustomVar', 3, 'plan', 'normal', 1]);_gaq.push(['_setCustomVar', 5, 'gender', 'male', 1]);_gaq.push(['_setCustomVar', 6, 'user_id', "17225384", 1]);_gaq.push(['_setCustomVar', 11, 'lang', "zh", 1]);_gaq.push(['_setCustomVar', 12, 'illustup_flg', 'not_uploaded', 3]);_gaq.push(['_setCustomVar', 13, 'user_id_per_pv', "17225384", 3]);_gaq.push(['_setCustomVar', 27, 'p_ab_d_id', "336674574", 3]);_gaq.push(['_setCustomVar', 29, 'default_service_is_touch', 'no', 3]);</script><meta id="meta-pixiv-tests" name="pixiv-tests" content='{"dashboard_dev":true,"dashboard_hidden_edit_button":true,"lemon":true,"novel_series_glossary_phase2":true,"recommend_tutorial_20191213":true,"touch_ad_lazyload":true,"touch_manga_translation_enabled":true,"uiux_www_seo_message":true,"title_caption_translation":true,"www_toppage_renewal_manga_dev":true,"www_toppage_renewal_phase_2_dev":true,"touch_recommend_related_infinite":true,"toggles":{"toggle_novel_series_glossary_phase2":true,"toggle_novel_series_glossary_phase3":true,"toggle_novel_presenbattle":true,"toggle_novel_flow_for_series_in_upload_page":true,"premium_register_first_month_free_campaign_for_long_term_plan":true,"title_caption_translation":true,"touch_enable_manga_translation":true}}'><link rel="stylesheet" href="https://s.pximg.net/www/js/build/vendors~pixiv~spa~stacc3.c7003ce10448b631ee6a.css" crossorigin="anonymous"><link rel="stylesheet" href="https://s.pximg.net/www/js/build/spa.12558de495a490c0e05a.css" crossorigin="anonymous"><script src="https://s.pximg.net/www/js/build/runtime.b211ac2225143c768aab.js" charset="utf8" crossorigin="anonymous"defer></script><script src="https://s.pximg.net/www/js/build/vendors~pixiv~spa~stacc3.fb03c1300f2819088ae8.js" charset="utf8" crossorigin="anonymous"defer></script><script src="https://s.pximg.net/www/js/build/spa.1c18bab76392117988e7.js" charset="utf8" crossorigin="anonymous"defer></script><link rel="preload" as="script" href="https://s.pximg.net/www/js/build/moment-zh.a1ee0dd38f1637aa292f.js" crossorigin="anonymous"><script>
            console.log("%c"+"/* pixiv Bug Bounty Program */","color: #0096fa; font-weight: bold;");
        console.log("We have a bug bounty program on HackerOne. \nIf you find a vulnerability in our scope, please report it to us.");
        console.log("https://hackerone.com/pixiv");
    </script><link rel="apple-touch-icon" sizes="180x180" href="https://s.pximg.net/common/images/apple-touch-icon.png?20200601"><link rel="manifest" href="/manifest.json"><link rel="alternate" type="application/json+oembed" href="https://www.pixiv.net/oembed/?url=https%3A%2F%2Fwww.pixiv.net%2Fartworks%2F84445628"><meta name="global-data" id="meta-global-data" content='{"token":"228d2b565f66eb19ddd5d07b9cb49273","services":{"booth":"https://api.booth.pm","sketch":"https://sketch.pixiv.net","vroidHub":"https://hub.vroid.com","accounts":"https://accounts.pixiv.net/"},"oneSignalAppId":"b2af994d-2a00-40ba-b1fa-684491f6760a","publicPath":"https://s.pximg.net/www/js/build/","commonResourcePath":"https://s.pximg.net/common/","development":false,"userData":{"id":"17225384","pixivId":"q245142637","name":"下雨的北纬23","profileImg":"https://i.pximg.net/user-profile/img/2018/11/08/23/47/14/14993385_53903d853df579c42e2932fc60c44127_50.png","profileImgBig":"https://i.pximg.net/user-profile/img/2018/11/08/23/47/14/14993385_53903d853df579c42e2932fc60c44127_170.png","premium":false,"xRestrict":2,"adult":true,"safeMode":false,"illustCreator":false,"novelCreator":false},"adsData":null,"miscData":{"consent":{"gdpr":true},"grecaptcha":{"siteId":"6LfJ0Z0UAAAAANqP-8mvUln2z6mHJwuv5YGtC8xp"},"info":{"id":"6203","title":"「剑与远征」插画比赛正式开始！","createDate":"2020-09-18 12:00:00"},"isSmartphone":false},"premium":{},"mute":[]}'><meta name="preload-data" id="meta-preload-data" content='{"timestamp":"2020-09-22T18:35:43+09:00","illust":{"84445628":{"illustId":"84445628","illustTitle":"ご注文はオトナココアですか？⑱","illustComment":"※うさぎぴょんぴょん","id":"84445628","title":"ご注文はオトナココアですか？⑱","description":"※うさぎぴょんぴょん","illustType":0,"createDate":"2020-09-18T04:01:23+00:00","uploadDate":"2020-09-18T04:01:23+00:00","restrict":0,"xRestrict":0,"sl":4,"urls":{"mini":"https://i.pximg.net/c/48x48/img-master/img/2020/09/18/13/01/23/84445628_p0_square1200.jpg","thumb":"https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/09/18/13/01/23/84445628_p0_square1200.jpg","small":"https://i.pximg.net/c/540x540_70/img-master/img/2020/09/18/13/01/23/84445628_p0_master1200.jpg","regular":"https://i.pximg.net/img-master/img/2020/09/18/13/01/23/84445628_p0_master1200.jpg","original":"https://i.pximg.net/img-original/img/2020/09/18/13/01/23/84445628_p0.jpg"},"tags":{"authorId":"649747","isLocked":false,"tags":[{"tag":"ココア","locked":true,"deletable":false,"userId":"649747","translation":{"en":"心爱"},"userName":"KS"},{"tag":"ご注文はうさぎですか?","locked":true,"deletable":false,"userId":"649747","translation":{"en":"请问您今天要来点兔子吗？"},"userName":"KS"},{"tag":"保登心愛","locked":true,"deletable":false,"userId":"649747","translation":{"en":"保登心爱"},"userName":"KS"},{"tag":"大人化","locked":true,"deletable":false,"userId":"649747","translation":{"en":"成人化"},"userName":"KS"},{"tag":"マシュマロおっぱい","locked":false,"deletable":true,"translation":{"en":"柔软大胸"}},{"tag":"佐倉綾音","locked":false,"deletable":true},{"tag":"ご注文はココアパイですか?","locked":false,"deletable":true,"translation":{"en":"请问您今天要来点心爱吗？"}},{"tag":"ウサギになりたい","locked":false,"deletable":true}],"writable":true},"alt":"#ココア ご注文はオトナココアですか？⑱ - KS的插画","storableTags":["j0ZJDxtRJJ","GX5cZxE2GY","lQGtQGMEhM","VEiAizbUWi","5RvyKm3yea","DrSbXW-sS7","PshW6PBrER","t07QCafHfV"],"userId":"649747","userName":"KS","userAccount":"xephyr26","userIllusts":{"84445628":{"illustId":"84445628","illustTitle":"ご注文はオトナココアですか？⑱","id":"84445628","title":"ご注文はオトナココアですか？⑱","illustType":0,"xRestrict":0,"restrict":0,"sl":4,"url":"https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/09/18/13/01/23/84445628_p0_square1200.jpg","description":"※うさぎぴょんぴょん","tags":["ココア","ご注文はうさぎですか?","保登心愛","大人化","マシュマロおっぱい","佐倉綾音","ご注文はココアパイですか?","ウサギになりたい"],"userId":"649747","userName":"KS","width":992,"height":1403,"pageCount":2,"isBookmarkable":true,"bookmarkData":{"id":"9379564046","private":false},"alt":"#ココア ご注文はオトナココアですか？⑱ - KS的插画","isAdContainer":false,"titleCaptionTranslation":{"workTitle":null,"workCaption":null},"createDate":"2020-09-18T13:01:23+09:00","updateDate":"2020-09-18T13:01:23+09:00"},"84295647":{"illustId":"84295647","illustTitle":"ご注文はオトナココアですか？⑰","id":"84295647","title":"ご注文はオトナココアですか？⑰","illustType":0,"xRestrict":0,"restrict":0,"sl":2,"url":"https://i.pximg.net/c/250x250_80_a2/img-master/img/2020/09/11/13/26/51/84295647_p0_square1200.jpg","description":"","tags":["ココア","保登心愛","ご注文はうさぎですか?","大人化","即ルパンダイブ","おへそ","透けブラ","魅惑の谷間","オトナココア","極上の女体"],"userId":"649747","userName":"KS","width":992,"height":1403,"pageCount":2,"isBookmarkable":true,"bookmarkData":{"id":"9287846090","private":false},"alt":"#ココア ご注文はオトナココアですか？⑰ - KS的插画","isAdContainer":false,"titleCaptionTranslation":{"workTitle":null,"workCaption":null},"createDate":"2020-09-11T13:26:51+09:00","updateDate":"2020-09-11T13:26:51+09:00","profileImageUrl":"https://i.pximg.net/user-profile/img/2013/02/15/03/23/28/5828613_db98be2839c67d3c1e646eac5c2740c7_50.jpg"},"84149137":null,"83983923":null,"83830221":null,"83670295":null,"83501301":null,"83352070":null,"83183207":null,"83031752":null,"82878433":null,"82722641":null,"82580733":null,"82423484":null,"82264483":null,"82131052":null,"82048036":null,"81796802":null,"80512128":null,"80387799":null,"80221924":null,"77242785":null,"76565298":null,"75618588":null,"74695359":null,"74328018":null,"74278065":null,"73665215":null,"70204109":null,"69549036":null,"68384543":null,"68258819":null,"68206674":null,"68164957":null,"66970271":null,"64741556":null,"63089772":null,"62487952":null,"62386944":null,"62341494":null,"62145352":null,"61443155":null,"61232830":null,"60851428":null,"60661260":null,"60540378":null,"60008853":null,"58828762":null,"57170462":null,"56713695":null,"56278582":null,"55269833":null,"54215771":null,"53722005":null,"52894627":null,"51789898":null,"51343690":null,"51103486":null,"50682851":null,"50567368":null,"49837060":null,"49755053":null,"49733611":null,"49627178":null,"49598107":null,"49132055":null,"48732526":null,"48668570":null,"48448467":null,"47955970":null,"47908117":null,"47746772":null,"47583925":null,"47365633":null,"46784593":null,"46068577":null,"45910813":null,"45651972":null,"45507291":null,"44277537":null,"43883923":null,"43311728":null,"43086642":null,"42539821":null,"42395218":null,"42333423":null,"42309371":null,"42279104":null,"42198198":null,"41960659":null,"41639096":null,"41301816":null,"41138959":null,"40813449":null,"40516485":null,"40359633":null,"39442493":null,"39261880":null,"39225493":null,"39194638":null,"37031711":null,"33560389":null,"33075764":null,"31377066":null,"27816128":null,"27660444":null,"27385944":null,"26677349":null,"26672768":null,"25121914":null,"20906901":null,"19942670":null,"18416435":null,"18146131":null,"17357395":null,"17237279":null,"16817255":null,"16054197":null,"15322975":null,"15291053":null,"13384550":null,"12705661":null,"12257759":null,"12257016":null,"8108059":null},"likeData":false,"width":992,"height":1403,"pageCount":2,"bookmarkCount":8548,"likeCount":6554,"commentCount":44,"responseCount":0,"viewCount":35927,"isHowto":false,"isOriginal":false,"imageResponseOutData":[],"imageResponseData":[],"imageResponseCount":0,"pollData":null,"seriesNavData":null,"descriptionBoothId":null,"descriptionYoutubeId":null,"comicPromotion":null,"fanboxPromotion":null,"contestBanners":[],"isBookmarkable":true,"bookmarkData":{"id":"9379564046","private":false},"contestData":null,"zoneConfig":{"responsive":{"url":"https://pixon.ads-pixiv.net/show?zone_id=illust_responsive&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6fuc40eqq5&amp;num=5f69c56f900&amp;p=1"},"rectangle":{"url":"https://pixon.ads-pixiv.net/show?zone_id=illust_rectangle&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6fx3vyg4lc&amp;num=5f69c56f905&amp;p=1"},"500x500":{"url":"https://pixon.ads-pixiv.net/show?zone_id=bigbanner&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6fz0u33334&amp;num=5f69c56f775&amp;p=1"},"header":{"url":"https://pixon.ads-pixiv.net/show?zone_id=header&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6g14v7r4r2&amp;num=5f69c56f276&amp;p=1"},"footer":{"url":"https://pixon.ads-pixiv.net/show?zone_id=footer&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6g3x5cqame&amp;num=5f69c56f215&amp;p=1"},"expandedFooter":{"url":"https://pixon.ads-pixiv.net/show?zone_id=multiple_illust_viewer&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6g6p897dtt&amp;num=5f69c56f420&amp;p=1"},"logo":{"url":"https://pixon.ads-pixiv.net/show?zone_id=logo_side&amp;format=js&amp;s=1&amp;up=0&amp;a=25&amp;ng=g&amp;l=zh&amp;uri=%2Fartworks%2F_PARAM_&amp;is_spa=1&amp;K=258c615223148&amp;ab_test_digits_first=40&amp;yuid=NHOFl1g&amp;suid=Pgizkas6g92usqihk&amp;num=5f69c56f983&amp;p=1"}},"extraData":{"meta":{"title":"#ココア ご注文はオトナココアですか？⑱ - KS的插画 - pixiv","description":"この作品 「ご注文はオトナココアですか？⑱」 は 「ココア」「ご注文はうさぎですか?」 等のタグがつけられた「KS」さんのイラストです。 「※うさぎぴょんぴょん」","canonical":"https://www.pixiv.net/artworks/84445628","alternateLanguages":{"ja":"https://www.pixiv.net/artworks/84445628","en":"https://www.pixiv.net/en/artworks/84445628"},"descriptionHeader":"本作「ご注文はオトナココアですか？⑱」为附有「ココア」「ご注文はうさぎですか?」等标签的插画。","ogp":{"description":"※うさぎぴょんぴょん","image":"https://embed.pixiv.net/decorate.php?illust_id=84445628","title":"#ココア ご注文はオトナココアですか？⑱ - KS的插画 - pixiv","type":"article"},"twitter":{"description":"※うさぎぴょんぴょん","image":"https://embed.pixiv.net/decorate.php?illust_id=84445628","title":"ご注文はオトナココアですか？⑱","card":"summary_large_image"}}},"titleCaptionTranslation":{"workTitle":null,"workCaption":null},"isUnlisted":false,"request":null}},"user":{"649747":{"userId":"649747","name":"KS","image":"https://i.pximg.net/user-profile/img/2013/02/15/03/23/28/5828613_db98be2839c67d3c1e646eac5c2740c7_50.jpg","imageBig":"https://i.pximg.net/user-profile/img/2013/02/15/03/23/28/5828613_db98be2839c67d3c1e646eac5c2740c7_170.jpg","premium":false,"isFollowed":true,"isMypixiv":false,"isBlocking":false,"background":null,"sketchLiveId":null,"partial":0,"acceptRequest":false,"sketchLives":[]}}}'>
    </head><body><div id='root'></div><script>'use strict';var dataLayer = [{login: 'yes',gender: "male",user_id: "17225384",lang: "zh",illustup_flg: 'not_uploaded',premium: 'no',default_service_is_touch: 'no',}];</script>
    <!-- Google Tag Manager -->
    <noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-55FG"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    '//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-55FG');</script>
    <!-- End Google Tag Manager -->
    </body></html>`;
    let sourceObject = JSON.parse(
      $(html)
        .filter((_, item: HTMLElement) => item.id === "meta-preload-data")
        .attr("content")
    );

    let picture: PixivDetail =
      sourceObject.illust[Object.keys(sourceObject.illust)[0]];
    if (!picture) {
      throw Error("picture为空?");
    } else {
      return {
        pixivId: picture.id,
        name: picture.title,
        userName: picture.userName,
        userId: picture.userId,
        tagString: picture.tags.tags
          .map((item: PixivTagDetail) => {
            if (item.translation && item.translation.en) {
              return item.translation.en;
            }
            return item.tag;
          })
          .join("|"),
      };
    }
  }

  insert = async () => {
    const startPageIndex = parseInt(this.$insertStartPageIndex.mdc.value);
    const endPageIndex = parseInt(this.$insertEndPageIndex.mdc.value);
    const interval = parseInt(this.$interval.mdc.value);
    if (
      !isNaN(startPageIndex) &&
      !isNaN(endPageIndex) &&
      startPageIndex <= endPageIndex
    ) {
      for (let i = startPageIndex; i <= endPageIndex; i++) {
        const result = await pixivService.listBookmarks(i);
        await myService.insert(result.body);
        await heightenUtil.sleep(interval * 1000);
      }
    }
  };

  render = () => {
    return (
      <div>
        <p>
          <m-text-field
            label="间隔时间"
            outlined
            value={5}
            ref={(e: TextField) => (this.$interval = e)}
          />
        </p>
        <hr />
        <p>采集坐标：{this.currentAmount}</p>
        <p>采集异常数：{this.errorAmount}</p>
        <p>
          <m-button ripple dense raised onClick={this.collectTag}>
            采集标签
          </m-button>
          <m-button
            ripple
            dense
            raised
            onClick={() => (this.loading = false)}
            style="margin-left:10px"
          >
            停止
          </m-button>
        </p>
        <hr />
        <p>
          <m-text-field
            label="开始页数"
            outlined
            ref={(e: TextField) => (this.$insertStartPageIndex = e)}
          />
          <m-text-field
            style="margin-left:10px"
            label="结束页数"
            outlined
            ref={(e: TextField) => (this.$insertEndPageIndex = e)}
          />
        </p>
        <p>
          <m-button ripple dense raised onClick={this.insert}>
            采集收藏
          </m-button>
          <m-button ripple dense raised onClick={this.getText}>
            测试
          </m-button>
        </p>
      </div>
    );
  };
}
