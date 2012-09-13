/**
 组件

 @module #uiname#
 **/
(function($) {
    /**
     构造器

     @class $.fn.#uiname#
     @constructor
     @example $('.#uiname#').#uiname#({enable:0})
     * */
    function #uiname#($this, options) {

    };
    // 如果不需要，可以删除
    #uiname#.prototype = {
        /**
         更新实例

         @method update
         @param {Object} options 参数配置
         @example $('.#uiname#').excUUICMD('update', {enable:1});
         * */
        destroy: function(options) {},
        /**
         销毁实例

         @method destroy
         @param {Object} options 参数配置
         @example $('.#uiname#').excUUICMD('destroy', {enable:1});
         * */
        update: function(options) {}
    };
    $.UUIBase.create('#uiname#', #uiname#);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
