import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const ProductUpdate = () => {
  // const [categoryNames, setCategoryNames] = useState({});
  const { toastAlert } = useGlobalContext();
  const [id, setId] = useState(0);
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [duration, setDuration] = useState("");
  const [stockQuantitiy, setStockQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [openingStockDate, setOpeningStockDate] = useState("");
  const [remark, setRemark] = useState("");
  const [creationdate, setCreationDate] = useState("");
  const [createdby, setCreatedBy] = useState("");
  const [lastupdatedby, setLastUpdatedBy] = useState("");
  const [updatedDate, setUpdatedDate] = useState("");
  // const [props1, setProps1] = useState("");
  // const [props2, setProps2] = useState("");
  // const [props3, setProps3] = useState("");
  const [inputFields, setInputFields] = useState([]);
  const [addnewFields, setAddnewFields] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("Product_name", productName);
    formData.append("Product_type", productType);
    formData.append("Duration", duration);
    formData.append("Stock_qty", stockQuantitiy);
    formData.append("Unit", unit);
    formData.append("Opening_stock", openingStock);
    formData.append("Remarks", remark);
    formData.append("Product_image", productImage);
    // formData.append("props1", props1);
    // formData.append("props2", props2);
    // formData.append("props3", props3);

    // formData.append("Opening_stock_date", openingStockDate);

    axios.put(baseUrl+"update_productupdate", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    for (const inputField of addnewFields) {
      const payload = {
        type_id: inputField.type,
        prop_name: inputField.name,
        product_id: Number(id),
        prop_category: inputField.category,
      };

      try {
        axios.post(`${baseUrl}`+`add_proppost`, payload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Request successfully sent for", inputField);
      } catch (error) {
        console.error("Error sending request for", inputField, error);
      }
    }

    setProductName("");
    setProductImage("");
    setDuration("");
    setStockQuantity("");
    setUnit("");
    setOpeningStockDate("");
    setOpeningStockDate("");
    setRemark("");

    toastAlert("Product added success");
    setIsFormSubmitted(true);
  };

  const removeProp = async (propid) => {
    var data = await axios
      .delete(`${baseUrl}`+`delete_propdelete/${propid}`, null)
      .then((crash) => {
        axios
          .get(`${baseUrl}`+`get_single_productdata/${id}`)
          .then((res) => {
            setInputFields(res.data.Product_Prop);
          });
      });
  };

  const addMore = (e) => {
    setAddnewFields([...addnewFields, { type: "", name: "", category: "" }]);
  };

  const handleInputChange = (index, value, property) => {
    const updatedValues = [...addnewFields];
    updatedValues[index][property] = value;
    if (property === "type") {
      const firstIndexWithSameType = updatedValues.findIndex(
        (field, i) => i !== index && field.type === value
      );

      if (firstIndexWithSameType !== -1) {
        updatedValues[index]["category"] =
          updatedValues[firstIndexWithSameType]["category"];
      }
    }
    setAddnewFields(updatedValues);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    } else {
      setProductImage(null);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("product_id")) {
      axios
        .get(`${baseUrl}`+`get_single_productdata/${id}`)
        .then((res) => {
          setInputFields(res.data.Product_Prop);
        });
    }
  }, [id]);

  useEffect(() => {
    setId(localStorage.getItem("product_id"));
    setProductName(localStorage.getItem("Product_name"));
    setProductImage(localStorage.getItem("Product_image"));
    setProductType(localStorage.getItem("Product_type"));
    setDuration(localStorage.getItem("Duration"));
    setStockQuantity(localStorage.getItem("Stock_qty"));
    setUnit(localStorage.getItem("Unit"));
    setOpeningStock(localStorage.getItem("Opening_stock"));
    setOpeningStockDate(
      localStorage.getItem("Opening_stock_date").substring(0, 10)
    );
    // setProps1(localStorage.getItem("props1"));
    // setProps2(localStorage.getItem("props2"));
    // setProps3(localStorage.getItem("props3"));
    setRemark(localStorage.getItem("Remarks"));
    setOpeningStock(localStorage.getItem("Opening_stock"));
    setCreationDate(localStorage.getItem("Creation_date").substring(0, 10));
    setCreatedBy(localStorage.getItem("created_by"));
    setLastUpdatedBy(localStorage.getItem("Last_updated_by"));
    setUpdatedDate(localStorage.getItem("Last_updated_date").substring(0, 10));
  }, []);

  if (isFormSubmitted) {
    return <Navigate to="/admin/product-overview" />;
  }
  return (
    <>
      <FormContainer
        mainTitle="Product"
        title="Product Master"
        handleSubmit={handleSubmit}
      >
        <FieldContainer
          label="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <FieldContainer label="Product Id" value={id} />
        <FieldContainer
          label="Product Type"
          Tag="select"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
        >
          <option>choose....</option>
          <option value="Beverages">Beverages</option>
          <option value="Sweets&Candy">Sweets & Candy</option>
          <option value="Snacks">Snacks</option>
          <option value="BakeryFood">Bakery Food</option>
        </FieldContainer>
        <FieldContainer
          label="Product Image"
          type="file"
          onChange={handleFileChange}
          required={false}
        />
        <FieldContainer
          label="Expected Delivery Time (In Minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <FieldContainer
          label="Stock Quantity"
          value={stockQuantitiy}
          onChange={(e) => setStockQuantity(e.target.value)}
        />
        <FieldContainer
          label="Unit of Measurement"
          value={unit}
          Tag="select"
          onChange={(e) => setUnit(e.target.value)}
        >
          <option>Choose...</option>
          <option value="Bag">BAG(Bag)</option>
          <option value="Bucket">BKT(Bucket)</option>
          <option value="Bundle">BND(Bundle)</option>
          <option value="Bowl">BOWL(Bowl)</option>
          <option value="Box">BX(Box)</option>
          <option value="Card">CRD(Card)</option>
          <option value="Centimeters">CM(Centimeters)</option>
          <option value="Case">CS(Case)</option>
          <option value="Carton">CTN(Carton)</option>
          <option value="Dozen">DZ(Dozen)</option>
          <option value="Each">EA(Each)</option>
          <option value="Foot">FT(Foot)</option>
          <option value="Gallon">GAL(Gallon)</option>
          <option value="Gross">GROSS(Gross)</option>
          <option value="Inches">IN(Inches)</option>
          <option value="Kit">KIT(Kit)</option>
          <option value="Lot">LOT(Lot)</option>
          <option value="Meter">M(Meter)</option>
          <option value="Millimeter">MM(Millimeter)</option>
          <option value="Piece">PC(Piece)</option>
          <option value="Pack 100">PK100(Pack 100)</option>
          <option value="Pack 50">PK50(Pack 50)</option>
          <option value="Pair">PR(Pair)</option>
          <option value="Rack">Rack(Rack)</option>
          <option value="Roll">RL(Roll)</option>
          <option value="Set">SET(Set)</option>
          <option value="Set of 3">SET3(Set of 3)</option>
          <option value="Set of 4">SET4(Set of 4)</option>
          <option value="Set of 5">Set5(Set of 5)</option>
          <option value="Sheet">SGL(Sheet)</option>
          <option value="Square ft">SQFT(Square ft)</option>
          <option value="Tube">TUBE(Tube)</option>
          <option value="Yard">YD(Yard)</option>
        </FieldContainer>

        <FieldContainer
          label="Opening Stock"
          value={openingStock}
          onChange={(e) => setOpeningStock(e.target.value)}
        />
        <FieldContainer
          label="Opening Stock Date"
          type="date"
          value={openingStockDate}
          onChange={(e) => setOpeningStockDate(e.target.value)}
          required
        />
        {/* <FieldContainer
          label="Props 1"
          value={props1}
          required={false}
          onChange={(e) => setProps1(e.target.value)}
        />
        <FieldContainer
          label="Props 2"
          value={props2}
          required={false}
          onChange={(e) => setProps2(e.target.value)}
        />
        <FieldContainer
          label="Props 3"
          value={props3}
          required={false}
          onChange={(e) => setProps3(e.target.value)}
        /> */}

        <button
          type="button"
          className="btn btn-primary ml-3 mt-4"
          style={{ width: "10%", height: "10%" }}
          onClick={addMore}
        >
          Add Props
        </button>

        {addnewFields.map((addNew, index) => (
          <div key={addNew.key} className="row">
            <div className="col-md-4">
              <FieldContainer
                label="Props Types"
                name="value1"
                Tag="select"
                required={true}
                value={addNew.type}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "type")
                }
              >
                <option value="">Choose....</option>
                <option value="1">Props Type 1</option>
                <option value="2">Props Type 2</option>
                <option value="3">Props Type 3</option>
                <option value="4">Props Type 4</option>
                <option value="5">Props Type 5</option>
              </FieldContainer>
            </div>
            <div className="col-md-4">
              <FieldContainer
                label="Category *"
                name="value3"
                value={addNew.category}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "category")
                }
              />
            </div>
            <div className="col-md-4">
              <FieldContainer
                label="Prop Name *"
                name="value2"
                value={addNew.name}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "name")
                }
              />
            </div>
          </div>
        ))}

        {inputFields && (
          <div>
            {console.log(inputFields, "inputFields")}
            <h6>Props</h6>
            {inputFields.map((item, index) => {
              const isNullTypeAndName =
                item.type_id === null && item.prop_name === null;
              return (
                !isNullTypeAndName && (
                  <div key={index} className="d-flex">
                    <input
                      type="text"
                      className="form-control mt-2 col-2 me-2"
                      value={item.type_id}
                      disabled="disabled"
                      required={false}
                    />
                    <input
                      type="text"
                      className="form-control mt-2 col-4 me-2"
                      value={item.prop_category}
                      disabled="disabled"
                      required={false}
                    />
                    <input
                      type="text"
                      className="form-control mt-2 col-4"
                      value={item.prop_name}
                      disabled="disabled"
                      required={false}
                    />
                    <button
                      type="button"
                      className="btn btn-danger ml-2 mt-2"
                      onClick={() => removeProp(item.id)}
                      style={{ cursor: "pointer", height: "37px" }}
                    >
                      x
                    </button>
                  </div>
                )
              );
            })}
          </div>
        )}

        <FieldContainer
          label="Remark"
          Tag="textarea"
          rows={"3"}
          value={remark}
          required={false}
          onChange={(e) => setRemark(e.target.value)}
        />
        <FieldContainer
          label="Creation Date"
          disabled
          value={creationdate}
          onChange={(e) => setCreationDate(e.target.value)}
        />
        <FieldContainer
          label="Created By"
          disabled
          value={createdby}
          onChange={(e) => setCreatedBy(e.target.value)}
        />
        <FieldContainer
          disabled
          label="Last Updated By"
          value={lastupdatedby}
          onChange={(e) => setLastUpdatedBy(e.target.value)}
        />
        <FieldContainer
          label="Last Updated Date"
          disabled
          value={updatedDate}
          onChange={(e) => setUpdatedDate(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default ProductUpdate;
