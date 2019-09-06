export class FileImportViewModel {
  public address = ''; // 暂时没发现哪用 by zwl
  public file: any;
  public type: any = '';

  private fileElement: any; // 上传文件控件（使用后需要手动清空，所以处理一下)

  initImportData() {
    // 选择了文件后清空文件路径
    if (this.fileElement) {
      $(this.fileElement).val('');
    }
    this.address = '';
    this.type = '';
    this.file = '';
  }

  /**
   * 选择文件
   * @param event 文件内容
   * @param fileElement 选择文件的控件
   */
  selectedFile(event, fileElement: any) {
    this.fileElement = fileElement;
    if (event.target.files.length !== 0) {
      const file = event.target.files[0];
      const name = event.target.files[0].name;
      this.address = name;
      this.file = file;
    }
  }

  checkFormDataValid(): boolean {
    if (!this.file) {
      console.log('文件地址不能为空，请选择！');
      return false;
    }
    return true;
  }
}
