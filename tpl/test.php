<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
	<title>jQuery ui plugin #uiname#</title>
	<style type="text/css">
        html, body, div, span, applet, object, iframe,
        h1, h2, h3, h4, h5, h6, p, blockquote, pre,
        a, abbr, acronym, address, big, cite, code,
        del, dfn, em, img, ins, kbd, q, s, samp,
        small, strike, strong, sub, sup, tt, var,
        b, u, i, center,
        dl, dt, dd, ol, ul, li,
        fieldset, form, label, legend,
        table, caption, tbody, tfoot, thead, tr, th, td,
        article, aside, canvas, details, embed, 
        figure, figcaption, footer, header, hgroup, 
        menu, nav, output, ruby, section, summary,
        time, mark, audio, video {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
        }
        /* HTML5 display-role reset for older browsers */
        article, aside, details, figcaption, figure, 
        footer, header, hgroup, menu, nav, section {
            display: block;
        }
        body {
            line-height: 1;
        }
        ol, ul {
            list-style: none;
        }
        blockquote, q {
            quotes: none;
        }
        blockquote:before, blockquote:after,
        q:before, q:after {
            content: '';
            content: none;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
        }
		<?php
		if(file_exists('conf.php'))require_once('conf.php');
		if(!isset($_GET['mobile'])){
			$dir = './css';
        	if(is_dir($dir)){ 
            	if($dp = opendir($dir)){ 
                	while(($file=readdir($dp)) != false){ 
                    	if(!is_dir($dir.'/'.$file)){ 
							echo file_get_contents($dir.'/'.$file);
                    	} 
                	} 
                	closedir($dp); 
            	}else{ 
                	exit('Not permission'); 
            	} 
        	}  
		}
		?>
    </style>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
	<?php if(isset($uiconf)){?>
	<script>
	<?php 
		echo file_get_contents($uiconf['path'] . '/../base/base.js');
	?>
	</script>
	<?php }?>
	<?php if(isset($_GET['mobile'])){ ?>
	<script src="./build/js/mobile.sgTest.js"></script>
	<?php }else{ ?>
	<script src="./js/sgTest.js"></script>
	<?php }?>
</head>
<body style="padding:10px;">
<h3>#uiname# TEST page</h3>
<br />
<p><a href="./doc/#uiname#/" target="_blank">preview doc[exc "ui doc first"]</a></p>
<br />
	<p>                                                                                                           
	<?php if(isset($_GET['mobile'])){ ?>                                                                      
  		<a href="#" onclick="location.search=location.search.replace(/[&]?mobile=1/g,'')">test version for pc</a>      
   	<?php }else{ ?>                                                                                           
    	<a href="#" onclick="location.search+='&mobile=1'">test version for mobile[build first]</a>
	<?php }?>                                                                                                 
	</p>       
<br />
<p>test code here:</p>
<textarea id="code" style="width:600px;height:400px;"></textarea>
<input type=button value="测试" onclick="eval($('#code').attr('value'))"/>
<!--
	write ur test here
-->
<script>
	/*#main#*/
</script>
</body>
</html>
