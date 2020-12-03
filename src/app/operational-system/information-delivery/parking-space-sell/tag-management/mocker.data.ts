const STRING_MAX_LENGTH = 10;
const NUMBER_MAX_VALUE = 9999;

class MockDataHelper {
  /**
   * 随机范围内整数
   * @param min 最小值
   * @param max 最大值
   */
  public rangeRandom(min: number, max: number): number {
    return Math.round(Math.random() * (max - min)) + min;
  }
}

const mockDataHelper = new MockDataHelper();

abstract class MockData<T> {
  // 随机生成目标值
  public abstract random(): T;
}

class MockStringData extends MockData<string> {
  private telephoneHeads = ['131', '138', '150', '152'];
  private carIdOnes = ['黑', '吉', '辽'];
  private carIdTwos = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  private images = [
    'https://web-store.parkone.cn/operation/car/logo/baojun.png',
    'https://web-store.parkone.cn/operation/car/logo/baoma.png',
    'https://web-store.parkone.cn/operation/car/logo/baoshijie.png',
    'https://web-store.parkone.cn/operation/car/logo/feiyate.png',
    'https://web-store.parkone.cn/operation/car/logo/fengtian.png',
  ];

  /**
   * 数字符号字母字符串
   */
  public random(): string {
    let targetStr = '';
    // 长度 1-STRING_MAX_LENGTH
    const length = mockDataHelper.rangeRandom(1, STRING_MAX_LENGTH);
    // 生成ASCII码 33-126
    for (let index = 0; index < length; index++) {
      targetStr += String.fromCharCode(mockDataHelper.rangeRandom(33, 126));
    }
    return targetStr;
  }

  /**
   * 中文字符串
   */
  public randomZH(): string {
    let targetStr = '';
    const length = mockDataHelper.rangeRandom(1, STRING_MAX_LENGTH);
    for (let index = 0; index < length; index++) {
      // Unicode中文汉字编码范围
      // 16进制表示：\u4e00(对应汉字是"一")至\u9fa5(对应汉字是"龥")
      // 对应的十进制：19968至40869
      const decimalismCode = Math.round(Math.random() * 20901) + 19968;
      const hexCode = decimalismCode.toString(16);
      targetStr += unescape(('\\u' + hexCode).replace(/\\u/g, '%u'));
    }
    return targetStr;
  }

  /**
   * 手机号
   */
  public randomTelephone(): string {
    return this.telephoneHeads[Math.round(Math.random() * (this.telephoneHeads.length - 1))]
      + Math.round(Math.random() * 89999999 + 10000000);
  }

  /**
   * 车牌号
   */
  public randomCarId(): string {
    const a = this.carIdOnes[Math.round(Math.random() * (this.carIdOnes.length - 1))];
    const b = this.carIdTwos[Math.round(Math.random() * (this.carIdTwos.length - 1))];
    const c = Math.round(Math.random() * 9);
    const d = Math.round(Math.random() * 9);
    const e = Math.round(Math.random() * 9);
    const f = Math.round(Math.random() * 9);
    const g = Math.round(Math.random() * 9);
    return '' + a + b + c + d + e + f + g;
  }

  /**
   * 图片
   */
  public randomImage(): string {
    return this.images[Math.round(Math.random() * (this.images.length - 1))];
  }
}

class MockNumberData extends MockData<number> {
  public random(): number {
    return mockDataHelper.rangeRandom(0, NUMBER_MAX_VALUE);
  }
}

class MockBooleanData extends MockData<boolean> {
  public random(): boolean {
    return mockDataHelper.rangeRandom(0, 10) % 2 === 0;
  }
}

export class MockDataProvider {
  public strPro = new MockStringData();
  public numPro = new MockNumberData();
  public boolPro = new MockBooleanData();
  public helper = mockDataHelper;
}

export const mockDataProvider = new MockDataProvider();
