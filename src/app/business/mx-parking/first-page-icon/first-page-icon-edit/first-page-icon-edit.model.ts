/**
 * Created by zack on 28/6/17.
 */

export class WriteServiceImportViewModel {

  public product_id = '';
  public address = ''; //   暂时没发现哪用 by zwl
  public file: any;

  private fileElement: any; //   上传文件控件（使用后需要手动清空，所以处理一下)
  public uploadImg = false;
  public base: any;
  public hasErrorTip = false;
  public errorTip = '';

  initImportData() {
    //   选择了文件后清空文件路径
    if (this.fileElement) {
      $(this.fileElement).val('');
    }
    this.product_id = '';
    this.address = '';
    this.file = '';
  }

  /**
   * 选择文件
   * @param event 文件内容
   * @param fileElement 选择文件的控件
   */
  selectedFile(event, fileElement: any) {
    this.file = '';
    this.uploadImg = false;
    this.hasErrorTip = false ;
    //  图片格式
    const fileTypes = ['.jpg', '.png' , '.gif'];

    const filePath = event.target.files[0].name;
    this.fileElement = fileElement;
    if (event.target.files.length !== 0) {
      const file = event.target.files[0];

      const img = new Image();
      //  在pic的文件里抓取该文件用于显示二进制信息
      const src = window.URL.createObjectURL(file);
      img.src = src;
      let isNext = false;
      const fileEnd = filePath.substring(filePath.indexOf('.'));
      for (let i = 0; i < fileTypes.length; i++) {
        if (fileTypes[i] === fileEnd) {
          isNext = true;
          break;
        }
      }
      if (!isNext) {
        file.value = '';
        this.hasErrorTip = true ;
        this.errorTip = '文件名或文件格式不正确,且只能上传jpg/png/gif格式的图片';
        $('#file-upload').val('');
        return false;
      } else {
        this.hasErrorTip = false ;
        const name = event.target.files[0].name;
        this.address = name;

        const imgSrc = img.src;
        if (fileEnd === '.gif') {
          //  图片大小
          this.sizeVertical(file , file);
        } else {
          this.dealImage( file, imgSrc, {
            width: 1024
          }, (base) => {
            // console.log("压缩后：" + base.length / 1024 + "   " + base);
          });
        }

        return false;
      }
    }
  }

  /**
   * 将以base64的图片url数据转换为File
   * @param urlData
   *            用url方式表示的base64图片数据
   */
  dataURLtoFile(dataurl, filename, file) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    this.sizeVertical(file , new File([u8arr], filename, {type: mime}));
  }

  // 图片压缩
  dealImage( file, path, obj, callback) {
    let con = '';
    const img = new Image();
    img.src = path;
    img.onload = () => {
      //  默认按比例压缩
      let w = img.width;
      let h = img.height;
      const scale = w / h;
      if (w > 1024) {
        w = obj.width;
        h = (w / scale);
      } else {
        w = w;
        h = h;
      }
      let quality = 0.9;        //  默认图片质量为0.9

      // 生成canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      //  创建属性节点
      const anw = document.createAttribute('width');
      anw.nodeValue = String(w);
      const anh = document.createAttribute('height');

      anh.nodeValue = String(h);
      canvas.setAttributeNode(anw);
      canvas.setAttributeNode(anh);

      ctx.drawImage(img, 0, 0, w, h);
      //  图像质量
      if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
        quality = obj.quality;
      }
      //  quality值越小，所绘制出的图像越模糊
      const base64 = canvas.toDataURL('image/jpeg', quality);
      //  回调函数返回base64的值
      callback(base64);
      con = base64;
      this.dataURLtoFile(con, file.name, file);
    };
  }

  sizeVertical(file , endFile) {
    const baseChangeFile = file.size;

    //  图片大小
    const fileMaxSize = 1024 * 5; //  5M
    const fileSize = baseChangeFile;
    const size = fileSize / 1024;
    if (size > fileMaxSize) {
      file.value = '';
      this.uploadImg = false;
      this.hasErrorTip = true ;
      this.errorTip = '上传图片文件不能大于5M,请重新上传';
      $('#file-upload').val('');
      return false;
    } else if (size <= 0) {
      file.value = '';
      this.uploadImg = false;
      this.hasErrorTip = true ;
      this.errorTip = '上传图片文件不能大于5M,请重新上传';
      $('#file-upload').val('');
      return false;
    } else {
      this.hasErrorTip = false ;
      this.file = endFile;
    }
  }

}
