import React from "react";
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
import DateFormattingComponent from "../DateFormator/DateFormared";
import NDATable from "./table/NDATable";

const NDA = ({ allUserData }) => {
  const styles = StyleSheet.create({
    logoBold: {
      fontSize: 12,
      textAlign: "center",
      color: "black",
      fontFamily: "TB",
    },
    bold: {
      fontFamily: "TB",
    },
    pageBreak: {
      marginTop: 20,
      break: "before",
    },
    link: {
      color: "blue",
      textDecoration: "underline",
    },
    marginTop: {
      marginTop: 20,
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
      paddingLeft: 60, // Left margin
      paddingRight: 60,
      fontSize: 10,
      fontFamily: "TR",
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
      fontFamily: "TB",
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
      fontFamily: "TR",
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
      fontFamily: "TB",
    },
    text: {
      fontSize: 11,
      fontFamily: "TB",
    },
    section: {
      paddingBottom: 14,
      fontSize: 10,
      color: "black",
      textAlign: "justify",
      lineHeight: 1.5,
    },
    ParaGraph: {
      fontSize: 10,
      color: "black",
      fontFamily: "TR",
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
      textDecoration: "underline",
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

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <>
      <Document>
        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.text}>NON-DISCLOSURE AGREEMENT</Text>
          </View>

          <View style={styles.section}>
            <View style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}>
              <Text>
                This Non-Disclosure Agreement </Text> <Text style={[styles.bold]}> (“Agreement”)</Text> <Text>is effective from{" "}</Text> 
                <Text style={[styles.bold]}>{formatDate(allUserData?.joining_date)} </Text><Text>,(“Effective Date”), at </Text><Text>
                Creativefuel Pvt. Ltd, Indore.
              </Text>
            </View>

            <View style={styles.header}>
              <Text style={styles.text}>BY AND BETWEEN</Text>
            </View>

            <View style={styles.section}>
              <View
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <Text style={[styles.bold]}>Creativefuel </Text>
                <Text style={[styles.bold]}>Private</Text>
                <Text style={[styles.bold]}>Limited </Text>
                <Text>
                  , a company registered under the Companies Act 2013, having
                  its registered office
                </Text>
                <Text>
                  at 105, Gravity Mall, Warehouse Road, Vijay Nagar Indore MP “Disclosing Party”
                  452010 (hereinafter referred to as the
                </Text>
                <Text ></Text>

                <Text>
                  , which expression shall unless repugnant to the context or
                  meaning thereof means and{" "}
                </Text>

                <Text>
                  include its successors-in-interest and permitted assignees of
                  the{" "}
                </Text>
                <Text style={[styles.bold]}>FIRST PART.</Text>
              </View>
            </View>

            <View style={styles.header}>
              <Text style={styles.text}>AND</Text>
            </View >
            <View style={styles.section}>
                  <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
              <Text>
               Mr./Ms./Mrs. </Text><Text style={[styles.bold]}>{allUserData.user_name} </Text><Text> S/o/D/o/W/o </Text><Text style={[styles.bold]}>{allUserData.fatherName}</Text>
               <Text> currently residing at (hereinafter called the</Text><Text></Text><Text style={[styles.bold]}> “Receiving Party” </Text><Text>)
                which expression shall unless excluded by or repugnant to the
                context mean and include </Text><Text> its heirs, administrators, successors
                in interest, assignees, etc. of the</Text><Text style={[styles.bold]}> SECOND PARTY</Text>.
              </View>
            </View>

            <View style={styles.section}>
            <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
              <Text>
                The </Text><Text style={[styles.bold]}>Disclosing Party </Text><Text>and </Text><Text style={[styles.bold]}> Receiving Party</Text><Text> shall hereinafter be
                jointly referred to as “Parties” and individually </Text><Text> as a </Text><Text style={[styles.bold]}>“Party.”
              </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.points}>WHERE AS</Text>
            </View>
            <View style={styles.section}>
              <Text>
                1. The Disclosing Party is a private limited company, involved
                in the business of planning and executing marketing campaigns,
                website development, and creation of multimedia presentations
                for their clients. The Disclosing Party is a marketing agency
                that represents several reputable brands among its vast and
                versatile clientele and assists them through their innovative
                marketing strategies and expertise in the niche area of Meme and
                Instagram marketing.
              </Text>
            </View>
            <View style={styles.section}>
              <Text>
                2. The Receiving Party is an Individual who has been employed by
                the company as the ___________________.
              </Text>
            </View>
            <View style={styles.section}>
              <Text>
                3. In connection with the purpose of the employment, the
                Disclosing Party shall furnish the Receiving Party with certain
                confidential and proprietary information, to enable the
                Receiving Party to evaluate the feasibility of the Purpose.
              </Text>
            </View>
            <View style={styles.section}>
              <Text>
                4. All proprietary information, written, oral, data which is
                furnished by the Disclosing Party to the Receiving Party,
                whether furnished before or after the date of this Agreement and
                irrespective of the form of communication, whether marked
                confidential or not, shall be considered as confidential or
                other material derived by or developed based on such information
                in relation to the Disclosing
              </Text>
            </View>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>
        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
            <Text>
              Party or its Representatives in whole or in part. Such information
              is collectively referred to in this Agreement as </Text><Text style={[styles.bold]}> “Confidential
              Information.”
            </Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text>
              5. The Disclosing party wants to protect the confidentiality of
              the information made accessible to the Receiving Party and desires
              that the Receiving Party shall not breach the confidentiality and
              shall not disclose, sell, trade, publish, or otherwise disclose to
              anyone in any manner whatsoever the confidential information,
              specifically in a way that adversely impacts the interest of the
              Disclosing party.
            </Text>
          </View>

          <View style={styles.section}>
            <Text>
              6. The Receiving Party acknowledges and confirms that all
              information provided on or after the date of this Agreement shall
              be treated as confidential and shall not be used, sold, traded,
              published or disclosed in any other manner whatsoever for any
              purpose other than the purpose specifically agreed under this
              Agreement.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              7. The Parties wish to define their respective rights and
              obligations with respect to the Confidential Information.
            </Text>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
            <Text style={[styles.bold]}>
             NOW, THEREFORE,</Text><Text> for and in consideration of the above premises,
              and in further consideration of the</Text><Text> mutual covenants and promises
              contained herein and other good and valuable consideration, the
              receipt, adequacy, and sufficiency of which are hereby
              acknowledged, the parties hereto agree as follows:
            </Text>
            </View>
          </View>

          <View style={styles.header}>
            <Text style={styles.text}>
              IN CONNECTION WITH THE ABOVE, THE PARTIES HEREBY AGREE AS FOLLOWS:
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>1. DEFINITIONS</Text>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
            <Text style={[styles.bold]}>
              1.1 “Affiliate”</Text><Text> means any legal entity that controls, is
              controlled by or is commonly controlled by a party. “Control”
              means having more than 50-50 ownership or the right to direct the
              management of the entity;
            </Text>
            </View>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
           <Text style={[styles.bold]}>
              1.2 “Confidential Information”</Text><Text> shall mean and include any
              information disclosed by one Party to the other either directly or
              indirectly, in writing or orally, by inspection of tangible
              objects, documents, prototypes, samples, media, documentation,
              discs, and code. Confidential information including but not
              limited to materials, trade secrets, network information,
              configurations, trademarks, brand name, know-how, business,
              marketing and strategic planning, invention plans, customer
              information, computer programs, software codes, databases,
              suppliers, software, distribution channels; marketing studies,
              intellectual property information relating to process or products
              and designs, business plans, business opportunities, finances,
              research, and development; confidential information originally
              received from third parties; information relating to any type of
              technology, and all other material whether written or oral,
              tangible or intangible material or data relating to the current or
              future business and operations of the Disclosing Party and
              analysis, compilations, studies, summaries, extracts, or other
              documentation prepared by the Disclosing Party for the Company.
            </Text>
            </View>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text>
              studies, summaries, extracts, or other documentation prepared by
              the Disclosing Party for the Company.
            </Text>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
           <Text style={[styles.bold]}>
              1.3 “Effective Date” </Text><Text> shall mean the date mentioned above.
            </Text>
            </View>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
           <Text style={[styles.bold]}>
              1.4 “Purpose”</Text><Text> shall mean the purpose for which the confidential
              information shall be disclosed by the Disclosing Party to the
              Receiving Party and shall enable the Receiving Party to utilize
              such confidential information.
            </Text>
            </View>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
           <Text style={[styles.bold]}>
              1.5 “Property”</Text><Text> shall mean the area identified by the Disclosing
              Party for possible acquisition by the Receiving Party.
            </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>2. CONFIDENTIAL INFORMATION:</Text>
          </View>
          <View style={styles.section}>
          <View style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}>
           <Text>
              2.1 To this Agreement, the term </Text><Text style={[styles.bold]}>"Confidential Information"</Text><Text> shall
              mean such information relating to the </Text><Text>Disclosing Party as the
              Disclosing Party may from time to time provide to the Receiving
              Party under or relating to this Agreement including all
              information communicated in writing or orally relating to business
              affairs, any technical data, or know-how, including but not
              limited to, that which is or relates to:
            </Text>
            </View>
          </View>
          <View>
            <Text>
              a) Software Code and Machine Programs including but not limited to
              any source code, object code, or other forms of programming
              instructions related to the development, operation, or maintenance
              of software applications or systems or any other machine-readable
              codes.
            </Text>
            <Text>{" "}</Text>
            <Text>
              b) Algorithm including but not limited to Mathematical formulas,
              procedures, or rules used for problem-solving or data processing
              within software systems;
            </Text>
            <Text>{" "}</Text>
            <Text>
              c) System Designs including but not limited to Architectural
              plans, diagrams, or layouts detailing the structure, components,
              and interactions of computer systems, networks, or databases;
            </Text>
            <Text>{" "}</Text>
            <Text>
              d) Documentation including but not limited to technical manuals,
              user guides, or any other written materials describing the
              functionality, configuration, or operation of software, hardware,
              or IT systems;
            </Text>
            <Text>{" "}</Text>
            <Text>
              e) Specifications including but not limited to Detailed
              descriptions or requirements outlining the features, performance
              criteria, or functionality of software, hardware, or IT systems;
            </Text>
            <Text>{" "}</Text>
            <Text>
              f) Proprietary Information including but not limited to Any
              information or intellectual property belonging to the Disclosing
              Party, including trade secrets, know-how, patents, copyrights,
              trademarks, or other proprietary rights;
            </Text>
            <Text>{" "}</Text>
            <Text>
              g) Client Data including but not limited to Personal, financial,
              or other sensitive information collected, processed, or stored by
              the company as part of its business operations, including but not
              limited to customer records, contact information, transaction
              history, or account credentials;
            </Text>

          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <Text>
            h) Inventions, ideas, processes, researches, formats, formulas,
            human- readable code on any media, object code, data, programs,
            specifications, other works of authorship, improvements,
            discoveries, developments, designs, and techniques;
          </Text>
          <Text>{" "}</Text>
          <Text>
            i) Product plans, products, services, customers, markets,
            developments, inventions, processes, designs, drawings, engineering,
            hardware configuration information;
          </Text>
          <Text>{" "}</Text>
          <Text>
            j) Any other non-public market information, product plans;
          </Text>
          <Text>{" "}</Text>
          <Text>
            k) Marketing or finances of the company in any form, customer
            information, business plans and strategies, price lists and market
            studies;
          </Text>
          <Text>{" "}</Text>
          <Text>
            l) Contracts and clientele database, computer models and programs,
            research records, statistical methods of doing business, customers,
            finances, strategic and marketing plans, employee details, and such
            other proprietary information relating to the business of the
            Disclosing Party and is not in the public domain.
          </Text>
          <Text>{" "}</Text>
          <Text>
            m) Any Other Sensitive Information: Any other information that is
            not publicly available and is considered sensitive, confidential, or
            proprietary to the company, including but not limited to business
            plans, financial data, marketing strategies, research and
            development projects, or strategic partnerships;
          </Text>
          <Text>{" "}</Text>
          <View style={styles.section}>
            <Text>
              n) Any derivative, modifications, combinations, compilations, or
              summaries extracted from any of the aforementioned information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>3 CONFIDENTIALITY OBLIGATIONS:</Text>
          </View>

          <View style={styles.section}>
            <Text>
              3.1 The Disclosing Party agrees to make available to the Receiving
              Party all information as and when reasonably requested by the
              Receiving Party in pursuance of the furtherance of the common
              objective of the company.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              3.2 The Receiving party acknowledges that the confidential
              information if used for any purpose other than the purpose
              mutually agreed between the parties, could have material and
              adverse effect which could result in significant losses for the
              Disclosing Party.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              3.3 The Receiving party undertakes not to disclose the
              confidential information to any person other than as permitted
              under this Agreement and shall utilize the confidential
              information solely for the purpose mutually agreed between the
              parties.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              3.4 The Receiving party undertakes to make all inquiries or seek
              out any further information in relation to the confidential
              information on a confidential basis directly to the Disclosing
              party or the agents of the Disclosing party specified to the
              Receiving Party by the Disclosing Party.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              3.5 The Receiving party undertakes to strictly adhere to all the
              terms of this Agreement and apply adequate security measures for
              maintaining the secrecy of the Confidential Information.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              3.6 The Receiving party undertakes not to make any statement or
              announcement either verbally, in writing, graphic, photographic,
              electronic or any other form about the purpose or
            </Text>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text>
              the arrangements contained in this agreement except as otherwise
              permitted under this agreement.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              3.7 The Receiving Party shall protect the confidentiality of
              Disclosing Party`s Confidential Information in the same manner as
              they protect the confidentiality of their own proprietary and
              confidential information but not less than reasonable care.
              Receiving Party, while acknowledging the confidential and
              proprietary nature of the Confidential Information agrees to take
              all reasonable measures at its own expense to restrain its
              Representatives from prohibited or unauthorized disclosure or use
              of the Confidential Information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>
              CONFIDENTIALITY OBLIGATIONS PERTAINING TO SOFTWARE, CODES,
              PROGRAMS, ALGORITHMS AND TRADE SECRET:
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              4.1 The Receiving Party acknowledges that the nature of the
              business of the Disclosing Party, entails the Disclosing Party to
              own and hold the right to certain Software codes and algorithms
              and the Receiving Party during their employment shall have limited
              and non-exclusive right to access and use the software solely for
              the purpose as authorized by the Disclosing Party.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              4.2 The Receiving Party acknowledges that the source code and
              algorithms comprising the Software are highly sensitive and
              valuable assets of the Disclosing Party. Therefore, the Receiving
              Party agrees to take all necessary measures to maintain the
              confidentiality of the source code and algorithms, including but
              not limited to restricting access to authorized personnel only and
              implementing robust cybersecurity measures to prevent unauthorized
              access or disclosure.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              4.3 The Receiving Party shall not decompile, disassemble, or
              otherwise attempt to derive the source code or algorithms of the
              Software, either in whole or in part, except to the extent
              expressly permitted by applicable law.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              4.4 The Receiving Party shall not use the source code or
              algorithms of the Software for any purpose other than as expressly
              permitted under this Agreement. In particular, the Receiving Party
              shall not modify, adapt, or create derivative works based on the
              source code or algorithms without the prior written consent of the
              Disclosing Party.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              4.5 In the event of any unauthorized access, use, or disclosure of
              the source code or algorithms of the Software, the Receiving Party
              shall promptly notify the Disclosing Party and cooperate fully in
              any investigation or legal action undertaken by the Disclosing
              Party to protect its rights and interests.
            </Text>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>
              5. OWNERSHIP OF CONFIDENTIAL INFORMATION:
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              The Confidential Information shall be considered a valuable trade
              secret owned by the Disclosing Party. The Disclosing Party retains
              all rights, title, and interest in the Confidential Information.
              No license to the Receiving Party, under any trademark, patent, or
              copyright, or applications for same which are now or may
              thereafter be obtained by such Receiving Party, is either granted
              or implied by the conveying of Confidential Information to the
              Receiving Party. Confidential Information shall always remain the
              property of the Disclosing Party and may not be copied or
              reproduced by the Receiving Party without the Disclosing Party’s
              prior written consent.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>6. PURPOSE:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              This Agreement is created for the purpose of preventing the
              unauthorized disclosure of confidential and proprietary
              information regarding the Company.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>7. NO WARRANTIES:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              The Disclosing Party assumes no responsibility for any loss or
              damages that may be suffered by the Receiving Party, its clients,
              or any third parties on account of or arising from the
              Confidential Information. The Disclosing Party makes no warranties
              of any kind, whether express or implied, as to the accuracy or
              completeness of the Confidential Information.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>
              8. FURTHER RESPONSIBILITY OF THE RECEIVING PARTY:
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              8.1 That, the Receiving Party agrees to use the same degree of
              care to protect the confidentiality of the Confidential
              Information as it would exercise its own trade secrets and
              information but in no case less than a reasonable degree of care.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              8.2 That, the parties unequivocally acknowledge that the Parties
              shall protect the confidentiality of each other’s Confidential
              Information in the same manner as they protect the confidentiality
              of their own proprietary and confidential information of similar
              nature.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              8.3 That, each party, while acknowledging the confidential and
              proprietary nature of the Confidential Information agrees to take
              all reasonable measures at its own expense to restrain its
              Representatives from prohibited or unauthorized disclosure or use
              of the Confidential Information.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              8.4 That the Receiving party agrees, not to use Confidential
              Information provided by the Disclosing party for personal gain by
              providing any products or services on his/her own account or for
              the account of any third party. Information.
            </Text>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text>
              8.5 That the Receiving Party shall disclose such Confidential
              Information to only those employees, agents, and any other person
              who need such information and is officially authorized by the
              Disclosing Party to receive such confidential information for a
              limited purpose or limited time and only for executing his/her job
              responsibility.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>
              9. RETURN OF CONFIDENTIAL INFORMATION:
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              9.1 That, following the demand of the Disclosing Party, the
              Receiving Party will return/erase/destroy at any time upon giving
              written notice to the Receiving Party, within 15 (fifteen) days of
              receipt of such notice, whatever is asked by the Disclosing Party
              all Confidential Information of the Employer including but not
              limited to any computer programs, documentation, financial
              statement, forms, notes, plans, drawings, customer information
              (and copies and extracts thereof) furnished to, or created by or
              on behalf of, the Receiving Party. Return or destruction of such
              material shall not relieve the Receiving party of its obligations
              of confidentiality.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              9.2 That the Receiving Party shall exercise all reasonable
              endeavor’s to ensure that any third party to whom the Receiving
              Party has supplied the confidential information destroys or
              permanently erases such confidential information along with the
              copies made by them (if any) except where the recipient is
              required to retain such confidential information or its copies in
              adherence to any applicable law, rule, or regulation or by any
              governmental or regulatory body
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>10. PERMITTED DISCLOSURE:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              The foregoing notwithstanding, no information shall be considered
              Confidential Information if such information:
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              (i) is at the time of disclosure generally known by or available
              to the public or which becomes so known or available thereafter
              through no fault of the Receiving Party; or
            </Text>
            <Text>
              (ii) is legally known to the Receiving Party at the time of
              disclosure; or
            </Text>
            <Text>
              (iii) is furnished by the Disclosing Party to third parties
              without restriction; or
            </Text>
            <Text>
              (iv) is furnished to the Receiving Party by a third party who
              legally obtained said information and the right to disclose it; or
            </Text>
            <Text>
              (v) is developed independently by the Receiving Party where the
              Receiving Party can document such independent development.
            </Text>
            <Text>
              (vi) Must be disclosed pursuant to a court order, subpoena, or
              other applicable ruling or law, provided the receiving party shall
              obtain prior written consent from the disclosing party, terms and
              circumstances surrounding such request, and shall, at the expense
              of the disclosing party, use reasonable efforts to limit such
              disclosure to the extent requested by the disclosing party.
            </Text>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>11. REMEDIES TO PARTIES:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              The Parties recognize and acknowledge that Confidential
              Information is of a special, unique, and extraordinary character
              to the Disclosing Party. Therefore, Receiving Party hereby
              acknowledges that unauthorized disclosure or use of Confidential
              Information is a breach of this Agreement and the Receiving Party
              agrees that the Disclosing Party shall have the right to seek and
              obtain injunctive relief from breach of this Agreement and
              compensation for an amount equivalent to but not less than Rs.
              20,00,000/- (Rupees Twenty Lakhs Only) which is subject to
              increase depending upon the quantum of loss incurred by the
              Disclosing Party due to such breach determinable by the Disclosing
              Party and other rights and remedies the Disclosing Party is
              eligible to receive from a court of competent jurisdiction.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>12. RESTRICTION TO PARTIES:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              12.1 In addition to the limitations on the use and disclosures of
              Confidential Information set forth herein, it is agreed that
              neither party shall issue or release or confirm any statement, to
              the public, to the news media, or any third party, except with the
              prior concurrence of the other Party, both as to the content and
              timing of any such issue or release or confirmation.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              12.2 For a period of two (2) years following the Separation of the
              employment, the Receiving Party shall not, on its own behalf or on
              behalf of others, directly or indirectly (whether as an Employee,
              consultant, investor, partner, sole proprietor or otherwise) be
              employed by, perform any services for, or hold any ownership
              interest in any businesses engaged in the business of products and
              services which are processed and developed by the partnership,
              sole proprietorship or any other business model substantially
              similar to the Employer’s business.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              12.3 For a period of two (2) years after the termination of this
              Agreement, the Receiving Party agrees that he/she will not solicit
              for work or provide service or advice or assist others with the
              opportunity to do the same, any Client of any the Employer.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              12.4 The Receiving Party acknowledges and accepts that he shall
              not, during his employment and two (2) years after termination of
              employment, without the written consent of the Disclosing Party
              engage or join any Competitive Activity or any direct Competitors
              of the Disclosing Party or induce or attempt to induce, entice, or
              assist any of the employee(s), agents, independent contractors, or
              any supplier of Disclosing Party to leave the service.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              12.5 The Receiving Party shall not request, induce, or attempt to
              influence any customers of the Disclosing Party that have done
              business with or potential customers who have been in contact with
              the Disclosing Party to curtail or cancel any business they may
              transact with the Disclosing Party.
            </Text>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>13. ELECTRONIC SIGNATURE:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              Any signature (including any electronic symbol or process attached
              to, or associated with, a contract or other record and adopted by
              a Person with the intent to sign, authenticate or accept such
              contract or record) hereto or to any other certificate, agreement
              or document related to this transaction, and any contract
              formation or record-keeping through electronic means shall have
              the same legal validity and enforceability as a manually executed
              signature or use of a paper- based recordkeeping system to the
              fullest extent permitted by applicable law, and the parties hereby
              waive any objection to the contrary. The Parties acknowledge that
              the electronic signature will have the same legal force and effect
              as a handwritten signature.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>14. TERM AND TERMINATION:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              14.1 This Agreement will be effective from the date of execution
              of this Agreement by both the Parties and shall continue to be
              effective till the Agreement is terminated by the Disclosing Party
              by giving a 60 days’ notice, or until two (2) years from the date
              of termination of employment.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              14.2 If the receiving party has materially breached the terms or
              obligations under this Agreement, the disclosing party shall have
              the following rights:
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              a) Compel the receiving party to return or caused to be destroyed
              the confidential information immediately; and
            </Text>
            <Text>
              b) Terminate the agreement immediately if the breach is not cured
              within 60 days of notice given under clause 14.1 to this
              Agreement.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              14.3 Any event of termination of this agreement under this clause
              shall not relieve the Receiving Party from its confidentiality
              obligations envisaged under clause 2 of this agreement.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>15. THIRD PARTY CONFLICTS:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              Each Party represents and warrants that its actions concerning
              this Agreement do not conflict with any prior obligations to any
              third party. The Parties further agree not to disclose or to use
              on behalf of the other Party any Confidential Information
              belonging to any third party unless sufficient written
              authorization from the third party is provided.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>16. SEVERABILITY:</Text>
          </View>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text>
              16.1 If a court finds that any provision of this Agreement is
              invalid or unenforceable, the remainder of this Agreement shall be
              interpreted so as best to affect the intent of the Parties.
              Agreement in any other jurisdiction and such invalid or
              unenforceable provision shall be modified by such court so that it
              is enforceable to the extent permitted by applicable law.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              16.2 If any provision of this Agreement is deemed or held by a
              court of competent jurisdiction, to be contrary to law or
              otherwise unenforceable, it shall be enforced to the extent
              legally permissible and as necessary to reflect the intent of the
              Parties and shall not affect the remaining provisions of this
              Agreement, which shall remain in full force and effect. This
              Agreement may only be amended by a written notice executed by duly
              authorized representatives of both Parties.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>17. INTEGRATION:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              This Agreement expresses the complete understanding of the Parties
              with respect to the subject matter and supersedes all prior
              proposals, agreements, representations, and understandings. This
              Agreement may not be amended except by writing acknowledgment of
              the Parties.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>18. ENFORCEMENT:</Text>
          </View>
          <View style={styles.section}>
            <Text>
              The Parties acknowledge and agree that due to the unique and
              sensitive nature of the Confidential Information, any breach of
              this Agreement would cause irreparable harm for which damages and
              or equitable relief may be sought. The harmed Party shall be
              entitled to all remedies available at law.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>19. ARBITRATION:</Text>
          </View>

          <View style={styles.section}>
            <Text>
              This Agreement shall be governed by the laws of India. Both
              parties irrevocably submit to the exclusive jurisdiction of the
              Courts in Indore, for any action or proceeding regarding this
              Agreement. Any dispute or claim arising out of or in connection
              herewith, or the breach, termination, or invalidity thereof, shall
              be settled by arbitration in accordance with the provisions of
              Procedure of the Indian Arbitration & Conciliation Act, 1996,
              including any amendments thereof. The arbitration tribunal shall
              be composed of a Sole arbitrator and such arbitrator shall be
              appointed mutually by the Parties. The place of arbitration shall
              be Indore, India, and the arbitration proceedings shall take place
              in the English language.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>20. JURISDICTION::</Text>
          </View>
          <View style={styles.section}>
            <Text>
              Subject to the above, the courts at Indore shall have exclusive
              jurisdiction over all matters arising out of this Agreement. This
              Agreement shall be governed by the Laws of India.
            </Text>
          </View>

          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>

        <Page style={styles.body}>
          <View style={styles.header} fixed>
            <Image src={logo} style={styles.logoImage} />
            <View style={styles.row}>
              <Text style={styles.logoBold}>Creative</Text>{" "}
              <Text style={styles.logoText}>fuel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.points}>21. ORIGINALITY:</Text>
          </View>

          <View style={styles.section}>
            <Text>
              This Agreement may be executed in one or more counterparts, each
              of which will be deemed an original but all of which will
              constitute one and the same Agreement. Any photocopy, facsimile,
              or electronic reproduction of the executed Agreement shall
              constitute an original.
            </Text>
          </View>
          <View style={styles.section}>
            <Text>
              This Agreement represents the entire agreement and understanding
              between the Parties with respect to the subject matter herein and
              supersedes all prior agreements and understandings and writings of
              any kind, written or oral, express, or implied, with respect to
              the subject matter hereof.
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.points}>
              IN WITNESS WHEREOF, the Parties have through their duly authorized
              representatives executed this Agreement the day and the year first
              herein above written.
            </Text>
          </View>
           <NDATable/>
          <View style={styles.footer} fixed>
            <Text style={styles.footName}>CREATIVEFUEL PRIVATE LIMITED</Text>
            <Text>
              Registered office:105, Gravity Mall, Vijay Nagar Indore (M.P.)
              452010.
            </Text>
            <View style={styles.footRow}>
              <Text>
                Tel: <Text>+91-8517907225</Text>
              </Text>
              <Text>
                Email: <Text style={styles.link}>Fabhr@creativefuel.io</Text>
              </Text>
            </View>
            <Text style={styles.link}>www.creativefuel.io</Text>
          </View>
        </Page>
      </Document>
    </>
  );
};

Font.register({
  family: "MR",
  src: "/Lato-Regular.ttf",
});
Font.register({
  family: "MB",
  src: "/Lato-Bold.ttf",
});
Font.register({
  family: "PR",
  src: "/Poppins-Regular.ttf",
});
Font.register({
  family: "PB",
  src: "/Poppins-Bold.ttf",
});
Font.register({
  family: "TR",
  src: "/times new roman.ttf",
});
Font.register({
  family: "TB",
  src: "/times new roman bold.ttf",
});

export default NDA;
