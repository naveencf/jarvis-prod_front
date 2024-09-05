import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import FormContainer from "../FormContainer";
import FieldContainer from "../FieldContainer";
import { useGlobalContext } from "../../../Context/Context";
import {baseUrl} from '../../../utils/config'

const ProductMaster = () => {
  // const [categoryNames, setCategoryNames] = useState({});
  const { toastAlert } = useGlobalContext();
  const [productName, setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productImage, setProductImage] = useState([]);
  const [duration, setDuration] = useState("");
  const [stockQuantitiy, setStockQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [openingStockDate, setOpeningStockDate] = useState("");
  const [remark, setRemark] = useState("");
  const [inputFields, setInputFields] = useState([]);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const [minutes] = duration.split(":").map(Number);
    const durationInMinutes = 0 * 60 + minutes;
    console.log(durationInMinutes, "duration here");

    const formData = new FormData();
    formData.append("Product_name", productName);
    formData.append("Product_type", productType);
    formData.append("Duration", durationInMinutes);
    formData.append("Product_image", productImage);
    formData.append("Stock_qty", stockQuantitiy);
    formData.append("Unit", unit);
    formData.append("Opening_stock", openingStock);
    formData.append("Opening_stock_date", openingStockDate);
    formData.append("Remarks", remark);

    await axios.post(baseUrl+"add_product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    for (const inputField of inputFields) {
      const payload = {
        type_id: inputField.type,
        prop_name: inputField.name,
        prop_category: inputField.category,
      };

      try {
        await axios.post(
          `${baseUrl}`+`add_proppost`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

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
    setOpeningStock("");
    setOpeningStockDate("");
    setRemark("");

    toastAlert("Product added success");
    setIsFormSubmitted(true);
  };

  const addMore = (e) => {
    setInputFields([...inputFields, { type: "", name: "", category: "" }]);
  };

  const handleInputChange = (index, value, property) => {
    const updatedValues = [...inputFields];
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
    setInputFields(updatedValues);
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setProductImage(e.target.files[0]);
    } else {
      setProductImage(null);
    }
  };
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
        />
        <FieldContainer
          label="Expected Delivery Time"
          value={duration}
          placeholder={"HH:MM"}
          type={"time"}
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

        {inputFields.map((inputField, index) => (
          <div key={inputField.key} className="row">
            <div className="col-md-4">
              <FieldContainer
                label="Props Types"
                name="value1"
                Tag="select"
                required={true}
                value={inputField.type}
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
                // value={inputField.type in categoryNames ? categoryNames[inputField.type] : inputField.category}
                value={inputField.category}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "category")
                }
              />
            </div>
            <div className="col-md-4">
              <FieldContainer
                label="Prop Name *"
                name="value2"
                value={inputField.name}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, "name")
                }
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-primary mb-2 ml-3"
          style={{ width: "10%", height: "10%" }}
          onClick={addMore}
        >
          Add Props
        </button>

        <FieldContainer
          label="Remark"
          Tag="textarea"
          required={false}
          rows={"3"}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
      </FormContainer>
    </>
  );
};

export default ProductMaster;
