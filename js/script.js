$(document).ready(function() {

    $('#search-button').click(function () {

        var input = $('#search').val();

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

                for (var i = 0; i < response.length; i++) {

                    var context = {
                        poster_path: response[i].poster_path,
                        title: response[i].title,
                        original_title: response[i].original_title,
                        original_language: response[i].original_language,
                        vote_average: response[i].vote_average
                    }
                    console.log(context);

                    var source = $('#movie-template').html();
                    var template = Handlebars.compile(source);

                    var html = template(context);
                    $('.movies').append(html);
                }
            },
            'error': function () {
                alert('Error!');
            },
        });

    });

});



    // var source = $('#entry-template').html();
    // var template = Handlebars.compile(source);
    // var html= template(obj);
    // $('.class').append(html);
