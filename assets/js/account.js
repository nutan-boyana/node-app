var baseurl  = 'https://www.5amfresh.com/' 

window.addEventListener("pageshow", function (event) {
    if (event.persisted || performance.getEntriesByType("navigation")[0].type === "back_forward") {
        calculateTotalPrice();
    }
});

function calculateTotalPrice() {
    let addonsCost = 0;
    let addonsVeg = 0;
    let addonsFlowers = 0;
    let addonIndividualPrice = 0;
    let multiplier = 1; 
    if ($('#weekly').is(':checked')) {
        multiplier = $('#credit_balance').val();
        // multiplier = 1;
    }
    let totalPrice = 0;

    $('.veg-quantity').each(function() {
        let quantity = parseFloat($(this).val()) || 0;
        let pricePerKg = parseFloat($(this).data('price')) || 0;
        let vegetableId = $(this).data('id');
        let unit = $(this).attr('data-unit');
        let defaultWeight = parseFloat($('#addonIncludeQuantity-' + vegetableId).text()) || 0;
        let totalWeight = defaultWeight + quantity;

        if (unit === 'pcs') {
            totalWeight = totalWeight * 5;
            addonsVeg += quantity * pricePerKg;
        } else if (unit === 'gms') {
            totalWeight = totalWeight;
            addonsVeg += (quantity / 1000) * pricePerKg;
            quantity = quantity / 1000;
        } else if (unit === 'kg') {
            totalWeight = totalWeight;
            addonsVeg += quantity * pricePerKg;
        }

        addonIndividualPrice = quantity * pricePerKg;
        $('#addonTotalWeight-' + vegetableId).text(totalWeight + " " + unit);
        $('#addonIndividualPrice-' + vegetableId).text(addonIndividualPrice);
    });

    $('input[name="addonflower"]:checked').each(function() {
        let flowerPrice = parseFloat($(this).data('price')) || 0;
        addonsFlowers += flowerPrice;
    });

    addonsCost = addonsVeg + addonsFlowers;

    totalPrice = addonsCost * multiplier;

    if(totalPrice != 0)
    {
        $('#totalPriceDiv').removeClass('d-none');
        $('#calculateAdd').text(addonsCost + 'x' + multiplier + ' Week');
        $('#total_price').val(totalPrice);
    }else{
        $('#totalPriceDiv').addClass('d-none');
    }

    // $('#total_price').val(totalPrice);
    $('#total_amount').text(totalPrice);
    // $('#total_price').val(totalPrice.toFixed(2));
    // $('#total_amount').text(totalPrice.toFixed(2));
}

$('.veg-quantity').on('change', function() {
    calculateTotalPrice();
});

$(document).on('click', 'label.flowers1', function(event) {
    event.preventDefault();

    var $label = $(this);
    var $radio = $label.find('input[name="addonflower"]');

    // Toggle selection
    if ($label.hasClass('selected')) {
        $label.removeClass('selected');
        $radio.prop('checked', false);
    } else {
        $('label.flowers1').removeClass('selected');
        $('input[name="addonflower"]').prop('checked', false);
        $label.addClass('selected');
        $radio.prop('checked', true);
    }

    calculateTotalPrice();
});

$('input[name="optnw"]').on('change', function() {
    calculateTotalPrice();
});

