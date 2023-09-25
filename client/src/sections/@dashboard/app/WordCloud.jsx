import PropTypes from "prop-types";
// @mui
import { useTheme, styled } from "@mui/material/styles";
import { Card, CardHeader } from "@mui/material";
// utils
import WordCloudImg from "../../../../public/assets/images/wordcloud.jpeg";

// import { TagCloud } from "react-tagcloud";

AppCurrentVisits.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartColors: PropTypes.arrayOf(PropTypes.string),
  chartData: PropTypes.array,
};

export default function AppCurrentVisits({ title, subheader, ...other }) {
  const theme = useTheme();

  // const data = [
  //   { value: "Issue", count: 20 },
  //   { value: "Problem", count: 15 },
  //   { value: "Error", count: 18 },
  //   { value: "Support", count: 25 },
  //   { value: "Assistance", count: 12 },
  //   { value: "Help", count: 30 },
  //   { value: "Question", count: 22 },
  //   { value: "Concern", count: 10 },
  //   { value: "Inquiry", count: 8 },
  //   { value: "Technical", count: 17 },
  //   { value: "Troubleshooting", count: 14 },
  //   { value: "Bug", count: 13 },
  //   { value: "Glitch", count: 9 },
  //   { value: "Ticket", count: 7 },
  //   { value: "Resolution", count: 16 },
  //   { value: "Login", count: 11 },
  //   { value: "Account", count: 12 },
  //   { value: "Password", count: 14 },
  //   { value: "Reset", count: 10 },
  //   { value: "Access", count: 15 },
  //   { value: "Outage", count: 6 },
  //   { value: "Confusion", count: 8 },
  //   { value: "Frustration", count: 10 },
  //   { value: "Explanation", count: 9 },
  //   { value: "Clarification", count: 7 },
  //   { value: "Service", count: 28 },
  //   { value: "Complaint", count: 11 },
  //   { value: "Feedback", count: 13 },
  //   { value: "Wait", count: 12 },
  //   { value: "Hold", count: 6 },
  //   { value: "Supervisor", count: 5 },
  //   { value: "Escalation", count: 7 },
  //   { value: "Update", count: 8 },
  //   { value: "Request", count: 14 },
  //   { value: "Waiting time", count: 7 },
  //   { value: "Waiting period", count: 6 },
  //   { value: "Response time", count: 8 },
  //   { value: "Phone call", count: 10 },
  //   { value: "Email", count: 9 },
  //   { value: "Live chat", count: 12 },
  //   { value: "Callback", count: 7 },
  //   { value: "User interface", count: 9 },
  //   { value: "Compatibility", count: 6 },
  //   { value: "Application", count: 10 },
  //   { value: "Installation", count: 11 },
  //   { value: "Activation", count: 8 },
  //   { value: "Billing", count: 14 },
  //   { value: "Payment", count: 12 },
  //   { value: "Refund", count: 9 },
  //   { value: "Satisfaction", count: 15 },
  // ];

  return (
    <Card {...other} sx={{ height: "100%" }}>
      <CardHeader title={title} subheader={subheader} />

      <img
        src={WordCloudImg}
        alt="wordcloud"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
      {/* <TagCloud minSize={10} maxSize={35} tags={data} /> */}
    </Card>
  );
}
