$(document).ready(function () {
    var totalData = $(".total-data").text();
    var dataArray = JSON.parse(totalData);

    $(".search-input").on("input", function () {
        var inputValue = $(this).val().toLowerCase();
        var found = false;
        $(".datacard").hide();
        $(".datacard").each(function () {
            var cardText = $(this).text().toLowerCase();
            if (cardText.includes(inputValue)) {
                $(this).show();
                found = true;
            }
        });
        if (!found) {
            $(".emptycard").show();
        } else {
            $(".emptycard").hide();
        }
    }); 
});

  // vegitables delete action
  function Vegdelete(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#008e5c',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                type: 'POST',
                data: { id: id },
                url: '/admin/delete-vegitables',
                success: function (res) {   
                    if(res.status == "success"){  
                        $('#vegetable-team'+id).hide();    
                        Swal.fire(
                            'Deleted!',
                            res.message,
                            'success'
                        );   
                    }else {
                        Swal.fire(
                            'Deleted!',
                            res.message,
                            'error'
                        );   
                    }                
                },
                error: function (err) {
                    Swal.fire(
                        'Error!',
                        'There was a problem deleting the item.',
                        'error'
                    );
                }
            });
        }
    });
}
