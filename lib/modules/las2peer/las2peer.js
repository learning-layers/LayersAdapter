/*
Copyright (c) 2014 Peter de Lange, Dominik Renzel, Alexander Ruppert, Advanced Community Information Systems (ACIS) Group,
Chair of Computer Science 5 (Databases & Information Systems), RWTH Aachen University, Germany
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

* Neither the name of the ACIS Group nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
* Layers Adapter - LAS2peer part
* 
* This is a helper library that can be used to access a LAS2peer server
* in a RESTful way with OIDC-authorization.
*/
function LAS2peerOpenIdRequestLibrary(endpointUrl){
		
	this._serviceEndpoint = endpointUrl;
	
	//Fetch the OIDC tokens and print them to the console, trigger an alert in case of problems
	if(localStorage.getItem("access_token") !== null && localStorage.getItem("id_token") !== null){
		this._access_token = localStorage.getItem("access_token");
		this._id_token = localStorage.getItem("id_token");
		console.log("Access Token:");
		console.log(this._access_token);
		console.log("ID Token:");
		console.log(this._id_token);
	}
	else{
		alert("No token provided, script will not work!");
	}
};


/**
* Sends a request to the endpointUrl/relativePath.
* @param relativePath the (relative) uri to call
* @param method the method to be called on the uri (get, post, put, delete)
* @param content the content of the request to send
* @param callback Callback function, called when the result has been retrieved
*/
LAS2peerOpenIdRequestLibrary.prototype.sendRequest = function(relativePath, method, content, callback){
	var requestURI = encodeURI(this._serviceEndpoint + "/" + relativePath + "?access_token=" + this._access_token);
	var ajaxObj = {
		url: requestURI,
		
		type: method.toUpperCase(),
		data: content,
		contentType: "text/plain; charset=UTF-8",
		crossDomain: true,
		headers: { },
		
		error: function (xhr, errorType, error) {
			var errorText = error;
			if (xhr.responseText != null && xhr.responseText.trim().length > 0)
				errorText = xhr.responseText;
			if (xhr.status == 0) {
				errorText = "Server does not respond..";
			}
			
			callback();
		},
		success: function (data, status, xhr) {
			var type = xhr.getResponseHeader("content-type");
			callback(xhr.responseText, type);
		},
	};
	
	$.ajax(ajaxObj);
};
