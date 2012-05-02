/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the www.jxstar.org
 */
 
/**
 * 对ExtJs部分组件功能进行扩展或完善。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */
 
/**
 * 新增方法：在数组中插入对象
 * index -- 指要插入的位置，从0开始，如果是负数，则从尾部开始
 * item -- 指要插入的项目
 **/
Array.prototype.insert = function(index, item) {
	if (index >= this.length) {
		this[this.length] = item;
		return this;
	}
	if (index < 0) {
		index = this.length + index;
	}
	
	for(var i = this.length-1; i >= index; i--) {
		this[i+1] = this[i];
	}
	this[index] = item;
	return this;
};

/**
 * 修改属性：定期清理孤立节点
 **/
Ext.enableListenerCollection = true;

/**
 * ext-3.3.1
 * 修改方法：把Date对象格式化yyyy-mm-dd格式的字符串。
 **/
Ext.urlEncode = function(o, pre){
	var empty, buf = [], e = encodeURIComponent;
	
	Ext.iterate(o, function(key, item){
		empty = Ext.isEmpty(item);
		Ext.each(empty ? key : item, function(val){
			//Ext.encode(val).replace(/"/g, '') --> val.dateFormat('Y-m-d H:i:s') //modify by tony
			buf.push('&', e(key), '=', (!Ext.isEmpty(val) && (val != key || !empty)) ? (Ext.isDate(val) ? val.dateFormat('Y-m-d H:i:s') : e(val)) : '');
		});
	});
	if(!pre){
		buf.shift();
		pre = '';
	}
	return pre + buf.join('');
};

/**
 * ext-3.3.1
 * 修改方法：分页栏刷新数据时加上上次的参数。
 **/
Ext.PagingToolbar.prototype.doLoad = function(start){
	var o = {};
	var options = this.store.lastOptions;//---add by tony
	if (options && options.params) {
		o = options.params;
	}//---add by
	
	var pn = this.getParams();
	o[pn.start] = start;
	o[pn.limit] = this.pageSize;
	if(this.fireEvent('beforechange', this, o) !== false){
		this.store.load({params:o});
	}
};

/**
 * ext-3.3.1
 * 修改方法：支持设置表格头部的样式
 **/ 
Ext.grid.GridView.prototype.getColumnStyle = function(colIndex, isHeader){
	var colModel  = this.cm,
		colConfig = colModel.config,
		style     = isHeader ? colConfig[colIndex].hcss || '' : colConfig[colIndex].css || '',//添加了属性：colConfig[colIndex].hcss || 
		align     = colConfig[colIndex].align;
	
	style += String.format("width: {0};", this.getColumnWidth(colIndex));
	
	if (colModel.isHidden(colIndex)) {
		style += 'display: none; ';
	}
	
	if (align) {
		style += String.format("text-align: {0};", align);
	}
	
	return style;
};

/**
 * ext-3.3.1
 * 修改方法：修改表格单元可选择字符，1行增加：x-selectable，二行删除：unselectable="on"，原：
 * '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} {css}" style="{style}" tabIndex="0" {cellAttr}>',
 *     '<div class="x-grid3-cell-inner x-grid3-col-{id}" unselectable="on" {attr}>{value}</div>',
 * '</td>'
 **/ 
Ext.grid.GridView.prototype.cellTpl = new Ext.Template(
	'<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="0" {cellAttr}>',
		'<div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
	'</td>'
);

/**
 * ext-3.3.1
 * 修改方法：去掉属性表格中按属性名排序的特性
 **/
Ext.grid.PropertyGrid.prototype.initComponent = function(){
	this.customRenderers = this.customRenderers || {};
	this.customEditors = this.customEditors || {};
	this.lastEditRow = null;
	var store = new Ext.grid.PropertyStore(this);
	this.propStore = store;
	var cm = new Ext.grid.PropertyColumnModel(this, store);
	//store.store.sort('name', 'ASC');	//delete by tony
	this.addEvents(
		'beforepropertychange',
		'propertychange'
	);
	this.cm = cm;
	this.ds = store.store;
	Ext.grid.PropertyGrid.superclass.initComponent.call(this);

	this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
		if(colIndex === 0){
			this.startEditing.defer(200, this, [rowIndex, 1]);
			return false;
		}
	}, this);
};

/**
 * ext-3.3.1
 * 修改方法：取checkbox的值时取 0 或 1，而不是true false。
 **/
Ext.form.Checkbox.prototype.getValue = function(){
	if(this.rendered){
		return this.el.dom.checked ? '1' : '0';
	}
	return this.checked ? '1' : '0';
};

/**
 * ext-3.3.1
 * 修改方法：把返回结果中的树形数据作为响应数据
 **/
