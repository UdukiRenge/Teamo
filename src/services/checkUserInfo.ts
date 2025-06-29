import { messages } from '../constants/message';

type inputCheckResult = {
  success: boolean;
  errorMessage?: string;
}

// 登録時の入力チェック
export const checkUserInfoRegister = (id: string, pass: string, passCheck: string, name: string): inputCheckResult => {
  // 未入力の項目がないか確認
  if (!(id && pass && passCheck && name)) {
    // 「未入力の項目があります。確認してください」
    return {
      success: false,
      errorMessage: messages.ERROR.E005
    };
  }

  // 文字数チェック
  // ユーザーIDが8字以上、20字以下であるか
  if (id.length < 8 || id.length > 20) {
    // 「ユーザーIDが不正です。8字以上20字以下で設定してください。」
    return {
      success: false,
      errorMessage: messages.ERROR.E006
    };
  }

  // パスワードの形式チェック
  const passCheckResult = passwordCheck(pass!);

  if (!passCheckResult.success) {
    return {
      success: passCheckResult.success,
      errorMessage: passCheckResult.errorMessage
    };
  }

  // ユーザー名が2字以上、20字以下であるか
  if (name.length < 2 || name.length > 20) {
    // 「ユーザー名が不正です。8字以上20字以下で設定してください。」
    return {
      success: false,
      errorMessage: messages.ERROR.E008
    };
  }

  // 連続して同じパスワードが入力できているか検証
  if (pass !== passCheck) {
    // 「パスワード(確認用)が誤っています。パスワードを確認してください。」
    return {
      success: false,
      errorMessage: messages.ERROR.E003
    };
  }

  return { success: true };
}

// ログイン時の入力チェック
export const checkUserInfoLogin = (id: string, pass: string ): inputCheckResult => {
  // 未入力チェック
  if (!id || !pass) {  
    return {
      success: false,
      errorMessage: messages.ERROR.E005
    };
  }
  
  // 文字数チェック
  // ユーザーIDが8字以上、20字以下であるか
  if (id.length < 8 || id.length > 20) {
    // 「ユーザーIDが不正です。8字以上20字以下で設定してください。」
    return {
      success: false,
      errorMessage: messages.ERROR.E006
    };
  }
  
  // パスワードの形式チェック
  const passCheckResult = passwordCheck(pass!);

  if (!passCheckResult.success) {
    return {
      success: passCheckResult.success,
      errorMessage: passCheckResult.errorMessage
    };
  }

  return { success: true };
};

// 更新時の入力チェック
export const checkUserInfoUpdate = (nowPass?: string, pass?: string, passCheck?: string, name?: string): inputCheckResult => {
  let passChange = true;

  // パスワードの未入力チェック
  if (!nowPass && !pass && !passCheck) {
    // 全て未入力 → パスワード変更なし
    passChange = false;
  } else if (!nowPass || !pass || !passCheck) {
    // 一部未入力 → エラー
    return {
      success: false,
      errorMessage: messages.ERROR.E013
    };
  }

  // 全項目の未入力チェック
  if (!passChange && !name) {
    return {
      success: false,
      errorMessage: messages.ERROR.E014
    };
  }

  // 以降は全ての項目が入力されている前提でチェックを進められる。

  if (passChange) {
    // 現在のパスワードの形式チェック
    const nowPassCheck = passwordCheck(nowPass!);

    if (!nowPassCheck.success) {
      return {
        success: nowPassCheck.success,
        errorMessage: nowPassCheck.errorMessage
      };
    }

    // 新しいパスワードの形式チェック
    const newPassCheck = passwordCheck(pass!);

    if (!newPassCheck.success) {
      return {
        success: newPassCheck.success,
        errorMessage: newPassCheck.errorMessage
      };
    }

    // 連続して同じパスワードが入力できているか検証
    if (pass !== passCheck) {
      // 「パスワード(確認用)が誤っています。パスワードを確認してください。」
      return {
        success: false,
        errorMessage: messages.ERROR.E003
      };
    }
  }

  // ユーザー名が入力されている場合に以降の処理を実施する。
  if (name) {
    // ユーザー名が2字以上、20字以下であるか
    if (name.length < 2 || name.length > 20) {
      // 「パスワードが不正です。8字以上20字以下で設定してください。」
      return {
        success: false,
        errorMessage: messages.ERROR.E008
      };
    }
  }

  return { success: true };
}

// パスワードの形式チェックを行う
const passwordCheck = (password: string): inputCheckResult => {
  // 字数がパスワードが8字以上、20字以下であるか
  if (password!.length < 8 || password!.length > 20) {
    // 「パスワードが不正です。8字以上20字以下で設定してください。」
    return {
      success: false,
      errorMessage: messages.ERROR.E007
    };
  }

  // パスワードに英大文字・英小文字・数字の全てが含まれているか検証
  // 半角のみの入力は入力時に制御していることを前提としている。
  const hasUpperCase = /[A-Z]/.test(password!);
  const hasLowerCase = /[a-z]/.test(password!);
  const hasDigit = /[0-9]/.test(password!);

  if (!(hasUpperCase && hasLowerCase && hasDigit)) {
    // 「パスワードポリシー違反です。英大文字・英小文字・数字の全てを含めてください。」
    return {
      success: false,
      errorMessage: messages.ERROR.E004
    };
  }

  return { success: true };
}

