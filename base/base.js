/**
 给jQuery添加可直接操作sgui的接口，以支持链式语法

 @module base
 **/
(function(){
	/**
	 Returns this，以支持链式语法，同时将缓存到dom上的ui实例注入到jQuery对象里，经此调用后的jQuery实例将失去之前筛选的dom队列
	 
	 @method $.fn.getSgUI
	 @return jQuery this
	 @example $('.datepicker').getSgUI();
	 **/
	$.fn.getSgUI = function(){
		//this.tmp = [];
		this.each(function(i,dom){
			//this.tmp.push(dom);
			this[i] = $(dom).data('sgui');
		});
		this.sgui = 1;
		return this;
	};
	/**
	 链式方式调用组件方法，不会返回执行结果

	 @method $.fn.excSgCMD
	 @param {String} cmd api名
	 @param {Object} options 传递给api的参数
	 @example $('.datepicker').excSgCMD('setDate','2012-09-04');
	 **/
	$.fn.excSgCMD = function(cmd,options){
		if(!this.sgui)this.getSgUI();
		this.each(function(i,ui){
			ui.excSgCMD && ui.excSgCMD(cmd, options);
		});
		return this;
	};
	/**
	 通过$.sgUIBase.createSgUI创建一个UI组件

	 @namespace jQuery
	 @class $.sgUIBase
	 **/
	$.sgUIBase = {
		/**
		 每个UI都会继承的方法，用于以命令行形式调用ui的接口
		 
		 @method excSgCMD
		 @param {String} cmd ui接口名字
		 @param {Object} options 传递给接口的参数，必须是key=>value形式
		 @return 返回接口执行结果
		 @protected
		 **/
		excSgCMD : function(cmd,options){
			if(this.cmd){
				return this.cmd(options)
			}
		},
		data: {},
		css: [],
		/**
		 将js内的css注入到页面里，暂时只针对mobile做此处理

		 @method $.sgUIBase.init
		 @example $.sgUIBase.init()
		 * */
		init: function(){
			if($.sgUIBase.css.length){
				var cssText = $.sgUIBase.css.join('');	
				var style=document.createElement("style");
				style.setAttribute("type", "text/css");
				style.innerHTML = cssText;
				$('head').append(style);
				$.sgUIBase.css = [];
				$.sgUIBase.data = [];
			}
		},
		/**
		 创建一个sgUI，将其注册到jQuery上面
		 
		 @method $.sgUIBase.create
		 @param {String} uiName 组件名
		 @param {Function} classCode 组件代码
	 	 @example $.sgUIBase.create('datepicker',function($this,options){xxxx});
		 **/
		create: function(uiName,classCode){
			$[uiName] = classCode;
			$[uiName].prototype.excSgCMD = $.sgUIBase.excSgCMD;
			$.fn[uiName] = function (options) {
				options = options || {};
				this.each(function (i,item) {
					/* 当前元素已经绑定一个sgui */
					if ($(item).data('sgui')) {
						/* 是否移除 */
						if (options.remove) {
							/* 移除 */
							$(item).data('sgui').remove();
							$(item).removeData('sgui');
						}
						else
						/* 更新ui */
						$(item).excSgCMD('update',options);
					}
					else if (!options.remove) {
					/* 新建一个实例 */
						/*
						 * 默认enable实例
						 */ 
						if (options.enable === undefined && options.disable === undefined)
								options.enable = true;

						$(item).data('sgui', new $[uiName]($(item), options));
					}
				});
				if (options.instance)
					/*
					 * 移除dom，将ui注入到$实例里面
					 */
					this.getSgUI();
				return this;
			};
		}
	};
})(jQuery);
