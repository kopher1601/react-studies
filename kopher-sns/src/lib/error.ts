import { AuthError } from "@supabase/supabase-js";

const AUTH_ERROR_MESSAGE_MAP: Record<string, string> = {
  email_exists: "既に使用されているメールアドレスです。",
  phone_exists: "既に使用されている電話番号です。",
  invalid_credentials: "メールアドレスまたはパスワードが正しくありません。",
  user_not_found: "該当するユーザーが見つかりません。",
  session_expired: "セッションが期限切れです。再度ログインしてください。",
  email_not_confirmed: "メール認証が必要です。",
  phone_not_confirmed: "電話番号認証が必要です。",
  weak_password: "パスワードが脆弱すぎます。",
  signup_disabled: "現在会員登録ができない状態です。",
  user_already_exists: "既に登録されているユーザーです。",
  captcha_failed: "セキュリティ認証に失敗しました。もう一度お試しください。",
  over_email_send_rate_limit:
    "メール送信上限を超えました。しばらくしてから再度お試しください。",
  over_sms_send_rate_limit:
    "SMS送信上限を超えました。しばらくしてから再度お試しください。",
  otp_expired: "OTPコードの有効期限が切れました。もう一度お試しください。",
  otp_disabled: "OTP使用が無効化されています。",
  email_address_invalid: "無効なメールアドレスです。",
  same_password: "以前と同じパスワードは使用できません。",
  validation_failed: "メールアドレスが正しく入力されていません。",
};

export function generateErrorMessage(error: unknown): string {
  if (error instanceof AuthError && error.code) {
    return AUTH_ERROR_MESSAGE_MAP[error.code] || "不明なエラーです。";
  }
  return "不明なエラーです。";
}
