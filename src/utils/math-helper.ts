export class MathHelper {

  /**计算两个数字之和
   * @param numA 被加数
   * @param numB 加数
   */
  public static MathAdd(numA: number, numB: number): number {
    numA = numA || 0;
    numB = numB || 0;
    let pointLengthA: number; // numA小数点长度
    let pointLengthB: number; // numB小数点长度
    let baseNum: number; // 将numA和numB变为整数的公共乘数
    try {
      pointLengthA = numA.toString().split('.')[1].length;
    } catch (e) {
      pointLengthA = 0;
    }
    try {
      pointLengthB = numB.toString().split('.')[1].length;
    } catch (e) {
      pointLengthB = 0;
    }
    baseNum = Math.pow(10, Math.max(pointLengthA, pointLengthB));
    return (this.MathMul(numA, baseNum) + this.MathMul(numB, baseNum)) / baseNum;
  }

  /**计算两个数字乘积
   * @param numA
   * @param numB
   */
  public static MathMul(numA: number, numB: number): number {
    numA = numA || 0;
    numB = numB || 0;
    return Math.round(numA * numB);
  }

  /**
   * 头部补全(默认用0补齐)
   * @static
   * @param {*} baseData 被填充字符串
   * @param {number} maxLength 字符串最大长度
   * @param {string} [fillString] 填充字符串
   * @returns {string}
   */
  public static MathPadStart(baseData: any, maxLength: number, fillString?: string): string {
    return (baseData || '').toString().padStart(maxLength, fillString ? fillString : 0);
  }

  /**
   * 尾部补全(默认用0补齐)
   * @static
   * @param {*} baseData 被填充字符串
   * @param {number} maxLength 字符串最大长度
   * @param {string} [fillString] 填充字符串
   * @returns {string}
   */
  public static MathPadEnd(baseData: any, maxLength: number, fillString?: string): string {
    return (baseData || '').toString().padEnd(maxLength, fillString ? fillString : 0);
  }
}
