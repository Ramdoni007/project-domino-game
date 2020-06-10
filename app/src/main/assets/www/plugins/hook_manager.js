/**
	GRADLE - KNOWLEDGE IS POWER
	***** PROPRIETARY CODE *****
	@author : gradle (gradlecode@outlook.com)
	@update: 02/07/2019 12:39:00
	@version_name: gradle-logic
	@version_code: v6.0.0
	copyright @2012-2020
*/

var gradle = gradle || {
	//Ready : /!\ DO NOT CHANGE, ONLY IF YOU ARE AN EXPERT.
	//=========================
	adsType  : 'admob',
	debug    : true,

	isMobile : ( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) ),

	log : function(val){
		if(typeof val === 'object' && typeof val.isTrusted!='undefined' && val.isTrusted==false) return;
		gradle.debug && console.log( gradle.isMobile && (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val );
	},

	first_start: true,
	start: function(){
		//ok
		lime.embed("openfl-content", 0, 0, null);
		setTimeout(function(){gradle.hideSplash();}, 3000);
	},
	processBackbutton : function(){ //return null;
		var key=null;
		/*if(typeof game.state.getCurrentState().key!='undefined'){
			key = game.state.getCurrentState().key;
			switch(key){
				case 'MainMenuState':
					key=null;
					break;
				case 'SelectPictureState':
					game.state.start('MainMenuState');
					break;
				case 'GameState':
					game.state.start('MainMenuState');
					break;
			}
		}*/
		return key;
	},
	process: function(ev, msg){
		gradle.log(ev);
		if(gradle.first_start && ev=='SCREEN_HOME'){gradle.hideSplash();return !1;}
		/*switch(ev){
			case 'main_menu':
				//document.body.style.backgroundImage = "url('images/bg_menu.jpg')";
				break;
			case 'list_picture':
				//document.body.style.backgroundImage = "url('images/bg_select.jpg')";
				break;
			case 'draw_image':
				//document.body.style.backgroundImage = "url('images/bg_game.jpg')";
				break;
		}*/
		if(gradle.isMobile && typeof cordova!='undefined'){
			cordova.plugins.firebase.analytics.logEvent("event", {param1: ev});
		}
		return !0;
	},
	onVisibilityNo : function(){
		gradle.log('visibility no');
		//gradle_onPauseRequested();
	},
	onVisibilityYes : function(){
		gradle.log('visibility yes');
		//gradle_onResumeRequested();
	},











	//Ready : /!\ DO NOT CHANGE, ONLY IF YOU ARE AN EXPERT.
	//=========================
	ready: function() {
		gradle.log('gradle ready ...');
		gradle.prepareAds();
		gradle.addEventBackbutton();
		document.addEventListener("pause", gradle.onVisibilityNo, false);
		document.addEventListener("resume", gradle.onVisibilityYes, false);
		gradle.event('first_start');
		gradle.start();
		//document.body.addEventListener('load', function () {
		//}, false);

	},

	prepareAds: function(){
		if(gradle.adsType=='facebook'){
			gradle.prepareFb();
		}
		else if(gradle.adsType=='admob'){
			gradle.prepareAdmob();
		}
	},
	
	showInter: function(){
		if(gradle.adsType=='facebook'){
			gradle.showInterFb();
		}
		else if(gradle.adsType=='admob'){
			gradle.showInterAdmob();
		}
	},
	
	enableMoreGames   : true,
	more: function(){
		(gradle.developer_link!=="")&&window.open(gradle.developer_link);
	},

	hideSplash: function(){
		if(gradle.isMobile && typeof cordova!='undefined'){
			cordova.exec(null, null, "SplashScreen", "hide", []);
		}
		gradle.first_start=false;
	},

	addEventBackbutton : function(){
		if(gradle.notifiBackbutton){
			document.addEventListener("backbutton", function() {
				if(gradle.processBackbutton()==null){
					navigator.notification.confirm(gradle.notifiMessage, function(buttonIndex){
						if(buttonIndex == 1) {
							//navigator.app.exitApp();
							cordova.plugins.exit();
							return true;
						}
						else {
							return false;
						}
					});
				}
			}, !1);
		}
	},

	run : function(){
		gradle.isMobile ? document.addEventListener('deviceready', gradle.ready, false) :  gradle.ready();
	},

	trackStats: function(a, b){
		gradle.event(a, b);
	},

	trackScreen: function(a,b){
		gradle.event(a,b);
	},

	trackEvent: function(a,b){
		gradle.event(a,b);
	},

	showAd: function(){
		gradle.event('showAd');
	},

	__: function(t){
		return t;
	},

	currentInterval : 0,
	unlock_all_levels : false,
	checkInterval: function(){
		return (++gradle.currentInterval==gradle.intervalAds) ? !(gradle.currentInterval=0) : !1;
	},

	saveImage: function(base64Data){
		var imageData = base64Data.replace(/data:image\/png;base64,/,'');
		cordova.exec(
			function(msg){
				navigator.notification.alert(gradle.saveImageSuccess, function(buttonIndex){
					if(buttonIndex == 1) {
						navigator.app.exitApp();
						return true;
					}
					else {
						return false;
					}
				},gradle.dialogTitleSaveImg);
				console.log(msg);
			},
			function(err){
				navigator.notification.alert(gradle.saveImageFailed, function(buttonIndex){
					if(buttonIndex == 1) {
						navigator.app.exitApp();
						return true;
					}
					else {
						return false;
					}
				},gradle.dialogTitleSaveImg);
				console.log(err);
			},
			"Base64SaveImage","saveImageDataToLibrary",
			[imageData]
		);
	},

	buildKey : function(key){
		return "gd.4024."+key;
	},

	getStorage: function(key, default_value){
		var value;
		try {
			value = localStorage.getItem(gradle.buildKey(key));
		}
		catch(error){
			return default_value;
		}
		if(value !== undefined && value !=null){
			value = window.atob(value);
		}
		else{
			value = default_value;
		}
		return value;
	},

	setStorage: function(key, value){
		var v = value;
		if(v !== undefined){
			v = window.btoa(v);
		}
		try{
			localStorage.setItem(gradle.buildKey(key), v);
			return value;
		}
		catch(error){
			return undefined;
		}
	}

	
};




