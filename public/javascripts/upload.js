
	var ui = {}
	ui.sendFile = function(name, type, offset, length, blob){

    var reader = new FileReader();      
		var blob = blob;
		
		reader.onloadend = function(event) {
				console.log(event);
//				var data = new DataView(event.target.result);
				var uInt8Array = new Uint32Array(event.target.result);
//				var byte3 = uInt8Array[4];
//				var i = data.getUint8(4, 6);
				console.log(event.target.result)
 //       $('#console').html(i)


				ui.socket.emit(name, [offset, length, uInt8Array])
    };

    reader.onerror = function(x) {
      console.log(x, 'error summin abt', file.fileSize)
    };

    reader.readAsArrayBuffer(blob);		
	};
	
	ui.uploadFile = function(file) {
		if (!file) return uploadComplete();

		var url = '/', data

		data = new FormData
		data.append('file', file)

		console.log('Start upload: ' + url)

		var xhr = new XMLHttpRequest();
		xhr.file = file;
		xhr.addEventListener('progress', function(e) {
			var done = e.position || e.loaded, total = e.totalSize || e.total;
			console.log('xhr progress: ' + (Math.floor(done/total*1000)/10) + '%');
		}, false);
		if ( xhr.upload ) {
				xhr.upload.onprogress = function(e) {
				var done = e.position || e.loaded, total = e.totalSize || e.total;
				console.log('xhr.upload progress: ' + done + ' / ' + total + ' = ' + (Math.floor(done/total*1000)/10) + '%');
			};
		}
		xhr.onreadystatechange = function(e) {
			if ( 4 == this.readyState ) {
				console.log(['xhr upload complete', e]);
				var t = this.responseText;
			}
		};
		xhr.open('post', url, true);
		xhr.send(data);
	}
	
	ui.readFile = function (file) {
				var data = event.dataTransfer;
				var xhr = new XMLHttpRequest();
		    xhr.open("POST", "/", true);
		    xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' 
		        + boundary);
		    xhr.sendAsBinary(file);
					
		function fileUpload(file) {
			console.log(file)
			var oData = new FormData().append('file', file);
		  var reader = new FileReader();  
		  var xhr = new XMLHttpRequest();
		  this.xhr = xhr;

		  var self = this;
		  this.xhr.upload.addEventListener("progress", function(e) {
		        if (e.lengthComputable) {
		          var percentage = Math.round((e.loaded * 100) / e.total);
							console.log(percentage)
		        }
		      }, false);

		  xhr.upload.addEventListener("load", function(e){
		      console.log('im finished!')
				}, false);
				
		  xhr.open("POST", "http://localhost:3000/");
			xhr.setRequestHeader('content-type', 'multipart/form-data;')
//		  xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
		  xhr.send(oData)
			reader.onload = function(evt) {
		    xhr.sendAsBinary(evt.target.result);
		  };
		  
	//		reader.readAsBinaryString(file);
		};
//		fileUpload(file)
/*
		var file = file;
		var name = file.name;
		var type = file.type;
		var size = file.size;
		var blockSize = 256;
		var blockCount = Math.ceil(file.fileSize / blockSize);
		var sets = _.range(blockCount);
		var blobSlice = file.webkitSlice ? file.webkitSlice : file.mozSlice;
		
		ui.socket.on('copy:'+name, function(data){
			sets.forEach(function(e,i){
				var blob = file.webkitSlice(0 + (blockSize * i), (blockSize * i) + blockSize)
				,		start = blockSize * i
				,		end = (blockCount * i) + blob.length
				;
				console.log(blob, blob.length)
				ui.sendFile(name, type, start, blob.length, blob)
			})	
		})

		ui.socket.emit('inform', {name: name, type:type, size:size, blockCount: blockCount, blockSize: blockSize})
		
   reader.readAsArrayBuffer(blob);
	*/		
  };
	ui.cancel = function (e) {
		$('#shark').hide(0).css({
			width:1,
			height:1,
			left:e.clientX,
			top:e.clientY,
		},0)
		console.log(e.clientX, e.clientY)
	  e.preventDefault()
	  return false
	};
	ui.drop = function (e) {
		$('#shark').show().animate({
			translateX:'-=150',
			scale:'+=2000',
			rotateZ:'-='+Math.PI
		},1200).animate({
			scale:'-=2000',
			rotateZ:'-='+Math.PI/2
			
		},800).animate({scale:'+=0'},333).animate({
			scale:'0'
		},100)
	  e.preventDefault();
	  var dt = e.dataTransfer;
	  var files = dt.files;
  	  var File = files[0];
  	  ui.uploadFile(File);
  	  return false
}
	ui.init = function(){
		
	this.winW = window.innerWidth;
	this.winH = window.innerHeight;
		
/*		this.socket = io.connect('http://localhost:8008');
		this.socket.on('connect', function(){
			console.log('connected')
		})
		this.socket.on('conf', function(e,r){
			console.log('conf', e, r)
		})
*/
		if (window.XMLHttpRequest) {
		  if (typeof XMLHttpRequest.prototype.sendAsBinary == 'undefined') {
		    if (window.Uint8Array) {
		      XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
		        var ui8a = new Uint8Array(datastr.length);
		        for (var i = 0; i < datastr.length; i++) {
		          ui8a[i] = datastr.charCodeAt(i) & 0xff;
		        }
		        this.send(ui8a.buffer);
		      }
		    }
		  }
		}
		var dropFile;

		dropFile = document.getElementById("dropFile");
		dropFile.addEventListener("dragenter", ui.cancel, false);
		dropFile.addEventListener("dragover", ui.cancel, false);
		dropFile.addEventListener("drop", ui.drop, false);
		
		this.x = window.innerHeight,
		this.y = window.innerWidth;
		$('#console').css({
			left : ( ui.y - 667 ) / 2
		})
		$(window).one('resize', function(e){	ui.init()})
	};
	ui.init()
