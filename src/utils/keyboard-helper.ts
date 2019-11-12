enum SpecialKeyCode {
    Enter = 13,
    UpArrow = 38,
    DownArrow = 40,
    LeftArrow = 37,
    RightArrow = 39,
    Escape = 27,
    SpaceBar = 32,
    Ctrl = 17,
    Alt = 18,
    Tab = 9,
    Shift = 16,
    CapsLock = 20,
    WindowsKey = 91,
    WindowsOptionKey = 93,
    Backspace = 8,
    Home = 36,
    End = 35,
    Insert = 45,
    Delete = 46,
    PageUp = 33,
    PageDown = 34,
    NumLock = 144,
    PrintScreen = 44,
    ScrollLock = 145,
    PauseBreak = 19,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
}

class KeyboardConst {

    /**
     * 绑定需要协助校验的元素
     * @param id dom元素id
     * @param reg 正则表达式,当前默认值为两位小数数字
     * @param ignoreSpace 是否忽略空格,默认忽略
     */
    bindElement(id: string, reg = /^\d+(\.\d{0,2})?$/, ignoreSpace = true) {
        const inputElement = $('#' + id);
        inputElement.keydown((event) => {
            const keyCode = event.which;

            if (keyCode == SpecialKeyCode.SpaceBar && ignoreSpace) {
                // 输入操作都
                event.preventDefault();
            }

            for (let key in SpecialKeyCode) {
                if (key == keyCode) {
                    // 特殊输入略过即可
                    return;
                }
            }

            const start = inputElement[0].selectionStart;
            const end = inputElement[0].selectionEnd;

            const preValue = event.target.value;
            const newValue = preValue.substring(0, start) + event.key + preValue.substring(end);
            if (!reg.test(newValue)) {
                // 新值无效，则阻止此次输入
                event.preventDefault();
            }
        });
        inputElement.on('input', (event) => {
            // 在输入完成时校验是否为正确格式，如果非正确则清空
            if (!reg.test(event.target.value)) {
                event.target.value = '';
            }
        });
    }

    /**
     * 解除绑定
     * @param id dom元素id
     */
    unBindElement(id: string) {
        const inputElement = $('#' + id);
        inputElement.unbind();
    }
}

export let KeyboardHelper = new KeyboardConst();
