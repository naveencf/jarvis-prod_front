import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobalContext } from '../../../Context/Context';
import FieldContainer from '../FieldContainer';
import FormContainer from '../FormContainer';
import { baseUrl } from '../../../utils/config';
import jwtDecode from 'jwt-decode';
import { useLocation } from 'react-router';
import Select from 'react-select';
import './Tagcss.css';
import { useNavigate } from 'react-router';
import { useGetAllPageCategoryQuery, useGetAllPageSubCategoryQuery } from '../../Store/PageBaseURL';
import { useAPIGlobalContext } from '../APIContext/APIContext';
import formatString from '../../../utils/formatString';

const PageAssignmentUserAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { data: category } = useGetAllPageCategoryQuery();
  const categoryData = category?.data || [];

  const { data: subcategory } =
    useGetAllPageSubCategoryQuery();
  
  const [categorys, setCategorys] = useState("");
const {userContextData} = useAPIGlobalContext()
  const token = sessionStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const userID = decodedToken.id;

  const { toastAlert, toastError } = useGlobalContext();
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [userId, setUserId] = useState(0);
  const [subCategoryOptions, setSubCategoryOptions] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  useEffect(() => {
    if (categorys) {
      axios
        .get(baseUrl + `v1/get_all_sub_cat_with_cat_id/${categorys}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          const subCatList = res.data.map((subCat) => ({
            value: subCat.page_sub_category_id,
            label: subCat.page_sub_category_name,
          }));
  
          // Check if any new sub-categories were added
          const newSubCategories = subCatList.filter(
            (newSubCat) =>
              !selectedSubCategories.some(
                (oldSubCat) => oldSubCat.value === newSubCat.value
              )
          );
  
          if (newSubCategories.length > 0) {
            // Only update if there are new sub-categories to add
            setSubCategoryOptions(subCatList);
            setSelectedSubCategories((prevSelected) => [
              ...prevSelected,
              ...newSubCategories,
            ]);
          } else {
            setSubCategoryOptions(subCatList); // Just update the subcategory options
          }
        })
        .catch((error) => {
          console.error('Error fetching sub-categories:', error);
          toastError('Failed to load sub-categories');
        });
    }
  }, [categorys, token, toastError]);

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategories(e || []); // Update the selected sub-categories based on user selection
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || selectedSubCategories.length === 0) {
      toastError('Please select user and sub-categories');
      return;
    }

    const payload = {
      user_id: userId,
      page_sub_category_id: selectedSubCategories.map((subCat) => subCat.value),
      created_by: userID,
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
        toastAlert('Data Submitted Successfully');
      })
      .catch((error) => {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('E11000')) {
          toastError('Duplicate Page Name.');
        } else {
          toastError(errorMessage);
        }
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
        submitButton={false}
      />

      <div className="card">
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
                  options={userContextData.map((option) => ({
                    value: option.user_id,
                    label: option.user_name,
                  }))}
                  required={true}
                  value={{
                    value: userId,
                    label: userContextData.find((user) => user.user_id === userId)?.user_name || '',
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
                  Category <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  options={categoryData.map((option) => ({
                    value: option._id,
                    label: formatString(option.page_category),
                  }))}
                  value={{
                    value: categorys,
                    label: formatString(categoryData.find((cat) => cat._id === categorys)?.page_category) || '',
                  }}
                  onChange={(e) => {
                    setCategorys(e.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="col-md-6 mb16">
              <div className="form-group m0">
                <label className="form-label">
                  Sub Categories <sup style={{ color: 'red' }}>*</sup>
                </label>
                <Select
                  options={subCategoryOptions}
                  isMulti
                  value={selectedSubCategories}
                  onChange={handleSubCategoryChange}
                  required
                />
              </div>
            </div>

            <div className="col-12">
              <button
                className="btn cmnbtn btn-primary"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PageAssignmentUserAdd;
