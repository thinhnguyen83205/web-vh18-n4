import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Alert,
  Tabs,
  Typography,
  message,
} from "antd";
import {  
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import { login, registerCustomer } from "../../utils/auth";

function LoginForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values) => {
    setLoading(true);
    setError("");
    const user = await login(values.username.trim(), values.password);
    setLoading(false);

    if (!user) {
      setError("Tài khoản hoặc mật khẩu không đúng.");
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/");
  };

  const handleRegister = (values) => {
    setError("");
    const result = registerCustomer(values);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    message.success("Đăng ký tài khoản thành công.");
    navigate("/");
  };

  return (
    <div className={styles["login-page"]}>
      <Card className={styles["login-card"]}>
        <h1 className={styles["login-title"]}>Đăng nhập</h1>
        <p className={styles["login-hint"]}>
          Admin: admin/admin123 - Khách hàng: customer/123456
        </p>
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />}
        <Tabs
          centered
          items={[
            {
              key: "login",
              label: "Đăng nhập",
              children: (
                <Form layout="vertical" onFinish={handleLogin}>
                  <Form.Item
                    label="Tài khoản"
                    name="username"
                    rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Tên đăng nhập, email hoặc số điện thoại" />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                  >
                    <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
                  </Form.Item>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                      Đăng nhập
                    </Button>
                  </Form.Item>
                </Form>
              ),
            },
            {
              key: "register",
              label: "Đăng ký",
              children: (
                <>
                  <Typography.Paragraph className={styles["register-hint"]}>
                    Tạo tài khoản khách hàng để đặt tour, khách sạn, vé máy bay và xe tự lái.
                  </Typography.Paragraph>
                  <Form layout="vertical" onFinish={handleRegister}>
                    <Form.Item
                      label="Họ và tên"
                      name="fullName"
                      rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item
                      label="Tên đăng nhập"
                      name="username"
                      rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="ten_dang_nhap" />
                    </Form.Item>

                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Vui lòng nhập email" },
                        { type: "email", message: "Email không hợp lệ" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="email@example.com" />
                    </Form.Item>

                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="0901234567" />
                    </Form.Item>

                    <Form.Item
                      label="Mật khẩu"
                      name="password"
                      rules={[
                        { required: true, message: "Vui lòng nhập mật khẩu" },
                        { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Tối thiểu 6 ký tự" />
                    </Form.Item>

                    <Form.Item
                      label="Nhập lại mật khẩu"
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "Vui lòng nhập lại mật khẩu" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error("Mật khẩu nhập lại không khớp"));
                          },
                        }),
                      ]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                      <Button type="primary" htmlType="submit" block>
                        Đăng ký
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}

export default LoginForm;