Ext.tree.TreeLoader.prototype.handleResponse = function(response){
	this.transId = false;
	var a = response.argument;
	var d = Ext.decode(response.responseText).data;//---add by tony
	if (d != null) {
		response.responseText = Ext.encode(d);
	}//----add by
	
	this.processResponse(response, a.node, a.callback, a.scope);
	this.fireEvent("load", this, a.node, response);
};

/**
 * 新增方法：模拟record的set/get方法，在JxSelect.setSelectData中使用。
 **/
Ext.form.BasicForm.prototype.set = function(name, value) {
	var f = this.findField(name);
	if(f){
		var oldValue = f.getValue();
		f.setValue(value);
		//处理字段值修改标记
		f.fireEvent('change', f, oldValue, value);
	}
	return this;
};

/**
 * 新增方法：模拟record的set/get方法，在JxSelect.setSelectData中使用。
 **/
Ext.form.BasicForm.prototype.get = function(name) {
	var f = this.findField(name);
	if(f){
		return f.getValue();
	}
	return '';
};

/**
 * 新增方法：取数值。
 **/
Ext.form.BasicForm.prototype.getNum = function(name) {
	var value = '';
	var f = this.findField(name);
	if(f){
		value = f.getValue();
	}
	if (value == null || value.length == 0) return 0;
		
	return parseFloat(value);
};

/**
 * 新增方法：保证修改字段值后不标记为脏数据。
 **/
Ext.form.BasicForm.prototype.oset = function(name, value) {
	var f = this.findField(name);
	if(f){
		var oldValue = f.getValue();
		f.setValue(value);
		//取消字段修改痕迹，设置修改值为原值
		f.originalValue = value;
	}
	return this;
};

/**
* 新增方法：取当前表单的所有字段，含组合字段内的字段
**/
Ext.form.BasicForm.prototype.fieldItems = function() {
	var fields = new Ext.util.MixedCollection(false, function(o){
		return o.getItemId();
	});
	this.items.each(function(field){
		if (field.isComposite) {
			field.items.each(function(f){
				fields.add(f.getItemId(), f);
			});
		} else {
			fields.add(field.getItemId(), field);
		}
	});
	
	return fields;
};

/**
 * 新增方法：保证修改字段值后不标记为脏数据。
 **/
Ext.form.Field.prototype.osetValue = function(value){
	this.setValue(value);
	this.originalValue = value;
};

/**
 * ext-3.3.1
 * 修改方法：支持在选择日期的时候，自动带上时间值，设置样式：Y-m-d H:i，就支持显示时间。
 **/
Ext.form.DateField.prototype.onSelect = function(m, d){
	if (Ext.isDate(d)) {//---add by tony
		var curd = new Date();
		d.setHours(curd.getHours(), curd.getMinutes(), curd.getSeconds());
	}//---add by
	this.setValue(d);
	this.fireEvent('select', this, d);
	this.menu.hide();
};

/**
 * ext-3.3.1
 * 修改方法：如果是样式Y-m，在显示日期值取的是当前日，应该取1号
 **/
Ext.form.DateField.prototype.parseDate = function(value) {
	if(!value || Ext.isDate(value)){
		return value;
	}
	
	if (!Ext.isEmpty(value) && value.length == 7 && this.format == 'Y-m') {//---add by tony
		return Date.parseDate(value+'-01', 'Y-m-d');
	}//---add by

	var v = this.safeParse(value, this.format),
		af = this.altFormats,
		afa = this.altFormatsArray;

	if (!v && af) {
		afa = afa || af.split("|");

		for (var i = 0, len = afa.length; i < len && !v; i++) {
			v = this.safeParse(value, afa[i]);
		}
	}
	return v;
},

/**
 * 修改属性：FormLayout的标签描述不添加':'符号。
 **/
Ext.layout.FormLayout.prototype.labelSeparator = '';

/**
 * 修改属性：NumberField缺省不允许输入负数。
 **/
//Ext.form.NumberField.prototype.allowNegative = false;

/**
 * 修改属性：NumberField聚焦则全选。
 **/
//Ext.form.NumberField.prototype.selectOnFocus = true;

/**
 * 修改属性：TextField聚焦则全选。
 **/
//Ext.form.TextField.prototype.selectOnFocus = true;

/**
 * 修改属性：BasicForm加载数据后设置为初始值。
 **/
Ext.form.BasicForm.prototype.trackResetOnLoad = true;

/**
 * 修改属性：Component状态支持缺省值为否，设置所有控件都不保存状态。
 **/
Ext.Component.prototype.stateful = false;

/**
 * 修改属性：对话框的缺省标题。
 **/
Ext.Window.prototype.iconCls = 'eb_win';

/**
 * 修改属性：对话框的缺省不带阴影。
 **/
Ext.Window.prototype.shadow = false;

