class BaseModel {
  constructor(data, message) {
    if (typeof data === 'string') {
      // 只传了一个字符串类型
      this.message = data;
      data = null;
      message = null;
    }

    if (data) {
      this.data = data;
    }
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.error = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.error = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
};
