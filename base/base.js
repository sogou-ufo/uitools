/**
 给jQuery添加可直接操作uui的接口，以支持链式语法

 @module base
 **/
(function($) {
    /**
     *继承，类继承，即父类有子类没有的才继承
     *
     *@param target 子类
     *@param obj 父类
     *@method myExtend
     * */
    function myExtend(target, obj) {
       for(var i in obj) {
           if(target[i])continue;
           target[i] = obj[i];
       } 
    };
    /**
     Returns this，以支持链式语法，同时将缓存到dom上的ui实例注入到jQuery对象里，经此调用后的jQuery实例将失去之前筛选的dom队列

     @method $.fn.getUUI
     @return ui list
     @example $('.datepicker').getUUI();
     **/
    $.fn.getUUI = function(uiName) {
        var arr = [];
        var uiName = uiName || this.uiName;
        this.each(function(i, dom) {
            //this.tmp.push(dom);
            $(dom).data(uiName) && arr.push($(dom).data(uiName));
        });
        return arr;
    };
    /**
     链式方式调用组件方法，不会返回执行结果

     @method $.fn.excUUICMD
     @param {String} cmd api名.
     @param {Object} options 传递给api的参数.
     @example $('.datepicker').excUUICMD('setDate','2012-09-04');
     **/
    $.fn.excUUICMD = function(cmd, options) {
        var uis = this.getUUI(this.uiName);
        $.each(uis, function(i, ui) {
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
        baseClass: {
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
                    this[cmd](options);
                }
                if(cmd == 'destroy') {
                    this._destroy(options); 
                }
            },
            /**
             * 存储事件队列
             *
             * @property eventList
             * @type Array
             * */
            //eventList: [],
            /**
             * 封装的事件绑定
             *
             * @method on
             * @param {Object} $this jQuery实例
             * @param {String} event 事件名字
             * @param {String | Function} query 当query和handle参数同时出现的时候，query是选择器，事件绑定会走代理，否则query是handle
             * @param {Function} handle 回调
             * @return {arguments} 将传入的参数返回，用于销毁
             * */
            on: function($this, event, query, handle) {
                this.eventList ? this.eventList.push(arguments) : this.eventList = [arguments];
                $this.on.apply($this, Array.prototype.slice.call(arguments, 1));
                // 返回参数
                return arguments;
            },
            /**
             * 移除绑定的事件，参数必须是通过组建on方法绑定事件的返回值
             *
             * @method off
             * @param {arguments} onReturn 通过on方法绑定的事件的返回值 
             * */
            off: function(onReturn) {
                var o = onReturn[0], _ = this;
                o.off.apply(o, Array.prototype.slice.call(onReturn, 1));
                $.each(this.eventList, function (i, arg) {
                    if(onReturn == arg)_.eventList.splice(i, 1);   
                });
            },
            /**
             *每个UI都继承的自我销毁逻辑，另可各自实现destroy逻辑，因为每个组件可能需要有自己额外销毁逻辑
             *
             *@method _destroy
             *
             * */
            _destroy: function() {
                $.each(this.eventList, function(j, evtSingle) {
                    evtSingle[0].off.apply(evtSingle[0], Array.prototype.slice.call(evtSingle, 1));
                })
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
            // 继承基类，如果子类有该方法的实现，则不继承该方法
            myExtend($[uiName].prototype, $.UUIBase.baseClass);
            $.fn[uiName] = function(options) {
                var _options = options || {};
                this.uiName = uiName;
                this.each(function(i, item) {
                    // 已经存在一个
                    if ($(item).data(uiName)) {
                        if (_options.destroy) {
                            // 移除
                            $(item).data(uiName).excUUICMD('destroy', _options);
                            $(item).removeData(uiName);
                        }
                        else
                        // 如果传递了!false的options，则更新ui，否则只是实现获取ui
                        options && $(item).data(uiName).excUUICMD('update', _options);
                    }
                    else if (!_options.destroy) {
                        // 新建，默认enable
                        if (_options.enable === undefined && _options.disable === undefined)
                                _options.enable = true;

                        $(item).data(uiName, new $[uiName]($(item), _options));
                    }
                });
                if (_options.instance)
                    // 返回uilist 
                    return this.getUUI();
                return this;
            };
        }
    };
})(jQuery);
