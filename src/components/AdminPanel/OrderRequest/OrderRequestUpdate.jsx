import { useState } from "react";

const OrderRequestMaster = () => {
  const [productId, setProductId] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [orderQuantity, setOrderQuantitiy] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");
  const [userId, setUserId] = useState("");
  const [sittingId, setSittingId] = useState("");
  const [requestDateTime, setRequestDateTime] = useState("");
  const [status, setStauts] = useState("");
  const [message, setMessage] = useState("");
  const [remark, setRemark] = useState("");
  const [creationDate, setCreationDate] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  return (
    <>
      <div className="form-heading">Role</div>
      <div className="row">
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Product id</label>
            <input
              className="form-control"
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-3 col-sm-12">
          <div className="form-group">
            <label className="form-label"> Category</label>
            <select
              className="form-select"
              value={productCategory}
              onChange={(e) => setProductCategory(e.target.value)}
              required
            >
              <option selected disabled value="">
                Choose...
              </option>
              {/* {roledata.map((option) => (
                  <option key={option.Role_id} value={option.Role_id}>
                    {option.Role_name}
                  </option>
                ))} */}
            </select>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Order Quantity</label>
            <input
              className="form-control"
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantitiy(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Special Request</label>
            <input
              className="form-control"
              type="text"
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">User Id</label>
            <input
              className="form-control"
              type="number"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Sitting ID</label>
            <input
              className="form-control"
              type="number"
              value={sittingId}
              onChange={(e) => setSittingId(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Request Date Time</label>
            <input
              className="form-control"
              type="number"
              value={requestDateTime}
              onChange={(e) => setRequestDateTime(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-3 col-sm-12">
          <div className="form-group">
            <label className="form-label"> status</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStauts(e.target.value)}
              required
            >
              <option selected disabled value="pending">
                Pending
              </option>
              <option disabled value="Delivered">
                Delivered
              </option>
            </select>
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              rows={"3"}
              className="form-control"
              type="number"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
          <div className="form-group">
            <label className="form-label">Remark</label>
            <textarea
              rows={"3"}
              className="form-control"
              type="number"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label className="form-label">Created By</label>
            <input
              className="form-control"
              type="text"
              value={creationDate}
              onChange={(e) => setCreationDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label className="form-label">Created By</label>
            <input
              className="form-control"
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label className="form-label">Last Updated By</label>
            <input
              className="form-control"
              type="text"
              value={lastUpdatedBy}
              onChange={(e) => setLastUpdatedBy(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
          <div className="form-group">
            <label className="form-label">Last Updated Date</label>
            <input
              className="form-control"
              type="text"
              value={lastUpdatedDate}
              onChange={(e) => setLastUpdatedDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <button
            className="btn btn-primary"
            style={{ marginRight: "5px" }}
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderRequestMaster;
