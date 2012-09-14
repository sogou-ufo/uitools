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
         更新实例实现，请通过$('.#uiname#').#uiname#({xxxx})调用

         @method update
         @param {Object} options 参数配置
         @example $('.#uiname#').#uiname#().excUUICMD('update', {enable:1 }) = $('.#uiname#').#uiname#({enable: 1});
         * */
        update: function(options) {},
        /**
         实例内部自我销毁的接口，但是不能销毁和dom的绑定，不建议调用，请使用$('.#uiname#').#uiname#({destroy: 1})

         @method destroy
         @param {Object} options 参数配置
         @example $('.#uiname#').#uiname#().excUUICMD('destroy');
         * */
        destroy: function(options) {}
    };
    $.UUIBase.create('#uiname#', #uiname#);
    // 创建css
    $($.UUIBase.init);
})(jQuery);
