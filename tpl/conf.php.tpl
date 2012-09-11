<?php
	$uiconf = array(
		"uiname" 	=> "#uiname#", // protected
		"addCMD"	=> "cd ../;svn add #uiname#;svn up;svn ci -m 'add #uiname#';",// add ui to svn,exc after create
		"ciCMD" 	=> "cd ../;svn up;svn add #uiname#/*;svn ci ",// commit code
		"deployCMD" => "cp -r doc/* /search/uidoc/doc/;cp -r build/* /search/uidoc/files/", // cmd to deploy ur ui project
		"path"		=> "#path#", // protected
		"yui" 		=> "/etc/uyui/yui.jar", // where ur yui set up
		"arc"		=> true,// use arc to review ur code
	);
?>
