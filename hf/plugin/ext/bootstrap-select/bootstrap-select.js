;(function($){
    'use strict';
    $.fn.selectpicker.defaults = {
        noneSelectedText: '没有选中任何项',
        noneResultsText: '没有找到匹配项 {0}',
        countSelectedText: "选中{1}中的{0}项",
        maxOptionsText: ['超出限制 (最多选择{n}项)', '组选择超出限制(最多选择{n}组)'],
        selectAllText: '选中所有',
        deselectAllText: '删除所有',
        doneButton: false,
        doneButtonText: 'Close',
        multipleSeparator: ', ',
        styleBase: 'btn',
        style: 'btn-default',
        size: 'auto',
        title: null,
        selectedTextFormat: 'values',
        width: false,
        container: false,
        hideDisabled: false,
        showSubtext: false,
        showIcon: true,
        showContent: true,
        dropupAuto: false,
        header: false,
        liveSearch: false,
        liveSearchPlaceholder: null,
        liveSearchNormalize: false,
        liveSearchStyle: 'contains',
        actionsBox: false,
        iconBase: 'fa',
        tickIcon: 'fa-check',
        showTick: false,
        template: {
            caret: '<span class="caret"></span>'
        },
        maxOptions: false,
        mobile: false,
        selectOnTab: false,
        dropdownAlignRight: false
    };
}(jQuery));