function payForAddons(paymentMethod, subscriptionId ,button) {
    calculateTotalPrice();
    var customer_name = $('#customer_name').val();
    var customer_email = $('#customer_email').val();
    var customer_phone = $('#customer_phone').val();
    var totalPrice = $('#total_price').val();
    var creditBalance = $('#credit_balance').val();
    var type = '';
    var data1 = {};
    var credits;
    if (creditBalance != null && creditBalance != '' && creditBalance > 0) {
        if (creditBalance == 1) {
            type = 'oneweek';
            credits = 1;
        } else {
            type = $('input[name="optnw"]:checked').val();
            if (!type) {
                alert('Please select a payment option.');
                return false;
            }
            if(type == 'oneweek'){
                credits = 1;
            }else if(type == 'weekly'){
                credits = creditBalance;
            }
        }
    } else {
        return false;
    }

    // Get add-ons data
    var selectedFlowerName = $('input[name="addonflower"]:checked').data('name');
    var selectedFlowerId = $('input[name="addonflower"]:checked').data('id');
    var selectedFlowerWeight = $('input[name="addonflower"]:checked').data('weight');
    var selectedFlowerPrice = $('input[name="addonflower"]:checked').data('price');
    var flowerUnit = $('input[name="addonflower"]:checked').data('unit');
    var addons = [];

    $('.veg-quantity').each(function() {
        var quantity = parseFloat($(this).val());
        var vegetableId = $(this).data('id'); 
        var vegetableName = $(this).data('name');
        var pricePerKg = parseFloat($(this).data('price')); 
        var unit = $(this).data('unit');

        if (quantity > 0) {
            addons.push({
                id: vegetableId,
                name :vegetableName,
                quantity: quantity,
                price: pricePerKg,
                individualPrice: $('#addonIndividualPrice-' + vegetableId).text(),
                unit: unit
            });
        }
    });

    if (selectedFlowerWeight != undefined) {
        addons.push({
            id: selectedFlowerId,
            name :selectedFlowerName,
            quantity: selectedFlowerWeight,
            price: selectedFlowerPrice,
            individualPrice : selectedFlowerPrice,
            unit: flowerUnit
        });
    }
    if(addons.length == 0){
        $('#addonsError').text("Please Select Addons").fadeIn();
        setTimeout(function(){
            $('#addonsError').fadeOut();
        }, 2000);;
    return false;
    }

    button.style.cursor = "not-allowed"; 
    button.style.color = "grey";         
    button.innerText = "Please Wait";    
    button.disabled = true;              


    data1 = {
        addons: addons,
        type: type,
        subscriptionId: subscriptionId,
        paymentMethod: paymentMethod,
        totalAmount: totalPrice,
        creditBalance: credits,
        customer_name: customer_name,
        customer_email: customer_email,
        customer_phone: customer_phone
    };    
    if (paymentMethod == 'cod') {
        $.ajax({
            url: baseurl + 'Welcome/create_order',
            type: 'POST',
            data: {
                amount: totalPrice * 100, 
                currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
            },
            success: function(data) {
                var orderResponse = JSON.parse(data);
                var order_id = orderResponse.id;
                 // Update data1 with order details
                    data1.razorpay_payment_id = 'cod';
                    data1.payment_status = "pending";
                    data1.razorpay_order_id = order_id;
                    data1.payment_mode = "cod";

                    saveAddonsdata(data1);
                    },
            error: function(error) {
                console.log(error);
            }
            });
        
    } else if (paymentMethod == 'online') {
        // Call Razorpay API for payment
        $.ajax({
            url: baseurl + 'Welcome/create_order',
            type: 'POST',
            data: {
                amount: totalPrice * 100, // Razorpay expects amount in paise
                currency: "INR",
            receipt: "order_rcptid_" + Date.now(),
            },
            success: function(data) {
                var orderResponse = JSON.parse(data);
                var order_id = orderResponse.id;
                var options = {
                    key: 'rzp_live_Do5X0hTkNbc3Su',
                    amount: orderResponse.amount, 
                    currency: "INR",
                    name: "5am Fresh",
                    description: "Add-ons Purchase",
                    image: "https://www.5amfresh.com/assets/images/logo.webp",
                    order_id: order_id, // Razorpay order ID
                    handler: function(paymentResponse) {
                        // Payment success handler
                        data1.razorpay_payment_id = paymentResponse.razorpay_payment_id;
                        data1.razorpay_order_id = paymentResponse.razorpay_order_id;
                        data1.razorpay_signature = paymentResponse.razorpay_signature;
                        data1.payment_status = "success";
                        data1.payment_mode = "online";
                        // Save payment details
                        saveAddonsdata(data1);
                    },
                    modal: {
                        ondismiss: function () {
                            $('#buttonsDiv').load(location.href + ' #buttonsDiv');
                        }
                    },
                    prefill: {
                        name: customer_name,
                        email: customer_email, 
                        contact: customer_phone
                    },
                    theme: {
                        color: "#0f9b49"
                    }
                };
                var rzp = new Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    window.location.href = baseurl + "payment_failed";
                });

                // Razorpay cancel 
                rzp.on('payment.cancel', function (response) { 
                    // logic to cancel
                });
                rzp.open();
            },
            error: function(err) {
                console.error("Error in creating Razorpay order: ", err);
                alert("Failed to initiate payment. Please try again.");
            }
        });
    } else {
        alert("Invalid payment method selected.");
    }
}
 



function saveAddonsdata(data) {
     $('#paymentLoader').addClass('show');
    window.location.href = baseurl + "payment-success";
    // $('#paymentLoader').addClass('show');
    $.ajax({
        type: "POST",
        // url: baseurl + "Account/save_addons_data",
        url: baseurl + "Account/save_addons_data",
        data: data,
        success: function (response) {     
            var parsedResponse = JSON.parse(response);
            if (parsedResponse.status == "success") {
                // console.log("Addons data saved successfully.");
                // $('#paymentLoader').removeClass('show');
                window.location.href = baseurl + "payment-success";
                // Optionally handle additional success logic here
            } else {
                console.error("Error in saving addons data:", parsedResponse.message);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error in saving addons data:", error);
        }
    });
}