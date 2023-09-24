import PropTypes from "prop-types";
// @mui
import { Card, CardHeader, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

// ----------------------------------------------------------------------

EmotionAnalyzer.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};
const emotions = {
  "😔 Sad": [
    "I am very sad right now.",
    "This situation has left me feeling really down.",
    "Tears welled up in my eyes, and I couldn't hold them back.",
    "The weight of sadness is almost unbearable.",
  ],
  "😠 Angry": [
    "I can't believe how infuriating this situation is.",
    "I'm really angry about what happened.",
    "My blood is boiling with anger.",
    "I just want to scream and let it all out.",
  ],
  "😃 Happy": [
    "I am so happy right now.",
    "This news has made me incredibly joyful.",
    "I can't stop smiling from ear to ear.",
    "My heart is filled with happiness and gratitude.",
  ],
  "🥴 Disgust": [
    "The sight of that made me feel disgusted.",
    "I find the thought of it utterly revolting.",
    "I had to look away in disgust; it was too much to bear.",
    "I feel a queasy sensation in my stomach due to the disgust.",
  ],
  "😐 Neutral": [
    "I don't have strong feelings about this.",
    "I'm in a neutral state of mind at the moment.",
    "I'm neither happy nor sad, just right in the middle.",
    "I'm keeping a balanced perspective on this matter.",
  ],
};

const customStyles = {
  treeItemLabel: {
    padding: "12px 16px", // Adjust padding as needed
    fontSize: "16px", // Adjust font size as needed
    fontWeight: "bold", // Adjust font weight as needed
    color: "#333", // Text color
  },
  statementLabel: {
    padding: "8px 16px", // Adjust padding as needed
    fontSize: "14px", // Adjust font size as needed
    color: "#555", // Text color
  },
  treeItemRoot: {
    "&.Mui-expanded": {
      backgroundColor: "transparent", // Change background color when expanded
      transition: "background-color 0.3s ease", // Add a smooth background color transition
    },
  },
};

export default function EmotionAnalyzer({ title, subheader, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          defaultExpanded={["😔 Sad"]}
          // defaultExpanded={["😔 Sad", "😠 Angry", "😃 Happy", "🥴 Disgust"]}
        >
          {Object.keys(emotions).map((emotion) => (
            <TreeItem
              key={emotion}
              nodeId={emotion}
              label={emotion}
              classes={{
                label: customStyles.treeItemLabel,
                root: customStyles.treeItemRoot,
              }}
            >
              {emotions[emotion].map((statement, index) => (
                <TreeItem
                  key={`${emotion}-${index}`}
                  nodeId={`${emotion}-${index}`}
                  label={statement}
                  classes={{
                    label: customStyles.statementLabel,
                  }}
                />
              ))}
            </TreeItem>
          ))}
        </TreeView>
      </Box>
    </Card>
  );
}