/**
 * ext-3.3.1
 * 修改方法：处理重复打开combogrid页面时报下面的错误。
 **/
Ext.layout.MenuLayout.prototype.isValidParent = function(c, target) {
	var el = c.el.up('li.x-menu-list-item', 5);
	if (Ext.isEmpty(el)) return false;//add by tony
	return el.dom.parentNode === (target.dom || target);
};

/**
 * ext-3.3.1
 * 修改方法：如果是只读，则需要添加只读样式。
 **/
Ext.form.Field.prototype.setReadOnly = function(readOnly){
	if(this.rendered){
		this.el.dom.readOnly = readOnly;
		if (readOnly) {//---add by tony
			this.el.addClass('x-field-only');
		} else {
			this.el.removeClass('x-field-only');
		}//---add by
	}
	this.readOnly = readOnly;
};
Ext.form.TriggerField.prototype.setReadOnly = function(readOnly){
	if(readOnly != this.readOnly){
		if (readOnly) {//---add by tony
			this.el.addClass('x-field-only');
		} else {
			this.el.removeClass('x-field-only');
		}//---add by
		this.readOnly = readOnly;
		this.updateEditState();
	}
};

/**
 * ext-3.3.1
 * 修改方法：如果是只读，则需要添加只读样式。
 **/
Ext.form.TriggerField.prototype.updateEditState = function(){
	if(this.rendered){
		if (this.readOnly) {
			this.el.dom.readOnly = true;
			this.el.addClass('x-field-only');//add by tony.tan
			this.el.addClass('x-trigger-noedit');
			this.mun(this.el, 'click', this.onTriggerClick, this);
			//this.trigger.setDisplayed(false);
			this.emptyText = '';//add by tony.tan
		} else {
			if (!this.editable) {
				this.el.dom.readOnly = true;
				this.el.addClass('x-trigger-noedit');
				this.mon(this.el, 'click', this.onTriggerClick, this);
			} else {
				this.el.dom.readOnly = false;
				this.el.removeClass('x-field-only');//add by tony.tan
				this.el.removeClass('x-trigger-noedit');
				this.mun(this.el, 'click', this.onTriggerClick, this);
			}
			//this.trigger.setDisplayed(!this.hideTrigger);
		}
		//del by tony.tan 它会造成控件很窄
		//this.onResize(this.width || this.wrap.getWidth());
	}
};

/**
 * ext-3.3.1
 * 修改方法：处理日期控件的按钮只读后还可以选择的问题
 **/
Ext.form.DateField.prototype.onTriggerClick = function(){
	if(this.readOnly || this.disabled){//modify by tony.tan add 'this.readOnly || '
		return;
	}
	if(this.menu == null){
		this.menu = new Ext.menu.DateMenu({
			hideOnClick: false,
			focusOnSelect: false
		});
	}
	this.onFocus();
	Ext.apply(this.menu.picker,  {
		minDate : this.minValue,
		maxDate : this.maxValue,
		disabledDatesRE : this.disabledDatesRE,
		disabledDatesText : this.disabledDatesText,
		disabledDays : this.disabledDays,
		disabledDaysText : this.disabledDaysText,
		format : this.format,
		showToday : this.showToday,
		startDay: this.startDay,
		minText : String.format(this.minText, this.formatDate(this.minValue)),
		maxText : String.format(this.maxText, this.formatDate(this.maxValue))
	});
	this.menu.picker.setValue(this.getValue() || new Date());
	this.menu.show(this.el, "tl-bl?");
	this.menuEvents('on');
};

/**
 * 修改日期字段控件的样式，显示居中。
 **/
Ext.form.DateField.prototype.fieldClass = 'x-field-d';

/**
 * 修改数字字段控件的样式，显示居右。
 **/
Ext.form.NumberField.prototype.fieldClass = 'x-field-n';

/**
 * ext-3.3.1
 * 修改方法：添加F1 -- F12为特殊键，用于处理字段的帮助信息CTRL+F1。
 **/
Ext.EventObjectImpl.prototype.isSpecialKey = function(){
   var k = this.normalizeKey(this.keyCode);
   return (this.type == 'keypress' && this.ctrlKey) ||
   this.isNavKeyPress() ||
   (k == this.BACKSPACE) || // Backspace
   (k >= 16 && k <= 20) ||	// Shift, Ctrl, Alt, Pause, Caps Lock
   (k >= 44 && k <= 46) ||	// Print Screen, Insert, Delete
   (k >= 112 && k <= 123);	// F1 -- F12
};
	
/**
 * 新增方法：用来解决RowEditor类中这行ed = c.getEditor(); is not a function的错误
 **/
Ext.grid.RowSelectionModel.prototype.getEditor = Ext.emptyFn;

