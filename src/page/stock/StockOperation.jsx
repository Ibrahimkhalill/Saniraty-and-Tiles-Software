import React, { useCallback, useMemo } from "react";
import "./stock-operation.css";
import { useState, useEffect, useRef } from "react";
import { RotatingLines } from "react-loader-spinner";
import Excel from "../../image/excel.webp";
import invoiceimg from "../../image/Invoice.png";
import reset from "../../image/reset.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import * as FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/GenaratePdf";
import AvailableQuantity from "../../components/stookquantity/AvilableQunatity";
import TotalAvailableAmount from "../../components/stookquantity/TotalAvailableAmount";

const StockOperation = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [allProduct, setAllProduct] = useState([]);
  const [prodcutType, setProductType] = useState([]);
  const [rows, setRows] = useState([]);
  const [stockId, setStockId] = useState([]);
  const [productIdCode, setProductIdCode] = useState("");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [warranty, setWarranty] = useState([]);
  const [SaleQuantity, setSaleQuantity] = useState([]);
  const [TotalQuantity, setTotalQuanityt] = useState([]);
  const [minQuantity, setMinQuantity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [FilteredData, setFilteredData] = useState([]);
  const [unit, setUnit] = useState("");
  const [activeRowIndex, setActiveRowIndex] = useState(null);
  const [categories, setCategories] = useState([]);
  const [availableAmount, setAvailAbleAmount] = useState("");
  const [saleData, setSaleData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [PurchasePage, setPurchasePage] = useState(1);
  const [pageSize, setPageSize] = useState(2000);
  const [PurchasePageSize, setPurchasePageSize] = useState(2000);
  const [Totalpage, setTotalPage] = useState(null);
  const [PurchaseTotalpage, setPurchaseTotalPage] = useState(null);
  const [paginationVisible, setPaginationVisible] = useState(true);

  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  });
  const fetchData = useCallback(async (signal) => {
    try {
      setIsLoading(true);
      const response_getAllTranscatioData = await axiosInstance.get(
        `/transactionsRouter/getTransactionWithPagination?operation_type_id=1&page=1&pageSize=500`,
        { signal }
      );
      const response_getPurchaseTranscatioData = await axiosInstance.get(
        `/transactionsRouter/getTransactionWithPagination?operation_type_id=2&page=1&pageSize=2000`
      );
      const count = response_getPurchaseTranscatioData.data.count;

      const datas_getAllTranscatioData = response_getAllTranscatioData.data;
      setTotalPage(Math.ceil(datas_getAllTranscatioData.count / pageSize));
      setPurchaseTotalPage(Math.ceil(count / PurchasePageSize));
      setIsLoading(false);
      handleReset();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handleSaleData = useCallback(async (pages) => {
    try {
      const response = await axiosInstance.get(
        `/transactionsRouter/getTransactionWithPagination?operation_type_id=1&page=${pages}&pageSize=${pageSize}`
      );

      const filterSaleTransactions = response.data.rows;

      setSaleData((prevRows) => [...prevRows, ...filterSaleTransactions]);
      setPage((prevPage) => prevPage + 1);
      console.log(pages, filterSaleTransactions);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const handlePurchaseData = useCallback(async (pages) => {
    try {
      const response = await axiosInstance.get(
        `/transactionsRouter/getTransactionWithPagination?operation_type_id=2&page=${pages}&pageSize=${PurchasePageSize}`
      );

      const filterSaleTransactions = response.data.rows;

      setPurchaseData((prevRows) => [...prevRows, ...filterSaleTransactions]);
      setPurchasePage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  const fetchProductData = async () => {
    try {
      const response = await axiosInstance.get("/producttraces/getAll");

      if (response.data) {
        setAllProduct(response.data);
        console.log(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchAllCategory = async () => {
    try {
      const { data } = await axiosInstance.get("/category/getAll");
      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (paginationVisible && page <= Totalpage) {
      handleSaleData(page);
    }
  }, [Totalpage, page, handleSaleData, paginationVisible]);

  useEffect(() => {
    if (paginationVisible && PurchasePage <= PurchaseTotalpage) {
      handlePurchaseData(PurchasePage);
    }
  }, [PurchasePage, PurchaseTotalpage, handlePurchaseData, paginationVisible]);

  console.log(page, PurchasePage, Totalpage, PurchaseTotalpage);

  useEffect(() => {
    document.title = "Stock Report";
    fetchAllCategory();
    fetchProductData();
    const controller = new AbortController();
    fetchData(controller.signal);

    return () => {
      controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const formattedStock = AvailableQuantity(saleData, purchaseData);
    const { totalAvailableAmount } = TotalAvailableAmount(
      saleData,
      purchaseData
    );

    setFilteredData(formattedStock);
    setAvailAbleAmount(totalAvailableAmount);
  }, [purchaseData, saleData]);

  // const formattedStock = useMemo(
  //   () => AvailableQuantity(saleData, purchaseData),
  //   [saleData, purchaseData]
  // );

  // const { totalAvailableAmount } = useMemo(
  //   () => TotalAvailableAmount(saleData, purchaseData),
  //   [purchaseData, saleData]
  // );

  // serach
  const handleSearchProductName = async (e) => {
    try {
      if (e.detail > 1) {
        return;
      }
      if (selectedProduct === "") {
        toast.dismiss();
        toast.warning("Plaese filup serach Input");
        return;
      }
      setIsLoading(true);
      setPaginationVisible(false);
      const responseSale = await axiosInstance.get(
        `/transactionsRouter/getTransactionProductName?operation_type_id=1&name=${selectedProduct}`
      );
      const responseQunatity = await axiosInstance.get(
        `/transactionsRouter/getTransactionProductName?operation_type_id=2&name=${selectedProduct}`
      );
      if (responseSale.status === 200 && responseQunatity.status === 200) {
        const responseSaleData = responseSale.data;
        const responseQunatityData = responseQunatity.data;
        setSaleData(responseSaleData);
        setPurchaseData(responseQunatityData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error From Api product name", error);
      setPurchaseData([]);
      setSaleData([]);
      setIsLoading(false);
    }
  };

  // ====================Product Cetagory Search============================

  const handleCategoryName = async (e) => {
    try {
      if (e.detail > 1) {
        return;
      }
      if (selectedCategory === "") {
        toast.dismiss();
        toast.warning("Plaese filup serach Input");
        return;
      }
      setIsLoading(true);
      setPaginationVisible(false);
      const responseSale = await axiosInstance.get(
        `/transactionsRouter/getTransactionProductCategory?operation_type_id=1&category_name=${selectedCategory}`
      );
      const responseQunatity = await axiosInstance.get(
        `/transactionsRouter/getTransactionProductCategory?operation_type_id=2&category_name=${selectedCategory}`
      );
      if (responseSale.status === 200 && responseQunatity.status === 200) {
        const responseSaleData = responseSale.data;
        const responseQunatityData = responseQunatity.data;
        setSaleData(responseSaleData);
        setPurchaseData(responseQunatityData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error Form Api Cetagory", error);
      setPurchaseData([]);
      setSaleData([]);
      setIsLoading(false);
    }
  };

  // =================================== Search Product Code ======================================

  const handleSearchproductcode = async (e) => {
    try {
      if (e.detail > 1) {
        return;
      }
      if (selectedProductCode === "") {
        toast.dismiss();
        toast.warning("Plaese filup serach Input");
        return;
      }
      setIsLoading(true);
      setPaginationVisible(false);
      const responseSale = await axiosInstance.get(
        `/transactionsRouter/getTransactionProductCode?operation_type_id=1&product_code=${selectedProductCode}`
      );
      const responseQunatity = await axiosInstance.get(
        `/transactionsRouter/getTransactionProductCode?operation_type_id=2&product_code=${selectedProductCode}`
      );
      if (responseSale.status === 200 && responseQunatity.status === 200) {
        const responseSaleData = responseSale.data;
        const responseQunatityData = responseQunatity.data;
        setSaleData(responseSaleData);
        setPurchaseData(responseQunatityData);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error Form Api Product Code", error);
      setPurchaseData([]);
      setSaleData([]);
      setIsLoading(false);
    }
  };

  // select row
  const handlerow = (item, index) => {
    setActiveRowIndex(index);
    setStockId(index + 1);
    setQuantity(item.quantity);
    setProductIdCode(item.ProductCode);
    setProductName(item.ProductName);
    setProductType(item.ProductType);
    setMinQuantity(item.availableQuantity);
    setUnit(item.unit);
    setWarranty(item.warranty);
  };
  //reset all field
  const handleReset = () => {
    setSelectedProduct("");
    setSelectedProductCode("");
    setStockId("");
    setQuantity("");
    setProductIdCode("");
    setProductName("");
    setProductType("");
    setMinQuantity("");
    setUnit("");
    setWarranty("");
    setActiveRowIndex(null);
  };

  // get total avilablequantity
  const totalAvailableQuantity = FilteredData.reduce(
    (accumulator, item) => accumulator + parseFloat(item.availableQuantity),
    0
  );

  //format data for excell

  //excell
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";
  const exportToExcel = async (excelData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  ///invoice
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleClikPrint = (e) => {
    if (e.detail > 1) {
      return;
    }
    if (productName === "" && productIdCode === "" && minQuantity === "") {
      toast.dismiss();
      toast.warning("Please Select A row ");
      return;
    } else {
      handlePrint();
    }
  };

  useEffect(() => {
    if (purchaseData.length > 0) {
      const total = purchaseData.reduce(
        (accumulator, item) => accumulator + parseFloat(item.quantity_no),
        0
      );
      setTotalQuanityt(parseFloat(total, 10).toFixed(2));
    } else {
      setTotalQuanityt(0);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseData]);
  const handelShowSaleData = () => {
    setPurchaseData([]);
    setSaleData([]);
    setFilteredData([]);
    setPurchasePage(1);
    setPage(1);
    handleReset();
    setPaginationVisible(true);
  };
  return (
    <>
      <ToastContainer position="top-center" autoClose={1000} />
      <div className="full_div_stock_operation">
        <div className="first_row_div_stock_operation">
          <div className="search_div_stock_operation">
            <div className="input_field_stock_operation">
              <label>Category</label>
              <input
                value={selectedCategory}
                onChange={(event) => {
                  setSelectedCategory(event.target.value);
                }}
                list="stockcategorytname"
              />
              <datalist id="stockcategorytname">
                {categories.length > 0 &&
                  categories.map((category, index) => {
                    return (
                      <option key={index}>{category.category_name}</option>
                    );
                  })}
              </datalist>
              <button onClick={handleCategoryName}>Search</button>
            </div>
            <div className="input_field_stock_operation">
              <label>Product Name</label>
              <input
                value={selectedProduct}
                onChange={(event) => {
                  setSelectedProduct(event.target.value);
                }}
                list="stockproductname"
              />
              <datalist id="stockproductname">
                {allProduct.length > 0 &&
                  allProduct.map((product, index) => {
                    return <option key={index}>{product.name}</option>;
                  })}
              </datalist>
              <button onClick={handleSearchProductName}>Search</button>
            </div>
            <div className="input_field_stock_operation">
              <label>Product Code</label>
              <input
                value={selectedProductCode}
                onChange={(event) => {
                  setSelectedProductCode(event.target.value);
                }}
                list="product_code_list"
              />
              <datalist id="product_code_list">
                {allProduct.length > 0 &&
                  allProduct.map((product, index) => {
                    return <option key={index}>{product.product_code}</option>;
                  })}
              </datalist>
              <button onClick={handleSearchproductcode}>Search</button>
            </div>
            <div className="input_field_stock_operation">
              <button onClick={handelShowSaleData}> Show All</button>
            </div>
          </div>
        </div>
        <div className="second_row_div_stock_operation loading_stock_operation">
          <div
            className={`${
              isLoading ? "loader_spriner" : ""
            } table_wrapper_stock_operation table_div_stock_operation`}
          >
            {isLoading ? (
              <div className="rotating_lines_stock_operation">
                <RotatingLines
                  strokeColor="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  width="50"
                  visible={true}
                />
              </div>
            ) : (
              <table border={3} cellSpacing={2} cellPadding={10}>
                <thead>
                  <tr>
                    <th>Stock Id</th>
                    <th>Product Code</th>
                    <th>Category</th>
                    <th>Product Name</th>
                    <th>Type/No.</th>
                    <th>Warranty</th>
                    <th>Quantity</th>
                    <th>Available Quantity</th>
                    <th>Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {FilteredData &&
                    FilteredData.map((item, index) => {
                      return (
                        <tr
                          className={
                            activeRowIndex === index ? "active-row-stock" : ""
                          }
                          tabIndex="0"
                          key={index}
                          onClick={() => handlerow(item, index)}
                        >
                          {/* Other columns */}
                          <td>{index + 1}</td>
                          <td>{item.ProductCode}</td>
                          <td>{item.category_name}</td>
                          <td>{item.ProductName}</td>
                          <td>{item.ProductType}</td>
                          <td>{item.warranty}</td>
                          <td>{item.quantity_no}</td>
                          <td
                            style={{
                              backgroundColor:
                                item.availableQuantity &&
                                item.availableQuantity <= 5
                                  ? "red"
                                  : "transparent",
                              color:
                                item.availableQuantity &&
                                item.availableQuantity <= 5
                                  ? "white"
                                  : "",
                            }}
                            className=""
                          >
                            {item.availableQuantity}
                          </td>
                          <td>{item.unit}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="third_row_div_stock_operation">
          <div className="container_update_stock">
            <div className="container_update_stock_operation">
              <div className="container_update_column1_stock">
                <div style={{ fontSize: "1.2vw", fontWeight: "bold" }}>
                  View Product Invoice
                </div>
                <div className="upadted_input_field">
                  <div className="updated_input_field_first">
                    <div className="input_field_stock_operation">
                      <label>Stock Id</label>
                      <input
                        value={stockId}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product code</label>
                      <input
                        value={productIdCode}
                        onChange={(event) => {
                          setProductIdCode(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product Name</label>
                      <input
                        value={productName}
                        onChange={(event) => {
                          setProductName(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Product Type</label>
                      <input
                        value={prodcutType}
                        onChange={(event) => {
                          setMinQuantity(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="updated_input_field_first">
                    <div className="input_field_stock_operation">
                      <label>Quantity</label>
                      <input
                        value={quantity}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Unit</label>
                      <input
                        value={unit}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Avilable Quantity</label>
                      <input
                        value={minQuantity}
                        onChange={(event) => {
                          setMinQuantity(event.target.value);
                        }}
                      />
                    </div>
                    <div className="input_field_stock_operation">
                      <label>Warranty</label>
                      <input
                        value={warranty}
                        onChange={(event) => {
                          setWarranty(event.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="custome_stock_operation">
                  <div className="reset_button_stock_operation">
                    <div style={{ display: "none" }}>
                      <ComponentToPrint
                        ref={componentRef}
                        stockId={stockId}
                        productCode={productIdCode}
                        productName={productName}
                        quantity={quantity}
                        availableQuantity={minQuantity}
                        unit={unit}
                      />
                    </div>
                    <button onClick={handleClikPrint}>
                      <img src={invoiceimg} alt="" />
                    </button>
                    <div>View Invoice</div>
                  </div>

                  <div className="reset_button_stock_operation">
                    <button onClick={handleReset}>
                      <img src={reset} alt="" />
                    </button>
                    <div>Reset</div>
                  </div>
                </div>
              </div>
              <div className="container_update_column2_stock_button">
                {/* <button
                  className="container_update_column2_stock_button_view"
                  onClick={handleViewImage}
                >
                  View & add Image
                </button> */}
                <div className="container_update_column2_stock_button_excel">
                  <button
                    onClick={() => exportToExcel(FilteredData, "Stock Report")}
                  >
                    <img src={Excel} alt="" />
                  </button>
                  Excel
                </div>
              </div>

              <div className="container_update_column2_stock">
                <div className="input_field_stock_operation_total">
                  <label>Total Quantity</label>
                  <input value={TotalQuantity} disabled />
                </div>

                <div className="input_field_stock_operation_total">
                  <label> Total Available Quantity</label>
                  <input disabled value={totalAvailableQuantity.toFixed(2)} />
                </div>
                <div className="input_field_stock_operation_total">
                  <label> Total Available Amount</label>
                  <input disabled value={availableAmount} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockOperation;
