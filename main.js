$(document).ready(function(){
    $.ajax({
        url: 'https://swapi.co/api/films',
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
            /* var showMore=$('<div class="show-more">Show more</div>'); */
            header.html(data.results[i].title);
            h3.append(header);
            cardcontent.append(createP('Release date:','paragraf left'));
            cardcontent.append(createP(convertDate(data.results[i].release_date),'paragraf border-bottom right'));
            cardcontent.append(createP('Number of characters:','paragraf left'));
            cardcontent.append(createP(data.results[i].characters.length,'paragraf border-bottom right'));
            cardcontent.append(createP('Opening crawl:','paragraf left'));
            cardcontent.append(createP(replaceBr(data.results[i].opening_crawl),'paragraf border-bottom big-text-less right'));
            /* cardcontent.append(showMore); */
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
                /* $('.big-text-more').addClass('big-text-less').removeClass('big-text-more').animate({'height': '120px'},1000); */
                tempL.removeClass('big-text-less').addClass('big-text-more').animate({'height': h},1000); 
                /* $('.show-more').animate({'top': h},1000);  */
                tempL.removeAttr('title').attr({title: "Show less."});
            }
            else if(tempL.hasClass('big-text-more')){
                tempL.removeClass('big-text-more');
                tempL.addClass('big-text-less').animate({'height': '120px'},1000);
                /* $('.show-more').animate({'top': '283px'},1000); */
                tempL.removeAttr('title').attr({title: "Show more."});
            }
        });
        $('.card').mouseleave(function(){
            $('.big-text-more').addClass('big-text-less').removeClass('big-text-more').animate({'height': '120px'},1000);
            $('.big-text-less').removeAttr('title').attr({title: "Show more."});
            /* $('.show-more').css('top','283px').show().slideUp(1000);
            $('.show-more').removeAttr('background-color'); */
        });
        /* $('.big-text-less').mouseenter(function() {
            var temp=$(this);
            var button=$('.show-more');
            button.css('top','283px').hide().slideDown(1000);
            button.css('background-color','#62B000');

          }); */
          $('#switch').click(function(){
            $('#switch').toggleClass("switchOn");
            $('input[type="text"]').animate({width: 'toggle'},1000);
            const lightsaber = $('#switch');
            if($('#switch').hasClass('switchOn')){
                $('input[type="text"]').val('');
                lightsaber.click(turnOn);
            }
            /* function turnOff(e) {
                const tempoff = document.createElement('audio');
                tempoff.src = 'http://soundbible.com/grab.php?id=482&type=wav';//turn off
                tempoff.play();
            } */
            function turnOn(e) {
                const tempon = document.createElement('audio');
                tempon.src = 'http://soundbible.com/grab.php?id=19&type=wav';//turn on
                tempon.volume= 0.5;
                tempon.play();
            }
          });
          $('#searchButton').click(function(){
            var searchText=$('[name="search"]').val();
            $.ajax({
                url: 'https://swapi.co/api/people/',
                type: 'GET',
                data: {
                    'search': searchText
                },
                success: function(response){
                    $('#overlay').show();
                    createSearchCard(response);
                    $('body').css('overflow','hidden');
                    $('body').click(function(){
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
            h3.html('SEARCH CARD');
            header.append(h3);
            var countsearch=data.count;
            if((data.results[0]===undefined)||countsearch==0){
                cardcontent.append(createP('No results!!!','paragraf border-bottom right'));
            }    
            else{
                if(countsearch>10){
                    countsearch=10;
                }
                for(var i=0;i<countsearch;i++){
                    cardcontent.append(createP(data.results[i].name,'paragraf border-bottom right'));
                }
            }
            
            $('#search-card').append(header).append(cardcontent);
            $('#search-card').show();
            }
          });
          
    };
    
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