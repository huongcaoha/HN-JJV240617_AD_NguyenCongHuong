import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import React, { useEffect, useState } from "react";

export default function BookManagement({ books, categories, saveBooks }) {
  const [isShowForm, setIsShowForm] = useState(false);
  const [inputCategory, setInputCategory] = useState("");
  const [inputBookName, setInputBookName] = useState("");
  const [inputAuthor, setInputAuthor] = useState("");
  const [inputPrice, setInputPrice] = useState(0);
  const [inputImage, setInputImage] = useState("");
  const [errorBookName, setErrorBookName] = useState("");
  const [errorAuthor, setErrorAuthor] = useState("");
  const [errorPrice, setErrorPrice] = useState("");
  const [errorCategory, setErrorCategory] = useState("");
  const [errorImage, setErrorImage] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [bookUpdate, setBookUpdate] = useState(null);
  const [inputSearchName, setInputSearchName] = useState("");
  const [inputSearchCategory, setInputSearchCategory] = useState("");
  const [listBook, setListBook] = useState([...books]);

  useEffect(() => {
    setListBook(books);
  }, [books]);

  const resetData = () => {
    setInputBookName("");
    setInputAuthor("");
    setInputPrice(0);
    setInputImage("");
    setInputCategory("");
    setErrorBookName("");
    setErrorAuthor("");
    setErrorCategory("");
    setErrorImage("");
    setErrorPrice("");
  };

  const setValueBookName = (event) => {
    setInputBookName(event.target.value);
  };

  const setValueAuthor = (event) => {
    setInputAuthor(event.target.value);
  };

  const setValuePrice = (event) => {
    setInputPrice(event.target.value);
  };

  const setValueImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setInputImage(base64String);
      };

      reader.onerror = () => {
        message.error("Đã xảy ra lỗi khi đọc tệp");
      };

      reader.readAsDataURL(file);
    }
  };

  const handleOpenForm = () => {
    setIsShowForm(true);
  };

  const handleCancelForm = () => {
    setIsShowForm(false);
    resetData();
    setIsUpdate(false);
    setBookUpdate(null);
  };

  const checkDataBlank = () => {
    let rs = true;
    if (!inputBookName) {
      setErrorBookName("Tên sách không được để trống");
      rs = false;
    }
    if (!inputAuthor) {
      setErrorAuthor("Tên tác giả không được để trống");
      rs = false;
    }
    if (!inputPrice || inputPrice <= 0) {
      setErrorPrice("Giá tiền không được để trống hoặc bằng 0");
      rs = false;
    }
    if (!inputCategory) {
      setErrorCategory("Tên danh mục không được để trống");
      rs = false;
    }
    if (!inputImage) {
      setErrorImage("Ảnh không được để trống");
      rs = false;
    }
    return rs;
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Ngăn chặn hành động mặc định
    if (!checkDataBlank()) return; // Kiểm tra dữ liệu

    let checkBookExist = books.find((book) => book.bookName === inputBookName);
    if (isUpdate) {
      if (checkBookExist) {
        if (inputBookName === bookUpdate.bookName) {
          checkBookExist = false;
        }
      }

      if (checkBookExist) {
        message.error("Tên sách đã tồn tại");
        return;
      } else {
        const newBook = {
          key: bookUpdate.key,
          id: bookUpdate.id,
          image: inputImage,
          bookName: inputBookName,
          authorName: inputAuthor,
          price: inputPrice,
          category: inputCategory,
        };
        const newBooks = books.map((book) => {
          if (book.id === newBook.id) {
            return newBook;
          } else {
            return book;
          }
        });
        saveBooks(newBooks);
        resetData();
        handleCancelForm();
      }
    } else {
      if (checkBookExist) {
        message.error("Sách đã tồn tại");
      } else {
        const newBook = {
          key: new Date().getTime(),
          id: new Date().getTime(),
          image: inputImage,
          bookName: inputBookName,
          authorName: inputAuthor,
          price: inputPrice,
          category: inputCategory,
        };
        const newBooks = [...books, newBook];
        saveBooks(newBooks);
        resetData();
        handleCancelForm();
      }
    }
  };

  const handleUpdate = (book) => {
    setIsUpdate(true);
    setIsShowForm(true);
    setInputBookName(book.bookName);
    setInputAuthor(book.authorName);
    setInputPrice(book.price);
    setInputCategory(book.category);
    setInputImage(book.image);
    setBookUpdate(book);
  };

  const handleSelectCategory = (value) => {
    setInputSearchCategory(value);
  };

  const setValueInputCategory = (value) => {
    setInputCategory(value);
  };

  const handleSearch = () => {
    console.log("Searching for:", inputSearchName, inputSearchCategory);
    setListBook(() => {
      return books.filter((book) => {
        const matchesName = inputSearchName
          ? book.bookName.toLowerCase().includes(inputSearchName.toLowerCase())
          : true;

        const matchesCategory = inputSearchCategory
          ? book.category === inputSearchCategory
          : true;

        return matchesName && matchesCategory;
      });
    });
  };

  const handleDeleteBook = (id) => {
    const newBooks = books.filter((book) => book.id !== id);
    saveBooks(newBooks);
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (_, record) => (
        <img src={record.image} alt="image" style={{ maxWidth: "50px" }} />
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Tên tác giả",
      dataIndex: "authorName",
      key: "authorName",
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      key: "price",
      render: (text) => `${text} VND`, // Định dạng giá tiền
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-4">
          <Button type="primary" onClick={() => handleUpdate(record)}>
            Sửa
          </Button>
          <Button
            type="primary"
            onClick={() => handleDeleteBook(record.id)}
            danger
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-[150px] text-2xl font-bold">
      <div className="flex justify-between mt-10">
        <h1 className="text-2xl font-bold">Quản Lý Sách</h1>
        <Button
          onClick={handleOpenForm}
          className="h-10 text-lg"
          type="primary"
        >
          Thêm Sách
        </Button>
      </div>

      <div className="flex justify-end mr-[100px] mt-10 gap-4">
        <Form className="flex justify-end mr-[100px] mt-10 gap-4">
          <Input
            value={inputSearchName}
            type="text"
            placeholder="Tìm kiếm tên sách"
            onChange={(event) => setInputSearchName(event.target.value)}
          />
          <Select
            defaultValue="Chọn danh mục"
            style={{ width: 200 }}
            onChange={handleSelectCategory}
            value={inputSearchCategory}
          >
            <Option value="">Tất cả danh mục</Option>{" "}
            {categories.map((category) => (
              <Option key={category.id} value={category.categoryName}>
                {category.categoryName}
              </Option>
            ))}
          </Select>

          <Button onClick={handleSearch} type="primary">
            Tìm kiếm
          </Button>
        </Form>
      </div>

      <Table
        className="mt-10"
        dataSource={listBook}
        columns={columns}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />

      <Modal
        title={isUpdate ? "Cập Nhật Sách" : "Tạo Mới Sách"}
        onCancel={handleCancelForm}
        footer={null}
        open={isShowForm}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>Tên sách :</label>
            <Input
              value={inputBookName}
              onChange={setValueBookName}
              type="text"
            />
            {errorBookName && <p className="text-red-500">{errorBookName}</p>}
          </div>

          <div>
            <label>Tác giả :</label>
            <Input value={inputAuthor} onChange={setValueAuthor} type="text" />
            {errorAuthor && <p className="text-red-500">{errorAuthor}</p>}
          </div>

          <div>
            <label>Giá tiền :</label>
            <Input value={inputPrice} onChange={setValuePrice} type="number" />
            {errorPrice && <p className="text-red-500">{errorPrice}</p>}
          </div>

          <div>
            <label>Hình ảnh :</label>
            <Input
              onChange={setValueImage}
              type="file"
              accept="image/png, image/jpeg, image/gif"
            />
            {errorImage && <p className="text-red-500">{errorImage}</p>}
          </div>

          <div>
            <label>Tên danh mục :</label>
            <Select
              value={inputCategory}
              defaultValue="Chọn danh mục"
              style={{ width: 200 }}
              onChange={(value) => setValueInputCategory(value)}
            >
              {categories.map((category) => (
                <Select.Option key={category.id} value={category.categoryName}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>
            {errorCategory && <p className="text-red-500">{errorCategory}</p>}
          </div>

          <div className="flex justify-end gap-5">
            <Button type="default" onClick={handleCancelForm}>
              Hủy
            </Button>
            <Button htmlType="submit" type="primary">
              {isUpdate ? "Sửa" : "Thêm"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
