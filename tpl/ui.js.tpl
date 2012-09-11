/**
 组件
 
 @module #uiname#
 **/
(function($){
	/**
	 构造器

	 @class $.fn.#uiname#
	 @constructor
	 @example $('.#uiname#').#uiname#({enable:0})
	 * */
	#uiname# = function($this,options){
	
	};
	// 如果不需要，可以删除
	#uiname#.prototype = {
		/**
		 更新实例
		 
		 @method update
		 @param {Object} options 参数配置
		 @example $('.#uiname#').excSgCMD('update',{enable:1});
		 * */
		update: function(options){}
	};
	$.sgUIBase.create('#uiname#',#uiname#);
	/*
	 * 创建css
	 */
	$($.sgUIBase.init);
})(jQuery);
