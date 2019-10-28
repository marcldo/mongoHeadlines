$(document).ready(function () {
    // init modal side nav and paralax
    $('#modal1').modal();
    $('.parallax').parallax();
    $('.sidenav').sidenav();

    //scrape jobs
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

    $(".add-note").on("click", function () {


        const selected = $(this);
        const jobID = selected.attr("data-id")

        //pass job id to modal save button 
        $("#save-note").attr("data-id", jobID);

        $.getJSON("/jobs/" + jobID, function (data) {
            displayNotes(data.note);
        })
    })

    //save note
    $("#save-note").on("click", function () {
        const id = $(this).attr("data-id");

        $.ajax({
            method: "POST",
            url: "/jobs/" + id,
            data: {
                title: $("#title").val(),
                body: $("#body").val()
            }
        })
            .then((data) => {
                console.log(data)
                $("#title").val("")
                $("#body").val("")
            })
    })

    function displayNotes(notes) {
        $(".collection").empty();

        let liHeader = $("<li>").addClass("collection-header").html("<h6>Saved Notes</h6>")
        $(".collection").append(liHeader);

        notes.forEach(note => {
            let li = $("<li>").append(
                $("<span>").html(`<strong>${note.title}</strong>`).addClass("title"),
                $("<p>").text(note.body),
                $("<a>").html(`<i class="small material-icons">close</i>`)
                    .addClass("btn-floating btn-small waves-effect waves-light red")
                    .attr("href", `/delete-note/${note._id}`)
            ).addClass("collection-item");
            $(".collection").append(li);
        })

    }



});