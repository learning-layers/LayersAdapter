function ClViTraRequestLibrary(endpointUrl){
		
	this._serviceEndpoint = endpointUrl;
	
};

ClViTraRequestLibrary.prototype.getVideos = function(user, request, handler){
		$.ajax({
	        url: this._serviceEndpoint+"/"+user+"/"+request,
	        type: "GET",
	        dataType:'json',
	        success: handler
	    });
}