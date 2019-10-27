$(document).ready(function () {


    $(".save").on("click", function (event) {
        const selected = $(this);
        console.log("clicked" + selected.attr("data-id"))
        $.ajax({
            type: "GET",
            url: "/save/" + selected.attr("data-id")
        });

    });

});