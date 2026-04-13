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

$('#GetslotValue').change(function () {
    var selectedSlotId = $(this).val();
    $.ajax({
        type: 'POST',
        url: '/reports/slotreports',
        data: JSON.stringify({ slot_id: selectedSlotId }),
        contentType: "application/json",
        success: function (response) {
            // Clear existing rows
            $("#customerrows").empty();
            $("#planrows").empty();
            $("#optoutrows").empty();
            $("#addrows").empty();
            $("#outrows").empty();
            $("#formatrows").empty();

            // Process customer data
            if (Array.isArray(response.customerResult) && response.customerResult.length > 0) {
                i = 1;
                response.customerResult.forEach(customer => {
                    const customerRow = `
                        <tr>
                            <td>${i++}</td>
                            <td>${customer.name}</td>
                            <td>${customer.payment_mode}</td>
                            <td>${customer.area}</td>
                            <td>${customer.payment_amount}</td>
                            <td>${customer.subscription_type}</td>
                            <td>${customer.plan_name}</td>
                            <td>${customer.mobile}</td>
                        </tr>`;
                    $("#customerrows").append(customerRow);
                });
            } else {
                const noDataRow = `<tr><td colspan="7">No data available for the selected slot.</td></tr>`;
                $("#customerrows").append(noDataRow);
            }

            // Process plan data
            if (Array.isArray(response.planResult) && response.planResult.length > 0) {
                response.planResult.forEach(plan => {
                    const planRow = `
                        <tr>
                            <td>${plan.plan_name}</td>
                            <td>${plan.value_count}</td>
                        </tr>`;
                    $("#planrows").append(planRow);
                });
            } else {
                const noPlanDataRow = `<tr><td colspan="2">No plan data available for the selected slot.</td></tr>`;
                $("#planrows").append(noPlanDataRow);
            }

            // Process opt-out data
            if (Array.isArray(response.optResult) && response.optResult.length > 0) {
                response.optResult.forEach(optout => {
                    const optoutRow = `
                        <tr>
                            <td>${optout.name}</td>
                            <td>${optout.area}</td>
                            <td>${optout.vegetables}</td>
                            <td>${optout.plan_name}</td>
                            <td>${optout.mobile}</td>
                        </tr>`;
                    $("#optoutrows").append(optoutRow);
                });
            } else {
                const noOptoutDataRow = `<tr><td colspan="5">No opt-out data available for the selected slot.</td></tr>`;
                $("#optoutrows").append(noOptoutDataRow);
            }

            // Process add-ons data
            if (Array.isArray(response.addResult) && response.addResult.length > 0) {
                response.addResult.forEach(add => {
                    const addRow = `
                        <tr>
                            <td>${add.name}</td>
                            <td>${add.area}</td>
                            <td>${add.addons}</td>
                            <td>${add.plan_name}</td>
                            <td>${add.mobile}</td>
                        </tr>`;
                    $("#addrows").append(addRow);
                });
            } else {
                const noAddDataRow = `<tr><td colspan="5">No add-ons data available for the selected slot.</td></tr>`;
                $("#addrows").append(noAddDataRow);
            }

            if (Array.isArray(response.outResult) && response.outResult.length > 0) {
                response.outResult.forEach(out => {
                    const outRow = `
                        <tr>
                            <td>${out.vegetable_name}</td>
                            <td>${out.opt_out_count}</td>
                        </tr>`;
                    $("#outrows").append(outRow);
                });
            } else {
                const noAddDataRow = `<tr><td colspan="2">No out-veggies data available for the selected slot.</td></tr>`;
                $("#outrows").append(noAddDataRow);
            }

            $("#formatheader").empty();

            let formatheader = `<tr>
            <th>Vegetables Name</th>` 

            if (response.formattedData.length > 0) {
                const samplePlan = response.formattedData[0].planarray;
                   Object.keys(samplePlan).forEach(planName => {                   
                        formatheader += `<th> ${planName.replace('_weight', '')}</th>`
                  }); 
            } 
            formatheader += `<th>Total Vegetable Weight</th>
            <th>Addon Total Weight</th>
            <th>Combined Total Weight</th>
           </tr>`
           $("#formatheader").append(formatheader);           
           
            if (Array.isArray(response.formattedData) && response.formattedData.length > 0) {
                $("#formatrows").empty();     
          
                response.formattedData.forEach(format => {

                    if(format.addon_name ==  "Lemon"){
                        unit = 'pcs';
                    }else {
                        unit = 'kg';
                    } 

                    let formatRow = `
                        <tr>
                            <td>${format.vegetable_name}
                            <strong>${format.addon_name}</strong>
                            </td>
                    `;      
                    Object.entries(format.planarray).forEach(([planName, weight]) => {
                        formatRow += `
                            <td>${Number.isInteger(weight) ? weight : (Number(weight) || 0).toFixed(1)}</td>
                        `;
                    });
                    formatRow += `
                            <td>${Number.isInteger(format.total_weight) ? format.total_weight : (Number(format.total_weight) || 0).toFixed(1)} </td>
                            <td>${Number.isInteger(format.addon_total_weight) ? format.addon_total_weight : (Number(format.addon_total_weight) || 0).toFixed(1)} </td>
                            <td>${Number.isInteger(format.combined_total_weight) ? format.combined_total_weight : (Number(format.combined_total_weight) || 0).toFixed(1)} ${unit}</td>
                        </tr>
                    `;
                  
                    $("#formatrows").append(formatRow);
                });
            } else {
                // If no data is available, show a placeholder row
                $("#formatrows").html(`<tr><td colspan="7">No vegetables & addons data available for the selected slot.</td></tr>`);
            }
        },
        error: function (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching the data. Please try again.');
        }
    });
});





