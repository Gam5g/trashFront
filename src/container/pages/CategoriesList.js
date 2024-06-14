import React, { useEffect, useState } from "react";
import AuthToken from "./AuthToken";
import Paging from "./Community/Paging";
import "./Categories.css";
import { useNavigate } from "react-router-dom";

const CategoriesList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("일반쓰레기");

  const categories = [
    { name: "일반쓰레기" },
    { name: "종이류" },
    { name: "페트병" },
    { name: "플라스틱" },
    { name: "캔류" },
    { name: "비닐류" },
    { name: "스티로폼" },
    { name: "유리" },
    { name: "폐건전지" },
    { name: "폐유" },
    { name: "재활용 어려움" },
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category.name);
    fetchCategoryData(category.name, 1);
  };

  const handleSolutionClick = (wasteId) => {
    navigate(`/solution/detail/${wasteId}`, {
      state: wasteId,
    });
  };

  const fetchCategoryData = async (categoryName, pageNumber) => {
    const encodedCategory = encodeURIComponent(categoryName);
    setLoading(true);

    try {
      const response = await AuthToken.get(
        `/solution/category?category=${encodedCategory}&page=${pageNumber - 1}&size=10`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const inputData = response.data.content.map((data) => ({
        id: data.id,
        name: data.name,
        tags: data.tags,
        imageUrl: data.imageUrl,
      }));
      setNumberOfElements(response.data.numberOfElements);
      setTotalElements(response.data.totalElements);
      setData(inputData);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData(selectedCategory, page);
  }, []);

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    fetchCategoryData(selectedCategory, pageNumber);
  };

  const marginTopValues = [
    { condition: 10, value: "700px" },
    { condition: 9, value: "560px" },
    { condition: 8, value: "480px" },
    { condition: 7, value: "450px" },
    { condition: 6, value: "300px" },
    { condition: 5, value: "140px" },
    { condition: 4, value: "0px" },
    { condition: 3, value: "-110px" },
    { condition: 2, value: "-240px" },
    { condition: 1, value: "-350px" },
    { condition: 0, value: "-500px" },
  ];

  const marginTopValue =
    marginTopValues.find((mtv) => numberOfElements >= mtv.condition)?.value ||
    "0px";

  return (
    <div
      className="categories-container"
      style={{ marginTop: marginTopValue, userSelect: "none" }}
    >
      <h1>카테고리별 배출방법 ＞</h1>
      <div className="categories-buttons">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-button ${selectedCategory === category.name ? "active" : ""}`}
            onClick={() => handleCategoryClick(category)}
          >
            {category.name}
          </button>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {data.length > 0 ? (
        <div className="categories-data-list">
          {data.map((item) => (
            <div
              key={item.id}
              className="data-item"
              onClick={() => handleSolutionClick(item.id)}
            >
              <div className="data-item-image">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} />
                ) : (
                  <img style={{ marginLeft: "30px" }} />
                )}
              </div>
              <div className="data-item-content">
                <p className="data-item-name">{item.name}</p>
                <p className="data-item-tags">
                  {item.tags.map((tag) => `#${tag}`).join(" ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>선택된 카테고리 내 데이터가 없습니다.</p>
      )}
      {data.length > 0 && (
        <Paging
          totalItemsCount={totalElements}
          onPageChange={handlePageChange}
          activePage={page}
        />
      )}
    </div>
  );
};

export default CategoriesList;
