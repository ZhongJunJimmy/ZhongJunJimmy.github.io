// JavaScript Document

var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
  directionsDisplay = new google.maps.DirectionsRenderer();
  var styleArray = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ff4400"
            },
            {
                "saturation": -68
            },
            {
                "lightness": -4
            },
            {
                "gamma": 0.72
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#0077ff"
            },
            {
                "gamma": 3.1
            }
        ]
    },
    {
        "featureType": "poi.business",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#44ff00"
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "saturation": -64
            },
            {
                "hue": "#ff9100"
            },
            {
                "lightness": 16
            },
            {
                "gamma": 0.47
            },
            {
                "weight": 2.7
            }
        ]
    },
    {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
                "lightness": -48
            },
            {
                "hue": "#ff5e00"
            },
            {
                "gamma": 1.2
            },
            {
                "saturation": -23
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "hue": "#00ccff"
            },
            {
                "gamma": 0.44
            },
            {
                "saturation": -33
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "hue": "#007fff"
            },
            {
                "gamma": 0.77
            },
            {
                "saturation": 65
            },
            {
                "lightness": 99
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "gamma": 0.11
            },
            {
                "weight": 5.6
            },
            {
                "saturation": 99
            },
            {
                "hue": "#0091ff"
            },
            {
                "lightness": -86
            }
        ]
    }
];
  var map;
  var markersArray = []; //瞄點陣列
  var myLatLng = new google.maps.LatLng(25.045510, 121.517403); //預設地圖位置
  var mapOptions = {
    zoom: 12, //地圖Zoom
    center: myLatLng,
	styles: styleArray,
	mapTypeControlOptions: {
	mapTypeIds: [google.maps.MapTypeId.ROADMAP]
    },
	/* 設定Zoom Bar位置* */
	zoomControl: true,
    zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE,
    position: google.maps.ControlPosition.LEFT_TOP
    },
	/* 設定小黃人街景服務位置* */
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
    position: google.maps.ControlPosition.LEFT_TOP
    }
  };
  /* 地圖Div設定* */
  var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));
  
  <!--google.maps.event.addDomListener(window, 'load', initialize);-->
  
  /* 各景點介紹的錨點圖設定* */
  var image = new google.maps.MarkerImage('1349748546_location_pin.png', new google.maps.Size(40, 40), new google.maps.Point(0, 0), new google.maps.Point(0, 0));
  /* 景點的錨點圖設定(飯店logo)* */
  var image2 = new google.maps.MarkerImage('images/logo_map.png', new google.maps.Size(151, 86), new google.maps.Point(0, 0), new google.maps.Point(75, 86));//調整logo位置 高度除2
  /* 點擊地圖關閉景點訊息框* */
  google.maps.event.addListener(map, 'click', function () {
    infowindow.close();
  });
  /* 各景點訊息框大小設定* */
  //var infowindow; 
  var infowindow = new google.maps.InfoWindow(
  {size: new google.maps.Size(300, 700)});

  $(".CheckCount").click(function () {
	var CheckVal = $(this).val();
	var checkSplit = CheckVal.split(",");
	var Lat = checkSplit[0];
	var Lng = checkSplit[1];
	var contentString = $(this).attr("google_title");
	var HideBanner = $(this).attr('hidebanner');
	var HideBannerAnimate = $(this).attr('hidebanneranimate');
	var ShowBanner = $(this).attr('showbanner');
	var ShowBannerAnimate = $(this).attr('showbanneranimate');
	var BannerTime = $(this).attr('bannertime');

	
	if ($(this).prop("checked")) {
	    createMarker(Lat, Lng, contentString , { HideBanner: HideBanner , HideBannerAnimate: HideBannerAnimate , ShowBanner: ShowBanner , ShowBannerAnimate: ShowBannerAnimate, BannerTime: BannerTime });
		} else {
		/* 在要刪除指定座標前，先把勾選的座標帶入MapAPI轉換後的座標(帶入的座標跟帶出的座標有差異)* */
		var myLatLng = new google.maps.LatLng(Lat, Lng);
		DeleteMarker(myLatLng);
		}
  });
  <!--在地圖上建立錨點座標Function-->
  function createMarker(lat, Lng, contentString, json) {
  var myLatLng = new google.maps.LatLng(lat, Lng);
  var marker = new google.maps.Marker({
    position: myLatLng,
    center:myLatLng,
	map: map,
	icon: image,
	clickable: true,
  });
  markersArray.push(marker);
  google.maps.event.addListener(marker, 'click', function () {
   infowindow.setContent(contentString);
   infowindow.open(map, marker);

    var maptemp = this.getMap(),
    div = maptemp.getDiv();
    maptemp.panTo(this.getPosition());
    maptemp.panBy((div.offsetWidth/5), 0);
  //map.panTo(new google.maps.LatLng(lat, ( Lng +20)));
    //map.panTo(marker.center);
  //map.setCenter({lat: -34, lng: 151});

        $('.' + json.HideBanner).each(function(){

            if ( $(this).hasClass(json.ShowBanner) ){
                var ShowBannerSplit = json.ShowBannerAnimate.split(';');
                var ShowBannerDetailSplit;
                var ShowBannerAnimate = '';
                for ( var i = 0 ; i < ShowBannerSplit.length ; i++)
                {
                    ShowBannerDetailSplit = ShowBannerSplit[i].split(':');
                    if ( ShowBannerDetailSplit.length == 2 )
                        ShowBannerAnimate += ( ShowBannerDetailSplit[0].length > 0 &&  ShowBannerDetailSplit[1].length > 0 ) ? ( ShowBannerDetailSplit[0] + ':' + '\'' +  ShowBannerDetailSplit[1] + '\'' + ',' ) : '' ;
                }
                ShowBannerAnimate = ShowBannerAnimate.length > 0 ?  ShowBannerAnimate.substring(0,ShowBannerAnimate.length -1) : ShowBannerAnimate;
               
                if ( ShowBannerAnimate.length > 0 ){
                    eval( '$(this).animate({' + ShowBannerAnimate + '},' + json.BannerTime + ');');
                }
            }else{
                var HideBannerSplit = json.HideBannerAnimate.split(';');
                var HideBannerDetailSplit;
                var HideBannerAnimate = '';
                for ( var i = 0 ; i < HideBannerSplit.length ; i++)
                {
                    HideBannerDetailSplit = HideBannerSplit[i].split(':');
                    if ( HideBannerDetailSplit.length == 2 )
                        HideBannerAnimate += ( HideBannerDetailSplit[0].length > 0 &&  HideBannerDetailSplit[1].length > 0 ) ? ( HideBannerDetailSplit[0] + ':' + '\'' +  HideBannerDetailSplit[1] + '\'' + ',' ) : '' ;
                }
                HideBannerAnimate = HideBannerAnimate.length > 0 ?  HideBannerAnimate.substring(0,HideBannerAnimate.length -1) : HideBannerAnimate;
               
                if ( HideBannerAnimate.length > 0 ){
                    eval( '$(this).animate({' + HideBannerAnimate + '},' + json.BannerTime + ');');
                }
            }

        });

  });
  //勾選後立即顯示景點資訊框
  google.maps.event.trigger(marker, "click");
  }
			
  function createMarker2(lat, Lng, contentString) {
  var myLatLng = new google.maps.LatLng(lat, Lng);
  var marker = new google.maps.Marker({
	position: myLatLng,
	map: map,
	icon: image2,
	clickable: true
  });
  markersArray.push(marker);
  google.maps.event.addListener(marker, 'click', function () {
  infowindow.setContent(contentString);
  //infowindow.open(map, marker);
  });
  //勾選後立即顯示其訊息
  google.maps.event.trigger(marker, "click");
  }
			
  <!--刪除在地圖上指定座標描點-->
  function DeleteMarker(CheckVal) {
	for (var i = 0; i < markersArray.length; i++) {
	//將所取消選取的座標與存在於地圖內陣列座標做分析
	if ($.trim(markersArray[i]["position"]) == $.trim(CheckVal)) {
		markersArray[i].setMap(null);
		markersArray[i].length = 0;
			}
		}
	}
  <!--設定Marker2位置(飯店Logo)-->
  function doFirstCheck() {
  /*t1.checked = true;*/
  var Lat = "25.045510";
  var Lng = "121.517403";
  var contentString = "";
  createMarker2(Lat, Lng, contentString);
  }
  doFirstCheck();

  /*var control = document.getElementById('control');
  control.style.display = 'block';
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(control);*/
}
  <!--路線規劃起始點與終點設定-->
  function calcRoute() {
	var selectedMode = document.getElementById('mode').value;
	
	var start = document.getElementById('start').value;
  	var end = document.getElementById('end').value;
	var request = {
    origin: start,
    destination: end,
	
	travelMode: google.maps.TravelMode[selectedMode]
    /*travelMode: google.maps.TravelMode.DRIVING*/
  };
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}
google.maps.event.addDomListener(window, 'load', initialize);


