<?php
	/**
	 ui tools 
	 
	 $argv system args
	 $argc system args length
	**/
	
	if(file_exists('./conf.php'))require_once('./conf.php');

	$invalidCMD="please type a command, for example: create, deploy, build...";
	$undefinedCMD=" command not found, type ui help to get more infomation";
	$invalidUIName="ui name is required, for example:  ui create uitest";
	if(isset($argv[2])){
	$direxist="cannot create directory " . $argv[2] . ": File exists";
	}
	$invalidUI="cannot find a ui project";
	$unbuild="first build then deploy";
	$tpldir=dirname(__FILE__).'/../tpl/';

	function uilog($mss='something wrong', $type='error'){
		if($type=='error'){
			print_r("\033[31m" . $type . ": " . $mss . "\033[0m" . "\n");
		}else{
			print_r("" . $type . ": \033[32m" . $mss . "\033[0m" . "\n");
		}
	};

	/**
	 delete dir

	 **/
    function deleteDir($dir){ 
        if(is_dir($dir)){ 
            if($dp = opendir($dir)){ 
                while(($file=readdir($dp)) != false){ 
                    if(is_dir($dir.'/'.$file) && $file!='.' && $file!='..'){ 
                        deleteDir($dir.'/'.$file); 
                    }else if(!is_dir($dir.'/'.$file)){ 
                        unlink($dir.'/'.$file); 
                    } 
                } 
                closedir($dp); 
				rmdir($dir);
            }else{ 
                exit('Not permission'); 
            } 
        }  
    };
    /**
	 convert img to base64

	 **/
	function convertTo($filename=string){
		if($filename){
			$filetype = pathinfo($filename, PATHINFO_EXTENSION);
			// limit image size < 10M
			$imgbinary = fread(fopen($filename, "r"), 1024 * 1024 * 10);
			file_put_contents('build/js/image.data.js','jQuery.sgUIBase.data["' . urlencode($filename) . '"]="data:image\/' . $filetype . ';base64,' . preg_replace('/\//','\/',base64_encode($imgbinary)) . '";', FILE_APPEND);
		}
	};
	/**
	 create a ui

	 **/
	function create(){
		global $argv;
		global $argc;
		global $invalidUIName;
		global $direxist;
		global $tpldir;
		global $uiconf;
		if($argc==2){
			uilog($invalidUIName);
			return;
		}
		//deleteDir($argv[2]);
		if(file_exists($argv[2])){
			uilog($direxist);
			return;
		}
		mkdir($argv[2]);
		mkdir($argv[2].'/img');
		mkdir($argv[2].'/js');
		mkdir($argv[2].'/css');
		file_put_contents($argv[2].'/js/'.$argv[2].'.js', preg_replace('/#uiname#/',$argv[2],file_get_contents($tpldir.'ui.js.tpl')));
		file_put_contents($argv[2].'/css/'.$argv[2].'.css', preg_replace('/#uiname#/',$argv[2],file_get_contents($tpldir.'ui.css.tpl')));
		file_put_contents($argv[2].'/.arcconfig', preg_replace('/#uiname#/',$argv[2],file_get_contents($tpldir.'arcconfig.tpl')));
		$confcontent = preg_replace(array('/#uiname#/', '/#path#/'),array($argv[2], dirname(__FILE__)),file_get_contents($tpldir.'conf.php.tpl'));
		file_put_contents($argv[2].'/'.'conf.php', $confcontent);
		file_put_contents($argv[2].'/index.php',preg_replace('/#uiname#/',$argv[2],file_get_contents($tpldir.'test.php')));
		uilog($argv[2] . ' create success', 'info');
	};
	function concatfiles($dir,$maincss){
        if($dp = opendir($dir)){ 
            while(($file = readdir($dp)) != false){ 
                if(!is_dir($dir . $file)){ 
					$content = file_get_contents($dir . $file);
                    unlink($dir . $file);
                    file_put_contents( $dir . $maincss, $content, FILE_APPEND);							
                } 
            } 
            closedir($dp); 
        } 
	};
	function add(){
		global $uiconf;
		if(isset($uiconf['addCMD'])){
			system($uiconf['addCMD']);
			uilog($uiconf['uiname'] . ' is added ', 'info');
		}else{
			uilog('no addCMD config in conf.php');
		}
	};
	function ci(){
		global $uiconf;
		global $argv;
		if(isset($argv[2]) && isset($uiconf['ciCMD'])){
			system($uiconf['ciCMD'] . ' -m ' . $argv[2]);
			uilog($uiconf['uiname'] . ' is commited ', 'info');
		}else{
			uilog('no ciCMD config in conf.php or no comment');
		}
	};
	/**
  	 build
	 **/
	 function build(){
		global $argv; 
		global $invalidUI;
		global $uiconf; 
		if(!isset($uiconf['yui'])){
			uilog('yui.jar is not set');return;
		}
		if(file_exists('conf.php')){
			$cmd = 'sh ' . dirname(__FILE__) . '/build.sh ' . $uiconf['yui'];
			if(!system($cmd)){
				$dir = 'build/js/';
				$mainjs = $uiconf['uiname'] . '.js';
				// concat all js to single file
				concatfiles($dir, $mainjs);
		 		//imgTobase64('build/img/');		
				$dir = 'build/css/'; 
				$maincss = $uiconf['uiname'] . '.css';
				concatfiles($dir, $maincss);
				$dir = 'build/mobile/'; 
				$maincss = $uiconf['uiname'] . '.css';
				concatfiles($dir, $maincss);
                $mobilecss = '';
                $mobilecss = '';
                if(file_exists($dir . $maincss)){
                    $mobilecss = preg_replace('/"/', '\'', file_get_contents($dir . $maincss));
                    $all = preg_match_all('/url\([^\)]+\)/x',$mobilecss, $allurl, PREG_SET_ORDER);
                    if($all){
                        $url_img_map = array();
                        foreach($allurl as $key=>$value){
                            if($value[0]){
                                //	delete " & '
                                $hash = preg_replace('/[\'\"\(\)]|url|/x','',$value[0]);
                                // delete ../
                                $hash = preg_replace('/^..\//x','',$hash);
                                if(!isset($url_img_map[urlencode($hash)])){
                                    $url_img_map[urlencode($hash)] = $hash;
                                    convertTo($hash);
                                }
                                $mobilecss = preg_replace('/' . preg_replace(array('/\//','/\(/','/\)/'), array('\/','\(','\)'), $value[0]) . '/', 'url("+jQuery.sgUIBase.data["' . urlencode($hash) . '"]+")', $mobilecss);
                            }
                        }
                    }
                    $mobilecss = 'jQuery.sgUIBase.css.push("' . $mobilecss . '");';
                }
				// output a js file for mobile
				$dir = 'build/js/';
				if(file_exists($dir . 'image.data.js')){
					$imageData = file_get_contents($dir . 'image.data.js');	
					unlink($dir . 'image.data.js');
				}else{
					$imageData = '';
				}
				file_put_contents($dir.'mobile.' .$mainjs ,$imageData . $mobilecss . file_get_contents($dir . $mainjs));
				system('rm -rf build/mobile');
				uilog('build success', 'info');
			}
		}else{
			uilog($invalidUI);
		}
	 };
	 
	/**
	 deploy

	 **/
	 function deploy(){
	 	global $unbuild;
		global $uiconf;
		if(file_exists('build')){
			if(isset($uiconf['deployCMD'])){
				if(system($uiconf['deployCMD'])){
					uilog('deploy success', 'info');
				}
			}
		}else{
			uilog($unbuild);
		}
	 };

	/**
	 echo help
	 **/
	function help(){
		global $tpldir;	
		system('less ' . $tpldir . 'help.txt');
	};

	/**
	 make doc
	 **/
	function doc(){
		global $uiconf;
		$cmd = 'rm -rf doc;yuidoc ./js;';
		system($cmd);
		if(file_exists('out')){
			$cmd = 'mkdir doc;mv out doc/' . $uiconf['uiname'] . ';';	
			system($cmd);
			if(file_exists('doc')){
				uilog('doc build ok' ,'info');
			}
		}
	};

	if($argc==1){
		uilog($invalidCMD);	
	}else{
		switch($argv[1]){
			case 'create':create();break;
			case 'add':add();break;
			case 'ci':ci();break;
			case 'build':build();break;
			case 'deploy':doc();deploy();break;
			case 'doc':doc();break;
			case 'help':help();break;
			default:
				uilog($argv[1].$undefinedCMD);break;
		}	
	}
?>
