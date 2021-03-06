var accessToken = "1f0c161b763d4041882592bae052e197";
		var subscriptionKey = "1f0c161b763d4041882592bae052e197";
		var baseUrl = "https://api.api.ai/v1/";

		$(document).ready(function() {
			$("#input").keypress(function(event) {
				if (event.which == 13) {
					event.preventDefault();
					send();
				}
			});
			$("#rec").click(function(event) {
				switchRecognition();
			});
		});

		var recognition;

		function startRecognition() {
			recognition = new webkitSpeechRecognition();
			recognition.onstart = function(event) {
				updateRec();
			};
			recognition.onresult = function(event) {
				var text = "";
			    for (var i = event.resultIndex; i < event.results.length; ++i) {
			    	text += event.results[i][0].transcript;
			    }
			    setInput(text);
				stopRecognition();
			};
			recognition.onend = function() {
				stopRecognition();
			};
			recognition.lang = "en-US";
			recognition.start();
		}
	
		function stopRecognition() {
			if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRec();
		}

		function switchRecognition() {
			if (recognition) {
				stopRecognition();
			} else {
				startRecognition();
			}
		}

		function setInput(text) {
			$("#input").val(text);
			send();
		}

		function updateRec() {
			$("#rec").text(recognition ? "Stop" : "Speak");
		}

		function send() {
			var text = $("#input").val();

			 $.ajaxSetup({
	            beforeSend: function () {
	               $(".loader").show();
	            },
	            complete: function () {
	                $(".loader").hide();
	            }
        	});

			$.ajax({
				type: "POST",
				url: baseUrl + "query/",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				headers: {
					"Authorization": "Bearer " + accessToken
				},
				//data: JSON.stringify({ q: text, lang: "en" }),
				data: JSON.stringify({query: text, lang: "en", sessionId: "runbarry"}),
				success: function(data) {
					//setResponse(JSON.stringify(data, undefined, 2));
					successReturn(JSON.stringify(data, undefined, 2));
				},
				error: function() {
					setResponse("Internal Server Error");
				}
			});
			//setResponse("Loading...");
		}

		function setResponse(val) {
			$("#response").html(val);
		}
		
		function successReturn(val) {
			var res = JSON.parse(val);
			$("#response").append("<div class='query'>"+res.result.resolvedQuery+"</div>");
			$("#response").append("<div class='result'><div class='query'>"+res.result.speech+"</div></div>");
		}