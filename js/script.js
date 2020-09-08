$(document).ready(function() {
    arrayGenres('movie');
    arrayGenres('tv');

    var url= 'https://api.themoviedb.org/3/search/';
    var urlTrend= 'https://api.themoviedb.org/3/trending/all/week';
    search('*','', urlTrend);

    var select= $('select.movie').change(function(){


    });

    $('aside .arrow').click(function(){
        showGenres();
    });

    $('#search').keydown(function () {
            if(event.which == 13 && $('#search').val()!=''){
            var input = $('#search').val();
            reset();
            search(input, 'movie', url);
            search(input, 'tv', url);
        }
    });
});

function search(input, type, url){
    $.ajax ({
        'url': url + type,
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
        var genre_ids = resp[i].genre_ids;
        var cast = credits(type, id);
        var context = {
        poster_path: poster(resp[i].poster_path, title),
        title: title,
        original_title: resp[i].original_title || resp[i].original_name,
        original_language: flag(resp[i].original_language),
        vote_average: stars(resp[i].vote_average),
        genre: genre(resp[i].title || resp[i].name),
        overview: overview(resp[i].overview),
        id : id,
        genre_ids: genre_ids,
        cast: cast,
        };


        var source = $('#movie-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('.movies').append(html);

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

function credits(type, id){
    if (type==''){
        type = 'movie';
    }
    $.ajax(
        {
            url: 'https://api.themoviedb.org/3/' + type + '/' + id + '/credits',
            method:'GET',
            data:{
                api_key:'c4427306a0b122697ced9f53faf32324',
                language:'it-IT'
            },
            success: function(resp){
                var cast = resp.cast;
                cast = printCast(cast, id);
                return cast;
            },
            error: function(){

            }
        }
    );

}

function printCast(arrayCast, id){

    var cast = [];
    var i = 0;
    while (i < 5 && i < arrayCast.length){
        if (i < 4){
            cast += arrayCast[i].name + ', ';
        } else {
            cast += arrayCast[i].name;
        }
        i++;
    }
    var source = $('#printCast').html();
    var template = Handlebars.compile(source);
    var context = {
    cast: cast
}
    var html = template(context);
    $('.cover#'+id+' .cast').append(html);
}

function arrayGenres(type) {
        $.ajax(
        {
            url: 'https://api.themoviedb.org/3/genre/'+type+'/list',
            method:'GET',
            data:{
                api_key:'c4427306a0b122697ced9f53faf32324',
                language:'it-IT'
            },
            success: function(resp){
                var genres = resp.genres;
                printG(genres, type);

            },
            error: function(){
                alert('Si è verificato un errore');
            }
        }
    );
}

function printG(array, type){
    if(type == 'movie'){
        for (var i = 0; i < array.length; i++) {
            var context = {
            id: array[i].id,
            generiMovie:  array[i].name
            };
            var source = $('#genres-template-movie').html();
            var template = Handlebars.compile(source);
            var html = template(context);
            $('select.movie').append(html);
        }
    }else if(type=='tv'){
        for (var i = 0; i < array.length; i++) {
            var context = {
            id: array[i].id,
            generitv:  array[i].name
            };
            var source = $('#genres-template-tv').html();
            var template = Handlebars.compile(source);
            var html = template(context);
            $('select.tv').append(html);
        }
    }
}

function showGenres(){
    $('aside').animate({width: '290px'}, 200);
    $('aside .genres').toggle();

    setTimeout(function(){
        $('aside select').slideDown();
    }, 200);
    $('.arrow').toggleClass('rotate');
}


// FILTRO GENERI
$('select.movie').change(function() {
    var genere = $(this).val();
    console.log(genere);
    var cover = $('.cover p.hidden').find(genere);
    console.log(cover);

});
