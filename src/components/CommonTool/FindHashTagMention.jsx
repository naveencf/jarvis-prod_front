import { Button, Grid, Stack, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import axios from "axios";
import React from "react";
import { useState, useEffect, useContext } from "react";
import { InstaInterpretorContext } from "../Interpretor/InterpretorContext";
import BulkHashtagHeader from "../BulkHashtagHeader";
import { Link } from "react-router-dom";
import InterpretorPostDashboard from "../Interpretor/InterpretorPostDashboard";
import ForHashTagInterpretorPostDashboard from "../Interpretor/ForHashTagInterpretorPostDashboard";
// import {  } from "react";
const date = new Date();
const menmap = new Map();
const hashmap = new Map();
const hashmapwithhashtag = new Map();
const blacklistset = new Set();
let universalarray = [];
function FindHashTagMention() {
  const { isDataFetched, setIsDataFetched, allpost, selectorpostloaded } =
    useContext(InstaInterpretorContext);

  const [rows, setRows] = useState([]);
  const [hashrows, setHashRows] = useState([]);
  const [mentionrows, setMentionRows] = useState([]);
  const [hashtagsrows, setHashtagsRows] = useState([]);
  const [showallpost, setShowAllpost] = useState(false);
  const [showDataGrid, setShowDataGrid] = useState(false);
  const [blacklist, setBlacklist] = useState(false);
  const [showpageview, setShowpageview] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [ind, setInd] = useState(0);
  const [showhashtag, setShowHashTag] = useState(false);
  // //console.log(allpost.length, "length");

  const hashmapwithmention = new Map();
  const handleallpost = () => {
    // //console.log("look complete data");
    if (allpost.length > 0) {
      setShowDataGrid(true);
      return;
    }
    setIsDataFetched(true); // Set a flag to indicate data fetching
  };
  // const posthashtags = async () => {
  //   const delayBetweenRequests = 10000; // 100 milliseconds (adjust as needed)
  //   const promises = blacklisthashtag.map(async (row, i) => {
  //     axios
  //       .post("https://insights.ist:8080/api/keyword", {
  //         keyword: row,
  //         createdBy: 1,
  //         status: 1,
  //       })
  //       .then(() => {
  //         //console.log("Blacklist Hashtags added");
  //       });
  //     // Introduce a delay between requests
  //     await new Promise((resolve) => setTimeout(resolve, delayBetweenRequests));
  //     // //console.log(row[0]._id, row[1]);
  //   });

  //   await Promise.all(promises);
  // };

  // const callallblacklistkeyboard =()={
  //   return;
  // }

  useEffect(() => {
    axios.get("https://insights.ist:8080/api/keyword").then((res) => {
      //console.log(res.data.data);
      const blacklistarray = res.data.data;
      for (let i = 0; i < blacklistarray.length; i++) {
        blacklistset.add(blacklistarray[i].keyword);
      }
      //console.log(blacklistset);
      setBlacklist(true);
    });
  }, []);

  const handlementions = () => {
    setRows(mentionrows);
  };
  const handlehashtags = () => {
    setRows(hashtagsrows);
  };
  const handlethisindexhashtag = (tempobject) => {
    //console.log(tempobject);
    if (tempobject != undefined) {
      setRows(tempobject);
      setShowpageview(true);
      setShowHashTag(false);
    }
  };

  const columns = [
    // { field: "id", headerName: "ID", width: 90 },
    {
      field: "S.NO",
      headernewname: "ID",
      width: 50,
      editable: false,

      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return (
          <div style={{ textAlign: "center", marginLeft: 10 }}>
            {rowIndex + 1}
          </div>
        );
      },
    },
    {
      field: "key",
      headerName: "HashTag & Mention",
      // type: "number",
      width: 200,
    },
    {
      field: "value",
      headerName: "Craetor Name & Count",
      // type: "number",
      width: 300,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        return (
          <div style={{ whiteSpace: "normal" }}>
            {rows[rowIndex].value.map((ele) => (
              <Grid container spacing={2}>
                <Grid item>
                  <Typography>
                    {ele.key} : {ele.value}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </div>
        );
      },
    },
    {
      field: "",
      headerName: "Link",
      width: 150,
      renderCell: (params) => {
        const creatorName = params.row.value[0].key;
        const tempobject = hashmapwithhashtag.get(params.row.key);
        // //console.log(tempobject);
        return (
          <div style={{ color: "blue", marginLeft: "40%" }}>
            {/* ${params.row.shortCode} */}
            {/* <Link to={`/admin/instaapi/interpretor/${tempobject?.creatorName}`}> */}
            <Button
              variant="outlined"
              onClick={() => handlethisindexhashtag(tempobject)}
            >
              Link
            </Button>
            {/* </Link> */}
          </div>
        );
      },
    },
    {
      field: "count",
      headerName: "Post Count",
      // type: "number",
      width: 300,
      renderCell: (params) => {
        const rowIndex = rows.indexOf(params.row);
        let count = 0;
        rows[rowIndex].value.map((ele) => {
          count = count + ele.value;
        });

        return (
          <div style={{ whiteSpace: "normal" }}>
            <Typography>{count}</Typography>
          </div>
        );
        // return <input type="text" placeholder="Filter..." />;
      },
    },
  ];
  // "/instaapi/interpretor/:creatorName/:shortCode"
  function extractHashtagsAndMentions(inputString) {
    const hashtags = new Set();
    const mentions = new Set();

    if (inputString != null) {
      const words = inputString.split(/\s+/); // Split the input string into words
      words.forEach((word) => {
        if (word.startsWith("#")) {
          const hashtag = word.replace(/[^a-zA-Z0-9_]+$/, ""); // Remove special characters from the end
          hashtags.add(hashtag.slice(1)); // Remove the '#' symbol and add to the Set
        } else if (word.startsWith("@")) {
          const mention = word.replace(/[^a-zA-Z0-9_]+$/, ""); // Remove special characters from the end
          mentions.add(mention.slice(1)); // Remove the '@' symbol and add to the Set
        }
      });
    }
    // Convert the Sets to arrays before returning
    return { hashtags: Array.from(hashtags), mentions: Array.from(mentions) };
  }

  const handlehashtagandmentions = (rows) => {
    //console.log(rows, "rows given to it");

    //console.log(blacklistset);
    // //console.log(hashmapwithhashtag, "blacklist");
    for (let i = 0; i < rows.length; i++) {
      var { hashtags, mentions } = extractHashtagsAndMentions(rows[i].title);
      if (hashtags.length > 0) {
        for (let j = 0; j < hashtags.length; j++) {
          const templower = hashtags[j].toLowerCase();
          if (!blacklistset.has(templower)) {
            if (hashmap.has(templower)) {
              let insidemap = hashmap.get(templower);
              let temp = rows[i].creatorName.toLowerCase();
              if (insidemap.has(temp)) {
                let y = insidemap.get(temp);
                insidemap.set(temp, y + 1);
              } else {
                insidemap.set(temp, 1);
              }
              const tempwb = hashmapwithhashtag.get(templower);
              // tempwb.push(rows[i]);
              // //console.log(typeof tempwb);
              // hashmapwithhashtag.set(templower, [...tempwb, rows[i]]);
            } else {
              hashmap.set(templower, new Map());
              let insidemap = hashmap.get(templower);
              let temp = rows[i].creatorName.toLowerCase();
              insidemap.set(temp, 1);
              const tempwb = [];
              tempwb.push(rows[i]);
              hashmapwithhashtag.set(templower, tempwb);
            }
          }
        }
      }
      if (mentions.length > 0) {
        for (let j = 0; j < mentions.length; j++) {
          const templower = mentions[j].toLowerCase();
          if (!blacklistset.has(templower)) {
            if (menmap.has(templower)) {
              let insidemap = menmap.get(templower);
              let temp = rows[i].creatorName.toLowerCase();
              if (insidemap.has(temp)) {
                let y = insidemap.get(temp);
                insidemap.set(temp, y + 1);
              } else {
                insidemap.set(temp, 1);
              }
            } else {
              menmap.set(templower, new Map());
              let insidemap = menmap.get(templower);
              let temp = rows[i].creatorName.toLowerCase();
              insidemap.set(temp, 1);
              hashmapwithhashtag.set(templower, rows[i]);
            }
          }
        }
      }
    }

    //console.log(hashmapwithhashtag, "otherthenblacklist");
    //console.log(hashmap, "hashTags");
    //console.log(menmap, "mentions");
    // Convert the nested Map into an array of objects
    const arrayOfObjects = Array.from(hashmap).map(([key, innerMap]) => ({
      key,
      value: Array.from(innerMap).map(([innerKey, innerValue]) => ({
        key: innerKey,
        value: innerValue,
      })),
    }));

    const arrayOfMentionObjects = Array.from(menmap).map(([key, innerMap]) => ({
      key,
      value: Array.from(innerMap).map(([innerKey, innerValue]) => ({
        key: innerKey,
        value: innerValue,
      })),
    }));

    let temphashtagarr = [];
    for (let i = 0; i < arrayOfObjects.length; i++) {
      if (arrayOfObjects[i].value.length > 3) {
        temphashtagarr.push(arrayOfObjects[i]);
      }
    }
    let tempmentionarr = [];
    for (let i = 0; i < arrayOfMentionObjects.length; i++) {
      if (arrayOfMentionObjects[i].value.length > 3) {
        tempmentionarr.push(arrayOfMentionObjects[i]);
      }
    }
    setRows(temphashtagarr);
    setHashtagsRows(temphashtagarr);
    setMentionRows(tempmentionarr);
    setShowDataGrid(true);
    setShowHashTag(true);
    // setPageview(false);
    //console.log(temphashtagarr);
    // //console.log(arrayOfMentionObjects);
    return hashmap;
  };

  const handleCheckBox = () => {
    //console.log("work", rowSelectionModel);
  };

  const callbotxforinterpretor = () => {
    //console.log("BotX for interpretor called");
    universalarray = rows;
    // //console.log(universalarray);
    for (let i = 0; i < universalarray.length; i++) {
      if (universalarray[i].posttype_decision == 1) {
        var { hashtags, mentions } = extractHashtagsAndMentions(
          universalarray[i].title
        );
        let selctorname = 748;
        let selctordate = date;
        if (universalarray[0].posttype_decision == 1) {
          selctorname = universalarray[0].selector_name;
          selctordate = universalarray[0].selector_date;
        }
        for (let j = 0; j < hashtags.length; j++) {
          const templower = hashtags[j].toLowerCase();
          if (map.has(templower)) {
            //console.log(templower);
            botXarray.push(universalarray[i]);
            const tempstringtonum = map.get(templower);

            axios
              .put("https://insights.ist:8080/api/instaupdate", {
                _id: universalarray[i]._id,
                posttype_decision: 11,
                selector_decision: 1,
                selector_name: selctorname,
                interpretor_decision: 1,
                interpretor_name: 748,
                auditor_decision: 1,
                auditor_name: 748,
                selector_date: selctordate,
                auditor_date: date,
                interpretor_date: date,
                pastComment: tempstringtonum,
              })
              .then(() => {
                //console.log("BotX filled data");
              });
          }
        }
        if (hashtags.length == 0) {
          for (let j = 0; j < mentions.length; j++) {
            const templower = mentions[j].toLowerCase();

            if (map.has(templower)) {
              //console.log(templower);
              // botxfindpost = true;
              botXarray.push(universalarray[i]);
              const tempstringtonum = map.get(templower);
              axios
                .put("https://insights.ist:8080/api/instaupdate", {
                  _id: universalarray[i]._id,
                  posttype_decision: 11,
                  selector_decision: 1,
                  selector_name: selctorname,
                  interpretor_decision: 1,
                  interpretor_name: 748,
                  auditor_decision: 1,
                  auditor_name: 748,
                  pastComment: tempstringtonum,
                  selector_date: selctordate,
                  auditor_date: date,
                  interpretor_date: date,
                })
                .then(() => {
                  //console.log("BotX filled data");
                });
            }
          }
        }
      }
    }
  };

  return (
    <>
      <div className="form-heading">
        <div className="form_heading_title">
          <h2>Pages</h2>
        </div>
      </div>
      <Stack sx={{ p: 1 }}>
        {allpost.length > 0 ? (
          <>
            <Stack direction="row" sx={{ justifyContent: "space-evenly" }}>
              <Button
                variant="outlined"
                size="small"
                color="success"
                onClick={() => handlehashtagandmentions(allpost)}
              >
                Get-Hashtags
              </Button>

              {blacklist && (
                <>
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={handlementions}
                  >
                    Mentions
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="success"
                    onClick={handlehashtags}
                  >
                    HashTags
                  </Button>
                </>
              )}
            </Stack>
            {showhashtag ? (
              <>
                {/* {showDataGrid && ( */}
                <>
                  <BulkHashtagHeader
                    rowSelectionModel={rowSelectionModel}
                    setRowSelectionModel={setRowSelectionModel}
                    rows={rows}
                    setRows={setRows}
                  />
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.key}
                    rowHeight={300}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 100,
                        },
                      },
                    }}
                    slots={{ toolbar: GridToolbar }}
                    pageSizeOptions={[5, 25, 50, 100]}
                    checkboxSelection
                    onRowClick={handleCheckBox}
                    onRowSelectionModelChange={(newRowSelectionModel) => {
                      setRowSelectionModel(newRowSelectionModel);
                    }}
                    rowSelectionModel={rowSelectionModel}
                    disableRowSelectionOnClick
                  />
                </>
              </>
            ) : (
              <>
                {showpageview && (
                  <ForHashTagInterpretorPostDashboard
                    creatorName={rows[0].creatorName}
                    rows={rows}
                    setRows={setRows}
                    promotionalpost={rows}
                    pageview={showpageview}
                    setPageview={setShowpageview}
                    isLoadiing={showpageview}
                    setLoading={setShowpageview}
                    callbotxforinterpretor={callbotxforinterpretor}
                    ind={ind}
                    setInd={setInd}
                  />
                )}
              </>
            )}
          </>
        ) : (
          <>
            <Button
              variant="outlined"
              size="small"
              color="success"
              onClick={handleallpost}
            >
              Find-Hashtags
            </Button>
          </>
        )}
      </Stack>
    </>
  );
}

export default FindHashTagMention;
