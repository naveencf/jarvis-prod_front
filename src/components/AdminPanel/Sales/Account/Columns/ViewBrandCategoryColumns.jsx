import DateISOtoNormal from "../../../../../utils/DateISOtoNormal";
import { useEditBrandCategoryTypeMutation } from "../../../../Store/API/Sales/BrandCategoryTypeApi";
const handleEdit = async (row, setEditFlag) => {
  const [edit, { isLoading }] = useEditBrandCategoryTypeMutation();
  const payload = {
    id: row._id,
    brand_category_name: row.brand_category_name,
  };
  try {
    await edit(payload).unwrap();
    setEditFlag(false);
  } catch (error) { }
};
export const ViewBrandCategoryColumns = [
  {
    key: "Serial_no",
    name: "S.NO",
    renderRowCell: (row, index) => index + 1,
    width: 100,
    sortable: true,
  },
  {
    key: "brand_category_name",
    name: "Brand Category Name",
    renderRowCell: (row) => row.brand_category_name,
    width: 100,
    sortable: true,
    showCol: true,
    editable: true,
  },
  {
    key: "created_date",
    name: "Created Date",
    renderRowCell: (row) => DateISOtoNormal(row.created_date),
    width: 100,
    sortable: true,
    showCol: true,
  },
  {
    key: "action",
    name: "Actions",
    renderRowCell: (
      row,
      index,
      setEditFlag,
      editflag,
      handelchange,
      column
    ) => {
      if (index === editflag) console.log(row);

      if (editflag === false)
        return (
          <button
            className="icon-1"
            onClick={() => {
              setEditFlag(index);
              console.log(editflag);
            }}
          >
            <i className="bi bi-pencil" />
          </button>
        );
      if (index === editflag)
        return (
          <div className="d-flex gap-">
            <button
              className="icon-1"
              onClick={() => {
                setEditFlag(false);
                console.log(editflag);
              }}
            >
              <i className="bi bi-x" />
            </button>

            <button
              className="icon-1"
              onClick={() => {
                handleEdit(row, setEditFlag);
              }}
            >
              <i className="bi bi-save" />
            </button>
          </div>
        );
    },
    width: 100,
    sortable: true,
    showCol: true,
  },
];
