import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  useGetPmsPlatformQuery,
  useGetVendorsWithPaginationQuery,
} from "../../Store/reduxBaseURL";
import {
  useGetAllPageListWithPaginationQuery,
  useGetPlatformPriceQuery,
} from "../../Store/PageBaseURL";
import { useAddVendorInventoryMutation } from "../../Store/API/VendorSale/VendorSaleApi";
import formatString from "../../../utils/formatString";
import jwtDecode from "jwt-decode";
import { debounce } from "../../../utils/helper";
import { ArrowLeft } from "@phosphor-icons/react";

const AddVendorPage = () => {
  const { id } = useParams();

  const { data: platform } = useGetPmsPlatformQuery();
  const { data: platformPriceData, isLoading: isPriceLoading } =
    useGetPlatformPriceQuery();

  const [
    addVendorInventory,
    { isLoading: isAdding, isSuccess, isError, error },
  ] = useAddVendorInventoryMutation();
  const navigate = useNavigate();
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filteredPlatformPriceData, setFilteredPlatformPriceData] = useState(
    []
  );
  const [inputValue, setInputValue] = useState("");
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorInputValue, setVendorInputValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vendorSearch, setVendorSearch] = useState("");
  const [rowCount, setRowCount] = useState([
    { page_price_type_name: "", page_price_type_id: "", price: "" },
  ]);

  const token = sessionStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const {
    data: pages,
    refetch: refetchPageList,
    isLoading: isPageListLoading,
    isFetching: ispageListFetching,
  } = useGetAllPageListWithPaginationQuery({
    decodedToken,
    userID,
    page,
    limit,
    search,
  });
  const {
    data: vendorData,
    isLoading: isVendorLoading,
    isFetching: isVendorFetching,
  } = useGetVendorsWithPaginationQuery({
    page: pageNumber,
    limit: pageSize,
    search: vendorSearch,
  });

  const vendorOptions = vendorData?.data || [];
  const pageOptions = pages?.pages || [];
  const platformData = platform?.data || [];

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 300),
    []
  );

  const debouncedSearchVendor = useCallback(
    debounce((value) => {
      setVendorSearch(value);
    }, 300),
    []
  );

  useEffect(() => {
    if (vendorOptions && id) {
      const defaultVendor = vendorOptions?.find((vendor) => vendor._id === id);
      if (defaultVendor) {
        setSelectedVendor(defaultVendor);
        setVendorInputValue(defaultVendor.vendor_name);
      }
    }
  }, [vendorOptions, id]);

  useEffect(() => {
    if (platformData.length) {
      const defaultPlatform = platformData.find(
        (p) => p.platform_name.toLowerCase() === "instagram"
      );
      setSelectedPlatform(defaultPlatform || platformData[0]);
    }
  }, [platformData]);

  useEffect(() => {
    if (platformPriceData && selectedPlatform?._id) {
      const filtered = platformPriceData.filter(
        (item) => item.platfrom_id === selectedPlatform._id
      );
      setFilteredPlatformPriceData(filtered);
    } else {
      setFilteredPlatformPriceData([]);
    }
  }, [platformPriceData, selectedPlatform]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Vendor inventory added successfully!");
      setSelectedPlatform(null);
      setSelectedPage(null);
      setRowCount([
        { page_price_type_name: "", page_price_type_id: "", price: "" },
      ]);
      setInputValue("");
      setSearch("");
      navigate(`/admin/vendor-inventory/${selectedVendor._id}`);
    } else if (isError) {
      toast.error(
        `Failed to add inventory: ${error?.data?.message || error.error}`
      );
    }
  }, [isSuccess, isError, error]);

  const handlePlatformTypeChange = (newValue, index) => {
    const newRows = [...rowCount];
    if (newValue) {
      newRows[index].page_price_type_name = newValue.name;
      newRows[index].page_price_type_id = newValue._id;
    } else {
      newRows[index].page_price_type_name = "";
      newRows[index].page_price_type_id = "";
    }
    setRowCount(newRows);
  };

  const handlePriceChange = (e, index) => {
    const val = e.target.value;
    if (val !== "" && (val < 0 || isNaN(val))) return;
    const newRows = [...rowCount];
    newRows[index].price = val;
    setRowCount(newRows);
  };

  const addPriceRow = () => {
    setRowCount((prev) => [
      ...prev,
      { page_price_type_name: "", page_price_type_id: "", price: "" },
    ]);
  };

  const removePriceRow = (index) => {
    setRowCount((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!selectedPlatform) {
      toast.error("Please select a platform");
      return false;
    }
    if (!selectedPage) {
      toast.error("Please select a page");
      return false;
    }
    if (rowCount.length === 0) {
      toast.error("Please add at least one price row");
      return false;
    }
    for (let i = 0; i < rowCount.length; i++) {
      const row = rowCount[i];
      if (!row.page_price_type_name) {
        toast.error(`Please select platform type for row ${i + 1}`);
        return false;
      }
      if (!row.price) {
        toast.error(`Please enter price for row ${i + 1}`);
        return false;
      }
      if (isNaN(row.price) || parseFloat(row.price) < 0) {
        toast.error(`Price must be a positive number in row ${i + 1}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const price_list = {};

    rowCount.forEach((row) => {
      if (row.page_price_type_name && row.price) {
        price_list[row.page_price_type_name] = parseFloat(row.price);
      }
    });

    const payload = {
      platform_id: selectedPlatform?._id,
      page_name: selectedPage.page_name,
      page_id: selectedPage._id,
      price_list: [price_list],
      created_by: userID,
      vendor_customer_id: selectedVendor?._id,
    };

    addVendorInventory(payload);
  };

  return (
    <div style={{ padding: "1rem", backgroundColor: "white" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <Link to="/admin/vendor-sale/vendor-inventory">
          {" "}
          <ArrowLeft size={20} weight="bold" />
          All Vendor
        </Link>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        <div className="col-md-6 d-flex flex-column align-items-start">
          <p style={{ marginBottom: "0.5rem" }}>Select Platform</p>
          {platformData?.length ? (
            <Autocomplete
              options={platformData}
              getOptionLabel={(option) => formatString(option.platform_name)}
              value={selectedPlatform}
              onChange={(e, newValue) => setSelectedPlatform(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Platform" />
              )}
              sx={{ width: 350, marginBottom: 4 }}
              disabled={isAdding}
            />
          ) : (
            ""
          )}
        </div>

        <div className="col-md-6 d-flex flex-column align-items-start">
          <p style={{ marginBottom: "0.5rem" }}>Search Page</p>
          <Autocomplete
            options={pageOptions}
            getOptionLabel={(option) => option.page_name || ""}
            value={selectedPage}
            onChange={(e, newValue) => setSelectedPage(newValue)}
            inputValue={inputValue}
            onInputChange={(e, newInputValue) => {
              setInputValue(newInputValue);
              debouncedSearch(newInputValue);
            }}
            loading={isPageListLoading || ispageListFetching}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Page"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {(isPageListLoading || ispageListFetching) && (
                        <CircularProgress color="inherit" size={20} />
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
                disabled={isAdding}
              />
            )}
            sx={{ width: 350, marginBottom: 4 }}
          />
        </div>
      </div>

      <Autocomplete
        options={vendorOptions}
        getOptionLabel={(option) => option.vendor_name || ""}
        value={selectedVendor}
        onChange={(e, newValue) => setSelectedVendor(newValue)}
        inputValue={vendorInputValue}
        onInputChange={(e, newInputValue) => {
          setVendorInputValue(newInputValue);
          debouncedSearchVendor(newInputValue);
        }}
        loading={isVendorLoading || isVendorFetching}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Vendor"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {(isVendorLoading || isVendorFetching) && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            disabled={isAdding}
          />
        )}
        sx={{ width: 350, marginBottom: 4 }}
      />
      <p style={{ marginBottom: "0.5rem" }}>Set Prices</p>
      {rowCount.map((row, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
            maxWidth: 600,
          }}
        >
          <Autocomplete
            sx={{ width: 300 }} // fixed width for Autocomplete
            options={filteredPlatformPriceData}
            getOptionLabel={(option) => option.name}
            value={
              filteredPlatformPriceData?.find(
                (pt) => pt._id === row.page_price_type_id
              ) || null
            }
            onChange={(e, newValue) =>
              handlePlatformTypeChange(newValue, index)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Platform Type"
                disabled={isAdding}
              />
            )}
          />

          <TextField
            label="Price"
            type="text"
            value={row.price}
            onChange={(e) => handlePriceChange(e, index)}
            sx={{ width: 100 }} // fixed width for price input
            disabled={isAdding}
          />

          {index !== 0 && (
            <IconButton
              color="error"
              onClick={() => removePriceRow(index)}
              aria-label="Remove row"
              size="large"
              disabled={isAdding}
            >
              <CloseIcon />
            </IconButton>
          )}
        </div>
      ))}

      <Button
        onClick={addPriceRow}
        startIcon={<AddIcon />}
        variant="outlined"
        sx={{ marginBottom: 4 }}
        disabled={isAdding}
      >
        Add Price
      </Button>

      <br />

      <Button variant="contained" onClick={handleSubmit} disabled={isAdding}>
        {isAdding ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

export default AddVendorPage;
