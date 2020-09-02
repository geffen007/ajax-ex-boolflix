$(document).ready(function() {

    $('#search-button').click(function () {
        reset($('main .movies'));
        var input = $('#search').val();
        search(input);
        $('input#search').val('')
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
                var source = $('#no-result-template').html();
                var template = Handlebars.compile(source);
                var html = template(context);
                $('.movies').append(html);
            } else {
                handlebars(response);
            }

        },
        'error': function () {
            alert('Error!');
        },
    });
}

function reset(what){
    what.empty();
}

function handlebars(resp){
    for (var i = 0; i < resp.length; i++) {
        var context = {
        poster_path: resp[i].poster_path,
        title: resp[i].title,
        original_title: resp[i].original_title,
        original_language: resp[i].original_language,
        vote_average: resp[i].vote_average
        };
        console.log(context);
        var source = $('#movie-template').html();
        var template = Handlebars.compile(source);
        var html = template(context);
        $('.movies').append(html);
    }
}
