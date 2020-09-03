$(document).ready(function() {

    $('#search-button').click(function () {
        $('#search').toggle();
        $('.search').toggleClass('whiteB');
        $('input').focus();

        if($('#search').val()!='') {
            var input = $('#search').val();
            search(input);
            reset();
        }
    });

    $('#search').keydown(function () {
        if(event.which==13){
            var input = $('#search').val();
            search(input);
            reset();
            $('input#search').val('');
            $('#search').toggle();
            $('.search').removeClass('whiteB');
        }
    });

});

function search(input){
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

            if (response.length == 0) {
                noResult();
            } else {
                handlebars(response);
            }

        },
        'error': function () {
            noResult();
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
        poster_path: resp[i].poster_path,
        title: resp[i].title,
        original_title: resp[i].original_title,
        original_language: flag(resp[i].original_language),
        altFlag: altFlag(resp[i].original_language),
        vote_average: stars(resp[i].vote_average)
        };
        var source = $('#movie-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('.movies').append(html);
    }
}

function noResult(){
    var source = $('#no-result-template').html();
    $('.movies').append(source);
}

function stars(num){
    num = num / 2;
    num = Math.round(num);
    var star='';
    for (var i = 0; i < 5; i++) {
        if (num>i){
            star+='<i class="fas fa-star"></i>';
        } else {
            star+='<i class="far fa-star"></i>';
        }
    }
    return star;
}

// mezza stella
// function stars (num){
//     var num = Math.round(num);
//     var modNum= num%2;
//     var halfNum= Math.floor(num/2);
//     console.log(halfNum);
//
//     var star= '';
//     for (var i = 0; i < 5; i++) {
//         if (halfNum > i) {
//             star += '<i class="fas fa-star"></i>';
//         } else if(modNum!=0){
//             star += '<i class="fas fa-star-half-alt"></i>';
//             modNum=0;
//         }else {
//             star+='<i class="far fa-star"></i>';
//         }
//     }
//     return star;
// }

function flag(iso){
    if(iso == 'en'){
        return 'en';
    } else if (iso == 'it'){
        return 'it';
    } else {
        $('p.lang').text('Lingua originale: '+ iso);
    }
}

function altFlag(iso){
    if(iso == 'en'){
        return 'bandiera inglese';
    } else if (iso == 'it'){
        return 'bandiera italiana';
    }else {
        return;
    }
}
