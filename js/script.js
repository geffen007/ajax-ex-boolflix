$(document).ready(function() {
    arrayGenres('movie');
    arrayGenres('tv');

    $('aside .arrow').click(function(){
        showGenres();
    });

    $('#search').keydown(function () {
            if(event.which == 13 && $('#search').val()!=''){
            var input = $('#search').val();
            reset();
            search(input, 'movie');
            search(input, 'tv');
        }
    });


});

function search(input, type){
    $.ajax ({
        'url': 'https://api.themoviedb.org/3/search/'+ type,
        'method': 'GET',
        'data': {
            'api_key': 'c4427306a0b122697ced9f53faf32324',
            'query': input,
            'language': 'it-IT'
        },
        'success': function(data) {
            if (data.total_results != 0){
                var response = data.results;
                handlebars(response, type);
            } else {
                noResult();
            }

        },
        'error': function () {
            alert('error');
        },
    });
}

function reset(){
    $('main .movies').empty();
    $('input#search').val('');
}

function handlebars(resp, type){
    for (var i = 0; i < resp.length; i++) {
        var title = resp[i].title || resp[i].name;
        var id = resp[i].id;
        var context = {
        poster_path: poster(resp[i].poster_path, title),
        title: title,
        original_title: resp[i].original_title || resp[i].original_name,
        original_language: flag(resp[i].original_language),
        vote_average: stars(resp[i].vote_average),
        genre: genre(resp[i].title || resp[i].name),
        overview: overview(resp[i].overview),
        id : id,
        };
        var source = $('#movie-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('.movies').append(html);
        credits(type, id);
    }
}

function genre(resp, resp2){
    if (resp) {
        return 'movie';
    } else {
        return 'tv';
    }
}

function noResult(){
    if(($('.cover').length)==0){
        $('.movies').html($('#no-result-template'));
    }
}


function stars (num){
    var num = Math.round(num);
    var modNum= num%2;
    var halfNum= Math.floor(num/2);
    var star= '';
    for (var i = 0; i < 5; i++) {
        if (halfNum > i) {
            star += '<i class="fas fa-star"></i>';
        } else if(modNum!=0){
            star += '<i class="fas fa-star-half-alt"></i>';
            modNum=0;
        }else {
            star+='<i class="far fa-star"></i>';
        }
    }
    return star;
}

function flag(iso){
    var language=['cn', 'de', 'en', 'es', 'fr', 'it', 'ja', 'pt'];
    if (language.includes(iso)){
        return '<img src="img/flag/'+iso+'.png" alt="'+iso+' flag">';
    }else {
        return iso;
    }
}

function poster(link, title){
    urlBase = 'https://image.tmdb.org/t/p/w342';
    if(link == null){
        img = '<img src="img/no-image.jpg" alt="'+title+'">';
    } else {
        img = '<img src="'+urlBase+link+'" alt="copertina '+title+'">';
    }
    return img
}

function overview(string){
    if (string == ''){
        string = 'no trama'
    }else {
        string = (string.substring(0, 120) + '...');
    }
    return string
}

function credits(type,id){
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/' + type + '/' + id,
            method:'GET',
            data:{
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT'
            },
            append_to_response: 'credits',
            success: function(resp){
                var genres = resp.genres;
            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    );
}

function arrayGenres(type) {
        $.ajax(
        {
            url: 'https://api.themoviedb.org/3/genre/'+type+'/list',
            method:'GET',
            data:{
                api_key:'6cdc8707c60410cd9aef476067301b80',
                language:'it-IT'
            },
            success: function(resp){
                var genres = resp.genres;
                printG(genres);

            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    )

}

function printG(array){
    for (var i = 0; i < array.length; i++) {
        console.log(array[i]);

        var context = {
        id: array[i].id,
        name:  array[i].name
        };

        var source = $('#genres-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('.genres .button').append(html);
    }
}

function showGenres(){
    $('aside').animate({width: '250px'}, 200);
    $('aside .genres').toggle();

    setTimeout(function(){
        $('aside .button').slideDown();
    }, 200);
    $('.arrow').toggleClass('rotate');

    // $('aside .arrow').animate({transform: rotate(180deg)});

}
