gradle = {...gradle,...{/**
GRADLE - KNOWLEDGE IS POWER
***** PROPRIETARY CODE *****
@author : gradle (gradlecode@outlook.com)
@update: 02/07/2019 12:39:00
@version_name: gradle-logic
@version_code: v6.0.0
copyright @2012-2020
*/
    
	//Ads information
	//===============
	banner             : 'ca-app-pub-3940256099942544/6300978111', //id placement banner
    interstitial       : 'ca-app-pub-3940256099942544/1033173712', //id placement interstitial
	
    isTesting          : false, //Ads mode testing. set to false for a production mode.
    enableBanner       : true, //Ads enable the banner. set to false to disable the banner.
    enableInterstitial : true, //Ads enable the interstitial. set to false to disable all interstitials.

    bannerAtBottom     : true, //if false the banner will be at top
    overlap            : false,

	notifiBackbutton   : true, //for confirmation backbutton
	notifiMessage      : 'Do you want to exit the game ?',

	intervalAds        : 1,     //Ads each interval for example each n times
	
	fullsize		   : true,


	//Events manager :
	//================
    event: function(ev, msg){ gradle.process(ev,msg);switch(ev){
		
		case 'first_start':   //First start
			//gradle.showInter();
			break;
		case 'EVENT_LEVELSTART': //Button play
			gradle.showInter();
			break;
		case 'EVENT_LEVELRESTART':
			gradle.checkInterval() && gradle.showInter(); // <-- we check the interval if ok we show interstitial
			break;
		case 'oveer_button_back':
			//gradle.showInter();
			break;
		case 'SCREEN_GAMERESULT':
			//gradle.showInter();
			break;
		case 'SCREEN_PAUSE':
			//gradle.showInter();
		case 'EVENT_VOLUMECHANGE':
			//gradle.showInter();
			break;
		case 'SCREEN_CREDITS':
			//gradle.showInter();
			break;
		case 'test':
			//gradle.checkInterval() && gradle.showInter();
			break;		
			
    }}
	
}};

gradle.run();


