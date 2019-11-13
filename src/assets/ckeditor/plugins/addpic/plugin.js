(function () {
    //Section 1 : 按下自定义按钮时执行的代码
    var a = {
            exec: function (editor) {
                show(editor.name);
            },
        },
        b = 'addpic';
    CKEDITOR.plugins.add(b, {
        init: function (editor) {
            editor.addCommand(b, a);
            editor.ui.addButton('addpic', {
                label: '添加图片',
                icon: this.path + 'addpic.png',
                command: b,
            });
        },
    });

    function show(editorName) {
        if (editorName === 'editor1') {
            $('#uploadModal1').modal();
        } else if (editorName === 'editor2') {
            $('#uploadModal2').modal();
        } else if (editorName === 'editor3') {
            $('#uploadModal3').modal();
        } else if (editorName === 'descriptionEditor') {
            $('#descriptionUploadModal').modal();
        } else if (editorName === 'goodsEditor') {
            $('#GoodsUploadModal').modal();
        } else {
            $('#uploadModal').modal();
        }
    }
})();
