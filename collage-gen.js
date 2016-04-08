;
var testmode = 1; //TEST MODE STATUS: 0="OFF", ANY OTHER - "OFF"
$(window).load(function(){
	mainFunc();
	if(!(testmode===0))	testFunc();
});

var mainFunc = function () {

	// TEST SECTION
		//$("#div-selected-width").spinner();
	// /TEST SECTION

	// CLICK EVENTS
	$("#import1-button").click(function () { var codeText = $("#import1-html").val(); $("#viewer").html(codeText); });

	$("#add-div-button").click(function () { addNewDiv(); setMargin(); printCode(); });

	$("#remove-selected-div-button").click(function(){ $(".selected-div").remove(); setMargin(); printCode(); });

	$("#deselect-button").click(function(){ $(".selected-div").removeClass("selected-div"); printCode(); });

	//Добавляем класс выделения и передаем параметры выделенного div или img в форму(div#toolbar > form). При этом обращение к полям идет напрямую через их id
	$("#viewer").on( "click", ".colage-div",  function() {

		$(".selected-div").removeClass('selected-div');

		$(this).addClass('selected-div');

		var divWidth = $(this).width();	$("#div-selected-width").val(divWidth);
		var divHeight = $(this).height(); $("#div-selected-height").val(divHeight);
		var divFloat = ($(this).css('float')=='left') ? 1 : ''; $('#float-select').val(divFloat);
		var divUrl = ($(this).attr('src'));	$('#div-selected-url').val(divUrl);
		var divHref = $(this).parent().attr('href'); $('#div-selected-href').val(divHref);

		printCode();
	});

	$("#clear-all-button").click(function(){ $("#viewer .colage-div").remove(); applySettings(); printCode();  });

	//Меняем местами выделенный элемент с предыдущим
	$("#switch-prev").click(function(){

		if($(".selected-div")[0])
		{
			if($(".selected-div").hasClass("gal-linked")) {

				var prevDivObj = $(".selected-div").parent().prev();
				$(".selected-div").parent().after(prevDivObj);
			}

			else {
				var prevDivObj = $(".selected-div").prev();
				$(".selected-div").after(prevDivObj);
			}
		}

	});

	//Меняем местами выделенный элемент со следующим
	$("#switch-next").click(function(){

		if($(".selected-div")[0])
		{
			if($(".selected-div").hasClass("gal-linked")) {
				var nextDivObj = $(".selected-div").parent().next();
				$(".selected-div").parent().before(nextDivObj);
			}

			else {
				var nextDivObj = $(".selected-div").next();
				$(".selected-div").before(nextDivObj);
			}
		}
	});

	// FOCUS EVENTS
	$("#div-selected-width").focus(function(){ /* applySettings(); */ $(this).data("prevWidth", $(this).val()) });
	$("#div-selected-height").focus(function(){ /* applySettings(); */ $(this).data("prevHeight", $(this).val()) });

	//CHANGE EVENTS
	$('div#toolbar > form').children().change(function() {

		if ( ($("#selected-div-keep-proportion").prop('checked'))) {

			if (($(this).children().attr('id'))=='div-selected-width') {

				var divSelectedHeight = $("#div-selected-height").val();
				var divSelectedWidth = $("#div-selected-width").val();
				var divSelectedWidthPrev = $(this).children().data("prevWidth");

				var scaleProp = divSelectedWidth / divSelectedWidthPrev;

				divSelectedHeight *= scaleProp;

				divSelectedHeight = Math.round(divSelectedHeight);

				$("#div-selected-height").val(divSelectedHeight);
			}

			else if (($(this).children().attr('id'))=='div-selected-height') {

				var divSelectedHeight = $("#div-selected-height").val();
				var divSelectedWidth = $("#div-selected-width").val();
				var divSelectedHeightPrev = $(this).children().data("prevHeight");

				var scaleProp = divSelectedHeight / divSelectedHeightPrev;

				divSelectedWidth *= scaleProp;

				divSelectedWidth = Math.round(divSelectedWidth);


				$("#div-selected-width").val(divSelectedWidth);
			}
		}
		applySettings();
	});

 //end of main
};

var addNewDiv =  function() {

	var buildCode='<div class="colage-div" style="width:' + $("#div-selected-width").val() + 'px; height:' + $("#div-selected-height").val() + 'px; "></div>';
	$("#viewer").append(buildCode);

	setMargin(); printCode();
};

// ФУНКЦИЯ ПРИМЕНЕНИЯ НАСТРОЕК К ЭЛЕМЕНТУ В ПРОСМОТРЩИКЕ (VIEWER)
function applySettings() {

	var selDiv = $(".selected-div"); // Определяем текущий выделенный объект во viewer

	//Делаем изображением, если указан url картинки
	if ($("input#div-selected-url").val()) {

		selDiv.replaceWith('<img src="'+  $("input#div-selected-url").val() +'" class="'+ selDiv.attr('class')  +'" />');
		selDiv = $("img.selected-div");
	}

	else { }

	//Вкладываем выбранный элемент в ссылку, если указан HREF
	if ($("input#div-selected-href").val()) {

		if(selDiv.hasClass("gal-linked")) {
			selDiv.parent().attr('href', $("input#div-selected-href").val());
		}

		else {
			selDiv.addClass("gal-linked");
			selDiv.replaceWith('<a href="'+  $("input#div-selected-href").val() +' "  >' + selDiv[0].outerHTML  + ' </a> ');
			$("#viewer").on("click", "a", function(){ event.preventDefault(); }); //Делаем ссылку в просмотрщике некликабельной
			selDiv = $("a > .selected-div");
		}
	} else {   }


	var divWidth = $("#div-selected-width").val();
	var divHeight = $("#div-selected-height").val();
	var divFloat = $('#float-select').val() ? 'left' : 'right';
	selDiv.css({'width': divWidth+'px', 'height' : divHeight+'px', 'float' : divFloat });

}

