export const USERS_MESSAGES = {
  ADDRESS_IS_REQUIRED: 'Địa chỉ không được để trống!',
  ADDRESS_LENGTH_MUST_BE_FROM_5_TO_255:
    'Địa chỉ phải có độ dài từ 5 đến 255 ký tự',
  VALIDATION_ERROR: 'Lỗi xác thực',
  NAME_IS_REQUIRED: 'Tên không được để trống',
  NAME_MUST_BE_A_STRING: 'Tên phải là một chuỗi',
  NAME_LENGTH_MUST_BE_FROM_3_TO_100: 'Tên phải có độ dài từ 3 đến 100 ký tự',
  NAME_LENGTH_MUST_BE_FROM_2_TO_100: 'Tên phải có độ dài từ 2 đến 100 ký tự',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  EMAIL_IS_REQUIRED: 'Email không được để trống',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_IS_INCORRECT: 'Email không đúng',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email hoặc mật khẩu không đúng',
  PASSWORD_IS_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_IS_INCORRECT: 'Mật khẩu không đúng',
  PASSWORD_MUST_BE_A_STRING: 'Mật khẩu phải là một chuỗi',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50:
    'Mật khẩu phải có độ dài từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRONG:
    'Mật khẩu phải chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một số, và một ký tự đặc biệt',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu không được để trống',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD:
    'Xác nhận mật khẩu phải giống với mật khẩu',
  LOGIN_SUCCESSFULLY: 'Đăng nhập thành công',
  LOGIN_FAIL: 'Đăng nhập không thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token không được để trống',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token không được để trống',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token không hợp lệ',
  USED_REFRESH_TOKEN_OR_NOT_EXIST:
    'Refresh token đã sử dụng hoặc không tồn tại',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  USERS_NOT_FOUND: 'Không tìm thấy người dùng nào',
  USERNAME_LENGTH: 'Tên đăng nhập phải có độ dài từ 3 đến 50 ký tự',
  GET_ME_SUCCESS: 'Lấy thông tin cá nhân thành công',
  USER_NOT_VERIFIED: 'Người dùng chưa được xác thực',
  USERNAME_MUST_BE_STRING: 'Tên đăng nhập phải là một chuỗi',
  USERNAME_IS_REQUIRED: 'Tên đăng nhập không được để trống',
  USERNAME_NOT_FOUND: 'Tên đăng nhập không đúng',
  USERNAME_INVALID:
    'Tên đăng nhập phải từ 4-15 ký tự và chỉ chứa chữ, số, dấu gạch dưới, không chỉ bao gồm số',
  IMAGE_URL_MUST_BE_STRING: 'URL ảnh đại diện phải là một chuỗi',
  IMAGE_URL_LENGTH: 'URL ảnh đại diện phải có độ dài từ 1 đến 200 ký tự',
  UPDATE_ME_SUCCESS: 'Cập nhật hồ sơ thành công',
  GET_PROFILE_SUCCESS: 'Lấy hồ sơ thành công',
  FOLLOW_SUCCESS: 'Theo dõi thành công',
  INVALID_USER_ID: 'ID người dùng không hợp lệ',
  USER_ID_IS_REQUIRED: 'ID người dùng không được để trống',
  USERNAME_EXISTED: 'Tên đăng nhập đã tồn tại',
  OLD_PASSWORD_NOT_MATCH: 'Mật khẩu cũ không khớp',
  CHANGE_PASSWORD_SUCCESS: 'Đổi mật khẩu thành công',
  GMAIL_NOT_VERIFIED: 'Gmail chưa được xác thực',
  UPLOAD_SUCCESS: 'Tải lên thành công',
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công',
  IMAGE_NOT_FOUND: 'Không tìm thấy hình ảnh',
  VIDEO_NOT_FOUND: 'Không tìm thấy video',

  PHONE_IS_REQUIRED: 'Số điện thoại không được để trống.',
  PHONE_IS_INVALID: 'Số điện thoại không hợp lệ.',
} as const;
