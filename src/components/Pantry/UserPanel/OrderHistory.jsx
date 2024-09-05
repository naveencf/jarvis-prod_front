import { useEffect, useState } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import DataTable from "react-data-table-component";
import UserNav from "./UserNav";
import { set } from "date-fns";
import {baseUrl} from '../../../utils/config'

const OrderHistory = () => {
  const [oldUserProduct, setOldUserProduct] = useState([]);
  const [filterdata, setFilterData] = useState([]);
  const [search, setSearch] = useState("");
  const [reqDelApiData, setReqDelApiData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [item, setItem] = useState(null);
  const [productProp, setProductProp] = useState([]);
  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;
  const loginUserRoomId = decodedToken.room_id;

  useEffect(() => {
    axios
      .get(
        `${baseUrl}`+`get_single_orderreqshistory/${userId}`
      )
      .then((res) => {
        setOldUserProduct(res.data);
        setFilterData(res.data);
        console.log("orderhistory", res.data);
      });
  }, []);

  useEffect(() => {
    const result = oldUserProduct.filter((d) => {
      return d.Product_name.toLowerCase().match(search.toLowerCase());
    });
    setFilterData(result);
  }, [search]);

  useEffect(() => {
    axios
      .get(baseUrl+"get_delivery_boy")
      .then((res) => setReqDelApiData(res.data.results));
  }, []);

  let propNames = [];
  const setProductPropFunction = (productId, targetValue, propid) => {
    for (let i = 0; i < propNames.length; i++) {
      if (propNames[i][1] == propid) {
        propNames[i] = propNames[propNames.length - 1];
        propNames.pop();
      }
    }
    console.log(targetValue, "targetvalues ");
    const updatedPropNames = propNames.includes(targetValue)
      ? propNames.filter((name) => name !== targetValue)
      : [...propNames, [targetValue, propid]];
    propNames = updatedPropNames;
  };

  const handlePlaceOrder = async (row) => {
    if (propNames !== undefined) {
      for (let i = 0; i < propNames.length; i++) {
        propNames[i].pop();
      }
      var productProp1 = propNames.toString();
    }
    await axios.post(baseUrl+"add_orderreq", {
      product_id: row.product_id,
      order_quantity: row.Order_quantity,
      // special_request: specialRequest,
      user_id: row.User_id,
      sitting_id: row.Sitting_id,
      // message: element.message,
      remarks: "",
      created_by: userId,
      request_delivered_by: reqDelApiData[0].user_id,
      room_id: loginUserRoomId,
      props1: productProp1,
    });
    // console.log("new console", row.product_id);
  };

  const getRowDetail = (row) => {
    console.log(row.product_id);
    setSelectedRow(row);
    axios
      .get(
        `${baseUrl}`+`get_single_productdata/${row.product_id}`
      )
      .then((res) => {
        // console.log("new console", res.data);
        setItem(res.data);
      });
  };

  const columns = [
    {
      name: "S.No",
      cell: (row, index) => <div>{index + 1}</div>,
      //   width: "7%",
      sortable: true,
    },
    {
      name: "Sitting",
      selector: (row) => row.Sitting_ref_no + "|" + row.Sitting_area,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.Product_name,
      sortable: true,
    },
    {
      name: "Product Image",
      selector: (row) => (
        <img
          src={row.Product_image}
          style={{ width: "90px", height: "90px" }}
        />
      ),
      sortable: true,
    },
    {
      name: "Order Quantity",
      selector: (row) => row.Order_quantity,
      //   width: "12%",
    },
    {
      name: "Message",
      selector: (row) => row.Message,
    },
    {
      name: "Date/Time",
      selector: (row) => row.Request_datetime.split("T")[0],
    },
    {
      name: "Again Order",
      selector: (row) => (
        <button
          className="btn btn-danger"
          data-toggle="modal"
          data-target="#myModal"
          onClick={() => getRowDetail(row)}
        >
          Repeat order
        </button>
      ),
    },
  ];

  return (
    <>
      <UserNav />
      <div style={{ margin: "0 0 0 8%", width: "85%" }}>
        <div className="form-heading" style={{ margin: "10px 0 10px 0" }}>
          <div className="form_heading_title">
            <h2>User Order History</h2>
          </div>
        </div>

        <div className="modal fade" id="myModal" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">
                  &times;
                </button>
                {/* <h4 className="modal-title">Confirmation</h4> */}
              </div>
              <div className="modal-body">
                <p>Are you sure to repeat this order ?</p>

                <div className="addons">
                  <div className="addon_item_group">
                    {item?.Product_Prop.some((e) => e.type_id === 1) && (
                      <h4>
                        {item.Product_Prop.filter((e) => e.type_id === 1)
                          .map((e) => e.prop_category)
                          .filter(
                            (value, index, self) =>
                              self.indexOf(value) === index
                          )
                          .join(", ") + ":"}
                      </h4>
                    )}
                    {item?.Product_Prop.map((prop) => {
                      if (prop.type_id === 1 && prop.prop_name !== null) {
                        return (
                          <div
                            className="d-flex addon_item"
                            key={`${prop.prop_name}_${prop.type_id}`}
                          >
                            <input
                              type="radio"
                              name={`radio_${item.product_id}_${prop.type_id}`}
                              value={prop.prop_name}
                              onChange={(e) =>
                                setProductPropFunction(
                                  item.product_id,
                                  e.target.value,
                                  prop.type_id
                                )
                              }
                            />
                            <label>{prop.prop_name}</label>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  <br />
                  <div
                    className="type_id_container"
                    style={{ display: "contents" }}
                  >
                    <div className="addon_item_group">
                      {item?.Product_Prop.some((e) => e.type_id === 2) && (
                        <h4>
                          {item.Product_Prop.filter((e) => e.type_id === 2)
                            .map((e) => e.prop_category)
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index
                            )
                            .join(", ") + ":"}
                        </h4>
                      )}
                      {item?.Product_Prop.map((prop) => {
                        if (prop.type_id === 2 && prop.prop_name !== null) {
                          return (
                            <div
                              className="addon_item"
                              key={`${prop.prop_name}_${prop.type_id}`}
                            >
                              <input
                                type="radio"
                                name={`radio_${item.product_id}_${prop.type_id}`}
                                value={prop.prop_name}
                                onChange={(e) =>
                                  setProductPropFunction(
                                    item.product_id,
                                    e.target.value,
                                    prop.type_id
                                  )
                                }
                              />
                              <label>{prop.prop_name}</label>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                  <div
                    className="type_id_container"
                    style={{ display: "contents" }}
                  >
                    <div className="addon_item_group">
                      {item?.Product_Prop.some((e) => e.type_id === 3) && (
                        <h4>
                          {item.Product_Prop.filter((e) => e.type_id === 3)
                            .map((e) => e.prop_category)
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index
                            )
                            .join(", ") + ":"}
                        </h4>
                      )}
                      {item?.Product_Prop.map((prop) => {
                        if (prop.type_id === 3 && prop.prop_name !== null) {
                          return (
                            <div
                              className="addon_item"
                              key={`${prop.prop_name}_${prop.type_id}`}
                            >
                              <input
                                type="radio"
                                name={`radio_${item.product_id}_${prop.type_id}`}
                                value={prop.prop_name}
                                onChange={(e) =>
                                  setProductPropFunction(
                                    item.product_id,
                                    e.target.value,
                                    prop.type_id
                                  )
                                }
                              />
                              <label>{prop.prop_name}</label>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <div className="addon_item_group">
                      {item?.Product_Prop.some((e) => e.type_id === 4) && (
                        <h4>
                          {item.Product_Prop.filter((e) => e.type_id === 4)
                            .map((e) => e.prop_category)
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index
                            )
                            .join(", ") + ":"}
                        </h4>
                      )}
                      {item?.Product_Prop.map((prop) => {
                        if (prop.type_id === 4 && prop.prop_name !== null) {
                          return (
                            <div
                              className="addon_item"
                              key={`${prop.prop_name}_${prop.type_id}`}
                            >
                              <input
                                type="radio"
                                name={`radio_${item.product_id}_${prop.type_id}`}
                                value={prop.prop_name}
                                onChange={(e) =>
                                  setProductPropFunction(
                                    item.product_id,
                                    e.target.value,
                                    prop.type_id
                                  )
                                }
                              />
                              <label>{prop.prop_name}</label>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <div className="addon_item_group">
                      {item?.Product_Prop.some((e) => e.type_id === 5) && (
                        <h4>
                          {item.Product_Prop.filter((e) => e.type_id === 5)
                            .map((e) => e.prop_category)
                            .filter(
                              (value, index, self) =>
                                self.indexOf(value) === index
                            )
                            .join(", ") + ":"}
                        </h4>
                      )}
                      {item?.Product_Prop.map((prop) => {
                        if (prop.type_id === 5 && prop.prop_name !== null) {
                          return (
                            <div
                              className="addon_item"
                              key={`${prop.prop_name}_${prop.type_id}`}
                            >
                              <input
                                type="radio"
                                name={`radio_${item.product_id}_${prop.type_id}`}
                                value={prop.prop_name}
                                onChange={(e) =>
                                  setProductPropFunction(
                                    item.product_id,
                                    e.target.value,
                                    prop.type_id
                                  )
                                }
                              />
                              <label>{prop.prop_name}</label>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => handlePlaceOrder(selectedRow)}
                  data-dismiss="modal"
                >
                  Yes
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="data_tbl table-responsive">
            <DataTable
              title="User Order History"
              columns={columns}
              data={filterdata}
              fixedHeader
              fixedHeaderScrollHeight="62vh"
              highlightOnHover
              subHeader
              subHeaderComponent={
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-50 form-control"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHistory;
