
$(document).ready(function(){
  sessionStorage.removeItem('currentBookId'); //se borra de la sesion el id de modificacion

  $('#add-book').on('submit', function(e){
    e.preventDefault(); //cancela la opvion por defecto


    //si hay algo en sesion se selecciono "Edit"
    if(sessionStorage.getItem('currentBookId') != null){
      //modificacion
      var id = sessionStorage.getItem('currentBookId');
      var urlBD = "https://api.mlab.com/api/1/databases/test-mlab/collections/books/"+ id +"?apiKey=YQ59-hL-snSPqTDX9QS5rnSGNVdtxKHd";
      var type = 'PUT';
    } else {
      //create
      var urlBD = "https://api.mlab.com/api/1/databases/test-mlab/collections/books?apiKey=YQ59-hL-snSPqTDX9QS5rnSGNVdtxKHd";
      var type = 'POST';
    }

    var title = $('#title').val();
    var category = $('#category').val();
    var excerpt = $('#excerpt').val();

    $.ajax({
      url: urlBD,
		  data: JSON.stringify({
        "title" : title,
        "category": category,
        "excerpt": excerpt
      }),
		  type: type,
		  contentType: "application/json",
      success: function(data){
        window.location.href = "index.html"
      },
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  });

  $('body').on('click', '#setBook', function(e){
    e.preventDefault();
    //se guarda el id en session
    sessionStorage.setItem('currentBookId', $(this).data('id'));
    //se llenan los campos con lo seleccionado
    $('#title').val($(this).data('title'));
    $('#category').val($(this).data('category'));
    $('#excerpt').val($(this).data('excerpt'));
    document.getElementById("btn").value="Edit Book";
  });

  var id = null;
  $('body').on('click', '#deleteBook', function(e){
    e.preventDefault();
    var urlBD = "https://api.mlab.com/api/1/databases/test-mlab/collections/books/"+ id +"?apiKey=YQ59-hL-snSPqTDX9QS5rnSGNVdtxKHd";

    $.ajax({
      url: urlBD,
		  type: 'DELETE',
      async: true,
      timeout: 300000,
      success: function(data){
        window.location.href = "index.html"
      },
      error: function(xhr, status, err){
        console.log(err);
      }
    });
  });

  $('body').on('click', '#confirm-delete', function(e){
    e.preventDefault();
    id = $(this).data('id');

    $('#modal-from-dom').data('id', id).modal('show');
  });

});

//Muestra todos los libros en BD
function getBooks(){
  var urlBD = "https://api.mlab.com/api/1/databases/test-mlab/collections/books?apiKey=YQ59-hL-snSPqTDX9QS5rnSGNVdtxKHd";
  $.ajax({
    url: urlBD
  }).done(function(data){
    var output = '<div>';
    $.each(data, function(key, data){
      output += '<div class="well">';
      output += '<h3>'+ data.title +'</h3>';
      output += '<p>'+ data.category +'</p>';
      output += '<p>'+ data.excerpt +'</p>';
      output += '<a id="setBook" href="" data-id="'+ data._id.$oid +'" data-title="'+ data.title +'" data-category="'+ data.category +'" data-excerpt="'+ data.excerpt +'">Edit</a> | <a href="" id="confirm-delete" data-id="'+ data._id.$oid +'">Delete</a>'
      output += '</div>';
    });
    $('#books').html(output);
  })
};
