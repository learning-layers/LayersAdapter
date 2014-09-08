/*
Copyright (c) 2014 Peter de Lange, Dominik Renzel, Advanced Community Information Systems (ACIS) Group,
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
* LAS2peer Layers Adapter Example - Application Script
* 
* This file contains the main logic of the "LAS2peer Layers Adapter Example Client".
* It uses the "layers_restful_library" for calls to the LAS2peer server.
*/
var SERVICE_ENDPOINT_URI = "http://127.0.0.1:8080/las2peer-layers-example-service" //Please adjust this variable
var myOpenIdRequestLibrary;

//The two perspectives of the client.
var loginNode				= document.getElementById("login"),
	mainViewNode			= document.getElementById("mainView");
	welcomeMessageNode 		= document.getElementById("welcomeMessage");
	exemplaryMethodsNode 	= document.getElementById("exemplaryMethods");
	getNetInfoNode 			= document.getElementById("getNetInfo");

/**
* Shows the login perspective.
*/
var show_login_perspective = function(){
	$(loginNode).show();
	$(mainViewNode).hide();
	
	//Load login button (and its logic) asynchronously, since it can take some time to connect with server
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = './js/oidc_button.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
	
};


/**
* Part of the OpenID Connect login process, name is defined in "index.html" and function is called from "oidc_button.js".
*/
function signinCallback(result) {
	
	//Successful login triggers perspective switch after 3 seconds
	if(result === "success"){	
		$("#status").html("Hello, " + oidc_userinfo.name + "!<br>You are being redirected..");
		loginRefresh = self.setInterval(function(){show_main_perspective()},3000);
	
	//Else, nothing happens
	} else {
		console.log("not signed in...");
		console.log(result);
		$("#status").html("Please log in:-)");
	}
}


/**
* Shows the main perspective (where users can send requests).
*/
var show_main_perspective = function(){
	window.clearInterval(loginRefresh);
	$(loginNode).hide();
	$(mainViewNode).show();
	
	myOpenIdRequestLibrary	= new OpenIdRequestLibrary(SERVICE_ENDPOINT_URI);
	myOpenIdRequestLibrary.sendRequest("welcomeMessage", "get", null, function(result){
		welcomeMessageNode.innerHTML = "<h3>" + result + "</h3>";
	});
};


var get_net_info = function(){
	myOpenIdRequestLibrary.sendRequest("getNetInfo", "get", null, function(result){
		if(result.length < 5){ //no known nodes..
				getNetInfoNode.innerHTML = "<p>Sorry, no nodes are known...<br><i>(Maybe you only started a single node?)</i></p>";
		}
		else{
			getNetInfoNode.innerHTML = "<p>Known Nodes:<br>" + result + "</p>";
		}
	});
};

//show login perspective
show_login_perspective();