function GetresportByslotday() {
    var GetslotValue = $('#GetslotValue').val();
    var filterVegDiv = $('#filterVegDiv');

    if (GetslotValue === 'Select Delivery Day') {
        alert('Please select a Day for the customer reports');
    } else {
        filterVegDiv.show();
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
                    <div class="wrap plan${subscriber.plan_price}">
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

const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
$('#payment-date').val(formattedDate);

function insertPayment(){
    const urlParams = new URLSearchParams(window.location.search);
    const customerId = urlParams.get('customer_id'); 
    if (!customerId) {
    alert("Customer ID not found in the URL.");
    return;
    }
    var paymentMode = $("#payment-mode").val();
    var planName = $("#plan-name").val();
    var totalPrice = $("#total-price").val();
    var date = $("#payment-date").val();
    var description = $("#payment-description").val();

    if (paymentMode == '' || planName == '' || totalPrice == '' || date == '' || description == '') {

        if (paymentMode == '') {
            $("#payment-mode").css("border", "2px solid red");
        } else {
            $("#payment-mode").css("border-color", "");
        }
        if (planName == '') {
            $("#plan-name").css("border", "2px solid red");
        } else {
            $("#plan-name").css("border-color", "");
        }
        if (totalPrice == '') {
            $("#total-price").css("border", "2px solid red");
        } else {
            $("#total-price").css("border-color", "");
        }
        if (date == '') {
            $("#payment-date").css("border", "2px solid red");
        } else {
            $("#payment-date").css("border-color", "");
        }
        if (description == '') {
            $("#payment-description").css("border", "2px solid red");
        } else {
            $("#payment-description").css("border-color", "");
        }
                
     } else {
      $.ajax({
            type: "POST",
            url: '/admin/addpaymentmethod', 
            data: {
                customer_id: customerId,
                payment_mode: paymentMode, 
                plan_name: planName,
                total_price: totalPrice,
                date: date,
                description: description
            },
            success: function (data) {
                if (data.status == 400) {
                    alert("Payment Method failed.");
                } else {
                    alert("Payment Method successfully updated.");
                    window.location.reload(); 
                }
            },
            error: function (xhr, status, error) {
                console.error("Error: " + error);
            }
    });
    }
}