/**
 * ext-3.3.1
 * 问题：如果int，float类型的值为null时，在record中取到后为0；
 * 分析：在Ext.data.JsonReader.extractValues中转换值时改变了，分析是Types.INT FLOAT的两个方法转换了，增加了this.useNull判断
 *       实际上是判断field对象的属性useNull，所以增加下面的一行，保留数值可以显示null
 *		 如果设置useNull值，会造成输出值为null，在grid编辑中还会出现异常，所以直接替换INT\FLOAT这两个方法
 **/
//Ext.data.Field.prototype.useNull = true;
Ext.data.Types.INT = {
	convert: function(v){
		return v !== undefined && v !== null && v !== '' ?
			parseInt(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';//(this.useNull ? null : 0) --> ''
	},
	sortType: Ext.data.SortTypes.none,
	type: 'int'
};
		
Ext.data.Types.FLOAT = {
	convert: function(v){
		return v !== undefined && v !== null && v !== '' ?
			parseFloat(String(v).replace(Ext.data.Types.stripRe, ''), 10) : '';//(this.useNull ? null : 0) --> ''
	},
	sortType: Ext.data.SortTypes.none,
	type: 'float'
};
//在editgrid，如果可编辑字段为date类型，且值为空，则点击可编辑单元，光标离开时会给脏标记，
//是因为startValue=null，而当前值为空，所以值改变了。特修改如下：如果值为空，则返回''
Ext.data.Types.DATE = {
	convert: function(v){
		var df = this.dateFormat;
		if(!v){
			return '';//null -->''
		}
		if(Ext.isDate(v)){
			return v;
		}
		if(df){
			if(df == 'timestamp'){
				return new Date(v*1000);
			}
			if(df == 'time'){
				return new Date(parseInt(v, 10));
			}
			return Date.parseDate(v, df);
		}
		var parsed = Date.parse(v);
		return parsed ? new Date(parsed) : '';//null -->''
	},
	sortType: Ext.data.SortTypes.asDate,
	type: 'date'
};

/**
 * ext-3.3.1
 * 新增属性：添加24小时制时间格式校验
 **/
Ext.apply(Ext.form.VTypes, {
	//24小时制时间格式校验
    time24: function(val, field) {
		var time24Test = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/i;
        return time24Test.test(val);
    },
    //错误提示
    time24Text: jx.base.timetext	//'无效时间格式，格式如："22:34"'
});

/**
 * 新增方法：给Record对象添加一个取数字的方法。
 **/
Ext.data.Record.prototype.getNum = function(name){
	var value = this.data[name];
	if (value == null || value.length == 0) return 0;
		
	return parseFloat(value);
};

/**
 * ext-3.3.1
 * 修改方法：修改取字符长度的方法，如果是汉字则是两个字节。
 **/
Ext.form.TextField.prototype.getErrors = function(value) {
	var errors = Ext.form.TextField.superclass.getErrors.apply(this, arguments);
	
	value = Ext.isDefined(value) ? value : this.processValue(this.getRawValue());        
	
	if (Ext.isFunction(this.validator)) {
		var msg = this.validator(value);
		if (msg !== true) {
			errors.push(msg);
		}
	}
	
	if (value.length < 1 || value === this.emptyText) {
		if (this.allowBlank) {
			//if value is blank and allowBlank is true, there cannot be any additional errors
			return errors;
		} else {
			if (!this.isBlankCheck) {//add by tony.tan
				errors.push(this.blankText);
			}
		}
	}
	//modify by Tony.Tan
	if (!this.isBlankCheck && !this.allowBlank && (value.length < 1 || value === this.emptyText)) { // if it's blank
		errors.push(this.blankText);
	}
	
	//modify by Tony.Tan
	if (JxUtil.strlen(value) < this.minLength) {
		errors.push(String.format(this.minLengthText, this.minLength));
	}
	
	//modify by Tony.Tan
	if (JxUtil.strlen(value) > this.maxLength) {
		errors.push(String.format(this.maxLengthText, this.maxLength));
	}
	
	if (this.vtype) {
		var vt = Ext.form.VTypes;
		if(!vt[this.vtype](value, this)){
			errors.push(this.vtypeText || vt[this.vtype +'Text']);
		}
	}
	
	if (this.regex && !this.regex.test(value)) {
		errors.push(this.regexText);
	}
	
	return errors;
};

/**
 * ext-3.3.1
 * 增加方法：增加一种不检查必填项的校验方法，暂时未使用
 **/
Ext.form.BasicForm.prototype.isValidBlank = function(){
	var valid = true;
	this.items.each(function(f){
		f.isBlankCheck = true; //add by tony.tan
	   if(!f.validate()){
		   valid = false;
	   }
	   delete f.isBlankCheck; //add by tony.tan
	});
	return valid;
};


