function showAlert(message,alertCallback,title,buttonName){
    navigator.notification.alert(message, alertCallback, title, buttonName)
//alert(message)
}

function showConfirm(message,confirmCallback,title,buttonLabels){
    buttonLabels = buttonLabels.join(",");
    navigator.notification.confirm(
        message,
        confirmCallback,
        title,
        buttonLabels
        );
}

function openCamera(destId){
    navigator.camera.getPicture(function(imageData){
        var image = document.getElementById(destId);
        image.src = "data:image/jpeg;base64," + imageData;
    }, onCameraFail, {
        quality: 25,
        destinationType: navigator.camera.DestinationType.DATA_URL
    });
}

function openGallery(destId){
    navigator.camera.getPicture(function(imageData){
        var image = document.getElementById(destId);
        image.src = "data:image/jpeg;base64," + imageData;
    }, onCameraFail, {
        quality: 100,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
    });
}

function onCameraFail(err){
    showAlert("Error:" + err, alertDismissed, "Camera", "Ok");
}

function alertDismissed(){
    
}



function showLoader(text){
    ActivityIndicator.show(text);
}

function hideLoader(){
    ActivityIndicator.hide();
}

