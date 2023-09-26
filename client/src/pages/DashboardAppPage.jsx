import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
// import Iconify from "../components/iconify";

// sections
import {
  // AppTasks,
  // AppNewsUpdate,
  // AppOrderTimeline,
  AppCurrentVisits,
  // AppWebsiteVisits,
  // AppTrafficBySite,
  AppWidgetSummary,
  AppCurrentSubject,
  AppConversionRates,
  EmotionAnalyzer,
  AppWordCloud,
} from "../sections/@dashboard/app";

const gridItemStyle = {
  // border: '1px solid #000', // You can customize the border style
};
// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title>SenseSenti | Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 2, color: "#ccc" }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Calls Received"
              total={714000}
              color="widget1"
              icon={"ant-design:android-filled"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Issues Fixed"
              total={1352831}
              color="widget2"
              icon={"ant-design:apple-filled"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Happy Customers"
              total={111384}
              color="widget3"
              icon={"ant-design:windows-filled"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Bug Reports"
              total={234}
              color="widget4"
              icon={"ant-design:bug-filled"}
            />
          </Grid>

          {/* <Grid item xs={12} md={6} lg={4} style={gridItemStyle}>
            <img
              src={WordCloudImg}
              alt="wordcloud"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </Grid> */}
          <Grid item xs={12} md={6} lg={4} style={gridItemStyle}>
            <AppWordCloud
              title="Word Cloud"
              subheader="Most used words by the coustomer"
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4} style={gridItemStyle}>
            <AppCurrentVisits
              title="Mood Chart"
              subheader="Callers Mood Percentage"
              chartData={[
                { label: "Neutral", value: 8443 },
                { label: "Sad", value: 4344 },
                { label: "Angry", value: 1435 },
                { label: "Happy", value: 3443 },
                { label: "Disust", value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4} style={gridItemStyle}>
            <AppCurrentSubject
              title="Caller Reports"
              subheader="Call Handler Report"
              chartLabels={["Neutral", "Sad", "Angry", "Disgust", "Happy"]}
              chartData={[
                { name: "Caller Rohan", data: [80, 50, 30, 40, 100] },
                { name: "Caller Rohit", data: [50, 30, 40, 80, 20] },
                { name: "Caller Raman", data: [54, 76, 78, 13, 43] },
              ]}
              chartColors={[...Array(5)].map(
                () => theme.palette.text.secondary
              )}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} style={gridItemStyle}>
            <AppConversionRates
              title="Most Repetitive Issues"
              chartData={[
                { label: "Login Not working", value: 56 },
                { label: "Undelivered Product", value: 45 },
                { label: "Printer Malfunctioning", value: 12 },
                { label: "Quality unsatisfied", value: 5 },
                { label: "Website Crashes", value: 28 },
                { label: "Payment Errors", value: 32 },
                { label: "Shipping Delays", value: 20 },
                { label: "Missing Accessories", value: 8 },
                { label: "App Freezes", value: 15 },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={12} lg={12} style={gridItemStyle}>
            <EmotionAnalyzer
              title="Emotion Analyzer"
              subheader="+43% Happy customer than last month"
            />
          </Grid>
          {/* <Grid item xs={12} md={12} lg={6}>
            <AppNewsUpdate
              title="Statements by Sentiments"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chartLabels={[
                "01/01/2003",
                "02/01/2003",
                "03/01/2003",
                "04/01/2003",
                "05/01/2003",
                "06/01/2003",
                "07/01/2003",
                "08/01/2003",
                "09/01/2003",
                "10/01/2003",
                "11/01/2003",
              ]}
              chartData={[
                {
                  name: "Team A",
                  type: "column",
                  fill: "solid",
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: "Team B",
                  type: "area",
                  fill: "gradient",
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                },
                {
                  name: "Team C",
                  type: "line",
                  fill: "solid",
                  data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline
              title="Order Timeline"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: [
                  "1983, orders, $4220",
                  "12 Invoices have been paid",
                  "Order #37745 from September",
                  "New order placed #XF-2356",
                  "New order placed #XF-2346",
                ][index],
                type: `order${index + 1}`,
                time: faker.date.past(),
              }))}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: "FaceBook",
                  value: 323234,
                  icon: (
                    <Iconify
                      icon={"eva:facebook-fill"}
                      color="#1877F2"
                      width={32}
                    />
                  ),
                },
                {
                  name: "Google",
                  value: 341212,
                  icon: (
                    <Iconify
                      icon={"eva:google-fill"}
                      color="#DF3E30"
                      width={32}
                    />
                  ),
                },
                {
                  name: "Linkedin",
                  value: 411213,
                  icon: (
                    <Iconify
                      icon={"eva:linkedin-fill"}
                      color="#006097"
                      width={32}
                    />
                  ),
                },
                {
                  name: "Twitter",
                  value: 443232,
                  icon: (
                    <Iconify
                      icon={"eva:twitter-fill"}
                      color="#1C9CEA"
                      width={32}
                    />
                  ),
                },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: "1", label: "Create FireStone Logo" },
                { id: "2", label: "Add SCSS and JS files if required" },
                { id: "3", label: "Stakeholder Meeting" },
                { id: "4", label: "Scoping & Estimations" },
                { id: "5", label: "Sprint Showcase" },
              ]}
            />
          </Grid> */}
        </Grid>
      </Container>
    </>
  );
}
