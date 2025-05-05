import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000",
    lineHeight: 0,
  },
  tableRow: {
    flexDirection: "row",
    gap: 1,
    borderStyle: "solid",
    borderWidth: 0.5,
    // backgroundColor: '#fff',
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    padding: 2,
    backgroundColor: "#fff",
  },
  tableHeadCol: {
    width: "33.33%",
    borderStyle: "solid",
    padding: 2,
    backgroundColor: "#000",
    textAlign: "center",
    fontFamily: "PB",
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    textAlign: "center",

    width: "100%",
    backgroundColor: "#fff",
  },
  tableCell1: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    width: "100%",
    backgroundColor: "#fff",
  },
  tableHeader: {
    margin: "auto",
    marginTop: 5,
    fontSize: 10,
    width: "100%",
    backgroundColor: "#000",
    color: "#fff",
  },
});

// Create Document Component
const Inhandmore = ({ UserDetails }) => {
  // console.log("indhand more")
  let salary = UserDetails?.salary;
  //   let basicSalary = salary >= 19200 ? salary * 0.6 : 0;
  let basicSalary = salary * 0.8;
  let AdvanceBonus = basicSalary * 0.2;
  let specialAllowance =
    Number(salary) - (Number(basicSalary) + Number(AdvanceBonus));
  console.log(specialAllowance, "specialAllowance");

  let TotalEarnings =
    Number(basicSalary) + Number(AdvanceBonus) + Number(specialAllowance);
  // const PT =
  //   salary >= 18500 && salary <= 25000
  //     ? 125
  //     : salary >= 25001 && salary <= 34999
  //     ? 167
  //     : salary >= 35000
  //     ? 208
  //     : 0;
  console.log("more");
  let TotalCTC = salary;

  basicSalary = basicSalary?.toFixed(2);
  AdvanceBonus = AdvanceBonus.toFixed(2);
  specialAllowance = specialAllowance.toFixed(2);
  TotalEarnings = TotalEarnings.toFixed(2);
  TotalCTC = TotalCTC.toFixed(2);

  return (
    <>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={styles.tableHeadCol}>
            <Text style={styles.tableHeader}>EARNING</Text>
          </View>
          <View style={styles.tableHeadCol}>
            <Text style={styles.tableHeader}>MONTHLY</Text>
          </View>
          <View style={styles.tableHeadCol}>
            <Text style={styles.tableHeader}>ANNUALY</Text>
          </View>
        </View>
        {/* Table Rows */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell1}>Basic Salary</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {basicSalary}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              INR {(basicSalary * 12).toFixed(2)}
            </Text>
          </View>
        </View>
        {/* <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell1}>HRA</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {HRA}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {(HRA * 12).toFixed(2)}</Text>
          </View>
        </View> */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell1}>Advance Bonus</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {AdvanceBonus}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              INR {(AdvanceBonus * 12).toFixed(2)}
            </Text>
          </View>
        </View>
        {/* <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell1}>Monthly Leave Encashment</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {monthlyEncashment}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              INR {(monthlyEncashment * 12).toFixed(2)}
            </Text>
          </View>
        </View> */}
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell1}>Special Allowance</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {specialAllowance}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              INR {(specialAllowance * 12).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            {/* <Text style={styles.tableCell1}>TOTAL EARNING</Text> */}
            <Text style={styles.tableCell1}>Net Pay Before Tax</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>INR {TotalEarnings}</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>
              INR {(TotalEarnings * 12).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default Inhandmore;
