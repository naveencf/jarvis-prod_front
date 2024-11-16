import React from 'react'
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
  } from "@react-pdf/renderer";
  import logo from "../../../public/logo.png";
  

const NDA = () => {
    const styles = StyleSheet.create({
        logoBold: {
          fontSize: 12,
          textAlign: "center",
          color: "black",
          fontFamily: "PB",
        },
        bold: {
          fontFamily:
            "MB",
        },
        pageBreak: {
          marginTop: 20,
          break: 'before',
        },
        link: {
          color: 'blue',
          textDecoration: 'underline',
        },
        marginTop:
        {
          marginTop: 20
        },
        table: {
          display: "table",
          width: "auto",
          borderStyle: "solid",
          borderWidth: 1,
          borderRightWidth: 0,
          borderBottomWidth: 0,
          borderColor: "black",
          marginBottom: 10,
        },
        tableHeadRow: {
          margin: "auto",
          flexDirection: "row",
        },
        tableHeadCol: {
          width: "52%",
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderColor: "black",
        },
        tableHeadColSmall: {
          width: "24%",
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderColor: "black",
        },
        tableHeadCell: {
          padding: 6,
          fontSize: 12,
          textAlign: "left",
          backgroundColor: "black",
          color: "white",
        },
        tableHeadCellSmall: {
          padding: 6,
          fontSize: 12,
          textAlign: "center",
          backgroundColor: "black",
          color: "white",
        },
        tableRow: {
          margin: "auto",
          flexDirection: "row",
        },
        tableCol: {
          width: "52%",
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderColor: "black",
        },
        tableColSmall: {
          width: "24%",
          borderStyle: "solid",
          borderWidth: 1,
          borderLeftWidth: 0,
          borderTopWidth: 0,
          borderColor: "black",
        },
        tableBodyCell: {
          padding: 6,
          fontSize: 11,
          textAlign: "left",
        },
        tableBodyCellSmall: {
          padding: 6,
          fontSize: 11,
          textAlign: "center",
        },
      
        body: {
          paddingTop: 20,
          paddingBottom: 80,
          paddingHorizontal: 20,
          paddingLeft: 60,  // Left margin
          paddingRight: 60,
          fontSize: 10,
          fontFamily: "MR",
        },
        header: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          paddingBottom: 20,
        },
        row: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
      
        },
        footName: {
          fontFamily: "PB",
          fontSize: 12,
      
        },
        footRow: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 6,
          marginTop: 4,
          marginBottom: 4,
        },
        logoImage: {
          width: "50px",
          height: "50px",
          objectFit: "contain",
        },
      
        logoText: {
          fontFamily: "PR",
          fontSize: 12,
          textAlign: "center",
          color: "black",
        },
        subjectSection: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 20,
        },
        points: {
          paddingBottom: 7,
          fontSize: 11,
          fontFamily: "MB",
        },
        text: {
          fontSize: 11,
          fontFamily: "MB",
        },
        section: {
          paddingBottom: 14,
          fontSize: 10,
          color: "black",
          textAlign: "justify",
          lineHeight: 1.5,
        },
        signatureImage: {
          width: "90px",
          height: "60px",
      
          objectFit: "cover",
        },
        signatureImage2: {
          width: "100px",
          height: "70px",
          objectFit: "contain",
        },
        Tableheading: {
          paddingBottom: 2,
          textAlign: "center",
          fontSize: 12,
          fontFamily: "MB",
          marginBottom: 5,
        },
        underline: {
          textDecoration: 'underline',
        },
        heading: {
          paddingBottom: 6,
          textAlign: "center",
          fontSize: 12,
          fontFamily: "MB",
          marginBottom: 10,
        },
        footer: {
          position: "absolute",
          marginTop: 10,
          bottom: 0,
          left: 0,
          right: 0,
          textAlign: "center",
          padding: 10,
        },
        middle: {
      
          marginTop: 30,
        },
      });

  return (
    <>
    <Document>
      <Page style={styles.body}>
        <View style={styles.header} fixed>
          <Image src={logo} style={styles.logoImage} />
          <View style={styles.row}>

            <Text style={styles.logoBold}>Creative</Text> <Text style={styles.logoText} >
              fuel</Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={styles.text}>NON-DISCLOSURE AGREEMENT</Text>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
          <Text>
            Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.) 452010.
          </Text>
          <View style={styles.footRow}>
            <Text >
              Tel: <Text>+91-8517907225</Text>
            </Text>
            <Text >
              Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
            </Text>
          </View>
          <Text style={styles.link}>www.creativefuel.io</Text>
        </View>
        </Page>
        </Document>
    </>
  )
}

export default NDA