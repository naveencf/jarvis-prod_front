import Typography from "@mui/material/Typography";
import MuiAccordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { List, ListItemButton, ListItemText, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import {
  useGetAllPageCategoryQuery,
  useGetOwnershipTypeQuery,
} from "../../../Store/PageBaseURL";
import {
  useGetAllVendorQuery,
  useGetPmsPlatformQuery,
} from "../../../Store/reduxBaseURL";
import axios from "axios";
import { baseUrl } from "../../../../utils/config";
export default function InfoCards({ pageRow }) {
  const [user, setUser] = useState([]);
  const { data: ownerShipData } = useGetOwnershipTypeQuery();
  const { data: platData } = useGetPmsPlatformQuery();
  const platformData = platData?.data;

  const { data: pageCate } = useGetAllPageCategoryQuery();
  const cat = pageCate?.data;

  const { data: vendor } = useGetAllVendorQuery();
  const vendorData = vendor?.data;

  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    "&:not(:last-child)": { borderBottom: 0 },
    "&::before": { display: "none" },
  }));

  const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      {...props}
    />
  ))(({ theme }) => ({
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, .05)"
        : "rgba(0, 0, 0, .03)",
    flexDirection: "row-reverse",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": { marginLeft: theme.spacing(1) },
  }));

  const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: "1px solid rgba(0, 0, 0, .125)",
  }));

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get(baseUrl + "get_all_users").then((res) => {
      setUser(res.data.data);
    });
  };
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ width: "50%" }}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Personal Detail</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Name" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Status" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Ownership" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Platform" />
                </ListItemButton>
                {/* <ListItemButton 
                // onClick={handleClick}
                >
                  <ListItemText primary="Contact" />
                </ListItemButton>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary="Alternate" />
                    </ListItemButton>
                  </List>
                </Collapse> */}
              </List>

              <List sx={{ bgcolor: "background.paper" }} component="nav">
                <ListItemButton>
                  <ListItemText primary={pageRow?.page_name} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={pageRow?.status == 1 ? "Active" : "Inactive"}
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={
                      ownerShipData?.find(
                        (item) => item._id === pageRow?.ownership_type
                      )?.company_type_name
                    }
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={
                      platformData?.find(
                        (item) => item?._id == pageRow?.platform_id
                      )?.platform_name
                    }
                  />
                </ListItemButton>
                {/* <ListItemButton
                //  onClick={handleClick}
                 >
                  <ListItemText primary={pageRow?.mobile} />
                  {open ? (
                    <ArrowForwardIosSharpIcon />
                  ) : (
                    <ArrowForwardIosSharpIcon />
                  )}
                </ListItemButton> */}
                {/* <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary={pageRow?.alternate_mobile} />
                    </ListItemButton>
                  </List>
                </Collapse> */}
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ width: "50%" }}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Personal Address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Category" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Followers" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Vendor" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Active Platform" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Tag Category" />
                </ListItemButton>
              </List>

              <List sx={{ bgcolor: "background.paper" }} component="nav">
                <ListItemButton>
                  <ListItemText
                    primary={
                      cat?.find(
                        (item) => item?._id == pageRow?.page_category_id
                      )?.category_name
                    }
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={pageRow?.followers_count} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={
                      vendorData?.find(
                        (item) => item?._id == pageRow?.vendor_id
                      )?.vendor_name
                    }
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={platformData
                      ?.filter((item) => {
                        return pageRow.platform_active_on.includes(item._id);
                      })
                      ?.map((item) => item.platform_name)
                      .join(", ")}
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={cat
                      .filter((item) => {
                        return pageRow?.tags_page_category?.includes(item._id);
                      })
                      .map((item) => item.page_category)
                      ?.map((item, i, arr) => {
                        return (
                          <p
                            key={i}
                            // onClick={handleTagCategory(data)}
                            style={{ display: "inline", cursor: "pointer" }}
                          >
                            {item}
                            {i !== arr?.length - 1 && ","}
                          </p>
                        );
                      })}
                  />
                </ListItemButton>
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
          sx={{ width: "50%" }}
        >
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <Typography>Company Address</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="row">
              <List
                sx={{ bgcolor: "background.paper", width: "50%" }}
                component="nav"
              >
                <ListItemButton>
                  <ListItemText primary="Name Type" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Content Creation" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Rate Type" />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary="Closed By" />
                </ListItemButton>
                {/* <ListItemButton>
                  <ListItemText primary="Pin-Code" />
                </ListItemButton> */}
              </List>

              <List sx={{ bgcolor: "background.paper" }} component="nav">
                <ListItemButton>
                  <ListItemText
                    primary={
                      pageRow?.page_name_type != 0 ? pageRow.page_name_type : ""
                    }
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={
                      pageRow?.content_creation != 0
                        ? pageRow.content_creation
                        : ""
                    }
                  />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText primary={pageRow?.rate_type} />
                </ListItemButton>
                <ListItemButton>
                  <ListItemText
                    primary={
                      user?.find(
                        (item) => item?.user_id == pageRow?.page_closed_by
                      )?.user_name
                    }
                  />
                </ListItemButton>
                {/* <ListItemButton>
                  <ListItemText primary={pageRow?.company_pincode} />
                </ListItemButton> */}
              </List>
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </>
  );
}
