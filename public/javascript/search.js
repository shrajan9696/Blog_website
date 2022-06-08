function checkInput() {
        var query = document.getElementById('search').value;
        window.find(query);
        return true;
    }

    // $(function() {
    //         $('#input1').on('keypress', function(e) {
    //             if (e.which == 32){
    //                 console.log('Space Detected');
    //                 return false;
    //             }
    //         });
    // });
