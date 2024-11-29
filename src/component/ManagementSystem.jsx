import { Button } from "antd";
import React, { useState } from "react";
import BookManagement from "./BookManagement";
import CategoryManagement from "./CategoryManagement";

export default function ManagementSystem() {
  const [currentTab, setCurrentTab] = useState("category");
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("categories")) || [];
  });
  const [books, setBooks] = useState(() => {
    return JSON.parse(localStorage.getItem("books")) || [];
  });

  const saveBooks = (books) => {
    setBooks(books);
    localStorage.setItem("books", JSON.stringify(books));
  };

  const saveCategories = (categories) => {
    setCategories(categories);
    localStorage.setItem("categories", JSON.stringify(categories));
  };

  /**
   * chuyển trạng thái tab
   * @param {*} tab
   */
  const changeTab = (tab) => {
    setCurrentTab(tab);
  };

  return (
    <div className="bg-[#f3f4f6] w-[100%] h-[100vh]">
      <h1 className="text-center text-4xl font-bold pt-[30px]">
        Quản Lý Thư Viện
      </h1>
      <div className="flex justify-center items-center mt-10 gap-5">
        <Button
          className="h-10 text-lg"
          type={currentTab === "category" ? "primary" : "default"}
          onClick={() => changeTab("category")}
        >
          Quản Lý Danh Mục
        </Button>
        <Button
          className="h-10 text-lg"
          type={currentTab === "book" ? "primary" : "default"}
          onClick={() => changeTab("book")}
        >
          Quản Lý Sách
        </Button>
      </div>

      {currentTab === "category" ? (
        <CategoryManagement
          categories={categories}
          saveCategories={saveCategories}
          books={books}
        />
      ) : (
        <BookManagement
          categories={categories}
          books={books}
          saveBooks={saveBooks}
        />
      )}
    </div>
  );
}
