$(document).ready(function(){
    $.ajax({
        url: 'https://swapi.dev/api/films',
        type: 'GET',
        success: function(response){
            createCard(response);
        },
        error: function(error){
            console.log('error', error);
        }
    });
    var createCard = function(data){
        var wrapper=$('<div class="container"></div>');
        for(var i=0; i<data.count; i++){
            var card=$('<div class="card p-3 mb-5 bg-dark rounded"></div>');
            var cardcontent=$('<div class="content"></div>');
            var header=$('<div class="header left"></div>');
            var h3=$('<h3></h3>');
            header.html(data.results[i].title);
            h3.append(header);
            cardcontent.append(createP('Release date:','paragraf left'));
            cardcontent.append(createP(convertDate(data.results[i].release_date),'paragraf border-bottom right'));
            cardcontent.append(createP('Number of characters:','paragraf left'));
            cardcontent.append(createP(data.results[i].characters.length,'paragraf border-bottom right'));
            cardcontent.append(createP('Opening crawl:','paragraf left'));
            cardcontent.append(createP(replaceBr(data.results[i].opening_crawl),'paragraf border-bottom big-text-less right'));
            cardcontent.append(createP('Director:','paragraf left'));
            cardcontent.append(createP(data.results[i].director,'paragraf border-bottom right'));
            cardcontent.append(createP('Producer:','paragraf left'));
            cardcontent.append(createP(splitProducers(data.results[i].producer),'paragraf border-bottom right'));
            card.attr('id', i+1);
            $(card).append(h3).append(cardcontent);
            $(wrapper).append(card);
        }
        $(document.body).append(wrapper);
        $('.big-text-less').click(function(){
            var tempL=$(this);
            var text=$('.big-text-less');
            var h=text[0].scrollHeight;
            if(tempL.hasClass('big-text-less')){
                tempL.animate({'height': h},1000).removeClass('big-text-less').addClass('big-text-more');
                //tempL.removeClass('big-text-less').animate({'height': h},1000).addClass('big-text-more');
                tempL.removeAttr('title').attr({title: "Show less."});
            }
            else if(tempL.hasClass('big-text-more')){
                tempL.removeClass('big-text-more');
                tempL.addClass('big-text-less').animate({'height': '120px'},1000);
                tempL.removeAttr('title').attr({title: "Show more."});
            }
        });
        $('.card').mouseleave(function(){
            $('.big-text-more').addClass('big-text-less').removeClass('big-text-more').animate({'height': '120px'},1000);
            $('.big-text-less').removeAttr('title').attr({title: "Show more."});
        });
          $('#switch').click(function(){
            $('#switch').toggleClass("switchOn");
            $('input[type="text"]').animate({width: 'toggle'},1000);
            const lightsaber = $('#switch');
            if($('#switch').hasClass('switchOn')){
                $('input[type="text"]').val('');
                lightsaber.click(turnOn);
            }
            function turnOn(e) {
                const tempon = document.createElement('audio');
                tempon.src = 'https://soundbible.com/grab.php?id=19&type=wav';//turn on
                tempon.volume= 0.5;
                tempon.play();
            }
          });
          $('#searchButton').click(function(){
            var searchText=$('[name="search"]').val();
            $.ajax({
                url: 'https://swapi.dev/api/people/',
                type: 'GET',
                /* beforeSend: function(){
                    $('#searchLoad').show();
                }, */
                complete: function(){
                    setTimeout(function(){ 
                    $('#searchLoad').fadeOut(1000,function(){$('#searchLoad').hide();});
                    $('#search-card').slideDown(1000);
                }, waitTime);

                },
                data: {
                    'search': searchText
                },
                success: function(response){
                    $('#overlay').show();
                    $('#searchLoad').show();
                    createSearchCard(response);
                    waitTime=response.count*80;
                    if(waitTime>4000){
                        waitTime=0;
                    }else{
                        waitTime=3500;
                    }
                    $('body').css('overflow','hidden');
                    $('#overlay').click(function(){
                        $('#overlay').hide();
                        $('body').css('overflow','auto');
                        $('#search-card').hide();  //hide searchcard--code
                        $('#search-card').html('');
                    });
                    $(document).keyup(function(e) {
                        if (e.keyCode == 27) {
                        $('#overlay').hide();
                        $('body').css('overflow','auto');
                        $('#search-card').hide();  //hide searchcard--code
                        $('#search-card').html('');
                       }
                   });
                    
                },
                error: function(error){
                    console.log('error', error);
                }
            });
            function createSearchCard(data){
            
            var cardcontent=$('<div id="search-content"></div>');
            var header=$('<div class="header left"></div>');
            var h3=$('<h3>SEARCH CARD</h3>');
            var temp=data;
            h3.html('SEARCH CARD');
            header.append(h3);
            var countsearch=data.count;

            if((data.results[0]===undefined)||countsearch==0){
                cardcontent.append(header).append(createP('No results!!!','paragraf border-bottom right'));
            }
            else{
                if(countsearch>10){
                    imena=[];
                    ajaxArray(data);
                    imena.sort();
                    for(var i=0;i<imena.length;i++){
                        cardcontent.append(createP(imena[i],'paragraf border-bottom right'));
                    }
                    /* countsearch=10; */
                }
                else{
                    for(var i=0;i<countsearch;i++){
                        cardcontent.append(createP(data.results[i].name,'paragraf border-bottom right'));
                    }
                }
            }
            $('#search-card').append(header).append(cardcontent);/* 
            $('#search-card').show(); */
            }
          });
    };
    var imena=[];
    var waitTime=0;
    function ajaxArray(data){
        var test=[];
        if(data.results==undefined){
            return;
        }
        var nextPage=data.next;
        $.ajax({
            url: nextPage,
            async: false,
            type: 'GET',
            success: function(response){
                for(var i=0;i<data.results.length;i++){
                    imena.push(data.results[i].name);
                }
                nextPage=response.next;
                ajaxArray(response);
                
            },
            error: function(error){
                console.log('error', error);
            }
        });
    }
    var createP=function(text, style){
        var temp=$('<p></p>');
        temp.html(text);
        temp.addClass(style);
        return temp;
    };
    var convertDate=function(date){
        var userDate = date;
        var date_string = moment(userDate, "YYYY-MM-DD").format("DD.MM.YYYY.");
        return date_string;
    };
    var replaceBr=function(text){
        var temp = text;
        temp = temp.replace(/\r\n/g,"<br/>");
        return temp;
    };
    var splitProducers=function(text){
        /* return temp=text.replace(', ','<br/>'); */
        var temp=text;
        for(var i=0;i<text.length;i++){
            temp=temp.replace(', ','<br/>');
        }
        return temp;
    };
});
