/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
  config.height = 400;

  config.allowedContent = true; // 是否允许使用源码模式进行编辑

  config.toolbar = 'Full';
  /**
   * 工具栏全显示模式
   * @type {[null,null,null,string,null,null,null,null,null,string,null,null,null]}
   */
  config.toolbar_Full = [
    {
      name: 'editing', items: [
      'SpellChecker'
    ]
    },
    '/',
    {
      name: 'basicstyles', items: [
      'Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'
    ]
    },
    {
      name: 'links', items: [
      'Link', 'Unlink'
    ]
    },
    {
      name: 'paragraph', items:
      ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-',
        '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'
      ]
    },

    {
      name: 'insert', items: [
      'Image','Html5video', 'Table', 'HorizontalRule', 'Emojione', 'Video', 'Audio', 'Image2','SpecialChar', 'addpic',
    ]
    },
    {
      name: 'clipboard', items: [
      'Undo', 'Redo'
    ]
    },
    '/',
    {
      name: 'styles', items: [
      'Styles', 'Format', 'Font', 'FontSize'
    ]
    },
    {
      name: 'colors', items: [
      'TextColor', 'BGColor'
    ]
    },
    { name: 'tools', items : [ 'Maximize' ] },
    { name: 'document', items : [ 'Source']},
  ];
  config.extraPlugins = 'addpic';
};