//УБИРАЕМ ОТСТУПЫ ОТ ОТ КРАЕВ ВНЕШНЕГО КОНТУРА
var setMargin = function() {

	$(".colage-div").each(function(){
		//console.log('it works');
		//var posObj = $(this).offset();

		var viewerPosObj = $("#viewer").offset();
		var viewerBorderSize = parseInt($("#viewer").css("border-left-width"));
		var marginSize = 10;

		var limitLeft = viewerPosObj.left + viewerBorderSize + marginSize;
		var limitRight = limitLeft + $("#viewer").width(); limitRight-=2*marginSize;
		var limitTop = viewerPosObj.top +viewerBorderSize + marginSize;


		//console.log( 'Limits: ' + limitLeft + ' -- ' + limitRight );
		//$("body").append('<div style="position:absolute; background-color: red; left: '+ limitLeft  +'px; width:'+ (limitRight-limitLeft) +'px; height:10px; "></div>');

		// КОРРЕКТИРУЕМ ПО ГОРИЗОНТАЛИ
		if ($(this).offset().left <= limitLeft ) { $(this).css('margin-left', '0'); }  else { $(this).css('margin-left', marginSize+'px');  }

		if (($(this).offset().left + ($(this).width())) >= limitRight) { $(this).css('margin-right','0px');  } else { $(this).css('margin-right', marginSize+'px');  }

		if((parseInt($(this).css("margin-left")) == 0 ) && ($(this).offset().left > limitLeft )) { $(this).css( "margin-right" , "0" ); $(this).css('margin-left', marginSize+'px'); }

		//КОРРЕКТРУЕМ ПО ВЕРТИКАЛИ

		if ($(this).offset().top <= limitTop) { $(this).css('margin-top', '0');  } else { $(this).css('margin-top', marginSize+'px'); }

	});
};

//Вывыод html кода получившегося коллажа
var printCode = function(){
	//HERE GONNA BE RULES TO MAKE THIS TEXT RELIABLE TO PASTE IN WP SUCH AS REMOVE SELECTED CLASS
	var resultCode = $("#viewer").html();
	//console.log(resultCode);
	resultCode = resultCode.replace(/( )*selected\-div/, '');

	$("#result-code").text('<!-- Начало кода --->' + "\n"  + resultCode + "\n" + '<!-- КОНЕЦ КОДА  -->');

};

//ФУНКЦИЯ, ПРЕДНАЗНАЧЕННАЯ ДЛЯ ТЕСТИРОВАНИЯ СКРИПТА. АВТОМАТИЧЕСКИ ВЫЗЫВАЕТ ТЕСТОВЫЕ СОБЫТИЯ И ПР..
var testFunc = function() {
	console.log('Test mode: ON!');

	var testDivAmmount = 10;

	/* function getRandomColor()
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
	    }
		return color;
	} */

	var clickDivs = function(current, total){
		var start = 0;

		if(start<current){
			var currentObj=document.getElementById("viewer").childNodes[ Math.abs(total-current) ];
			currentObj.click();
		//	currentObj.style.backgroundColor=getRandomColor();
			current-=1;
			setTimeout(function(){ clickDivs(current, total);  }, 40);
	 	}

		else if (total<50) { setTimeout( function(){ oneClickObj(document.getElementById("add-div-button"), testDivAmmount, testDivAmmount, total); }  ,70);  }

		else { $("#viewer").append('<h3>It\'s DONE</h3>');  }

	}


	var oneClickObj = function(obj, current, total, totalDivAdded){
			var start = 0;

			if(start<current) {
				obj.click();
				totalDivAdded++;
				console.log(obj);
				current-=1;
				setTimeout(function(){oneClickObj(obj, current, total, totalDivAdded);}, 70);
			}

			else { clickDivs(totalDivAdded, totalDivAdded); }
	};

	//oneClickObj(document.getElementById("add-div-button"), testDivAmmount, testDivAmmount, 0);


	//SOME TEST

	var numberOfClicks = 15;

	var clickObject = function(obj, numberOfClicks, callback) {
		var interval = 300;

		var timeFunc = function(){
			var totalDelay=0,
				currentInterval=0;

			return function(interval,callback){
				if(totalDelay===0){ totalDelay=currentInterval=interval; }
				setTimeout(function(){ obj.click(); if(callback){ callback();} }, totalDelay )
				totalDelay+=currentInterval;
				if(callback){ totalDelay=0; currentInterval=0; }
			}
	}();

		for(i=0;i<numberOfClicks;i++){
			if(i!=numberOfClicks-1) timeFunc(interval);
			else timeFunc(interval, callback);

		}
	}

	clickObject(document.getElementById("add-div-button"), numberOfClicks, function(){ setTimeout(function(){$("#viewer").append( '<h1>It\'s callback time</h1>'  );},300); });

};
