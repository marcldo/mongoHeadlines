$(document).ready(function () {

    $(".scrape-new").on("click", () => {
        console.log("scraped");
        $.ajax({
            type: "GET",
            url: "/scrape"
        })
            .then(
                $.ajax({
                    type: "GET",
                    url: "/"
                })
            );
    });

    // save job
    $(".save").on("click", function (event) {
        event.preventDefault();
        const selected = $(this);
        console.log("saved " + selected.attr("data-id"));
        $.ajax({
            type: "GET",
            url: "/save/" + selected.attr("data-id")
        });

    });

    // delete one job
    $(".delete").on("click", function (event) {
        event.preventDefault();
        const selected = $(this);
        console.log("deleted " + selected.attr("data-id"))
        $.ajax({
            type: "GET",
            url: "/delete-saved/" + selected.attr("data-id")
        })
            .then(() => document.reload());

    });

    $(".delete-all").on("click", function (event) {

        console.log("delete-all")
        $.ajax({
            type: "GET",
            url: "/delete-all"
        })
            .then(function () { location.reload() });
    })
});