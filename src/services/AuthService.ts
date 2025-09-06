import { AuthController } from '@/controllers/AuthController';
import { UserModel } from '@/models/User';

export class AuthService {
  static async handleLogin(email: string, password: string) {
    // Validation
    if (!UserModel.validateEmail(email)) {
      return { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' };
    }

    if (!UserModel.validatePassword(password)) {
      return { success: false, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
    }

    // Call controller
    return await AuthController.login(email, password);
  }

  static async handleRegister(email: string, password: string, displayName: string) {
    // Validation
    if (!UserModel.validateEmail(email)) {
      return { success: false, error: 'รูปแบบอีเมลไม่ถูกต้อง' };
    }

    if (!UserModel.validatePassword(password)) {
      return { success: false, error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' };
    }

    if (!UserModel.validateDisplayName(displayName)) {
      return { success: false, error: 'ชื่อแสดงต้องมีอย่างน้อย 2 ตัวอักษร' };
    }

    // Call controller
    return await AuthController.register(email, password, displayName);
  }

  static async handleLogout() {
    return await AuthController.logout();
  }

  static async getCurrentUser() {
    return await AuthController.getCurrentUser();
  }
}