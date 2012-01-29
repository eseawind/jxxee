/*!
 * Copyright 2011 Guangzhou Donghong Software Technology Inc.
 * Licensed under the GNU GPL Version 3.0
 */
 
/**
 * 生成表格统计数据栏的控件。
 * 
 * @author TonyTan
 * @version 1.0, 2010-01-01
 */

Ext.ns('Jxstar');
Jxstar.JxSum = Ext.extend(Ext.util.Observable, {

    constructor : function(config){
        Ext.apply(this, config);
        Jxstar.JxSum.superclass.constructor.call(this);
    },
	
    init : function(grid){
        this.grid = grid;
        this.cm = grid.getColumnModel();
        this.view = grid.getView();
		this.grid.jxsum = this;

        var v = this.view;

        v.afterMethod('onColumnWidthUpdated', this.doWidth, this);
        v.afterMethod('onAllColumnWidthsUpdated', this.doAllWidths, this);
        v.afterMethod('onColumnHiddenUpdated', this.doHidden, this);
        v.afterMethod('onUpdate', this.doUpdate, this);
        v.afterMethod('onRemove', this.doRemove, this);

        if(!this.rowTpl){
            this.rowTpl = new Ext.Template(
                '<div class="x-grid3-summary-row x-grid3-row-sum" style="{tstyle}">',
                '<table class="x-grid3-summary-table" border="0" cellspacing="0" cellpadding="0" style="{tstyle}">',
                    '<tbody><tr>{cells}</tr></tbody>',
                '</table></div>'
            );
            this.rowTpl.disableFormats = true;
        }
        this.rowTpl.compile();

        if(!this.cellTpl){
            this.cellTpl = new Ext.Template(
                '<td class="x-grid3-td-{id} {css}" style="{style}">',
                '<div class="x-grid3-col-{id}" unselectable="on">{value}</div>',
                '</td>'
            );
            this.cellTpl.disableFormats = true;
        }
        this.cellTpl.compile();
    },

    /**
     * 关闭或显示统计栏
     */
    toggleSummaries : function(visible){
        var el = this.grid.getGridEl();
        if(el){
            if(visible === undefined){
                visible = el.hasClass('x-grid-hide-summary');
            }
            el[visible ? 'removeClass' : 'addClass']('x-grid-hide-summary');
        }
    },

    doRender : function(data){
        var cs = this.view.getColumnData();
        var cfg = this.cm.config;

        var buf = [], c, p = {}, cf, last = cs.length-1;
        for(var i = 0, len = cs.length; i < len; i++){
            c = cs[i];
            cf = cfg[i];
			if (cf.hidden) continue;

            p.id = c.id;
            //p.style = c.style;
            //p.css = i == 0 ? 'x-grid3-cell-first ' : (i == last ? 'x-grid3-cell-last ' : '');
            p.value = data[c.name];
			if (i == 0) {
				p.style = 'padding:2 0 0 2px;border-right:1px solid #b7b7b7;';
				p.css = "x-grid3-header";
				p.value = "<img style='width:16px; height:16px;padding:0px;margin:0px;' src='./resources/images/icons/button/grid_sum.gif' title='"+ jx.star.sumbar +"'>";	//合计栏
			} else {
				p.style = c.style;
				p.css = "x-grid3-col x-grid3-cell";
				if(p.value == undefined || p.value === "") p.value = "&#160;";
			}
            buf[buf.length] = this.cellTpl.apply(p);
        }

        return this.rowTpl.apply({
            tstyle: 'width:'+this.view.getTotalWidth()+';height:22px;',
            cells: buf.join('')
        });
    },

    doWidth : function(col, w, tw){
		var bbar = this.grid.getBottomToolbar();
        var s = bbar.getEl().prev().dom;
			s.style.width = tw;
			s.firstChild.style.width = tw;
			s.firstChild.rows[0].childNodes[col].style.width = w;
    },

    doAllWidths : function(ws, tw){
        var cells, wlen = ws.length;
        var bbar = this.grid.getBottomToolbar();
        var s = bbar.getEl().prev().dom;
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            cells = s.firstChild.rows[0].childNodes;
            for(var j = 0; j < wlen; j++){
                cells[j].style.width = ws[j];
            }
    },

    doHidden : function(col, hidden, tw){
        var display = hidden ? 'none' : '';
        var bbar = this.grid.getBottomToolbar();
        var s = bbar.getEl().prev().dom;
            s = gs[i].childNodes[2];
            s.style.width = tw;
            s.firstChild.style.width = tw;
            s.firstChild.rows[0].childNodes[col].style.display = display;
    },

    // Note: requires that all (or the first) record in the
    // group share the same group value. Returns false if the group
    // could not be found.
    refreshSummary : function(groupValue){
        return this.refreshSummaryById(this.view.getGroupId(groupValue));
    },

    getSummaryNode : function(gid){
        var g = Ext.fly(gid, '_gsummary');
        if(g){
            return g.down('.x-grid3-summary-row', true);
        }
        return null;
    },

    refreshSummaryById : function(gid){
        var g = document.getElementById(gid);
        if(!g){
            return false;
        }
        var rs = [];
        this.grid.store.each(function(r){
            if(r._groupId == gid){
                rs[rs.length] = r;
            }
        });
        var cs = this.view.getColumnData();
        var data = this.calculate(rs, cs);
        var markup = this.renderSummary({data: data}, cs);

        var existing = this.getSummaryNode(gid);
        if(existing){
            g.removeChild(existing);
        }
        Ext.DomHelper.append(g, markup);
        return true;
    },

	refresh : function(data) {
		var bbar = this.grid.getBottomToolbar();
		bbar.getEl().prev().remove();

		var vh = this.doRender(data);
		bbar.getEl().insertHtml('beforeBegin', vh);
		//重新显示表格
		this.grid.doLayout();
	},

    doUpdate : function(ds, record){
        this.refreshSummaryById(record._groupId);
    },

    doRemove : function(ds, record, index, isUpdate){
        if(!isUpdate){
            this.refreshSummaryById(record._groupId);
        }
    }
});
