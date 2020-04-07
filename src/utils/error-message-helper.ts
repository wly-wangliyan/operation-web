import { isUndefined } from 'util';

export class ErrMessageBase {
  public isError = false;
  public errMes: string;

  constructor(isError?: boolean, errMes?: string) {
    if (!isError || isUndefined(errMes)) {
      return;
    }
    this.isError = isError;
    this.errMes = errMes;
  }
}

export class ErrMessageGroup {
  errJson: { [key: string]: ErrMessageBase };
}
