import React, { useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Popconfirm,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  BarChart3,
  BedDouble,
  Car,
  ClipboardList,
  Edit,
  LogOut,
  Plane,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.scss";
import database from "../../database.json";
import { logout } from "../../utils/auth";

const { Content, Header, Sider } = Layout;
const { TextArea } = Input;

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const numberFormatter = new Intl.NumberFormat("vi-VN");

const splitText = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const createId = (prefix) => `${prefix}_${Date.now()}`;

const resourceConfigs = {
  users: {
    title: "Khách hàng",
    prefix: "user",
    dataKey: "users",
    defaults: { avatar: "", createdAt: new Date().toISOString() },
    fields: [
      { name: "fullName", label: "Họ tên", required: true },
      { name: "email", label: "Email", required: true, type: "email" },
      { name: "phone", label: "Số điện thoại", required: true },
      { name: "avatar", label: "Avatar URL" },
    ],
  },
  hotels: {
    title: "Khách sạn",
    prefix: "hotel",
    dataKey: "hotels",
    defaults: { type: "Khách sạn", pricing: [] },
    arrayFields: ["amenities"],
    fields: [
      { name: "name", label: "Tên khách sạn", required: true },
      { name: "location", label: "Khu vực", required: true },
      { name: "description", label: "Mô tả", component: "textarea" },
      { name: "rating", label: "Đánh giá", component: "number", min: 0, max: 5, step: 0.1 },
      { name: "priceFrom", label: "Giá từ", component: "number", min: 0 },
      { name: "image", label: "Ảnh URL" },
      { name: "amenities", label: "Tiện ích", component: "textarea", help: "Ngăn cách bằng dấu phẩy" },
    ],
  },
  tours: {
    title: "Tour du lịch",
    prefix: "tour",
    dataKey: "tours",
    defaults: { type: "Tour du lịch", pricing: [] },
    arrayFields: ["includes"],
    fields: [
      { name: "name", label: "Tên tour", required: true },
      { name: "location", label: "Địa điểm", required: true },
      { name: "duration", label: "Thời lượng" },
      { name: "description", label: "Mô tả", component: "textarea" },
      { name: "rating", label: "Đánh giá", component: "number", min: 0, max: 5, step: 0.1 },
      { name: "priceFrom", label: "Giá từ", component: "number", min: 0 },
      { name: "image", label: "Ảnh URL" },
      { name: "includes", label: "Bao gồm", component: "textarea", help: "Ngăn cách bằng dấu phẩy" },
    ],
  },
  cars: {
    title: "Xe tự lái",
    prefix: "car",
    dataKey: "cars",
    defaults: { type: "Xe tự lái", pricing: [] },
    fields: [
      { name: "name", label: "Tên xe", required: true },
      { name: "location", label: "Khu vực", required: true },
      { name: "description", label: "Mô tả", component: "textarea" },
      { name: "rating", label: "Đánh giá", component: "number", min: 0, max: 5, step: 0.1 },
      { name: "priceFrom", label: "Giá thuê từ", component: "number", min: 0 },
      { name: "image", label: "Ảnh URL" },
      { name: ["specs", "seats"], label: "Số chỗ", component: "number", min: 1 },
      { name: ["specs", "fuel"], label: "Nhiên liệu" },
      { name: ["specs", "transmission"], label: "Hộp số" },
    ],
  },
  flights: {
    title: "Vé máy bay",
    prefix: "flight",
    dataKey: "flights",
    defaults: { type: "Máy bay", pricing: [] },
    arrayFields: ["schedules"],
    fields: [
      { name: "airline", label: "Hãng bay", required: true },
      { name: "from", label: "Mã đi" },
      { name: "fromFull", label: "Điểm đi", required: true },
      { name: "to", label: "Mã đến" },
      { name: "toFull", label: "Điểm đến", required: true },
      { name: "name", label: "Tên tuyến" },
      { name: "duration", label: "Thời gian bay" },
      { name: "description", label: "Mô tả", component: "textarea" },
      { name: "rating", label: "Đánh giá", component: "number", min: 0, max: 5, step: 0.1 },
      { name: "priceFrom", label: "Giá từ", component: "number", min: 0 },
      { name: "image", label: "Ảnh URL" },
      { name: "schedules", label: "Lịch bay", component: "textarea", help: "Ngăn cách bằng dấu phẩy" },
    ],
  },
  bookings: {
    title: "Đơn đặt dịch vụ",
    prefix: "booking",
    dataKey: "bookings",
    defaults: { createdAt: new Date().toISOString() },
    fields: [
      { name: "userId", label: "Mã khách hàng", required: true },
      { name: "itemId", label: "Mã dịch vụ", required: true },
      { name: "itemType", label: "Loại dịch vụ", component: "select", options: ["Khách sạn", "Tour du lịch", "Xe tự lái", "Máy bay"] },
      { name: "itemName", label: "Tên dịch vụ", required: true },
      { name: "checkIn", label: "Ngày bắt đầu" },
      { name: "checkOut", label: "Ngày kết thúc" },
      { name: "numberOfPeople", label: "Số người/vé", component: "number", min: 1 },
      { name: "pricePerPerson", label: "Đơn giá", component: "number", min: 0 },
      { name: "totalPrice", label: "Tổng tiền", component: "number", min: 0 },
      { name: "status", label: "Trạng thái", component: "select", options: database.bookingStatusTypes.map((item) => item.name) },
    ],
  },
};

const menuItems = [
  { key: "dashboard", icon: <BarChart3 size={18} />, label: "Thống kê" },
  { key: "users", icon: <Users size={18} />, label: "Khách hàng" },
  { key: "bookings", icon: <ClipboardList size={18} />, label: "Đơn đặt" },
  { key: "hotels", icon: <BedDouble size={18} />, label: "Khách sạn" },
  { key: "flights", icon: <Plane size={18} />, label: "Vé máy bay" },
  { key: "cars", icon: <Car size={18} />, label: "Xe tự lái" },
  { key: "tours", icon: <ClipboardList size={18} />, label: "Tour" },
];

function AdminPage() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("dashboard");
  const [form] = Form.useForm();
  const [modalState, setModalState] = useState({ open: false, mode: "create", record: null });
  const [keyword, setKeyword] = useState("");
  const [data, setData] = useState(() =>
    Object.keys(resourceConfigs).reduce((acc, key) => {
      acc[key] = database[resourceConfigs[key].dataKey] || [];
      return acc;
    }, {}),
  );

  const stats = useMemo(() => {
    const bookings = data.bookings || [];
    const paidBookings = bookings.filter((booking) => booking.status !== "Đã hủy");
    const revenue = paidBookings.reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0);
    const soldFlightTickets = paidBookings
      .filter((booking) => String(booking.itemType).includes("Máy bay"))
      .reduce((sum, booking) => sum + Number(booking.numberOfPeople || 1), 0);
    const rentedCars = paidBookings.filter((booking) => String(booking.itemType).includes("Xe")).length;

    return {
      revenue,
      soldFlightTickets,
      rentedCars,
      totalCustomers: data.users.length,
      totalHotels: data.hotels.length,
      totalFlights: data.flights.length,
      totalBookings: bookings.length,
    };
  }, [data]);

  const currentConfig = resourceConfigs[activeKey];

  const openCreateModal = () => {
    form.resetFields();
    setModalState({ open: true, mode: "create", record: null });
  };

  const openEditModal = (record) => {
    const initialValues = { ...record };

    currentConfig.arrayFields?.forEach((field) => {
      initialValues[field] = Array.isArray(record[field]) ? record[field].join(", ") : record[field];
    });

    form.setFieldsValue(initialValues);
    setModalState({ open: true, mode: "edit", record });
  };

  const closeModal = () => {
    form.resetFields();
    setModalState({ open: false, mode: "create", record: null });
  };

  const handleSave = (values) => {
    const normalizedValues = { ...values };

    currentConfig.arrayFields?.forEach((field) => {
      normalizedValues[field] = splitText(values[field]);
    });

    if (activeKey === "flights") {
      normalizedValues.name =
        normalizedValues.name || `${normalizedValues.fromFull || normalizedValues.from} → ${normalizedValues.toFull || normalizedValues.to}`;
    }

    setData((prevData) => {
      const currentList = prevData[activeKey] || [];
      const nextRecord =
        modalState.mode === "edit"
          ? { ...modalState.record, ...normalizedValues }
          : {
            ...currentConfig.defaults,
            ...normalizedValues,
            id: createId(currentConfig.prefix),
          };

      return {
        ...prevData,
        [activeKey]:
          modalState.mode === "edit"
            ? currentList.map((item) => (item.id === modalState.record.id ? nextRecord : item))
            : [nextRecord, ...currentList],
      };
    });

    message.success(modalState.mode === "edit" ? "Đã cập nhật dữ liệu." : "Đã thêm dữ liệu mới.");
    closeModal();
  };

  const handleDelete = (record) => {
    setData((prevData) => ({
      ...prevData,
      [activeKey]: prevData[activeKey].filter((item) => item.id !== record.id),
    }));
    message.success("Đã xóa dữ liệu.");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredRows = useMemo(() => {
    if (!currentConfig) {
      return [];
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    const rows = data[activeKey] || [];

    if (!normalizedKeyword) {
      return rows;
    }

    return rows.filter((row) => JSON.stringify(row).toLowerCase().includes(normalizedKeyword));
  }, [activeKey, currentConfig, data, keyword]);

  const renderTable = () => {
    const columns = getColumns(activeKey, handleDelete, openEditModal);

    return (
      <div className={styles["table-section"]}>
        <div className={styles["section-toolbar"]}>
          <div>
            <Typography.Title level={3}>{currentConfig.title}</Typography.Title>
          </div>
          <Space wrap>
            <Input
              allowClear
              prefix={<Search size={16} />}
              placeholder="Tìm kiếm"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              className={styles["search-input"]}
            />
            <Button type="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
              Thêm mới
            </Button>
          </Space>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredRows}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          scroll={{ x: 980 }}
        />
      </div>
    );
  };

  return (
    <Layout className={styles["admin-layout"]}>
      <Sider width={260} className={styles.sidebar}>
        <div className={styles.brand}>
          <Typography.Title level={4}>Travel Admin</Typography.Title>
          <Typography.Text>Quản trị dịch vụ du lịch</Typography.Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          items={menuItems}
          onClick={({ key }) => {
            setKeyword("");
            setActiveKey(key);
          }}
        />
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <div>
            <Typography.Title level={2}>{activeKey === "dashboard" ? "Thống kê tổng quan" : currentConfig.title}</Typography.Title>
            <Typography.Text type="secondary">Theo dõi doanh thu, đơn đặt và dữ liệu vận hành.</Typography.Text>
          </div>
          <Button icon={<LogOut size={16} />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </Header>

        <Content className={styles.content}>
          {activeKey === "dashboard" ? <Dashboard stats={stats} data={data} /> : renderTable()}
        </Content>
      </Layout>

      <Modal
        open={modalState.open}
        title={`${modalState.mode === "edit" ? "Cập nhật" : "Thêm"} ${currentConfig?.title.toLowerCase()}`}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={modalState.mode === "edit" ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <div className={styles["form-grid"]}>
            {currentConfig?.fields.map((field) => (
              <Form.Item
                key={Array.isArray(field.name) ? field.name.join(".") : field.name}
                label={field.label}
                name={field.name}
                help={field.help}
                rules={[
                  { required: field.required, message: `Vui lòng nhập ${field.label.toLowerCase()}` },
                  ...(field.type === "email" ? [{ type: "email", message: "Email không hợp lệ" }] : []),
                ]}
                className={field.component === "textarea" ? styles["form-wide"] : undefined}
              >
                {renderFormControl(field)}
              </Form.Item>
            ))}
          </div>
        </Form>
      </Modal>
    </Layout>
  );
}

function Dashboard({ stats, data }) {
  const topBookings = data.bookings.slice(0, 5);

  return (
    <Space direction="vertical" size={24} className={styles["dashboard"]}>
      <div className={styles["stats-grid"]}>
        <Metric title="Doanh thu" value={stats.revenue} formatter={(value) => currencyFormatter.format(value)} />
        <Metric title="Số vé đã bán" value={stats.soldFlightTickets} formatter={(value) => `${numberFormatter.format(value)} vé`} />
        <Metric title="Xe đang cho thuê" value={stats.rentedCars} formatter={(value) => `${numberFormatter.format(value)} xe`} />
        <Metric title="Khách hàng" value={stats.totalCustomers} />
        <Metric title="Khách sạn" value={stats.totalHotels} />
        <Metric title="Chuyến bay" value={stats.totalFlights} />
        <Metric title="Đơn đặt" value={stats.totalBookings} />
      </div>

      <div className={styles["table-section"]}>
        <Typography.Title level={3}>Đơn gần đây</Typography.Title>
        <Table
          rowKey="id"
          dataSource={topBookings}
          pagination={false}
          columns={[
            { title: "Dịch vụ", dataIndex: "itemName" },
            { title: "Loại", dataIndex: "itemType", render: (value) => <Tag>{value}</Tag> },
            { title: "Số người/vé", dataIndex: "numberOfPeople" },
            { title: "Tổng tiền", dataIndex: "totalPrice", render: (value) => currencyFormatter.format(value || 0) },
            { title: "Trạng thái", dataIndex: "status", render: (value) => <StatusTag value={value} /> },
          ]}
          scroll={{ x: 780 }}
        />
      </div>
    </Space>
  );
}

function Metric({ title, value, formatter }) {
  return (
    <div className={styles.metric}>
      <Statistic title={title} value={value} formatter={formatter} />
    </div>
  );
}

function renderFormControl(field) {
  if (field.component === "number") {
    return <InputNumber min={field.min} max={field.max} step={field.step || 1} className={styles["full-width"]} />;
  }

  if (field.component === "textarea") {
    return <TextArea rows={3} />;
  }

  if (field.component === "select") {
    return (
      <Select
        options={field.options.map((option) => ({
          label: option,
          value: option,
        }))}
      />
    );
  }

  return <Input />;
}

function getColumns(activeKey, handleDelete, openEditModal) {
  const actionColumn = {
    title: "Thao tác",
    key: "actions",
    fixed: "right",
    width: 150,
    render: (_, record) => (
      <Space>
        <Button size="small" icon={<Edit size={14} />} onClick={() => openEditModal(record)} />
        <Popconfirm
          title="Xóa dữ liệu này?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => handleDelete(record)}
        >
          <Button danger size="small" icon={<Trash2 size={14} />} />
        </Popconfirm>
      </Space>
    ),
  };

  const columnsByResource = {
    users: [
      { title: "Họ tên", dataIndex: "fullName", fixed: "left", width: 220 },
      { title: "Email", dataIndex: "email", width: 240 },
      { title: "Số điện thoại", dataIndex: "phone", width: 160 },
      { title: "Ngày tạo", dataIndex: "createdAt", width: 180, render: formatDate },
    ],
    hotels: [
      { title: "Tên khách sạn", dataIndex: "name", fixed: "left", width: 260 },
      { title: "Khu vực", dataIndex: "location", width: 200 },
      { title: "Đánh giá", dataIndex: "rating", width: 110 },
      { title: "Giá từ", dataIndex: "priceFrom", width: 150, render: (value) => currencyFormatter.format(value || 0) },
      { title: "Tiện ích", dataIndex: "amenities", width: 260, render: renderTags },
    ],
    tours: [
      { title: "Tên tour", dataIndex: "name", fixed: "left", width: 260 },
      { title: "Địa điểm", dataIndex: "location", width: 200 },
      { title: "Thời lượng", dataIndex: "duration", width: 150 },
      { title: "Đánh giá", dataIndex: "rating", width: 110 },
      { title: "Giá từ", dataIndex: "priceFrom", width: 150, render: (value) => currencyFormatter.format(value || 0) },
    ],
    cars: [
      { title: "Tên xe", dataIndex: "name", fixed: "left", width: 240 },
      { title: "Khu vực", dataIndex: "location", width: 200 },
      { title: "Thông số", dataIndex: "specs", width: 240, render: renderCarSpecs },
      { title: "Đánh giá", dataIndex: "rating", width: 110 },
      { title: "Giá từ", dataIndex: "priceFrom", width: 150, render: (value) => currencyFormatter.format(value || 0) },
    ],
    flights: [
      { title: "Hãng bay", dataIndex: "airline", fixed: "left", width: 190 },
      { title: "Tuyến bay", key: "route", width: 260, render: (_, record) => `${record.fromFull || record.from} → ${record.toFull || record.to}` },
      { title: "Thời gian", dataIndex: "duration", width: 150 },
      { title: "Lịch bay", dataIndex: "schedules", width: 240, render: renderTags },
      { title: "Giá từ", dataIndex: "priceFrom", width: 150, render: (value) => currencyFormatter.format(value || 0) },
    ],
    bookings: [
      { title: "Dịch vụ", dataIndex: "itemName", fixed: "left", width: 260 },
      { title: "Loại", dataIndex: "itemType", width: 140, render: (value) => <Tag>{value}</Tag> },
      { title: "Khách hàng", dataIndex: "userId", width: 140 },
      { title: "Ngày bắt đầu", dataIndex: "checkIn", width: 140 },
      { title: "Số người/vé", dataIndex: "numberOfPeople", width: 120 },
      { title: "Tổng tiền", dataIndex: "totalPrice", width: 160, render: (value) => currencyFormatter.format(value || 0) },
      { title: "Trạng thái", dataIndex: "status", width: 150, render: (value) => <StatusTag value={value} /> },
    ],
  };

  return [...columnsByResource[activeKey], actionColumn];
}

function renderTags(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return <Typography.Text type="secondary">Chưa có</Typography.Text>;
  }

  return values.slice(0, 3).map((value) => <Tag key={value}>{value}</Tag>);
}

function renderCarSpecs(specs) {
  if (!specs) {
    return <Typography.Text type="secondary">Chưa có</Typography.Text>;
  }

  return [specs.seats && `${specs.seats} chỗ`, specs.fuel, specs.transmission].filter(Boolean).join(" | ");
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleDateString("vi-VN");
}

function StatusTag({ value }) {
  const color = value === "Đã thanh toán" ? "green" : value === "Đã hủy" ? "red" : "gold";
  return <Tag color={color}>{value}</Tag>;
}

export default AdminPage;
