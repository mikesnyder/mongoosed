$(document).ready(function(){

  $(document).on("click", ".btn-info", function() {
      $("#comment").empty();
      let thisId = $(this).attr("id");
    
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        .then(function(data) {
          console.log(data);
          // The title of the article
          $("#comment").append("<h2>" + data.title + "</h2>");
          // An input to enter a new title
          $("#comment").append("<input id='titleinput' name='title' >");
          // A textarea to add a new note body
          $("#comment").append("<textarea id='bodyinput' name='body'></textarea>");
          // A button to submit a new note, with the id of the article saved to it
          $("#comment").append("<button data-id='" + data._id + "' id='saveComment'>Save Comment</button>");
    
          // If there's a note in the article
          if (data.Comment) {
            // Place the title of the note in the title input
            $("#titleinput").val(data.Comment.title);
            // Place the body of the note in the body textarea
            $("#bodyinput").val(data.Comment.body);
          }
        });
    });

    $(document).on("click", "#saveComment", function(){
        let id = $(this).attr('data-id');

        $.post('/comment/'+id, {
            title: $('#titleinput').val().trim(),
            comment: $('#bodyinput').val().trim()
        }).then(function(result){
            console.log(result)
            $('#comment').empty();
        })
    })
});
