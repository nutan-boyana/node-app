$(document).ready(function () {
    var slotday = [];

    $.ajax({
        type: 'GET',
        url: '/batch/getSlot',
        success: function(data) {  
            data.slots.forEach(function(slot) {
                console.log(slot);
                slotday.push(slot.slot_id);  
            });

            generateValidDates(slotday);  
        }
    });

    const dateInput = $("#batch-date");
    const today = new Date();

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    }

    function generateValidDates(slotday) {
        let validDates = [];
        let currentDate = new Date(today);

        for (let i = 0; i < 60; i++) { 
            if (slotday.includes(currentDate.getDay())) {
                validDates.push(formatDate(currentDate));  
            }
            currentDate.setDate(currentDate.getDate() + 1);  
        }
 
        const todayFormatted = formatDate(today);
        flatpickr(dateInput[0], {
            dateFormat: "Y-m-d",
            minDate: today, 
            enable: validDates,  
            disable: (slotday.includes(today.getDay())) ? [todayFormatted] : [],  
        });
    }
});

function insertBatch() {
    var name = $("#batch-name").val().trim();
    var date = $("#batch-date").val().trim();
    var order = $("#start-order-id").val().trim();

    if (name == '' || date == '' || order == '' ) {
        event.preventDefault();
        if (name == "") {
            $("#batch-name").css("border", "2px solid red");
        } else {
            $("#batch-name").css("border-color", "");
        }
        if (date == "") {
            $("#batch-date").css("border", "2px solid red");
        } else {
            $("#batch-date").css("border-color", "");
        }
        if (order == "") {
            $("#start-order-id").css("border", "2px solid red");
        } else {
            $("#start-order-id").css("border-color", "");
        }
    } else {
        $.ajax({
            type: "POST",
            url: '/batch/insertBatch',
            data: { name: name, date: date, order: order },
            success: function(data) {	
				if(data.status == 400){
					alert("Already existed");				
				}else{
					alert("successfully inserted");
					window.location.href = '/batch/batchDetails';					
				}
            },
            error: function(xhr, status, error) {
                console.error("Error: " + error);
            }
        });
    }
}
