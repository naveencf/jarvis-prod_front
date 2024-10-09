import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../../Context/Context';
import FieldContainer from '../FieldContainer';
import FormContainer from '../FormContainer';
import { baseUrl } from '../../../utils/config';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router';
import Select, { components } from 'react-select';
import './Tagcss.css';

import { useNavigate } from 'react-router';
import { useGetAllPageCategoryQuery } from '../../Store/PageBaseURL';

const PageAssignmentUserAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // const { data: category } = useGetAllPageCategoryQuery();
  // const categoryData = category?.data || [];

  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState(0)
  const [subCat, setSubCat] = useState([])
  const [categoryData, setCategoryData] = useState([])

  const getData = () => {
    axios
      .get(baseUrl + 'get_all_users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      })
      .then((res) => {
        setUserData(res.data.data);
      });

    axios
      .get(baseUrl + 'v1/page_sub_category', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', 
        },
      })
      .then((res) => {
        setCategoryData(res.data.data);
      });
  };

  useEffect(() => {
    getData();

    let subCategoriesDataList = subCat?.map((e) => ({
      value: e._id,
      label: e.page_sub_category,
    }));
    setSubCat(subCategoriesDataList ? subCategoriesDataList : []);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!userId && subCat.length == 0){
      toastError('Please select user and sub category')
      return
    }

    const payload = {
      user_id: userId,
      page_sub_category_id: subCat,
      created_by: userID
    };

    await axios
      .post(baseUrl + 'v1/add_page_cat_assignment', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(() => {
        setIsFormSubmitted(true);
        toastAlert(' Data Submitted Successfully');
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("E11000")) {
          toastError("Duplicate Page Name.");
        } else {
          toastError(errorMessage);
        }
        // toastError(error.response.data.message);
      });
  };

  if (isFormSubmitted) {
    return navigate('/admin/pms-page-cat-assignment-overview');
  }
 
  return (
    <>
      <FormContainer
        mainTitle={'Page Cat Assignment'}
        link={true}
        // handleSubmit={handleSubmit}
        submitButton={false}
      />

      <div className='card'>
          <div className="card-header">
            <h5 className="card-title">Profile Master</h5>
          </div>
        <div className="card-body pb4">
          <div className="row thm_form">
            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  User <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  // components={{ MenuList }}
                  options={userData.map((option) => ({
                    value: option.user_id,
                    label: option.user_name,
                  }))}
                  required={true}
                  value={{
                    value: userId,
                    label: userData.find((role) => role.user_id == userId )?.user_name || '',
                  }}
                  onChange={(e) => {
                    setUserId(e.value);
                  }}
                />
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Sub Categories <sup style={{ color: 'red' }}>*</sup>
                </label>
                <div className="">
                <Select
                  required={true}
                  options={categoryData.map((option) => ({
                    value: option._id,
                    label: option.page_sub_category,
                  }))}
                  isMulti
                  value={subCat}
                  onChange={(e) => {
                    setSubCat(e);
                  }}
                ></Select>
                </div>
              </div>
            </div>    
            <button
              className="btn cmnbtn btn-primary"
              type="submit"
              onClick={handleSubmit}
            >Submit
            </button>

          </div>
        </div>
      </div>

    </>
  );
};

export default PageAssignmentUserAdd;