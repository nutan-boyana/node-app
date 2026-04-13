function changeCustomerstatus(status ,customer_id){
   $.ajax({
    type: 'POST',
    data: {status:status,customer_id:customer_id},
    url: '/admin/customerStatus',   
    success:function(res){
        $("#statusMsg").text(res.status); 
        setTimeout(() => {
            location.reload(); 
            $("#reloadStatus").load(location.href + " #reloadStatus");
        }, 1000);
     
    }
   });
}

function updateDay(customer_id) {
    var selecteddayVal = $('#selecteddayVal').val();
    $.ajax({
        type: 'POST',
        data: {selecteddayVal:selecteddayVal,customer_id:customer_id},
        url: '/admin/deliverydayStatus',   
        success:function(res){
            $("#statusdayMsg").text(res.status); 
            setTimeout(() => {
                location.reload(); 
                $("#selecteddayStatus").load(location.href + " #selecteddayStatus");
            }, 1000);
         
        }
       });
   
}

function GetresportByslotday() {
    var GetslotValue = $('#GetslotValue').val(); 
    if (GetslotValue === 'Select Delivery Day') {
        alert('Please select a Day for the customer reports');
    } else {
        window.location.href = '/reports/GetresportByslotday?GetslotValue=' + GetslotValue;
    }
}

function GetnewresportByslotday() {
    var GetslotValue = $('#GetslotValue').val(); 
    if (GetslotValue === 'Select Delivery Day') {
        alert('Please select a Day for the customer reports');
    } else {
        window.location.href = '/reports/GetnewresportByslotday?GetslotValue=' + GetslotValue;
    }
}

function handleDayChange(){
    var selectedValue = $("#daySelect").val();
    $.ajax({
        type: 'POST',
        data: {selectedValue:selectedValue},
        url: '/admin/dashboard/adminslotDashboard',
        success:function(res){
            $('#subscriberList').empty();
            let totalSubscribers = 0;
            res.subscribersData.forEach(function(subscriber) {
                $('#subscriberList').append(`
                    <div class="wrap">
                        <div class="icon"><i class="far fa-user"></i></div>
                        <div class="content">
                            <div class="name">${subscriber.plan_name}</div>
                            <div class="count">${subscriber.value_count}</div>
                        </div>
                    </div>`
                );
             totalSubscribers += subscriber.value_count;
            });
            $('#totalSubscribers').text(totalSubscribers);
        }
    });
}

function recordPayment(id){

    $.ajax({
        type: 'POST',
        data: {id:id},
        url: '/admin/UpdatePayment',
        success:function(data){   
            const paymentAmount = data.result[0]?.payment_amount || '';
            const paymentMode = data.result[0]?.payment_mode || '';      
            const palaName = data.result[0]?.plan_name || '';      
             Swal.fire({
                title: 'Record Payment',
                html: `
                    <div class="form-group">                 
                        <input type="text" id="amount" class="form-control" value='${paymentAmount}'  disabled>
                    </div>
                    <br>
                    <div class="form-group">
                        <input type="text" id="paymentMethod" class="form-control" value='${paymentMode}' disabled>
                    </div>
                     <br>
                    <div class="form-group">
                        <input type="text" id="paymentMethod" class="form-control" value='${palaName}'  disabled>
                    </div>
                `,
                confirmButtonText: 'Pay',
                focusConfirm: false,
                preConfirm: () => {
                    const amount = Swal.getPopup().querySelector('#amount').value;
                    const paymentMethod = Swal.getPopup().querySelector('#paymentMethod').value;

                    $.ajax ({
                        type: 'POST',
                        data: {id:id},
                        url: '/admin/UpdatepaymentMethod',
                        success: function(data){
                            $("#recordpayment").hide();
                            $("#reveivedpayment").append('<span  style="color:  #0a58ca ;">Payment Complete</span>');
                           alert(data.status);
                        } 
                    })

                  
                  
                    return { amount: amount, paymentMethod: paymentMethod };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log('Form data:', result.value);
                    // Process the form data if needed
                }
            });
                }
            });

    
}
function validation_select() {
    var selectedValue = $('#weeks').val();

    if (selectedValue === '') {
        $('#weeks').css('border', '2px solid red');

    } else {
        $('#weeks').css('border', '');
    }
}

$('#weeks').on('change', function () {
    validation_select();
});

function UpdateWeek(sub_id) {
   
    var selectedValue = $('#weeks').val();
    var pause = 'extend'
    if (selectedValue === '') {
        $('#weeks').css('border', '2px solid red'); 
        return
    }else{
        
        $.ajax({
            type:'post',
            data: {week:selectedValue,sub_id:sub_id,pause:pause},
            url: '/admin/changeWeekStatus',
            success:function(res){
                $("#statusMsg").text(res.status); 
                setTimeout(() => {
                    location.reload(); 
                    $("#reloadStatus").load(location.href + " #reloadStatus");
                }, 1000);
             
            }
        })
    }

}



