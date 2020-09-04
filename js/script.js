$(document).ready(function() {

    $('#search-button').mouseover(function () {
        $('#search').toggle();
        $('.search').toggleClass('whiteB');
        $('input').focus();
        $('#search-button').toggle();
    });
    $('#search').mouseleave(function () {
        $('#search').toggle();
        $('.search').toggleClass('whiteB');
        $('#search-button').toggle();
    });


    $('#search').keydown(function () {
        if(event.which == 13 && $('#search').val()!=''){
            var input = $('#search').val();
            reset();
            searchMovie(input);
            $('#search').toggle();
            $('.search').removeClass('whiteB');
            $('#search-button').toggle();
        }
    });


});

function searchMovie(input){
    $.ajax ({
        'url': 'https://api.themoviedb.org/3/search/movie',
        'method': 'GET',
        'data': {
            'api_key': 'c4427306a0b122697ced9f53faf32324',
            'query': input,
            'language': 'it-IT'
        },
        'success': function(data) {
            var response = data.results;
            handlebars(response);
            searchTv(input);
        },
        'error': function () {
            alert('error');
        },
    });
}

function searchTv(input){
    $.ajax ({
        'url': 'https://api.themoviedb.org/3/search/tv',
        'method': 'GET',
        'data': {
            'api_key': 'c4427306a0b122697ced9f53faf32324',
            'query': input,
            'language': 'it-IT'
        },
        'success': function(data) {
            var response = data.results;
            handlebars(response);
            noResult();
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

function handlebars(resp){
    for (var i = 0; i < resp.length; i++) {
        var context = {
        poster_path: poster(resp[i].poster_path),
        title: movieOrTv(resp[i].title, resp[i].name),
        original_title: movieOrTv(resp[i].original_title, resp[i].original_name),
        original_language: flag(resp[i].original_language),
        altFlag: altFlag(resp[i].original_language),
        vote_average: stars(resp[i].vote_average),
        genre: genre(resp[i].title, resp[i].name)
        };
        var source = $('#movie-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('.movies').append(html);

    }
}

function genre(resp, resp2){
    if (resp) {
        return 'Film';
    } else {
        return 'Serie TV';
    }
}

function movieOrTv(resp, resp2){
    if (resp) {
        return resp
    } else {
        return resp2
    }
}

function noResult(){
    if(($('.cover').length)==0){
        $('.movies').append($('#no-result-template').html());
    }
}

// function stars(num){
//     num = num / 2;
//     num = Math.round(num);
//     var star='';
//     for (var i = 0; i < 5; i++) {
//         if (num>i){
//             star+='<i class="fas fa-star"></i>';
//         } else {
//             star+='<i class="far fa-star"></i>';
//         }
//     }
//     return star;
// }


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
    if(iso == 'en'){
        return 'en';
    } else if (iso == 'it'){
        return 'it';
    } else {
        return iso;
    }
}

function altFlag(iso){
    if(iso == 'en'){
        return 'bandiera inglese';
    } else if (iso == 'it'){
        return 'bandiera italiana';
    } else {
        return iso;
    }
}

function poster(link){
    if(link == null){
        link = 'img/no-image.jpg';
    } else {
        link = 'https://image.tmdb.org/t/p/w342'+link;
    }
    return link;
}
