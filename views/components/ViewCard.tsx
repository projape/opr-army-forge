import { Accordion, AccordionSummary, AccordionDetails, Card, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import style from "../../styles/Cards.module.css";

interface ViewCardProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export default function ViewCard({ title, children }: ViewCardProps) {
  return (
    <Card elevation={1} className={style.card}>
      <Accordion disableGutters defaultExpanded>
        <AccordionSummary
          className="card-accordion-summary"
          expandIcon={<ExpandMoreIcon />}
          sx={{ pt: 1 }}
        >
          <Typography style={{ fontWeight: 600, textAlign: "center", flex: 1, fontSize: "20px" }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 0 }}>{children}</AccordionDetails>
      </Accordion>
    </Card>
  );
}
