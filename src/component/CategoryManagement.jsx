import { Button, Input, message, Modal, Table } from "antd";
import React, { useState } from "react";

export default function BookManagement({ categories, saveCategories, books }) {
  const [inputName, setInputName] = useState("");
  const [isShowForm, setIsShowForm] = useState(false);
  const [errorInputName, setErrorInputName] = useState("");

  /**
   * cập nhật giá trị cho biến input name
   * @param {*} event
   */
  const setValueInputName = (event) => {
    setInputName(event.target.value);
    const checkCategoryName = categories.find(
      (cate) => cate.categoryName === event.target.value
    );
    if (checkCategoryName) {
      setErrorInputName("Tên danh mục đã tồn tại");
    } else {
      setErrorInputName("");
    }
  };

  /**
   * xử lý mở form thêm category
   */
  const handleOpenForm = () => {
    setIsShowForm(true);
  };

  /**
   * xử lý đóng form add
   */
  const handleCloseForm = () => {
    setIsShowForm(false);
    setInputName("");
    setErrorInputName("");
  };

  /**
   * xử lý tạo danh mục
   */
  const addCategory = () => {
    const checkCategoryName = categories.find(
      (cate) => cate.categoryName === inputName
    );
    if (checkCategoryName) {
      setErrorInputName("Tên danh mục đã tồn tại");
    } else {
      const category = {
        key: new Date().getTime(),
        id: new Date().getTime(),
        categoryName: inputName,
      };

      const newCategories = [...categories, category];
      saveCategories(newCategories);
      setInputName("");
      setIsShowForm(false);
    }
  };

  /**
   * xử lý xóa danh mục
   * @param {*} id
   */
  const handleDelete = (id) => {
    const checkExistCategory = books.some((book) => book.category);
    if (checkExistCategory) {
      message.error("Tên danh mục này đang được sử dụng , không thể xóa ");
    } else {
      const newCategories = categories.filter((cate) => cate.id !== id);
      saveCategories(newCategories);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <span className="hover:text-red-500">
          <Button
            type="danger"
            danger
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Xóa
          </Button>
        </span>
      ),
    },
  ];
  return (
    <div>
      <h2 className="text-2xl font-bold ml-10 mt-5 px-[150px]">
        Danh Mục Sách
      </h2>

      <div className="flex justify-end items-center pr-[50px]">
        <Button
          className="h-10 text-lg"
          type="primary"
          onClick={() => handleOpenForm()}
        >
          Thêm danh mục sách
        </Button>
      </div>

      <div className="mt-10 px-[150px]">
        <Table
          dataSource={categories}
          columns={columns}
          pagination={{ pageSize: 10 }}
          style={{ margin: "20px" }}
        />
      </div>

      <div>
        <Modal
          title="Thêm Danh Mục"
          open={isShowForm}
          onCancel={() => handleCloseForm()}
          footer={[
            <Button key="cancel" onClick={() => handleCloseForm()}>
              Hủy
            </Button>,
            <Button key="add" type="primary" onClick={() => addCategory()}>
              Thêm
            </Button>,
          ]}
        >
          <div>
            <label>Tên danh mục :</label>
            <Input
              value={inputName}
              onChange={(event) => setValueInputName(event)}
            ></Input>
            {errorInputName ? (
              <p className="text-red-500">{errorInputName}</p>
            ) : (
              <></>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}
