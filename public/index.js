$("#new").on("click",function() {

// $.get("/scrape", function(data){
//     console.log(data)
// });    

$.get("/scrape", function(data)
    {
        console.log("All news");
        console.log(data);
        showDataTable(data);
        
    });

});

$("#saved").on("click",function()
{
    $.get("/getSaved", function(data)
    {
        console.log("saved news "+data);
        showDataTable(data);
    });
});

function showDataTable(data)
{
    //console.log(data);
    if(data.length>0)
        {
            $("#StartBtn").hide();
            $("#showData").empty();
            // $("#newsData").show()
            var dataTable=$("<table/>");
            dataTable.addClass("data");
            var no=10;
            if(data.length<10) {no=data.length}
            for(var i=0; i<no;i++)
            {   
                var newRow=$("<tr/>");
                newRow.addClass("dataRow")
                var col1=$("<td/>");
                var story="<br><article>" + "<h2>"+data[i].Title+"</h2>";
                story=story+"<p>"+data[i].Link+"</p>" + "</article>";
                col1.html(story);
                col1.appendTo(newRow);
                var save="<input type='button' value='Save Article' id="+data[i]._id+" onClick=saveClick(this.id); class='saveArticleBtn'/>";
                var col2=$("<td/>");
                col2.html(save);
                col2.appendTo(newRow);
                newRow.appendTo(dataTable);
                
            
            }
        dataTable.appendTo($("#showData"));
        }
}

function saveClick(i){

$.post("/storySave/"+i, function(data)
    {});
};