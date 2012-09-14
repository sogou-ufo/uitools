/**
 给jQuery添加可直接操作uui的接口，以支持链式语法

 @module base
 **/
(function() {
    /**
     Returns this，以支持链式语法，同时将缓存到dom上的ui实例注入到jQuery对象里，经此调用后的jQuery实例将失去之前筛选的dom队列

     @method $.fn.getUUI
     @return jQuery this.
     @example $('.datepicker').getUUI();
     **/
    $.fn.getUUI = function() {
        //this.tmp = [];
        var _ = this;
        _.each(function(i, dom) {
            //this.tmp.push(dom);
            _[i] = $(dom).data('uui');
        });
        _.uui = 1;
        return _;
    };
    /**
     链式方式调用组件方法，不会返回执行结果

     @method $.fn.excUUICMD
     @param {String} cmd api名.
     @param {Object} options 传递给api的参数.
     @example $('.datepicker').excUUICMD('setDate','2012-09-04');
     **/
    $.fn.excUUICMD = function(cmd, options) {
        if (!this.uui)this.getUUI();
        this.each(function(i, ui) {
            ui.excUUICMD && ui.excUUICMD(cmd, options);
        });
        return this;
    };
    /**
     通过$.UUIBase.createSgUI创建一个UI组件

     @namespace jQuery
     @class $.UUIBase
     **/
    $.UUIBase = {
        /**
         每个UI都会继承的方法，用于以命令行形式调用ui的接口

         @method excUUICMD
         @param {String} cmd ui接口名字.
         @param {Object} options 传递给接口的参数，必须是key=>value形式.
         @return 返回接口执行结果.
         @protected
         **/
        excUUICMD: function(cmd, options) {
            if (this[cmd]) {
                return this[cmd](options);
            }
        },
        data: {},
        css: [],
        /**
         将js内的css注入到页面里，暂时只针对mobile做此处理

         @method $.UUIBase.init
         @example $.UUIBase.init()
         * */
        init: function() {
            if ($.UUIBase.css.length) {
                var cssText = $.UUIBase.css.join('');
                if (cssText == '')return;
                var style = document.createElement('style');
                style.setAttribute('type', 'text/css');
                style.innerHTML = cssText;
                $('head').append(style);
                $.UUIBase.css = [];
                $.UUIBase.data = [];
            }
        },
        /**
         创建一个uui，将其注册到jQuery上面

         @method $.UUIBase.create
         @param {String} uiName 组件名.
         @param {Function} classCode 组件代码.
          @example $.UUIBase.create('datepicker',function($this,options){xxxx});
         **/
        create: function(uiName, classCode) {
            $[uiName] = classCode;
            $[uiName].prototype.excUUICMD = $.UUIBase.excUUICMD;
            $.fn[uiName] = function(options) {
                options = options || {};
                this.each(function(i, item) {
                    /* 当前元素已经绑定一个uui */
                    if ($(item).data('uui')) {
                        /* 是否移除 */
                        if (options.remove) {
                            /* 移除 */
                            $(item).excUUICMD('destroy', options);
                            $(item).removeData('uui');
                        }
                        else
                        /* 更新ui */
                        $(item).excUUICMD('update', options);
                    }
                    else if (!options.remove) {
                    /* 新建一个实例 */
                        /*
                         * 默认enable实例
                         */
                        if (options.enable === undefined && options.disable === undefined)
                                options.enable = true;

                        $(item).data('uui', new $[uiName]($(item), options));
                    }
                });
                if (options.instance)
                    // 移除dom，将ui注入到$实例里面
                    this.getUUI();
                return this;
            };
        }
    };
})(jQuery);
