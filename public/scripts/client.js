$(function() {
    getBooks();

    $('#book-form').on('submit', addBook);
  });//end of doc ready

function getBooks() {
    $.ajax({
            type: 'GET',
            url: '/books',
            success: displayBooks

        }); //end of ajax get

} //end of getbooks


function displayBooks(response) { //response is an array of objects
    console.log(response);
    var $list = $('#book-list');

    $list.empty();
    response.forEach(function(book) {

        var $li = $('<li></li>');
        $li.append('<strong>' + book.title + '</strong');
        $li.append('<strong>' + book.author + '</strong');
        var date = new Date(book.published);
        $li.append('<p><time>' + date.toDateString() + '</time></p>');
        $li.append('<strong>' + book.edition + '</strong');
        $li.append('<strong>' + book.publisher + '</strong');

        //append to actual list itself
        $list.append($li);
    });//end forEach

}//end display books

function addBook(event) {
    event.preventDefault();
    var bookData = $(this).serialize();

    $.ajax({
        type: 'POST',
        url: "/books",
        data: bookData,
        success: getBooks
    }); //end of ajax post
    $(this).find('input').val('');

} //end of addbook
